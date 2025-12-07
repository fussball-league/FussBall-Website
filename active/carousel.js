// Variables globales del carrusel
let torneosData = [];
let currentIndex = 0;

// Descripciones por defecto para torneos conocidos
const descripcionesDefault = {
    'Liga Fuss': 'La competición principal de la temporada donde los mejores equipos compiten por el título de campeón de liga.',
    'Fuss Cup': 'Torneo de eliminación directa que reúne a todos los equipos en busca de la copa más prestigiosa.',
    'Copa Bedrock': 'Competición especial que se disputa durante la temporada con formato único y emocionantes premios.',
    'Champions League': 'El torneo más prestigioso a nivel internacional donde compiten los mejores clubes del continente.',
    'Europa League': 'Segunda competición europea que ofrece oportunidades a equipos de toda la región.',
    'Super Cup': 'Enfrentamiento entre los campeones de las dos competiciones europeas más importantes.',
    'Fuss Super Cup': 'Partido inaugural de la temporada entre el campeón de liga y el ganador de la copa nacional.'
};

// Inicializar carrusel cuando se cargan los datos
function inicializarCarrusel(torneos) {
    if (!torneos || torneos.length === 0) {
        console.log('No hay torneos para mostrar');
        return;
    }
    
    torneosData = torneos;
    currentIndex = 0;
    
    // Crear indicadores
    crearIndicadores();
    
    // Mostrar primer torneo
    mostrarTorneo(0);
    
    // Agregar event listeners a botones
    document.getElementById('prevBtn').addEventListener('click', () => navegarCarrusel(-1));
    document.getElementById('nextBtn').addEventListener('click', () => navegarCarrusel(1));
    
    // Soporte para teclado
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') navegarCarrusel(-1);
        if (e.key === 'ArrowRight') navegarCarrusel(1);
    });
    
    console.log('✅ Carrusel inicializado con', torneos.length, 'torneos');
}

// Crear indicadores (puntos)
function crearIndicadores() {
    const container = document.getElementById('carouselIndicators');
    container.innerHTML = '';
    
    torneosData.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.className = 'indicator-dot';
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => mostrarTorneo(index));
        container.appendChild(dot);
    });
}

// Navegar en el carrusel
function navegarCarrusel(direccion) {
    const newIndex = currentIndex + direccion;
    
    if (newIndex < 0) {
        mostrarTorneo(torneosData.length - 1);
    } else if (newIndex >= torneosData.length) {
        mostrarTorneo(0);
    } else {
        mostrarTorneo(newIndex);
    }
}

// Mostrar torneo específico
function mostrarTorneo(index) {
    if (index < 0 || index >= torneosData.length) return;
    
    const torneo = torneosData[index];
    const content = document.querySelector('.carousel-content');
    
    // Animación de transición
    content.classList.add('transitioning');
    
    setTimeout(() => {
        // Actualizar contenido
        document.getElementById('torneoTitulo').textContent = torneo.Nombre;
        
        // Descripción (usar la del sheet o la default)
        const descripcion = torneo.Descripcion || descripcionesDefault[torneo.Nombre] || 'Información del torneo próximamente.';
        document.getElementById('torneoDescripcion').textContent = descripcion;
        
        // Estado
        document.getElementById('torneoEstado').textContent = torneo.Estado || 'Activo';
        
        // Tipo
        document.getElementById('torneoTipo').textContent = torneo.Tipo || 'Liga';
        
        // Equipos
        document.getElementById('torneoEquipos').textContent = torneo.Equipos || '4';
        
        // Campeón
        const campeon = torneo.Campeón_Actual || torneo['Campeón Actual'] || torneo.Campeon_Actual;
        const campeonBadge = document.getElementById('torneoCampeonBadge');
        
        if (campeon && campeon !== '-' && campeon !== '') {
            document.getElementById('torneoCampeon').textContent = campeon;
            campeonBadge.style.display = 'block';
        } else {
            campeonBadge.style.display = 'none';
        }
        
        // Actualizar índice actual
        currentIndex = index;
        
        // Actualizar indicadores
        actualizarIndicadores();
        
        // Quitar animación
        content.classList.remove('transitioning');
    }, 150);
}

// Actualizar indicadores activos
function actualizarIndicadores() {
    const dots = document.querySelectorAll('.indicator-dot');
    dots.forEach((dot, index) => {
        if (index === currentIndex) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

// Modificar la función original de cargar torneos para que también inicialice el carrusel
const cargarTorneosOriginal = window.cargarTorneos;

window.cargarTorneos = function(torneos) {
    // Llamar a la función original si existe
    if (cargarTorneosOriginal) {
        cargarTorneosOriginal(torneos);
    }
    
    // Inicializar carrusel
    inicializarCarrusel(torneos);
};

console.log('📊 Módulo de carrusel cargado');
