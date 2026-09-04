/**
 * Main JavaScript for Portfolio Website
 * Features: Page Loader, Theme Toggle, Scroll Animations, Typing Effect, etc.
 * Uses modern Vanilla JavaScript (ES6+)
 */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    /* ==========================================================================
       1. Page Loader
       ========================================================================== */
    const pageLoader = document.getElementById('page-loader');
    const loaderProgress = document.querySelector('.loader-progress');
    
    if (pageLoader && loaderProgress) {
        // Animate progress bar to 100%
        setTimeout(() => {
            loaderProgress.style.width = '100%';
        }, 100);

        // Ensure loader stays for at least 1.5s
        const minLoaderTime = 1500;
        const startTime = Date.now();

        window.addEventListener('load', () => {
            const currentTime = Date.now();
            const elapsedTime = currentTime - startTime;
            const remainingTime = Math.max(0, minLoaderTime - elapsedTime);

            setTimeout(() => {
                pageLoader.style.opacity = '0';
                setTimeout(() => {
                    pageLoader.style.display = 'none';
                    document.body.classList.remove('loading');
                }, 500); // fade out duration
            }, remainingTime);
        });
    }

    /* ==========================================================================
       2. Theme Toggle (Dark / Light Mode)
       ========================================================================== */
    const themeToggleBtn = document.getElementById('theme-toggle');
    
    if (themeToggleBtn) {
        const themeIcon = themeToggleBtn.querySelector('i') || themeToggleBtn;
        
        // Load saved preference
        const savedTheme = localStorage.getItem('theme') || 'dark';
        document.body.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme);

        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = document.body.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.body.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
        });

        function updateThemeIcon(theme) {
            if (themeIcon.classList.contains('bi')) {
                if (theme === 'dark') {
                    themeIcon.classList.remove('bi-sun-fill');
                    themeIcon.classList.add('bi-moon-stars-fill');
                } else {
                    themeIcon.classList.remove('bi-moon-stars-fill');
                    themeIcon.classList.add('bi-sun-fill');
                }
            }
        }
    }

    /* ==========================================================================
       3. Navbar, Scroll Progress & Scroll Events
       ========================================================================== */
    const navbar = document.querySelector('.navbar');
    const scrollProgressBar = document.getElementById('scroll-progress-bar');
    const backToTopBtn = document.getElementById('back-to-top') || document.querySelector('.back-to-top');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let isScrolling = false;

    window.addEventListener('scroll', () => {
        if (!isScrolling) {
            window.requestAnimationFrame(() => {
                handleScroll();
                isScrolling = false;
            });
            isScrolling = true;
        }
    });

    function handleScroll() {
        const scrollY = window.scrollY;

        // Navbar scrolled class
        if (navbar) {
            if (scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }

        // Back to top button
        if (backToTopBtn) {
            if (scrollY > 500) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        }

        // Scroll progress bar
        if (scrollProgressBar) {
            const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (scrollY / totalHeight) * 100;
            scrollProgressBar.style.width = `${progress}%`;
        }
    }
    
    // Call once on load
    handleScroll();

    /* ==========================================================================
       4. Mobile Menu Toggle
       ========================================================================== */
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileNavOverlay = document.getElementById('mobile-nav-overlay') || document.querySelector('.mobile-nav-overlay');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            document.body.classList.toggle('mobile-nav-open');
            if (mobileNavOverlay) {
                mobileNavOverlay.classList.toggle('show');
            }
        });
    }

    // Close mobile menu when a nav link is clicked
    if (navLinks.length > 0) {
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                document.body.classList.remove('mobile-nav-open');
                if (mobileNavOverlay) {
                    mobileNavOverlay.classList.remove('show');
                }
            });
        });
    }

    // Close mobile menu when clicking outside
    if (mobileNavOverlay) {
        mobileNavOverlay.addEventListener('click', (e) => {
            if (e.target === mobileNavOverlay) {
                document.body.classList.remove('mobile-nav-open');
                mobileNavOverlay.classList.remove('show');
            }
        });
    }

    /* ==========================================================================
       5. Active Nav Link Highlighting (Intersection Observer)
       ========================================================================== */
    if (sections.length > 0 && navLinks.length > 0) {
        const navObserverOptions = {
            root: null,
            rootMargin: '-20% 0px -80% 0px',
            threshold: 0
        };

        const navObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const currentId = entry.target.getAttribute('id');
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${currentId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, navObserverOptions);

        sections.forEach(section => {
            navObserver.observe(section);
        });
    }

    /* ==========================================================================
       6. Scroll Reveal Animations
       ========================================================================== */
    const revealElements = document.querySelectorAll('.reveal');
    
    if (revealElements.length > 0) {
        const revealObserverOptions = {
            root: null,
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        };

        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const delay = el.getAttribute('data-delay');
                    
                    if (delay) {
                        el.style.transitionDelay = `${delay}ms`;
                    }
                    
                    el.classList.add('active');
                    observer.unobserve(el); // Only animate once
                }
            });
        }, revealObserverOptions);

        revealElements.forEach(el => revealObserver.observe(el));
    }

    /* ==========================================================================
       7. Typing Effect
       ========================================================================== */
    const typingElement = document.querySelector('.typing-text');
    
    if (typingElement) {
        const textsData = typingElement.getAttribute('data-texts');
        const texts = textsData ? JSON.parse(textsData) : [typingElement.textContent.trim()];
        
        let textIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        
        typingElement.textContent = ''; // clear initial content

        function type() {
            const currentText = texts[textIndex];
            
            if (isDeleting) {
                typingElement.textContent = currentText.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typingElement.textContent = currentText.substring(0, charIndex + 1);
                charIndex++;
            }
            
            let typingSpeed = isDeleting ? 50 : 100;
            
            if (!isDeleting && charIndex === currentText.length) {
                // Pause at end of word
                typingSpeed = 2000;
                if (texts.length > 1) isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % texts.length;
                typingSpeed = 500;
            }
            
            setTimeout(type, typingSpeed);
        }
        
        // Start typing effect
        setTimeout(type, 1000);
    }

    /* ==========================================================================
       8. Skill Progress Bars
       ========================================================================== */
    const skillBars = document.querySelectorAll('.skill-progress-fill');
    
    if (skillBars.length > 0) {
        const skillObserverOptions = {
            root: null,
            threshold: 0.5
        };

        const skillObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const progress = el.getAttribute('data-progress');
                    
                    if (progress) {
                        el.style.width = `${progress}%`;
                    }
                    
                    observer.unobserve(el);
                }
            });
        }, skillObserverOptions);

        skillBars.forEach(bar => {
            // Initialize at 0
            bar.style.width = '0%';
            skillObserver.observe(bar);
        });
    }

    /* ==========================================================================
       9. Smooth Scroll for Anchor Links
       ========================================================================== */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                const navHeight = navbar ? navbar.offsetHeight : 0;
                const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    /* ==========================================================================
       10. Back to Top Button Action
       ========================================================================== */
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    /* ==========================================================================
       11. Contact Form Handling
       ========================================================================== */
    const contactForm = document.getElementById('contact-form') || document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Basic validation
            let isValid = true;
            const inputs = contactForm.querySelectorAll('input[required], textarea[required]');
            
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.classList.add('error');
                } else {
                    input.classList.remove('error');
                }
            });
            
            if (isValid) {
                // Mock submission success
                const submitBtn = contactForm.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;
                
                submitBtn.textContent = 'Message Sent!';
                submitBtn.disabled = true;
                submitBtn.style.backgroundColor = 'var(--success-color, #28a745)';
                
                // Reset form
                setTimeout(() => {
                    contactForm.reset();
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    submitBtn.style.backgroundColor = '';
                }, 3000);
            }
        });
        
        // Remove error class on input
        contactForm.addEventListener('input', (e) => {
            if (e.target.classList.contains('error')) {
                e.target.classList.remove('error');
            }
        });
    }

    /* ==========================================================================
       12. Footer Year
       ========================================================================== */
    const yearEl = document.getElementById('current-year');
    const yearElements = yearEl ? [yearEl] : document.querySelectorAll('.current-year');
    if (yearElements.length > 0) {
        const currentYear = new Date().getFullYear();
        yearElements.forEach(el => {
            el.textContent = currentYear;
        });
    }
});
