// Datos de ejemplo para simular la base de datos
let datosSistema = {
    periodosMatricula: [
        { id: 1, nombre: "Matrícula 2024", inicio: "2024-01-15", fin: "2024-02-15", activo: true }
    ],
    cuposGrados: [
        { grado: "Prejardín", cupo: 25, matriculados: 20 },
        { grado: "Jardín", cupo: 30, matriculados: 28 }
    ],
    gradosDisponibles: [
        { nombre: "Prejardín", estado: "activo" },
        { nombre: "Jardín", estado: "activo" },
        { nombre: "Transición", estado: "activo" },
        { nombre: "Primero", estado: "activo" },
        { nombre: "Segundo", estado: "activo" }
    ],
    valoresPension: [
        { grado: "Prejardín", matricula: 500000, pension: 350000 },
        { grado: "Jardín", matricula: 550000, pension: 380000 }
    ],
    periodicidadPagos: {
        frecuencia: "mensual",
        fechas: [5, 15, 25]
    },
    recargosMora: {
        tipo: "porcentaje",
        valor: 10,
        diasGracia: 3
    },
    estudiantes: [
        { id: 1, nombre: "Ana García", grado: "Prejardín", matricula: true, pagosAlDia: true },
        { id: 2, nombre: "Carlos López", grado: "Jardín", matricula: true, pagosAlDia: false },
        { id: 3, nombre: "María Rodríguez", grado: "Transición", matricula: true, pagosAlDia: true }
    ],
    pagos: [
        { id: 1, estudianteId: 1, mes: "Enero", valor: 350000, pagado: true, fecha: "2024-01-05" },
        { id: 2, estudianteId: 2, mes: "Enero", valor: 380000, pagado: false, fecha: null },
        { id: 3, estudianteId: 3, mes: "Enero", valor: 400000, pagado: true, fecha: "2024-01-10" }
    ]
};

// Inicialización cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    actualizarFecha();
    cargarDatosDashboard();
    cargarSelectGrados();
    cargarPeriodosMatricula();
    cargarCuposGrados();
    cargarGradosDisponibles();
    cargarValoresPension();
    cargarConfiguracionActual();
    
    // Manejar clics en el menú
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', function() {
            const sectionId = this.getAttribute('data-section');
            cambiarSeccion(sectionId);
        });
    });
    
    // Manejar el botón de cerrar sesión
    document.getElementById('logout-btn').addEventListener('click', function() {
        if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
            alert('Sesión cerrada. Redirigiendo al login...');
            // Falta redirigir al login
        }
    });
});

// Función para actualizar la fecha actual
function actualizarFecha() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('current-date').textContent = now.toLocaleDateString('es-ES', options);
}

// Función para cambiar entre secciones
function cambiarSeccion(sectionId) {
    // Remover activo de todas las secciones y items del menú
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Activar sección seleccionada
    document.getElementById(sectionId).classList.add('active');
    document.querySelector(`[data-section="${sectionId}"]`).classList.add('active');
    
    // Actualizar título de la página
    const titulo = document.querySelector(`[data-section="${sectionId}"] .menu-text`).textContent;
    document.getElementById('page-title').textContent = titulo + " - Coordinador";
}

// Función para cargar datos del dashboard
function cargarDatosDashboard() {
    const totalEstudiantes = datosSistema.estudiantes.length;
    const matriculasActivas = datosSistema.estudiantes.filter(e => e.matricula).length;
    const pagosPendientes = datosSistema.pagos.filter(p => !p.pagado).length;
    
    const recaudoMes = datosSistema.pagos
        .filter(p => p.pagado && p.fecha && p.fecha.startsWith('2024-01'))
        .reduce((sum, p) => sum + p.valor, 0);
    
    document.getElementById('total-estudiantes').textContent = totalEstudiantes;
    document.getElementById('matriculas-activas').textContent = matriculasActivas;
    document.getElementById('pagos-pendientes').textContent = pagosPendientes;
    document.getElementById('recaudo-mes').textContent = `$${recaudoMes.toLocaleString()}`;
}

