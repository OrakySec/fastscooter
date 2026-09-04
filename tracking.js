/**
 * ==============================================================================
 * FASTSCOOTER - TRACKING SUITE (META ADS + GOOGLE ADS + GA4 + GTM)
 * ==============================================================================
 * Arquitetura de rastreamento de alta precisão para conversões e mensuração.
 * Compatível com Facebook Pixel, Conversions API, Google Ads Tag e GA4.
 */

// --- 1. CONFIGURAÇÃO CENTRALIZADA DE IDS ---
// Basta colar os seus IDs reais abaixo quando for publicar suas campanhas.
const FAST_TRACKING_CONFIG = {
    // Meta Ads (Facebook / Instagram Pixel ID)
    // Exemplo: '123456789012345'
    META_PIXEL_ID: 'YOUR_META_PIXEL_ID',

    // Google Analytics 4 (GA4 Measurement ID)
    // Exemplo: 'G-XXXXXXXXXX'
    GA4_MEASUREMENT_ID: 'YOUR_GA4_ID',

    // Google Ads (Conversion Tracking ID)
    // Exemplo: 'AW-XXXXXXXXXX'
    GOOGLE_ADS_ID: 'YOUR_GOOGLE_ADS_ID',

    // Google Ads Conversion Label para WhatsApp / Lead (Opcional)
    // Exemplo: 'AbCdEfGhIjK'
    GOOGLE_ADS_CONVERSION_LABEL: 'YOUR_CONVERSION_LABEL',

    // Google Tag Manager Container ID (Opcional, se preferir via GTM)
    // Exemplo: 'GTM-XXXXXXX'
    GTM_CONTAINER_ID: '',

    // Modo de Depuração (Exibe todos os disparos no Console F12 em tempo real)
    DEBUG_MODE: true
};

// Inicializa dataLayer global para o Google Tag Manager
window.dataLayer = window.dataLayer || [];

function gtag() {
    window.dataLayer.push(arguments);
}

// --- 2. INICIALIZADOR SEGURO DOS SDKS ---
(function initTrackingSDKs() {
    const isMetaConfigured = FAST_TRACKING_CONFIG.META_PIXEL_ID && !FAST_TRACKING_CONFIG.META_PIXEL_ID.includes('YOUR_');
    const isGoogleConfigured = (FAST_TRACKING_CONFIG.GA4_MEASUREMENT_ID && !FAST_TRACKING_CONFIG.GA4_MEASUREMENT_ID.includes('YOUR_')) ||
                               (FAST_TRACKING_CONFIG.GOOGLE_ADS_ID && !FAST_TRACKING_CONFIG.GOOGLE_ADS_ID.includes('YOUR_'));
    const isGTMConfigured = FAST_TRACKING_CONFIG.GTM_CONTAINER_ID && FAST_TRACKING_CONFIG.GTM_CONTAINER_ID.startsWith('GTM-');

    // A) Meta Pixel SDK
    if (!window.fbq) {
        (function(f, b, e, v, n, t, s) {
            if (f.fbq) return;
            n = f.fbq = function() {
                n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
            };
            if (!f._fbq) f._fbq = n;
            n.push = n;
            n.loaded = !0;
            n.version = '2.0';
            n.queue = [];
            t = b.createElement(e);
            t.async = !0;
            t.src = v;
            s = b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t, s);
        })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    }

    if (isMetaConfigured) {
        fbq('init', FAST_TRACKING_CONFIG.META_PIXEL_ID);
        fbq('track', 'PageView');
        if (FAST_TRACKING_CONFIG.DEBUG_MODE) {
            console.log('%c[Meta Pixel] Inicializado com ID: ' + FAST_TRACKING_CONFIG.META_PIXEL_ID, 'color: #1877F2; font-weight: bold;');
        }
    } else if (FAST_TRACKING_CONFIG.DEBUG_MODE) {
        console.log('%c[Meta Pixel Mock] Pronto para receber seu ID no FAST_TRACKING_CONFIG.', 'color: #1877F2;');
    }

    // B) Google Tag (gtag.js)
    if (isGoogleConfigured) {
        const primaryGoogleId = FAST_TRACKING_CONFIG.GOOGLE_ADS_ID.startsWith('AW-') ? 
                                FAST_TRACKING_CONFIG.GOOGLE_ADS_ID : 
                                FAST_TRACKING_CONFIG.GA4_MEASUREMENT_ID;

        const gScript = document.createElement('script');
        gScript.async = true;
        gScript.src = 'https://www.googletagmanager.com/gtag/js?id=' + primaryGoogleId;
        document.head.appendChild(gScript);

        gtag('js', new Date());

        if (FAST_TRACKING_CONFIG.GA4_MEASUREMENT_ID && !FAST_TRACKING_CONFIG.GA4_MEASUREMENT_ID.includes('YOUR_')) {
            gtag('config', FAST_TRACKING_CONFIG.GA4_MEASUREMENT_ID, { send_page_view: true });
        }
        if (FAST_TRACKING_CONFIG.GOOGLE_ADS_ID && !FAST_TRACKING_CONFIG.GOOGLE_ADS_ID.includes('YOUR_')) {
            gtag('config', FAST_TRACKING_CONFIG.GOOGLE_ADS_ID);
        }

        if (FAST_TRACKING_CONFIG.DEBUG_MODE) {
            console.log('%c[Google Tag] Inicializado com sucesso!', 'color: #EA4335; font-weight: bold;');
        }
    } else if (FAST_TRACKING_CONFIG.DEBUG_MODE) {
        console.log('%c[Google Tag Mock] Pronto para receber seu ID no FAST_TRACKING_CONFIG.', 'color: #EA4335;');
    }

    // C) Google Tag Manager Container (Opcional)
    if (isGTMConfigured) {
        (function(w, d, s, l, i) {
            w[l] = w[l] || [];
            w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
            var f = d.getElementsByTagName(s)[0],
                j = d.createElement(s),
                dl = l != 'dataLayer' ? '&l=' + l : '';
            j.async = true;
            j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
            f.parentNode.insertBefore(j, f);
        })(window, document, 'script', 'dataLayer', FAST_TRACKING_CONFIG.GTM_CONTAINER_ID);
    }
})();

