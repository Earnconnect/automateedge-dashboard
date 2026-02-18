# AutomateEdge Operations Dashboard

A comprehensive operations dashboard for AutomateEdge — tracking revenue, clients, tasks, token usage, workflows, and financials all in one place.

## Features

✅ **Overview Dashboard** — Real-time snapshot of MRR, active clients, token spend, profit margins
✅ **Tasks & Projects** — Track project status, priorities, and deadlines
✅ **Clients Management** — Monitor active clients, MRR per client, health scores, and pipeline
✅ **Financial Tracking** — Revenue, expenses, profit margins, tax preparation summaries
✅ **Token & API Usage** — Monitor OpenAI, Claude, and AssemblyAI costs with daily/monthly projections
✅ **Workflows** — n8n pipeline status, success rates, and performance metrics
✅ **Dark Mode** — Built-in dark/light mode toggle for comfortable viewing

## Tech Stack

- **Frontend:** React + Vite (fast builds, optimized performance)
- **Styling:** Tailwind CSS (modern, responsive design)
- **Charts:** Recharts (interactive data visualization)
- **Icons:** Lucide React (clean, modern icon set)

## Setup & Installation

### Prerequisites
- Node.js 16+ and npm/yarn

### Installation

```bash
# Clone the repo
git clone https://github.com/your-github/automateedge-dashboard.git
cd automateedge-dashboard

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The dashboard will be available at `http://localhost:5173` by default.

## Project Structure

```
automateedge-dashboard/
├── src/
│   ├── components/
│   │   ├── Dashboard.jsx       # Main dashboard router
│   │   ├── Sidebar.jsx         # Navigation sidebar
│   │   └── tabs/
│   │       ├── Overview.jsx    # Revenue & business overview
│   │       ├── Tasks.jsx       # Task management
│   │       ├── Clients.jsx     # Client tracking
│   │       ├── Financial.jsx   # Financial & tax prep
│   │       ├── Tokens.jsx      # API cost tracking
│   │       └── Workflows.jsx   # n8n pipeline status
│   ├── App.jsx                 # Main app component
│   ├── main.jsx                # React entry point
│   └── index.css               # Global styles
├── index.html                  # HTML template
├── vite.config.js              # Vite configuration
├── tailwind.config.js          # Tailwind configuration
└── package.json                # Dependencies & scripts
```

## Data Sources & Integration

Currently, the dashboard uses **sample/hardcoded data**. To connect to real data sources:

### Option 1: Supabase (Recommended)
```javascript
// Install Supabase client
npm install @supabase/supabase-js

// Create .env.local with your Supabase credentials
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Option 2: n8n Webhooks
Connect dashboard to n8n workflows for real-time data updates:
```javascript
// Example: Fetch tasks from n8n webhook
const response = await fetch('https://your-n8n-instance.com/webhook/tasks')
```

### Option 3: REST API
Configure API endpoints in each component to fetch live data from your backend.

## Deployment

### Netlify (Recommended)

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build the project
npm run build

# Deploy
netlify deploy --prod
```

Or connect your GitHub repo to Netlify for automatic deployments on every push.

### Vercel

```bash
npm install -g vercel
vercel
```

### GitHub Pages

Update `vite.config.js`:
```javascript
export default {
  base: '/automateedge-dashboard/',
  // ... rest of config
}
```

## Customization

### Update Branding
Edit `src/components/Sidebar.jsx`:
```javascript
<h1 className="text-2xl font-bold text-gray-900 dark:text-white">Your Brand</h1>
```

### Add New Dashboard Section
1. Create a new file in `src/components/tabs/YourTab.jsx`
2. Add it to the tabs list in `Sidebar.jsx`
3. Import and handle it in `Dashboard.jsx`

### Modify Colors
Edit `tailwind.config.js` to customize the color theme:
```javascript
theme: {
  extend: {
    colors: {
      primary: '#your-color',
    }
  }
}
```

## Performance Tips

- Use React.memo() for expensive components
- Lazy load charts and heavy components
- Implement data caching to reduce API calls
- Monitor bundle size with `npm run build -- --analyze`

## Troubleshooting

**Dark mode not persisting?**
Add to `App.jsx`:
```javascript
useEffect(() => {
  localStorage.setItem('darkMode', darkMode)
}, [darkMode])
```

**Charts not rendering?**
Ensure Recharts is properly installed: `npm install recharts`

## Future Enhancements

- 📊 Real-time data sync from Supabase
- 📱 Mobile-responsive improvements
- 🔔 Notifications for milestones & alerts
- 📈 Advanced analytics & forecasting
- 🔐 User authentication & role-based access
- 📅 Calendar integration for project timelines
- 💬 Slack/Discord bot notifications

## Support

For issues, questions, or feature requests, open an issue on GitHub or contact support@automateedge.digital

## License

MIT License — Feel free to use and modify as needed.

---

**Version:** 1.0.0  
**Last Updated:** February 2026  
**Built with ❤️ for AutomateEdge**
