# Redator AI: ENEM Essay Correction

This SaaS application leverages **Optical Character Recognition (OCR)** and **Large Language Models (LLMs)** to provide **automated, accurate, and insightful feedback** on ENEM and university entrance exam essays. By combining **Tesseract OCR** for text extraction and **LangChain** with **Gemini** for evaluation, it delivers a seamless correction pipeline.

## Technologies Used

![Python](https://img.shields.io/badge/Python-3776AB?logo=python\&logoColor=white\&style=for-the-badge)
![LangChain](https://img.shields.io/badge/LangChain-%23000000.svg?style=for-the-badge\&logo=langchain\&logoColor=white)
![Gemini](https://img.shields.io/badge/google%20gemini-8E75B2?style=for-the-badge&logo=google%20gemini&logoColor=white)
![Tesseract OCR](https://img.shields.io/badge/Tesseract_OCR-4B8BBE?style=for-the-badge\&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?logo=fastapi\&logoColor=white\&style=for-the-badge)
![ReactJS](https://img.shields.io/badge/React-20232A?logo=react\&logoColor=61DAFB\&style=for-the-badge)

## System Overview

![System Diagram](https://github.com/brenimcode/enem-redacao-ai/blob/main/fluxo2.png)

The pipeline consists of:

1. **Image Upload:** Students upload a photo of their essay via the ReactJS frontend.
2. **Preprocessing & OCR:** FastAPI backend preprocesses the image (deskew, denoise, threshold) and extracts text using Tesseract OCR.
3. **Text Evaluation:** Extracted text is fed into a LangChain pipeline that uses Gemini to assess grammar, coherence, and structure.
4. **Feedback Generation:** Gemini returns structured feedback including scores, comments, and improvement tips.
5. **Response Delivery:** FastAPI sends the formatted results back to the ReactJS interface for display.

This architecture ensures **robust OCR**, **context-aware analysis**, and **scalable performance** through containerization.

## Key Features:

* **User Authentication with JWT (Bearer Token)**:
  Secure login and registration system using JSON Web Tokens for protected routes and session management.

* **Login & Registration Interface**:
  Frontend interface for users to create an account and authenticate securely.

* **AI Essay Correction Interface**:
  A dedicated screen where users can upload images (photos of handwritten essays), which are processed through an OCR module (**Tesseract**) and evaluated by an AI model, returning an estimated score and feedback.

## Requirements

* **Python** ≥ 3.10
* **Node.js** ≥ 14

## Installing Dependencies

1. Clone the repository:

   ```bash
   git clone https://github.com/brenimcode/enem-redacao-ai.git
   cd enem-redacao-ai
   ```
2. Create and activate a virtual environment:

   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\\Scripts\\activate
   ```
3. Install Python dependencies:

   ```bash
   pip install -r requirements.txt
   ```
4. Install Node.js dependencies for the frontend:

   ```bash
   cd frontend
   npm install
   npm run
   ```

* Backend: `http://localhost:8000`
* Frontend: `http://localhost:3000`
