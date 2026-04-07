# Smart Crop Advisory System for Small and Marginal Farmers

[![Python](https://img.shields.io/badge/Python-3.11-blue)](https://www.python.org/) [![React](https://img.shields.io/badge/React-17-blue)](https://reactjs.org/)

## Project Overview
This project is a **Smart Crop Advisory System** designed to help small and marginal farmers make informed decisions about crops.  
It combines **machine learning models** in the backend with a **React-based frontend**, including a chatbot interface.

```
app1/
├── backend/
├── frontend1/
│   └── FarmerChatBot/
├── requirements.txt
├── package.json
├── .gitignore
└── README.md
```

## Features
- Crop prediction using ML models  
- Interactive chatbot for farmers  
- Web frontend using React  
- Backend API integration  

## Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/ChethanaSB/app1.git
cd app1

### 2. Backend Setup
python -m venv venv          # Create virtual environment
# Activate virtual environment
# Windows
venv\Scripts\activate
pip install -r requirements.txt  # Install dependencies
cd backend
python app.py                    # Run backend server

### 3. Frontend Setup
cd frontend1
npm install        # Install frontend dependencies
npm start          # Run in development mode
# Open http://localhost:3000 in your browser
npm run build      # Builds the app for production
