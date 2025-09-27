// Datos de ejemplo para simular la base de datos
let datosSecretaria = {
    estudiantes: [
        {
            id: 1,
            codigo: "EST2024001",
            nombres: "Ana María",
            apellidos: "García López",
            tipoDocumento: "TI",
            numeroDocumento: "123456789",
            fechaNacimiento: "2015-03-15",
            genero: "F",
            direccion: "Calle 123 #45-67",
            telefono: "2345678",
            celular: "3001234567",
            email: "ana.garcia@email.com",
            grado: "Transición",
            jornada: "mañana",
            estado: "activo",
            fechaRegistro: "2024-01-10",
            acudientes: [],
            documentos: [],
            pagos: []
        },
        {
            id: 2,
            codigo: "EST2024002",
            nombres: "Carlos Andrés",
            apellidos: "Rodríguez Pérez",
            tipoDocumento: "TI",
            numeroDocumento: "987654321",
            fechaNacimiento: "2014-08-22",
            genero: "M",
            direccion: "Av. Principal #78-90",
            telefono: "3456789",
            celular: "3109876543",
            email: "carlos.rodriguez@email.com",
            grado: "Primero",
            jornada: "tarde",
            estado: "activo",
            fechaRegistro: "2024-01-12",
            acudientes: [],
            documentos: [],
            pagos: []
        }
    ],
    acudientes: [
        {
            id: 1,
            estudianteId: 1,
            nombres: "María Elena",
            apellidos: "López de García",
            tipoDocumento: "CC",
            numeroDocumento: "1122334455",
            parentesco: "madre",
            telefono: "3001112233",
            email: "maria.lopez@email.com",
            ocupacion: "Ingeniera"
        },
        {
            id: 2,
            estudianteId: 1,
            nombres: "Juan Carlos",
            apellidos: "García Méndez",
            tipoDocumento: "CC",
            numeroDocumento: "5566778899",
            parentesco: "padre",
            telefono: "3004445566",
            email: "juan.garcia@email.com",
            ocupacion: "Arquitecto"
        }
    ],
    documentos: [
        {
            id: 1,
            estudianteId: 1,
            tipo: "identidad",
            nombre: "Tarjeta de Identidad",
            archivo: "ti_ana_garcia.pdf",
            fechaSubida: "2024-01-10",
            observaciones: "Documento escaneado frontal y posterior"
        },
        {
            id: 2,
            estudianteId: 1,
            tipo: "salud",
            nombre: "Carné de Salud",
            archivo: "salud_ana_garcia.jpg",
            fechaSubida: "2024-01-11",
            observaciones: "Vigente hasta diciembre 2024"
        }
    ],
    pagos: [
        {
            id: 1,
            estudianteId: 1,
            concepto: "matricula",
            valor: 500000,
            fechaPago: "2024-01-15",
            metodo: "efectivo",
            estado: "pagado",
            observaciones: "Pago completo de matrícula"
        },
        {
            id: 2,
            estudianteId: 1,
            concepto: "pension",
            valor: 350000,
            fechaPago: "2024-02-05",
            metodo: "transferencia",
            estado: "pagado",
            observaciones: "Pensión mes de febrero"
        },
        {
            id: 3,
            estudianteId: 2,
            concepto: "matricula",
            valor: 500000,
            fechaPago: "2024-01-16",
            metodo: "tarjeta",
            estado: "pagado",
            observaciones: "Pago completo de matrícula"
        }
    ],
    gradosDisponibles: ["Prejardín", "Jardín", "Transición", "Primero", "Segundo", "Tercero", "Cuarto", "Quinto"],
    conceptosPago: ["matricula", "pension", "uniforme", "materiales", "otros"]
};

// Inicialización cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    inicializarSistema();
    
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
            // En una aplicación real, aquí redirigirías al login
        }
    });
    
    // Configurar event listeners para formularios
    configurarEventListeners();
});

function inicializarSistema() {
    actualizarFecha();
    cargarDatosDashboard();
    cargarSelectores();
    cargarListadoEstudiantes();
}

function actualizarFecha() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('current-date').textContent = now.toLocaleDateString('es-ES', options);
}

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
    document.getElementById('page-title').textContent = titulo + " - Secretaría";
    
    // Cargar datos específicos de la sección
    switch(sectionId) {
        case 'listar-estudiantes':
            cargarListadoEstudiantes();
            break;
        case 'historial-pagos':
            cargarSelectEstudiantesPagos();
            break;
    }
}

function configurarEventListeners() {
    // RFST1: Registrar estudiante
    const formRegistro = document.getElementById('form-registro-estudiante');
    if (formRegistro) {
        formRegistro.addEventListener('submit', function(e) {
            e.preventDefault();
            registrarEstudiante();
        });
    }
    
    // RFST4: Registrar acudiente
    const formAcudiente = document.getElementById('form-registro-padre');
    if (formAcudiente) {
        formAcudiente.addEventListener('submit', function(e) {
            e.preventDefault();
            registrarAcudiente();
        });
    }
    
    // Selector de estudiante para acudientes
    const selectEstudiantePadres = document.getElementById('select-estudiante-padres');
    if (selectEstudiantePadres) {
        selectEstudiantePadres.addEventListener('change', function() {
            mostrarFormularioAcudientes(this.value);
        });
    }
    
    // Selector de estudiante para documentos
    const selectEstudianteDocs = document.getElementById('select-estudiante-documentos');
    if (selectEstudianteDocs) {
        selectEstudianteDocs.addEventListener('change', function() {
            mostrarSeccionDocumentos(this.value);
        });
    }
    
    // Búsqueda en tiempo real
    const buscarInput = document.getElementById('buscar-estudiante');
    if (buscarInput) {
        buscarInput.addEventListener('input', function() {
            if (this.value.length >= 3) {
                buscarEstudiante();
            }
        });
    }
}

