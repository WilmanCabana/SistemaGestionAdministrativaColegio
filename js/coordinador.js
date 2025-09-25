// Navigation functionality
const navItems = document.querySelectorAll('.nav-item');
const views = document.querySelectorAll('.view');
const pageTitle = document.getElementById('pageTitle');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');

// View titles mapping
const viewTitles = {
    'dashboard': 'Dashboard',
    'create-course': 'Registrar Curso',
    'course-students': 'Lista de Estudiantes',
    'schedule-course': 'Cronograma de Cursos',
    'create-group': 'Crear Grupo',
    'assign-students': 'Asignar Estudiantes',
    'group-schedules': 'Cronograma de Grupos',
    'enrollment-report': 'Reporte de Matrículas',
    'student-report': 'Reporte de Estudiantes'
};

// Handle navigation clicks
navItems.forEach(item => {
    item.addEventListener('click', () => {
        const viewId = item.getAttribute('data-view');
        
        // Update active nav item
        navItems.forEach(navItem => navItem.classList.remove('active'));
        item.classList.add('active');
        
        // Show corresponding view
        views.forEach(view => view.classList.remove('active'));
        const targetView = document.getElementById(viewId);
        if (targetView) {
            targetView.classList.add('active');
        }
        
        // Update page title
        pageTitle.textContent = viewTitles[viewId] || 'Dashboard';
        
        // Close mobile menu if open
        if (window.innerWidth <= 768) {
            closeMobileMenu();
        }
    });
});

// Mobile menu functionality
if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        sidebar.classList.add('open');
        overlay.classList.add('active');
    });
}

if (overlay) {
    overlay.addEventListener('click', closeMobileMenu);
}

function closeMobileMenu() {
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
}

// Logout functionality
function logout() {
    if (confirm('¿Está seguro que desea cerrar sesión?')) {
        // Aquí iría la lógica para cerrar sesión
        alert('Cerrando sesión...');
        // Ejemplo: redirigir a login
        // window.location.href = 'login.html';
    }
}

// Form submissions handling
function handleFormSubmissions() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            
            // Determine which form was submitted
            const formContainer = form.closest('.view');
            const viewId = formContainer ? formContainer.id : 'unknown';
            
            // Handle different forms
            switch(viewId) {
                case 'create-course':
                    handleCourseCreation(data);
                    break;
                case 'create-group':
                    handleGroupCreation(data);
                    break;
                default:
                    alert('Formulario enviado (funcionalidad pendiente de implementar)');
            }
        });
    });
}

// Handle course creation
function handleCourseCreation(data) {
    console.log('Creando curso:', data);
    
    // Validate required fields
    if (!data['course-name'] || !data['course-code'] || !data['course-credits']) {
        alert('Por favor complete todos los campos obligatorios');
        return;
    }
    
    // Simulate API call
    setTimeout(() => {
        alert(`Curso "${data['course-name']}" creado exitosamente`);
        // Reset form
        document.querySelector('#create-course form').reset();
        // Navigate back to dashboard
        navigateToView('dashboard');
    }, 1000);
}

// Handle group creation
function handleGroupCreation(data) {
    console.log('Creando grupo:', data);
    
    // Validate required fields
    if (!data['group-course'] || !data['group-number'] || !data['group-professor']) {
        alert('Por favor complete todos los campos obligatorios');
        return;
    }
    
    // Simulate API call
    setTimeout(() => {
        alert(`Grupo "${data['group-number']}" creado exitosamente`);
        // Reset form
        document.querySelector('#create-group form').reset();
        // Navigate back to dashboard
        navigateToView('dashboard');
    }, 1000);
}

// Navigate to specific view programmatically
function navigateToView(viewId) {
    const targetNavItem = document.querySelector(`[data-view="${viewId}"]`);
    if (targetNavItem) {
        targetNavItem.click();
    }
}

// Handle course selection in course-students view
function handleCourseSelection() {
    const courseSelect = document.querySelector('#select-course');
    if (courseSelect) {
        courseSelect.addEventListener('change', (e) => {
            const selectedCourse = e.target.value;
            console.log('Curso seleccionado:', selectedCourse);
            
            // Here you would typically load students for the selected course
            if (selectedCourse) {
                loadStudentsForCourse(selectedCourse);
            }
        });
    }
}

