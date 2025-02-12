// Show active nav link
document.addEventListener('DOMContentLoaded', function() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');
    const sidebar = document.querySelector('.sidebar');
    const sidebarBackdrop = document.querySelector('.sidebar-backdrop');
    const contentWrapper = document.querySelector('.content-wrapper');
    const sidebarToggle = document.querySelector('#sidebar-toggle');

    // Set active nav links
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });

    // Sidebar toggle functionality
    function toggleSidebar() {
        sidebar.classList.toggle('active');
        sidebarBackdrop.classList.toggle('active');
        contentWrapper.classList.toggle('sidebar-active');
    }

    // Event listeners for sidebar
    sidebarToggle.addEventListener('click', toggleSidebar);
    sidebarBackdrop.addEventListener('click', toggleSidebar);

    // Close sidebar on mobile when clicking a link
    sidebar.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                toggleSidebar();
            }
        });
    });

    // Theme toggling functionality
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = themeToggleBtn.querySelector('i');
    const htmlElement = document.documentElement;

    // Load saved theme from localStorage
    const savedTheme = localStorage.getItem('theme') || 'dark';
    htmlElement.setAttribute('data-bs-theme', savedTheme);
    updateThemeIcon(savedTheme);

    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-bs-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        htmlElement.setAttribute('data-bs-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });

    function updateThemeIcon(theme) {
        themeIcon.className = theme === 'dark' ? 'bi bi-sun-fill' : 'bi bi-moon-fill';
    }

    // Quick Actions Menu functionality
    const quickActionsToggle = document.querySelector('.quick-actions-toggle');
    const quickActionsMenu = document.querySelector('.quick-actions-menu');
    const scrollTopButton = document.querySelector('.quick-action-item[aria-label="Go to top"]');
    const themeActionButton = document.querySelector('.quick-action-item[aria-label="Toggle theme"]');
    const sidebarActionButton = document.querySelector('.quick-action-item[aria-label="Toggle sidebar"]');

    // Toggle quick actions menu
    quickActionsToggle.addEventListener('click', () => {
        quickActionsToggle.classList.toggle('active');
        quickActionsMenu.classList.toggle('active');
    });

    // Scroll to top action
    scrollTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Theme toggle action
    themeActionButton.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-bs-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-bs-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });

    // Sidebar toggle action
    sidebarActionButton.addEventListener('click', () => {
        toggleSidebar();
    });

    // Close menu when clicking outside
    document.addEventListener('click', (event) => {
        const isClickInsideMenu = event.target.closest('.quick-actions');
        if (!isClickInsideMenu && quickActionsMenu.classList.contains('active')) {
            quickActionsToggle.classList.remove('active');
            quickActionsMenu.classList.remove('active');
        }
    });

    // Show/hide scroll to top button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 100) {
            scrollTopButton.style.display = 'flex';
        } else {
            scrollTopButton.style.display = 'none';
        }
    });
});

// Configure global HTMX indicators
htmx.config.globalIndicator = '#global-indicator';

// Add loading class to the body during requests
htmx.on('htmx:beforeRequest', function(evt) {
    // Show loading indicator for the specific target if it exists
    const target = evt.detail.target;
    if (target) {
        target.classList.add('htmx-request');
    }

    // Add loading class to body for global state
    document.body.classList.add('htmx-requesting');
});

htmx.on('htmx:afterRequest', function(evt) {
    // Remove loading indicator from the specific target
    const target = evt.detail.target;
    if (target) {
        target.classList.remove('htmx-request');
    }

    // Remove loading class from body
    document.body.classList.remove('htmx-requesting');
});

// Handle errors gracefully
htmx.on('htmx:responseError', function(evt) {
    const target = evt.detail.target;
    if (target) {
        target.innerHTML = `
            <div class="alert alert-danger" role="alert">
                An error occurred while loading the content. Please try again.
            </div>
        `;
    }
});

// Add progress bar for longer requests
htmx.on('htmx:beforeRequest', function(evt) {
    if (evt.detail.requestConfig.timeout) {
        const progressBar = document.createElement('div');
        progressBar.className = 'progress position-fixed top-0 start-0 w-100';
        progressBar.style.height = '3px';
        progressBar.innerHTML = `
            <div class="progress-bar progress-bar-striped progress-bar-animated" 
                 role="progressbar" 
                 style="width: 0%"></div>
        `;
        document.body.prepend(progressBar);

        let width = 0;
        const interval = setInterval(() => {
            width = Math.min(90, width + 5);
            progressBar.querySelector('.progress-bar').style.width = width + '%';
        }, 500);

        evt.detail.progressBar = progressBar;
        evt.detail.progressInterval = interval;
    }
});

htmx.on('htmx:afterRequest', function(evt) {
    if (evt.detail.progressInterval) {
        clearInterval(evt.detail.progressInterval);
    }
    if (evt.detail.progressBar) {
        evt.detail.progressBar.querySelector('.progress-bar').style.width = '100%';
        setTimeout(() => {
            evt.detail.progressBar.remove();
        }, 200);
    }
});