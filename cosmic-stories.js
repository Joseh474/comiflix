// Cosmic Stories JavaScript - Missing/Incomplete Functions

// ==========================================
// STORY MODAL FUNCTIONS
// ==========================================

// Full story data with complete content
const fullStoryData = [
    {
        id: 0,
        title: "Supermassive Black Hole Discovered at Dawn of Universe",
        category: "research",
        image: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800",
        author: "Dr. Sarah Chen",
        date: "October 1, 2025",
        readTime: "8 min read",
        views: "120K",
        content: `
            <h2>Supermassive Black Hole Discovered at Dawn of Universe</h2>
            <img src="https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800" alt="Black Hole">
            <div class="story-meta">
                <span class="category"><i class="fas fa-atom"></i> Astrophysics</span>
                <span class="date"><i class="far fa-calendar"></i> October 1, 2025</span>
                <span class="read-time"><i class="far fa-clock"></i> 8 min read</span>
            </div>
            <p>Astronomers have detected one of the most massive black holes ever discovered, existing just 470 million years after the Big Bang. This groundbreaking finding challenges our understanding of how quickly these cosmic giants could form in the early universe.</p>
            <h3>The Discovery</h3>
            <p>Using data from the James Webb Space Telescope, researchers identified a quasar powered by a black hole with a mass of approximately 10 million times that of our Sun. The discovery was made possible by Webb's unprecedented infrared capabilities, which allow astronomers to peer deeper into the early universe than ever before.</p>
            <h3>Implications for Cosmology</h3>
            <p>This finding raises profound questions about black hole formation in the early universe. Traditional models suggest that supermassive black holes grow gradually over billions of years, but this discovery indicates they may have formed much more rapidly than previously thought.</p>
            <p>Dr. Sarah Chen, lead researcher on the project, explains: "This black hole is far too massive to have grown from a stellar-mass seed in the time available. We may need to reconsider our models of early universe physics."</p>
            <h3>Future Research</h3>
            <p>The team plans to continue observations with JWST to identify more early supermassive black holes and better understand the mechanisms behind their rapid growth. This research could fundamentally reshape our understanding of cosmic evolution.</p>
        `
    },
    {
        id: 1,
        title: "Dark Matter's Hidden Signature Finally Detected",
        category: "research",
        image: "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=600",
        author: "Dr. Alan Kumar",
        date: "September 28, 2025",
        readTime: "6 min read",
        views: "45K",
        content: `
            <h2>Dark Matter's Hidden Signature Finally Detected</h2>
            <img src="https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=600" alt="Dark Matter">
            <div class="story-meta">
                <span class="category"><i class="fas fa-atom"></i> Particle Physics</span>
                <span class="date"><i class="far fa-calendar"></i> September 28, 2025</span>
                <span class="read-time"><i class="far fa-clock"></i> 6 min read</span>
            </div>
            <p>Scientists at CERN have detected unprecedented signals that may finally prove the existence of dark matter particles. This breakthrough comes after decades of searching for the elusive substance that makes up approximately 27% of the universe.</p>
            <h3>The Experiment</h3>
            <p>Using the Large Hadron Collider's upgraded detectors, researchers observed anomalous particle interactions consistent with theoretical predictions for dark matter candidates known as WIMPs (Weakly Interacting Massive Particles).</p>
            <h3>What This Means</h3>
            <p>If confirmed, this discovery would represent one of the most significant scientific breakthroughs of the century, potentially unlocking mysteries about the universe's structure, formation, and ultimate fate.</p>
            <h3>Next Steps</h3>
            <p>The research team is conducting additional experiments to verify their findings and rule out alternative explanations. Independent verification from other particle physics laboratories worldwide is expected within the next year.</p>
        `
    },
    {
        id: 2,
        title: "10 Mind-Bending Facts About Our Galaxy",
        category: "facts",
        image: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=600",
        author: "Prof. James Webb",
        date: "September 25, 2025",
        readTime: "5 min read",
        views: "128K",
        content: `
            <h2>10 Mind-Bending Facts About Our Galaxy</h2>
            <img src="https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=600" alt="Milky Way">
            <div class="story-meta">
                <span class="category"><i class="fas fa-lightbulb"></i> Cosmic Facts</span>
                <span class="date"><i class="far fa-calendar"></i> September 25, 2025</span>
                <span class="read-time"><i class="far fa-clock"></i> 5 min read</span>
            </div>
            <p>The Milky Way is our cosmic home, but how well do we really know it? Here are 10 fascinating facts that will change how you see our galaxy.</p>
            <h3>1. Ancient Beyond Imagination</h3>
            <p>The Milky Way is approximately 13.6 billion years old, formed just 200 million years after the Big Bang.</p>
            <h3>2. Stellar Population</h3>
            <p>Our galaxy contains between 100-400 billion stars, and potentially even more planets.</p>
            <h3>3. Cosmic Spin</h3>
            <p>The Milky Way rotates at approximately 828,000 km/h, taking about 225-250 million years to complete one rotation.</p>
            <h3>4. Dark Matter Dominance</h3>
            <p>90% of the Milky Way's mass is dark matter, with regular matter making up only 10%.</p>
            <h3>5. Galactic Cannibalism</h3>
            <p>The Milky Way is currently absorbing several smaller dwarf galaxies, growing larger over time.</p>
            <h3>6. Supermassive Center</h3>
            <p>At the galaxy's center lies Sagittarius A*, a supermassive black hole with 4 million times the Sun's mass.</p>
            <h3>7. Collision Course</h3>
            <p>In about 4.5 billion years, the Milky Way will collide and merge with the Andromeda galaxy.</p>
            <h3>8. Stellar Nurseries</h3>
            <p>New stars are born constantly in the Milky Way, at a rate of about 1-2 solar masses per year.</p>
            <h3>9. Cosmic Radiation</h3>
            <p>The galaxy is filled with cosmic rays—high-energy particles that constantly bombard Earth from space.</p>
            <h3>10. Invisible Majority</h3>
            <p>We can only see about 6% of the Milky Way with visible light; the rest is obscured by dust and gas.</p>
        `
    },
    {
        id: 3,
        title: "Breathtaking Nebula: Pillars of Creation Reimagined",
        category: "images",
        image: "https://images.unsplash.com/photo-1464802686167-b939a6910659?w=600",
        author: "NASA/ESA",
        date: "September 20, 2025",
        readTime: "4 min read",
        views: "256K",
        content: `
            <h2>Breathtaking Nebula: Pillars of Creation Reimagined</h2>
            <img src="https://images.unsplash.com/photo-1464802686167-b939a6910659?w=600" alt="Nebula">
            <div class="story-meta">
                <span class="category"><i class="fas fa-camera"></i> Gallery</span>
                <span class="date"><i class="far fa-calendar"></i> September 20, 2025</span>
                <span class="read-time"><i class="far fa-clock"></i> 4 min read</span>
            </div>
            <p>New James Webb Space Telescope images reveal unprecedented detail in these iconic stellar nurseries, showing star formation in ways never before seen.</p>
            <h3>About the Pillars</h3>
            <p>The Pillars of Creation are towering columns of interstellar gas and dust in the Eagle Nebula, located 6,500 light-years from Earth. They were first photographed by Hubble in 1995 and became one of the most iconic images in astronomy.</p>
            <h3>What's New</h3>
            <p>Webb's infrared vision penetrates the dust, revealing newborn stars hidden within the pillars. The new images show unprecedented detail in the structures, colors, and processes of star formation.</p>
            <h3>Scientific Value</h3>
            <p>These images help astronomers understand the early stages of stellar evolution and the role of massive stars in shaping their cosmic neighborhoods.</p>
            <h3>Technical Achievement</h3>
            <p>The images required careful planning and multiple exposures using Webb's Near-Infrared Camera (NIRCam) and Mid-Infrared Instrument (MIRI).</p>
        `
    },
    {
        id: 4,
        title: "Earth-Like Planet Found in Habitable Zone",
        category: "discoveries",
        image: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=600",
        author: "Dr. Maria Rodriguez",
        date: "September 15, 2025",
        readTime: "7 min read",
        views: "89K",
        content: `
            <h2>Earth-Like Planet Found in Habitable Zone</h2>
            <img src="https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=600" alt="Exoplanet">
            <div class="story-meta">
                <span class="category"><i class="fas fa-satellite"></i> Discoveries</span>
                <span class="date"><i class="far fa-calendar"></i> September 15, 2025</span>
                <span class="read-time"><i class="far fa-clock"></i> 7 min read</span>
            </div>
            <p>Astronomers have discovered a potentially habitable exoplanet orbiting a sun-like star just 42 light-years away, making it one of the closest potentially habitable worlds ever found.</p>
            <h3>Planet Characteristics</h3>
            <p>Designated Kepler-452c, the planet is approximately 1.6 times the size of Earth and orbits within its star's habitable zone, where liquid water could exist on the surface.</p>
            <h3>Atmosphere Analysis</h3>
            <p>Preliminary spectroscopic analysis suggests the presence of water vapor and possibly oxygen in the planet's atmosphere, though more observations are needed for confirmation.</p>
            <h3>Implications for Life</h3>
            <p>While the presence of an atmosphere with water vapor is encouraging, scientists caution that much more research is needed to determine if the planet could actually support life as we know it.</p>
            <h3>Future Observations</h3>
            <p>The James Webb Space Telescope and upcoming ground-based observatories will conduct detailed atmospheric studies to search for biosignatures and better understand this fascinating world.</p>
        `
    },
    {
        id: 5,
        title: "Gravitational Wave Background Finally Confirmed",
        category: "research",
        image: "https://images.unsplash.com/photo-1543722530-d2c3201371e7?w=600",
        author: "Dr. Alan Kumar",
        date: "September 10, 2025",
        readTime: "6 min read",
        views: "67K",
        content: `
            <h2>Gravitational Wave Background Finally Confirmed</h2>
            <img src="https://images.unsplash.com/photo-1543722530-d2c3201371e7?w=600" alt="Gravitational Waves">
            <div class="story-meta">
                <span class="category"><i class="fas fa-atom"></i> Astrophysics</span>
                <span class="date"><i class="far fa-calendar"></i> September 10, 2025</span>
                <span class="read-time"><i class="far fa-clock"></i> 6 min read</span>
            </div>
            <p>Pulsar timing arrays reveal the cosmic hum of merging supermassive black holes throughout the universe, confirming decades of theoretical predictions.</p>
            <h3>The Discovery</h3>
            <p>By precisely monitoring pulsars—rotating neutron stars that act as cosmic clocks—astronomers have detected a background of gravitational waves permeating the universe.</p>
            <h3>What It Means</h3>
            <p>This gravitational wave background is thought to be caused by countless pairs of supermassive black holes spiraling toward merger throughout cosmic history.</p>
            <h3>Implications</h3>
            <p>This discovery opens a new window into understanding how galaxies and their central black holes evolve over cosmic time.</p>
        `
    },
    {
        id: 6,
        title: "How Time Slows Down Near Black Holes",
        category: "facts",
        image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600",
        author: "Prof. Lisa Anderson",
        date: "September 5, 2025",
        readTime: "5 min read",
        views: "102K",
        content: `
            <h2>How Time Slows Down Near Black Holes</h2>
            <img src="https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600" alt="Time Dilation">
            <div class="story-meta">
                <span class="category"><i class="fas fa-lightbulb"></i> Cosmic Facts</span>
                <span class="date"><i class="far fa-calendar"></i> September 5, 2025</span>
                <span class="read-time"><i class="far fa-clock"></i> 5 min read</span>
            </div>
            <p>Einstein's theory of relativity predicts extreme time dilation effects near massive objects. Here's how it works and what it means.</p>
            <h3>The Physics</h3>
            <p>According to general relativity, massive objects warp spacetime. The stronger the gravitational field, the slower time passes relative to regions of weaker gravity.</p>
            <h3>Near a Black Hole</h3>
            <p>Close to a black hole's event horizon, time dilation becomes extreme. A clock falling toward the event horizon would appear to an outside observer to slow down and eventually freeze at the boundary.</p>
            <h3>Real-World Examples</h3>
            <p>GPS satellites must account for time dilation—their clocks run faster than those on Earth's surface due to weaker gravity. Near a black hole, this effect is magnified millions of times.</p>
            <h3>The Twin Paradox</h3>
            <p>If one twin orbited near a black hole while the other stayed far away, they could age at vastly different rates—a mind-bending consequence of Einstein's equations.</p>
        `
    }
];

