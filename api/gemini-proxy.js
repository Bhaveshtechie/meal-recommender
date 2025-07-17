// For Netlify Functions or Vercel Functions (Node.js runtime)
// Note: Vercel functions might automatically have fetch available.
// For Netlify, or older Node versions, you might need:
// const fetch = require('node-fetch'); 

module.exports = async (req, res) => {
    // --- 1. CORS Headers (Crucial for Frontend Communication) ---
    // These headers tell the browser that your frontend (even on a different domain)
    // is allowed to make requests to this function.
    res.setHeader('Access-Control-Allow-Origin', '*'); // **IMPORTANT:** For production, replace '*' with your specific frontend domain (e.g., 'https://your-app.netlify.app')
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle pre-flight OPTIONS request (browsers send this before POST requests)
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Only allow POST requests for the actual API call
    if (req.method !== 'POST') {
        return res.status(405).send('Method Not Allowed');
    }

    try {
        // --- 2. Extract Data from Frontend Request ---
        // Serverless functions receive the frontend's POST request body.
        // Parse it to get the base64Image.
        const { base64Image } = req.body; 

        if (!base64Image) {
            return res.status(400).json({ error: 'Missing base64Image in request body.' });
        }

        // --- 3. Securely Access API Key from Environment Variables ---
        // This is the core security feature! The key is NOT in your code here.
        const GEMINI_API_KEY = process.env.GEMINI_API_KEY; 
        if (!GEMINI_API_KEY) {
            console.error('GEMINI_API_KEY environment variable not set.');
            return res.status(500).json({ error: 'Server configuration error: API key missing.' });
        }

        const modelId = 'gemini-pro-vision'; // The chosen Gemini model

        // --- 4. Prepare and Send Request to Gemini API ---
        const visionPrompt = [
            {
                "text": "Identify the main ingredients in this image and list them. For example, 'chicken, rice, broccoli'. Then, suggest a simple, easy-to-cook meal recipe using these ingredients. Focus on common cooking methods and clear, concise steps. Also, include 1-2 practical tips for preparing this meal. Format your response clearly with a 'Ingredients:' section followed by a bulleted list, and then a 'Recipe:' section, and finally a 'Tips:' section."
            },
            {
                "inlineData": {
                    "mimeType": "image/jpeg", // Assuming JPEG. Ideally, you'd send this from the frontend too.
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

        // --- 5. Handle Gemini API Response and Errors ---
        if (!geminiResponse.ok) {
            const errorData = await geminiResponse.json();
            console.error('Gemini API Error:', errorData);
            // Forward the error status and message back to the frontend
            return res.status(geminiResponse.status).json({ 
                error: `Gemini API error: ${errorData.error ? errorData.error.message : 'Unknown error'}` 
            });
        }

        const geminiData = await geminiResponse.json();

        // --- 6. Send Gemini's Response Back to Frontend ---
        res.status(200).json(geminiData); 

    } catch (error) {
        console.error('Serverless Function Error:', error);
        res.status(500).json({ error: 'Internal server error: ' + error.message });
    }
};