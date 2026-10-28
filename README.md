# Nishant Ekka // Cinematic Vice City Character Portfolio 🌴🚗✨

An original GTA VI / Vice City-inspired personal portfolio engineered strictly with **HTML5 and CSS3 keyframe animations**.

**Owner:** Nishant Ekka  
**Tech Stack:** 100% Pure HTML5 & CSS3 (Zero JavaScript, React, npm, or frontend frameworks)  
**Atmosphere:** Vice City synthwave, sunset magenta & amber skies, neon teal reflections, retro game HUD, and cinematic camera stages.

---

## 💎 Technical Honesty & Animation Architecture

CSS is exceptional at animating transforms, keyframes, transitions, sprite sheets (`steps()`), layered component offsets, opacity, and parallax motion. **CSS cannot synthesize realistic new anatomical poses from a single photograph.**

This project is built around **honest engineering**:
- It provides a **modular CSS sprite sheet engine** where frame counts, frame dimensions, and step rates are configured via CSS custom properties.
- When multi-frame sprite sheets are absent, the system displays **tasteful fallbacks** (e.g. camera glide translation, breathing idle keyframes, synchronized typography reveals, tactical wireframe HUDs) rather than breaking or claiming fake animation.
- A single still image is never claimed to be a realistic lip-sync or gait animation.

---

## 📂 Project Directory Structure

```text
PORTFOLIO/
├── index.html                  # Semantic HTML5 structure (no scripts)
├── styles.css                  # Pure CSS3 animations, HUD, & responsive layout
├── README.md                   # Complete customization and deployment guide
└── assets/
    ├── backgrounds/
    │   ├── vice-city-sunset.webp   # Wide cinematic sunset skyline
    │   └── vice-city-sunset.jpg    # High-res fallback
    ├── character/
    │   ├── reference.jpg           # Nishant Ekka real uploaded photo reference
    │   ├── idle.webp               # Stylized 3D character render (transparent)
    │   ├── idle.png                # High-res PNG fallback
    │   ├── avatar.webp             # 300x300 close-up headshot
    │   ├── vehicle.webp            # Retro exotic sports car cutout
    │   └── muzzle-flash.webp       # Tactical starburst effect
    └── vehicles/
        └── sports-car.png          # High-res transparent sports car
```

---

## 🎬 Character Scenes & Status Manifest

| Scene | Asset Path | Status | Active Fallback Mechanism |
|---|---|---|---|
| **Opening Hero & Idle** | `assets/character/idle.webp` | ✅ **Active** | 3D stylized character render with `characterIdleBreathe` keyframe motion |
| **User Identity Reference** | `assets/character/reference.jpg` | ✅ **Active** | Nishant's original photo in the character dossier |
| **Sunset Skyline** | `assets/backgrounds/vice-city-sunset.webp` | ✅ **Active** | 16:9 cinematic sunset background with gradient CSS backup |
| **Retro Sports Car** | `assets/character/vehicle.webp` | ✅ **Active** | Horizontal transform glide, underglow, parallax moving road |
| **Muzzle Flash Starburst** | `assets/character/muzzle-flash.webp` | ✅ **Active** | Burst scaling + screen shake on tactical trigger |
| **Talking Lip-Sync** | `assets/character/talking.webp` | ⏳ *Awaited* | Layered mouth component & staged CSS typography reveals |
| **Running Walk Cycle** | `assets/character/running.webp` | ⏳ *Awaited* | Translating camera pan across sidewalk (no fake leg gait) |
| **Combat / Fighting Combo**| `assets/character/fighting.webp` | ⏳ *Awaited* | Tactical encounter HUD with CSS camera shake effect |

---

## ⚙️ How to Provide Sprite Sheets & Adjust Frame Counts

The CSS contains a modular sprite component configured via CSS variables.

### 1. Adding a Running / Walking Sprite Sheet
1. Create or export a horizontal sprite sheet (e.g., 6 frames across, each 256px wide by 512px tall). Total image width = `256 * 6 = 1536px`.
2. Save the file to `assets/character/running.webp`.
3. In `styles.css`, locate the CSS variables at the top:
   ```css
   :root {
     --frame-count: 6;       /* Update with your exact number of frames */
     --frame-width: 256px;   /* Width of a single frame */
     --frame-height: 512px;  /* Height of a single frame */
     --run-speed: 0.8s;      /* Duration of a complete cycle */
   }
   ```
4. In `index.html`, update the motion container:
   ```html
   <!-- Replace .single-image-fallback with .sprite-animated -->
   <div class="sprite-player sprite-animated" 
        style="background-image: url('assets/character/running.webp');">
   </div>
   ```

### 2. Adding a Talking Mouth Sprite Sheet
1. Export a mouth strip or phoneme set (e.g., 4 phonemes: closed, slightly open, wide, round).
2. Save to `assets/character/talking.webp`.
3. Position `.talk-mouth-layer` over the character's face in `styles.css` using `top` and `left` percentages.

---

## 📝 Editing Your Portfolio Information

All content is cleanly organized in `index.html`:
- **Hero Title & Tagline:** Edit `<h1 class="hero-title">` and `.hero-tagline`.
- **Current College & Degree:** In `<section id="timeline">`, update:
  ```html
  <div class="timeline-subtitle">[Your Current Degree] • [Your Enrolled College]</div>
  ```
- **Email & LinkedIn:** In `<section id="contact">`, update the reserved slots with your links:
  ```html
  <a href="mailto:your-email@domain.com" class="channel-box active-link">
  ```
- **Projects & Missions:** VoiceKhata is featured with its repository (`https://github.com/nishantekka2007-sys/voicekhata-hackday`) and Render backend (`https://voicekhata-hackday.onrender.com`). Add more project cards by copying `<article class="project-card">`.

---

## 🚀 How to Publish on GitHub Pages

Because this website uses **zero build tools, zero npm, and zero JavaScript**, it can be deployed on GitHub Pages in under 60 seconds:

1. **Initialize Git Repository (if not already done):**
   ```bash
   cd /Users/nishantekka/PORTFOLIO
   git init
   git add .
   git commit -m "feat: Vice City CSS character portfolio for Nishant Ekka"
   ```

2. **Push to GitHub:**
   ```bash
   git branch -M main
   git remote add origin https://github.com/nishantekka2007-sys/<YOUR-REPO-NAME>.git
   git push -u origin main
   ```

3. **Enable GitHub Pages:**
   - Go to your repository on GitHub.
   - Navigate to **Settings** &rarr; **Pages**.
   - Under **Build and deployment**, select **Source: Deploy from a branch**.
   - Select branch `main` and folder `/ (root)`.
   - Click **Save**.
   - Your site will be live at: `https://nishantekka2007-sys.github.io/<YOUR-REPO-NAME>/`!

---

## ♿ Accessibility & Performance
- Full support for `prefers-reduced-motion: reduce`: Disables aggressive camera shakes, continuous loops, and translational glides for users with vestibular sensitivities.
- Pure CSS state transitions with zero JavaScript overhead.
- Optimized WebP imagery with high-resolution fallbacks.

