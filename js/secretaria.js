// Generate enrollment report - CONTINUATION
function generateEnrollmentReport(reportType) {
    console.log('Generando reporte:', reportType);
    
    const btn = event.target;
    const originalText = btn.textContent;
    btn.textContent = 'Generando...';
    btn.disabled = true;
    
    setTimeout(() => {
        alert(`Reporte "${reportType}" generado exitosamente`);
        btn.textContent = originalText;
        btn.disabled = false;
        
        // Simulate file download
        console.log('Descargando archivo de reporte...');
    }, 2000);
}

// Generate student report
function generateStudentReport(reportType, program) {
    console.log('Generando reporte de estudiantes:', { reportType, program });
    
    const btn = document.querySelector('#student-reports .btn-primary');
    const originalText = btn.textContent;
    btn.textContent = 'Generando...';
    btn.disabled = true;
    
    setTimeout(() => {
        alert(`Reporte de estudiantes generado exitosamente`);
        btn.textContent = originalText;
        btn.disabled = false;
    }, 2000);
}

// Initialize course and group information views
function initializeCourseInfo() {
    const searchBtn = document.querySelector('#course-info .btn-primary');
    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            const searchTerm = document.getElementById('course-search').value;
            if (searchTerm.trim()) {
                searchCourses(searchTerm);
            } else {
                alert('Por favor ingrese un término de búsqueda');
            }
        });
    }
    
    // Group info filter
    const groupFilterBtn = document.querySelector('#group-info .btn-primary');
    if (groupFilterBtn) {
        groupFilterBtn.addEventListener('click', () => {
            const courseFilter = document.getElementById('group-course-filter').value;
            filterGroups(courseFilter);
        });
    }
}

// Search courses
function searchCourses(searchTerm) {
    console.log('Buscando cursos:', searchTerm);
    // In real implementation, this would filter the courses table
    alert('Búsqueda realizada - Mostrando resultados filtrados');
}

// Filter groups
function filterGroups(courseFilter) {
    console.log('Filtrando grupos por curso:', courseFilter);
    // In real implementation, this would filter the groups table
    alert('Grupos filtrados por curso seleccionado');
}

// Initialize schedule functionality
function initializeSchedules() {
    const consultBtn = document.querySelector('#schedules .btn-primary');
    if (consultBtn) {
        consultBtn.addEventListener('click', () => {
            const scheduleType = document.getElementById('schedule-type').value;
            const period = document.getElementById('schedule-period').value;
            
            if (scheduleType && period) {
                loadSchedule(scheduleType, period);
            } else {
                alert('Por favor seleccione tipo de cronograma y período');
            }
        });
    }
}

// Load schedule
function loadSchedule(scheduleType, period) {
    console.log('Cargando cronograma:', { scheduleType, period });
    
    const resultsDiv = document.getElementById('schedule-results');
    if (resultsDiv) {
        // Show loading state
        resultsDiv.innerHTML = '<p>Cargando cronograma...</p>';
        
        // Simulate API call
        setTimeout(() => {
            resultsDiv.innerHTML = `
                <h3>Cronograma ${scheduleType} - ${period}</h3>
                <table class="table">
                    <thead>
                        <tr>
                            <th>Fecha</th>
                            <th>Evento</th>
                            <th>Descripción</th>
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>01/09/2025</td>
                            <td>Evento actualizado</td>
                            <td>Descripción del evento para ${period}</td>
                            <td><span class="status-badge status-active">Activo</span></td>
                        </tr>
                    </tbody>
                </table>
            `;
        }, 1000);
    }
}

// Handle clear/reset buttons
function initializeClearButtons() {
    const clearBtns = document.querySelectorAll('.btn-secondary');
    clearBtns.forEach(btn => {
        if (btn.textContent.trim() === 'Limpiar') {
            btn.addEventListener('click', () => {
                const form = btn.closest('form');
                if (form) {
                    form.reset();
                    
                    // Hide student info if visible
                    const studentInfo = document.getElementById('student-info');
                    if (studentInfo) {
                        studentInfo.style.display = 'none';
                    }
                    
                    // Reset group select
                    const groupSelect = document.getElementById('group-select');
                    if (groupSelect) {
                        groupSelect.innerHTML = '<option value="">Primero seleccione un curso</option>';
                    }
                }
            });
        }
    });
}

// Handle detail view buttons
function initializeDetailButtons() {
    document.addEventListener('click', (e) => {
        if (e.target.textContent.includes('Ver Detalle')) {
            const row = e.target.closest('tr');
            const studentCode = row.cells[0].textContent;
            const studentName = row.cells[1].textContent;
            showStudentDetail(studentCode, studentName);
        }
    });
}

// Show student detail modal/popup
function showStudentDetail(studentCode, studentName) {
    const detail = `
Código: ${studentCode}
Nombre: ${studentName}
Programa: Ingeniería de Sistemas
Semestre: 3er Semestre
Créditos Matriculados: 18
Cursos Actuales: 6
Estado: Activo
    `;
    
    alert(`Detalle del Estudiante:\n\n${detail}`);
}

// Initialize notification handling
function initializeNotifications() {
    const notificationBtn = document.querySelector('.notification-btn');
    if (notificationBtn) {
        notificationBtn.addEventListener('click', () => {
            showNotifications();
        });
    }
}

