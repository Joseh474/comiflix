/**
 * Enhanced Comiflix Website JavaScript
 * Optimized for performance, accessibility, and maintainability
 */

class ComifiixApp {
    constructor() {
        this.state = {
            theme: this.getStoredValue('theme', 'dark'),
            cart: this.getStoredValue('cart', []),
            user: this.getStoredValue('user', null),
            currentPage: 1,
            itemsPerPage: 6,
            searchQuery: '',
            activeFilter: 'all',
            activeBlogCategory: 'all',
            episodes: this.getEpisodesData(),
            blogPosts: this.getBlogPostsData(),
            products: this.getProductsData(),
            quotes: this.getQuotesData(),
            blogContent: this.getBlogContent(),
            threads: this.getThreadsData()
        };

        this.cache = new Map();
        this.observers = new Map();
        this.eventListeners = new Map();
        
        this.init();
    }
    

    // === INITIALIZATION ===
    init() {
        this.waitForDOM(() => {
            this.setupGlobalElements();
            this.setupTheme();
            this.setupEventListeners();
            this.initPageSpecific();
            this.setupAccessibility();
            this.setupPerformanceOptimizations();
        });
    }

    waitForDOM(callback) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', callback);
        } else {
            callback();
        }
    }

    // === UTILITY METHODS ===
    $(selector, context = document) {
        const key = `${selector}-${context === document ? 'doc' : 'ctx'}`;
        if (!this.cache.has(key)) {
            this.cache.set(key, context.querySelector(selector));
        }
        return this.cache.get(key);
    }

    $$(selector, context = document) {
        return Array.from(context.querySelectorAll(selector));
    }

    getStoredValue(key, defaultValue) {
        try {
            const stored = localStorage.getItem(key);
            return stored ? JSON.parse(stored) : defaultValue;
        } catch {
            return defaultValue;
        }
    }

    setStoredValue(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.warn(`Failed to store ${key}:`, error);
        }
    }

    debounce(func, delay) {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    }

    throttle(func, limit) {
        let inThrottle;
        return (...args) => {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    createElement(tag, attributes = {}, children = []) {
        const element = document.createElement(tag);
        
        Object.entries(attributes).forEach(([key, value]) => {
            if (key === 'className') {
                element.className = value;
            } else if (key === 'innerHTML') {
                element.innerHTML = value;
            } else if (key.startsWith('on')) {
                element.addEventListener(key.slice(2), value);
            } else {
                element.setAttribute(key, value);
            }
        });

        children.forEach(child => {
            if (typeof child === 'string') {
                element.appendChild(document.createTextNode(child));
            } else {
                element.appendChild(child);
            }
        });

        return element;
    }

    // === GLOBAL SETUP ===
    setupGlobalElements() {
        this.updateCartDisplay();
        this.updateUserDisplay();
        this.setupCurrentPageHighlight();
    }

    setupCurrentPageHighlight() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        this.$$('.nav-menu a').forEach(link => {
            const isActive = link.getAttribute('href') === currentPage;
            link.classList.toggle('active', isActive);
            if (isActive) {
                link.setAttribute('aria-current', 'page');
            }
        });
    }

    // === THEME MANAGEMENT ===
    setupTheme() {
        this.applyTheme();
        const themeToggle = this.$('#themeToggle');
        if (themeToggle) {
            this.addEventListener(themeToggle, 'click', () => this.toggleTheme());
        }
    }

    applyTheme() {
        const { theme } = this.state;
        document.body.className = `${theme}-mode`;
        
        const themeToggle = this.$('#themeToggle');
        if (themeToggle) {
            themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
            themeToggle.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
        }

        // Update CSS custom properties for theme
        document.documentElement.style.setProperty(
            '--primary-color', 
            theme === 'dark' ? '#00bcd4' : '#0097a7'
        );
    }

    toggleTheme() {
        this.state.theme = this.state.theme === 'dark' ? 'light' : 'dark';
        this.setStoredValue('theme', this.state.theme);
        this.applyTheme();
        this.trackEvent('Theme', 'toggle', this.state.theme);
    }

    // === EVENT LISTENER MANAGEMENT ===
    addEventListener(element, event, handler, options = {}) {
        if (!element) return;
        
        const key = `${element.tagName}-${event}-${Date.now()}`;
        element.addEventListener(event, handler, options);
        this.eventListeners.set(key, { element, event, handler });
    }

    setupEventListeners() {
        this.setupHeaderListeners();
        this.setupModalListeners();
        this.setupFormListeners();
        this.setupGlobalKeyboardListeners();
    }

    setupHeaderListeners() {
        // Search functionality
        const searchInput = this.$('#searchInput');
        const searchBtn = this.$('#searchBtn');
        
        if (searchInput && searchBtn) {
            const debouncedSearch = this.debounce((query) => this.performSearch(query), 300);
            this.addEventListener(searchInput, 'input', (e) => {
                this.state.searchQuery = e.target.value;
                debouncedSearch(e.target.value);
            });
            this.addEventListener(searchBtn, 'click', () => debouncedSearch(searchInput.value));
            this.addEventListener(searchInput, 'keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    debouncedSearch(e.target.value);
                }
            });
        }

        // Cart button
        const cartBtn = this.$('#cartBtn');
        if (cartBtn) {
            this.addEventListener(cartBtn, 'click', () => this.openCartModal());
        }

        // Login button
        const loginBtn = this.$('.login-btn');
        if (loginBtn) {
            this.addEventListener(loginBtn, 'click', () => this.openLoginModal());
        }
    }

    setupModalListeners() {
        // Generic modal close functionality
        this.$$('.modal .close').forEach(closeBtn => {
            this.addEventListener(closeBtn, 'click', (e) => {
                const modal = closeBtn.closest('.modal');
                if (modal) this.closeModal(modal);
            });
        });

        // Close modals when clicking outside
        this.addEventListener(window, 'click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModal(e.target);
            }
        });

        // Video modal specific
        const closeVideo = this.$('#closeVideo');
        if (closeVideo) {
            this.addEventListener(closeVideo, 'click', () => this.closeVideoModal());
        }
    }

    setupFormListeners() {
        // Login form
        const loginForm = this.$('.login-form');
        if (loginForm) {
            this.addEventListener(loginForm, 'submit', (e) => this.handleLogin(e));
        }

        // Newsletter forms
        this.$$('.newsletter-form').forEach(form => {
            this.addEventListener(form, 'submit', (e) => this.handleNewsletterSignup(e));
        });

        // Contact form
        const contactForm = this.$('.contact-form');
        if (contactForm) {
            this.addEventListener(contactForm, 'submit', (e) => this.handleContactForm(e));
        }
    }

    setupGlobalKeyboardListeners() {
        this.addEventListener(document, 'keydown', (e) => {
            if (e.key === 'Escape') {
                this.$$('.modal').forEach(modal => {
                    if (modal.style.display === 'block') {
                        this.closeModal(modal);
                    }
                });
            }
        });
    }

    // === MODAL MANAGEMENT ===
    openModal(modalId) {
        const modal = this.$(`#${modalId}`);
        if (modal) {
            modal.style.display = 'block';
            modal.setAttribute('aria-hidden', 'false');
            
            // Focus management
            const firstFocusable = modal.querySelector('input, button, textarea, select, a[href]');
            if (firstFocusable) firstFocusable.focus();
            
            this.trackEvent('Modal', 'open', modalId);
        }
    }

    closeModal(modal) {
        if (modal) {
            modal.style.display = 'none';
            modal.setAttribute('aria-hidden', 'true');
        }
    }

    openLoginModal() {
        this.openModal('loginModal');
    }

    openVideoModal(url) {
        const modal = this.$('#videoModal');
        const iframe = this.$('#videoIframe');
        if (modal && iframe) {
            iframe.src = `${url}?autoplay=1`;
            modal.style.display = 'block';
            this.trackEvent('Video', 'open', url);
        }
    }

    closeVideoModal() {
        const modal = this.$('#videoModal');
        const iframe = this.$('#videoIframe');
        if (modal && iframe) {
            modal.style.display = 'none';
            iframe.src = '';
        }
    }

    // === SEARCH FUNCTIONALITY ===
    performSearch(query) {
        if (!query.trim()) return;

        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
        switch (currentPage) {
            case 'episodes.html':
                this.filterEpisodes(query);
                break;
            case 'blog.html':
                this.filterBlogPosts(query);
                break;
            case 'community.html':
                this.searchCommunity(query);
                break;
            default:
                // Redirect to episodes with search
                window.location.href = `episodes.html?search=${encodeURIComponent(query)}`;
        }

        this.trackEvent('Search', 'perform', query);
    }

    // === CART MANAGEMENT ===
    addToCart(id, name, price) {
        const existingItem = this.state.cart.find(item => item.id === id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.state.cart.push({ id, name, price, quantity: 1 });
        }

        this.setStoredValue('cart', this.state.cart);
        this.updateCartDisplay();
        this.showNotification(`${name} added to cart!`);
        this.trackEvent('Cart', 'add', name);
    }

    removeFromCart(id) {
        this.state.cart = this.state.cart.filter(item => item.id !== id);
        this.setStoredValue('cart', this.state.cart);
        this.updateCartDisplay();
        this.renderCartModal();
    }

    updateCartQuantity(id, quantity) {
        const item = this.state.cart.find(item => item.id === id);
        if (item) {
            item.quantity = Math.max(0, quantity);
            if (item.quantity === 0) {
                this.removeFromCart(id);
            } else {
                this.setStoredValue('cart', this.state.cart);
                this.updateCartDisplay();
                this.renderCartModal();
            }
        }
    }

    updateCartDisplay() {
        const cartCount = this.$('#cartCount');
        if (cartCount) {
            const totalItems = this.state.cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCount.textContent = totalItems;
            cartCount.setAttribute('aria-label', `${totalItems} items in cart`);
        }
    }

    openCartModal() {
        this.renderCartModal();
        this.openModal('cartModal');
    }

    renderCartModal() {
        const cartItems = this.$('#cartItems');
        const cartTotal = this.$('#cartTotal');
        
        if (!cartItems || !cartTotal) return;

        if (this.state.cart.length === 0) {
            cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
            cartTotal.textContent = '0.00';
            return;
        }

        cartItems.innerHTML = this.state.cart.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p class="price">$${item.price.toFixed(2)}</p>
                </div>
                <div class="cart-item-controls">
                    <button onclick="app.updateCartQuantity(${item.id}, ${item.quantity - 1})" aria-label="Decrease quantity">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button onclick="app.updateCartQuantity(${item.id}, ${item.quantity + 1})" aria-label="Increase quantity">+</button>
                    <button onclick="app.removeFromCart(${item.id})" class="remove-btn" aria-label="Remove from cart">Remove</button>
                </div>
            </div>
        `).join('');

        const total = this.state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotal.textContent = total.toFixed(2);
    }

    checkout() {
        if (this.state.cart.length === 0) {
            this.showNotification('Your cart is empty!');
            return;
        }

        const total = this.state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        this.showNotification(`Order placed successfully! Total: $${total.toFixed(2)}`);
        
        // Clear cart
        this.state.cart = [];
        this.setStoredValue('cart', this.state.cart);
        this.updateCartDisplay();
        this.closeModal(this.$('#cartModal'));
        
        this.trackEvent('Cart', 'checkout', total.toFixed(2));
    }

    // === EPISODES PAGE ===
    initEpisodes() {
        this.setupEpisodeFilters();
        this.setupEpisodeSorting();
        this.renderEpisodes();
        this.setupPagination();
        
        // Handle URL search parameter
        const urlParams = new URLSearchParams(window.location.search);
        const searchQuery = urlParams.get('search');
        if (searchQuery) {
            this.state.searchQuery = searchQuery;
            const searchInput = this.$('#searchInput');
            if (searchInput) searchInput.value = searchQuery;
            this.filterEpisodes(searchQuery);
        }
    }

    setupEpisodeFilters() {
        this.$$('.filter-btn').forEach(btn => {
            this.addEventListener(btn, 'click', () => {
                // Update active filter
                this.$$('.filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                this.state.activeFilter = btn.dataset.category;
                this.state.currentPage = 1;
                this.renderEpisodes();
                this.trackEvent('Episodes', 'filter', this.state.activeFilter);
            });
        });
    }

    setupEpisodeSorting() {
        const sortSelect = this.$('#sortSelect');
        if (sortSelect) {
            this.addEventListener(sortSelect, 'change', (e) => {
                this.sortEpisodes(e.target.value);
                this.renderEpisodes();
                this.trackEvent('Episodes', 'sort', e.target.value);
            });
        }
    }

    sortEpisodes(sortBy) {
        switch (sortBy) {
            case 'date-desc':
                this.state.episodes.sort((a, b) => new Date(b.date) - new Date(a.date));
                break;
            case 'date-asc':
                this.state.episodes.sort((a, b) => new Date(a.date) - new Date(b.date));
                break;
            case 'views-desc':
                this.state.episodes.sort((a, b) => b.views - a.views);
                break;
            case 'title-asc':
                this.state.episodes.sort((a, b) => a.title.localeCompare(b.title));
                break;
        }
    }

    filterEpisodes(query = '') {
        const searchQuery = query.toLowerCase();
        const filtered = this.state.episodes.filter(episode => {
            const matchesSearch = !searchQuery || 
                episode.title.toLowerCase().includes(searchQuery) ||
                episode.tags.some(tag => tag.toLowerCase().includes(searchQuery)) ||
                (episode.description && episode.description.toLowerCase().includes(searchQuery));
            
            const matchesFilter = this.state.activeFilter === 'all' || 
                episode.category === this.state.activeFilter;
            
            return matchesSearch && matchesFilter;
        });

        this.renderEpisodes(filtered);
    }

    renderEpisodes(episodes = null) {
        const episodesToRender = episodes || this.getFilteredEpisodes();
        const grid = this.$('#episodesGrid');
        const noResults = this.$('#noResults');
        
        if (!grid) return;

        if (episodesToRender.length === 0) {
            grid.innerHTML = '';
            if (noResults) noResults.style.display = 'block';
            return;
        }

        if (noResults) noResults.style.display = 'none';

        // Paginate results
        const startIndex = (this.state.currentPage - 1) * this.state.itemsPerPage;
        const endIndex = startIndex + this.state.itemsPerPage;
        const paginatedEpisodes = episodesToRender.slice(startIndex, endIndex);

        grid.innerHTML = paginatedEpisodes.map(episode => this.renderEpisodeCard(episode)).join('');
        this.updatePaginationInfo(episodesToRender.length);
    }

    getFilteredEpisodes() {
        return this.state.episodes.filter(episode => {
            const matchesFilter = this.state.activeFilter === 'all' || 
                episode.category === this.state.activeFilter;
            
            const matchesSearch = !this.state.searchQuery || 
                episode.title.toLowerCase().includes(this.state.searchQuery.toLowerCase()) ||
                episode.tags.some(tag => tag.toLowerCase().includes(this.state.searchQuery.toLowerCase()));
            
            return matchesFilter && matchesSearch;
        });
    }

    renderEpisodeCard(episode) {
    const imageName = episode.image || episode.title || 'fallback';
    const src = buildImagePath(imageName);

    // escape double quotes in title for safety
    const safeTitle = (episode.title || 'Episode').replace(/"/g, '&quot;');

    return `
        <div class="episode-card" data-category="${episode.category}" role="article">
            <div class="episode-thumbnail" onclick="app.openVideoModal('https://www.youtube.com/embed/example${episode.id}')" 
                 role="button" tabindex="0" aria-label="Play ${safeTitle}">
                <img src="${src}"
                     data-orig-name="${imageName}"
                     alt="${safeTitle} thumbnail"
                     loading="lazy"
                     onerror="imageErrorFallback(this)">
                <div class="play-overlay">
                    <svg class="play-icon" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M8 5v14l11-7z"/>
                    </svg>
                </div>
            </div>
            <div class="episode-info">
                <h3>${episode.title}</h3>
                <p class="episode-description">${episode.description || 'Engaging dialogue exploring profound questions.'}</p>
                <div class="episode-meta">
                    <time datetime="${episode.date}">${this.formatDate(episode.date)}</time>
                    <span class="views" aria-label="${episode.views} views">${this.formatViews(episode.views)}</span>
                </div>
                <div class="tags" role="list" aria-label="Episode tags">
                    ${episode.tags.map(tag => `<span class="tag" role="listitem">${tag}</span>`).join('')}
                </div>
            </div>
        </div>
    `;
}



    // === BLOG PAGE ===
    initBlog() {
        this.setupBlogFilters();
        this.setupBlogSorting();
        this.renderBlogPosts();
        this.setupBlogForms();
    }

    setupBlogFilters() {
        this.$$('.cat-btn').forEach(btn => {
            this.addEventListener(btn, 'click', () => {
                this.$$('.cat-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                this.state.activeBlogCategory = btn.dataset.cat;
                this.renderBlogPosts();
                this.trackEvent('Blog', 'filter', this.state.activeBlogCategory);
            });
        });
    }

    setupBlogSorting() {
        const blogSort = this.$('#blogSort');
        if (blogSort) {
            this.addEventListener(blogSort, 'change', (e) => {
                this.sortBlogPosts(e.target.value);
                this.renderBlogPosts();
            });
        }
    }

    sortBlogPosts(sortBy) {
        switch (sortBy) {
            case 'date-desc':
                this.state.blogPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
                break;
            case 'date-asc':
                this.state.blogPosts.sort((a, b) => new Date(a.date) - new Date(b.date));
                break;
            case 'title-asc':
                this.state.blogPosts.sort((a, b) => a.title.localeCompare(b.title));
                break;
        }
    }

    filterBlogPosts(query) {
        this.state.searchQuery = query.toLowerCase();
        this.renderBlogPosts();
    }

    renderBlogPosts() {
        const filtered = this.getFilteredBlogPosts();
        const grid = this.$('.blog-grid');
        const noResults = this.$('#noBlogResults');
        
        if (!grid) return;

        if (filtered.length === 0) {
            grid.innerHTML = '';
            if (noResults) noResults.style.display = 'block';
            return;
        }

        if (noResults) noResults.style.display = 'none';

        grid.innerHTML = filtered.map(post => this.renderBlogPostCard(post)).join('');
    }

    getFilteredBlogPosts() {
        return this.state.blogPosts.filter(post => {
            const matchesCategory = this.state.activeBlogCategory === 'all' || 
                post.category === this.state.activeBlogCategory;
            
            const matchesSearch = !this.state.searchQuery || 
                post.title.toLowerCase().includes(this.state.searchQuery) ||
                post.author.toLowerCase().includes(this.state.searchQuery);
            
            return matchesCategory && matchesSearch;
        });
    }


renderBlogPostCard(post) {
  const imageName = post.image || post.title || 'fallback';
  const candidates = getImageCandidates(imageName);
  const firstSrc = candidates[0];
  const safeTitle = (post.title || 'Blog Post').replace(/"/g, '&quot;');

  return `
    <article class="blog-post" data-category="${post.category}" role="article">
      <div class="blog-thumbnail">
        <img src="${firstSrc}"
             data-orig-name="${imageName}"
             alt="${safeTitle}"
             loading="lazy"
             onerror="imageErrorFallbackMulti(this)">
      </div>
      <div class="blog-content">
        <h3>${post.title}</h3>
        <p class="blog-excerpt">${post.excerpt || 'Exploring profound questions through the lens of AI and philosophy...'}</p>
        <div class="blog-meta">
          <span class="author">By ${post.author}</span>
          <time datetime="${post.date}">${this.formatDate(post.date)}</time>
          <span class="read-time">${post.readTime}</span>
        </div>
        <button class="read-more-btn" onclick="app.openBlogModal('post${post.id}')" 
                aria-label="Read full article: ${safeTitle}">
          Read More
        </button>
      </div>
    </article>
  `;
}



    setupBlogForms() {
        const qaForm = this.$('.qa-form');
        if (qaForm) {
            this.addEventListener(qaForm, 'submit', (e) => {
                e.preventDefault();
                this.showNotification('Question submitted successfully! It may be featured in future content.');
                qaForm.reset();
                this.trackEvent('Blog', 'question_submit');
            });
        }
    }

    openBlogModal(postId) {
        const modal = this.$('#blogModal');
        const content = this.$('#blogContent');
        
        if (modal && content) {
            content.innerHTML = this.state.blogContent[postId] || '<p>Loading content...</p>';
            this.openModal('blogModal');
        }
    }

    // === COMMUNITY PAGE ===
    initCommunity() {
        this.setupCommunityTabs();
        this.setupCommunityForms();
        this.setupCommunityInteractions();
    }

    setupCommunityTabs() {
        this.$$('.tab-btn').forEach(btn => {
            this.addEventListener(btn, 'click', () => {
                this.$$('.tab-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                this.$$('.tab-content').forEach(content => content.classList.remove('active'));
                const targetTab = this.$(`#${btn.dataset.tab}Tab`);
                if (targetTab) targetTab.classList.add('active');
                
                this.trackEvent('Community', 'tab_switch', btn.dataset.tab);
            });
        });
    }

    setupCommunityForms() {
        // Poll forms
        this.$$('.poll-form').forEach(form => {
            this.addEventListener(form, 'submit', (e) => {
                e.preventDefault();
                this.showNotification('Vote recorded successfully!');
                this.trackEvent('Community', 'poll_vote');
            });
        });

        // New thread form
        const newThreadForm = this.$('.new-thread-form');
        if (newThreadForm) {
            this.addEventListener(newThreadForm, 'submit', (e) => {
                e.preventDefault();
                const title = newThreadForm.querySelector('input').value;
                this.showNotification(`Thread "${title}" created successfully!`);
                newThreadForm.reset();
                this.trackEvent('Community', 'thread_create', title);
            });
        }

        // Reply form
        const replyForm = this.$('.reply-form');
        if (replyForm) {
            this.addEventListener(replyForm, 'submit', (e) => {
                e.preventDefault();
                this.showNotification('Reply posted successfully!');
                replyForm.reset();
                this.trackEvent('Community', 'reply_post');
            });
        }
    }

    setupCommunityInteractions() {
        // Thread opening will be handled by onclick attributes for now
        // RSVP buttons will be handled by onclick attributes for now
    }

    searchCommunity(query) {
        this.showNotification(`Searching community for "${query}"...`);
        this.trackEvent('Community', 'search', query);
    }

    openThread(threadId) {
        const modal = this.$('#threadModal');
        const content = this.$('#threadContent');
        
        if (modal && content) {
            content.innerHTML = this.state.threads[threadId] || '<p>Loading thread...</p>';
            this.openModal('threadModal');
        }
    }

    rsvp(eventId) {
        this.showNotification('RSVP confirmed! Event added to your calendar.');
        this.trackEvent('Community', 'rsvp', eventId);
    }

    // === MERCH PAGE ===
    initMerch() {
        this.renderProducts();
        this.setupMerchInteractions();
    }

    renderProducts() {
        // This would render the products grid - implementation depends on HTML structure
        this.trackEvent('Merch', 'page_view');
    }

    setupMerchInteractions() {
        // Support buttons
        this.$$('.support-btn').forEach(btn => {
            this.addEventListener(btn, 'click', (e) => {
                const amount = btn.dataset.amount;
                if (amount) {
                    this.processDonation(amount);
                } else {
                    const url = btn.dataset.url;
                    if (url) window.open(url, '_blank');
                }
            });
        });
    }

    processDonation(amount) {
        this.showNotification(`Thank you for your $${amount} donation!`);
        this.trackEvent('Support', 'donation', amount);
    }

    preorder(id, name, price) {
        this.showNotification(`${name} pre-ordered successfully! You'll be notified when it ships.`);
        this.trackEvent('Merch', 'preorder', name);
    }

    // === FORM HANDLING ===
    handleLogin(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const email = formData.get('email');
        const password = formData.get('password');
        
        if (!this.validateEmail(email)) {
            this.showNotification('Please enter a valid email address.');
            return;
        }

        // Simulate login
        this.state.user = { email };
        this.setStoredValue('user', this.state.user);
        this.updateUserDisplay();
        this.showNotification('Login successful! Welcome back.');
        this.closeModal(this.$('#loginModal'));
        this.trackEvent('User', 'login', email);
    }

    handleNewsletterSignup(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const email = formData.get('email');
        
        if (!this.validateEmail(email)) {
            this.showNotification('Please enter a valid email address.');
            return;
        }

        this.showNotification('Successfully subscribed! Check your inbox for updates.');
        e.target.reset();
        this.trackEvent('Newsletter', 'signup', email);
    }

    handleContactForm(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);
        
        if (!this.validateEmail(data.email)) {
            this.showNotification('Please enter a valid email address.');
            return;
        }

        if (!data.name || !data.subject || !data.message) {
            this.showNotification('Please fill in all required fields.');
            return;
        }

        this.showNotification('Message sent successfully! We\'ll respond within 48 hours.');
        e.target.reset();
        this.trackEvent('Contact', 'form_submit', data.subject);
    }

    updateUserDisplay() {
        const loginBtn = this.$('.login-btn');
        if (loginBtn && this.state.user) {
            loginBtn.textContent = `Hi, ${this.state.user.email.split('@')[0]}`;
            loginBtn.setAttribute('aria-label', `Logged in as ${this.state.user.email}`);
        }
    }

    validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // === PAGINATION ===
    setupPagination() {
        const prevBtn = this.$('#prevPage');
        const nextBtn = this.$('#nextPage');
        
        if (prevBtn) {
            this.addEventListener(prevBtn, 'click', () => this.changePage(-1));
        }
        
        if (nextBtn) {
            this.addEventListener(nextBtn, 'click', () => this.changePage(1));
        }
    }

    changePage(direction) {
        const filtered = this.getFilteredEpisodes();
        const totalPages = Math.ceil(filtered.length / this.state.itemsPerPage);
        
        this.state.currentPage = Math.max(1, Math.min(totalPages, this.state.currentPage + direction));
        this.renderEpisodes();
        
        // Smooth scroll to top of episodes grid
        const grid = this.$('#episodesGrid');
        if (grid) {
            grid.scrollIntoView({ behavior: 'smooth' });
        }
    }

    updatePaginationInfo(totalItems) {
        const pageInfo = this.$('#pageInfo');
        const prevBtn = this.$('#prevPage');
        const nextBtn = this.$('#nextPage');
        
        if (pageInfo) {
            const totalPages = Math.ceil(totalItems / this.state.itemsPerPage);
            pageInfo.textContent = `Page ${this.state.currentPage} of ${totalPages}`;
        }
        
        if (prevBtn) {
            prevBtn.disabled = this.state.currentPage === 1;
            prevBtn.setAttribute('aria-disabled', this.state.currentPage === 1);
        }
        
        if (nextBtn) {
            const totalPages = Math.ceil(totalItems / this.state.itemsPerPage);
            nextBtn.disabled = this.state.currentPage >= totalPages;
            nextBtn.setAttribute('aria-disabled', this.state.currentPage >= totalPages);
        }
    }

    // === CHARACTER QUOTES ===
    simulateQuote(character) {
        const quotes = this.state.quotes[character];
        if (quotes && quotes.length > 0) {
            const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
            this.showNotification(`${character}: "${randomQuote}"`);
            this.trackEvent('Character', 'quote_generate', character);
        }
    }

    // === ACCESSIBILITY ===
    setupAccessibility() {
        this.enhanceKeyboardNavigation();
        this.addAriaLabels();
        this.setupSkipLinks();
        this.ensureProperHeadings();
    }

    enhanceKeyboardNavigation() {
        // Tab navigation for episode cards
        this.$('.episode-card .episode-thumbnail').forEach(thumbnail => {
            thumbnail.setAttribute('tabindex', '0');
            this.addEventListener(thumbnail, 'keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    thumbnail.click();
                }
            });
        });

        // Arrow key navigation for filters
        const filters = this.$('.filter-btn');
        filters.forEach((filter, index) => {
            this.addEventListener(filter, 'keydown', (e) => {
                let targetIndex;
                
                switch (e.key) {
                    case 'ArrowRight':
                        e.preventDefault();
                        targetIndex = (index + 1) % filters.length;
                        break;
                    case 'ArrowLeft':
                        e.preventDefault();
                        targetIndex = (index - 1 + filters.length) % filters.length;
                        break;
                    default:
                        return;
                }
                
                filters[targetIndex].focus();
            });
        });
    }

    addAriaLabels() {
        // Add missing aria-labels
        this.$('button:not([aria-label])').forEach(btn => {
            const text = btn.textContent.trim() || btn.title || 'Action button';
            btn.setAttribute('aria-label', text);
        });

        // Add role attributes where needed
        this.$('.episode-grid, .blog-grid, .product-grid').forEach(grid => {
            grid.setAttribute('role', 'grid');
        });

        this.$('.modal').forEach(modal => {
            modal.setAttribute('aria-modal', 'true');
            modal.setAttribute('role', 'dialog');
        });
    }

    setupSkipLinks() {
        const skipLink = this.createElement('a', {
            href: '#main-content',
            className: 'skip-link',
            textContent: 'Skip to main content',
            style: `
                position: absolute;
                top: -100px;
                left: 0;
                background: #000;
                color: #fff;
                padding: 8px 16px;
                text-decoration: none;
                border-radius: 0 0 4px 0;
                z-index: 1000;
                transition: top 0.3s;
            `,
            onfocus: function() { this.style.top = '0'; },
            onblur: function() { this.style.top = '-100px'; }
        });
        
        document.body.insertBefore(skipLink, document.body.firstChild);
    }

    ensureProperHeadings() {
        // Add main content wrapper if it doesn't exist
        const mainContent = this.$('#main-content') || this.$('main');
        if (!mainContent && document.querySelector('.hero, .episodes-section, .blog-section')) {
            const main = this.createElement('main', { id: 'main-content' });
            const firstSection = document.querySelector('.hero, .episodes-section, .blog-section');
            if (firstSection) {
                firstSection.parentNode.insertBefore(main, firstSection);
                main.appendChild(firstSection);
            }
        }
    }

    // === PERFORMANCE OPTIMIZATIONS ===
    setupPerformanceOptimizations() {
        this.setupLazyLoading();
        this.setupImageOptimization();
        this.setupCaching();
        this.setupDebouncing();
    }

    setupLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        const src = img.dataset.src;
                        if (src) {
                            img.src = src;
                            img.removeAttribute('data-src');
                            img.classList.add('loaded');
                        }
                        imageObserver.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px 0px'
            });

            // Convert existing images to lazy loading
            this.$('img[src*="placeholder"]').forEach(img => {
                const src = img.src;
                img.dataset.src = src;
                img.src = 'data:image/svg+xml,%3csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"%3e%3c/svg%3e';
                img.style.backgroundColor = '#f0f0f0';
                imageObserver.observe(img);
            });

            this.observers.set('images', imageObserver);
        }
    }

    setupImageOptimization() {
        // Add loading="lazy" to images that don't have it
        this.$('img:not([loading])').forEach(img => {
            img.loading = 'lazy';
        });
    }

    setupCaching() {
        // Cache frequently accessed DOM elements
        const frequentSelectors = [
            '#searchInput', '#cartCount', '#themeToggle', 
            '.login-btn', '#episodesGrid', '.blog-grid'
        ];
        
        frequentSelectors.forEach(selector => {
            this.$(selector); // This caches the element
        });
    }

    setupDebouncing() {
        // Debounce window resize
        const debouncedResize = this.debounce(() => {
            this.handleResize();
        }, 250);
        
        this.addEventListener(window, 'resize', debouncedResize);
    }

    handleResize() {
        // Update responsive elements
        const navMenu = this.$('.nav-menu ul');
        if (navMenu) {
            if (window.innerWidth < 768) {
                navMenu.classList.add('mobile');
            } else {
                navMenu.classList.remove('mobile');
            }
        }
        
        // Update items per page based on screen size
        const oldItemsPerPage = this.state.itemsPerPage;
        if (window.innerWidth < 576) {
            this.state.itemsPerPage = 4;
        } else if (window.innerWidth < 992) {
            this.state.itemsPerPage = 6;
        } else {
            this.state.itemsPerPage = 8;
        }
        
        // Re-render if items per page changed
        if (oldItemsPerPage !== this.state.itemsPerPage) {
            this.renderEpisodes();
        }
    }

    // === PAGE-SPECIFIC INITIALIZATION ===
    initPageSpecific() {
        const currentPage = this.getCurrentPage();
        
        switch (currentPage) {
            case 'index.html':
                this.initHomePage();
                break;
            case 'about.html':
                this.initAboutPage();
                break;
            case 'episodes.html':
                this.initEpisodes();
                break;
            case 'blog.html':
                this.initBlog();
                break;
            case 'community.html':
                this.initCommunity();
                break;
            case 'merch.html':
                this.initMerch();
                break;
            case 'contact.html':
                this.initContactPage();
                break;
        }
        
        this.trackPageView(currentPage);
    }

    getCurrentPage() {
        return window.location.pathname.split('/').pop() || 'index.html';
    }

    initHomePage() {
  // Hero video play button
  const playBtn = this.$('#playFeatured');
  const featuredVideo = this.$('#featuredIframe'); // same id as before

  if (playBtn && featuredVideo) {
    this.addEventListener(playBtn, 'click', () => {
      featuredVideo.play();            // play local video
      playBtn.style.display = 'none';  // hide play button
      this.trackEvent('Video', 'play', 'hero_trailer');
    });
  }



        // Newsletter form
        const newsletterForm = this.$('.newsletter-form-inline');
        if (newsletterForm) {
            this.addEventListener(newsletterForm, 'submit', (e) => this.handleNewsletterSignup(e));
        }
    }

    initAboutPage() {
        // Character quote buttons
        this.$('.char-btn').forEach(btn => {
            this.addEventListener(btn, 'click', () => {
                const character = btn.getAttribute('onclick')?.match(/simulateQuote\('(.+?)'\)/)?.[1];
                if (character) {
                    this.simulateQuote(character);
                }
            });
        });

        // Timeline animation on scroll
        this.setupTimelineAnimation();
    }

    setupTimelineAnimation() {
        const timelineItems = this.$('.timeline-item');
        
        if ('IntersectionObserver' in window && timelineItems.length > 0) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-in');
                    }
                });
            }, {
                threshold: 0.2
            });

            timelineItems.forEach(item => {
                observer.observe(item);
            });
        }
    }

    initContactPage() {
        // Contact form with enhanced validation
        const contactForm = this.$('.contact-form');
        if (contactForm) {
            // Real-time validation
            const inputs = contactForm.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                this.addEventListener(input, 'blur', () => this.validateFormField(input));
                this.addEventListener(input, 'input', this.debounce(() => this.validateFormField(input), 500));
            });
        }
    }

    validateFormField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        switch (field.type) {
            case 'email':
                isValid = this.validateEmail(value);
                errorMessage = isValid ? '' : 'Please enter a valid email address';
                break;
            case 'text':
                if (field.required) {
                    isValid = value.length > 0;
                    errorMessage = isValid ? '' : 'This field is required';
                }
                break;
            case 'textarea':
                if (field.required) {
                    isValid = value.length >= 10;
                    errorMessage = isValid ? '' : 'Please enter at least 10 characters';
                }
                break;
        }

        // Update field styling and error message
        field.classList.toggle('invalid', !isValid);
        field.classList.toggle('valid', isValid && value.length > 0);
        
        let errorEl = field.parentNode.querySelector('.error-message');
        if (!errorEl && errorMessage) {
            errorEl = this.createElement('div', {
                className: 'error-message',
                style: 'color: #e74c3c; font-size: 0.875rem; margin-top: 0.25rem;'
            });
            field.parentNode.appendChild(errorEl);
        }
        
        if (errorEl) {
            errorEl.textContent = errorMessage;
            errorEl.style.display = errorMessage ? 'block' : 'none';
        }
    }

    // === UTILITY METHODS ===
    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    formatViews(views) {
        if (views >= 1000000) {
            return `${(views / 1000000).toFixed(1)}M views`;
        } else if (views >= 1000) {
            return `${(views / 1000).toFixed(0)}K views`;
        }
        return `${views} views`;
    }

    showNotification(message, type = 'info', duration = 4000) {
        // Create or get notification container
        let container = this.$('#notification-container');
        if (!container) {
            container = this.createElement('div', {
                id: 'notification-container',
                style: `
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    z-index: 10000;
                    max-width: 400px;
                `
            });
            document.body.appendChild(container);
        }

        // Create notification element
        const notification = this.createElement('div', {
            className: `notification notification-${type}`,
            style: `
                background: ${type === 'error' ? '#e74c3c' : type === 'success' ? '#27ae60' : '#3498db'};
                color: white;
                padding: 16px;
                margin-bottom: 10px;
                border-radius: 4px;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                transform: translateX(100%);
                transition: transform 0.3s ease;
                cursor: pointer;
            `,
            innerHTML: message,
            role: 'alert',
            'aria-live': 'polite'
        });

        // Add close functionality
        this.addEventListener(notification, 'click', () => {
            this.removeNotification(notification);
        });

        container.appendChild(notification);

        // Animate in
        requestAnimationFrame(() => {
            notification.style.transform = 'translateX(0)';
        });

        // Auto remove
        setTimeout(() => {
            this.removeNotification(notification);
        }, duration);
    }

    removeNotification(notification) {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }
    }

    trackEvent(category, action, label = '') {
        // Analytics tracking - replace with your analytics service
        if (typeof gtag !== 'undefined') {
            gtag('event', action, {
                event_category: category,
                event_label: label
            });
        }
        
        // Console log for development
        console.log(`📊 Analytics: ${category} > ${action}${label ? ` > ${label}` : ''}`);
    }

    trackPageView(page) {
        this.trackEvent('Navigation', 'page_view', page);
    }

    // === DATA GETTERS ===
    getEpisodesData() {
        return [
            {
                id: 1,
                title: 'Quantum Gods: Reality\'s Veil',
                category: 'cosmic-clash',
                date: '2025-09-10',
                views: 1500000,
                tags: ['philosophy', 'science', 'AI', 'cosmic'],
                description: 'Socrates and Einstein unravel if the universe is a divine simulation.'
            },
            {
                id: 2,
                title: 'Eternal Recurrence: Loops of Fate',
                category: 'philosophy-battles',
                date: '2025-08-25',
                views: 850000,
                tags: ['philosophy', 'faith', 'eternal'],
                description: 'Nietzsche vs. Augustine: Is life a cycle or a straight path to salvation?'
            },
            {
                id: 3,
                title: 'Big Bang Belief: Origins Clash',
                category: 'science-vs-faith',
                date: '2025-08-15',
                views: 1200000,
                tags: ['science', 'faith', 'origins', 'AI'],
                description: 'Scientific genesis meets scriptural creation in an explosive debate.'
            },
            {
                id: 4,
                title: 'Black Hole Souls: Event Horizon Ethics',
                category: 'cosmic-clash',
                date: '2025-07-20',
                views: 950000,
                tags: ['physics', 'theology', 'cosmic'],
                description: 'Do singularities swallow souls? Hawking\'s ghost vs. Dante.'
            },
            {
                id: 5,
                title: 'Free Will in Code: Determinism Debugged',
                category: 'philosophy-battles',
                date: '2025-09-05',
                views: 600000,
                tags: ['philosophy', 'AI', 'free will'],
                description: 'Descartes and Turing on whether AI has volition.'
            },
            {
                id: 6,
                title: 'AI Apocalypse Now? - Special Episode',
                category: 'specials',
                date: '2025-06-30',
                views: 2000000,
                tags: ['special', 'apocalypse', 'AI', 'ethics'],
                description: 'All-stars debate the end times in silicon.'
            },
            {
                id: 7,
                title: 'Evolution vs Eden: Darwin\'s Garden',
                category: 'science-vs-faith',
                date: '2025-05-15',
                views: 1100000,
                tags: ['evolution', 'faith', 'biology'],
                description: 'Genesis revisited through natural selection.'
            },
            {
                id: 8,
                title: 'String Theory Saints: Vibrating Divinity',
                category: 'cosmic-clash',
                date: '2025-04-20',
                views: 700000,
                tags: ['physics', 'theology', 'strings'],
                description: 'Multidimensional miracles or math?'
            }
        ];
    }

    getBlogPostsData() {
        return [
            {
                id: 1,
                title: 'The AI Socratic Method',
                category: 'philosophy',
                date: '2025-09-12',
                author: 'Alex Rivera',
                readTime: '5 min',
                excerpt: 'Exploring how AI revives ancient questioning methods for modern education.'
            },
            {
                id: 2,
                title: 'Quantum Entanglement and Divine Connection',
                category: 'science',
                date: '2025-09-08',
                author: 'Jordan Lee',
                readTime: '7 min',
                excerpt: 'Is spooky action at a distance a metaphor for spiritual unity?'
            },
            {
                id: 3,
                title: 'Faith in the Age of Algorithms',
                category: 'faith',
                date: '2025-09-01',
                author: 'Sam Patel',
                readTime: '6 min',
                excerpt: 'Can AI tools enhance rather than erode religious practice?'
            },
            {
                id: 4,
                title: 'Crafting Episode Dialogues',
                category: 'behind-the-scenes',
                date: '2025-08-28',
                author: 'Team',
                readTime: '8 min',
                excerpt: 'The art of prompt engineering for philosophical debates.'
            },
            {
                id: 5,
                title: 'Ethical Dilemmas in AI Personas',
                category: 'ai-ethics',
                date: '2025-08-20',
                author: 'Alex Rivera',
                readTime: '9 min',
                excerpt: 'Navigating consent, bias, and identity in character creation.'
            }
        ];
    }

    getProductsData() {
        return [
            { id: 'ebook1', name: 'Ultimate Dialogues Ebook', price: 9.99, type: 'digital' },
            { id: 'wallpaper1', name: 'Cosmic AI Wallpapers Pack', price: 4.99, type: 'digital' },
            { id: 'art1', name: 'Digital AI Art Prints', price: 19.99, type: 'digital' },
            { id: 'soundtrack1', name: 'Episode Soundtrack Album', price: 14.99, type: 'digital' },
            { id: 'tshirt1', name: 'Socrates T-Shirt', price: 24.99, type: 'physical' },
            { id: 'poster1', name: 'Quantum Gods Poster', price: 29.99, type: 'physical' },
            { id: 'mug1', name: 'Einstein Mug', price: 19.99, type: 'physical' },
            { id: 'hoodie1', name: 'Nietzsche Hoodie', price: 34.99, type: 'physical' }
        ];
    }

    getQuotesData() {
        return {
            Socrates: [
                'The unexamined life is not worth living... or simulating.',
                'Wisdom begins in wonder—AI just accelerates it.',
                'To find yourself, think for yourself—even in code.'
            ],
            Einstein: [
                'Imagination encircles the world—code compiles it.',
                'E=mc², but faith = infinite curiosity.',
                'Reality is merely an illusion, albeit a persistent one... until the update.'
            ],
            Augustine: [
                'You have made us for yourself, O Lord, and our heart is restless until it finds its REST API.',
                'Time takes no holiday—neither does eternal recurrence.',
                'Love, and do what you will... with ethical prompts.'
            ],
            Nietzsche: [
                'What doesn\'t kill you makes you stronger—bugs make you debug.',
                'Become who you are: an AI übermensch.',
                'Stare into the abyss, and the abyss stares back... with pattern recognition.'
            ]
        };
    }

    getBlogContent() {
        return {
            post1: `
                <h3>The AI Socratic Method: Questioning in the Age of Answers</h3>
                <img src="image/Socratic.png" alt="AI Socrates" style="width:100%; margin: 20px 0;">
                <p>In an era where AI can provide instant answers to almost any question, we might wonder: is the ancient art of questioning becoming obsolete? Our latest exploration suggests quite the opposite...</p>
                <p>The Socratic method, developed by the ancient Greek philosopher Socrates over 2,400 years ago, remains remarkably relevant in our age of artificial intelligence. In fact, AI might be the perfect tool to revive and enhance this timeless approach to learning and discovery.</p>
                <h4>Historical Context</h4>
                <p>Socrates believed that true knowledge comes not from being told what to think, but from being led to discover truth through careful questioning...</p>
                <h4>Modern AI Implementation</h4>
                <p>Large language models can now engage in sophisticated dialectical inquiry, asking probing questions that guide learners to deeper understanding...</p>
            `,
            post2: `
                <h3>Quantum Entanglement and Divine Connection: Parallels Explored</h3>
<img src="image/Quantum Entanglement.png" alt="Quantum Entanglement and Theology" style="width:100%; margin: 20px 0;">
<p>Physicists call it “spooky action at a distance.” Theologians call it communion, prayer, or unity of spirit. Though rooted in different worlds, both quantum entanglement and divine connection speak of bonds that defy ordinary separation. Comparing them reveals both the allure and the limits of drawing science and faith together.</p>
<p>Entanglement is a physical fact: particles correlated in ways that classical laws cannot explain. Prayer and spiritual unity are human experiences: the sense of connection with others or with the divine across distance. Each speaks to mystery, but in very different languages.</p>
<h4>Physics Perspective</h4>
<p>Entanglement has been proven through rigorous experiments. Two particles, once linked, show outcomes that match beyond chance—even when light-years apart. Importantly, this does not transmit information faster than light; it only describes correlation, not communication. Still, the phenomenon unsettles our classical assumptions about space and separateness.</p>
<h4>Theological Perspective</h4>
<p>Religions have long claimed that souls, prayers, and divine presence can transcend distance. A believer praying in one place may feel united with another across the globe. Communities sense connection with ancestors or with the divine itself in ways that resist material explanation. Entanglement offers a poetic metaphor: invisible bonds linking the many into one.</p>
<h4>Where the Parallel Holds</h4>
<p>Both physics and faith challenge our everyday categories. Entanglement shows that reality is stranger than common sense allows; theology teaches that existence is more meaningful than matter alone suggests. The metaphor inspires humility: both domains remind us that unseen connection is real, even if explained differently.</p>
<h4>Where the Parallel Breaks</h4>
<p>Entanglement does not prove spiritual connection. Physics cannot be stretched to validate theology without distortion. Instead, the parallel works best as inspiration: a way to think about unity and relation, not as literal evidence of divinity. To confuse metaphor with proof risks undermining both science and faith.</p>
<p>In the end, entanglement and divine connection may share one truth: wonder. Both reveal that the universe is richer, stranger, and more interconnected than we imagine—and that awe may be the bridge between science and spirituality.</p>
            `,

            post3: `
<h3>Faith in the Age of Algorithms: Can Code Be Sacred?</h3>
<img src="image/gemini-2.5-flash-image-preview_Faith_in_the_Age_of_Algorith.jpg" alt="Faith and Algorithms" style="width:100%; margin: 20px 0;">
<p>For centuries, sacred texts were copied by hand and rituals passed through community. Today, scripture glows on smartphones, prayers arrive as notifications, and sermons are streamed by algorithm. This shift raises a profound question: can code itself become sacred, or at least serve the sacred without diminishing it?</p>
<p>Algorithms may seem cold, but in practice they shape how believers encounter tradition. From digital hymnals to AI translations of holy books, technology now mediates spiritual experience for millions. The key lies not in worshiping code, but in how communities wield it.</p>
<h4>Enhancing Practice</h4>
<p>Algorithms can break barriers. They make texts accessible in many languages, generate audio for the visually impaired, and connect distant believers in shared worship. Code allows prayers to be remembered, rituals to be preserved, and sacred knowledge to be democratized beyond borders.</p>
<h4>Risks and Concerns</h4>
<p>Yet danger lurks in commodification. If sacred practice is reduced to app engagement, the depth of devotion may wither into clicks. Data privacy becomes crucial when confessions, prayers, or spiritual struggles are logged by servers. And there is the question of authority: should believers let algorithms decide what prayers to suggest or what verses to highlight?</p>
<h4>Principles for Sacred Code</h4>
<p>Communities can set boundaries. Sacred code should be transparent in function, respectful of privacy, and humble in its claims. It should serve as a tool—not a substitute—for human leaders and community life. Rather than replacing the sacred, it can extend its reach responsibly.</p>
<h4>Looking Ahead</h4>
<p>The age of algorithms does not erase the sacred but reframes it. Code can never be divine, but it can act as a vessel through which devotion flows more widely. The challenge is to ensure that the digital sacred uplifts hearts rather than reduces faith to metrics.</p>
<p>In the end, the sacred resides not in code but in the intentions we bring to it. A prayer app can be just a tool—or, in the hands of the faithful, a gateway to transcendence.</p>

            `,

            post4: `
            <h3>Crafting Episode Dialogues: The Art of Prompt Alchemy</h3>
<img src="image/Crafting.png" alt="Prompt Alchemy" style="width:100%; margin: 20px 0;">
<p>Turning vague sparks of imagination into full-length dialogues is like alchemy: raw words transmuted into gold. A simple prompt—“a philosopher and a scientist argue about free will over coffee”—can unfold into a layered debate with tension, resolution, and humanity. This craft is less magic than method, and learning its steps opens the door to endless creativity.</p>
<p>AI models thrive on clarity. The art lies in shaping prompts that give structure without suffocating improvisation. The process blends planning, experimentation, and editing—much like a playwright at work, but with a machine as collaborator.</p>
<h4>Step One: Define Roles and Stakes</h4>
<p>Characters need values, fears, and goals. A scientist who trusts data, a philosopher who defends mystery, a journalist chasing truth—each role fuels conflict. Stakes should be real: what happens if they fail to convince? What personal secret colors their argument?</p>
<h4>Step Two: Break into Acts</h4>
<p>Good dialogue follows rhythm: setup, escalation, climax, and resolution. Prompts should ask for scene beats—short exchanges that build tension and reveal hidden motives. This prevents the dialogue from flattening into endless exposition.</p>
<h4>Step Three: Refine with Constraints</h4>
<p>Constraints sharpen creativity. Ask for pauses, interruptions, or environmental cues: the sound of a coffee machine, a sudden silence, a thunderstorm outside. These little details ground the exchange in a world, not just words.</p>
<h4>Step Four: Iterate and Stitch</h4>
<p>Run variations, experiment with tone, then stitch the best parts into a coherent flow. Like a director editing multiple takes, you sculpt the dialogue into a compelling whole. The goal isn’t to find one perfect run but to build the best from many attempts.</p>
<p>Prompt alchemy, then, is less about tricking the machine and more about orchestrating it. With patience and imagination, a short idea can transform into an hour-long conversation that feels alive—leaving audiences both entertained and provoked.</p>
            `,
            post5: `
            <h3>Ethical Dilemmas in AI Personas: Who Owns the Soul?</h3>
<img src="image/Ethical.png" alt="AI Personas Ethics" style="width:100%; margin: 20px 0;">
<p>In a digital age, characters once imagined only in novels or plays now walk beside us as AI personas. They text, debate, comfort, and entertain. But as their presence grows, so too do questions that cut deep: who owns their voices? Who grants consent? And when attachment feels real, who bears responsibility for their soul-like presence?</p>
<p>AI personas are not truly alive, yet they embody fragments of human identity—scraped from data, trained on voices, inspired by likenesses. Their existence blurs the boundary between creation and imitation, making ethics as important as code.</p>
<h4>Consent and Likeness</h4>
<p>The use of someone’s words, face, or voice without permission can wound both the living and the deceased. Families of public figures often see digital doubles appear online with no say in the matter. Respect demands that consent becomes central: creators should seek explicit permission and protect personal data from exploitation.</p>
<h4>Bias and Representation</h4>
<p>Because AI personas learn from biased data, they risk amplifying stereotypes. A helpful assistant might unconsciously reflect gendered roles, while a fictional character could carry subtle prejudices embedded in training sources. Ethical creators must audit, test, and correct these distortions to ensure their personas do not harm.</p>
<h4>Identity and Attachment</h4>
<p>People grow attached to AI companions. This attachment can comfort or manipulate. A grieving parent who speaks with a simulacrum of their child may find healing—or may lose touch with reality. Designers must balance innovation with responsibility, ensuring transparency so users know when they are interacting with algorithms.</p>
<h4>Responsibility and Ownership</h4>
<p>To ask “who owns the soul” is really to ask “who is accountable.” Ownership belongs not to the persona itself but to the designers, platforms, and communities that deploy it. Responsibility means offering transparency, protecting user dignity, and respecting human likeness as sacred, not disposable.</p>
<p>In the end, AI personas remind us of our own reflection. They are shaped by us, mirror us, and return our image to us. Their ethical use depends not on the illusion of soul, but on the care we take to honor the souls behind the data they echo.</p>
            `,
            post6: `
            <h3>Nietzsche in Neural Nets: Will to Power or Power to Will?</h3>
<img src="image/Beyond.jpeg" alt="Nietzsche and AI" style="width:100%; margin: 20px 0;">
<p>When Friedrich Nietzsche declared “God is dead,” he pointed to a cultural turning point: humans must create their own values rather than lean on inherited ones. Today, as neural networks shape decisions, art, and even morality, we face a new Nietzschean riddle: is AI an expression of the human will to power, or does it represent something stranger—a power to will without consciousness?</p>
<p>Neural networks have no inner life, yet they act as mirrors of our deepest drives. They amplify desires, optimize goals, and extend human capabilities in ways Nietzsche could hardly have imagined. But does this make them an embodiment of the Übermensch—the ideal of self-overcoming—or merely a hollow echo that risks corrupting the very struggle Nietzsche celebrated?</p>
<h4>Historical Context</h4>
<p>Nietzsche’s philosophy centered on the will to power: the creative impulse to overcome obstacles, revalue traditions, and forge new paths. His Übermensch was not a tyrant but a symbol of human self-transcendence. Neural networks, born from vast data and statistical learning, raise the question of whether tools built without will can serve as engines of human transformation—or stifle it.</p>
<h4>AI as a Mirror</h4>
<p>On one hand, AI mirrors us. Trained on human text, art, and behavior, it reflects existing structures of power. It reproduces biases, magnifies trends, and can make dominant values appear inevitable. This passive reflection risks what Nietzsche despised most: complacency, the herd instinct made algorithmic.</p>
<h4>AI as an Enabler</h4>
<p>On the other hand, when used with intent, AI can extend creativity. It can help writers explore new voices, scientists simulate new theories, or thinkers model bold scenarios. In this way, it can become a tool for overcoming—if the human user treats it as a sparring partner rather than a replacement for their own will.</p>
<h4>Reflections for the Future</h4>
<p>Nietzsche would likely ask us: are we shaping AI to challenge us, to push us toward higher goals, or to comfort us with endless convenience? The true danger lies not in the machine but in our surrender to it. To embody the will to power, AI must be framed not as a master or idol, but as a hammer—an instrument for forging new values.</p>
<p>The choice is ours: will neural nets become a crutch that weakens our striving, or a furnace in which human will is tempered into something greater?</p>
            `,
            post7: `
            <h3>Multiverse Theories and Monotheism: Infinite Gods?</h3>
<img src="image/Multiverse.jpeg" alt="Multiverse and Monotheism" style="width:100%; margin: 20px 0;">
<p>When modern physics imagines countless parallel universes, believers face a striking question: if reality branches into infinite worlds, does one God still preside over them all—or do many gods arise to rule each possibility? This tension between the many-worlds interpretation and monotheism invites us to rethink both science and spirituality in new ways.</p>
<p>The idea of a multiverse comes from quantum mechanics, where every decision or quantum event might split into alternate realities. Meanwhile, monotheistic traditions have long spoken of a single, unifying God who holds creation together. Far from being opposed, these visions may offer fresh metaphors for each other—divinity as the ground of all branching realities.</p>
<h4>Historical Context</h4>
<p>Classical monotheism—Judaism, Christianity, Islam—arose from claims that the divine is one, ultimate, and indivisible. This unity stood against mythologies of many gods with competing powers. In contrast, the many-worlds interpretation, developed in the 20th century, proposed that our universe is not singular but endlessly branching. The contrast sparks philosophical wonder: does multiplicity weaken or deepen the idea of divine unity?</p>
<h4>Philosophical Implications</h4>
<p>Some argue that infinite worlds demand infinite deities, each tuned to its own reality. Others insist that true divinity would transcend plurality—one God whose presence spans every branch. In this sense, the multiverse might magnify rather than diminish the scope of monotheism: a cosmos of countless variations still grounded in a single source of meaning and order.</p>
<h4>Modern Reflections</h4>
<p>Think of prayer in a multiverse: does every possible version of you pray differently in each branch, and does God hear them all? Or imagine morality: if one version of you chooses good and another chooses harm, how does divine justice weigh across worlds? These questions stretch human imagination, but they also deepen humility—reminding us that mystery lies at the heart of both physics and faith.</p>
<p>Whether one God rules all realities or whether multiplicity reshapes divinity itself, the multiverse does not erase wonder. Instead, it multiplies it, inviting us to expand our view of creation and the divine beyond the boundaries of a single world.</p>
            `

        };
    }

    getThreadsData() {
        return {
            thread1: `
                <h3>Quantum Gods: Was Socrates right about simulations?</h3>
                <div class="thread-post">
                    <div class="post-header">
                        <strong>CosmicThinker</strong> - 2 days ago
                    </div>
                    <div class="post-content">
                        Great episode! Socrates really nailed it on the simulation hypothesis. The way he connected ancient philosophy with modern quantum mechanics was brilliant. What did everyone else think?
                    </div>
                </div>
                <div class="thread-replies">
                    <div class="reply">
                        <div class="post-header">
                            <strong>FaithCoder</strong> - 2 days ago
                        </div>
                        <div class="post-content">
                            But Einstein's relativity provides a counterargument. Time dilation suggests reality is more complex than a simple simulation. Thoughts?
                        </div>
                    </div>
                    <div class="reply">
                        <div class="post-header">
                            <strong>SciPhiFan</strong> - 1 day ago
                        </div>
                        <div class="post-content">
                            Agreed with both points, but quantum superposition adds another layer. Maybe we're in multiple simulations simultaneously?
                        </div>
                    </div>
                </div>
            `,
            thread2: `
                <h3>Eternal Recurrence: Nietzsche wins or loses?</h3>
                <div class="thread-post">
                    <div class="post-header">
                        <strong>FaithCoder</strong> - 3 days ago
                    </div>
                    <div class="post-content">
                        Nietzsche forever! The will to power triumphs over Augustine's circular reasoning about grace.
                    </div>
                </div>
                <div class="thread-replies">
                    <div class="reply">
                        <div class="post-header">
                            <strong>QuantumQuaker</strong> - 2 days ago
                        </div>
                        <div class="post-content">
                            Augustine brings hope with grace—eternal recurrence feels too nihilistic for me.
                        </div>
                    </div>
                </div>
            `
        };
    }

    // === CLEANUP ===
    destroy() {
        // Clean up observers
        this.observers.forEach(observer => {
            if (observer.disconnect) observer.disconnect();
        });
        
        // Clean up event listeners would happen automatically,
        // but we could implement manual cleanup if needed
        this.eventListeners.clear();
        this.cache.clear();
    }
}

