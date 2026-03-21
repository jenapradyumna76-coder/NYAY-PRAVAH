// [Section] Main UI controller: navbar scroll state + reusable topic-panel binding

// [Behavior] Run setup only after the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const nav = document.querySelector('.navbar');
    const logoSection = document.querySelector('.logo-section');
    const heroSection = document.querySelector('.hero-carousel');

    // [Behavior] Turn navbar blue only when hero reaches/stays under sticky navbar.
    const handleScroll = () => {
        if (!nav || !heroSection) {
            return;
        }

        const heroTop = heroSection.getBoundingClientRect().top;
        const navHeight = nav.offsetHeight;
        const hasTouchedHero = heroTop <= navHeight;

        if (hasTouchedHero) {
            nav.classList.add('nav-scrolled');
            if (logoSection) {
                logoSection.classList.add('logo-scrolled');
            }
        } else {
            nav.classList.remove('nav-scrolled');
            if (logoSection) {
                logoSection.classList.remove('logo-scrolled');
            }
        }
    };

    // [Behavior] Keep navbar state synced with hero contact point.
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);
    handleScroll();

    // [Section] About topic content map.
    // [Note] Keys must match data-about attributes in index.html.
    const aboutContent = {
        mission: {
            title: 'Our Mission',
            text: 'Placeholder content: Our mission is to simplify legal access through AI-driven workflows and clear guidance for citizens, lawyers, and judges. Replace this with your final mission text when ready.'
        },
        team: {
            title: 'The Team',
            text: 'Placeholder content: We are a cross-functional team of builders, designers, and legal-tech enthusiasts focused on practical justice solutions. Replace with your final team profile later.'
        },
        tech: {
            title: 'Tech Stack',
            text: 'Placeholder content: The platform combines modern web interfaces, secure data handling, and AI-assisted search features to improve legal workflows. Replace with your exact stack details later.'
        },
        roadmap: {
            title: 'Roadmap',
            text: 'Placeholder content: Upcoming phases include improved search ranking, expanded legal datasets, and dashboard enhancements for different user roles. Replace with your real roadmap later.'
        },
        contact: {
            title: 'Contact',
            text: 'Placeholder content: Add your support email, social handles, and response timeline here so users know how to reach your team. Replace this with your official contact details later.'
        }
    };

    // [Section] Services topic content map.
    // [Note] Keys must match data-service attributes in index.html.
    const servicesContent = {
        'case-search': {
            title: 'Case Search',
            text: 'Placeholder content: Users can search judgments, statutes, and precedents with filters for court, year, and topic. Replace this text with your final service details later.'
        },
        'lawyer-portal': {
            title: 'Lawyer Portal',
            text: 'Placeholder content: Lawyers can track matters, manage documents, and monitor filing stages in one workspace. Replace with your final lawyer portal content later.'
        },
        'legal-aid': {
            title: 'Legal Aid',
            text: 'Placeholder content: Citizens can discover guided legal support options and step-by-step assistance for common legal needs. Replace with your final legal aid description later.'
        },
        'document-vault': {
            title: 'Document Vault',
            text: 'Placeholder content: The vault securely stores case files and makes retrieval easy through organized records and search tags. Replace with your final document vault content later.'
        },
        'help-center': {
            title: 'Help Center',
            text: 'Placeholder content: A self-service area for FAQs, process guides, and platform support requests. Replace with your final help center copy later.'
        }
    };

    const bindTopicPanel = ({
        topicButtonsSelector,
        navLinksSelector,
        titleSelector,
        textSelector,
        panelSelector,
        dataMap,
        dataAttr
    }) => {
        // [Behavior] Resolve all required DOM nodes for one panel binding instance.
        const topicButtons = document.querySelectorAll(topicButtonsSelector);
        const navLinks = document.querySelectorAll(navLinksSelector);
        const titleEl = document.querySelector(titleSelector);
        const textEl = document.querySelector(textSelector);
        const panelEl = document.querySelector(panelSelector);

        if (!titleEl || !textEl || !panelEl) {
            // [Note] Safe exit when a section is missing on a page reusing this script.
            return;
        }

        const activateTopic = (key) => {
            const item = dataMap[key];
            if (!item) {
                return;
            }

            // [Behavior] Update visible content in the target panel.
            titleEl.textContent = item.title;
            textEl.textContent = item.text;

            // [Behavior] Keep button visual state synced with active topic key.
            topicButtons.forEach((btn) => {
                const isActive = btn.dataset[dataAttr] === key;
                btn.classList.toggle('is-active', isActive);
            });
        };

        // [Behavior] Handle clicks from in-section topic pills.
        topicButtons.forEach((btn) => {
            btn.addEventListener('click', () => {
                const key = btn.dataset[dataAttr];
                activateTopic(key);
            });
        });

        // [Behavior] Handle clicks from navbar dropdown shortcuts.
        navLinks.forEach((link) => {
            link.addEventListener('click', (event) => {
                event.preventDefault();
                const key = link.dataset[dataAttr];
                activateTopic(key);
                // [Behavior] Bring updated panel into view for better UX.
                panelEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
            });
        });
    };

    bindTopicPanel({
        topicButtonsSelector: '.js-about-topic',
        navLinksSelector: '.js-about-link',
        titleSelector: '#about-content-title',
        textSelector: '#about-content-text',
        panelSelector: '#about-content-panel',
        dataMap: aboutContent,
        dataAttr: 'about'
    });

    bindTopicPanel({
        topicButtonsSelector: '.js-service-topic',
        navLinksSelector: '.js-service-link',
        titleSelector: '#services-content-title',
        textSelector: '#services-content-text',
        panelSelector: '#services-content-panel',
        dataMap: servicesContent,
        dataAttr: 'service'
    });
});