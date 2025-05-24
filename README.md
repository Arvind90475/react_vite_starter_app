# React Vite Starter App

A modern React application starter kit with a robust set of features.

## Features

- Built with Vite for lightning-fast development
- TypeScript for type safety
- React 18 with modern hooks
- shadcn-ui components for beautiful UI
- Tailwind CSS for styling
- pnpm for efficient package management
- React Router for navigation
- React Query for data fetching
- Form handling with React Hook Form and Zod validation

## Getting Started

### Prerequisites

- Node.js (v18 or newer)
- pnpm

### Installation

```sh
# Step 1: Clone the repository
git clone https://github.com/yourusername/react_vite_starter_app.git

# Step 2: Navigate to the project directory
cd react_vite_starter_app

# Alternatively: Create a new repository from this template
# Click the "Use this template" button on GitHub to create a new repository based on this starter

# Step 3: Install dependencies
pnpm install

# Step 4: Start the development server
pnpm dev
```

The application will be available at http://localhost:8080

## Available Scripts

- `pnpm dev` - Start the development server
- `pnpm build` - Build for production
- `pnpm build:dev` - Build for development
- `pnpm lint` - Run ESLint
- `pnpm preview` - Preview the production build

## Project Structure

```
src/
├── components/         # UI components
│   ├── layout/         # Layout components
│   ├── routing/        # Routing components
│   └── ui/             # shadcn-ui components
├── hooks/              # Custom React hooks
├── lib/                # Utility libraries
├── pages/              # Page components
├── services/           # API services
└── utils/              # Utility functions
```

## Deployment

Build your project for production:

```sh
pnpm build
```

The build artifacts will be stored in the `dist/` directory, ready to be deployed to your preferred hosting platform.

## Customizing the Starter Kit

This starter kit is designed to be a foundation for your React projects. Here are some customization tips:

1. Update the project name and details in `package.json`
2. Modify the `README.md` to reflect your project
3. Replace favicon and other assets in the `public/` directory
4. Start building your components in the `src/components/` directory
5. Create your application routes in the `src/pages/` directory

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