function cargarDatosDashboard() {
    const totalEstudiantes = datosSecretaria.estudiantes.length;
    const pagosMes = datosSecretaria.pagos.filter(p => {
        const fechaPago = new Date(p.fechaPago);
        const hoy = new Date();
        return fechaPago.getMonth() === hoy.getMonth() && fechaPago.getFullYear() === hoy.getFullYear();
    }).length;
    
    const documentosPendientes = datosSecretaria.estudiantes.filter(e => 
        datosSecretaria.documentos.filter(d => d.estudianteId === e.id).length < 3
    ).length;
    
    const nuevosRegistros = datosSecretaria.estudiantes.filter(e => {
        const fechaReg = new Date(e.fechaRegistro);
        const hoy = new Date();
        return fechaReg.getMonth() === hoy.getMonth() && fechaReg.getFullYear() === hoy.getFullYear();
    }).length;
    
    document.getElementById('total-estudiantes').textContent = totalEstudiantes;
    document.getElementById('pagos-mes').textContent = pagosMes;
    document.getElementById('documentos-pendientes').textContent = documentosPendientes;
    document.getElementById('nuevos-registros').textContent = nuevosRegistros;
}

function cargarSelectores() {
    // Cargar grados en todos los selectores necesarios
    const selectoresGrado = [
        'estudiante-grado',
        'filtro-grado',
        'filtro-listado-grado',
        'pago-estudiante',
        'historial-estudiante',
        'select-estudiante-padres',
        'select-estudiante-documentos'
    ];
    
    selectoresGrado.forEach(selectorId => {
        const selector = document.getElementById(selectorId);
        if (selector) {
            // Limpiar opciones existentes excepto la primera
            while (selector.options.length > 1) {
                selector.remove(1);
            }
            
            // Agregar grados disponibles
            datosSecretaria.gradosDisponibles.forEach(grado => {
                const option = document.createElement('option');
                option.value = grado;
                option.textContent = grado;
                selector.appendChild(option);
            });
        }
    });
    
    // Cargar estudiantes en selectores específicos
    cargarSelectEstudiantes();
}

function cargarSelectEstudiantes() {
    const selectoresEstudiante = [
        'pago-estudiante',
        'historial-estudiante',
        'select-estudiante-padres',
        'select-estudiante-documentos'
    ];
    
    selectoresEstudiante.forEach(selectorId => {
        const selector = document.getElementById(selectorId);
        if (selector) {
            // Limpiar opciones existentes excepto la primera
            while (selector.options.length > 1) {
                selector.remove(1);
            }
            
            // Agregar estudiantes activos
            datosSecretaria.estudiantes.filter(e => e.estado === 'activo').forEach(estudiante => {
                const option = document.createElement('option');
                option.value = estudiante.id;
                option.textContent = `${estudiante.nombres} ${estudiante.apellidos} - ${estudiante.grado}`;
                selector.appendChild(option);
            });
        }
    });
}

// RFST1: Registrar datos de estudiante
function registrarEstudiante() {
    const formData = new FormData(document.getElementById('form-registro-estudiante'));
    
    // Validar campos requeridos
    const camposRequeridos = ['estudiante-nombres', 'estudiante-apellidos', 'estudiante-tipo-doc', 
                             'estudiante-numero-doc', 'estudiante-fecha-nac', 'estudiante-direccion',
                             'estudiante-celular', 'estudiante-grado', 'estudiante-jornada'];
    
    for (let campo of camposRequeridos) {
        if (!document.getElementById(campo).value) {
            alert(`El campo ${campo.replace('estudiante-', '').replace('-', ' ')} es requerido`);
            return;
        }
    }
    
    // Verificar si el estudiante ya existe
    const numeroDoc = document.getElementById('estudiante-numero-doc').value;
    if (datosSecretaria.estudiantes.find(e => e.numeroDocumento === numeroDoc)) {
        alert('Ya existe un estudiante con este número de documento');
        return;
    }
    
    // Crear nuevo estudiante
    const nuevoEstudiante = {
        id: datosSecretaria.estudiantes.length + 1,
        codigo: `EST${new Date().getFullYear()}${(datosSecretaria.estudiantes.length + 1).toString().padStart(3, '0')}`,
        nombres: document.getElementById('estudiante-nombres').value,
        apellidos: document.getElementById('estudiante-apellidos').value,
        tipoDocumento: document.getElementById('estudiante-tipo-doc').value,
        numeroDocumento: numeroDoc,
        fechaNacimiento: document.getElementById('estudiante-fecha-nac').value,
        genero: document.getElementById('estudiante-genero').value,
        direccion: document.getElementById('estudiante-direccion').value,
        telefono: document.getElementById('estudiante-telefono').value,
        celular: document.getElementById('estudiante-celular').value,
        email: document.getElementById('estudiante-email').value,
        grado: document.getElementById('estudiante-grado').value,
        jornada: document.getElementById('estudiante-jornada').value,
        estado: 'activo',
        fechaRegistro: new Date().toISOString().split('T')[0],
        acudientes: [],
        documentos: [],
        pagos: []
    };
    
    datosSecretaria.estudiantes.push(nuevoEstudiante);
    
    // Mostrar confirmación
    mostrarAlerta(`Estudiante ${nuevoEstudiante.nombres} ${nuevoEstudiante.apellidos} registrado exitosamente con código ${nuevoEstudiante.codigo}`, 'success');
    
    // Limpiar formulario
    limpiarFormularioEstudiante();
    
    // Actualizar datos del sistema
    cargarDatosDashboard();
    cargarSelectEstudiantes();
    cargarListadoEstudiantes();
}

