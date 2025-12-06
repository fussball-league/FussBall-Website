// Reemplaza con tu URL de Apps Script
const SHEETS_API_URL = 'https://script.google.com/macros/s/AKfycbzVnyKKYHPZNaHHMCQ6C-8RnG0W2uh6oNODP17vC8tHmhN5Eb3OqQUecd4Vfi_fnCRx_g/exec';

// ========================================
// FUNCIÓN PRINCIPAL - CARGAR TODOS LOS DATOS
// ========================================
async function cargarTodosLosDatos() {
  try {
    console.log('🔍 Intentando cargar desde:', SHEETS_API_URL);
    
    const response = await fetch(SHEETS_API_URL);
    console.log('📡 Response status:', response.status);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const datos = await response.json();
    console.log('✅ Datos recibidos:', datos);
    
    // Cargar cada sección según la página actual
    if (datos.Equipos) cargarTablaEquipos(datos.Equipos);
    if (datos.Ultimos_Encuentros) cargarUltimosEncuentros(datos.Ultimos_Encuentros);
    if (datos.Torneos) cargarTorneos(datos.Torneos);
    if (datos.Goleadores) cargarGoleadores(datos.Goleadores);
    if (datos.Proximos_Partidos) cargarProximosPartidos(datos.Proximos_Partidos);
    if (datos.Estadisticas_Generales) cargarEstadisticasGenerales(datos.Estadisticas_Generales);
    
    ocultarCargando();
    
  } catch (error) {
    console.error('❌ Error detallado:', error);
    console.error('URL usada:', SHEETS_API_URL);
    mostrarError();
  }
}

// ========================================
// TABLA DE POSICIONES
// ========================================
function cargarTablaEquipos(equipos) {
  const container = document.getElementById('tabla-equipos');
  if (!container) return;
  
  // Ordenar por puntos (mayor a menor)
  equipos.sort((a, b) => b.Puntos - a.Puntos);
  
  let html = `
    <div class="tabla-container">
      <table class="tabla-posiciones">
        <thead>
          <tr>
            <th>#</th>
            <th>Equipo</th>
            <th>Pts</th>
            <th>PJ</th>
            <th>V</th>
            <th>E</th>
            <th>D</th>
            <th>GF</th>
            <th>GC</th>
            <th>DG</th>
            <th>Racha</th>
          </tr>
        </thead>
        <tbody>
  `;
  
  equipos.forEach((equipo, index) => {
    const posicion = index + 1;
    const claseRacha = obtenerClaseRacha(equipo.Racha);
    
    html += `
      <tr class="equipo-fila posicion-${posicion}">
        <td class="posicion"><strong>${posicion}</strong></td>
        <td class="equipo-nombre">${equipo.Nombre}</td>
        <td class="puntos"><strong>${equipo.Puntos}</strong></td>
        <td>${equipo.PJ}</td>
        <td class="victorias">${equipo.V}</td>
        <td class="empates">${equipo.E}</td>
        <td class="derrotas">${equipo.D}</td>
        <td>${equipo.GF}</td>
        <td>${equipo.GC}</td>
        <td class="${equipo.DG >= 0 ? 'positivo' : 'negativo'}">${equipo.DG}</td>
        <td class="racha ${claseRacha}">${formatearRacha(equipo.Racha)}</td>
      </tr>
    `;
  });
  
  html += `
        </tbody>
      </table>
    </div>
  `;
  
  container.innerHTML = html;
}

function obtenerClaseRacha(racha) {
  if (!racha) return '';
  const ultimos3 = racha.slice(-3);
  const victorias = (ultimos3.match(/V/g) || []).length;
  if (victorias >= 2) return 'racha-buena';
  const derrotas = (ultimos3.match(/D/g) || []).length;
  if (derrotas >= 2) return 'racha-mala';
  return 'racha-regular';
}

function formatearRacha(racha) {
  if (!racha) return '-';
  return racha.split('').map(r => {
    if (r === 'V') return '<span class="v">V</span>';
    if (r === 'E') return '<span class="e">E</span>';
    if (r === 'D') return '<span class="d">D</span>';
    return r;
  }).join('');
}

