# Orbit

Orbit is an AI-powered routine and schedule management web application that generates personalized routines and intelligently adapts them to changing schedules.

## About Orbit

Orbit is an AI-powered routine and schedule management web application designed to simplify daily planning and improve productivity.

Unlike traditional timetable applications, Orbit doesn't simply display schedules—it understands the user's goals, habits, priorities, and commitments to generate a personalized weekly routine. Users can also modify their schedules using natural language through Orbit Insights, making schedule management more intuitive and flexible.

Orbit is not a chatbot.
Artificial Intelligence is used to understand user information and schedule modification requests, while Orbit's own scheduling engine generates and updates the timetable.

## Features

- Multi-step guided onboarding
- AI-generated personalized weekly timetable
- Intelligent follow-up questions
- Weekly timetable
- Today page
- Habit tracker
- Orbit Insights for natural language schedule adjustments
- Voice input support
- Conflict detection
- Automatic rescheduling of flexible activities
- Export timetable as PDF
- Export timetable as PNG
- Local data storage using LocalStorage

---

## Technology Stack

### Frontend

- React
- Vite
- CSS

### Backend

- Python
- FastAPI

### AI & APIs

- Parser
- Question Engine
- Routine Engine
- Adjustment Engine
- Gemini API (Natural Language Understanding)
- Browser Speech Recognition API

### Storage

- Browser LocalStorage

## Project Structure :
Orbit
│
├── src/                 # React Frontend
├── backend/             # FastAPI Backend
│   ├── app.py
│   ├── parser.py
│   ├── question_engine.py
│   ├── routine_engine.py
│   ├── adjustment_engine.py
│   └── gemini_service.py
│
└── README.md


# React + Vite

#THE WHOLE TEMPLATE CODE HAS BEEN COMMENTED IN MY FILES !! ~Roshan

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
