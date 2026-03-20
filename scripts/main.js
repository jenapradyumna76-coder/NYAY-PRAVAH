// View switcher logic to swap between sketches/* script.js */

// Wait for the DOM to be fully loaded before running
document.addEventListener('DOMContentLoaded', () => {
    const nav = document.querySelector('.navbar');

    // Function to handle the scroll effect
    const handleScroll = () => {
        if (window.scrollY > 20) {
            nav.classList.add('nav-scrolled');
        } else {
            nav.classList.remove('nav-scrolled');
        }
    };

    // Listen for scroll events
    window.addEventListener('scroll', handleScroll);
});