# ciFood - Restaurant Management System

A modern restaurant management system built with Vue 3, Vite, and Tailwind CSS.

## Features

## Tech Stack

- **Vue 3** - Progressive JavaScript framework
- **Vite** - Next generation frontend tooling
- **Tailwind CSS** - Utility-first CSS framework
- **Pinia** - State management
- **Vue Router 4** - Official router for Vue.js
- **Axios** - HTTP client
- **Font Awesome 6** - Icon library
- **Vue Toastification** - Toast notifications
- **Headless UI** - Unstyled, accessible UI components

## Requirements

- Node.js 16+
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ciFood
```

2. Install dependencies:
```bash
npm install
```

3. Create environment files:
```bash
# Create .env.development
echo "VITE_ROOT_API=your_development_api_url" > .env.development

# Create .env.production
echo "VITE_ROOT_API=your_production_api_url" > .env.production
```

## Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:8080`

## Build

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## Project Structure

```
ciFood/
├── src/
│   ├── api/           # API services
│   ├── assets/        # Static assets
│   ├── components/    # Reusable components
│   ├── composables/   # Vue composables
│   ├── mapper/        # Data mappers
│   ├── router/        # Vue Router configuration
│   ├── store/         # Pinia stores
│   ├── views/         # Page components
│   │   ├── admin/     # Admin views
│   │   ├── staff/     # Staff views
│   │   ├── customer/  # Customer views
│   │   └── common/    # Common views
│   ├── App.vue        # Root component
│   └── main.js        # Application entry point
├── public/            # Public static files
└── index.html         # HTML template
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
