// Login validation logic

// Function to verify user before showing content
document.addEventListener('DOMContentLoaded', () => {
    const langOptions = document.querySelectorAll('.lang-option');
    const displayBtn = document.getElementById('current-lang-display');

    langOptions.forEach(option => {
        option.addEventListener('click', (e) => {
            e.preventDefault(); // Prevents the page from jumping

            const selectedLang = option.getAttribute('data-lang');

            // Update the main button text
            displayBtn.innerText = `Language (${selectedLang})`;

            // Log for your future JS updates
            console.log(`Language changed to: ${selectedLang}`);

            // Optional: Close menu after selection
            option.parentElement.style.opacity = "0";
            setTimeout(() => option.parentElement.style.opacity = "", 500);
        });
    });
});

