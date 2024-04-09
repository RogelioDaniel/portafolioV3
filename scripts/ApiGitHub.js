function toggleProjectsContainer() {
    setTimeout(function() {
      var projectsContainer = document.getElementById('projects-container');
      if (projectsContainer.style.display === 'none' || projectsContainer.style.display === '') {
          projectsContainer.style.display = 'block';
          // Realiza aquí cualquier otra acción que necesites al abrir el contenedor de proyectos
          fetch('https://api.github.com/users/RogelioDaniel/repos')
          .then(response => response.json())
          .then(data => {
           
            data.forEach(repo => {
              var repoLink = document.createElement('a');
              repoLink.href = repo.html_url;
              repoLink.textContent = repo.name;
            });
          })
          .catch(error => console.error('Error fetching data:', error));
      } else {
          projectsContainer.style.display = 'none';
      }
  }, 0);
  }