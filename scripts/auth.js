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
/* ==========================================================================
   PORTAL NAVIGATION LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    const currentPage = window.location.pathname.toLowerCase();
    const isPortalLoginPage = currentPage.includes('judgelogin.html') || currentPage.includes('lawerlogin.html');
    if (isPortalLoginPage) {
        alert('You have switched to the login page. Press OK to continue and fill your details.');
    }

    // 1. Logic for "Login" button on the Home Page
    const homeLoginBtn = document.querySelector('.login-btn');
    if (homeLoginBtn) {
        homeLoginBtn.addEventListener('click', () => {
            window.location.href = 'login.html';
        });
    }

    // 2. Logic for Judge Portal
    const judgeBtn = document.querySelector('#judge-portal-btn') || document.querySelector('.judge-btn');
    if (judgeBtn) {
        judgeBtn.addEventListener('click', () => {
            window.location.href = 'judgelogin.html';
        });
    }

    // 3. Logic for Lawyer Portal
    const lawyerBtn = document.querySelector('#lawyer-portal-btn') || document.querySelector('.lawyer-btn');
    if (lawyerBtn) {
        lawyerBtn.addEventListener('click', () => {
            window.location.href = 'lawerlogin.html';
        });
    }

    // 4. Shared login form handling for Judge/Lawyer pages
    const loginForm = document.querySelector('.login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const role = loginForm.getAttribute('data-role') || 'User';
            const emailInput = loginForm.querySelector('input[type="email"]');
            const passwordInput = loginForm.querySelector('input[type="password"]');

            const email = emailInput ? emailInput.value.trim() : '';
            const password = passwordInput ? passwordInput.value.trim() : '';

            if (!email || !password) {
                alert('Please enter both email and password.');
                return;
            }

            console.log(`${role} login attempt: ${email}`);
            alert(`${role} login successful.`);
        });
    }

    const newSigninBtn = document.querySelector('.new-signin-btn');
    if (newSigninBtn) {
        newSigninBtn.addEventListener('click', () => {
            const page = window.location.pathname.toLowerCase();
            if (page.includes('judgelogin.html')) {
                window.location.href = 'newjudgeregester.html';
                return;
            }
            if (page.includes('lawerlogin.html')) {
                window.location.href = 'nwelawyerregester.html';
                return;
            }
            alert('New sign-in flow will be connected soon.');
        });
    }

    const verifyLicenseBtn = document.querySelector('.verify-license-btn');
    if (verifyLicenseBtn) {
        verifyLicenseBtn.addEventListener('click', (event) => {
            event.preventDefault();

            const registerForm = document.querySelector('.verification-form');
            if (!registerForm) {
                return;
            }

            const requiredFields = registerForm.querySelectorAll('input[required]');
            for (const field of requiredFields) {
                if (!field.value.trim()) {
                    alert('Please fill all required details before license verification.');
                    field.focus();
                    return;
                }
            }

            const password = registerForm.querySelector('input[name="password"]');
            const confirmPassword = registerForm.querySelector('input[name="confirmPassword"]');
            if (password && confirmPassword && password.value !== confirmPassword.value) {
                alert('Password and confirm password do not match.');
                confirmPassword.focus();
                return;
            }

            const role = registerForm.getAttribute('data-role') || 'lawyer';
            const verificationPage = role === 'judge' ? 'judgeverification.html' : 'lawerverification.html';
            window.open(verificationPage, '_blank', 'width=700,height=760,noopener,noreferrer');
        });
    }

    const uploadVerificationBtn = document.querySelector('.upload-verification-btn');
    if (uploadVerificationBtn) {
        uploadVerificationBtn.addEventListener('click', (event) => {
            event.preventDefault();

            const front = document.querySelector('input[name="frontProof"]');
            const back = document.querySelector('input[name="backProof"]');
            if (!front || !back || !front.files.length || !back.files.length) {
                alert('Please upload both front and back images for verification.');
                return;
            }

            const okPressed = window.confirm('You were verified successfully. You may proceed to login.');
            if (!okPressed) {
                return;
            }

            const homePath = '../html/index.html';
            if (window.opener && !window.opener.closed) {
                window.opener.location.href = homePath;
                window.close();
                return;
            }

            window.location.href = homePath;
        });
    }

    const backHomeBtn = document.querySelector('.back-home-btn');
    if (backHomeBtn) {
        backHomeBtn.addEventListener('click', () => {
            const inHtmlFolder = window.location.pathname.toLowerCase().includes('/html/');
            window.location.href = inHtmlFolder ? 'index.html' : '../html/index.html';
        });
    }

    const backPreviousBtn = document.querySelector('.back-previous-btn');
    if (backPreviousBtn) {
        backPreviousBtn.addEventListener('click', () => {
            if (window.history.length > 1) {
                window.history.back();
                return;
            }

            if (window.opener && !window.opener.closed) {
                window.close();
                return;
            }

            const inHtmlFolder = window.location.pathname.toLowerCase().includes('/html/');
            window.location.href = inHtmlFolder ? 'index.html' : '../html/index.html';
        });
    }
});
