document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lucide Icons
    lucide.createIcons();

    // 2. Header scroll effect
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 3. Mobile Menu Toggle
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        const icon = menuToggle.querySelector('i');
        if (navMenu.classList.contains('active')) {
            menuToggle.innerHTML = '<i data-lucide="x"></i>';
        } else {
            menuToggle.innerHTML = '<i data-lucide="menu"></i>';
        }
        lucide.createIcons();
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            menuToggle.innerHTML = '<i data-lucide="menu"></i>';
            lucide.createIcons();
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!menuToggle.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove('active');
            menuToggle.innerHTML = '<i data-lucide="menu"></i>';
            lucide.createIcons();
        }
    });

    // 4. Services Filters & "Ver Mais" logic
    const filterButtons = document.querySelectorAll('.filter-btn');
    const serviceCards = document.querySelectorAll('.service-card');
    const btnServicesMore = document.getElementById('btn-services-more');
    let showAllServices = false;

    function updateServicesVisibility() {
        const activeFilterBtn = document.querySelector('.filter-btn.active');
        const filter = activeFilterBtn ? activeFilterBtn.getAttribute('data-filter') : 'all';
        
        let visibleCount = 0;
        let totalMatching = 0;

        serviceCards.forEach(card => {
            const category = card.getAttribute('data-category');
            const matchesFilter = filter === 'all' || filter === category;

            if (matchesFilter) {
                totalMatching++;
                if (showAllServices || visibleCount < 6) {
                    card.style.display = 'flex';
                    // Force reflow
                    card.offsetHeight;
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                    visibleCount++;
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(10px)';
                    card.style.display = 'none';
                }
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(10px)';
                card.style.display = 'none';
            }
        });

        // Show/hide/update "Ver Mais" button
        if (totalMatching > 6) {
            btnServicesMore.parentElement.style.display = 'block';
            if (showAllServices) {
                btnServicesMore.innerHTML = 'Ver Menos Serviços <i data-lucide="chevron-up"></i>';
            } else {
                btnServicesMore.innerHTML = 'Ver Mais Serviços <i data-lucide="chevron-down"></i>';
            }
        } else {
            btnServicesMore.parentElement.style.display = 'none';
        }
        lucide.createIcons();
    }

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            showAllServices = false; // Reset limit when filter changes
            updateServicesVisibility();
        });
    });

    btnServicesMore.addEventListener('click', () => {
        showAllServices = !showAllServices;
        updateServicesVisibility();
        if (!showAllServices) {
            document.getElementById('services').scrollIntoView({ behavior: 'smooth' });
        }
    });

    // Run initial services setup
    updateServicesVisibility();

    // 5. Products Search and Filters & "Ver Mais" logic
    const searchInput = document.getElementById('search-input');
    const searchClear = document.getElementById('search-clear');
    const categoryTabs = document.querySelectorAll('.category-tab');
    const productsContainer = document.getElementById('products-rows-container');
    const resultInfo = document.getElementById('result-info');
    const productsMoreContainer = document.getElementById('products-more-container');
    const btnProductsMore = document.getElementById('btn-products-more');

    let activeCategory = 'all';
    let searchQuery = '';
    let showAllProducts = false;
    let currentFilteredList = [];

    // Human readable category names mapping
    const categoryNames = {
        'all': 'Todos os produtos',
        'racao-cao': 'Rações Cão',
        'racao-gato': 'Rações Gato',
        'granel': 'Rações a Granel',
        'petisco-sache': 'Sachês & Petiscos',
        'areia-tapete': 'Areias & Tapetes',
        'medicamento': 'Medicamentos',
        'acessorio': 'Acessórios & Brinquedos'
    };

    function renderProducts() {
        productsContainer.innerHTML = '';

        if (currentFilteredList.length === 0) {
            resultInfo.textContent = 'Nenhum produto encontrado';
            productsContainer.innerHTML = `
                <div class="products-empty">
                    <i data-lucide="search-code"></i>
                    <h4>Nenhum resultado encontrado</h4>
                    <p>Tente buscar por termos diferentes ou selecione outra categoria.</p>
                </div>
            `;
            productsMoreContainer.style.display = 'none';
            lucide.createIcons();
            return;
        }

        const countText = currentFilteredList.length === 1 
            ? '1 produto encontrado' 
            : `${currentFilteredList.length} produtos encontrados`;
        resultInfo.textContent = countText;

        // PAGINATION/LIMIT: Show 4 products by default
        const hasMore = currentFilteredList.length > 4;
        const itemsToRender = (showAllProducts || !hasMore) 
            ? currentFilteredList 
            : currentFilteredList.slice(0, 4);

        if (hasMore) {
            productsMoreContainer.style.display = 'block';
            if (showAllProducts) {
                btnProductsMore.innerHTML = 'Ver Menos Produtos <i data-lucide="chevron-up"></i>';
            } else {
                btnProductsMore.innerHTML = 'Ver Mais Produtos <i data-lucide="chevron-down"></i>';
            }
        } else {
            productsMoreContainer.style.display = 'none';
        }

        itemsToRender.forEach(prod => {
            const row = document.createElement('div');
            row.className = 'product-row';

            // Custom pre-filled WhatsApp message for this product
            const textMsg = encodeURIComponent(`Olá! Vi no site o produto "${prod.name}" e gostaria de consultar a disponibilidade dele no Rabicho.`);
            const waLink = `https://wa.me/5541991290854?text=${textMsg}`;

            row.innerHTML = `
                <div class="product-info">
                    <span class="product-name">${prod.name}</span>
                    <div class="product-sub">
                        <span class="product-cat-badge">${categoryNames[prod.category] || prod.category}</span>
                        <span>Marca: <strong>${prod.brand}</strong></span>
                    </div>
                </div>
                <div class="product-action">
                    <a href="${waLink}" class="product-whatsapp-btn" target="_blank" rel="noopener noreferrer">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                            <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 0 0 1.333 4.99L2 22l5.233-1.371a9.947 9.947 0 0 0 4.779 1.226h.005c5.505 0 9.989-4.478 9.99-9.985A9.97 9.97 0 0 0 12.012 2zm5.727 14.156c-.252.708-1.461 1.305-2.01 1.355-.494.045-1.134.072-3.235-.802-2.684-1.118-4.42-3.85-4.554-4.03-.133-.18-1.077-1.433-1.077-2.735 0-1.302.678-1.942.92-2.203.242-.261.53-.325.707-.325.176 0 .353.001.507.008.163.008.38-.03.593.483.218.528.747 1.823.81 1.956.064.133.107.288.017.469-.09.18-.135.289-.271.447-.136.157-.285.352-.407.472-.136.133-.277.278-.12.548.156.271.696 1.144 1.493 1.854.613.548 1.134.82 1.43.955.297.135.469.113.645-.09.176-.203.748-.871.95-1.171.2-.3.402-.252.676-.151.275.1.1.28.1.58.55v.281c.075.15.54 1.178 1.455.518c.252-.15.421-.355.673-.355.252 0 .421.105.421.105z"/>
                        </svg>
                        Encomendar
                    </a>
                </div>
            `;
            productsContainer.appendChild(row);
        });

        // Initialize icons in the new rows
        lucide.createIcons();
    }

    function filterProducts() {
        searchQuery = searchInput.value.toLowerCase().trim();

        // Show/hide search clear button
        if (searchQuery.length > 0) {
            searchClear.classList.add('active');
        } else {
            searchClear.classList.remove('active');
        }

        currentFilteredList = PRODUCTS.filter(prod => {
            const matchesCategory = activeCategory === 'all' || prod.category === activeCategory;
            const matchesSearch = prod.name.toLowerCase().includes(searchQuery) || 
                                 prod.brand.toLowerCase().includes(searchQuery);
            return matchesCategory && matchesSearch;
        });

        renderProducts();
    }

    // Bind Search Input
    searchInput.addEventListener('input', () => {
        showAllProducts = false; // Reset limit when searching
        filterProducts();
    });

    // Bind Search Clear
    searchClear.addEventListener('click', () => {
        searchInput.value = '';
        showAllProducts = false;
        filterProducts();
        searchInput.focus();
    });

    // Bind Category Tabs
    categoryTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            categoryTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            activeCategory = tab.getAttribute('data-category');
            showAllProducts = false; // Reset limit when category changes
            filterProducts();
        });
    });

    // Bind Products "Ver Mais" Button
    btnProductsMore.addEventListener('click', () => {
        showAllProducts = !showAllProducts;
        renderProducts();
        if (!showAllProducts) {
            document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
        }
    });

    // Initial render setup for products
    currentFilteredList = PRODUCTS;
    renderProducts();

    // 6. Reveal on Scroll (Intersection Observer)
    const revealElements = document.querySelectorAll('.reveal');
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Once it is revealed, we don't need to observe it anymore
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // 7. Lightbox Gallery
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');

    // Make list of all image sources and descriptions from gallery items
    const galleryImages = [];
    galleryItems.forEach(item => {
        const img = item.querySelector('img');
        galleryImages.push({
            src: img.src,
            alt: img.alt
        });
    });

    let currentLightboxIndex = 0;

    function openLightbox(index) {
        currentLightboxIndex = index;
        const imgData = galleryImages[currentLightboxIndex];
        lightboxImg.src = imgData.src;
        lightboxImg.alt = imgData.alt;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Stop scrolling
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
        setTimeout(() => {
            lightboxImg.src = '';
        }, 300);
    }

    function showNextImage() {
        currentLightboxIndex = (currentLightboxIndex + 1) % galleryImages.length;
        const imgData = galleryImages[currentLightboxIndex];
        lightboxImg.style.opacity = '0';
        setTimeout(() => {
            lightboxImg.src = imgData.src;
            lightboxImg.alt = imgData.alt;
            lightboxImg.style.opacity = '1';
        }, 150);
    }

    function showPrevImage() {
        currentLightboxIndex = (currentLightboxIndex - 1 + galleryImages.length) % galleryImages.length;
        const imgData = galleryImages[currentLightboxIndex];
        lightboxImg.style.opacity = '0';
        setTimeout(() => {
            lightboxImg.src = imgData.src;
            lightboxImg.alt = imgData.alt;
            lightboxImg.style.opacity = '1';
        }, 150);
    }

    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            openLightbox(index);
        });
    });

    lightboxClose.addEventListener('click', closeLightbox);
    lightboxNext.addEventListener('click', showNextImage);
    lightboxPrev.addEventListener('click', showPrevImage);

    // Close lightbox clicking outside the image
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Keyboard navigation in lightbox
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        
        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowRight') {
            showNextImage();
        } else if (e.key === 'ArrowLeft') {
            showPrevImage();
        }
    });
});