function limpiarFormularioEstudiante() {
    document.getElementById('form-registro-estudiante').reset();
}

// RFST2: Consultar datos de estudiante
function buscarEstudiante() {
    const termino = document.getElementById('buscar-estudiante').value.toLowerCase();
    const filtroGrado = document.getElementById('filtro-grado').value;
    const filtroEstado = document.getElementById('filtro-estado').value;
    
    let resultados = datosSecretaria.estudiantes.filter(estudiante => {
        const coincideNombre = `${estudiante.nombres} ${estudiante.apellidos}`.toLowerCase().includes(termino);
        const coincideDocumento = estudiante.numeroDocumento.includes(termino);
        const coincideCodigo = estudiante.codigo.toLowerCase().includes(termino);
        
        const coincideGrado = !filtroGrado || estudiante.grado === filtroGrado;
        const coincideEstado = !filtroEstado || estudiante.estado === filtroEstado;
        
        return (coincideNombre || coincideDocumento || coincideCodigo) && coincideGrado && coincideEstado;
    });
    
    mostrarResultadosBusqueda(resultados);
}

function mostrarResultadosBusqueda(resultados) {
    const contenedor = document.getElementById('resultado-busqueda');
    const detalle = document.getElementById('detalle-estudiante');
    
    if (resultados.length === 0) {
        contenedor.innerHTML = '<p class="alert alert-info">No se encontraron estudiantes que coincidan con la búsqueda.</p>';
        detalle.style.display = 'none';
        return;
    }
    
    let html = '<div class="search-results-list">';
    
    resultados.forEach(estudiante => {
        const acudientes = datosSecretaria.acudientes.filter(a => a.estudianteId === estudiante.id);
        const documentos = datosSecretaria.documentos.filter(d => d.estudianteId === estudiante.id);
        
        html += `
            <div class="student-result-item" onclick="mostrarDetalleEstudiante(${estudiante.id})">
                <div class="student-basic-info">
                    <h5>${estudiante.nombres} ${estudiante.apellidos}</h5>
                    <p><strong>Código:</strong> ${estudiante.codigo} | <strong>Grado:</strong> ${estudiante.grado} | <strong>Documento:</strong> ${estudiante.numeroDocumento}</p>
                    <p><strong>Acudientes:</strong> ${acudientes.length} | <strong>Documentos:</strong> ${documentos.length}</p>
                </div>
                <span class="estado ${estudiante.estado}">${estudiante.estado === 'activo' ? 'Activo' : 'Inactivo'}</span>
            </div>
        `;
    });
    
    html += '</div>';
    contenedor.innerHTML = html;
    detalle.style.display = 'none';
}