// Función para cargar selectores de grados
function cargarSelectGrados() {
    const selectCupos = document.getElementById('grado-cupos');
    const selectValores = document.getElementById('grado-valores');
    
    // Limpiar opciones existentes
    selectCupos.innerHTML = '<option value="">Seleccionar grado</option>';
    selectValores.innerHTML = '<option value="">Seleccionar grado</option>';
    
    // Agregar grados disponibles
    datosSistema.gradosDisponibles.forEach(grado => {
        if (grado.estado === 'activo') {
            const option = document.createElement('option');
            option.value = grado.nombre;
            option.textContent = grado.nombre;
            
            selectCupos.appendChild(option.cloneNode(true));
            selectValores.appendChild(option);
        }
    });
}

// RFC01: Configurar períodos de matrícula
function agregarPeriodo() {
    const nombre = document.getElementById('periodo-nombre').value;
    const inicio = document.getElementById('fecha-inicio').value;
    const fin = document.getElementById('fecha-fin').value;
    
    if (!nombre || !inicio || !fin) {
        alert('Por favor complete todos los campos');
        return;
    }
    
    if (new Date(fin) <= new Date(inicio)) {
        alert('La fecha de fin debe ser posterior a la fecha de inicio');
        return;
    }
    
    const nuevoPeriodo = {
        id: datosSistema.periodosMatricula.length + 1,
        nombre: nombre,
        inicio: inicio,
        fin: fin,
        activo: true
    };
    
    datosSistema.periodosMatricula.push(nuevoPeriodo);
    cargarPeriodosMatricula();
    
    // Limpiar formulario
    document.getElementById('periodo-nombre').value = '';
    document.getElementById('fecha-inicio').value = '';
    document.getElementById('fecha-fin').value = '';
    
    alert('Período de matrícula agregado exitosamente');
}

function cargarPeriodosMatricula() {
    const lista = document.getElementById('lista-periodos');
    lista.innerHTML = '';
    
    datosSistema.periodosMatricula.forEach(periodo => {
        const item = document.createElement('div');
        item.className = 'item-card';
        item.innerHTML = `
            <div class="item-info">
                <h5>${periodo.nombre}</h5>
                <p>${formatearFecha(periodo.inicio)} - ${formatearFecha(periodo.fin)}</p>
                <span class="estado ${periodo.activo ? 'activo' : 'inactivo'}">${periodo.activo ? 'Activo' : 'Inactivo'}</span>
            </div>
            <div class="item-actions">
                <button class="btn-edit" onclick="editarPeriodo(${periodo.id})">Editar</button>
                <button class="btn-delete" onclick="eliminarPeriodo(${periodo.id})">Eliminar</button>
            </div>
        `;
        lista.appendChild(item);
    });
}

function formatearFecha(fecha) {
    return new Date(fecha).toLocaleDateString('es-ES');
}

function editarPeriodo(id) {
    const periodo = datosSistema.periodosMatricula.find(p => p.id === id);
    if (periodo) {
        document.getElementById('periodo-nombre').value = periodo.nombre;
        document.getElementById('fecha-inicio').value = periodo.inicio;
        document.getElementById('fecha-fin').value = periodo.fin;
        
        // Eliminar el período actual para reemplazarlo
        eliminarPeriodo(id, false);
    }
}

function eliminarPeriodo(id, confirmar = true) {
    if (confirmar && !confirm('¿Está seguro de eliminar este período?')) {
        return;
    }
    
    datosSistema.periodosMatricula = datosSistema.periodosMatricula.filter(p => p.id !== id);
    cargarPeriodosMatricula();
    
    if (confirmar) {
        alert('Período eliminado exitosamente');
    }
}

