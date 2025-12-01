document.addEventListener('DOMContentLoaded', () => {
    // 1. Funcionalidad del Menú de Hamburguesa (Móvil)
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');

    // Muestra/Oculta el menú principal en móviles
    menuToggle.addEventListener('click', () => {
        mainNav.classList.toggle('active');
        // Cambia el icono de hamburguesa a una 'X'
        const icon = menuToggle.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times'); // fa-times es el icono de cerrar (X)
    });

    // 2. Funcionalidad de los Desplegables (Dropdowns) para hacer clic
    const dropdowns = document.querySelectorAll('.dropdown');

    dropdowns.forEach(dropdown => {
        const dropbtn = dropdown.querySelector('.dropbtn');
        
        dropbtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Cierra otros desplegables si están abiertos
            dropdowns.forEach(otherDropdown => {
                if (otherDropdown !== dropdown) {
                    otherDropdown.classList.remove('active');
                }
            });

            // Abre o cierra el desplegable actual
            dropdown.classList.toggle('active');
        });
    });

    // 3. Cerrar el menú desplegable si se hace clic fuera de él
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.dropdown')) {
            dropdowns.forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        }
    });

    // En modo escritorio, la funcionalidad de hover se maneja solo con CSS,
    // pero mantenemos la funcionalidad de clic para móviles.
});