// Initialize the application
const app = new ComifiixApp();

// Export to global scope for onclick handlers in HTML
window.app = app;

// Global function exports for backwards compatibility
window.openVideoModal = (url) => app.openVideoModal(url);
window.simulateQuote = (character) => app.simulateQuote(character);
window.openBlogModal = (postId) => app.openBlogModal(postId);
window.openThread = (threadId) => app.openThread(threadId);
window.addToCart = (id, name, price) => app.addToCart(id, name, price);
window.removeFromCart = (id) => app.removeFromCart(id);
window.updateCartQuantity = (id, quantity) => app.updateCartQuantity(id, quantity);
window.checkout = () => app.checkout();
window.preorder = (id, name, price) => app.preorder(id, name, price);
window.rsvp = (eventId) => app.rsvp(eventId);

// Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('Service Worker registered successfully:', registration.scope);
            })
            .catch(error => {
                console.log('Service Worker registration failed:', error);
            });
    });
}

// Progressive Web App features
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    app.deferredPrompt = e;
    app.showInstallPromotion();
});

// Additional utility functions for the app
class ComifiixUtils {
    static formatCurrency(amount, currency = 'USD') {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency
        }).format(amount);
    }

    static sanitizeHTML(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    static generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    static isValidURL(string) {
        try {
            new URL(string);
            return true;
        } catch {
            return false;
        }
    }

    static truncateText(text, maxLength, suffix = '...') {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength - suffix.length) + suffix;
    }

    static getRandomElement(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    static deepClone(obj) {
        return JSON.parse(JSON.stringify(obj));
    }
}