// ========================================
// ÚLTIMOS ENCUENTROS
// ========================================
function cargarUltimosEncuentros(encuentros) {
  const container = document.getElementById('ultimos-encuentros');
  if (!container) return;
  
  // Ordenar por fecha (más reciente primero)
  encuentros.sort((a, b) => new Date(b.Fecha) - new Date(a.Fecha));
  
  let html = '<div class="encuentros-grid">';
  
  encuentros.slice(0, 10).forEach(encuentro => {
    const fecha = new Date(encuentro.Fecha);
    const fechaFormateada = fecha.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
    
    const ganador = encuentro.Goles_Local > encuentro.Goles_Visitante ? 'local' :
                    encuentro.Goles_Local < encuentro.Goles_Visitante ? 'visitante' : 'empate';
    
    html += `
      <div class="encuentro-card">
        <div class="encuentro-header">
          <span class="fecha">${fechaFormateada}</span>
          <span class="torneo">${encuentro.Torneo}</span>
        </div>
        <div class="encuentro-resultado">
          <div class="equipo ${ganador === 'local' ? 'ganador' : ''}">
            <span class="nombre">${encuentro.Equipo_Local}</span>
            <span class="goles">${encuentro.Goles_Local}</span>
          </div>
          <div class="separador">-</div>
          <div class="equipo ${ganador === 'visitante' ? 'ganador' : ''}">
            <span class="goles">${encuentro.Goles_Visitante}</span>
            <span class="nombre">${encuentro.Equipo_Visitante}</span>
          </div>
        </div>
        ${encuentro.Estadio ? `<div class="estadio">📍 ${encuentro.Estadio}</div>` : ''}
      </div>
    `;
  });
  
  html += '</div>';
  
  container.innerHTML = html;
}

// ========================================
// TORNEOS
// ========================================
function cargarTorneos(torneos) {
  const container = document.getElementById('lista-torneos');
  if (!container) return;
  
  let html = '<div class="torneos-lista">';
  
  torneos.forEach(torneo => {
    const estadoClass = torneo.Estado.toLowerCase();
    const iconoEstado = {
      'activo': '🟢',
      'finalizado': '⚪',
      'próximo': '🔵'
    }[estadoClass] || '⚫';
    
    html += `
      <div class="torneo-card estado-${estadoClass}">
        <div class="torneo-header">
          <h3>${torneo.Nombre}</h3>
          <span class="estado">${iconoEstado} ${torneo.Estado}</span>
        </div>
        <div class="torneo-info">
          <div class="info-item">
            <span class="label">Tipo:</span>
            <span class="value">${torneo.Tipo}</span>
          </div>
          <div class="info-item">
            <span class="label">Equipos:</span>
            <span class="value">${torneo.Equipos}</span>
          </div>
          <div class="info-item">
            <span class="label">Temporada:</span>
            <span class="value">${torneo.Temporada}</span>
          </div>
          ${torneo.Campeón_Actual && torneo.Campeón_Actual !== '-' ? `
          <div class="info-item campeon">
            <span class="label">🏆 Campeón:</span>
            <span class="value"><strong>${torneo.Campeón_Actual}</strong></span>
          </div>
          ` : ''}
        </div>
      </div>
    `;
  });
  
  html += '</div>';
  
  container.innerHTML = html;
}

// ========================================
// GOLEADORES
// ========================================
function cargarGoleadores(goleadores) {
  const container = document.getElementById('tabla-goleadores');
  if (!container) return;
  
  // Ordenar por goles (mayor a menor)
  goleadores.sort((a, b) => b.Goles - a.Goles);
  
  let html = `
    <div class="goleadores-lista">
  `;
  
  goleadores.slice(0, 10).forEach((jugador, index) => {
    const posicion = index + 1;
    const medalla = posicion === 1 ? '🥇' : posicion === 2 ? '🥈' : posicion === 3 ? '🥉' : '';
    
    html += `
      <div class="goleador-item">
        <span class="pos">${medalla || posicion}</span>
        <div class="jugador-info">
          <div class="jugador-nombre">${jugador.Jugador}</div>
          <div class="jugador-equipo">${jugador.Equipo}</div>
        </div>
        <div class="estadisticas">
          <div class="stat">
            <span class="label">⚽</span>
            <span class="valor"><strong>${jugador.Goles}</strong></span>
          </div>
          <div class="stat">
            <span class="label">🎯</span>
            <span class="valor">${jugador.Asistencias}</span>
          </div>
          <div class="stat">
            <span class="label">📊</span>
            <span class="valor">${jugador.Promedio.toFixed(2)}</span>
          </div>
        </div>
      </div>
    `;
  });
  
  html += '</div>';
  
  container.innerHTML = html;
}

