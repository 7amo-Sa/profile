// Mobile Navigation Toggle
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 70; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar background change on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Contact form handling
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            message: formData.get('message')
        };

        try {
            const response = await fetch('/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();
            
            if (result.success) {
                // Show success message
                showNotification('Message sent successfully!', 'success');
                contactForm.reset();
            } else {
                showNotification('Failed to send message. Please try again.', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            showNotification('An error occurred. Please try again.', 'error');
        }
    });
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 90px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
        max-width: 400px;
    `;

    // Add to document
    document.body.appendChild(notification);

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 300);
        }
    }, 5000);
}

// Add notification animations to CSS
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        padding: 0;
        margin-left: auto;
        opacity: 0.8;
        transition: opacity 0.2s;
    }
    
    .notification-close:hover {
        opacity: 1;
    }
`;
document.head.appendChild(notificationStyles);

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.skill-item, .project-card, .stat-item, .contact-item');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });
});

// Typing animation for hero title
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing animation when page loads
document.addEventListener('DOMContentLoaded', () => {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        setTimeout(() => {
            typeWriter(heroTitle, originalText, 50);
        }, 500);
    }
});

// Project Filters (All / Web / Discord / Tools)
document.addEventListener('DOMContentLoaded', () => {
    const filterBar = document.querySelector('.filter-bar');
    if (!filterBar) return;

    function applyFilter(key) {
        const allCards = document.querySelectorAll('#projects .project-card, #discord .project-card');
        allCards.forEach(card => {
            const cat = card.getAttribute('data-category') || 'web';
            const show = key === 'all' || key === cat;
            card.style.display = show ? '' : 'none';
        });
    }

    filterBar.addEventListener('click', (e) => {
        const btn = e.target.closest('.filter-btn');
        if (!btn) return;
        e.preventDefault();
        const key = btn.getAttribute('data-filter');
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        applyFilter(key);
    });

    // Initialize to "all"
    applyFilter('all');
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        const rate = scrolled * -0.5;
        hero.style.transform = `translateY(${rate}px)`;
    }
});

// Skill bars animation
function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    skillBars.forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0%';
        setTimeout(() => {
            bar.style.width = width;
        }, 500);
    });
}

// Trigger skill bar animation when skills section is visible
const skillsSection = document.querySelector('#skills');
if (skillsSection) {
    const skillsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateSkillBars();
                skillsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    skillsObserver.observe(skillsSection);
}

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Scroll Progress Bar
const progressEl = document.getElementById('scrollProgress');
if (progressEl) {
    const updateProgress = () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        progressEl.style.width = progress + '%';
    };
    window.addEventListener('scroll', updateProgress);
    window.addEventListener('resize', updateProgress);
    updateProgress();
}

// Theme Toggle with persistence
const themeToggleBtn = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const THEME_KEY = 'preferredTheme';

function applyTheme(theme) {
    // For now we just toggle data-theme on html; CSS can be extended to support light
    document.documentElement.setAttribute('data-theme', theme);
    if (themeIcon) themeIcon.className = theme === 'light' ? 'fas fa-sun' : 'fas fa-moon';
}

function getSavedTheme() {
    try { return localStorage.getItem(THEME_KEY) || 'dark'; } catch { return 'dark'; }
}

function saveTheme(theme) {
    try { localStorage.setItem(THEME_KEY, theme); } catch {}
}

const initialTheme = getSavedTheme();
applyTheme(initialTheme);

if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme') || 'dark';
        const next = current === 'dark' ? 'light' : 'dark';
        applyTheme(next);
        saveTheme(next);
    });
}

// Scroll to Top Button
const scrollToTopBtn = document.getElementById('scrollToTop');
if (scrollToTopBtn) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollToTopBtn.classList.add('show');
        } else {
            scrollToTopBtn.classList.remove('show');
        }
    });

    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Language and Theme Persistence
function saveToLocalStorage(key, value) {
    try {
        localStorage.setItem(key, value);
    } catch (e) {
        console.log('LocalStorage not available');
    }
}

function getFromLocalStorage(key, defaultValue) {
    try {
        return localStorage.getItem(key) || defaultValue;
    } catch (e) {
        return defaultValue;
    }
}