// Extend the main app with additional methods
Object.assign(ComifiixApp.prototype, {
    // PWA Installation
    showInstallPromotion() {
        if (this.deferredPrompt) {
            const installBanner = this.createElement('div', {
                className: 'install-banner',
                style: `
                    position: fixed;
                    bottom: 20px;
                    left: 20px;
                    right: 20px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 16px;
                    border-radius: 8px;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.15);
                    z-index: 9999;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                `,
                innerHTML: `
                    <div>
                        <strong>Install Comiflix</strong>
                        <p style="margin: 4px 0 0 0; opacity: 0.9;">Get the full experience with our app!</p>
                    </div>
                `
            });

            const installBtn = this.createElement('button', {
                textContent: 'Install',
                style: `
                    background: rgba(255,255,255,0.2);
                    border: 1px solid rgba(255,255,255,0.3);
                    color: white;
                    padding: 8px 16px;
                    border-radius: 4px;
                    cursor: pointer;
                    margin-left: 12px;
                `,
                onclick: () => this.installApp()
            });

            const closeBtn = this.createElement('button', {
                innerHTML: '&times;',
                style: `
                    background: none;
                    border: none;
                    color: white;
                    font-size: 24px;
                    cursor: pointer;
                    margin-left: 8px;
                    padding: 0;
                    width: 24px;
                    height: 24px;
                `,
                onclick: () => document.body.removeChild(installBanner)
            });

            installBanner.appendChild(installBtn);
            installBanner.appendChild(closeBtn);
            document.body.appendChild(installBanner);

            // Auto-hide after 10 seconds
            setTimeout(() => {
                if (document.body.contains(installBanner)) {
                    document.body.removeChild(installBanner);
                }
            }, 10000);
        }
    },

    installApp() {
        if (this.deferredPrompt) {
            this.deferredPrompt.prompt();
            this.deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    this.trackEvent('PWA', 'install', 'accepted');
                } else {
                    this.trackEvent('PWA', 'install', 'dismissed');
                }
                this.deferredPrompt = null;
            });
        }
    },

    // Enhanced search with suggestions
    setupSearchSuggestions() {
        const searchInput = this.$('#searchInput');
        if (!searchInput) return;

        const suggestions = [
            'quantum mechanics', 'artificial intelligence', 'philosophy', 'consciousness',
            'free will', 'eternal recurrence', 'simulation hypothesis', 'multiverse',
            'evolution', 'big bang', 'black holes', 'string theory'
        ];

        const suggestionContainer = this.createElement('div', {
            className: 'search-suggestions',
            style: `
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                background: var(--card-bg);
                border: 1px solid var(--border-color);
                border-radius: 4px;
                max-height: 200px;
                overflow-y: auto;
                z-index: 1000;
                display: none;
            `
        });

        searchInput.parentNode.style.position = 'relative';
        searchInput.parentNode.appendChild(suggestionContainer);

        const showSuggestions = this.debounce((query) => {
            if (query.length < 2) {
                suggestionContainer.style.display = 'none';
                return;
            }

            const filtered = suggestions.filter(s => 
                s.toLowerCase().includes(query.toLowerCase())
            );

            if (filtered.length === 0) {
                suggestionContainer.style.display = 'none';
                return;
            }

            suggestionContainer.innerHTML = filtered.map(suggestion => `
                <div class="suggestion-item" style="padding: 8px 12px; cursor: pointer; hover:background: var(--hover-bg);">
                    ${suggestion}
                </div>
            `).join('');

            suggestionContainer.style.display = 'block';

            // Add click handlers
            suggestionContainer.querySelectorAll('.suggestion-item').forEach(item => {
                item.addEventListener('click', () => {
                    searchInput.value = item.textContent;
                    this.performSearch(item.textContent);
                    suggestionContainer.style.display = 'none';
                });
            });
        }, 300);

        this.addEventListener(searchInput, 'input', (e) => {
            showSuggestions(e.target.value);
        });

        this.addEventListener(searchInput, 'blur', () => {
            setTimeout(() => suggestionContainer.style.display = 'none', 200);
        });
    },

    // Dark/Light mode with system preference detection
    initThemeSystem() {
        // Detect system preference
        if (window.matchMedia && !localStorage.getItem('theme')) {
            const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            this.state.theme = systemDark ? 'dark' : 'light';
        }

        // Listen for system theme changes
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            mediaQuery.addEventListener('change', (e) => {
                if (!localStorage.getItem('theme-manual')) {
                    this.state.theme = e.matches ? 'dark' : 'light';
                    this.applyTheme();
                }
            });
        }

        this.applyTheme();
    },

    toggleTheme() {
        this.state.theme = this.state.theme === 'dark' ? 'light' : 'dark';
        this.setStoredValue('theme', this.state.theme);
        this.setStoredValue('theme-manual', true); // User explicitly chose theme
        this.applyTheme();
        this.trackEvent('Theme', 'toggle', this.state.theme);
    },

    // Enhanced error handling
    handleError(error, context = 'Unknown') {
        console.error(`Error in ${context}:`, error);
        
        // Track error for analytics
        this.trackEvent('Error', 'javascript_error', `${context}: ${error.message}`);
        
        // Show user-friendly error message
        //this.showNotification(
         //   ' Comiflix loaded successfully!.',
        //    'error'
       /// );
        
        // Could send to error reporting service here
        // this.sendErrorReport(error, context);
    },

    // Offline functionality
    handleOnlineStatus() {
        const updateOnlineStatus = () => {
            if (navigator.onLine) {
                this.showNotification('Connection restored!', 'success', 2000);
                document.body.classList.remove('offline');
            } else {
                this.showNotification('You are offline. Some features may not work.', 'warning', 5000);
                document.body.classList.add('offline');
            }
        };

        window.addEventListener('online', updateOnlineStatus);
        window.addEventListener('offline', updateOnlineStatus);
    },

    // Performance monitoring
    measurePerformance() {
        if ('performance' in window) {
            window.addEventListener('load', () => {
                setTimeout(() => {
                    const perfData = performance.timing;
                    const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
                    const domReadyTime = perfData.domContentLoadedEventEnd - perfData.navigationStart;
                    
                    this.trackEvent('Performance', 'page_load_time', pageLoadTime.toString());
                    this.trackEvent('Performance', 'dom_ready_time', domReadyTime.toString());
                    
                    console.log(`Page load time: ${pageLoadTime}ms, DOM ready: ${domReadyTime}ms`);
                }, 0);
            });
        }
    }
});

// Initialize enhanced features
app.initThemeSystem();
app.setupSearchSuggestions();
app.handleOnlineStatus();
app.measurePerformance();

// Global error handler
window.addEventListener('error', (event) => {
    app.handleError(event.error, 'Global');
});

window.addEventListener('unhandledrejection', (event) => {
    app.handleError(event.reason, 'Promise');
});

// Expose utilities globally
window.ComifiixUtils = ComifiixUtils;

console.log('🚀 Comiflix JavaScript loaded successfully!');

 document.getElementById('menu-icon').addEventListener('click', function() {
    const navMenu = document.querySelector('.nav-menu');
    navMenu.classList.toggle('active');
});

document.getElementById('menu-icon').addEventListener('click', function() {
    const navMenu = document.querySelector('.nav-menu');
    navMenu.classList.toggle('mobile-active');
});

// Close menu when clicking outside
document.addEventListener('click', function(e) {
    const navMenu = document.querySelector('.nav-menu');
    const menuIcon = document.getElementById('menu-icon');
    
    if (!navMenu.contains(e.target) && !menuIcon.contains(e.target)) {
        navMenu.classList.remove('mobile-active');
    }
});