function mostrarDetalleEstudiante(estudianteId) {
    const estudiante = datosSecretaria.estudiantes.find(e => e.id === estudianteId);
    if (!estudiante) return;
    
    const acudientes = datosSecretaria.acudientes.filter(a => a.estudianteId === estudianteId);
    const documentos = datosSecretaria.documentos.filter(d => d.estudianteId === estudianteId);
    const pagos = datosSecretaria.pagos.filter(p => p.estudianteId === estudianteId);
    
    const contenedor = document.getElementById('detalle-estudiante');
    const detalleContent = contenedor.querySelector('.detail-content');
    
    let html = `
        <div class="student-detail-grid">
            <div class="detail-section">
                <h5>Información Personal</h5>
                <div class="detail-info">
                    <p><strong>Nombres completos:</strong> ${estudiante.nombres} ${estudiante.apellidos}</p>
                    <p><strong>Documento:</strong> ${estudiante.tipoDocumento} ${estudiante.numeroDocumento}</p>
                    <p><strong>Fecha nacimiento:</strong> ${formatearFecha(estudiante.fechaNacimiento)}</p>
                    <p><strong>Género:</strong> ${estudiante.genero === 'M' ? 'Masculino' : estudiante.genero === 'F' ? 'Femenino' : 'Otro'}</p>
                </div>
            </div>
            
            <div class="detail-section">
                <h5>Información Académica</h5>
                <div class="detail-info">
                    <p><strong>Código:</strong> ${estudiante.codigo}</p>
                    <p><strong>Grado:</strong> ${estudiante.grado}</p>
                    <p><strong>Jornada:</strong> ${estudiante.jornada}</p>
                    <p><strong>Estado:</strong> <span class="estado ${estudiante.estado}">${estudiante.estado === 'activo' ? 'Activo' : 'Inactivo'}</span></p>
                </div>
            </div>
            
            <div class="detail-section">
                <h5>Información de Contacto</h5>
                <div class="detail-info">
                    <p><strong>Dirección:</strong> ${estudiante.direccion}</p>
                    <p><strong>Teléfono:</strong> ${estudiante.telefono || 'No registrado'}</p>
                    <p><strong>Celular:</strong> ${estudiante.celular}</p>
                    <p><strong>Email:</strong> ${estudiante.email || 'No registrado'}</p>
                </div>
            </div>
        </div>
        
        <div class="detail-tabs">
            <button class="tab-btn active" onclick="cambiarTab('acudientes', ${estudianteId})">Acudientes (${acudientes.length})</button>
            <button class="tab-btn" onclick="cambiarTab('documentos', ${estudianteId})">Documentos (${documentos.length})</button>
            <button class="tab-btn" onclick="cambiarTab('pagos', ${estudianteId})">Pagos (${pagos.length})</button>
        </div>
        
        <div id="tab-content" class="tab-content">
            <!-- Contenido de las pestañas se cargará aquí -->
        </div>
    `;
    
    detalleContent.innerHTML = html;
    contenedor.style.display = 'block';
    cambiarTab('acudientes', estudianteId);
    
    // Scroll al detalle
    contenedor.scrollIntoView({ behavior: 'smooth' });
}

function cambiarTab(tabName, estudianteId) {
    const tabContent = document.getElementById('tab-content');
    const tabBtns = document.querySelectorAll('.tab-btn');
    
    // Remover activo de todos los botones
    tabBtns.forEach(btn => btn.classList.remove('active'));
    // Activar botón clickeado
    event.target.classList.add('active');
    
    let contenido = '';
    
    switch(tabName) {
        case 'acudientes':
            contenido = generarContenidoAcudientes(estudianteId);
            break;
        case 'documentos':
            contenido = generarContenidoDocumentos(estudianteId);
            break;
        case 'pagos':
            contenido = generarContenidoPagos(estudianteId);
            break;
    }
    
    tabContent.innerHTML = contenido;
}

function generarContenidoAcudientes(estudianteId) {
    const acudientes = datosSecretaria.acudientes.filter(a => a.estudianteId === estudianteId);
    
    if (acudientes.length === 0) {
        return '<p class="alert alert-info">No hay acudientes registrados para este estudiante.</p>';
    }
    
    let html = '<div class="acudientes-list">';
    acudientes.forEach(acudiente => {
        html += `
            <div class="acudiente-item">
                <div class="acudiente-info">
                    <h6>${acudiente.nombres} ${acudiente.apellidos}</h6>
                    <p><strong>Parentesco:</strong> ${acudiente.parentesco} | <strong>Documento:</strong> ${acudiente.tipoDocumento} ${acudiente.numeroDocumento}</p>
                    <p><strong>Teléfono:</strong> ${acudiente.telefono} | <strong>Email:</strong> ${acudiente.email || 'No registrado'}</p>
                    <p><strong>Ocupación:</strong> ${acudiente.ocupacion || 'No especificada'}</p>
                </div>
            </div>
        `;
    });
    html += '</div>';
    return html;
}

function generarContenidoDocumentos(estudianteId) {
    const documentos = datosSecretaria.documentos.filter(d => d.estudianteId === estudianteId);
    
    if (documentos.length === 0) {
        return '<p class="alert alert-info">No hay documentos registrados para este estudiante.</p>';
    }
    
    let html = '<div class="documentos-list">';
    documentos.forEach(documento => {
        html += `
            <div class="documento-item">
                <div class="documento-info">
                    <h6>${documento.nombre}</h6>
                    <p><strong>Tipo:</strong> ${documento.tipo} | <strong>Subido:</strong> ${formatearFecha(documento.fechaSubida)}</p>
                    <p><strong>Observaciones:</strong> ${documento.observaciones}</p>
                    <p><strong>Archivo:</strong> ${documento.archivo}</p>
                </div>
                <button class="btn btn-view" onclick="descargarDocumento(${documento.id})">Descargar</button>
            </div>
        `;
    });
    html += '</div>';
    return html;
}

