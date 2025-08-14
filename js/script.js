// Book Website JavaScript
// System Design & Python Development

(function() {
    'use strict';

    // Global variables
    let currentChapter = 1;
    let readingProgress = 0;
    let isScrolling = false;

    // DOM elements
    const elements = {
        progressFill: null,
        progressText: null,
        navToggle: null,
        navMenu: null,
        tocLinks: null,
        chapterContent: null,
        demoResult: null
    };

    // Initialize the application
    function init() {
        cacheElements();
        bindEvents();
        setupIntersectionObserver();
        updateChapterInfo();
        setupCodeHighlighting();
        setupInteractiveDemos();
        setupMobileNavigation();
        setupSearch();
        setupBookmarking();
        setupPrintFunctionality();
        setupMermaid();
    }

    // Cache DOM elements for better performance
    function cacheElements() {
        elements.progressFill = document.querySelector('.progress-fill');
        elements.progressText = document.querySelector('.progress-text');
        elements.navToggle = document.querySelector('.nav-toggle');
        elements.navMenu = document.querySelector('.nav-menu');
        elements.tocLinks = document.querySelectorAll('.toc-nav a');
        elements.chapterContent = document.querySelector('.chapter-content');
        elements.demoResult = document.getElementById('demo-result');
    }

    // Bind event listeners
    function bindEvents() {
        // Navigation toggle
        if (elements.navToggle) {
            elements.navToggle.addEventListener('click', toggleMobileNavigation);
        }

        // Table of contents navigation
        elements.tocLinks.forEach(link => {
            link.addEventListener('click', handleTocNavigation);
        });

        // Window events
        window.addEventListener('scroll', throttle(handleScroll, 100));
        window.addEventListener('resize', throttle(handleResize, 250));
        window.addEventListener('keydown', handleKeyboardNavigation);

        // Chapter navigation
        document.querySelectorAll('.chapter-link').forEach(link => {
            link.addEventListener('click', handleChapterNavigation);
        });

        // Print button
        const printBtn = document.querySelector('.print-btn');
        if (printBtn) {
            printBtn.addEventListener('click', printChapter);
        }

        // Bookmark functionality
        document.querySelectorAll('.bookmark-btn').forEach(btn => {
            btn.addEventListener('click', toggleBookmark);
        });
    }

    // Mobile navigation
    function setupMobileNavigation() {
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');

        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                navToggle.classList.toggle('active');
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                    navMenu.classList.remove('active');
                    navToggle.classList.remove('active');
                }
            });
        }
    }

    function toggleMobileNavigation() {
        elements.navMenu.classList.toggle('active');
        elements.navToggle.classList.toggle('active');
    }

    // Scroll handling
    function handleScroll() {
        if (isScrolling) return;
        
        isScrolling = true;
        requestAnimationFrame(() => {
            updateReadingProgress();
            updateActiveTocLink();
            isScrolling = false;
        });
    }

    // Update reading progress
    function updateReadingProgress() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;

        readingProgress = Math.min(100, Math.max(0, scrollPercent));

        if (elements.progressFill) {
            elements.progressFill.style.width = `${readingProgress}%`;
        }

        if (elements.progressText) {
            elements.progressText.textContent = `${Math.round(readingProgress)}% Complete`;
        }

        // Save progress to localStorage
        saveReadingProgress();
    }

    // Update active table of contents link
    function updateActiveTocLink() {
        const sections = document.querySelectorAll('.content-section');
        const tocLinks = document.querySelectorAll('.toc-nav a');

        let currentSection = '';
        const scrollPosition = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = sectionId;
            }
        });

        tocLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }

    // Table of contents navigation
    function handleTocNavigation(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
            const offsetTop = targetElement.offsetTop - 100;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    }

    // Chapter navigation
    function handleChapterNavigation(e) {
        e.preventDefault();
        const chapterNumber = this.textContent.match(/\d+/);
        if (chapterNumber) {
            navigateToChapter(parseInt(chapterNumber[0]));
        }
    }

    function navigateToChapter(chapterNumber) {
        const basePath = window.SiteConfig ? window.SiteConfig.basePath : '/';
        const chapterUrl = `${basePath}0${chapterNumber}-chapter-${chapterNumber}.html`;
        window.location.href = chapterUrl;
    }

    // Keyboard navigation
    function handleKeyboardNavigation(e) {
        // Arrow keys for chapter navigation
        if (e.key === 'ArrowLeft' && e.ctrlKey) {
            e.preventDefault();
            navigateToPreviousChapter();
        } else if (e.key === 'ArrowRight' && e.ctrlKey) {
            e.preventDefault();
            navigateToNextChapter();
        }

        // Space bar to scroll
        if (e.key === ' ' && e.target === document.body) {
            e.preventDefault();
            window.scrollBy(0, window.innerHeight * 0.8);
        }

        // Escape to close mobile menu
        if (e.key === 'Escape') {
            const navMenu = document.querySelector('.nav-menu');
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                document.querySelector('.nav-toggle').classList.remove('active');
            }
        }
    }

    function navigateToPreviousChapter() {
        if (currentChapter > 1) {
            navigateToChapter(currentChapter - 1);
        }
    }

    function navigateToNextChapter() {
        if (currentChapter < 14) {
            navigateToChapter(currentChapter + 1);
        }
    }

    // Resize handling
    function handleResize() {
        updateTableOfContents();
        updateChapterLayout();
    }

    function updateTableOfContents() {
        const toc = document.querySelector('.table-of-contents');
        if (window.innerWidth <= 1024) {
            if (toc) {
                toc.style.position = 'static';
                toc.style.float = 'none';
                toc.style.width = '100%';
                toc.style.marginLeft = '0';
            }
        } else {
            if (toc) {
                toc.style.position = 'sticky';
                toc.style.float = 'right';
                toc.style.width = '280px';
                toc.style.marginLeft = '2rem';
            }
        }
    }

    function updateChapterLayout() {
        const chapterContent = document.querySelector('.chapter-content');
        if (window.innerWidth <= 1024) {
            if (chapterContent) {
                chapterContent.style.marginRight = '0';
            }
        } else {
            if (chapterContent) {
                chapterContent.style.marginRight = '320px';
            }
        }
    }

    // Intersection Observer for animations
    function setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observe elements for animation
        document.querySelectorAll('.content-section, .code-example, .exercise-container').forEach(el => {
            observer.observe(el);
        });
    }

    // Code highlighting setup
    function setupCodeHighlighting() {
        // Prism.js is loaded via CDN, but we can add custom functionality
        document.querySelectorAll('pre code').forEach(block => {
            // Add copy button
            const copyButton = document.createElement('button');
            copyButton.className = 'copy-code-btn';
            copyButton.textContent = 'Copy';
            copyButton.addEventListener('click', () => copyCodeToClipboard(block));

            const buttonContainer = document.createElement('div');
            buttonContainer.className = 'code-header';
            buttonContainer.appendChild(copyButton);

            block.parentNode.insertBefore(buttonContainer, block);
        });
    }

    // Copy code to clipboard
    async function copyCodeToClipboard(codeBlock) {
        try {
            const text = codeBlock.textContent;
            await navigator.clipboard.writeText(text);
            
            const button = codeBlock.parentNode.previousElementSibling.querySelector('.copy-code-btn');
            const originalText = button.textContent;
            button.textContent = 'Copied!';
            button.style.backgroundColor = '#10b981';
            
            setTimeout(() => {
                button.textContent = originalText;
                button.style.backgroundColor = '';
            }, 2000);
        } catch (err) {
            console.error('Failed to copy code:', err);
        }
    }

    // Interactive demos
    function setupInteractiveDemos() {
        // Demo functions
        window.runDemo = function() {
            if (elements.demoResult) {
                elements.demoResult.textContent = 'Running demo...\n\n';
                
                // Simulate demo execution
                setTimeout(() => {
                    elements.demoResult.textContent += 'Demo completed successfully!\n';
                    elements.demoResult.textContent += 'Output: Hello, World!\n';
                    elements.demoResult.textContent += 'Status: OK\n';
                }, 1000);
            }
        };

        window.resetDemo = function() {
            if (elements.demoResult) {
                elements.demoResult.textContent = 'Click "Run Demo" to see the output...';
            }
        };

        // ChatGPT Demo Functions
        window.runChatGPTDemo = function() {
            const demoResult = document.getElementById('chatgpt-demo-result');
            if (demoResult) {
                demoResult.textContent = 'Analyzing error with ChatGPT...\n\n';
                
                setTimeout(() => {
                    demoResult.textContent += 'ChatGPT Response:\n';
                    demoResult.textContent += 'This error occurs because the database table "user" already exists.\n\n';
                    demoResult.textContent += 'Solution:\n';
                    demoResult.textContent += '1. Drop existing tables: db.drop_all()\n';
                    demoResult.textContent += '2. Recreate tables: db.create_all()\n';
                    demoResult.textContent += '3. Or use Flask-Migrate for proper migrations\n\n';
                    demoResult.textContent += 'Prevention:\n';
                    demoResult.textContent += '- Always use migrations in production\n';
                    demoResult.textContent += '- Check if tables exist before creating\n';
                    demoResult.textContent += '- Use version control for schema changes';
                }, 1500);
            }
        };

        window.resetChatGPTDemo = function() {
            const demoResult = document.getElementById('chatgpt-demo-result');
            if (demoResult) {
                demoResult.textContent = 'Click "Ask ChatGPT" to see how AI would debug this error...';
            }
        };

        // Cursor Demo Functions
        window.runCursorDemo = function() {
            const demoResult = document.getElementById('cursor-demo-result');
            if (demoResult) {
                demoResult.textContent = 'Cursor AI is generating code...\n\n';
                
                setTimeout(() => {
                    demoResult.textContent += 'Generated Flask Route:\n';
                    demoResult.textContent += '```python\n';
                    demoResult.textContent += '@app.route(\'/api/tasks\', methods=[\'GET\'])\n';
                    demoResult.textContent += '@login_required\n';
                    demoResult.textContent += 'def get_tasks():\n';
                    demoResult.textContent += '    try:\n';
                    demoResult.textContent += '        tasks = Task.query.filter_by(user_id=current_user.id).all()\n';
                    demoResult.textContent += '        return jsonify([{\n';
                    demoResult.textContent += '            \'id\': task.id,\n';
                    demoResult.textContent += '            \'title\': task.title,\n';
                    demoResult.textContent += '            \'status\': task.status,\n';
                    demoResult.textContent += '            \'created_at\': task.created_at.isoformat()\n';
                    demoResult.textContent += '        } for task in tasks]), 200\n';
                    demoResult.textContent += '    except Exception as e:\n';
                    demoResult.textContent += '        return jsonify({\'error\': str(e)}), 500\n';
                    demoResult.textContent += '```\n\n';
                    demoResult.textContent += 'Cursor AI has generated a complete Flask route with:\n';
                    demoResult.textContent += '- Error handling\n';
                    demoResult.textContent += '- Authentication decorator\n';
                    demoResult.textContent += '- JSON response formatting\n';
                    demoResult.textContent += '- Proper HTTP status codes';
                }, 2000);
            }
        };

        window.resetCursorDemo = function() {
            const demoResult = document.getElementById('cursor-demo-result');
            if (demoResult) {
                demoResult.textContent = 'Click "Generate Code" to see Cursor AI in action...';
            }
        };

    }

    // Setup Mermaid diagrams
    function setupMermaid() {
        if (typeof mermaid !== 'undefined') {
            mermaid.initialize({
                startOnLoad: true,
                theme: 'default',
                flowchart: {
                    useMaxWidth: true,
                    htmlLabels: true,
                    curve: 'basis'
                },
                themeVariables: {
                    primaryColor: '#2563eb',
                    primaryTextColor: '#ffffff',
                    primaryBorderColor: '#1d4ed8',
                    lineColor: '#666666',
                    secondaryColor: '#f3f4f6',
                    tertiaryColor: '#e5e7eb'
                }
            });
        }
    }

    // Search functionality
    function setupSearch() {
        const searchInput = document.querySelector('.search-input');
        if (searchInput) {
            searchInput.addEventListener('input', debounce(handleSearch, 300));
        }
    }

    function handleSearch(e) {
        const query = e.target.value.toLowerCase();
        const content = document.querySelector('.chapter-content');
        
        if (query.length < 2) {
            clearSearchHighlights();
            return;
        }

        highlightSearchTerms(content, query);
    }

    function highlightSearchTerms(container, query) {
        clearSearchHighlights();
        
        const walker = document.createTreeWalker(
            container,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );

        const textNodes = [];
        let node;
        while (node = walker.nextNode()) {
            textNodes.push(node);
        }

        textNodes.forEach(textNode => {
            const text = textNode.textContent;
            const regex = new RegExp(`(${query})`, 'gi');
            
            if (regex.test(text)) {
                const highlightedText = text.replace(regex, '<mark class="search-highlight">$1</mark>');
                const span = document.createElement('span');
                span.innerHTML = highlightedText;
                textNode.parentNode.replaceChild(span, textNode);
            }
        });
    }

    function clearSearchHighlights() {
        document.querySelectorAll('.search-highlight').forEach(highlight => {
            const parent = highlight.parentNode;
            parent.replaceChild(document.createTextNode(highlight.textContent), highlight);
            parent.normalize();
        });
    }

    // Bookmarking functionality
    function setupBookmarking() {
        loadBookmarks();
        updateBookmarkButtons();
    }

    function toggleBookmark(e) {
        e.preventDefault();
        const chapterId = getCurrentChapterId();
        const bookmarks = getBookmarks();
        
        if (bookmarks.includes(chapterId)) {
            removeBookmark(chapterId);
        } else {
            addBookmark(chapterId);
        }
        
        updateBookmarkButtons();
    }

    function addBookmark(chapterId) {
        const bookmarks = getBookmarks();
        if (!bookmarks.includes(chapterId)) {
            bookmarks.push(chapterId);
            localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
        }
    }

    function removeBookmark(chapterId) {
        const bookmarks = getBookmarks();
        const filtered = bookmarks.filter(id => id !== chapterId);
        localStorage.setItem('bookmarks', JSON.stringify(filtered));
    }

    function getBookmarks() {
        const stored = localStorage.getItem('bookmarks');
        return stored ? JSON.parse(stored) : [];
    }

    function loadBookmarks() {
        const bookmarks = getBookmarks();
        // Update UI to show bookmarked chapters
        bookmarks.forEach(chapterId => {
            const bookmarkBtn = document.querySelector(`[data-chapter="${chapterId}"] .bookmark-btn`);
            if (bookmarkBtn) {
                bookmarkBtn.classList.add('bookmarked');
            }
        });
    }

    function updateBookmarkButtons() {
        const chapterId = getCurrentChapterId();
        const bookmarks = getBookmarks();
        const bookmarkBtn = document.querySelector('.bookmark-btn');
        
        if (bookmarkBtn) {
            if (bookmarks.includes(chapterId)) {
                bookmarkBtn.classList.add('bookmarked');
                bookmarkBtn.textContent = '★';
            } else {
                bookmarkBtn.classList.remove('bookmarked');
                bookmarkBtn.textContent = '☆';
            }
        }
    }

    function getCurrentChapterId() {
        // Extract chapter ID from URL or page content
        const chapterNumber = document.querySelector('.chapter-number');
        if (chapterNumber) {
            return chapterNumber.textContent.replace('Chapter ', '');
        }
        return '1';
    }

    // Print functionality
    function setupPrintFunctionality() {
        const printBtn = document.querySelector('.print-btn');
        if (printBtn) {
            printBtn.addEventListener('click', printChapter);
        }
    }

    function printChapter() {
        window.print();
    }

    // Progress saving
    function saveReadingProgress() {
        const chapterId = getCurrentChapterId();
        const progress = {
            chapter: chapterId,
            progress: readingProgress,
            timestamp: Date.now()
        };
        localStorage.setItem(`progress_${chapterId}`, JSON.stringify(progress));
    }

    function loadReadingProgress() {
        const chapterId = getCurrentChapterId();
        const stored = localStorage.getItem(`progress_${chapterId}`);
        if (stored) {
            const progress = JSON.parse(stored);
            readingProgress = progress.progress;
            updateReadingProgress();
        }
    }

    // Chapter info update
    function updateChapterInfo() {
        const chapterNumber = document.querySelector('.chapter-number');
        if (chapterNumber) {
            currentChapter = parseInt(chapterNumber.textContent.replace('Chapter ', ''));
        }
        
        // Update navigation links
        updateNavigationLinks();
        loadReadingProgress();
    }

    function updateNavigationLinks() {
        const prevBtn = document.querySelector('.btn-secondary');
        const nextBtn = document.querySelector('.btn-primary');
        const basePath = window.SiteConfig ? window.SiteConfig.basePath : '/';
        
        if (prevBtn && currentChapter > 1) {
            prevBtn.href = `${basePath}0${currentChapter - 1}-chapter-${currentChapter - 1}.html`;
        }
        
        if (nextBtn && currentChapter < 14) {
            nextBtn.href = `${basePath}0${currentChapter + 1}-chapter-${currentChapter + 1}.html`;
        }
    }

    // Utility functions
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Analytics and tracking
    function trackPageView() {
        // Simple analytics tracking
        const pageData = {
            chapter: currentChapter,
            timestamp: Date.now(),
            userAgent: navigator.userAgent,
            screenSize: `${window.innerWidth}x${window.innerHeight}`
        };
        
        // Send to analytics service (placeholder)
        console.log('Page view tracked:', pageData);
    }

    function trackEvent(eventName, data = {}) {
        const eventData = {
            event: eventName,
            chapter: currentChapter,
            timestamp: Date.now(),
            ...data
        };
        
        console.log('Event tracked:', eventData);
    }

    // Error handling
    function handleError(error, context = '') {
        console.error(`Error in ${context}:`, error);
        
        // Send error to monitoring service
        const errorData = {
            error: error.message,
            stack: error.stack,
            context: context,
            chapter: currentChapter,
            timestamp: Date.now()
        };
        
        console.log('Error logged:', errorData);
    }

    // Performance monitoring
    function measurePerformance() {
        if ('performance' in window) {
            const perfData = performance.getEntriesByType('navigation')[0];
            const loadTime = perfData.loadEventEnd - perfData.loadEventStart;
            
            console.log(`Page load time: ${loadTime}ms`);
            
            if (loadTime > 3000) {
                console.warn('Slow page load detected');
            }
        }
    }

    // Accessibility enhancements
    function setupAccessibility() {
        // Skip to content link
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.textContent = 'Skip to main content';
        skipLink.className = 'skip-link';
        document.body.insertBefore(skipLink, document.body.firstChild);

        // ARIA labels for interactive elements
        document.querySelectorAll('.btn').forEach(btn => {
            if (!btn.getAttribute('aria-label')) {
                btn.setAttribute('aria-label', btn.textContent.trim());
            }
        });

        // Focus management
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Track page view after initialization
    window.addEventListener('load', () => {
        trackPageView();
        measurePerformance();
        setupAccessibility();
    });

    // Export functions for global access
    window.BookWebsite = {
        navigateToChapter,
        toggleBookmark,
        copyCodeToClipboard,
        trackEvent,
        handleError
    };

})();