// Save language preference
document.addEventListener('DOMContentLoaded', () => {
    const currentLang = document.documentElement.lang;
    saveToLocalStorage('preferredLanguage', currentLang);
    
    // Apply saved theme if available
    const savedTheme = getFromLocalStorage('preferredTheme', 'dark');
    if (savedTheme !== 'dark') {
        // Apply theme logic here if needed
        console.log('Saved theme:', savedTheme);
    }
});

// Add loaded class styles
const loadingStyles = document.createElement('style');
loadingStyles.textContent = `
    body {
        opacity: 0;
        transition: opacity 0.5s ease-in-out;
    }
    
    body.loaded {
        opacity: 1;
    }
`;
document.head.appendChild(loadingStyles);

// Discord Details Modal Logic (extended for generic project view)
(function() {
    const modal = document.getElementById('discordModal');
    if (!modal) return;

    const titleEl = document.getElementById('discordModalTitle');
    const descEl = document.getElementById('discordModalDescription');
    const featuresSection = document.getElementById('discordModalFeatures');
    const featuresList = document.getElementById('discordModalFeaturesList');
    const techSection = document.getElementById('discordModalTech');
    const techTags = document.getElementById('discordModalTechTags');
    const statsSection = document.getElementById('discordModalStats');
    const statsGrid = document.getElementById('discordModalStatsGrid');
    const closeBtn = document.getElementById('discordModalClose');

    function openModal() {
        modal.style.display = 'block';
        setTimeout(() => modal.classList.add('open'), 10);
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.classList.remove('open');
        setTimeout(() => { modal.style.display = 'none'; }, 200);
        document.body.style.overflow = '';
    }

    closeBtn && closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    function safeParse(json, fallback) {
        try { return JSON.parse(json); } catch (_) { return fallback; }
    }

    function handleOpen(btn) {
        if (!btn) return;
        const title = btn.getAttribute('data-title') || '';
        const description = btn.getAttribute('data-description') || '';
        const features = safeParse(btn.getAttribute('data-features') || '[]', []);
        const tech = safeParse(btn.getAttribute('data-tech') || '[]', []);
        const stats = safeParse(btn.getAttribute('data-stats') || '{}', {});

        titleEl.textContent = title;
        descEl.textContent = description;

        // Features
        featuresList.innerHTML = '';
        if (features && features.length) {
            featuresSection.style.display = '';
            features.forEach(item => {
                const li = document.createElement('li');
                li.innerHTML = `<i class="fas fa-check"></i> ${item}`;
                featuresList.appendChild(li);
            });
        } else {
            featuresSection.style.display = 'none';
        }

        // Tech
        techTags.innerHTML = '';
        if (tech && tech.length) {
            techSection.style.display = '';
            tech.forEach(t => {
                const span = document.createElement('span');
                span.className = 'tech-tag';
                span.textContent = t;
                techTags.appendChild(span);
            });
        } else {
            techSection.style.display = 'none';
        }

        // Stats
        statsGrid.innerHTML = '';
        const entries = Object.entries(stats || {});
        if (entries.length) {
            statsSection.style.display = '';
            const labelMap = {
                servers: 'Servers', users: 'Users', uptime: 'Uptime', tickets: 'Tickets',
                commands: 'Commands', tournaments: 'Tournaments', participants: 'Participants',
                transactions: 'Transactions', songs: 'Songs'
            };
            const labelArMap = {
                servers: 'سيرفرات', users: 'مستخدمين', uptime: 'وقت التشغيل', tickets: 'تذاكر',
                commands: 'أوامر', tournaments: 'بطولات', participants: 'مشاركين',
                transactions: 'معاملات', songs: 'أغاني'
            };
            const isAr = document.documentElement.lang === 'ar';
            entries.forEach(([key, value]) => {
                const div = document.createElement('div');
                div.className = 'stat-item';
                const label = (isAr ? labelArMap : labelMap)[key] || key;
                div.innerHTML = `<span class="stat-value">${value}</span><span class="stat-label">${label}</span>`;
                statsGrid.appendChild(div);
            });
        } else {
            statsSection.style.display = 'none';
        }

        openModal();
    }

    // Delegated click handling so it always works
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.discord-view-btn, .project-view-btn');
        if (btn) {
            e.preventDefault();
            handleOpen(btn);
        }
    });
})();