// Open story modal function
function openStoryModal(storyId) {
    const modal = document.getElementById('storyModal');
    const modalContent = document.getElementById('modalStoryContent');
    
    if (!modal || !modalContent) return;
    
    const story = fullStoryData.find(s => s.id === storyId);
    
    if (story) {
        modalContent.innerHTML = story.content;
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
        
        // Track event
        if (typeof app !== 'undefined') {
            app.trackEvent('CosmicStories', 'story_open', story.title);
        }
    }
}

// Close story modal
function closeStoryModal() {
    const modal = document.getElementById('storyModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = ''; // Restore scrolling
    }
}

// ==========================================
// COSMIC FACTS CAROUSEL
// ==========================================

let currentFactIndex = 0;
let factInterval;

function showFact(index) {
    const factCards = document.querySelectorAll('.fact-card');
    const dots = document.querySelectorAll('.carousel-dots .dot');
    
    if (!factCards.length) return;
    
    // Remove active class from all
    factCards.forEach(card => card.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    // Add active class to selected
    if (factCards[index]) factCards[index].classList.add('active');
    if (dots[index]) dots[index].classList.add('active');
    
    currentFactIndex = index;
}

function nextFact() {
    const factCards = document.querySelectorAll('.fact-card');
    const nextIndex = (currentFactIndex + 1) % factCards.length;
    showFact(nextIndex);
}

function startFactCarousel() {
    // Auto-rotate facts every 5 seconds
    factInterval = setInterval(nextFact, 5000);
}

function stopFactCarousel() {
    if (factInterval) {
        clearInterval(factInterval);
    }
}

// ==========================================
// CATEGORY FILTERING
// ==========================================

function setupCategoryFiltering() {
    const categoryButtons = document.querySelectorAll('.category-btn');
    const storyCards = document.querySelectorAll('.story-card');
    const noResults = document.getElementById('noResults');
    
    categoryButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            categoryButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const category = btn.dataset.category;
            let visibleCount = 0;
            
            // Filter stories
            storyCards.forEach(card => {
                if (category === 'all' || card.dataset.category === category) {
                    card.style.display = 'block';
                    visibleCount++;
                } else {
                    card.style.display = 'none';
                }
            });
            
            // Show/hide no results message
            if (noResults) {
                noResults.style.display = visibleCount === 0 ? 'block' : 'none';
            }
            
            // Track event
            if (typeof app !== 'undefined') {
                app.trackEvent('CosmicStories', 'filter', category);
            }
        });
    });
}

