// Reemplaza con tu URL de Apps Script
const SHEETS_API_URL = 'https://script.google.com/macros/s/AKfycbzVnyKKYHPZNaHHMCQ6C-8RnG0W2uh6oNODP17vC8tHmhN5Eb3OqQUecd4Vfi_fnCRx_g/exec';

// Función para obtener todos los datos
async function cargarDatos() {
  try {
    const response = await fetch(SHEETS_API_URL);
    const datos = await response.json();
    
    console.log('Datos cargados:', datos);
    
    // Ahora puedes usar los datos
    mostrarEquipos(datos.Equipos);
    mostrarEncuentros(datos.Ultimos_Encuentros);
    
  } catch (error) {
    console.error('Error al cargar datos:', error);
  }
}

// Función para obtener solo una pestaña específica
async function cargarEquipos() {
  try {
    const response = await fetch(`${SHEETS_API_URL}?sheet=Equipos`);
    const equipos = await response.json();
    
    mostrarEquipos(equipos);
    
  } catch (error) {
    console.error('Error:', error);
  }
}

// Ejemplo: Mostrar equipos en tabla
function mostrarEquipos(equipos) {
  const container = document.getElementById('tabla-equipos');
  
  if (!container) return;
  
  let html = `
    <table>
      <thead>
        <tr>
          <th>Posición</th>
          <th>Equipo</th>
          <th>Puntos</th>
          <th>PJ</th>
          <th>V</th>
          <th>E</th>
          <th>D</th>
        </tr>
      </thead>
      <tbody>
  `;
  
  // Ordenar por puntos
  equipos.sort((a, b) => b.Puntos - a.Puntos);
  
  equipos.forEach((equipo, index) => {
    html += `
      <tr>
        <td>${index + 1}</td>
        <td>${equipo.Nombre}</td>
        <td><strong>${equipo.Puntos}</strong></td>
        <td>${equipo.PJ}</td>
        <td>${equipo.V}</td>
        <td>${equipo.E}</td>
        <td>${equipo.D}</td>
      </tr>
    `;
  });
  
  html += `
      </tbody>
    </table>
  `;
  
  container.innerHTML = html;
}

// Ejemplo: Mostrar últimos encuentros
function mostrarEncuentros(encuentros) {
  const container = document.getElementById('ultimos-encuentros');
  
  if (!container) return;
  
  let html = '<div class="encuentros-list">';
  
  // Mostrar últimos 5 encuentros
  encuentros.slice(0, 5).forEach(encuentro => {
    html += `
      <div class="encuentro-card">
        <div class="fecha">${encuentro.Fecha}</div>
        <div class="resultado">
          <span class="equipo-local">${encuentro.Equipo_Local}</span>
          <span class="marcador">${encuentro.Goles_Local} - ${encuentro.Goles_Visitante}</span>
          <span class="equipo-visitante">${encuentro.Equipo_Visitante}</span>
        </div>
      </div>
    `;
  });
  
  html += '</div>';
  
  container.innerHTML = html;
}

// Cargar datos al iniciar la página
document.addEventListener('DOMContentLoaded', cargarDatos);
