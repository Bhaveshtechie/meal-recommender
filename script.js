const imageUpload = document.getElementById('imageUpload');
const imagePreview = document.getElementById('imagePreview');
const getRecipeButton = document.getElementById('getRecipeButton');
const ingredientList = document.getElementById('ingredientList');
const recipeOutput = document.getElementById('recipeOutput');
const loadingIndicator = document.getElementById('loadingIndicator');
const errorDisplay = document.getElementById('errorDisplay');
const ingredientsHeading = document.getElementById('ingredientsHeading');
const recipeHeading = document.getElementById('recipeHeading');
const cuisineSelect = document.getElementById('cuisineSelect');

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
    // IMPORTANT: Use innerHTML for recipeOutput because marked.parse returns HTML
    recipeOutput.innerHTML = ''; // Changed from .textContent
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
        cuisineSelect.style.display = 'none';

        const reader = new FileReader();
        reader.onload = function(e) {
            imagePreview.src = e.target.result;
            imagePreview.style.display = 'block';
            // Get only the Base64 part (remove "data:image/jpeg;base64," prefix)
            base64Image = e.target.result.split(',')[1]; 
            getRecipeButton.style.display = 'block'; // Show button once image is loaded
            cuisineSelect.style.display = 'block'; // Show cuisine select
        };
        reader.onerror = function() {
            showError('Failed to read image file.');
            imagePreview.style.display = 'none';
            base64Image = '';
            cuisineSelect.style.display = 'none'; // Hide cuisine select on error
        };
        reader.readAsDataURL(file);
    } else {
        imagePreview.style.display = 'none';
        getRecipeButton.style.display = 'none';
        base64Image = '';
        cuisineSelect.style.display = 'none'; // Hide cuisine select if no file
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
        const functionEndpoint = '/api/gemini-proxy'; 
        const selectedCuisine = cuisineSelect.value; // Get selected cuisine

        const proxyResponse = await fetch(functionEndpoint, { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ base64Image: base64Image, cuisine: selectedCuisine })  // Send the image data to your function
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

            // --- IMPROVED PARSING AND MARKDOWN RENDERING ---
            // The goal is to get the full Markdown content and let 'marked' render it.
            // We'll still extract ingredients for the list, but render the rest.

            // Optional: Remove "Could not generate..." if it still appears despite prompt
            if (generatedContent.includes("Could not generate a clear recipe based on ingredients.")) {
                generatedContent = generatedContent.replace("Could not generate a clear recipe based on ingredients.", "").trim();
            }

            // Extract ingredients for the bulleted list (still needed for `ingredientList`)
            const ingredientsMatch = generatedContent.match(/Identified Ingredients:\s*\n([\s\S]*?)(?=(Recipe:|$))/i);
            if (ingredientsMatch && ingredientsMatch[1]) {
                const rawIngredients = ingredientsMatch[1].trim().split('\n').filter(Boolean);
                // Clean up leading asterisks/dashes from ingredient lines for the ul
                ingredientList.innerHTML = rawIngredients.map(item => `<li>${item.replace(/^[\*\-]\s*/, '').trim()}</li>`).join('');
            } else {
                ingredientList.innerHTML = '<li>No specific ingredients identified.</li>';
            }

            // Remove the "Identified Ingredients:" section from the content to be parsed by Marked,
            // as we already handled it separately for the ingredientList.
            let contentForMarked = generatedContent.replace(/Identified Ingredients:[\s\S]*?(?=(Recipe:|$))/i, '').trim();

            // Convert the remaining Markdown content to HTML
            // This is the core change: use marked.parse() and innerHTML
            recipeOutput.innerHTML = marked.parse(contentForMarked);

            showResults(); // Ensure headings are visible
            
            // Optional: Hide the ingredient list if no ingredients were found by the regex
            if (!ingredientsMatch || !ingredientsMatch[1].trim()) {
                ingredientsHeading.style.display = 'none';
            }


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