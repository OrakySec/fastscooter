document.addEventListener("DOMContentLoaded", () => {

    // --- 1. PRELOADER INTRO ---
    const preloader = document.getElementById('preloader');
    const preloaderBar = document.getElementById('preloader-bar');
    const preloaderVal = document.getElementById('preloader-val');

    if (preloader && preloaderBar && preloaderVal) {
        let count = { val: 0 };
        gsap.to(count, {
            val: 100,
            duration: 0.9,
            ease: "power2.out",
            onUpdate: () => {
                const rounded = Math.round(count.val);
                preloaderVal.innerText = rounded + '%';
                preloaderBar.style.width = rounded + '%';
            },
            onComplete: () => {
                gsap.to(preloader, {
                    opacity: 0,
                    duration: 0.5,
                    ease: "power3.inOut",
                    onComplete: () => {
                        preloader.style.display = 'none';
                        initScrollAnimations();
                    }
                });
            }
        });
    } else {
        initScrollAnimations();
    }

    // --- MOBILE MENU DRAWER TOGGLE ---
    const mobileToggleBtn = document.getElementById('mobile-toggle-btn');
    const mobileNavDrawer = document.getElementById('mobile-nav-drawer');

    if (mobileToggleBtn && mobileNavDrawer) {
        mobileToggleBtn.addEventListener('click', () => {
            mobileNavDrawer.classList.toggle('active');
            const isOpen = mobileNavDrawer.classList.contains('active');
            mobileToggleBtn.innerHTML = isOpen ? `<i data-feather="x"></i>` : `<i data-feather="menu"></i>`;
            if (typeof feather !== 'undefined') feather.replace();
        });

        mobileNavDrawer.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileNavDrawer.classList.remove('active');
                mobileToggleBtn.innerHTML = `<i data-feather="menu"></i>`;
                if (typeof feather !== 'undefined') feather.replace();
            });
        });
    }

    // --- 2. HERO SHOWROOM CONFIGURADOR (MODEL SWITCHER) ---
    const HERO_MODELS = {
        s15: {
            title: "SCOOTER S15 1000W",
            badge: "FLAGSHIP 2026",
            desc: "Bateria de alta capacidade para até 90 km de autonomia",
            img: "prod_s15.jpeg",
            power: "1000W",
            range: "Até 90 km",
            battery: "60V 30Ah",
            link: "produto.html?id=s15",
            msg: "Olá! Gostaria de saber mais sobre a Scooter S15."
        },
        a5: {
            title: "SCOOTER A5 (2 LUGARES)",
            badge: "SEM CNH & BATERIA REMOVÍVEL",
            desc: "Capacidade para 2 pessoas, bateria removível e alarme",
            img: "prod_a5.jpeg",
            power: "1000W | 60V",
            range: "Até 60 km",
            battery: "Lítio Removível 24Ah",
            link: "produto.html?id=a5",
            msg: "Olá! Gostaria de saber mais sobre a Scooter A5 1000W."
        },
        g12: {
            title: "IRUN G12 URBANA",
            badge: "DESIGN SPORT",
            desc: "Ciclística ágil, painel digital e torque de 125 N.m",
            img: "prod_g12.jpeg",
            power: "1000W",
            range: "Até 90 km",
            battery: "60V 30Ah",
            link: "produto.html?id=g12",
            msg: "Olá! Gostaria de saber mais sobre a IRUN G12."
        }
    };

    const modelBtns = document.querySelectorAll('.hero-model-btn');
    const heroTitle = document.getElementById('hero-model-title');
    const heroBadge = document.getElementById('hero-stage-badge');
    const heroDesc = document.getElementById('hero-model-desc');
    const heroImg = document.getElementById('hero-model-img');
    const heroPower = document.getElementById('hero-tel-power');
    const heroRange = document.getElementById('hero-tel-range');
    const heroBattery = document.getElementById('hero-tel-battery');
    const heroDetailLink = document.getElementById('hero-detail-link');
    const heroWaLink = document.getElementById('hero-wa-link');

    if (modelBtns.length && heroTitle) {
        modelBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                modelBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const modelKey = btn.getAttribute('data-model');
                const data = HERO_MODELS[modelKey];
                if (!data) return;

                // Animate change
                gsap.to([heroImg, heroTitle, heroDesc], {
                    opacity: 0,
                    y: -10,
                    duration: 0.2,
                    onComplete: () => {
                        heroTitle.textContent = data.title;
                        heroBadge.textContent = data.badge;
                        heroDesc.textContent = data.desc;
                        heroImg.src = data.img;
                        heroImg.alt = data.title;
                        heroPower.textContent = data.power;
                        heroRange.textContent = data.range;
                        heroBattery.textContent = data.battery;

                        if (heroDetailLink) heroDetailLink.href = data.link;
                        if (heroWaLink) {
                            heroWaLink.href = `https://api.whatsapp.com/send?phone=5581996356458&text=${encodeURIComponent(data.msg)}`;
                        }

                        gsap.to([heroImg, heroTitle, heroDesc], {
                            opacity: 1,
                            y: 0,
                            duration: 0.3,
                            ease: "power2.out"
                        });
                    }
                });
            });
        });
    }

    // --- 3. CALCULADORA DE ECONOMIA URBANA ---
    const kmSlider = document.getElementById('km-slider');
    const kmDisplay = document.getElementById('km-display');
    const gasCostElem = document.getElementById('gas-cost');
    const electricCostElem = document.getElementById('electric-cost');
    const yearSavingsElem = document.getElementById('year-savings');

    function updateCalculator() {
        if (!kmSlider) return;
        const kmPerDay = parseInt(kmSlider.value, 10);
        kmDisplay.textContent = `${kmPerDay} km/dia`;

        // Cálculo Realista de Custos no Brasil:
        // Consumo Moto Gasolina: ~30 km/L | Gasolina: R$ 6,20/L
        // 30 dias/mês * kmPerDay / 30 * 6.20
        const gasCostMonth = Math.round((kmPerDay * 30 / 30) * 6.20);
        
        // Scooter Elétrica: ~1.5 kWh a cada 100km | Tarifa: ~R$ 0.90/kWh
        // Gasto elétrico no mês:
        const electricCostMonth = Math.max(12, Math.round((kmPerDay * 30 * 0.02) * 0.90));
        
        const monthlySavings = gasCostMonth - electricCostMonth;
        const yearlySavings = monthlySavings * 12;

        gasCostElem.textContent = `R$ ${gasCostMonth.toLocaleString('pt-BR')}`;
        electricCostElem.textContent = `R$ ${electricCostMonth.toLocaleString('pt-BR')}`;
        yearSavingsElem.textContent = `R$ ${yearlySavings.toLocaleString('pt-BR')},00 / ano`;
    }

    if (kmSlider) {
        kmSlider.addEventListener('input', updateCalculator);
        updateCalculator();
    }

    // --- 4. CATALOG FILTER PILLS ---
    const filterBtns = document.querySelectorAll('.filter-pill-btn');
    const scooterCards = document.querySelectorAll('.scooter-card');

    if (filterBtns.length && scooterCards.length) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filter = btn.getAttribute('data-filter');

                scooterCards.forEach(card => {
                    const cardCat = card.getAttribute('data-category');
                    if (filter === 'all' || cardCat === filter) {
                        card.style.display = 'flex';
                        gsap.fromTo(card, { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.35 });
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

    // --- 5. FAQ ACCORDION ---
    const faqBtns = document.querySelectorAll('.faq-btn-trigger');
    faqBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const card = btn.parentElement;
            const drawer = btn.nextElementSibling;

            // Fechar os demais
            document.querySelectorAll('.faq-card').forEach(other => {
                if (other !== card) {
                    other.classList.remove('active');
                    const otherDrawer = other.querySelector('.faq-drawer');
                    if (otherDrawer) otherDrawer.style.maxHeight = null;
                }
            });

            // Alternar estado
            card.classList.toggle('active');
            if (card.classList.contains('active')) {
                drawer.style.maxHeight = drawer.scrollHeight + 40 + "px";
            } else {
                drawer.style.maxHeight = null;
            }
        });
    });

    // --- 6. SCROLL ANIMATIONS (GSAP) ---
    function initScrollAnimations() {
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
        
        gsap.registerPlugin(ScrollTrigger);

        const reveals = document.querySelectorAll('.gs-reveal');
        reveals.forEach(el => {
            gsap.fromTo(el, 
                { opacity: 0, y: 30 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: el,
                        start: "top 88%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        });
    }

    if (typeof feather !== 'undefined') {
        feather.replace();
    }
});
