# Food Preference Chooser

## Environment setup

### Frontend

1. Copy `.env.example` to `.env` (already created in this project).
2. Set the backend URL:

```env
VITE_API_BASE_URL=http://localhost:3001
```

### Backend (TypeScript server)

Put your Gemini key in `backend/.env` (create it from `backend/.env.example`):

```env
GEMINI_API_KEY=your_real_key_here
PORT=3001
```

Do not put `GEMINI_API_KEY` in any `VITE_*` variable or frontend file.

## Run frontend

```bash
npm install
npm run dev
```