// Simulate loading students for a course
function loadStudentsForCourse(courseId) {
    // Simulate API call
    console.log(`Cargando estudiantes para curso: ${courseId}`);
    
    // In a real application, you would:
    // 1. Make an API call to get students
    // 2. Update the table with the results
    // 3. Handle loading states and errors
    
    // For now, just show a message
    const tableBody = document.querySelector('#course-students tbody');
    if (tableBody) {
        // This is just for demonstration - in reality you'd populate with real data
        console.log('Estudiantes cargados para el curso seleccionado');
    }
}

// Responsive sidebar handling
function handleResponsiveDesign() {
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            // Desktop view - ensure sidebar is visible and overlay is hidden
            sidebar.classList.remove('open');
            overlay.classList.remove('active');
        }
    });
}

// Notification handling
function handleNotifications() {
    const notificationBtn = document.querySelector('.notification-btn');
    if (notificationBtn) {
        notificationBtn.addEventListener('click', () => {
            alert('Funcionalidad de notificaciones pendiente de implementar');
            // Here you would typically show a dropdown with notifications
        });
    }
}

// Initialize dashboard statistics (simulated)
function initializeDashboard() {
    // Simulate loading dashboard data
    const stats = {
        courses: 12,
        students: 245,
        groups: 28,
        reports: 8
    };
    
    // Update stat cards if needed
    console.log('Dashboard inicializado con estadísticas:', stats);
}

// Form validation helpers
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validateRequired(value) {
    return value && value.trim().length > 0;
}

// Cancel button handlers
function handleCancelButtons() {
    const cancelBtns = document.querySelectorAll('.btn-secondary');
    cancelBtns.forEach(btn => {
        if (btn.textContent.trim() === 'Cancelar') {
            btn.addEventListener('click', () => {
                if (confirm('¿Está seguro que desea cancelar? Se perderán los cambios no guardados.')) {
                    // Reset the form
                    const form = btn.closest('form');
                    if (form) {
                        form.reset();
                    }
                    // Navigate back to dashboard
                    navigateToView('dashboard');
                }
            });
        }
    });
}

// Report generation handlers
function handleReportGeneration() {
    const reportBtns = document.querySelectorAll('.btn-primary');
    reportBtns.forEach(btn => {
        if (btn.textContent.includes('Generar Reporte')) {
            btn.addEventListener('click', () => {
                const reportType = btn.closest('.view').id;
                generateReport(reportType);
            });
        }
    });
}

// Generate report functionality
function generateReport(reportType) {
    console.log(`Generando reporte: ${reportType}`);
    
    // Simulate report generation
    const reportTypeNames = {
        'enrollment-report': 'Matrículas',
        'student-report': 'Estudiantes'
    };
    
    const reportName = reportTypeNames[reportType] || 'Desconocido';
    
    // Show loading state
    const btn = document.querySelector(`#${reportType} .btn-primary`);
    const originalText = btn.textContent;
    btn.textContent = 'Generando...';
    btn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        alert(`Reporte de ${reportName} generado exitosamente`);
        btn.textContent = originalText;
        btn.disabled = false;
        
        // In a real application, you would:
        // 1. Download the report file
        // 2. Open it in a new tab
        // 3. Show it in a modal, etc.
    }, 2000);
}

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Dashboard del Coordinador inicializado');
    
    // Initialize all modules
    handleFormSubmissions();
    handleCourseSelection();
    handleResponsiveDesign();
    handleNotifications();
    initializeDashboard();
    handleCancelButtons();
    handleReportGeneration();
    
    // Set initial focus for accessibility
    const firstNavItem = document.querySelector('.nav-item.active');
    if (firstNavItem) {
        firstNavItem.focus();
    }
});

// Keyboard navigation support
document.addEventListener('keydown', function(e) {
    // ESC key closes mobile menu
    if (e.key === 'Escape') {
        closeMobileMenu();
    }
    
    // Ctrl+M toggles mobile menu
    if (e.ctrlKey && e.key === 'm') {
        e.preventDefault();
        if (sidebar.classList.contains('open')) {
            closeMobileMenu();
        } else {
            mobileMenuBtn.click();
        }
    }
});

// Export functions for potential external use
window.CoordinatorDashboard = {
    navigateToView,
    logout,
    closeMobileMenu,
    generateReport
};