// ========================================
// PRÓXIMOS PARTIDOS
// ========================================
function cargarProximosPartidos(partidos) {
  const container = document.getElementById('proximos-partidos');
  if (!container) return;
  
  // Ordenar por fecha (más próximo primero)
  partidos.sort((a, b) => new Date(a.Fecha) - new Date(b.Fecha));
  
  let html = '<div class="proximos-grid">';
  
  partidos.forEach(partido => {
    const fecha = new Date(partido.Fecha);
    const fechaFormateada = fecha.toLocaleDateString('es-ES', {
      weekday: 'short',
      day: '2-digit',
      month: 'short'
    });
    
    html += `
      <div class="partido-card">
        <div class="partido-fecha">
          <div class="fecha">${fechaFormateada}</div>
          <div class="hora">${partido.Hora}</div>
        </div>
        <div class="partido-torneo">${partido.Torneo} - ${partido.Jornada}</div>
        <div class="partido-equipos">
          <div class="equipo-local">${partido.Equipo_Local}</div>
          <div class="vs">VS</div>
          <div class="equipo-visitante">${partido.Equipo_Visitante}</div>
        </div>
        <div class="partido-estadio">📍 ${partido.Estadio}</div>
      </div>
    `;
  });
  
  html += '</div>';
  
  container.innerHTML = html;
}

// ========================================
// ESTADÍSTICAS GENERALES
// ========================================
function cargarEstadisticasGenerales(estadisticas) {
  const container = document.getElementById('estadisticas-generales');
  if (!container) return;
  
  // Ordenar por títulos
  estadisticas.sort((a, b) => b.Titulos - a.Titulos);
  
  let html = '<div class="estadisticas-grid">';
  
  estadisticas.forEach(equipo => {
    html += `
      <div class="estadistica-card">
        <h3>${equipo.Equipo}</h3>
        <div class="stats-grid">
          <div class="stat-box">
            <div class="stat-valor">${equipo.Total_Partidos}</div>
            <div class="stat-label">Partidos</div>
          </div>
          <div class="stat-box">
            <div class="stat-valor">${equipo.Total_Victorias}</div>
            <div class="stat-label">Victorias</div>
          </div>
          <div class="stat-box">
            <div class="stat-valor">${equipo.Total_Goles}</div>
            <div class="stat-label">Goles</div>
          </div>
          <div class="stat-box destacado">
            <div class="stat-valor">🏆 ${equipo.Titulos}</div>
            <div class="stat-label">Títulos</div>
          </div>
        </div>
        <div class="records">
          <div class="record">Mayor goleada: <strong>${equipo.Mayor_Goleada}</strong></div>
          <div class="record">Mejor racha: <strong>${equipo.Mejor_Racha}</strong></div>
        </div>
      </div>
    `;
  });
  
  html += '</div>';
  
  container.innerHTML = html;
}

// ========================================
// FUNCIONES DE UTILIDAD
// ========================================
function mostrarCargando() {
  const loaders = document.querySelectorAll('.loader');
  loaders.forEach(loader => loader.style.display = 'block');
}

function ocultarCargando() {
  const loaders = document.querySelectorAll('.loader');
  loaders.forEach(loader => loader.style.display = 'none');
}

function mostrarError() {
  console.error('No se pudieron cargar los datos. Verifica tu conexión o la URL de la API.');
  const containers = [
    'tabla-equipos',
    'ultimos-encuentros',
    'lista-torneos',
    'tabla-goleadores',
    'proximos-partidos',
    'estadisticas-generales'
  ];
  
  containers.forEach(id => {
    const container = document.getElementById(id);
    if (container) {
      container.innerHTML = `
        <div class="error-message">
          <p>❌ Error al cargar los datos</p>
          <button onclick="cargarTodosLosDatos()">Reintentar</button>
        </div>
      `;
    }
  });
}

// ========================================
// INICIALIZACIÓN
// ========================================
document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 Iniciando carga de datos...');
  cargarTodosLosDatos();
});

// Recargar datos cada 5 minutos (opcional)
// setInterval(cargarTodosLosDatos, 300000);
