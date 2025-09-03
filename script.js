// TechStore E-commerce - Interactive JavaScript
// Advanced functionality for modern e-commerce experience

class TechStore {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('cart')) || [];
        this.currentFilter = 'all';
        this.isLoading = false;
        
        this.init();
    }
    
    init() {
        this.initEventListeners();
        this.initScrollAnimations();
        this.initCountdown();
        this.updateCartUI();
        this.initIntersectionObserver();
        this.initProductFilters();
        this.initQuickView();
        this.initTooltips();
        this.loadTestData();
    }
    
    // Event Listeners
    initEventListeners() {
        // Header scroll effect
        window.addEventListener('scroll', this.handleScroll.bind(this));
        
        // Mobile menu toggle
        const menuToggle = document.querySelector('.menu-toggle');
        const navMenu = document.querySelector('.nav-menu');
        
        if (menuToggle && navMenu) {
            menuToggle.addEventListener('click', () => {
                menuToggle.classList.toggle('active');
                navMenu.classList.toggle('open');
            });
        }
        
        // Cart functionality
        document.addEventListener('click', (e) => {
            if (e.target.closest('.cart-icon')) {
                this.toggleCart();
            }
            
            if (e.target.closest('.cart-close') || e.target.closest('.cart-overlay')) {
                this.closeCart();
            }
            
            if (e.target.closest('.add-to-cart')) {
                e.preventDefault();
                const productId = e.target.closest('.product-card').dataset.productId;
                this.addToCart(productId);
            }
            
            if (e.target.closest('.btn-quick-view')) {
                e.preventDefault();
                const productId = e.target.closest('.product-card').dataset.productId;
                this.showQuickView(productId);
            }
            
            if (e.target.closest('.modal-close') || e.target.closest('.modal-overlay')) {
                this.closeQuickView();
            }
            
            if (e.target.closest('.filter-btn')) {
                const filter = e.target.closest('.filter-btn').dataset.filter;
                this.applyFilter(filter);
            }
            
            if (e.target.closest('.toast-close')) {
                e.target.closest('.toast').remove();
            }
        });
        
        // Form submissions
        document.addEventListener('submit', (e) => {
            if (e.target.classList.contains('newsletter-form')) {
                e.preventDefault();
                this.handleNewsletterSubmit(e.target);
            }
            
            if (e.target.classList.contains('contact-form')) {
                e.preventDefault();
                this.handleContactSubmit(e.target);
            }
        });
        
        // Close cart with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeCart();
                this.closeQuickView();
            }
        });
    }
    
    // Scroll Effects
    handleScroll() {
        const header = document.querySelector('.header');
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
    
    // Intersection Observer for Animations
    initIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        // Observe elements for scroll animations
        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            observer.observe(el);
        });
        
        // Animate stats when visible
        const statsSection = document.querySelector('.stats');
        if (statsSection) {
            observer.observe(statsSection);
            statsSection.addEventListener('animateStats', this.animateStats.bind(this));
        }
    }
    
    // Animate statistics counters
    animateStats() {
        const statNumbers = document.querySelectorAll('.stat-number');
        
        statNumbers.forEach(stat => {
            const target = parseInt(stat.dataset.target);
            const duration = 2000;
            const startTime = performance.now();
            
            const animate = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                const easeOutCubic = 1 - Math.pow(1 - progress, 3);
                const current = Math.round(target * easeOutCubic);
                
                stat.textContent = this.formatNumber(current);
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                }
            };
            
            requestAnimationFrame(animate);
        });
    }
    
    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M+';
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(0) + 'K+';
        }
        return num.toLocaleString();
    }
    
    // Countdown Timer
    initCountdown() {
        const countdownElements = document.querySelectorAll('.countdown-item');
        if (countdownElements.length === 0) return;
        
        // Set countdown to 24 hours from now
        const endDate = new Date();
        endDate.setHours(endDate.getHours() + 24);
        
        const updateCountdown = () => {
            const now = new Date().getTime();
            const distance = endDate.getTime() - now;
            
            if (distance > 0) {
                const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((distance % (1000 * 60)) / 1000);
                
                this.updateCountdownDisplay('days', days);
                this.updateCountdownDisplay('hours', hours);
                this.updateCountdownDisplay('minutes', minutes);
                this.updateCountdownDisplay('seconds', seconds);
            } else {
                // Countdown finished
                document.querySelector('.offers')?.remove();
            }
        };
        
        updateCountdown();
        setInterval(updateCountdown, 1000);
    }
    
    updateCountdownDisplay(type, value) {
        const element = document.querySelector(`[data-countdown="${type}"]`);
        if (element) {
            const currentValue = element.textContent;
            const newValue = value.toString().padStart(2, '0');
            
            if (currentValue !== newValue) {
                element.style.transform = 'scale(1.2)';
                element.textContent = newValue;
                
                setTimeout(() => {
                    element.style.transform = 'scale(1)';
                }, 200);
            }
        }
    }
    
    // Product Filtering
    initProductFilters() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        if (filterBtns.length > 0) {
            filterBtns[0].classList.add('active'); // Set first filter as active
        }
    }
    
    applyFilter(filter) {
        if (this.isLoading) return;
        
        this.currentFilter = filter;
        this.isLoading = true;
        
        // Update filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        document.querySelector(`[data-filter="${filter}"]`).classList.add('active');
        
        // Animate products out
        const products = document.querySelectorAll('.product-card');
        products.forEach((product, index) => {
            setTimeout(() => {
                product.style.transform = 'translateY(-50px)';
                product.style.opacity = '0';
            }, index * 50);
        });
        
        // Filter and animate products in
        setTimeout(() => {
            this.filterProducts(filter);
            this.isLoading = false;
        }, products.length * 50 + 200);
    }
    
    filterProducts(filter) {
        const products = document.querySelectorAll('.product-card');
        
        products.forEach((product, index) => {
            const category = product.dataset.category;
            const shouldShow = filter === 'all' || category === filter;
            
            if (shouldShow) {
                product.style.display = 'block';
                setTimeout(() => {
                    product.style.transform = 'translateY(0)';
                    product.style.opacity = '1';
                }, index * 100);
            } else {
                product.style.display = 'none';
            }
        });
    }
    
    // Shopping Cart
    addToCart(productId) {
        const productData = this.getProductData(productId);
        if (!productData) return;
        
        const button = document.querySelector(`[data-product-id="${productId}"] .add-to-cart`);
        button.classList.add('loading');
        
        // Simulate API call delay
        setTimeout(() => {
            const existingItem = this.cart.find(item => item.id === productId);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                this.cart.push({
                    ...productData,
                    quantity: 1,
                    addedAt: new Date().toISOString()
                });
            }
            
            localStorage.setItem('cart', JSON.stringify(this.cart));
            this.updateCartUI();
            this.showToast(`¡${productData.title} agregado al carrito!`, 'success');
            
            button.classList.remove('loading');
            
            // Animate cart icon
            this.animateCartIcon();
        }, 800);
    }
    
    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        localStorage.setItem('cart', JSON.stringify(this.cart));
        this.updateCartUI();
        this.showToast('Producto eliminado del carrito', 'info');
    }
    
    updateCartUI() {
        const cartCount = document.querySelector('.cart-count');
        const cartItems = document.querySelector('.cart-items');
        const cartTotal = document.querySelector('.cart-total');
        const checkoutBtn = document.querySelector('.checkout-btn');
        
        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        // Update cart count
        if (cartCount) {
            cartCount.textContent = totalItems;
            cartCount.classList.toggle('show', totalItems > 0);
        }
        
        // Update cart items
        if (cartItems) {
            if (this.cart.length === 0) {
                cartItems.innerHTML = `
                    <div class="empty-cart">
                        <div class="empty-icon">🛒</div>
                        <p>Tu carrito está vacío</p>
                        <p class="text-light">¡Agrega algunos productos increíbles!</p>
                    </div>
                `;
            } else {
                cartItems.innerHTML = this.cart.map(item => `
                    <div class="cart-item">
                        <img src="https://picsum.photos/80/80?random=${item.id}" alt="${item.title}" class="cart-item-image">
                        <div class="cart-item-info">
                            <div class="cart-item-title">${item.title}</div>
                            <div class="cart-item-price">$${item.price.toLocaleString()}</div>
                            <div class="cart-item-quantity">Cantidad: ${item.quantity}</div>
                        </div>
                        <button class="btn-remove" data-product-id="${item.id}" onclick="techStore.removeFromCart('${item.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                `).join('');
            }
        }
        
        // Update total
        if (cartTotal) {
            cartTotal.textContent = `Total: $${totalPrice.toLocaleString()}`;
        }
        
        // Update checkout button
        if (checkoutBtn) {
            checkoutBtn.disabled = this.cart.length === 0;
            checkoutBtn.onclick = () => this.checkout();
        }
    }
    
    animateCartIcon() {
        const cartIcon = document.querySelector('.cart-icon');
        cartIcon.style.transform = 'scale(1.3)';
        cartIcon.style.background = 'rgba(59, 130, 246, 0.2)';
        
        setTimeout(() => {
            cartIcon.style.transform = '';
            cartIcon.style.background = '';
        }, 300);
    }
    
    toggleCart() {
        const cartSidebar = document.querySelector('.cart-sidebar');
        const cartOverlay = document.querySelector('.cart-overlay');
        
        cartSidebar.classList.toggle('open');
        cartOverlay.classList.toggle('open');
        
        if (cartSidebar.classList.contains('open')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }
    
    closeCart() {
        const cartSidebar = document.querySelector('.cart-sidebar');
        const cartOverlay = document.querySelector('.cart-overlay');
        
        cartSidebar.classList.remove('open');
        cartOverlay.classList.remove('open');
        document.body.style.overflow = '';
    }
    
    checkout() {
        if (this.cart.length === 0) return;
        
        this.showToast('¡Gracias por tu compra! Esta es una demo.', 'success');
        this.cart = [];
        localStorage.removeItem('cart');
        this.updateCartUI();
        this.closeCart();
        
        // Simulate checkout success
        setTimeout(() => {
            this.showToast('Demo: Orden procesada exitosamente 🎉', 'success');
        }, 1500);
    }
    
    // Quick View Modal
    initQuickView() {
        // Create modal if it doesn't exist
        if (!document.querySelector('.quick-view-modal')) {
            const modal = document.createElement('div');
            modal.className = 'quick-view-modal';
            modal.innerHTML = `
                <div class="modal-overlay"></div>
                <div class="modal-content">
                    <button class="modal-close">&times;</button>
                    <div class="modal-body"></div>
                </div>
            `;
            document.body.appendChild(modal);
        }
    }
    
    showQuickView(productId) {
        const product = this.getProductData(productId);
        if (!product) return;
        
        const modal = document.querySelector('.quick-view-modal');
        const modalBody = modal.querySelector('.modal-body');
        
        modalBody.innerHTML = `
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; align-items: start;">
                <div>
                    <img src="https://picsum.photos/400/300?random=${product.id}" alt="${product.title}" style="width: 100%; border-radius: 1rem;">
                </div>
                <div>
                    <div class="product-badge ${product.badge}">${product.badge}</div>
                    <h2 style="font-size: 1.5rem; margin: 1rem 0;">${product.title}</h2>
                    <div class="product-rating" style="margin-bottom: 1rem;">
                        <span class="stars">⭐⭐⭐⭐⭐</span>
                        <span class="rating-count">(${product.reviews} reseñas)</span>
                    </div>
                    <p style="color: #6b7280; margin-bottom: 1rem; line-height: 1.6;">${product.description}</p>
                    <div class="product-specs" style="margin-bottom: 1.5rem;">
                        ${product.specs.map(spec => `<span>${spec}</span>`).join('')}
                    </div>
                    <div class="product-pricing" style="margin-bottom: 1.5rem;">
                        <span class="price-current">$${product.price.toLocaleString()}</span>
                        ${product.oldPrice ? `<span class="price-old">$${product.oldPrice.toLocaleString()}</span>` : ''}
                    </div>
                    <button class="btn btn-primary btn-large add-to-cart" data-product-id="${product.id}">
                        <i class="fas fa-shopping-cart" style="margin-right: 0.5rem;"></i>
                        Agregar al Carrito
                    </button>
                </div>
            </div>
        `;
        
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
    }
    
    closeQuickView() {
        const modal = document.querySelector('.quick-view-modal');
        modal.classList.remove('open');
        document.body.style.overflow = '';
    }
    
    // Toast Notifications
    showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };
        
        toast.innerHTML = `
            <div class="toast-content">
                <span>${icons[type]} ${message}</span>
                <button class="toast-close">&times;</button>
            </div>
        `;
        
        document.body.appendChild(toast);
        
        // Show toast
        setTimeout(() => toast.classList.add('show'), 100);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 5000);
    }
    
    // Form Handling
    handleNewsletterSubmit(form) {
        const email = form.querySelector('input[type="email"]').value;
        const button = form.querySelector('button');
        
        if (!email) {
            this.showToast('Por favor ingresa tu email', 'warning');
            return;
        }
        
        button.disabled = true;
        button.textContent = 'Suscribiendo...';
        
        // Simulate API call
        setTimeout(() => {
            this.showToast(`¡Gracias! Te has suscrito con ${email}`, 'success');
            form.reset();
            button.disabled = false;
            button.textContent = 'Suscribirse';
        }, 1500);
    }
    
    handleContactSubmit(form) {
        const formData = new FormData(form);
        const button = form.querySelector('button[type="submit"]');
        
        // Basic validation
        const required = form.querySelectorAll('[required]');
        let isValid = true;
        
        required.forEach(field => {
            if (!field.value.trim()) {
                field.style.borderColor = '#ef4444';
                isValid = false;
            } else {
                field.style.borderColor = '#e5e7eb';
            }
        });
        
        if (!isValid) {
            this.showToast('Por favor completa todos los campos requeridos', 'warning');
            return;
        }
        
        button.disabled = true;
        button.textContent = 'Enviando...';
        
        // Simulate API call
        setTimeout(() => {
            this.showToast('¡Mensaje enviado exitosamente! Te responderemos pronto.', 'success');
            form.reset();
            button.disabled = false;
            button.textContent = 'Enviar Mensaje';
        }, 2000);
    }
    
    // Scroll Animations
    initScrollAnimations() {
        // Add animation classes to elements
        const animatedElements = [
            '.section-header',
            '.feature-card',
            '.testimonial-card',
            '.stat-item'
        ];
        
        animatedElements.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                el.classList.add('animate-on-scroll');
            });
        });
    }
    
    // Tooltips
    initTooltips() {
        const elements = document.querySelectorAll('[data-tooltip]');
        
        elements.forEach(element => {
            element.addEventListener('mouseenter', (e) => {
                this.showTooltip(e.target, e.target.dataset.tooltip);
            });
            
            element.addEventListener('mouseleave', () => {
                this.hideTooltip();
            });
        });
    }
    
    showTooltip(element, text) {
        let tooltip = document.querySelector('.custom-tooltip');
        
        if (!tooltip) {
            tooltip = document.createElement('div');
            tooltip.className = 'custom-tooltip';
            tooltip.style.cssText = `
                position: absolute;
                background: var(--bg-dark);
                color: white;
                padding: 0.5rem 0.75rem;
                border-radius: 0.375rem;
                font-size: 0.875rem;
                box-shadow: var(--shadow-lg);
                z-index: 3000;
                pointer-events: none;
                opacity: 0;
                transition: opacity 0.2s ease;
                white-space: nowrap;
            `;
            document.body.appendChild(tooltip);
        }
        
        tooltip.textContent = text;
        
        const rect = element.getBoundingClientRect();
        tooltip.style.top = `${rect.top - 40}px`;
        tooltip.style.left = `${rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2)}px`;
        tooltip.style.opacity = '1';
    }
    
    hideTooltip() {
        const tooltip = document.querySelector('.custom-tooltip');
        if (tooltip) {
            tooltip.style.opacity = '0';
        }
    }
    
    // Product Data Management
    getProductData(productId) {
        const products = this.getTestData();
        return products.find(product => product.id === productId);
    }
    
    loadTestData() {
        // Set product IDs for existing cards
        const productCards = document.querySelectorAll('.product-card');
        const products = this.getTestData();
        
        productCards.forEach((card, index) => {
            if (products[index]) {
                card.dataset.productId = products[index].id;
                card.dataset.category = products[index].category;
                
                // Update product info
                const title = card.querySelector('.product-title');
                const price = card.querySelector('.price-current');
                const oldPrice = card.querySelector('.price-old');
                const badge = card.querySelector('.product-badge');
                const specs = card.querySelector('.product-specs');
                
                if (title) title.textContent = products[index].title;
                if (price) price.textContent = `$${products[index].price.toLocaleString()}`;
                if (oldPrice && products[index].oldPrice) {
                    oldPrice.textContent = `$${products[index].oldPrice.toLocaleString()}`;
                }
                if (badge) {
                    badge.textContent = products[index].badge;
                    badge.className = `product-badge ${products[index].badge.toLowerCase()}`;
                }
                if (specs) {
                    specs.innerHTML = products[index].specs.map(spec => `<span>${spec}</span>`).join('');
                }
            }
        });
        
        // Update stats with animated values
        this.updateStatsData();
    }
    
    updateStatsData() {
        const stats = [
            { selector: '[data-stat="products"]', value: 5000, label: 'Productos' },
            { selector: '[data-stat="customers"]', value: 15000, label: 'Clientes Felices' },
            { selector: '[data-stat="orders"]', value: 50000, label: 'Órdenes Completadas' },
            { selector: '[data-stat="reviews"]', value: 98, label: '% Satisfacción' }
        ];
        
        stats.forEach(stat => {
            const element = document.querySelector(stat.selector);
            if (element) {
                element.dataset.target = stat.value;
                element.parentElement.querySelector('.stat-label').textContent = stat.label;
            }
        });
    }
    
    getTestData() {
        return [
            {
                id: 'laptop-gaming-1',
                title: 'Laptop Gaming ROG Strix',
                price: 1299000,
                oldPrice: 1599000,
                category: 'laptops',
                badge: 'Hot',
                specs: ['RTX 4060', '16GB RAM', '512GB SSD', '144Hz'],
                description: 'Potente laptop gaming con tecnología de última generación para los jugadores más exigentes.',
                reviews: 156
            },
            {
                id: 'smartphone-pro-2',
                title: 'Smartphone Pro Max 256GB',
                price: 899000,
                oldPrice: null,
                category: 'smartphones',
                badge: 'New',
                specs: ['6.7"', '256GB', '108MP', '5000mAh'],
                description: 'El smartphone más avanzado con cámaras profesionales y rendimiento excepcional.',
                reviews: 203
            },
            {
                id: 'headphones-premium-3',
                title: 'Audífonos Noise Cancelling',
                price: 299000,
                oldPrice: 399000,
                category: 'audio',
                badge: 'Premium',
                specs: ['ANC', 'Bluetooth 5.3', '30h batería', 'Hi-Res'],
                description: 'Audífonos premium con cancelación de ruido activa para una experiencia sonora inmersiva.',
                reviews: 89
            },
            {
                id: 'smartwatch-ultra-4',
                title: 'Smartwatch Ultra Sport',
                price: 449000,
                oldPrice: null,
                category: 'wearables',
                badge: 'Trending',
                specs: ['GPS', 'Salud 24/7', '7 días batería', 'Titanio'],
                description: 'Reloj inteligente deportivo con monitoreo avanzado de salud y GPS incorporado.',
                reviews: 134
            },
            {
                id: 'tablet-creative-5',
                title: 'Tablet Creative Pro 12.9"',
                price: 799000,
                oldPrice: 899000,
                category: 'tablets',
                badge: 'New',
                specs: ['12.9"', 'M2 Chip', '256GB', 'Apple Pencil'],
                description: 'Tablet profesional ideal para creativos, diseñadores y profesionales del arte digital.',
                reviews: 67
            },
            {
                id: 'console-next-gen-6',
                title: 'Consola Gaming Next-Gen',
                price: 649000,
                oldPrice: null,
                category: 'gaming',
                badge: 'Hot',
                specs: ['4K 120Hz', '1TB SSD', 'Ray Tracing', '3D Audio'],
                description: 'La consola de videojuegos más potente con gráficos 4K y tecnología ray tracing.',
                reviews: 412
            }
        ];
    }
    
    // Search Functionality
    initSearch() {
        const searchInput = document.querySelector('.search-input');
        if (!searchInput) return;
        
        let searchTimeout;
        
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                this.performSearch(e.target.value);
            }, 300);
        });
    }
    
    performSearch(query) {
        const products = document.querySelectorAll('.product-card');
        
        products.forEach(product => {
            const title = product.querySelector('.product-title').textContent.toLowerCase();
            const specs = Array.from(product.querySelectorAll('.product-specs span'))
                .map(spec => spec.textContent.toLowerCase()).join(' ');
            
            const matchesSearch = title.includes(query.toLowerCase()) || 
                                specs.includes(query.toLowerCase());
            
            product.style.display = matchesSearch ? 'block' : 'none';
        });
    }
    
    // Smooth scrolling for navigation
    initSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(link.getAttribute('href'));
                
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
    
    // Loading states
    showLoading(element) {
        element.classList.add('loading-skeleton');
    }
    
    hideLoading(element) {
        element.classList.remove('loading-skeleton');
    }
    
    // Utility functions
    formatCurrency(amount) {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP'
        }).format(amount);
    }
    
    // Performance monitoring
    measurePerformance() {
        if ('performance' in window) {
            window.addEventListener('load', () => {
                const perfData = performance.getEntriesByType('navigation')[0];
                console.log('TechStore Load Time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
            });
        }
    }
}