// ==========================================
// LOAD MORE FUNCTIONALITY
// ==========================================

function setupLoadMore() {
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            // Simulate loading more stories
            const icon = loadMoreBtn.querySelector('i');
            const originalText = loadMoreBtn.innerHTML;
            
            loadMoreBtn.disabled = true;
            icon.style.animation = 'spin 1s linear infinite';
            
            setTimeout(() => {
                if (typeof app !== 'undefined') {
                    app.showNotification('All stories loaded!', 'info');
                }
                loadMoreBtn.disabled = false;
                icon.style.animation = '';
                
                // Track event
                if (typeof app !== 'undefined') {
                    app.trackEvent('CosmicStories', 'load_more');
                }
            }, 1500);
        });
    }
}

// ==========================================
// NEWSLETTER FORM
// ==========================================

function setupCosmicNewsletter() {
    const form = document.getElementById('cosmicNewsletterForm');
    
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const emailInput = form.querySelector('input[type="email"]');
            const email = emailInput ? emailInput.value : '';
            
            if (email) {
                if (typeof app !== 'undefined') {
                    app.showNotification('Thanks for subscribing to Cosmic Stories!', 'success');
                    app.trackEvent('CosmicStories', 'newsletter_signup', email);
                }
                form.reset();
            }
        });
    }
}