// RFC02: Configurar cupos por grado
function configurarCupo() {
    const grado = document.getElementById('grado-cupos').value;
    const cupo = parseInt(document.getElementById('cupo-maximo').value);
    
    if (!grado || !cupo) {
        alert('Por favor complete todos los campos');
        return;
    }
    
    const index = datosSistema.cuposGrados.findIndex(c => c.grado === grado);
    
    if (index !== -1) {
        datosSistema.cuposGrados[index].cupo = cupo;
    } else {
        datosSistema.cuposGrados.push({
            grado: grado,
            cupo: cupo,
            matriculados: 0
        });
    }
    
    cargarCuposGrados();
    document.getElementById('cupo-maximo').value = '';
    alert('Cupo configurado exitosamente');
}

function cargarCuposGrados() {
    const lista = document.getElementById('lista-cupos');
    lista.innerHTML = '';
    
    datosSistema.cuposGrados.forEach(cupo => {
        const porcentaje = Math.round((cupo.matriculados / cupo.cupo) * 100);
        const item = document.createElement('div');
        item.className = 'item-card';
        item.innerHTML = `
            <div class="item-info">
                <h5>${cupo.grado}</h5>
                <p>Cupo: ${cupo.cupo} | Matriculados: ${cupo.matriculados}</p>
                <div class="progress-bar">
                    <div class="progress" style="width: ${porcentaje}%"></div>
                </div>
                <span>${porcentaje}% completado</span>
            </div>
            <div class="item-actions">
                <button class="btn-edit" onclick="editarCupo('${cupo.grado}')">Editar</button>
            </div>
        `;
        lista.appendChild(item);
    });
}

function editarCupo(grado) {
    const cupo = datosSistema.cuposGrados.find(c => c.grado === grado);
    if (cupo) {
        document.getElementById('grado-cupos').value = grado;
        document.getElementById('cupo-maximo').value = cupo.cupo;
    }
}

// RFC03: Gestionar grados disponibles
function agregarGrado() {
    const nombre = document.getElementById('nuevo-grado').value;
    const estado = document.getElementById('estado-grado').value;
    
    if (!nombre) {
        alert('Por favor ingrese el nombre del grado');
        return;
    }
    
    if (datosSistema.gradosDisponibles.find(g => g.nombre === nombre)) {
        alert('Este grado ya existe');
        return;
    }
    
    datosSistema.gradosDisponibles.push({
        nombre: nombre,
        estado: estado
    });
    
    cargarGradosDisponibles();
    cargarSelectGrados();
    document.getElementById('nuevo-grado').value = '';
    alert('Grado agregado exitosamente');
}

function cargarGradosDisponibles() {
    const lista = document.getElementById('lista-grados');
    lista.innerHTML = '';
    
    datosSistema.gradosDisponibles.forEach(grado => {
        const item = document.createElement('div');
        item.className = 'item-card';
        item.innerHTML = `
            <div class="item-info">
                <h5>${grado.nombre}</h5>
                <span class="estado ${grado.estado}">${grado.estado === 'activo' ? 'Activo' : 'Inactivo'}</span>
            </div>
            <div class="item-actions">
                <button class="btn-edit" onclick="cambiarEstadoGrado('${grado.nombre}')">${grado.estado === 'activo' ? 'Desactivar' : 'Activar'}</button>
                <button class="btn-delete" onclick="eliminarGrado('${grado.nombre}')">Eliminar</button>
            </div>
        `;
        lista.appendChild(item);
    });
}

function cambiarEstadoGrado(nombre) {
    const grado = datosSistema.gradosDisponibles.find(g => g.nombre === nombre);
    if (grado) {
        grado.estado = grado.estado === 'activo' ? 'inactivo' : 'activo';
        cargarGradosDisponibles();
        cargarSelectGrados();
        alert(`Grado ${grado.estado === 'activo' ? 'activado' : 'desactivado'} exitosamente`);
    }
}