// Enhanced UI Interactions
class UIEnhancements {
    constructor() {
        this.init();
    }
    
    init() {
        this.initParallaxEffects();
        this.initHoverEffects();
        this.initTypingAnimation();
        this.initProgressBars();
    }
    
    initParallaxEffects() {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallax = document.querySelector('.hero::before');
            
            if (parallax) {
                parallax.style.transform = `translateY(${scrolled * 0.5}px)`;
            }
        });
    }
    
    initHoverEffects() {
        // 3D tilt effect for product cards
        document.querySelectorAll('.product-card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;
                
                card.style.transform = `
                    perspective(1000px)
                    rotateX(${rotateX}deg)
                    rotateY(${rotateY}deg)
                    translateY(-15px)
                `;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }
    
    initTypingAnimation() {
        const typeElement = document.querySelector('.typing-text');
        if (!typeElement) return;
        
        const texts = [
            'Tecnología de Última Generación',
            'Precios Increíbles',
            'Envío Gratis a Todo el País',
            'Garantía Extendida'
        ];
        
        let textIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        
        const typeSpeed = 100;
        const deleteSpeed = 50;
        const pauseDuration = 1500;
        
        function type() {
            const currentText = texts[textIndex];
            
            if (isDeleting) {
                charIndex--;
            } else {
                charIndex++;
            }
            
            typeElement.textContent = currentText.substring(0, charIndex);
            
            let nextDelay = typeSpeed;
            
            if (isDeleting) {
                nextDelay = deleteSpeed;
            }
            
            if (!isDeleting && charIndex === currentText.length) {
                nextDelay = pauseDuration;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % texts.length;
                nextDelay = typeSpeed;
            }
            
            setTimeout(type, nextDelay);
        }
        
        type();
    }
    
    initProgressBars() {
        const progressBars = document.querySelectorAll('.progress-bar');
        
        progressBars.forEach(bar => {
            const progress = bar.dataset.progress;
            const fill = bar.querySelector('.progress-fill');
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            fill.style.width = `${progress}%`;
                        }, 500);
                    }
                });
            });
            
            observer.observe(bar);
        });
    }
}

