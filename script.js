/**
 * Navigation JavaScript
 */
(function() {
    const siteNavigation = document.getElementById('site-navigation');
    const button = document.querySelector('.menu-toggle');

    // Return early if either don't exist
    if (!siteNavigation || !button) {
        return;
    }

    const menu = siteNavigation.getElementsByTagName('ul')[0];

    // Hide menu toggle button if menu is empty
    if (!menu) {
        button.style.display = 'none';
        return;
    }

    // Toggle mobile menu
    button.addEventListener('click', function() {
        siteNavigation.classList.toggle('toggled');
        
        if (button.getAttribute('aria-expanded') === 'true') {
            button.setAttribute('aria-expanded', 'false');
        } else {
            button.setAttribute('aria-expanded', 'true');
        }
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!siteNavigation.contains(event.target) && !button.contains(event.target)) {
            siteNavigation.classList.remove('toggled');
            button.setAttribute('aria-expanded', 'false');
        }
    });
})();

// Smooth scroll implementation
let lastScrollPosition = window.scrollY;
let ticking = false;
let currentPosition = window.scrollY;
const smoothness = 0.5; // Lower = smoother (0.05 to 0.15 is good range)

function smoothScroll() {
    const difference = window.scrollY - currentPosition;
    currentPosition += difference * smoothness;
    
    window.scrollTo(0, currentPosition);
    
    if (Math.abs(difference) > 1) {
        requestAnimationFrame(smoothScroll);
    }
}

window.addEventListener('scroll', function() {
    lastScrollPosition = window.scrollY;
    if (!ticking) {
        requestAnimationFrame(function() {
            smoothScroll();
            ticking = false;
        });
        ticking = true;
    }
});