function eliminarGrado(nombre) {
    if (!confirm('¿Está seguro de eliminar este grado? Esta acción no se puede deshacer.')) {
        return;
    }
    
    datosSistema.gradosDisponibles = datosSistema.gradosDisponibles.filter(g => g.nombre !== nombre);
    cargarGradosDisponibles();
    cargarSelectGrados();
    alert('Grado eliminado exitosamente');
}

// RFC04: Definir valores de matrícula y pensión
function configurarValores() {
    const grado = document.getElementById('grado-valores').value;
    const matricula = parseInt(document.getElementById('valor-matricula').value);
    const pension = parseInt(document.getElementById('valor-pension').value);
    
    if (!grado || !matricula || !pension) {
        alert('Por favor complete todos los campos');
        return;
    }
    
    const index = datosSistema.valoresPension.findIndex(v => v.grado === grado);
    
    if (index !== -1) {
        datosSistema.valoresPension[index].matricula = matricula;
        datosSistema.valoresPension[index].pension = pension;
    } else {
        datosSistema.valoresPension.push({
            grado: grado,
            matricula: matricula,
            pension: pension
        });
    }
    
    cargarValoresPension();
    document.getElementById('valor-matricula').value = '';
    document.getElementById('valor-pension').value = '';
    alert('Valores configurados exitosamente');
}

function cargarValoresPension() {
    const lista = document.getElementById('lista-valores');
    lista.innerHTML = '';
    
    datosSistema.valoresPension.forEach(valor => {
        const item = document.createElement('div');
        item.className = 'item-card';
        item.innerHTML = `
            <div class="item-info">
                <h5>${valor.grado}</h5>
                <p>Matrícula: $${valor.matricula.toLocaleString()} | Pensión: $${valor.pension.toLocaleString()}</p>
            </div>
            <div class="item-actions">
                <button class="btn-edit" onclick="editarValores('${valor.grado}')">Editar</button>
                <button class="btn-delete" onclick="eliminarValores('${valor.grado}')">Eliminar</button>
            </div>
        `;
        lista.appendChild(item);
    });
}

function editarValores(grado) {
    const valor = datosSistema.valoresPension.find(v => v.grado === grado);
    if (valor) {
        document.getElementById('grado-valores').value = grado;
        document.getElementById('valor-matricula').value = valor.matricula;
        document.getElementById('valor-pension').value = valor.pension;
    }
}

function eliminarValores(grado) {
    if (!confirm('¿Está seguro de eliminar estos valores?')) {
        return;
    }
    
    datosSistema.valoresPension = datosSistema.valoresPension.filter(v => v.grado !== grado);
    cargarValoresPension();
    alert('Valores eliminados exitosamente');
}

// RFC05: Configurar periodicidad de pagos
function configurarPeriodicidad() {
    const frecuencia = document.getElementById('frecuencia-pagos').value;
    const fechasTexto = document.getElementById('fechas-limite').value;
    
    if (!fechasTexto) {
        alert('Por favor ingrese las fechas límite');
        return;
    }
    
    const fechas = fechasTexto.split(',').map(f => parseInt(f.trim())).filter(f => !isNaN(f));
    
    if (fechas.length === 0) {
        alert('Por favor ingrese fechas válidas');
        return;
    }
    
    datosSistema.periodicidadPagos = {
        frecuencia: frecuencia,
        fechas: fechas
    };
    
    cargarConfiguracionActual();
    document.getElementById('fechas-limite').value = '';
    alert('Periodicidad configurada exitosamente');
}

// RFC06: Configurar recargos por mora
function configurarRecargos() {
    const tipo = document.getElementById('tipo-recargo').value;
    const valor = parseFloat(document.getElementById('valor-recargo').value);
    const diasGracia = parseInt(document.getElementById('dias-gracia').value);
    
    if (!valor || !diasGracia) {
        alert('Por favor complete todos los campos');
        return;
    }
    
    datosSistema.recargosMora = {
        tipo: tipo,
        valor: valor,
        diasGracia: diasGracia
    };
    
    cargarConfiguracionActual();
    document.getElementById('valor-recargo').value = '';
    document.getElementById('dias-gracia').value = '';
    alert('Recargos configurados exitosamente');
}

