// Hamburger menu toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Close mobile menu when clicking on a link
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Team cards expand/collapse
const expandButtons = document.querySelectorAll('.expand-btn');
expandButtons.forEach(button => {
    button.addEventListener('click', () => {
        const teamCard = button.closest('.team-card');
        const content = teamCard.querySelector('.team-content');
        
        content.classList.toggle('active');
        button.textContent = content.classList.contains('active') ? 'Ver menos' : 'Ver más';
    });
});

// Tournament accordion
const tournamentHeaders = document.querySelectorAll('.tournament-header');
tournamentHeaders.forEach(header => {
    header.addEventListener('click', () => {
        const content = header.nextElementSibling;
        const isActive = content.classList.contains('active');
        
        // Close all other tournaments
        document.querySelectorAll('.tournament-content').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelectorAll('.tournament-header').forEach(item => {
            item.classList.remove('active');
        });
        
        // Toggle current tournament
        if (!isActive) {
            content.classList.add('active');
            header.classList.add('active');
        }
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