// Theme toggle functionality
function initThemeToggle() {
    const themeToggle = document.querySelector('.theme-toggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Check for saved theme preference or use system preference
    const currentTheme = localStorage.getItem('theme') || 
                        (prefersDarkScheme.matches ? 'dark' : 'light');
    
    // Set initial theme
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    themeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    initThemeToggle();
    
    const introMedia = document.querySelector('.intro-media');
    const introContent = document.querySelector('.intro-content');
    const textElements = introContent.querySelectorAll('.tagline, .main-title, .cta-text');
    let isFixed = true;
    let fixedPosition = null;
    
    function updateElements() {
        const scrollPosition = currentPosition; // Use smooth position instead of window.scrollY
        const windowHeight = window.innerHeight;
        
        // Calculate scroll percentage (0 to 1) but reach 1 at 30vh
        const scrollPercentage = Math.min(scrollPosition / (windowHeight * 0.3), 1);
        
        // Update video margins (starting from 1.5%)
        const margin = Math.max(0, 1.5 * (1 - scrollPercentage));
        introMedia.style.right = `${margin}%`;
        introMedia.style.width = `${100 - (margin * 2)}%`;
        
        // Handle text position
        if (scrollPosition < windowHeight * 0.3) {
            isFixed = true;
            introContent.style.position = 'fixed';
            introContent.style.top = '50%';
            introContent.style.left = '50%';
            introContent.style.transform = 'translate(-50%, -50%)';
        } else if (isFixed) {
            const rect = introContent.getBoundingClientRect();
            fixedPosition = rect.top + currentPosition;
            isFixed = false;
            
            introContent.style.position = 'absolute';
            introContent.style.top = `${fixedPosition}px`;
            introContent.style.left = '50%';
            introContent.style.transform = 'translateX(-50%)';
        }
        
        // Check each text element's position relative to the video
        textElements.forEach(element => {
            const elementRect = element.getBoundingClientRect();
            const videoRect = introMedia.getBoundingClientRect();
            
            const overlap = Math.max(0, 
                Math.min(elementRect.bottom, videoRect.bottom) - 
                Math.max(elementRect.top, videoRect.top)
            ) / elementRect.height;
            
            if (overlap > 0) {
                const gradientStop = (1 - overlap) * 100;
                element.style.background = `linear-gradient(to bottom, 
                    #000 ${gradientStop}%, 
                    #fff ${gradientStop}%
                )`;
                element.style.webkitBackgroundClip = 'text';
                element.style.webkitTextFillColor = 'transparent';
            } else {
                element.style.background = 'none';
                element.style.webkitBackgroundClip = 'initial';
                element.style.webkitTextFillColor = 'initial';
            }
        });
        
        requestAnimationFrame(updateElements);
    }
    
    updateElements();
    
    // Projects Data
    const projectsData = [
        {
            id: 1,
            title: "رافد - مجمع سكني",
            image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
            categories: ["شقق سكنية", "حي العقيق"]
        },
        {
            id: 2,
            title: "تل الرمال 2",
            image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c",
            categories: ["شقق سكنية", "حي العقيق"]
        },
        // ... باقي المشاريع
    ];

    // Initialize Projects Slider
    const projectsSwiper = new Swiper('.projects-swiper', {
        slidesPerView: 'auto',
        spaceBetween: 20,
        initialSlide: 0,
        speed: 1000,
        direction: 'horizontal',
        mousewheel: {
            enabled: true,
            sensitivity: 1,
            releaseOnEdges: true
        },
        keyboard: {
            enabled: true,
        },
        effect: 'slide',
        grabCursor: true,
        rtl: true,
        allowTouchMove: true,
        resistance: false,
        slidesOffsetBefore: 0,
        slidesOffsetAfter: 0,
        watchOverflow: true,
        observer: true,
        observeParents: true,
        breakpoints: {
            320: {
                slidesPerView: 1,
            },
            768: {
                slidesPerView: 2,
            },
            1024: {
                slidesPerView: 3,
            },
            1440: {
                slidesPerView: 4,
            }
        }
    });

    // Update slide counter on slide change
    projectsSwiper.on('slideChange', function () {
        const totalSlides = this.slides.length;
        const activeIndex = this.activeIndex;
        
        // Update all slide numbers
        this.slides.forEach((slide, index) => {
            const slideNumber = index + 1;
            const currentElement = slide.querySelector('.current');
            if (currentElement) {
                currentElement.textContent = String(slideNumber).padStart(2, '0');
            }
        });
    });

    // Update slide numbers on initialization
    projectsSwiper.on('init', function () {
        const totalSlides = this.slides.length;
        this.slides.forEach((slide, index) => {
            const slideNumber = index + 1;
            const currentElement = slide.querySelector('.current');
            if (currentElement) {
                currentElement.textContent = String(slideNumber).padStart(2, '0');
            }
        });
    });

    // Update active project details
    const updateActiveProjectDetails = (index) => {
        const activeProjectDetails = document.querySelector('.active-project-details');
        if (!activeProjectDetails) return;

        const project = projectsData[index];
        const total = projectsData.length;
        const currentNumber = total - index;

        activeProjectDetails.querySelector('.current').textContent = String(currentNumber).padStart(2, '0');
        activeProjectDetails.querySelector('.total').textContent = String(total).padStart(2, '0');
        activeProjectDetails.querySelector('.project-title').textContent = project.title;
        
        // Update categories
        const categoriesContainer = activeProjectDetails.querySelector('.project-categories');
        categoriesContainer.innerHTML = project.categories
            .map(cat => `<span class="category">${cat}</span>`)
            .join('');
    };

    // Update project details on slide change
    projectsSwiper.on('slideChange', function () {
        updateActiveProjectDetails(this.activeIndex);
    });

    // Update project details on initialization
    updateActiveProjectDetails(projectsSwiper.activeIndex);

    // Project Filtering
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    if (filterButtons.length && projectCards.length) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                // Add active class to clicked button
                button.classList.add('active');

                const filter = button.dataset.filter;

                projectCards.forEach(card => {
                    if (filter === 'all' || card.dataset.category === filter) {
                        card.style.display = 'block';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 10);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }

    // Project Search Form
    const citySelect = document.getElementById('city');
    const projectTypeSelect = document.getElementById('project-type');

    if (citySelect && projectTypeSelect) {
        [citySelect, projectTypeSelect].forEach(select => {
            select.addEventListener('change', filterProjects);
        });

        function filterProjects() {
            const selectedCity = citySelect.value;
            const selectedType = projectTypeSelect.value;

            projectCards.forEach(card => {
                const cardCity = card.dataset.city;
                const cardType = card.dataset.type;
                
                const cityMatch = !selectedCity || cardCity === selectedCity;
                const typeMatch = !selectedType || cardType === selectedType;

                if (cityMatch && typeMatch) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 10);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        }
    }
});


document.addEventListener('DOMContentLoaded', () => {
    gsap.registerPlugin(ScrollTrigger);

    // تحريك الصف العلوي
    gsap.to('.row-top', {
        x: '-50%',
        ease: 'none',
        scrollTrigger: {
            trigger: '.gallery-container',
            start: 'top center',
            end: 'bottom center',
            scrub: 1,
            onComplete: () => {
                gsap.set('.row-top', { x: '0%' });
            }
        }
    });

    // تحريك الصف السفلي في الاتجاه المعاكس
    gsap.to('.row-bottom', {
        x: '50%',
        ease: 'none',
        scrollTrigger: {
            trigger: '.gallery-container',
            start: 'top center',
            end: 'bottom center',
            scrub: 1,
            onComplete: () => {
                gsap.set('.row-bottom', { x: '0%' });
            }
        }
    });

    // إضافة تأثير التحويم على الصور
    const images = document.querySelectorAll('.image-wrapper img');
    images.forEach(img => {
        gsap.from(img, {
            scale: 1.2,
            scrollTrigger: {
                trigger: img,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1
            }
        });
    });
});

