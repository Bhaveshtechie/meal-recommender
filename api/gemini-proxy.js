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
        const { base64Image } = req.body; 

        if (!base64Image) {
            return res.status(400).json({ error: 'Missing base64Image in request body.' });
        }

        const GEMINI_API_KEY = process.env.GEMINI_API_KEY; 
        if (!GEMINI_API_KEY) {
            console.error('GEMINI_API_KEY environment variable not set.');
            return res.status(500).json({ error: 'Server configuration error: API key missing.' });
        }

        const modelId = 'gemini-2.5-flash';

        const visionPrompt = [
            {
                "text": "Identify the main ingredients in this image and list them. For example, 'chicken, rice, broccoli'. Then, suggest a simple, easy-to-cook meal recipe using these ingredients. Focus on common cooking methods and clear, concise steps. Also, include 1-2 practical tips for preparing this meal. Format your response clearly with a 'Ingredients:' section followed by a bulleted list, and then a 'Recipe:' section, and finally a 'Tips:' section."
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