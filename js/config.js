// Configuration for GitHub Pages and Local Development
(function() {
    'use strict';
    
    // Detect if we're on GitHub Pages
    const isGitHubPages = window.location.hostname === 'russellpowers.github.io' || 
                         window.location.hostname.includes('github.io');
    
    // Base path for assets
    const basePath = isGitHubPages ? '/Book1_CS/book-website/' : '/';
    
    // Update all relative paths
    function updatePaths() {
        // Update CSS links
        const cssLinks = document.querySelectorAll('link[href^="css/"]');
        cssLinks.forEach(link => {
            link.href = basePath + link.href;
        });
        
        // Update JS links
        const jsLinks = document.querySelectorAll('script[src^="js/"]');
        jsLinks.forEach(script => {
            script.src = basePath + script.src;
        });
        
        // Update navigation links
        const navLinks = document.querySelectorAll('a[href^="./"], a[href^="0"], a[href^="index.html"], a[href^="resources.html"], a[href^="about.html"]');
        navLinks.forEach(link => {
            if (link.href.includes('http')) return; // Skip external links
            
            const href = link.getAttribute('href');
            if (href && !href.startsWith('http') && !href.startsWith('#')) {
                link.href = basePath + href;
            }
        });
        
        // Update image sources
        const images = document.querySelectorAll('img[src^="images/"]');
        images.forEach(img => {
            img.src = basePath + img.src;
        });
    }
    
    // Update paths when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', updatePaths);
    } else {
        updatePaths();
    }
    
    // Export configuration for other scripts
    window.SiteConfig = {
        basePath: basePath,
        isGitHubPages: isGitHubPages
    };
    
})();