function generarContenidoPagos(estudianteId) {
    const pagos = datosSecretaria.pagos.filter(p => p.estudianteId === estudianteId);
    
    if (pagos.length === 0) {
        return '<p class="alert alert-info">No hay pagos registrados para este estudiante.</p>';
    }
    
    const totalPagado = pagos.filter(p => p.estado === 'pagado').reduce((sum, p) => sum + p.valor, 0);
    
    let html = `
        <div class="pagos-resumen">
            <div class="resumen-item">
                <strong>Total pagado:</strong> $${totalPagado.toLocaleString()}
            </div>
        </div>
        <div class="pagos-list">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Concepto</th>
                        <th>Valor</th>
                        <th>Fecha</th>
                        <th>Método</th>
                        <th>Estado</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    pagos.forEach(pago => {
        html += `
            <tr>
                <td>${pago.concepto.charAt(0).toUpperCase() + pago.concepto.slice(1)}</td>
                <td>$${pago.valor.toLocaleString()}</td>
                <td>${formatearFecha(pago.fechaPago)}</td>
                <td>${pago.metodo}</td>
                <td><span class="estado ${pago.estado}">${pago.estado}</span></td>
            </tr>
        `;
    });
    
    html += '</tbody></table></div>';
    return html;
}

// RFST3: Actualizar datos de estudiante
function buscarParaActualizar() {
    const termino = document.getElementById('buscar-actualizar').value.toLowerCase();
    const resultados = datosSecretaria.estudiantes.filter(estudiante => 
        `${estudiante.nombres} ${estudiante.apellidos}`.toLowerCase().includes(termino) ||
        estudiante.numeroDocumento.includes(termino) ||
        estudiante.codigo.toLowerCase().includes(termino)
    );
    
    if (resultados.length === 0) {
        alert('No se encontró ningún estudiante con ese criterio de búsqueda');
        return;
    }
    
    if (resultados.length === 1) {
        mostrarFormularioActualizacion(resultados[0].id);
    } else {
        mostrarListaActualizacion(resultados);
    }
}

function mostrarFormularioActualizacion(estudianteId) {
    const estudiante = datosSecretaria.estudiantes.find(e => e.id === estudianteId);
    if (!estudiante) return;
    
    const formContainer = document.getElementById('form-actualizar-estudiante');
    
    let html = `
        <h4>Actualizar datos de: ${estudiante.nombres} ${estudiante.apellidos}</h4>
        <form id="form-actualizar" class="two-column-form">
            <div class="form-column">
                <div class="form-group">
                    <label for="actualizar-nombres">Nombres</label>
                    <input type="text" id="actualizar-nombres" value="${estudiante.nombres}" required>
                </div>
                <div class="form-group">
                    <label for="actualizar-apellidos">Apellidos</label>
                    <input type="text" id="actualizar-apellidos" value="${estudiante.apellidos}" required>
                </div>
                <div class="form-group">
                    <label for="actualizar-direccion">Dirección</label>
                    <input type="text" id="actualizar-direccion" value="${estudiante.direccion}" required>
                </div>
            </div>
            <div class="form-column">
                <div class="form-group">
                    <label for="actualizar-telefono">Teléfono</label>
                    <input type="tel" id="actualizar-telefono" value="${estudiante.telefono || ''}">
                </div>
                <div class="form-group">
                    <label for="actualizar-celular">Celular</label>
                    <input type="tel" id="actualizar-celular" value="${estudiante.celular}" required>
                </div>
                <div class="form-group">
                    <label for="actualizar-email">Email</label>
                    <input type="email" id="actualizar-email" value="${estudiante.email || ''}">
                </div>
            </div>
            <div class="form-full-width">
                <button type="submit" class="btn btn-primary">Actualizar Datos</button>
                <button type="button" class="btn btn-secondary" onclick="cancelarActualizacion()">Cancelar</button>
            </div>
        </form>
    `;
    
    formContainer.innerHTML = html;
    formContainer.style.display = 'block';
    
    // Configurar evento del formulario
    document.getElementById('form-actualizar').addEventListener('submit', function(e) {
        e.preventDefault();
        actualizarEstudiante(estudianteId);
    });
}

function actualizarEstudiante(estudianteId) {
    const estudiante = datosSecretaria.estudiantes.find(e => e.id === estudianteId);
    if (!estudiante) return;
    
    // Actualizar datos
    estudiante.nombres = document.getElementById('actualizar-nombres').value;
    estudiante.apellidos = document.getElementById('actualizar-apellidos').value;
    estudiante.direccion = document.getElementById('actualizar-direccion').value;
    estudiante.telefono = document.getElementById('actualizar-telefono').value;
    estudiante.celular = document.getElementById('actualizar-celular').value;
    estudiante.email = document.getElementById('actualizar-email').value;
    
    mostrarAlerta('Datos del estudiante actualizados exitosamente', 'success');
    document.getElementById('form-actualizar-estudiante').style.display = 'none';
    document.getElementById('buscar-actualizar').value = '';
}

// RFST4: Registrar datos de padres
function mostrarFormularioAcudientes(estudianteId) {
    const formContainer = document.getElementById('form-parents');
    if (!estudianteId) {
        formContainer.style.display = 'none';
        return;
    }
    
    const estudiante = datosSecretaria.estudiantes.find(e => e.id == estudianteId);
    if (estudiante) {
        formContainer.style.display = 'block';
        cargarListaAcudientes(estudianteId);
    }
}

function registrarAcudiente() {
    const estudianteId = document.getElementById('select-estudiante-padres').value;
    if (!estudianteId) {
        alert('Por favor seleccione un estudiante');
        return;
    }
    
    const camposRequeridos = ['parent-nombres', 'parent-apellidos', 'parent-tipo-doc', 'parent-numero-doc', 'parent-parentesco', 'parent-telefono'];
    
    for (let campo of camposRequeridos) {
        if (!document.getElementById(campo).value) {
            alert('Por favor complete todos los campos requeridos');
            return;
        }
    }
    
    const nuevoAcudiente = {
        id: datosSecretaria.acudientes.length + 1,
        estudianteId: parseInt(estudianteId),
        nombres: document.getElementById('parent-nombres').value,
        apellidos: document.getElementById('parent-apellidos').value,
        tipoDocumento: document.getElementById('parent-tipo-doc').value,
        numeroDocumento: document.getElementById('parent-numero-doc').value,
        parentesco: document.getElementById('parent-parentesco').value,
        telefono: document.getElementById('parent-telefono').value,
        email: document.getElementById('parent-email').value,
        ocupacion: document.getElementById('parent-ocupacion').value
    };
    
    datosSecretaria.acudientes.push(nuevoAcudiente);
    
    mostrarAlerta('Acudiente registrado exitosamente', 'success');
    document.getElementById('form-registro-padre').reset();
    cargarListaAcudientes(estudianteId);
}

function cargarListaAcudientes(estudianteId) {
    const acudientes = datosSecretaria.acudientes.filter(a => a.estudianteId == estudianteId);
    const lista = document.getElementById('lista-acudientes');
    
    if (acudientes.length === 0) {
        lista.innerHTML = '<p class="alert alert-info">No hay acudientes registrados para este estudiante.</p>';
        return;
    }
    
    let html = '<h4>Acudientes Registrados</h4>';
    acudientes.forEach(acudiente => {
        html += `
            <div class="parent-item">
                <div class="parent-info">
                    <h5>${acudiente.nombres} ${acudiente.apellidos}</h5>
                    <p><strong>Parentesco:</strong> ${acudiente.parentesco} | <strong>Documento:</strong> ${acudiente.tipoDocumento} ${acudiente.numeroDocumento}</p>
                    <p><strong>Contacto:</strong> ${acudiente.telefono} ${acudiente.email ? '| ' + acudiente.email : ''}</p>
                </div>
                <div class="item-actions">
                    <button class="btn-edit" onclick="editarAcudiente(${acudiente.id})">Editar</button>
                    <button class="btn-delete" onclick="eliminarAcudiente(${acudiente.id})">Eliminar</button>
                </div>
            </div>
        `;
    });
    
    lista.innerHTML = html;
}

// RFST5: Subir documentos complementarios
function mostrarSeccionDocumentos(estudianteId) {
    const uploadSection = document.getElementById('upload-section');
    if (!estudianteId) {
        uploadSection.style.display = 'none';
        return;
    }
    
    uploadSection.style.display = 'block';
    cargarListaDocumentos(estudianteId);
}

function subirDocumento() {
    const estudianteId = document.getElementById('select-estudiante-documentos').value;
    const tipoDocumento = document.getElementById('tipo-documento').value;
    const archivoInput = document.getElementById('documento-file');
    const observaciones = document.getElementById('documento-observaciones').value;
    
    if (!estudianteId || !tipoDocumento || !archivoInput.files[0]) {
        alert('Por favor complete todos los campos requeridos');
        return;
    }
    
    const archivo = archivoInput.files[0];
    const nombreArchivo = `doc_${estudianteId}_${Date.now()}_${archivo.name}`;
    
    const nuevoDocumento = {
        id: datosSecretaria.documentos.length + 1,
        estudianteId: parseInt(estudianteId),
        tipo: tipoDocumento,
        nombre: obtenerNombreDocumento(tipoDocumento),
        archivo: nombreArchivo,
        fechaSubida: new Date().toISOString().split('T')[0],
        observaciones: observaciones
    };
    
    datosSecretaria.documentos.push(nuevoDocumento);
    
    // Simular subida de archivo
    setTimeout(() => {
        mostrarAlerta('Documento subido exitosamente', 'success');
        archivoInput.value = '';
        document.getElementById('documento-observaciones').value = '';
        cargarListaDocumentos(estudianteId);
    }, 1000);
}

function obtenerNombreDocumento(tipo) {
    const nombres = {
        'identidad': 'Documento de Identidad',
        'nacimiento': 'Registro de Nacimiento',
        'salud': 'Carné de Salud',
        'foto': 'Foto',
        'vacunas': 'Carné de Vacunas',
        'otros': 'Otros Documentos'
    };
    return nombres[tipo] || 'Documento';
}

function cargarListaDocumentos(estudianteId) {
    const documentos = datosSecretaria.documentos.filter(d => d.estudianteId == estudianteId);
    const lista = document.getElementById('lista-documentos');
    
    if (documentos.length === 0) {
        lista.innerHTML = '<p class="alert alert-info">No hay documentos subidos para este estudiante.</p>';
        return;
    }
    
    let html = '<h4>Documentos Subidos</h4>';
    documentos.forEach(documento => {
        html += `
            <div class="document-item">
                <div class="document-info">
                    <h5>${documento.nombre}</h5>
                    <p><strong>Tipo:</strong> ${documento.tipo} | <strong>Subido:</strong> ${formatearFecha(documento.fechaSubida)}</p>
                    <p><strong>Archivo:</strong> ${documento.archivo}</p>
                    ${documento.observaciones ? `<p><strong>Observaciones:</strong> ${documento.observaciones}</p>` : ''}
                </div>
                <div class="item-actions">
                    <button class="btn-view" onclick="descargarDocumento(${documento.id})">Descargar</button>
                    <button class="btn-delete" onclick="eliminarDocumento(${documento.id})">Eliminar</button>
                </div>
            </div>
        `;
    });
    
    lista.innerHTML = html;
}

// RFST6: Listar estudiantes
function cargarListadoEstudiantes() {
    const filtroGrado = document.getElementById('filtro-listado-grado').value;
    const filtroJornada = document.getElementById('filtro-listado-jornada').value;
    const filtroEstado = document.getElementById('filtro-listado-estado').value;
    
    let estudiantesFiltrados = datosSecretaria.estudiantes.filter(estudiante => {
        const coincideGrado = !filtroGrado || estudiante.grado === filtroGrado;
        const coincideJornada = !filtroJornada || estudiante.jornada === filtroJornada;
        const coincideEstado = !filtroEstado || estudiante.estado === filtroEstado;
        
        return coincideGrado && coincideJornada && coincideEstado;
    });
    
    mostrarTablaEstudiantes(estudiantesFiltrados);
}

function mostrarTablaEstudiantes(estudiantes) {
    const tabla = document.getElementById('tabla-estudiantes');
    
    if (estudiantes.length === 0) {
        tabla.innerHTML = '<p class="alert alert-info">No hay estudiantes que coincidan con los filtros seleccionados.</p>';
        return;
    }
    
    let html = `
        <table class="data-table">
            <thead>
                <tr>
                    <th>Código</th>
                    <th>Nombre Completo</th>
                    <th>Documento</th>
                    <th>Grado</th>
                    <th>Jornada</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    estudiantes.forEach(estudiante => {
        const acudientes = datosSecretaria.acudientes.filter(a => a.estudianteId === estudiante.id).length;
        const documentos = datosSecretaria.documentos.filter(d => d.estudianteId === estudiante.id).length;
        
        html += `
            <tr>
                <td>${estudiante.codigo}</td>
                <td>${estudiante.nombres} ${estudiante.apellidos}</td>
                <td>${estudiante.tipoDocumento} ${estudiante.numeroDocumento}</td>
                <td>${estudiante.grado}</td>
                <td>${estudiante.jornada}</td>
                <td><span class="estado ${estudiante.estado}">${estudiante.estado === 'activo' ? 'Activo' : 'Inactivo'}</span></td>
                <td>
                    <button class="btn-view" onclick="verDetalleEstudiante(${estudiante.id})">Ver</button>
                    <button class="btn-edit" onclick="editarEstudiante(${estudiante.id})">Editar</button>
                </td>
            </tr>
        `;
    });
    
    html += '</tbody></table>';
    tabla.innerHTML = html;
}

