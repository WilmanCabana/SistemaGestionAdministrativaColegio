// Datos de usuarios de ejemplo (en un caso real esto vendría de una base de datos)
const usuarios = [
    {
        email: "coordinador@unimagdalena.edu.co",
        password: "coordinador123",
        rol: "coordinador",
        nombre: "Coordinador Principal"
    },
    {
        email: "secretaria@unimagdalena.edu.co",
        password: "secretaria123",
        rol: "secretaria",
        nombre: "Secretaria Administrativa"
    },
    {
        email: "admin@unimagdalena.edu.co",
        password: "admin123",
        rol: "coordinador",
        nombre: "Administrador del Sistema"
    }
];

// URLs de redirección según el rol
const redirecciones = {
    coordinador: "/SistemaGestionAdministrativaColegio/html/vistaCoordinador.html",
    secretaria: "/SistemaGestionAdministrativaColegio/html/vistaSecretaria.html"
};

// Función para validar el formato del email institucional
function validarEmailInstitucional(email) {
    const regex = /^[a-zA-Z0-9._%+-]+@unimagdalena\.edu\.co$/;
    return regex.test(email);
}

// Función para iniciar sesión
function iniciarSesion(event) {
    event.preventDefault(); // Prevenir envío del formulario
    
    // Obtener valores del formulario
    const email = document.querySelector('input[type="email"]').value.trim();
    const password = document.querySelector('input[type="password"]').value;
    
    // Validaciones básicas
    if (!email || !password) {
        mostrarError("Por favor, complete todos los campos");
        return;
    }
    
    if (!validarEmailInstitucional(email)) {
        mostrarError("Por favor, ingrese un correo institucional válido (@unimagdalena.edu.co)");
        return;
    }
    
    // Buscar usuario en la "base de datos"
    const usuario = usuarios.find(user => 
        user.email === email && user.password === password
    );
    
    if (usuario) {
        // Login exitoso
        loginExitoso(usuario);
    } else {
        // Credenciales incorrectas
        mostrarError("Correo o contraseña incorrectos");
    }
}

// Función para manejar login exitoso
function loginExitoso(usuario) {
    // Mostrar mensaje de éxito
    mostrarExito(`Bienvenido/a ${usuario.nombre}`);
    
    // Guardar información del usuario en sessionStorage
    sessionStorage.setItem('usuarioLogueado', JSON.stringify({
        email: usuario.email,
        rol: usuario.rol,
        nombre: usuario.nombre,
        timestamp: new Date().getTime()
    }));
    
    // Redirigir según el rol después de un breve delay
    setTimeout(() => {
        window.location.href = redirecciones[usuario.rol];
    }, 1500);
}

// Función para mostrar mensajes de error
function mostrarError(mensaje) {
    // Remover mensajes existentes
    removerMensajes();
    
    const form = document.getElementById('form-login');
    const mensajeError = document.createElement('div');
    mensajeError.className = 'mensaje-error';
    mensajeError.innerHTML = `
        <svg class="error-icon">
            <use xlink:href="/SistemaGestionAdministrativaColegio/assets/icons/sprite.svg#error"/>
        </svg>
        <span>${mensaje}</span>
    `;
    
    form.insertBefore(mensajeError, form.firstChild);
    
    // Agregar clase de error a los inputs
    const inputs = document.querySelectorAll('.login-input');
    inputs.forEach(input => {
        input.classList.add('error');
    });
}

// Función para mostrar mensajes de éxito
function mostrarExito(mensaje) {
    removerMensajes();
    
    const form = document.getElementById('form-login');
    const mensajeExito = document.createElement('div');
    mensajeExito.className = 'mensaje-exito';
    mensajeExito.innerHTML = `
        <svg class="exito-icon">
            <use xlink:href="/SistemaGestionAdministrativaColegio/assets/icons/sprite.svg#check"/>
        </svg>
        <span>${mensaje}</span>
    `; //Hace falta agregar al sprite el svg check, pero funciona bien aun sin este
    
    form.insertBefore(mensajeExito, form.firstChild);
    
    // Deshabilitar el botón de login
    const btnLogin = document.getElementById('btn-login');
    btnLogin.disabled = true;
    btnLogin.textContent = 'Redirigiendo...';
}

// Función para remover mensajes existentes
function removerMensajes() {
    const mensajes = document.querySelectorAll('.mensaje-error, .mensaje-exito');
    mensajes.forEach(mensaje => mensaje.remove());
    
    // Remover clases de error de los inputs
    const inputs = document.querySelectorAll('.login-input');
    inputs.forEach(input => {
        input.classList.remove('error');
    });
}

// Función para verificar si ya hay una sesión activa
function verificarSesionActiva() {
    const usuarioGuardado = sessionStorage.getItem('usuarioLogueado');
    if (usuarioGuardado) {
        const usuario = JSON.parse(usuarioGuardado);
        // Redirigir automáticamente si ya está logueado
        window.location.href = redirecciones[usuario.rol];
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Verificar sesión activa al cargar la página
    verificarSesionActiva();
    
    // Agregar evento al formulario
    const formLogin = document.getElementById('form-login');
    formLogin.addEventListener('submit', iniciarSesion);
    
    // Agregar eventos a los inputs para remover errores al escribir
    const inputs = document.querySelectorAll('.login-input');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            this.classList.remove('error');
            removerMensajes();
        });
    });
});

// Función para cerrar sesión (debes llamarla desde otras páginas)
function cerrarSesion() {
    sessionStorage.removeItem('usuarioLogueado');
    window.location.href = "/SistemaGestionAdministrativaColegio/html/login.html";
}

// Función para obtener información del usuario logueado
function obtenerUsuarioLogueado() {
    const usuarioGuardado = sessionStorage.getItem('usuarioLogueado');
    return usuarioGuardado ? JSON.parse(usuarioGuardado) : null;
}