// --- 3. MÉTODOS DE RASTREAMENTO EXPOSTOS (API FASTTRACKING) ---
window.FastTracking = {
    trackPageView: function(pageName) {
        const title = pageName || document.title;
        const path = window.location.pathname;

        window.dataLayer.push({
            event: 'page_view',
            page_title: title,
            page_location: window.location.href,
            page_path: path
        });

        if (typeof fbq === 'function') {
            fbq('track', 'PageView');
        }

        if (FAST_TRACKING_CONFIG.DEBUG_MODE) {
            console.log('%c[Tracking] PageView: ' + title, 'background: #090A0C; color: #00D06C; padding: 2px 6px; border-radius: 4px;');
        }
    },

    trackViewContent: function(product) {
        if (!product) return;

        const payload = {
            id: product.id || 'scooter-geral',
            name: product.name || 'Scooter Elétrica FastScooter',
            category: product.category || 'Scooters Elétricas',
            price: Number(product.price) || 0,
            currency: 'BRL'
        };

        window.dataLayer.push({
            event: 'view_item',
            ecommerce: {
                currency: 'BRL',
                value: payload.price,
                items: [{
                    item_id: payload.id,
                    item_name: payload.name,
                    item_category: payload.category,
                    price: payload.price,
                    quantity: 1
                }]
            }
        });

        if (typeof fbq === 'function') {
            fbq('track', 'ViewContent', {
                content_name: payload.name,
                content_ids: [payload.id],
                content_type: 'product',
                value: payload.price,
                currency: 'BRL'
            });
        }

        if (typeof gtag === 'function') {
            gtag('event', 'view_item', {
                currency: 'BRL',
                value: payload.price,
                items: [{
                    item_id: payload.id,
                    item_name: payload.name,
                    price: payload.price
                }]
            });
        }

        if (FAST_TRACKING_CONFIG.DEBUG_MODE) {
            console.log('%c[Tracking: ViewContent] ' + payload.name + ' - R$ ' + payload.price, 'background: #2563EB; color: #FFF; padding: 2px 6px; border-radius: 4px;', payload);
        }
    },

    trackInitiateCheckout: function(product, source) {
        const payload = {
            id: product?.id || 'scooter-geral',
            name: product?.name || 'Scooter Elétrica FastScooter',
            price: Number(product?.price) || 0,
            currency: 'BRL',
            source: source || 'catalogo_comprar'
        };

        window.dataLayer.push({
            event: 'begin_checkout',
            checkout_source: payload.source,
            ecommerce: {
                currency: 'BRL',
                value: payload.price,
                items: [{
                    item_id: payload.id,
                    item_name: payload.name,
                    price: payload.price,
                    quantity: 1
                }]
            }
        });

        if (typeof fbq === 'function') {
            fbq('track', 'InitiateCheckout', {
                content_name: payload.name,
                content_ids: [payload.id],
                content_type: 'product',
                value: payload.price,
                currency: 'BRL',
                source: payload.source
            });
        }

        if (typeof gtag === 'function') {
            gtag('event', 'begin_checkout', {
                currency: 'BRL',
                value: payload.price,
                items: [{
                    item_id: payload.id,
                    item_name: payload.name,
                    price: payload.price
                }]
            });

            if (FAST_TRACKING_CONFIG.GOOGLE_ADS_ID && FAST_TRACKING_CONFIG.GOOGLE_ADS_CONVERSION_LABEL && !FAST_TRACKING_CONFIG.GOOGLE_ADS_CONVERSION_LABEL.includes('YOUR_')) {
                gtag('event', 'conversion', {
                    send_to: FAST_TRACKING_CONFIG.GOOGLE_ADS_ID + '/' + FAST_TRACKING_CONFIG.GOOGLE_ADS_CONVERSION_LABEL,
                    value: payload.price,
                    currency: 'BRL'
                });
            }
        }

        if (FAST_TRACKING_CONFIG.DEBUG_MODE) {
            console.log('%c[Tracking: InitiateCheckout] ' + payload.name + ' via ' + payload.source, 'background: #00D06C; color: #090A0C; font-weight: bold; padding: 2px 6px; border-radius: 4px;', payload);
        }
    },

    trackLead: function(leadType, source, details) {
        const payload = {
            lead_type: leadType || 'whatsapp_contact',
            source: source || 'geral',
            details: details || {},
            timestamp: new Date().toISOString()
        };

        window.dataLayer.push({
            event: 'generate_lead',
            lead_type: payload.lead_type,
            lead_source: payload.source,
            lead_details: payload.details
        });

        if (typeof fbq === 'function') {
            fbq('track', 'Lead', {
                content_category: payload.lead_type,
                content_name: payload.source,
                currency: 'BRL'
            });
            fbq('trackCustom', 'WhatsAppClick', {
                source: payload.source,
                type: payload.lead_type
            });
        }

        if (typeof gtag === 'function') {
            gtag('event', 'generate_lead', {
                event_category: 'contact',
                event_label: payload.source
            });

            if (FAST_TRACKING_CONFIG.GOOGLE_ADS_ID && FAST_TRACKING_CONFIG.GOOGLE_ADS_CONVERSION_LABEL && !FAST_TRACKING_CONFIG.GOOGLE_ADS_CONVERSION_LABEL.includes('YOUR_')) {
                gtag('event', 'conversion', {
                    send_to: FAST_TRACKING_CONFIG.GOOGLE_ADS_ID + '/' + FAST_TRACKING_CONFIG.GOOGLE_ADS_CONVERSION_LABEL
                });
            }
        }

        if (FAST_TRACKING_CONFIG.DEBUG_MODE) {
            console.log('%c[Tracking: Lead / WhatsApp] ' + payload.source + ' (' + payload.lead_type + ')', 'background: #25D366; color: #FFF; font-weight: bold; padding: 2px 6px; border-radius: 4px;', payload);
        }
    },

    trackCalculateEconomy: function(kmDay, annualSavings) {
        const payload = {
            km_per_day: kmDay,
            annual_savings: annualSavings
        };

        window.dataLayer.push({
            event: 'calculate_economy',
            km_per_day: kmDay,
            estimated_savings_year: annualSavings
        });

        if (typeof fbq === 'function') {
            fbq('trackCustom', 'CalculateEconomy', payload);
        }

        if (typeof gtag === 'function') {
            gtag('event', 'calculate_economy', payload);
        }

        if (FAST_TRACKING_CONFIG.DEBUG_MODE) {
            console.log('%c[Tracking: Calculadora] ' + kmDay + ' km/dia -> Economia de ' + annualSavings, 'background: #F59E0B; color: #000; padding: 2px 6px; border-radius: 4px;');
        }
    },

    trackCustomEvent: function(eventName, params) {
        const p = params || {};
        window.dataLayer.push({ event: eventName, ...p });
        if (typeof fbq === 'function') fbq('trackCustom', eventName, p);
        if (typeof gtag === 'function') gtag('event', eventName, p);

        if (FAST_TRACKING_CONFIG.DEBUG_MODE) {
            console.log('%c[Tracking: Custom ' + eventName + ']', 'background: #8B5CF6; color: #FFF; padding: 2px 6px; border-radius: 4px;', p);
        }
    }
};

