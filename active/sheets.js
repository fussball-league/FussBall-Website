// Reemplaza con tu URL real
const SHEETS_API_URL = 'https://script.google.com/macros/s/AKfycbxDpj5_rH5yswC7l_Y4VlaqnpDTrWQSY9qvhOQzsXWZw7qrx5D55953pEwN-cW2IOuYlg/exec';

async function cargarTodosLosDatos() {
  try {
    console.log('🚀 Iniciando carga de datos...');
    
    const response = await fetch(SHEETS_API_URL);
    const datos = await response.json();
    
    console.log('✅ Datos recibidos:', datos);
    
    // Cargar equipos si existe el contenedor
    if (datos.Equipos && document.getElementById('tabla-equipos')) {
      cargarTablaEquipos(datos.Equipos);
    }
    
    // Cargar encuentros si existe el contenedor
    if (datos.Ultimos_Encuentros && document.getElementById('ultimos-encuentros')) {
      cargarUltimosEncuentros(datos.Ultimos_Encuentros);
    }
    
    // Cargar torneos si existe el contenedor
    if (datos.Torneos && document.getElementById('lista-torneos')) {
      cargarTorneos(datos.Torneos);
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

function cargarTablaEquipos(equipos) {
  const container = document.getElementById('tabla-equipos');
  if (!container) return;
  
  console.log('📊 Cargando equipos en la página...', equipos);
  
  // Quitar animación de carga
  container.classList.remove('loader');
  
  // Ordenar por puntos
  equipos.sort((a, b) => b.Puntos - a.Puntos);
  
  let html = `
    <h2 class="section-title">Tabla de Posiciones</h2>
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
          </tr>
        </thead>
        <tbody>
  `;
  
  equipos.forEach((equipo, index) => {
    html += `
      <tr class="equipo-fila">
        <td class="posicion"><strong>${index + 1}</strong></td>
        <td class="equipo-nombre">${equipo.Nombre}</td>
        <td class="puntos"><strong>${equipo.Puntos}</strong></td>
        <td>${equipo.PJ}</td>
        <td class="victorias">${equipo.V}</td>
        <td class="empates">${equipo.E}</td>
        <td class="derrotas">${equipo.D}</td>
        <td>${equipo.GF}</td>
        <td>${equipo.GC}</td>
        <td class="${equipo.DG >= 0 ? 'positivo' : 'negativo'}">${equipo.DG}</td>
      </tr>
    `;
  });
  
  html += `
        </tbody>
      </table>
    </div>
  `;
  
  container.innerHTML = html;
  console.log('✅ Equipos cargados exitosamente');
}

function cargarUltimosEncuentros(encuentros) {
  const container = document.getElementById('ultimos-encuentros');
  if (!container) return;
  
  console.log('⚽ Cargando encuentros...', encuentros);
  
  // Quitar animación de carga
  container.classList.remove('loader');
  
  // Ordenar por fecha (más reciente primero)
  encuentros.sort((a, b) => new Date(b.Fecha) - new Date(a.Fecha));
  
  let html = '<div class="encuentros-grid">';
  
  encuentros.slice(0, 10).forEach(encuentro => {
    // Formatear fecha a DD-MM-YYYY
    let fechaFormateada = encuentro.Fecha;
    if (encuentro.Fecha) {
      const fecha = new Date(encuentro.Fecha);
      const dia = String(fecha.getDate()).padStart(2, '0');
      const mes = String(fecha.getMonth() + 1).padStart(2, '0');
      const año = fecha.getFullYear();
      fechaFormateada = `${dia}-${mes}-${año}`;
    }
    
    const ganador = encuentro.Goles_Local > encuentro.Goles_Visitante ? 'local' :
                    encuentro.Goles_Local < encuentro.Goles_Visitante ? 'visitante' : 'empate';
    
    html += `
      <div class="encuentro-card">
        <div class="encuentro-header">
          <span class="fecha">${fechaFormateada}</span>
          <span class="torneo">${encuentro.Torneo || 'Torneo'}</span>
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
        ${encuentro.Estadio && encuentro.Estadio !== 'undefined' ? `<div class="estadio">📍 ${encuentro.Estadio}</div>` : ''}
      </div>
    `;
  });
  
  html += '</div>';
  
  container.innerHTML = html;
  console.log('✅ Encuentros cargados exitosamente');
}

function cargarTorneos(torneos) {
  const container = document.getElementById('lista-torneos');
  if (!container) return;
  
  console.log('🏆 Cargando torneos...', torneos);
  
  // Quitar animación de carga
  container.classList.remove('loader');
  
  let html = '<div class="torneos-lista">';
  
  torneos.forEach(torneo => {
    const estadoClass = torneo.Estado.toLowerCase();
    
    html += `
      <div class="torneo-card estado-${estadoClass}">
        <div class="torneo-header">
          <h3>${torneo.Nombre}</h3>
          <span class="estado">${torneo.Estado}</span>
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
  console.log('✅ Torneos cargados exitosamente');
}

// Iniciar al cargar la página
document.addEventListener('DOMContentLoaded', cargarTodosLosDatos);
