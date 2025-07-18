# 🍳 AI-Powered Leftover Meal Recommender

## ✨ Project Description

The AI-Powered Leftover Meal Recommender is an innovative web application designed to help users reduce food waste and inspire creative cooking by generating recipes based on images of their available ingredients. Leveraging Google's cutting-edge Gemini Vision AI, this tool provides a seamless and intuitive way to transform random fridge contents into delicious meal ideas.

Say goodbye to food waste and hello to effortless meal planning!

## 🚀 Live Demo

Experience the app live: https://meal-recommender-beta.vercel.app/

## 🌟 Features

* **Image-Based Ingredient Recognition:** Upload a photo of your fridge or pantry, and the AI will identify key ingredients.
* **AI-Driven Recipe Generation:** Get unique, easy-to-follow recipes tailored to your available items.
* **Cuisine Preference:** Customize your recipe suggestions by selecting a preferred cuisine style (e.g., Indian, Italian, Mexican).
* **Intelligent Ingredient Selection:** The AI prioritizes suitable ingredient combinations for cohesive and appealing meals, avoiding forced or unappetizing pairings.
* **Assumed Pantry Staples:** The model intelligently assumes common kitchen essentials (oils, salt, pepper, basic spices) are available to generate complete recipes.
* **User-Friendly Interface:** Clean and intuitive design for a smooth user experience.
* **Clear & Readable Output:** Recipes are formatted in Markdown and rendered beautifully on the frontend.
* **"Start Over" Functionality:** Easily clear inputs and results to generate new ideas.

## 🛠️ Technologies Used

This project is built using a combination of modern web technologies and powerful AI services:

* **Frontend:**
    * HTML5
    * CSS3
    * JavaScript (Vanilla JS)
    * `marked.js` (for Markdown to HTML conversion)
* **Backend (Serverless Function):**
    * Node.js
    * Vercel Serverless Functions (as a secure proxy)
* **Artificial Intelligence:**
    * Google Gemini API (`gemini-2.5-flash` model for multimodal understanding)
* **Deployment:**
    * Vercel

## ⚙️ Setup and Local Installation

Follow these steps to get a local copy of the project up and running on your machine.

### Prerequisites

