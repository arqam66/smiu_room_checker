# SMIU Room Checker (Room Finder)

## 📚 Project Overview
A sleek, modern web application that helps students and staff find available rooms across the SM International University (SMIU) campus. It features an interactive map with scaling, smooth animations, and a clean UI built with **React**, **Vite**, **Tailwind CSS**, and **Flowbite** components.

---

## ✨ Features
- **Interactive Campus Map** – Zoom, pan, and scale rooms with animated SVG paths.
- **Responsive Design** – Optimized for desktop, tablet, and mobile.
- **Dark/Light Mode** – Seamless theme switching using Tailwind's dark mode.
- **Search & Filter** – Quick room lookup via the Hero search component.
- **Modern UI** – Flowbite‑React components, custom CSS modules, and glassmorphism effects.
- **TypeScript Strictness** – Strong typings for components and CSS modules.
- **CI‑Ready** – Linting, formatting, and pre‑commit hooks.

---

## 🚀 Getting Started
### Prerequisites
- **Node.js** (>= 18) and **npm** (>= 9) – [Download Node.js](https://nodejs.org/)
- **Git** – for version control

### Installation
```bash
# Clone the repository
git clone https://github.com/arqam66/smiu_room_checker.git
cd smiu_room_checker

# Install dependencies (Vite + Tailwind + Flowbite)
npm ci   # installs exact versions from package-lock.json
```

### Development Server
```bash
npm run dev
```
The app will be served at `http://localhost:3000` (or an alternate port if 3000 is busy). Open the URL in a browser to see the live, hot‑reloading development environment.

### Build for Production
```bash
npm run build
```
Outputs an optimized static bundle to the `dist/` directory, ready for deployment (e.g., Vercel, Netlify, or any static host).

---

## 🛠️ Scripts
| Script | Description |
|--------|-------------|
| `dev` | Starts Vite dev server with hot reload |
| `build` | Generates production‑ready static assets |
| `preview` | Serves the built app locally for testing |
| `lint` | Runs ESLint + Stylelint checks |
| `format` | Formats code with Prettier |

---

## 📂 Project Structure
```
room-finder/
├─ src/                     # Source code
│  ├─ components/          # React UI components
│  │  ├─ CampusMap.tsx
│  │  ├─ HeroSearch.tsx
│  │  └─ TopAppBar.tsx
│  ├─ assets/              # Images, icons, etc.
│  ├─ types/               # TypeScript declarations (e.g., cssmodule.d.ts)
│  ├─ index.css            # Global Tailwind styles
│  └─ main.tsx             # App entry point
├─ public/                  # Static files (favicon, manifest)
├─ vite.config.ts          # Vite configuration
├─ tailwind.config.js      # Tailwind configuration
├─ postcss.config.cjs       # PostCSS plugins
└─ README.md               # ← This file
```

---

## 🧪 Testing & Linting
```bash
npm run lint     # Lint all source files
npm run format   # Auto‑format with Prettier
```
The repository is set up with strict TypeScript rules and ESLint plugins to catch bugs early.

---

## 🤝 Contributing
Contributions are welcome! Please follow these steps:
1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/awesome-feature`).
3. Make your changes, ensuring they pass linting and tests.
4. Commit with clear messages and push (`git push origin feature/awesome-feature`).
5. Open a Pull Request targeting `main`.

---

## 📜 License
This project is licensed under the **MIT License** – see the `LICENSE` file for details.

---

## 📞 Contact
- **Author:** arqam66
- **GitHub:** https://github.com/arqam66/smiu_room_checker
- **Issues:** Open a ticket in the repository for bugs, feature requests, or questions.

---

*Happy coding!*