function cargarConfiguracionActual() {
    // Periodicidad de pagos
    document.getElementById('frecuencia-actual').textContent = 
        datosSistema.periodicidadPagos.frecuencia.charAt(0).toUpperCase() + 
        datosSistema.periodicidadPagos.frecuencia.slice(1);
    
    document.getElementById('fechas-actuales').textContent = 
        datosSistema.periodicidadPagos.fechas.join(', ');
    
    // Recargos por mora
    document.getElementById('tipo-recargo-actual').textContent = 
        datosSistema.recargosMora.tipo === 'porcentaje' ? 'Porcentaje' : 'Valor Fijo';
    
    document.getElementById('valor-recargo-actual').textContent = 
        datosSistema.recargosMora.tipo === 'porcentaje' ? 
        `${datosSistema.recargosMora.valor}%` : 
        `$${datosSistema.recargosMora.valor.toLocaleString()}`;
    
    document.getElementById('dias-gracia-actual').textContent = 
        datosSistema.recargosMora.diasGracia;
}

// RFC07: Generar reportes
function generarReporte(tipo) {
    const resultado = document.getElementById('reporte-resultado');
    const contenido = document.getElementById('reporte-contenido');
    
    resultado.style.display = 'block';
    
    switch(tipo) {
        case 'matriculados':
            contenido.innerHTML = generarReporteMatriculados();
            break;
        case 'recaudo':
            contenido.innerHTML = generarReporteRecaudo();
            break;
        case 'morosidad':
            contenido.innerHTML = generarReporteMorosidad();
            break;
    }
    
    // Scroll al resultado
    resultado.scrollIntoView({ behavior: 'smooth' });
}

function generarReporteMatriculados() {
    let html = '<table class="reporte-table"><thead><tr><th>Grado</th><th>Estudiantes Matriculados</th><th>Cupo</th><th>Disponibilidad</th></tr></thead><tbody>';
    
    datosSistema.cuposGrados.forEach(cupo => {
        const disponibilidad = cupo.cupo - cupo.matriculados;
        html += `<tr>
            <td>${cupo.grado}</td>
            <td>${cupo.matriculados}</td>
            <td>${cupo.cupo}</td>
            <td>${disponibilidad} cupos disponibles</td>
        </tr>`;
    });
    
    html += '</tbody></table>';
    return html;
}

function generarReporteRecaudo() {
    const recaudoTotal = datosSistema.pagos.filter(p => p.pagado).reduce((sum, p) => sum + p.valor, 0);
    const pendienteTotal = datosSistema.pagos.filter(p => !p.pagado).reduce((sum, p) => sum + p.valor, 0);
    
    return `
        <div class="recaudo-resumen">
            <div class="recaudo-item">
                <h5>Recaudo Total</h5>
                <p>$${recaudoTotal.toLocaleString()}</p>
            </div>
            <div class="recaudo-item">
                <h5>Pendiente por Cobrar</h5>
                <p>$${pendienteTotal.toLocaleString()}</p>
            </div>
            <div class="recaudo-item">
                <h5>Porcentaje de Recaudo</h5>
                <p>${Math.round((recaudoTotal / (recaudoTotal + pendienteTotal)) * 100)}%</p>
            </div>
        </div>
        
        <table class="reporte-table">
            <thead>
                <tr>
                    <th>Estudiante</th>
                    <th>Grado</th>
                    <th>Mes</th>
                    <th>Valor</th>
                    <th>Estado</th>
                </tr>
            </thead>
            <tbody>
                ${datosSistema.pagos.map(pago => {
                    const estudiante = datosSistema.estudiantes.find(e => e.id === pago.estudianteId);
                    return `<tr>
                        <td>${estudiante ? estudiante.nombre : 'N/A'}</td>
                        <td>${estudiante ? estudiante.grado : 'N/A'}</td>
                        <td>${pago.mes}</td>
                        <td>$${pago.valor.toLocaleString()}</td>
                        <td class="${pago.pagado ? 'pagado' : 'pendiente'}">${pago.pagado ? 'Pagado' : 'Pendiente'}</td>
                    </tr>`;
                }).join('')}
            </tbody>
        </table>
    `;
}

