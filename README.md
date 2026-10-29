# Nishant Ekka // Cinematic Vice City Character Studio & Coastal Car Game 🌴🚗✨

An original GTA VI / Vice City-inspired personal portfolio featuring an **Interactive Character Cinema Studio** based on Nishant's authentic photographic likeness and a **Playable 3D Coastal Arcade Driving Game**, built with **HTML5, CSS3, and Three.js (WebGL)**. Fully static, responsive, and ready for local preview or hosting.

**Owner:** Nishant Ekka  
**Visual Reference:** Curly dark hair, warm skin tone, slim build, black shirt, white trousers, black shoes.  
**Tech Stack:** HTML5, CSS3, Vanilla JavaScript, Three.js WebGL  
**Atmosphere:** Tropical Vice City sunset, turquoise coastal waters, palm trees, warm golden highlights, retro game HUD, and interactive 3D physics.

---

## 🌴 1. Character Cinema Studio (Part 1)

Transforming the character presentation into an elegant, interactive, cinematic photo showcase:
- **Authentic Photographic Likeness:** Uses Nishant's real photograph (`assets/character/idle.webp` & `reference.jpg`) with natural human proportions. Zero low-poly or blocky mannequins.
- **Layered Parallax Environment:** Multi-plane tropical background featuring a warm gradient sky, turquoise horizon glow, and framing palm foliage that subtly shifts with pointer movement.
- **Cinematic Breathing & Floating:** Smooth, restrained floating animation applied subtly to the character frame container without synthetic body distortion.
- **Dynamic Pointer Lighting Sweep:** Soft golden light sweep tracking mouse cursor coordinates across the stage.
- **Interactive Lighting Environments:**
  - 🌅 **Sunset:** Warm golden hour, peach, and coral tropical highlights.
  - 🌃 **Night:** Deep oceanic indigo with neon turquoise and magenta rim lighting.
  - 💡 **Spotlight:** High-contrast dramatic key light focused directly on Nishant.
  - ↺ **Reset:** Instantly resets the camera and lighting to default state.
- **Subtitled Dialogue Mode:** Tabbed scene featuring synchronized quote reveals and speaker HUD.

---

## 🏎️ 2. Coastal Arcade Driving Mini-Game (Part 2)

A real-time playable 3D driving arcade game built with Three.js WebGL:
- **Player-Controllable 3D Exotic Sports Car:**
  - Low-slung red 80s supercar with aerodynamic bodywork, rear wing spoiler, pop-up headlamps, and twin exhausts.
  - 4 independently rotating wheels with treaded rubber tires, deep-dish alloy rims, silver brake discs, and red brake calipers.
  - Real responsive steering: front wheels steer left/right, and vehicle body realistically rolls and pitches with acceleration and turning.
- **Controls (Full Keyboard & Mobile Touch):**
  - **Desktop Keyboard:** `W` / `▲` to Accelerate, `S` / `▼` to Brake & Reverse, `A` / `◀` to Steer Left, `D` / `▶` to Steer Right, `SPACE` for Handbrake Drift, `ESC` to Pause, `R` to Reset.
  - **Mobile Touch Overlay:** Responsive on-screen directional buttons (`◀ STEER`, `STEER ▶`, `▼ BRAKE`, `▲ GAS`) isolated with `touch-action: manipulation` to prevent accidental page scrolling.
- **Dynamic Coastal Highway:**
  - Scenic coastal road with turquoise ocean and animated wave ripples on the left; swaying palm trees, streetlights, and skyline architecture on the right.
- **Smooth Day & Night Cycle:**
  - Continuous automatic transitions between Dawn, Day, Sunset, Dusk, and Night.
  - Manual environment mode override buttons: `Day`, `Sunset`, `Night`, and `Auto`.
- **Live Arcade HUD & Telemetry:**
  - Real-time digital speedometer (0 - 150+ MPH), animated dynamic tachometer rev bar, distance odometer, and active environment indicator.
  - 3 switchable camera perspectives (`📷 CAM`): Chase Cam, Low Wheel Cam, and Hood Driver Cam.
  - Pause (`⏸ PAUSE`) and Reset (`↺ RESET`) controls.

---

## ⚡ 3. Performance & Optimization

- **Power Optimization:** Automatically halts Three.js rendering via `IntersectionObserver` when the game or studio is scrolled out of view.
- **Tab Inactivity:** Pauses simulation when the browser tab is hidden using the `visibilitychange` API.
- **Strict Scope Preservation:** Zero modifications to external portfolio content; the hero, about dossier, skills, projects, timeline, achievements, and contact sections remain intact.

---

## 🚀 4. How to Preview & Test Locally

You can open `index.html` directly in any modern browser:
```bash
# In the portfolio directory:
open index.html
# Or serve with any static server:
npx serve .
```

---

## 📄 License
Created for **Nishant Ekka**. Free to customize and adapt.