// RFST7: Registrar pagos realizados
function registrarPago() {
    const estudianteId = document.getElementById('pago-estudiante').value;
    const concepto = document.getElementById('pago-concepto').value;
    const valor = parseFloat(document.getElementById('pago-valor').value);
    const fechaPago = document.getElementById('pago-fecha').value;
    const metodo = document.getElementById('pago-metodo').value;
    const observaciones = document.getElementById('pago-observaciones').value;
    
    if (!estudianteId || !concepto || !valor || !fechaPago || !metodo) {
        alert('Por favor complete todos los campos requeridos');
        return;
    }
    
    const nuevoPago = {
        id: datosSecretaria.pagos.length + 1,
        estudianteId: parseInt(estudianteId),
        concepto: concepto,
        valor: valor,
        fechaPago: fechaPago,
        metodo: metodo,
        estado: 'pagado',
        observaciones: observaciones
    };
    
    datosSecretaria.pagos.push(nuevoPago);
    
    mostrarAlerta('Pago registrado exitosamente', 'success');
    
    // Limpiar formulario
    document.getElementById('pago-valor').value = '';
    document.getElementById('pago-observaciones').value = '';
    document.getElementById('pago-fecha').value = new Date().toISOString().split('T')[0];
    
    // Actualizar lista de pagos recientes
    cargarPagosRecientes();
}