* Node.js (v18 or higher recommended)
* npm (Node Package Manager)
* Git
* A Google Gemini API Key (obtainable from [Google AI Studio](https://aistudio.google.com/))

### Steps

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/](https://github.com/)[Your GitHub Username]/[Your Repository Name].git
    cd [Your Repository Name]
    ```

2.  **Install Node.js dependencies:**
    This will install the dependencies for your serverless function.
    ```bash
    npm install
    ```

3.  **Set up Environment Variables:**
    Create a file named `.env` in the root of your project (where `api/` folder is located) and add your Gemini API key:
    ```
    GEMINI_API_KEY=YOUR_GOOGLE_GEMINI_API_KEY
    ```
    **Important:** Replace `YOUR_GOOGLE_GEMINI_API_KEY` with your actual API key. Do NOT commit this file to your public repository. `.env` is typically ignored by Git.

4.  **Run the project locally:**
    You'll use the Vercel CLI to simulate the serverless environment locally.
    ```bash
    npm install -g vercel # Install Vercel CLI globally if you haven't already
    vercel dev
    ```
    This command will start a local development server, usually accessible at `http://localhost:3000`.

## 🚀 Usage

1.  **Access the App:** Open your browser and navigate to the local development URL (`http://localhost:3000`) or the live deployment URL.
2.  **Upload Image:** Click the "📷 Take Photo / Upload Image" button and select an image file (JPG, PNG, WEBP) of your ingredients.
3.  **Choose Cuisine (Optional):** Select your desired cuisine from the "Cuisine Preference" dropdown.
4.  **Get Recipe:** Click the "Get Recipe Ideas" button.
5.  **View Recipe:** The identified ingredients and a suggested recipe will appear below.
6.  **Start Over:** Click the "Start Over" button to clear the current session and generate new ideas.

## 🌐 Deployment

This project is designed for seamless deployment on [Vercel](https://vercel.com/).

1.  **Connect to Vercel:** Log in to your Vercel account (preferably using your GitHub/GitLab/Bitbucket account).
2.  **Import Project:** Import your GitHub repository into Vercel.
3.  **Configure Environment Variables:** During the import process, add your `GEMINI_API_KEY` as an environment variable in Vercel's project settings.
4.  **Deploy:** Vercel will automatically detect your project setup (frontend + Node.js serverless function) and deploy it.
5.  **Continuous Deployment:** Any subsequent pushes to your connected Git branch will automatically trigger a new deployment on Vercel.

## 📂 Project Structure
Here's a README.md file for your GitHub repository, designed to be clear, informative, and easy to read. Remember to replace placeholders like [Your GitHub Username], [Your Repository Name], and [Your Vercel Deployment URL] with your actual information.

Markdown

# 🍳 AI-Powered Leftover Meal Recommender

[![Vercel Deployment Status](https://vercel.com/api/collections/projects/c/meal-recommender-f7j1npcqm-bhaveshs-projects-20482224/status)](https://meal-recommender-f7j1npcqm-bhaveshs-projects-20482224.vercel.app/)

## ✨ Project Description

The AI-Powered Leftover Meal Recommender is an innovative web application designed to help users reduce food waste and inspire creative cooking by generating recipes based on images of their available ingredients. Leveraging Google's cutting-edge Gemini Vision AI, this tool provides a seamless and intuitive way to transform random fridge contents into delicious meal ideas.

Say goodbye to food waste and hello to effortless meal planning!

## 🚀 Live Demo

Experience the app live: [https://meal-recommender-f7j1npcqm-bhaveshs-projects-20482224.vercel.app/](https://meal-recommender-f7j1npcqm-bhaveshs-projects-20482224.vercel.app/)

*(Optional: Replace the above line with a GIF or screenshot of your app in action for a quick visual demo.)*
![App Screenshot Example](https://placehold.co/600x400/cccccc/333333?text=Screenshot+or+GIF+of+App+Here)

## 🌟 Features

* **Image-Based Ingredient Recognition:** Upload a photo of your fridge or pantry, and the AI will identify key ingredients.
* **AI-Driven Recipe Generation:** Get unique, easy-to-follow recipes tailored to your available items.
* **Cuisine Preference:** Customize your recipe suggestions by selecting a preferred cuisine style (e.g., Indian, Italian, Mexican).
* **Intelligent Ingredient Selection:** The AI prioritizes suitable ingredient combinations for cohesive and appealing meals, avoiding forced or unappetizing pairings.
* **Assumed Pantry Staples:** The model intelligently assumes common kitchen essentials (oils, salt, pepper, basic spices) are available to generate complete recipes.
* **User-Friendly Interface:** Clean and intuitive design for a smooth user experience.
* **Clear & Readable Output:** Recipes are formatted in Markdown and rendered beautifully on the frontend.
* **"Start Over" Functionality:** Easily clear inputs and results to generate new ideas.

## 🛠️ Technologies Used

This project is built using a combination of modern web technologies and powerful AI services:

* **Frontend:**
    * HTML5
    * CSS3
    * JavaScript (Vanilla JS)
    * `marked.js` (for Markdown to HTML conversion)
* **Backend (Serverless Function):**
    * Node.js
    * Vercel Serverless Functions (as a secure proxy)
* **Artificial Intelligence:**
    * Google Gemini API (`gemini-2.5-flash` model for multimodal understanding)
* **Deployment:**
    * Vercel

## ⚙️ Setup and Local Installation

Follow these steps to get a local copy of the project up and running on your machine.

### Prerequisites

* Node.js (v18 or higher recommended)
* npm (Node Package Manager)
* Git
* A Google Gemini API Key (obtainable from [Google AI Studio](https://aistudio.google.com/))

### Steps

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/](https://github.com/)[Your GitHub Username]/[Your Repository Name].git
    cd [Your Repository Name]
    ```

2.  **Install Node.js dependencies:**
    This will install the dependencies for your serverless function.
    ```bash
    npm install
    ```

3.  **Set up Environment Variables:**
    Create a file named `.env` in the root of your project (where `api/` folder is located) and add your Gemini API key:
    ```
    GEMINI_API_KEY=YOUR_GOOGLE_GEMINI_API_KEY
    ```
    **Important:** Replace `YOUR_GOOGLE_GEMINI_API_KEY` with your actual API key. Do NOT commit this file to your public repository. `.env` is typically ignored by Git.

4.  **Run the project locally:**
    You'll use the Vercel CLI to simulate the serverless environment locally.
    ```bash
    npm install -g vercel # Install Vercel CLI globally if you haven't already
    vercel dev
    ```
    This command will start a local development server, usually accessible at `http://localhost:3000`.

## 🚀 Usage

1.  **Access the App:** Open your browser and navigate to the local development URL (`http://localhost:3000`) or the live deployment URL.
2.  **Upload Image:** Click the "📷 Take Photo / Upload Image" button and select an image file (JPG, PNG, WEBP) of your ingredients.
3.  **Choose Cuisine (Optional):** Select your desired cuisine from the "Cuisine Preference" dropdown.
4.  **Get Recipe:** Click the "Get Recipe Ideas" button.
5.  **View Recipe:** The identified ingredients and a suggested recipe will appear below.
6.  **Start Over:** Click the "Start Over" button to clear the current session and generate new ideas.

## 🌐 Deployment

This project is designed for seamless deployment on [Vercel](https://vercel.com/).

1.  **Connect to Vercel:** Log in to your Vercel account (preferably using your GitHub/GitLab/Bitbucket account).
2.  **Import Project:** Import your GitHub repository into Vercel.
3.  **Configure Environment Variables:** During the import process, add your `GEMINI_API_KEY` as an environment variable in Vercel's project settings.
4.  **Deploy:** Vercel will automatically detect your project setup (frontend + Node.js serverless function) and deploy it.
5.  **Continuous Deployment:** Any subsequent pushes to your connected Git branch will automatically trigger a new deployment on Vercel.

## 📂 Project Structure
.
├── public/
│   ├── index.html          # Main application HTML
│   ├── style.css           # Styling for the application
│   └── script.js           # Frontend JavaScript logic
├── api/
│   └── gemini-proxy.js     # Node.js serverless function (Gemini API proxy)
├── .env                    # Environment variables (for local development, NOT committed)
├── .gitignore              # Specifies intentionally untracked files to ignore
├── package.json            # Project dependencies and scripts
└── README.md               # This file

## 🤝 Contributing

Contributions are welcome! If you have suggestions for improvements or new features, please feel free to:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/your-feature-name`).
3.  Make your changes.
4.  Commit your changes (`git commit -m 'Add new feature'`).
5.  Push to the branch (`git push origin feature/your-feature-name`).
6.  Open a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📧 Contact

**Tank Bhavesh Rajeshbhai**
* GitHub: https://github.com/Bhaveshtechie

---
