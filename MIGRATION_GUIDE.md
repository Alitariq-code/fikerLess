# Migration Guide: Node.js to React

This guide explains what was changed and how to complete the migration.

## ✅ What's Been Done

1. **Created React App Structure**
   - Set up Vite as the build tool
   - Created React components structure
   - Set up React Router for navigation

2. **Converted Pages**
   - `HomePage.jsx` - Basic structure (needs content from `views/index.html`)
   - `AdminLogin.jsx` - Admin login page
   - `AdminDashboard.jsx` - Admin dashboard

3. **API Service**
   - Created `src/services/api.js` with Axios
   - Configured to connect to NestJS backend at `https://fikrless.com/api/v1`
   - Includes authentication token handling

4. **Styling**
   - Moved CSS to `src/styles/index.css`
   - Preserved all animations and styles

## 📋 Next Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Complete HomePage Component
The `HomePage.jsx` currently has a basic structure. You need to:
- Copy the HTML content from `views/index.html` (after the `<style>` tag)
- Convert it to JSX
- Break it into smaller components if needed

### 3. Connect to Backend
Update the components to use the API service:

**Example in HomePage.jsx:**
```javascript
import { useState, useEffect } from 'react'
import api from '../services/api'

function HomePage() {
  const [internships, setInternships] = useState([])

  useEffect(() => {
    const fetchInternships = async () => {
      try {
        const response = await api.get('/internships') // Adjust endpoint
        setInternships(response.data)
      } catch (error) {
        console.error('Error fetching internships:', error)
      }
    }
    fetchInternships()
  }, [])

  // ... rest of component
}
```

### 4. Update Admin Login
Connect to your NestJS auth endpoint:

```javascript
const handleSubmit = async (e) => {
  e.preventDefault()
  try {
    const response = await api.post('/auth/login', { email, password })
    localStorage.setItem('token', response.data.token)
    navigate('/admin')
  } catch (error) {
    setError(error.response?.data?.message || 'Login failed')
  }
}
```

### 5. Test the Application
```bash
npm run dev
```

Visit `http://localhost:3000` to see your React app.

## 🗂️ File Structure Changes

### New Structure
```
fikerLess/
├── src/                    # React source code
│   ├── components/         # Reusable components
│   ├── pages/              # Page components
│   ├── services/           # API services
│   └── styles/             # CSS files
├── public/                 # Static assets (images, etc.)
├── index.html              # HTML template
├── vite.config.js          # Vite config
└── package.json            # React dependencies
```

### Old Files (Can be removed after migration)
- `server.js` - Old Express server
- `routes/` - Old Express routes
- `controllers/` - Old controllers
- `models/` - Old models
- `middleware/` - Old middleware
- `config/` - Old config
- `utils/` - Old utilities
- `data/` - Old data files
- `views/` - Old HTML views (keep for reference)

## 🔧 Configuration

### Environment Variables
Create `.env` file:
```
VITE_API_BASE_URL=https://fikrless.com/api/v1
```

### Vite Configuration
The `vite.config.js` is set to:
- Run dev server on port 3000
- Build output to `dist/` folder

## 📝 Notes

- The old Node.js server files are still in the directory but won't be used
- Static assets (images) are already in `public/` folder
- All styles from the original HTML are preserved in `src/styles/index.css`
- The API service is ready to connect to your NestJS backend

## 🚀 Deployment

After building:
```bash
npm run build
```

Serve the `dist/` folder with any static file server (nginx, Apache, etc.) or deploy to:
- Vercel
- Netlify
- AWS S3 + CloudFront
- Any static hosting service

