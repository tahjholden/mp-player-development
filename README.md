# Player Development Dashboard

A modern web application for managing player development plans, observations, and coaching.

## Setup

1. Install dependencies:
```bash
pnpm install
```

2. Create a `.env` file in the `dashboard` directory with the following variables:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Replace `your_supabase_url` and `your_supabase_anon_key` with your actual Supabase project credentials.

3. Start the development server:
```bash
pnpm dev
```

## Features

- Dashboard with key metrics
- Player management
- Coach management
- Player Development Plans (PDPs)
- Observations tracking
- Modern UI with Material-UI components

## Tech Stack

- React
- Vite
- Material-UI
- Supabase
- React Router
- date-fns

## Development

The project uses Vite for development and building. Key commands:

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build locally

## Deployment

The application is configured for deployment on Vercel. The build process is handled automatically when pushing to the main branch. 