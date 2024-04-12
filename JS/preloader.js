document.addEventListener("DOMContentLoaded", function() {
    const preloader = document.getElementById('preloader');
    const loader = document.getElementById('loader');
  
    // Ocultar el preloader una vez que la página esté completamente cargada
    window.addEventListener('load', function() {
    document.body.classList.add('loaded');
      preloader.style.display = 'none';
    });
  });
