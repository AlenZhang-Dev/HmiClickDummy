# Electric Tool HMI Simulator

An interactive Human-Machine Interface (HMI) simulator for electric power tools, featuring multiple design variants including AC Hammer, DC Hammer, and Industrial control interfaces.

![Version](https://img.shields.io/badge/version-2.4.0-blue)
![React](https://img.shields.io/badge/React-18.3.1-61dafb)
![License](https://img.shields.io/badge/license-MIT-green)

## 🎯 Features

- **Multiple HMI Variants**: Switch between different tool interface designs
  - AC Hammer: Standard single-bar display
  - DC Hammer: Segmented battery level display
  - Industrial: 7-segment digital display with advanced controls
  
- **Interactive Controls**:
  - Power on/off simulation
  - Mode selection (Max/Soft)
  - Torque adjustment with custom levels
  - Battery level monitoring
  - Safety features (kickback protection, tool lock, maintenance alerts)

- **Real-time Status Indicators**:
  - Normal, Warning, Error, and Safety Stop states
  - Visual feedback with LED-style indicators
  - 7-segment display for industrial variant

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 16.x or higher)
- **npm** (version 7.x or higher) or **yarn**

To check if you have Node.js and npm installed:

```bash
node --version
npm --version
```

If you don't have Node.js installed, download it from [nodejs.org](https://nodejs.org/).

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/AlenZhang-Dev/Hmi.git
cd Hmi
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages:
- React & React DOM
- Vite (build tool)
- Tailwind CSS (styling)
- Lucide React (icons)
- PostCSS & Autoprefixer

## 🏃 Running the Project

### Development Mode

Start the development server with hot reload:

```bash
npm run dev
```

The application will automatically open in your default browser at `http://localhost:3000`.

### Production Build

Build the project for production:

```bash
npm run build
```

The optimized files will be generated in the `dist/` folder.

### Preview Production Build

Preview the production build locally:

```bash
npm run preview
```

## 📁 Project Structure

```
Hmi/
├── index.html              # Entry HTML file
├── package.json            # Project dependencies and scripts
├── vite.config.js          # Vite configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── postcss.config.js       # PostCSS configuration
├── Hmi.jsx                 # Main HMI component
├── src/
│   ├── main.jsx           # React entry point
│   ├── App.jsx            # App wrapper component
│   └── index.css          # Global styles with Tailwind directives
└── README.md              # This file
```

## 🎮 Usage

### Selecting HMI Variants

Use the left sidebar to switch between different HMI design variants:
- Click on any variant to preview its interface
- Active variant is highlighted with a blue border

### Control Panel

The control panel allows you to simulate various tool states:

**Common Controls:**
- **Power Button**: Toggle power on/off
- **Status Simulation**: Set tool status (Normal, Warning, Error, Safety Stop)

**DC Hammer Specific:**
- **Battery Level Slider**: Adjust battery percentage (0-100%)

**Industrial Variant:**
- **Max Torque Limit**: Set maximum torque (0-99N)
- **Custom Levels**: Enable/disable custom torque levels (C1, C2, C3)
- **+/- Buttons**: Adjust torque selection
- **Long Press**: Hold +/- buttons for 3 seconds to toggle tool lock
- **Industrial Signals**: Simulate kickback, maintenance, and NFC events

## 🛠️ Technologies Used

- **[React](https://react.dev/)** - UI library
- **[Vite](https://vitejs.dev/)** - Next-generation frontend tooling
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Lucide React](https://lucide.dev/)** - Beautiful & consistent icon library
- **[PostCSS](https://postcss.org/)** - CSS transformation tool

## 🔧 Configuration

### Vite Configuration

The project uses Vite with the React plugin. Configuration can be modified in `vite.config.js`:

```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,      // Dev server port
    open: true       // Auto-open browser
  }
})
```

### Tailwind Configuration

Tailwind is configured to scan all relevant files for class names. Customize in `tailwind.config.js`.

## 📝 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |

## 🚀 Deployment

### Deploy to Vercel (5 minutes)

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy on Vercel:**
   - Visit [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "New Project"
   - Import your repository
   - Click "Deploy"
   - Done! Get your live URL instantly

📖 **Deployment guides**: 
- [QUICK_DEPLOY.md](./QUICK_DEPLOY.md) - Quick 3-step guide
- [DEPLOYMENT_SUMMARY.md](./DEPLOYMENT_SUMMARY.md) - Comprehensive Vercel deployment guide

## � Architecture & Optimization

**Current Status**: The project is undergoing architecture optimization to improve code reusability and maintainability.

📚 **Optimization Documentation**:
- [OPTIMIZATION_PLAN.md](./docs/OPTIMIZATION_PLAN.md) - Comprehensive optimization strategy (5 phases)
- [OPTIMIZATION_CHECKLIST.md](./docs/OPTIMIZATION_CHECKLIST.md) - Step-by-step task checklist
- [ARCHITECTURE_COMPARISON.md](./docs/ARCHITECTURE_COMPARISON.md) - Before/After architecture comparison

**Key Improvements**:
- ✅ Component modularization (reduce main file from 1068 to <200 lines)
- ✅ State management refactoring (useReducer)
- ✅ Custom Hooks extraction
- ✅ Type safety enhancement (PropTypes)
- ✅ Performance optimization

**Branch**: `Optimization/Re-structure-module`

## �🐛 Troubleshooting

### Port Already in Use

If port 3000 is already in use, modify the port in `vite.config.js`:

```javascript
server: {
  port: 3001,  // Change to any available port
  open: true
}
```

### Tailwind Styles Not Applying

Ensure `index.css` is imported in `main.jsx` and contains the Tailwind directives:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Dependencies Installation Issues

Clear npm cache and reinstall:

```bash
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👤 Author

**AC Hammer Inc.**

## 📮 Support

For support, please open an issue in the GitHub repository.

---

**Note**: This is a prototype HMI simulator for demonstration and development purposes. The interface designs represent conceptual variations for electric power tool user interfaces.
