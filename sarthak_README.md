----Nav Pravah: Development Log (Branch: sarthak)---
-> This documentation tracks the frontend architecture and         security implementations contributed by Sarthak Mishra for the MHERM Hackathon. Key Contributions
1. Advanced CSS Infinite CarouselDesigned and implemented
 a seamless, high-performance carousel for the landing page.
 The Problem: Standard carousels often have "white gaps" or a "revert-back" slide animation that ruins the infinite loop feel.
 The Solution: * 5-Image DOM Structure: Utilized 4 original frames plus 1 identical clone of the first frame.Precise Math: Calculated a 35s total cycle with 7s per frame (5s hold + 2s transition).
 Linear Reset: Implemented linear timing to make the jump from the clone back to the start invisible to the user.
 2. Frontend Security LayerDeveloped a "White Screen" locking mechanism to protect the project's intellectual property from unauthorized local previews.
 Blocking Script: Placed a credential check in the <head> to pause rendering.CSS Shield: Defaulted #main-content to display: none !important to prevent the "flash of unstyled content" (FOUC)
 No-JS Fallback: Integrated a <noscript> overlay to ensure the site remains locked if a user disables JavaScript. 
 Tech Stack UsedHTML5: Semantic layout and modular containerization.CSS3: Advanced @keyframes animations and Flexbox.JavaScript: DOM manipulation and authentication logic.
 Git/GitHub: Branch management and team collaboration.
 ---- Roadmap & Progress---
  ->[x] Initial Landing Page Layout
  ->[x] Infinite Carousel Optimization
  ->[x] Access Control Security Feature
  ->[x] Integration of Judge/Lawyer Login UI
  ->[x] Final UI Polish for "Nav Pravah" Branding Branch 
 --- FilesFilePurpose---
   ->html/index.html
   ->Core structure and navigation
   ->css/layout.cssCarousel logic and security styling
 --- SARTHAK_README.mdPersonal---
  -> contribution tracking
  # 🚀 Nav Pravah | MHERM Hackathon 2026

**Empowering Justice with AI** A high-performance, modular web solution built for the MHERM Hackathon. This project prioritizes "Systems Thinking" and "Vibe Coding" to ensure scalable architecture and a premium user experience.

---

## 🛠️ Tech Stack
- **Frontend:** HTML5, CSS3 (Custom Animations & Flexbox), JavaScript (ES6+)
- **Backend:** Integrated via Gemini API (Logic Assistant)
- **Deployment:** AWS EC2 (VPN Secured)

---

## ⚡ Recent Progress (Frontend Sprint)

### 1. Smart Navigation Layer
- Implemented a **Sticky Navbar** with dynamic state management.
- Added a `scroll` event listener in `script.js` that triggers a **Deep Violet** background and **Backdrop Blur** (Frosted Glass) once the user leaves the hero section.
- Optimized link contrast to ensure accessibility across all background states.

### 2. Hero Split-Screen Architecture
- Designed a 50/50 split-screen layout using **Flexbox**.
- **Media Section:** Embedded a responsive YouTube player with a 16:9 aspect ratio wrapper and rounded-edge masking.
- **Content Section:** Integrated the "Empowering Justice" description with a custom linear gradient (`#57B9FF` to Deep Blue) for visual depth.

### 3. UI Polish & Interactivity
- Created **Layered Shadows** for service boxes (`.sec-box-1`) using negative spread values for a professional "floating" effect.
- Added `translateY` transitions on hover to improve tactile feedback.
- Refactored inline scripts into a modular `script.js` to maintain clean-code best practices.

---

## 👥 The Team: Code Dazzlers

| Member | Primary Role | Core Focus |
| :--- | :--- | :--- |
| **Sarthak Mishra** | Lead Frontend / Architect | UI Logic, System Design, CSS Animations |
| **Susmita Jena** | Team Manager / Frontend Dev | Project Roadmap, Component Integration, Frontend Flow |
| **Acp Pradumn** | Backend Lead | API Architecture, Data Processing |
| **Ram** | Full-Stack Flex | Feature Implementation, Backend Support |

---

## 📬 Internal Feedback Loop
*The UI is currently using a **Violet & Brand Blue** palette. Team members please reach out if:*
1. The color palette needs adjustment for backend data visualization.
2. Any additional requirements for the "Service Boxes" are needed.
3. You encounter any issues with the new `script.js` event listeners.

---
*Last Updated: March 19, 2026*