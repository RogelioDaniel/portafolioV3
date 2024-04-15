document.addEventListener("DOMContentLoaded", function() {
  const preloader = document.getElementById('preloader');
  const body = document.body;
  const title = document.querySelector('.Title');

  // Ocultar el preloader una vez que la página esté completamente cargada
  window.addEventListener('load', function() {
    preloader.style.display = 'none';
    body.style.overflow = 'visible'; // Muestra el contenido del body una vez que la página está completamente cargada
    title.classList.add('show');
  });
});
