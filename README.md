# FikrLess React Frontend

React frontend application for FikrLess, built with Vite and React Router.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file (optional, for custom API URL):
```bash
cp .env.example .env
```

Edit `.env` and set your NestJS backend URL:
```
VITE_API_BASE_URL=https://fikrless.com/api/v1
```

### Development

Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Build for Production

Build the production bundle:
```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

Preview the production build:
```bash
npm run preview
```

## 📁 Project Structure

```
fikerLess/
├── src/
│   ├── components/      # Reusable React components
│   ├── pages/          # Page components
│   │   ├── HomePage.jsx
│   │   ├── AdminLogin.jsx
│   │   └── AdminDashboard.jsx
│   ├── services/       # API services
│   │   └── api.js      # Axios instance for backend API
│   ├── styles/         # CSS styles
│   │   └── index.css
│   ├── App.jsx         # Main app component with routing
│   └── main.jsx        # React entry point
├── public/             # Static assets (images, etc.)
├── index.html          # HTML template
├── vite.config.js     # Vite configuration
└── package.json
```

## 🔌 Connecting to NestJS Backend

The API service is configured in `src/services/api.js`. It's set to connect to:
- Default: `https://fikrless.com/api/v1`
- Or set `VITE_API_BASE_URL` in `.env`

### API Endpoints

Update the components to use the API service:

```javascript
import api from '../services/api'

// Example: Fetch data
const response = await api.get('/endpoint')
```

## 🛣️ Routes

- `/` - Home page
- `/admin/login` - Admin login page
- `/admin` - Admin dashboard (protected)

## 📝 Next Steps

1. **Expand HomePage**: Copy content from `views/index.html` to `src/pages/HomePage.jsx`
2. **Connect API**: Update components to fetch data from NestJS backend
3. **Add Authentication**: Implement proper auth flow with backend
4. **Add More Pages**: Create additional pages as needed

## 🗑️ Old Files

The following directories are from the old Node.js setup and can be removed after migration:
- `server.js`
- `routes/`
- `controllers/`
- `models/`
- `middleware/`
- `config/`
- `utils/`
- `data/`
- `views/` (keep for reference while migrating)

## 📦 Dependencies

- **React 18** - UI library
- **React Router 6** - Routing
- **Vite** - Build tool and dev server
- **Axios** - HTTP client for API calls

## 🎨 Styling

The app uses:
- Tailwind CSS (via CDN)
- Custom CSS in `src/styles/index.css`
- Font Awesome icons (via CDN)