// ==========================================
// SCROLL ANIMATIONS
// ==========================================

function setupScrollAnimations() {
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
    
    // Observe story cards
    document.querySelectorAll('.story-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
}

// ==========================================
// INITIALIZATION
// ==========================================

function initCosmicStories() {
    // Setup event listeners
    setupCategoryFiltering();
    setupLoadMore();
    setupCosmicNewsletter();
    setupScrollAnimations();
    
    // Start facts carousel
    startFactCarousel();
    
    // Setup modal close handlers
    const closeModalBtn = document.getElementById('closeStoryModal');
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeStoryModal);
    }
    
    // Close modal on outside click
    const modal = document.getElementById('storyModal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeStoryModal();
            }
        });
    }
    
    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeStoryModal();
        }
    });
    
    // Pause carousel when user hovers over facts
    const factsCarousel = document.querySelector('.facts-carousel');
    if (factsCarousel) {
        factsCarousel.addEventListener('mouseenter', stopFactCarousel);
        factsCarousel.addEventListener('mouseleave', startFactCarousel);
    }
    
    console.log('🌌 Cosmic Stories initialized!');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCosmicStories);
} else {
    initCosmicStories();
}

// Export functions to global scope
window.openStoryModal = openStoryModal;
window.closeStoryModal = closeStoryModal;
window.showFact = showFact;

// Add CSS animation for spinning icon
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);