function generarReporteMorosidad() {
    const estudiantesMorosos = datosSistema.estudiantes.filter(e => 
        datosSistema.pagos.some(p => p.estudianteId === e.id && !p.pagado)
    );
    
    return `
        <div class="morosidad-resumen">
            <div class="morosidad-item">
                <h5>Estudiantes con Morosidad</h5>
                <p>${estudiantesMorosos.length}</p>
            </div>
            <div class="morosidad-item">
                <h5>Total en Mora</h5>
                <p>$${datosSistema.pagos.filter(p => !p.pagado).reduce((sum, p) => sum + p.valor, 0).toLocaleString()}</p>
            </div>
        </div>
        
        <table class="reporte-table">
            <thead>
                <tr>
                    <th>Estudiante</th>
                    <th>Grado</th>
                    <th>Meses en Mora</th>
                    <th>Valor Adeudado</th>
                </tr>
            </thead>
            <tbody>
                ${estudiantesMorosos.map(estudiante => {
                    const pagosPendientes = datosSistema.pagos.filter(p => 
                        p.estudianteId === estudiante.id && !p.pagado
                    );
                    const totalAdeudado = pagosPendientes.reduce((sum, p) => sum + p.valor, 0);
                    
                    return `<tr>
                        <td>${estudiante.nombre}</td>
                        <td>${estudiante.grado}</td>
                        <td>${pagosPendientes.length}</td>
                        <td>$${totalAdeudado.toLocaleString()}</td>
                    </tr>`;
                }).join('')}
            </tbody>
        </table>
    `;
}

function exportarReporte() {
    alert('Función de exportación a PDF simulada. En una aplicación real, se generaría el PDF.');
    // Aquí iría la lógica real para generar PDF
}

// Estilos adicionales para tablas de reportes
const style = document.createElement('style');
style.textContent = `
    .reporte-table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 20px;
    }
    
    .reporte-table th,
    .reporte-table td {
        padding: 12px;
        text-align: left;
        border-bottom: 1px solid #ddd;
    }
    
    .reporte-table th {
        background-color: #f8f9fa;
        font-weight: 600;
    }
    
    .pagado { color: #27ae60; font-weight: 600; }
    .pendiente { color: #e74c3c; font-weight: 600; }
    
    .recaudo-resumen,
    .morosidad-resumen {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 20px;
        margin-bottom: 30px;
    }
    
    .recaudo-item,
    .morosidad-item {
        background: #f8f9fa;
        padding: 20px;
        border-radius: 8px;
        text-align: center;
    }
    
    .recaudo-item h5,
    .morosidad-item h5 {
        margin-bottom: 10px;
        color: #7f8c8d;
    }
    
    .recaudo-item p,
    .morosidad-item p {
        font-size: 1.5rem;
        font-weight: 600;
        color: #2c3e50;
    }
    
    .progress-bar {
        background: #ecf0f1;
        border-radius: 10px;
        height: 8px;
        margin: 5px 0;
        overflow: hidden;
    }
    
    .progress {
        background: linear-gradient(90deg, #3498db, #2980b9);
        height: 100%;
        border-radius: 10px;
        transition: width 0.3s ease;
    }
    
    .estado {
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 0.8rem;
        font-weight: 600;
    }
    
    .estado.activo {
        background: #d5f4e6;
        color: #27ae60;
    }
    
    .estado.inactivo {
        background: #fadbd8;
        color: #e74c3c;
    }
`;
document.head.appendChild(style);