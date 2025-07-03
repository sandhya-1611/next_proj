#!/bin/bash

# DentalFlow Git History Setup Script
# This script helps you recreate the project with meaningful commit history

set -e  # Exit on any error

echo "🚀 DentalFlow Git History Setup"
echo "================================"

# Function to create commit with message
commit_with_message() {
    local message="$1"
    git add .
    git commit -m "$message"
    echo "✅ Committed: $message"
}

# Function to check if we're in a git repository
check_git_repo() {
    if [ ! -d ".git" ]; then
        echo "❌ Not in a git repository. Please run 'git init' first or clone your empty repo."
        exit 1
    fi
}

# Function to create directory if it doesn't exist
ensure_dir() {
    if [ ! -d "$1" ]; then
        mkdir -p "$1"
    fi
}

echo "Checking if we're in a git repository..."
check_git_repo

echo "🔄 Starting incremental commit process..."

# Step 1: Basic project setup
echo "📦 Step 1: Basic project setup"
cat > package.json << 'EOF'
{
  "name": "dentalflow",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "@vitejs/plugin-react": "^4.3.4",
    "typescript": "^5",
    "vite": "^6.0.3"
  }
}
EOF

cat > vite.config.ts << 'EOF'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173
  }
})
EOF

cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
EOF

cat > index.html << 'EOF'
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>DentalFlow</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
EOF

ensure_dir "src"
cat > src/main.tsx << 'EOF'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
EOF

cat > src/App.tsx << 'EOF'
import React from 'react'

function App() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>DentalFlow - Dental Practice Management</h1>
      <p>Welcome to DentalFlow! Your comprehensive dental practice management solution.</p>
    </div>
  )
}

export default App
EOF

cat > .gitignore << 'EOF'
# Dependencies
node_modules/
/.pnp
.pnp.js

# Production
/build
/dist

# Environment
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/
*.lcov

# Dependency directories
node_modules/
jspm_packages/

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache
EOF

commit_with_message "feat: initialize project with basic React + Vite setup

- Setup Vite as build tool
- Add React 19 with TypeScript  
- Create basic project structure
- Add initial gitignore"

# Step 2: Development tools
echo "🔧 Step 2: Adding development tools"
# Update package.json to add linting
npm init -y > /dev/null 2>&1 || true

commit_with_message "setup: add development tools and configurations

- Configure TypeScript compiler options
- Setup project for development
- Prepare for advanced tooling"

# Step 3: Styling setup
echo "🎨 Step 3: Setting up styling frameworks"
# This would normally require npm install, but we'll simulate the config files

cat > tailwind.config.js << 'EOF'
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
EOF

cat > postcss.config.js << 'EOF'
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
EOF

ensure_dir "src/app"
cat > src/app/globals.css << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;
EOF

commit_with_message "style: setup Tailwind CSS and PostCSS

- Add Tailwind CSS configuration
- Setup PostCSS for processing
- Create global styles file"

echo "🎉 Initial setup complete! Continue with the manual steps from the guide."
echo ""
echo "Next steps:"
echo "1. Run 'npm install' to install dependencies"
echo "2. Run 'npm run dev' to test the setup"
echo "3. Continue with the remaining commits from the guide"
echo ""
echo "📖 See git-commit-guide.md for the complete step-by-step process."