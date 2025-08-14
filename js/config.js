// Configuration for GitHub Pages and Local Development
(function() {
    'use strict';
    
    // Detect if we're on GitHub Pages
    const isGitHubPages = window.location.hostname === 'russellpowers.github.io' || 
                         window.location.hostname === 'naruto45.github.io' ||
                         window.location.hostname.includes('github.io');
    
    console.log('Config: Hostname:', window.location.hostname);
    console.log('Config: Pathname:', window.location.pathname);
    console.log('Config: Is GitHub Pages:', isGitHubPages);
    
    // Base path for assets - handle different repository structures
    let basePath = '/';
    if (isGitHubPages) {
        if (window.location.pathname.includes('Book1--CS---Systems-Design')) {
            basePath = '/Book1--CS---Systems-Design/';
        } else if (window.location.pathname.includes('Book1_CS/book-website')) {
            basePath = '/Book1_CS/book-website/';
        } else {
            basePath = '/';
        }
    }
    
    console.log('Config: Determined basePath:', basePath);
    
    // Update all relative paths
    function updatePaths() {
        console.log('Config: Updating paths with basePath:', basePath);
        
        // Update CSS links
        const cssLinks = document.querySelectorAll('link[href^="css/"]');
        console.log('Config: Found CSS links:', cssLinks.length);
        cssLinks.forEach(link => {
            const oldHref = link.href;
            link.href = basePath + link.href;
            console.log('Config: Updated CSS path from', oldHref, 'to', link.href);
        });
        
        // Update JS links
        const jsLinks = document.querySelectorAll('script[src^="js/"]');
        console.log('Config: Found JS links:', jsLinks.length);
        jsLinks.forEach(script => {
            const oldSrc = script.src;
            script.src = basePath + script.src;
            console.log('Config: Updated JS path from', oldSrc, 'to', script.src);
        });
        
        // Update navigation links
        const navLinks = document.querySelectorAll('a[href^="./"], a[href^="0"], a[href^="index.html"], a[href^="resources.html"], a[href^="about.html"]');
        console.log('Config: Found navigation links:', navLinks.length);
        navLinks.forEach(link => {
            if (link.href.includes('http')) return; // Skip external links
            
            const href = link.getAttribute('href');
            if (href && !href.startsWith('http') && !href.startsWith('#')) {
                const oldHref = link.href;
                link.href = basePath + href;
                console.log('Config: Updated nav path from', oldHref, 'to', link.href);
            }
        });
        
        // Update image sources
        const images = document.querySelectorAll('img[src^="images/"]');
        console.log('Config: Found images:', images.length);
        images.forEach(img => {
            const oldSrc = img.src;
            img.src = basePath + img.src;
            console.log('Config: Updated image path from', oldSrc, 'to', img.src);
        });
    }
    
    // Update paths immediately and when DOM is ready
    updatePaths();
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', updatePaths);
    }
    
    // Export configuration for other scripts
    window.SiteConfig = {
        basePath: basePath,
        isGitHubPages: isGitHubPages
    };
    
})();