// --- 4. DELEGAÇÃO GLOBAL DE EVENTOS (AUTODETECÇÃO DE CLIQUES) ---
document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('click', (e) => {
        const target = e.target.closest('a, button');
        if (!target) return;

        const href = target.getAttribute('href') || '';
        const isWhatsApp = href.includes('whatsapp.com') || href.includes('wa.me') || target.classList.contains('btn-electric') || target.classList.contains('floating-whatsapp');
        const isPhone = href.startsWith('tel:');
        const isBuyAction = target.getAttribute('data-track') === 'buy' || target.innerText.trim().toLowerCase() === 'comprar' || target.innerText.trim().toLowerCase().includes('comprar no whatsapp');

        // A) Intenção de Compra E-Commerce (InitiateCheckout)
        if (isBuyAction) {
            const prodId = target.getAttribute('data-product-id') || document.querySelector('[data-current-product-id]')?.getAttribute('data-current-product-id') || 'scooter-geral';
            const prodName = target.getAttribute('data-product-name') || document.querySelector('.p-headline-title, .scooter-name')?.innerText.trim() || 'Scooter Elétrica FastScooter';
            const prodPrice = target.getAttribute('data-product-price') || 8990;
            const source = target.getAttribute('data-track-source') || 'botao_comprar';

            window.FastTracking.trackInitiateCheckout({
                id: prodId,
                name: prodName,
                price: prodPrice
            }, source);
            return;
        }

        // B) Cliques de WhatsApp e Contato Geral (Lead)
        if (isWhatsApp) {
            let source = target.getAttribute('data-track-source');

            if (!source) {
                if (target.closest('.header') || target.classList.contains('btn-header-wa')) {
                    source = 'header_whatsapp';
                } else if (target.closest('.topbar')) {
                    source = 'topbar_whatsapp';
                } else if (target.closest('.hero-showroom')) {
                    source = 'hero_whatsapp';
                } else if (target.closest('.calc-section')) {
                    source = 'calc_whatsapp';
                } else if (target.closest('.workshop-section')) {
                    source = 'workshop_schedule_whatsapp';
                } else if (target.closest('.floating-whatsapp') || target.classList.contains('floating-whatsapp')) {
                    source = 'floating_button_whatsapp';
                } else if (target.closest('.catalog-footer-cta')) {
                    source = 'catalog_all_models_whatsapp';
                } else {
                    source = 'generic_whatsapp';
                }
            }

            window.FastTracking.trackLead('whatsapp_click', source, {
                button_text: target.innerText.trim(),
                page_url: window.location.href
            });
            return;
        }

        // C) Cliques em Telefone Direto
        if (isPhone) {
            window.FastTracking.trackLead('phone_call', 'phone_link', { phone: href });
            return;
        }

        // D) Clique em Test-Ride
        if (target.innerText.toLowerCase().includes('test-ride')) {
            window.FastTracking.trackLead('test_ride_interest', 'test_ride_cta', {
                location: 'Boa Viagem - Recife'
            });
        }
    });

    const kmSlider = document.getElementById('km-slider');
    let sliderTimeout = null;

    if (kmSlider) {
        kmSlider.addEventListener('input', () => {
            clearTimeout(sliderTimeout);
            sliderTimeout = setTimeout(() => {
                const km = kmSlider.value;
                const savingsEl = document.getElementById('year-savings');
                const savings = savingsEl ? savingsEl.innerText : '';
                window.FastTracking.trackCalculateEconomy(km, savings);
            }, 1200);
        });
    }

    const colorPills = document.querySelectorAll('.p-color-pill');
    colorPills.forEach(pill => {
        pill.addEventListener('click', () => {
            const colorName = pill.innerText.trim();
            window.FastTracking.trackCustomEvent('CustomizeColor', {
                color: colorName
            });
        });
    });
});
