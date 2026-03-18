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