import '../css/main.css';

// ===== Modal Logic =====
const modal = document.getElementById('ctaModal');
const container = document.getElementById('modalContainer');
const modalTitle = document.getElementById('modalTitle');
const serviceSubject = document.getElementById('serviceSubject');

window.openModal = function(subject = 'Консультація') {
    if(modalTitle) modalTitle.innerText = subject;
    if(serviceSubject) serviceSubject.value = subject;
    if(modal) {
        modal.classList.remove('hidden');
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                modal.classList.remove('opacity-0');
                if(container) container.classList.remove('scale-95');
            });
        });
        document.body.style.overflow = 'hidden';
    }
}

window.closeModal = function() {
    if(modal) modal.classList.add('opacity-0');
    if(container) container.classList.add('scale-95');
    setTimeout(() => {
        if(modal) modal.classList.add('hidden');
        document.body.style.overflow = '';
    }, 300);
}

if (modal) {
    modal.addEventListener('click', function(e) {
        if (e.target === modal) window.closeModal();
    });
}

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal && !modal.classList.contains('hidden')) window.closeModal();
});

window.handleFormSubmit = function(event) {
    event.preventDefault();
    const btn = event.target.querySelector('button[type="submit"]');
    const originalHTML = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-check mr-2"></i> Заявку прийнято!';
    btn.style.background = 'linear-gradient(135deg, #22C55E, #16A34A)';
    btn.disabled = true;

    setTimeout(() => {
        window.closeModal();
        event.target.reset();
        setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.style.background = '';
            btn.disabled = false;
        }, 400);
    }, 1500);
}

// ===== Mobile Nav =====
const mobileNav = document.getElementById('mobileNav');
const menuIcon = document.getElementById('menuIcon');
let mobileNavOpen = false;

window.toggleMobileNav = function() {
    mobileNavOpen = !mobileNavOpen;
    if(mobileNav) mobileNav.classList.toggle('open', mobileNavOpen);
    if(menuIcon) menuIcon.className = mobileNavOpen ? 'fa-solid fa-xmark text-lg' : 'fa-solid fa-bars text-lg';
}

window.closeMobileNav = function() {
    mobileNavOpen = false;
    if(mobileNav) mobileNav.classList.remove('open');
    if(menuIcon) menuIcon.className = 'fa-solid fa-bars text-lg';
}

// ===== Header Shadow on Scroll =====
const header = document.getElementById('siteHeader');
let lastScrollY = 0;

window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (header) {
        if (scrollY > 50) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }
    }
    lastScrollY = scrollY;
}, { passive: true });

// ===== Scroll Reveal (IntersectionObserver) =====
const revealElements = document.querySelectorAll('.reveal');
if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
}

// ===== Counter Animation =====
const counters = document.querySelectorAll('.counter-value');
if (counters.length > 0) {
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.dataset.target);
                const suffix = el.dataset.suffix || '';
                const duration = 2000;
                const startTime = performance.now();

                function updateCounter(currentTime) {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    // Ease out cubic
                    const eased = 1 - Math.pow(1 - progress, 3);
                    const current = Math.round(eased * target);
                    el.textContent = current + suffix;
                    if (progress < 1) {
                        requestAnimationFrame(updateCounter);
                    }
                }

                requestAnimationFrame(updateCounter);
                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));
}
