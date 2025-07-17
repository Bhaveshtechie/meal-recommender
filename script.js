const imageUpload = document.getElementById('imageUpload');
const imagePreview = document.getElementById('imagePreview');
const getRecipeButton = document.getElementById('getRecipeButton');
const ingredientList = document.getElementById('ingredientList');
const recipeOutput = document.getElementById('recipeOutput');
const loadingIndicator = document.getElementById('loadingIndicator');
const errorDisplay = document.getElementById('errorDisplay');
const ingredientsHeading = document.getElementById('ingredientsHeading');
const recipeHeading = document.getElementById('recipeHeading');

let base64Image = ''; // To store the Base64 representation of the image

// --- Utility Functions ---

function showLoading() {
    loadingIndicator.style.display = 'block';
    getRecipeButton.disabled = true; // Disable button while loading
    getRecipeButton.textContent = 'Processing...';
    hideResults();
    hideError();
}

function hideLoading() {
    loadingIndicator.style.display = 'none';
    getRecipeButton.disabled = false;
    getRecipeButton.textContent = 'Get Recipe Ideas';
}

function showResults() {
    ingredientsHeading.style.display = 'block';
    recipeHeading.style.display = 'block';
}

function hideResults() {
    ingredientList.innerHTML = '';
    recipeOutput.textContent = '';
    ingredientsHeading.style.display = 'none';
    recipeHeading.style.display = 'none';
}

function showError(message) {
    errorDisplay.textContent = message;
    errorDisplay.style.display = 'block';
}

function hideError() {
    errorDisplay.style.display = 'none';
    errorDisplay.textContent = '';
}

// --- Event Listeners ---

imageUpload.addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        hideError(); // Clear previous errors
        hideResults(); // Clear previous results
        getRecipeButton.style.display = 'none'; // Hide button initially

        const reader = new FileReader();
        reader.onload = function(e) {
            imagePreview.src = e.target.result;
            imagePreview.style.display = 'block';
            // Get only the Base64 part (remove "data:image/jpeg;base64," prefix)
            base64Image = e.target.result.split(',')[1]; 
            getRecipeButton.style.display = 'block'; // Show button once image is loaded
        };
        reader.onerror = function() {
            showError('Failed to read image file.');
            imagePreview.style.display = 'none';
            base64Image = '';
        };
        reader.readAsDataURL(file);
    } else {
        imagePreview.style.display = 'none';
        getRecipeButton.style.display = 'none';
        base64Image = '';
        hideResults();
        hideError();
    }
});

getRecipeButton.addEventListener('click', async function() {
    if (!base64Image) {
        showError('Please upload an image first!');
        return;
    }

    showLoading(); // Show spinner and disable button

    try {
    // --- Call Your Serverless Function (instead of direct Gemini API) ---
    // The URL for your function depends on the hosting platform and folder structure:
    // For Netlify Functions in 'netlify/functions/gemini-proxy.js', URL is typically '/.netlify/functions/gemini-proxy'
    // For Vercel Functions in 'api/gemini-proxy.js', URL is typically '/api/gemini-proxy'
    const functionEndpoint = '/api/gemini-proxy'; // Adjust if using Netlify: '/.netlify/functions/gemini-proxy'

    const proxyResponse = await fetch(functionEndpoint, { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ base64Image: base64Image }) // Send the image data to your function
    });

    if (!proxyResponse.ok) {
        const errorData = await proxyResponse.json();
        throw new Error(errorData.error || `Proxy error: ${proxyResponse.statusText}`);
    }

    const geminiData = await proxyResponse.json();
    console.log("Gemini Data from Proxy:", geminiData); // For debugging

    let generatedContent = '';
    if (geminiData.candidates && geminiData.candidates[0] && geminiData.candidates[0].content && geminiData.candidates[0].content.parts[0]) {
        generatedContent = geminiData.candidates[0].content.parts[0].text;

        // --- Parse the generated content into ingredients and recipe ---
        // (Keep this parsing logic as it is, assuming Gemini's output format is consistent)
        const ingredientsMatch = generatedContent.match(/Ingredients:\s*\n([\s\S]*?)(?=(Recipe:|$))/i);
        const recipeMatch = generatedContent.match(/Recipe:\s*\n([\s\S]*?)(?=(Tips:|$))/i);
        const tipsMatch = generatedContent.match(/Tips:\s*\n([\s\S]*)/i);

        if (ingredientsMatch && ingredientsMatch[1]) {
            const rawIngredients = ingredientsMatch[1].trim().split('\n').filter(Boolean);
            ingredientList.innerHTML = rawIngredients.map(item => `<li>${item.replace(/^- /, '')}</li>`).join('');
        } else {
            ingredientList.innerHTML = '<li>No specific ingredients identified.</li>';
        }

        let recipeText = '';
        if (recipeMatch && recipeMatch[1]) {
            recipeText += recipeMatch[1].trim();
        } else {
            recipeText += 'Could not generate a clear recipe based on ingredients.';
        }

        if (tipsMatch && tipsMatch[1]) {
            recipeText += '\n\n**Tips:**\n' + tipsMatch[1].trim();
        }

        recipeOutput.textContent = recipeText;

        showResults();
    } else {
        showError('Gemini did not return a valid response from the proxy.');
    }

    } catch (error) {
        console.error('Frontend Fetch Error:', error);
        showError(`An error occurred: ${error.message}. Please try again.`);
        hideResults();
    } finally {
        hideLoading(); // Hide spinner regardless of success or failure
    }
});