function cargarPagosRecientes() {
    const pagosRecientes = datosSecretaria.pagos
        .sort((a, b) => new Date(b.fechaPago) - new Date(a.fechaPago))
        .slice(0, 5);
    
    const contenedor = document.getElementById('pagos-recientes');
    let html = '<h4>Pagos Recientes</h4>';
    
    if (pagosRecientes.length === 0) {
        html += '<p class="alert alert-info">No hay pagos recientes.</p>';
    } else {
        pagosRecientes.forEach(pago => {
            const estudiante = datosSecretaria.estudiantes.find(e => e.id === pago.estudianteId);
            html += `
                <div class="payment-item">
                    <div class="payment-info">
                        <strong>${estudiante ? estudiante.nombres : 'N/A'}</strong>
                        <span>${pago.concepto} - $${pago.valor.toLocaleString()}</span>
                    </div>
                    <small>${formatearFecha(pago.fechaPago)}</small>
                </div>
            `;
        });
    }
    
    contenedor.innerHTML = html;
}

// RFST8: Consultar historial de pago por estudiante
function cargarSelectEstudiantesPagos() {
    const selector = document.getElementById('historial-estudiante');
    if (!selector) return;
    
    // Limpiar opciones existentes excepto la primera
    while (selector.options.length > 1) {
        selector.remove(1);
    }
    
    // Agregar estudiantes con pagos
    const estudiantesConPagos = datosSecretaria.estudiantes.filter(estudiante => 
        datosSecretaria.pagos.some(pago => pago.estudianteId === estudiante.id)
    );
    
    estudiantesConPagos.forEach(estudiante => {
        const option = document.createElement('option');
        option.value = estudiante.id;
        option.textContent = `${estudiante.nombres} ${estudiante.apellidos} - ${estudiante.grado}`;
        selector.appendChild(option);
    });
}

