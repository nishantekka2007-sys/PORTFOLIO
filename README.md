# Nishant Ekka — Interactive Portfolio

A cinematic personal portfolio inspired by neon-soaked coastal cities and retro arcade games. The site brings together a character-focused visual studio, a browser-based highway racing game, a portfolio dialogue interface, and the sections that introduce my work and interests.

<p align="center">
  <a href="https://nishant-portfolio-psi-livid.vercel.app/"><strong>View Live Portfolio</strong></a>
  &nbsp; · &nbsp;
  <a href="https://github.com/nishantekka2007-sys/PORTFOLIO">Source Code</a>
</p>

---

## Overview

This project is an interactive portfolio built with web technologies. Its visual direction combines dark panels, neon pink and cyan accents, cinematic lighting, and a Vice City-inspired atmosphere.

The goal is to make exploring a portfolio feel more like moving through a small interactive experience while keeping the content accessible from a regular browser.

## Highlights

- **Cinematic character studio** — a character-focused presentation with visual effects and scene controls.
- **Traffic Racer-style driving game** — a browser-based highway arcade experience with steering, acceleration, braking, traffic, score tracking, collision handling, and environment controls.
- **Dialogue Scene** — a portfolio assistant interface with suggested questions and a chat-style conversation layout.
- **Tactical Stance scene** — a separate character-scene area currently being refined.
- **Portfolio sections** — navigation for the introduction, studio, about, arsenal, missions, journey, passions, and radio.
- **Responsive interface** — designed to adapt to different browser and screen sizes.

> **Development note:** Interactive scenes are being iterated on. Rendering and initialization behaviour may depend on the browser and how the page is served locally; test the scenes in the target browser before presenting a build as production-ready.

## Technology

- **HTML5** for page structure
- **CSS3** for layout, responsive styling, and visual effects
- **Vanilla JavaScript** for interaction and game logic
- **Three.js / WebGL** for 3D rendering in the driving experience

The portfolio is primarily a front-end project. No backend setup is documented as a requirement for the basic site.

## Run Locally

For the most reliable local preview, serve the project over HTTP rather than opening the HTML file directly. This avoids browser restrictions that can affect JavaScript modules and local assets.

### Option 1: Python

1. Clone the repository and enter the project directory:

   ```bash
   git clone https://github.com/nishantekka2007-sys/PORTFOLIO.git
   cd PORTFOLIO
   ```

2. Start a local server:

   ```bash
   python3 -m http.server 8000
   ```

3. Open [http://localhost:8000](http://localhost:8000) in your browser.

Stop the server with `Ctrl+C` in the terminal.

### Option 2: Node.js

If Node.js is installed, you can use a lightweight static server:

```bash
npx serve .
```

Open the local URL printed by the command.

## Game Controls

The driving game supports keyboard controls:

| Action | Control |
|---|---|
| Accelerate | `W` or `↑` |
| Brake | `S` or `↓` |
| Steer left | `A` or `←` |
| Steer right | `D` or `→` |
| Handbrake | `Space` |
| Pause | `Esc` |
| Reset | `R` |

On-screen touch controls are provided for supported mobile layouts. Available controls can vary with the current game state.

## Repository Notes

- `index.html` — main portfolio page
- `styles.css` — primary stylesheet
- `js/` — JavaScript modules, including game logic
- `assets/` — images and visual resources

The structure above is a high-level guide; individual files and subdirectories may evolve as the project develops.

## Deployment

The live portfolio is hosted on Vercel:

**[nishant-portfolio-psi-livid.vercel.app](https://nishant-portfolio-psi-livid.vercel.app/)**

When the GitHub repository is connected to Vercel for automatic deployments, pushing changes to the configured branch can trigger a new deployment. Verify the deployment status in Vercel after publishing changes.

## Author

**Nishant Ekka**

- Portfolio: [nishant-portfolio-psi-livid.vercel.app](https://nishant-portfolio-psi-livid.vercel.app/)
- GitHub: [nishantekka2007-sys](https://github.com/nishantekka2007-sys)

## License

No license is currently specified in this repository. Contact the author before reusing or redistributing project code or assets.
