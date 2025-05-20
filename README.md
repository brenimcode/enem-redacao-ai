# Redator AI: ENEM Essay Correction

This system is a web application for the automated correction of ENEM 2024 essays, using modern technologies for image processing, text analysis, and user authentication. It allows users to upload essay images, which are then processed and evaluated based on the official ENEM scoring criteria.

## Technologies Used

![Python](https://img.shields.io/badge/Python-3776AB?logo=python\&logoColor=white\&style=for-the-badge)
![LangChain](https://img.shields.io/badge/LangChain-%23000000.svg?style=for-the-badge\&logo=langchain\&logoColor=white)
![Gemini](https://img.shields.io/badge/google%20gemini-8E75B2?style=for-the-badge&logo=google%20gemini&logoColor=white)
![Tesseract OCR](https://img.shields.io/badge/Tesseract_OCR-4B8BBE?style=for-the-badge\&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?logo=fastapi\&logoColor=white\&style=for-the-badge)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white&style=for-the-badge)  
![ReactJS](https://img.shields.io/badge/React-20232A?logo=react\&logoColor=61DAFB\&style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white&style=for-the-badge)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white&style=for-the-badge)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=white&style=for-the-badge)

## 📸 Application Screenshots
<p align="center">
  <img src="https://github.com/user-attachments/assets/751fd9f0-1a40-4cc8-8166-699ded9a3763" alt="Home Dashboard">
</p>
<p align="center">
  <img src="https://github.com/user-attachments/assets/e97275a4-a419-491f-aead-09944877f1bc" alt="Essay Evaluation Result">
</p>
<p align="center">
  <img src="https://github.com/user-attachments/assets/6b40011f-0ccf-40da-acbf-d1604b1e029a" alt="Login Screen">
</p>




## System Overview

![System Diagram](https://github.com/brenimcode/enem-redacao-ai/blob/main/fluxo2.png)

The pipeline consists of:

1. **Image Upload:** Students upload a photo of their essay via the ReactJS frontend.
2. **Preprocessing & OCR:** FastAPI backend preprocesses the image (deskew, denoise, threshold) and extracts text using Tesseract OCR.
3. **Text Evaluation:** Extracted text is fed into a LangChain pipeline that uses Gemini to assess grammar, coherence, and structure.
4. **Feedback Generation:** Gemini returns structured feedback including scores, comments, and improvement tips.
5. **Response Delivery:** FastAPI sends the formatted results back to the ReactJS interface for display.

This architecture ensures **robust OCR**, **context-aware analysis**, and **scalable performance** through containerization.


## Core Features

#### 1. **User Authentication and Registration**

* The system provides user login and registration, using **Bearer Token authentication**.
* User credentials are stored in a **PostgreSQL** database, with passwords securely hashed using **bcrypt**.
* Authentication is managed with **FastAPI OAuth2**, and access tokens are generated via **JSON Web Tokens (JWT)**.
* **Pydantic** is used for data validation and type enforcement.


#### 2. **Essay Submission and Processing**

* Users can upload essay images in **JPG** or **PNG** formats.
* The system validates both file type and size (maximum of 5MB).
* Image validation is performed using **Pillow**, ensuring only valid files are processed.


#### 3. **Optical Character Recognition (OCR)**

* Uploaded images are processed to extract text using **Tesseract OCR**, with support for the Portuguese language.
* Image pre-processing is handled with **OpenCV**, applying techniques such as grayscale conversion and thresholding to improve OCR accuracy.


#### 4. **Text Analysis via LLM**

* Extracted text is analyzed by a **Google Generative AI (Gemini 2.0)** language model, integrated via **LangChain**.
* The model evaluates the essay according to the official ENEM criteria and returns a JSON containing:

  * General feedback on the essay.
  * Individual scores for the five ENEM competencies.
  * **Total Score**: the sum of all competency scores.
* **Prompt engineering techniques** are applied to improve the model’s accuracy and response consistency.

#### 5. **Request Rate Limiting**

* To prevent abuse, the system enforces request limits per user via **SlowAPI**:

  * Maximum of 5 requests per minute.
  * Maximum of 100 requests per hour.
  * Maximum of 500 requests per day.

#### 6. **Correction Results Interface**

* The system displays essay correction results in a user-friendly interface, showing:

  * Individual scores for each competency.
  * Automatically calculated total score.
  * General comments about the essay.

## Requirements

- **Python** ≥ 3.11  
- **Node.js** ≥ 18  
- **PostgreSQL** ≥ 14  
- **Tesseract OCR** ≥ 5.0  

---

## Installing Dependencies

### 1. Clone the Repository

```bash
git clone https://github.com/brenimcode/enem-redacao-ai
cd enem-redacao-ai
````

---

## 2. Backend Setup

### 2.1 Create and Activate a Virtual Environment

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 2.2 Install Python Dependencies

```bash
pip install -r requirements.txt
```

### 2.3 Configure the `.env` File

Create a `.env` file inside the `back-end` folder with the following content:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/database_name
JWT_SECRET_KEY=your_secret_key
```

> **Note:** Replace the values above with your actual environment details.

### 2.4 Initialize the Database

Make sure PostgreSQL is running and execute the database script to create the tables:

```bash
python create_tables.py
```

---

## 3. Frontend Setup

### 3.1 Install Node.js Dependencies

```bash
cd frontend
npm install
```

### 3.2 Start the Frontend Development Server

```bash
npm run dev
```

---

## 4. Running the Backend

Start the FastAPI server:

```bash
uvicorn main:app --reload
```

---

## System Endpoints

* **Backend**: [http://localhost:8000](http://localhost:8000)
* **Frontend**: [http://localhost:5173](http://localhost:8080)