// Product Comparison Tool
class ProductComparison {
    constructor() {
        this.compareList = JSON.parse(localStorage.getItem('compareList')) || [];
        this.maxCompare = 3;
        this.init();
    }
    
    init() {
        this.initCompareButtons();
        this.updateCompareUI();
    }
    
    initCompareButtons() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('.btn-compare')) {
                e.preventDefault();
                const productId = e.target.closest('.product-card').dataset.productId;
                this.toggleCompare(productId);
            }
            
            if (e.target.closest('.show-comparison')) {
                this.showComparison();
            }
        });
    }
    
    toggleCompare(productId) {
        const exists = this.compareList.includes(productId);
        
        if (exists) {
            this.compareList = this.compareList.filter(id => id !== productId);
            this.showToast('Producto removido de comparación', 'info');
        } else if (this.compareList.length < this.maxCompare) {
            this.compareList.push(productId);
            this.showToast('Producto agregado a comparación', 'success');
        } else {
            this.showToast(`Máximo ${this.maxCompare} productos para comparar`, 'warning');
        }
        
        localStorage.setItem('compareList', JSON.stringify(this.compareList));
        this.updateCompareUI();
    }
    
    updateCompareUI() {
        // Update compare buttons state
        document.querySelectorAll('.product-card').forEach(card => {
            const productId = card.dataset.productId;
            const compareBtn = card.querySelector('.btn-compare');
            
            if (compareBtn && productId) {
                const isInCompare = this.compareList.includes(productId);
                compareBtn.classList.toggle('active', isInCompare);
                compareBtn.textContent = isInCompare ? 'En Comparación' : 'Comparar';
            }
        });
        
        // Show/hide comparison bar
        const compareBar = document.querySelector('.compare-bar');
        if (this.compareList.length > 0 && !compareBar) {
            this.createCompareBar();
        } else if (this.compareList.length === 0 && compareBar) {
            compareBar.remove();
        }
    }
    
    createCompareBar() {
        const compareBar = document.createElement('div');
        compareBar.className = 'compare-bar';
        compareBar.style.cssText = `
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: var(--bg-gradient);
            color: white;
            padding: 1rem;
            text-align: center;
            z-index: 1500;
            transform: translateY(100%);
            transition: transform 0.3s ease;
        `;
        
        compareBar.innerHTML = `
            <div class="container">
                <span>Productos en comparación: ${this.compareList.length}/${this.maxCompare}</span>
                <button class="btn btn-secondary show-comparison" style="margin-left: 1rem;">
                    Ver Comparación
                </button>
                <button class="btn-clear-compare" style="margin-left: 1rem; background: none; border: 1px solid white; color: white; padding: 0.5rem 1rem; border-radius: 0.375rem;">
                    Limpiar
                </button>
            </div>
        `;
        
        document.body.appendChild(compareBar);
        
        setTimeout(() => {
            compareBar.style.transform = 'translateY(0)';
        }, 100);
        
        compareBar.querySelector('.btn-clear-compare').addEventListener('click', () => {
            this.compareList = [];
            localStorage.removeItem('compareList');
            this.updateCompareUI();
            compareBar.remove();
        });
    }
    
    showToast(message, type) {
        // Use the same toast system from TechStore
        if (window.techStore) {
            window.techStore.showToast(message, type);
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize main store functionality
    window.techStore = new TechStore();
    
    // Initialize UI enhancements
    window.uiEnhancements = new UIEnhancements();
    
    // Initialize product comparison
    window.productComparison = new ProductComparison();
    
    // Initialize smooth scrolling
    window.techStore.initSmoothScrolling();
    
    // Start performance monitoring
    window.techStore.measurePerformance();
    
    // Welcome message
    setTimeout(() => {
        window.techStore.showToast('¡Bienvenido a TechStore! 🚀', 'success');
    }, 1000);
    
    // Simulate stats animation when stats section comes into view
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                window.techStore.animateStats();
                statsObserver.unobserve(entry.target);
            }
        });
    });
    
    const statsSection = document.querySelector('.stats');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }
});

// Service Worker for offline functionality (PWA-ready)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { TechStore, UIEnhancements, ProductComparison };
}