// Show notifications
function showNotifications() {
    const notifications = [
        '• Nueva solicitud de cambio de grupo pendiente',
        '• 3 matrículas requieren revisión',
        '• Recordatorio: Cierre de matrículas en 5 días',
        '• Reporte mensual disponible para descarga',
        '• Sistema de programación actualizado'
    ];
    
    alert('Notificaciones:\n\n' + notifications.join('\n'));
}

// Export functionality
function initializeExportButtons() {
    document.addEventListener('click', (e) => {
        if (e.target.textContent.includes('Exportar')) {
            const exportType = e.target.textContent;
            handleExport(exportType);
        }
    });
}

// Handle export
function handleExport(exportType) {
    console.log('Exportando:', exportType);
    
    const btn = event.target;
    const originalText = btn.textContent;
    btn.textContent = 'Exportando...';
    btn.disabled = true;
    
    setTimeout(() => {
        alert(`${exportType} completado exitosamente`);
        btn.textContent = originalText;
        btn.disabled = false;
    }, 1500);
}

// Keyboard shortcuts
function initializeKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // ESC key closes mobile menu
        if (e.key === 'Escape') {
            closeMobileMenu();
        }
        
        // Ctrl+M toggles mobile menu
        if (e.ctrlKey && e.key === 'm') {
            e.preventDefault();
            if (sidebar.classList.contains('open')) {
                closeMobileMenu();
            } else if (window.innerWidth <= 768) {
                mobileMenuBtn.click();
            }
        }
        
        // Ctrl+F focuses search inputs
        if (e.ctrlKey && e.key === 'f') {
            e.preventDefault();
            const activeView = document.querySelector('.view.active');
            const searchInput = activeView ? activeView.querySelector('input[type="text"]') : null;
            if (searchInput) {
                searchInput.focus();
            }
        }
    });
}

// Responsive design handling
function handleResponsiveDesign() {
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            // Desktop view - ensure sidebar is visible and overlay is hidden
            sidebar.classList.remove('open');
            overlay.classList.remove('active');
        }
    });
}

// Form validation helpers
function validateForm(formData, requiredFields) {
    const missing = [];
    
    requiredFields.forEach(field => {
        if (!formData[field] || formData[field].trim() === '') {
            missing.push(field);
        }
    });
    
    return missing;
}

// Navigate to specific view programmatically
function navigateToView(viewId) {
    const targetNavItem = document.querySelector(`[data-view="${viewId}"]`);
    if (targetNavItem) {
        targetNavItem.click();
    }
}

// Initialize dashboard statistics (simulated)
function initializeDashboardStats() {
    // Update stats periodically
    setInterval(() => {
        updateDashboardStats();
    }, 30000); // Update every 30 seconds
}

// Update dashboard statistics
function updateDashboardStats() {
    // Simulate real-time updates
    const enrollmentsToday = document.querySelector('.stat-card.enrollments .stat-value');
    const pendingRequests = document.querySelector('.stat-card.pending .stat-value');
    
    if (enrollmentsToday) {
        const currentValue = parseInt(enrollmentsToday.textContent);
        // Randomly increase by 0-2
        const newValue = currentValue + Math.floor(Math.random() * 3);
        enrollmentsToday.textContent = newValue;
    }
    
    if (pendingRequests) {
        const currentValue = parseInt(pendingRequests.textContent);
        // Randomly change pending requests
        const change = Math.floor(Math.random() * 5) - 2; // -2 to +2
        const newValue = Math.max(0, currentValue + change);
        pendingRequests.textContent = newValue;
    }
}

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Dashboard de Secretaria inicializado');
    
    // Initialize all modules
    initializeStudentEnrollment();
    initializeEnrollmentChanges();
    initializeStudentListFilters();
    initializeReports();
    initializeCourseInfo();
    initializeSchedules();
    initializeClearButtons();
    initializeDetailButtons();
    initializeNotifications();
    initializeExportButtons();
    initializeKeyboardShortcuts();
    handleResponsiveDesign();
    initializeDashboardStats();
    
    // Set initial focus for accessibility
    const firstNavItem = document.querySelector('.nav-item.active');
    if (firstNavItem) {
        firstNavItem.focus();
    }
    
    console.log('Todas las funcionalidades inicialized correctamente');
});

// Auto-save functionality for forms (optional)
function initializeAutoSave() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                // Save to sessionStorage
                const formId = form.closest('.view').id;
                const savedData = JSON.parse(sessionStorage.getItem(`${formId}_draft`) || '{}');
                savedData[input.name || input.id] = input.value;
                sessionStorage.setItem(`${formId}_draft`, JSON.stringify(savedData));
            });
        });
    });
}

// Load saved form data
function loadSavedFormData() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        const formId = form.closest('.view').id;
        const savedData = JSON.parse(sessionStorage.getItem(`${formId}_draft`) || '{}');
        
        Object.keys(savedData).forEach(key => {
            const input = form.querySelector(`[name="${key}"], #${key}`);
            if (input && savedData[key]) {
                input.value = savedData[key];
            }
        });
    });
}

// Clear saved form data
function clearSavedFormData(viewId) {
    sessionStorage.removeItem(`${viewId}_draft`);
}

// Export functions for external use
window.SecretaryDashboard = {
    navigateToView,
    logout,
    closeMobileMenu,
    generateEnrollmentReport,
    generateStudentReport,
    searchStudent,
    handleStudentEnrollment
};

// Error handling
window.addEventListener('error', (e) => {
    console.error('Error en Dashboard de Secretaria:', e.error);
    // In production, you might want to send this to a logging service
});

console.log('JavaScript del Dashboard de Secretaria cargado completamente');