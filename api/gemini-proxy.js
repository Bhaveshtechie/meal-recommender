// gemini-proxy.js (for Netlify Functions or Vercel Functions)

// Make sure 'node-fetch' is installed if you're using an older Node.js version
// or if your serverless environment doesn't provide `fetch` globally.
// const fetch = require('node-fetch'); // Uncomment if needed

module.exports = async (req, res) => {
    // --- 1. CORS Headers (Crucial for Frontend Communication) ---
    // These headers must be present on ALL responses, including OPTIONS.
    res.setHeader('Access-Control-Allow-Origin', '*'); // **IMPORTANT: For production, replace '*' with your deployed frontend domain (e.g., 'https://your-app.netlify.app')**
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS'); // Explicitly allow POST and OPTIONS
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); // Allow the Content-Type header
    res.setHeader('Access-Control-Max-Age', '86400'); // Cache preflight response for 24 hours

    // --- 2. Handle Pre-flight OPTIONS Request ---
    // Browsers send this first for "non-simple" requests (like POST with JSON)
    if (req.method === 'OPTIONS') {
        // Just send a 200 OK status for the preflight and end the response.
        res.status(200).end(); 
        return; // Important: terminate execution here
    }

    // --- 3. Only allow POST requests for the actual API call ---
    if (req.method !== 'POST') {
        return res.status(405).send('Method Not Allowed');
    }

    // --- From here, the code assumes it's a POST request ---
    try {
        const { base64Image, cuisine } = req.body; // Destructure cuisine from req.body 

        if (!base64Image) {
            return res.status(400).json({ error: 'Missing base64Image in request body.' });
        }

        const GEMINI_API_KEY = process.env.GEMINI_API_KEY; 
        if (!GEMINI_API_KEY) {
            console.error('GEMINI_API_KEY environment variable not set.');
            return res.status(500).json({ error: 'Server configuration error: API key missing.' });
        }

        const modelId = 'gemini-2.5-flash';

        // Construct the recipe generation instruction based on cuisine
        let recipeInstruction = "Based on a reasonable selection of the identified ingredients (use as many as possible that make sense for a cohesive and appealing meal, but do not force unsuitable combinations), provide a simple, easy-to-cook meal recipe.";
        
        if (cuisine && cuisine !== "Any") {
            recipeInstruction = `Based on a reasonable selection of the identified ingredients (use as many as possible that make sense for a cohesive and appealing meal, but do not force unsuitable combinations), provide a simple, easy-to-cook **${cuisine}** style meal recipe.`;
        }

        const visionPrompt = [
            {
                "text": `Carefully analyze the image to identify all prominent food ingredients. Focus on individual food items. List them clearly under an 'Identified Ingredients:' heading using bullet points. If no food items are clearly visible, state 'No specific ingredients identified.'

                **ASSUMED ESSENTIALS:** Assume common kitchen essentials are available (cooking oils, salt, black pepper, basic spices like garlic powder/onion powder/red chili powder, and water/broth).

                **RECIPE GENERATION:** ${recipeInstruction} Present the recipe under a 'Recipe:' heading with detailed steps, yield, prep time, and cook time. If a truly suitable recipe cannot be created even with assumed essentials, explicitly state 'No suitable recipe can be created from the provided ingredients.' under the 'Recipe:' heading.

                Finally, include 1-2 practical cooking tips under a 'Tips:' heading. Ensure consistent formatting using Markdown for headings, bolding, and bullet points.`
            },
            {
                "inlineData": {
                    "mimeType": "image/jpeg", // Consider dynamically setting this based on frontend input if you handle different image types
                    "data": base64Image
                }
            }
        ];

        const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{ parts: visionPrompt }]
            })
        });

        if (!geminiResponse.ok) {
            const errorData = await geminiResponse.json();
            console.error('Gemini API Error:', errorData);
            return res.status(geminiResponse.status).json({ 
                error: `Gemini API error: ${errorData.error ? errorData.error.message : 'Unknown error'}` 
            });
        }

        const geminiData = await geminiResponse.json();
        res.status(200).json(geminiData); 

    } catch (error) {
        console.error('Serverless Function Error:', error);
        res.status(500).json({ error: 'Internal server error: ' + error.message });
    }
};