function cargarHistorialPagos() {
    const estudianteId = document.getElementById('historial-estudiante').value;
    const periodo = document.getElementById('historial-periodo').value;
    
    if (!estudianteId) {
        alert('Por favor seleccione un estudiante');
        return;
    }
    
    let pagosFiltrados = datosSecretaria.pagos.filter(pago => pago.estudianteId == estudianteId);
    
    if (periodo) {
        pagosFiltrados = pagosFiltrados.filter(pago => pago.fechaPago.startsWith(periodo));
    }
    
    mostrarResumenPagos(pagosFiltrados, estudianteId);
    mostrarDetalleHistorial(pagosFiltrados);
}

function mostrarResumenPagos(pagos, estudianteId) {
    const estudiante = datosSecretaria.estudiantes.find(e => e.id == estudianteId);
    const totalPagado = pagos.filter(p => p.estado === 'pagado').reduce((sum, p) => sum + p.valor, 0);
    const totalPendiente = pagos.filter(p => p.estado === 'pendiente').reduce((sum, p) => sum + p.valor, 0);
    
    const resumen = document.getElementById('resumen-pagos');
    resumen.innerHTML = `
        <div class="payment-summary">
            <div class="summary-item">
                <h5>Estudiante</h5>
                <p>${estudiante.nombres} ${estudiante.apellidos}</p>
            </div>
            <div class="summary-item">
                <h5>Total Pagado</h5>
                <p class="amount">$${totalPagado.toLocaleString()}</p>
            </div>
            <div class="summary-item">
                <h5>Pendiente</h5>
                <p class="amount">$${totalPendiente.toLocaleString()}</p>
            </div>
            <div class="summary-item">
                <h5>Total Pagos</h5>
                <p class="amount">${pagos.length}</p>
            </div>
        </div>
    `;
    resumen.style.display = 'grid';
}

function mostrarDetalleHistorial(pagos) {
    const detalle = document.getElementById('detalle-historial');
    
    if (pagos.length === 0) {
        detalle.innerHTML = '<p class="alert alert-info">No hay pagos registrados para el período seleccionado.</p>';
        detalle.style.display = 'block';
        return;
    }
    
    let html = `
        <h4>Detalle de Pagos</h4>
        <table class="data-table">
            <thead>
                <tr>
                    <th>Fecha</th>
                    <th>Concepto</th>
                    <th>Valor</th>
                    <th>Método</th>
                    <th>Estado</th>
                    <th>Observaciones</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    pagos.sort((a, b) => new Date(b.fechaPago) - new Date(a.fechaPago)).forEach(pago => {
        html += `
            <tr>
                <td>${formatearFecha(pago.fechaPago)}</td>
                <td>${pago.concepto.charAt(0).toUpperCase() + pago.concepto.slice(1)}</td>
                <td>$${pago.valor.toLocaleString()}</td>
                <td>${pago.metodo}</td>
                <td><span class="estado ${pago.estado}">${pago.estado}</span></td>
                <td>${pago.observaciones || '-'}</td>
            </tr>
        `;
    });
    
    html += '</tbody></table>';
    detalle.innerHTML = html;
    detalle.style.display = 'block';
}

// Funciones auxiliares
function formatearFecha(fecha) {
    return new Date(fecha).toLocaleDateString('es-ES');
}

function mostrarAlerta(mensaje, tipo) {
    const alerta = document.createElement('div');
    alerta.className = `alert alert-${tipo}`;
    alerta.textContent = mensaje;
    
    // Insertar al inicio del content-area
    const contentArea = document.querySelector('.content-area');
    contentArea.insertBefore(alerta, contentArea.firstChild);
    
    // Remover después de 5 segundos
    setTimeout(() => {
        alerta.remove();
    }, 5000);
}

function exportarListado() {
    alert('Función de exportación a Excel simulada. En una aplicación real, se generaría el archivo Excel.');
}

function imprimirListado() {
    window.print();
}

function descargarDocumento(documentoId) {
    alert(`Simulando descarga del documento ID: ${documentoId}`);
}

// Inicializar pagos recientes al cargar
setTimeout(() => {
    if (document.getElementById('pagos-recientes')) {
        cargarPagosRecientes();
    }
}, 100);