function moveIndicator(item) {
    // Obtener la bolita indicadora dentro del elemento actual
    const indicator = item.querySelector('.indicator-ball');
    
    // Restablecer todos los tamaños de bolitas a 10px
    const allIndicators = document.querySelectorAll('.indicator-ball');
    allIndicators.forEach(indicator => {
        indicator.style.width = '10px';
        indicator.style.height = '10px';
    });
    
    // Ajustar el tamaño de la bolita indicadora actual
    indicator.style.width = '20px';
    indicator.style.height = '20px';
}
