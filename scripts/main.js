import { People, Grass, MetroTracks, Car, Building, Subway } from "./objectsThree.js";
import GifLoader from 'https://cdn.skypack.dev/three-gif-loader';

const counterDOM = document.getElementById("counter");
const endDOM = document.getElementById("end");
const scene = new THREE.Scene();
const zoom = 1.5;
const positionWidth = 42;
const columns = 17;
const boardWidth = positionWidth * columns;
const distance = 700;
const camera = new THREE.OrthographicCamera(
  window.innerWidth / -2,
  window.innerWidth / 2,
  window.innerHeight / 2,
  window.innerHeight / -2,
  0.1,
  10000
);

camera.rotation.x = (50 * Math.PI) / 180;
camera.rotation.y = (20 * Math.PI) / 180;
camera.rotation.z = (10 * Math.PI) / 180;

const initialCameraPositionY = -Math.tan(camera.rotation.x) * distance;
const initialCameraPositionX =
  Math.tan(camera.rotation.y) *
  Math.sqrt(distance ** 2 + initialCameraPositionY ** 2);
camera.position.y = initialCameraPositionY;
camera.position.x = initialCameraPositionX;
camera.position.z = distance;

const peopleSize = 15;
const stepTime = 200; // Miliseconds it takes for the people to take a step forward, backward, left or right

let lanes;
let currentLane;
let currentColumn;

let previousTimestamp;
let startMoving;
let moves;
let stepStartTimestamp;
init();

function init(){

}


const generateLanes = () =>
  [-9, -8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    .map((index) => {
      const lane = new Lane(index);
      lane.mesh.position.y = index * positionWidth * zoom; // Ajusta la posición en el eje X
      scene.add(lane.mesh);
      return lane;
    })
    .filter((lane) => lane.index >= 0);

const addLane = () => {
  const index = lanes.length;
  const lane = new Lane(index);
  lane.mesh.position.y = index * positionWidth * zoom;
  scene.add(lane.mesh);
  lanes.push(lane);
};

const people = new People();
scene.add(people);

var hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
scene.add(hemiLight);

const initialDirLightPositionX = -100;
const initialDirLightPositionY = -100;
var dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
dirLight.position.set(initialDirLightPositionX, initialDirLightPositionY, 200);
dirLight.castShadow = true;
dirLight.target = people;
scene.add(dirLight);

dirLight.shadow.mapSize.width = 2048;
dirLight.shadow.mapSize.height = 2048;
var d = 500;
dirLight.shadow.camera.left = -d;
dirLight.shadow.camera.right = d;
dirLight.shadow.camera.top = d;
dirLight.shadow.camera.bottom = -d;

// var helper = new THREE.CameraHelper( dirLight.shadow.camera );
// var helper = new THREE.CameraHelper( camera );
// scene.add(helper)

var backLight = new THREE.DirectionalLight(0x000000, 0.4);
backLight.position.set(200, 200, 50);
backLight.castShadow = true;
scene.add(backLight);

const laneTypes = ["car", "subway", "forest"];
const laneSpeeds = [2, 2.5, 3];
const initaliseValues = () => {
  lanes = generateLanes();

  currentLane = 0;
  currentColumn = Math.floor(columns / 2);

  previousTimestamp = null;

  startMoving = false;
  moves = [];
  stepStartTimestamp;

  people.position.x = 0;
  people.position.y = 0;

  camera.position.y = initialCameraPositionY;
  camera.position.x = initialCameraPositionX;

  dirLight.position.x = initialDirLightPositionX;
  dirLight.position.y = initialDirLightPositionY;
};

initaliseValues();

const renderer = new THREE.WebGLRenderer({
  alpha: true,
  antialias: true,
});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

function gifImagen(){
  // Instancia el GifLoader
const loader = new GifLoader();

// Carga la imagen GIF
loader.load(
    // URL del recurso
    './assets/image2.gif',

    // Función de callback onLoad
    function (texture) {
        // Crea una geometría para el plano
        const geometry = new THREE.PlaneBufferGeometry(100, 5); // Ajusta el tamaño del plano según tus necesidades

        // Crea un material usando la textura cargada
        const material = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: false
        });

        // Crea un objeto Mesh utilizando la geometría y el material
        const plane = new THREE.Mesh(geometry, material);

        // Establece la posición del objeto en (0, 0, 10)
        plane.position.set(0, 0, 10); // Ajusta la posición según tus necesidades
        

    },

    // Función de callback onProgress (opcional)
    function (xhr) {
        console.log(`${(xhr.loaded / xhr.total * 100)}% cargado`);
    },

    // Función de callback onError (opcional)
    function (error) {
        console.error('Se produjo un error', error);
    }
    );

}


function Lane(index) {
  
  this.index = index;
  this.type =
    index <= 0
      ? "field"
      : laneTypes[Math.floor(Math.random() * laneTypes.length)];

  switch (this.type) {
    case "field": {
      this.type = "field";
      this.mesh = new Grass();
      break;
    }
    case "forest": {
      this.mesh = new Grass();
      this.occupiedPositions = new Set();
      let usePeople = false; 
    
      this.threes = [1,2,3].map(() => {
        const object = usePeople ? new Building () : new People();      
        let position; 
        do {
          position = Math.floor(Math.random() * columns);
        } while (this.occupiedPositions.has(position));
        this.occupiedPositions.add(position);
        object.position.x =
          (position * positionWidth + positionWidth / 2) * zoom -
          (boardWidth * zoom) / 2;
        this.mesh.add(object);
        usePeople = !usePeople; 
        return object;
      });
      break;
    }
    
    case "car": {
      this.mesh = new MetroTracks();
      this.direction = Math.random() >= 0.5;

      const occupiedPositions = new Set();
      this.vechicles = [1].map(() => {
        const vechicle = new Car();
        let position;
        do {
          position = Math.floor((Math.random() * columns) / 2);
        } while (occupiedPositions.has(position));
        occupiedPositions.add(position);
        vechicle.position.x =
          (position * positionWidth * 2 + positionWidth / 2) * zoom -
          (boardWidth * zoom) / 2;
        if (!this.direction) vechicle.rotation.z = Math.PI;
        this.mesh.add(vechicle);
        return vechicle;
      });

      this.speed = laneSpeeds[Math.floor(Math.random() * laneSpeeds.length)];
      break;
    }
    case "subway": {
      this.mesh = new MetroTracks();
      this.direction = Math.random() >= 0.5;

      const occupiedPositions = new Set();
      this.vechicles = [1].map(() => {
        const vechicle = new Subway();
        let position;
        do {
          position = Math.floor((Math.random() * columns) / 3);
        } while (occupiedPositions.has(position));
        occupiedPositions.add(position);
        vechicle.position.x =
          (position * positionWidth * 3 + positionWidth / 2) * zoom -
          (boardWidth * zoom) / 2;
        if (!this.direction) vechicle.rotation.z= Math.PI;
        this.mesh.add(vechicle);
        return vechicle;
      });

      this.speed = laneSpeeds[Math.floor(Math.random() * laneSpeeds.length)];
      break;
    
    }
  }
}

document.querySelector("#retry").addEventListener("click", () => {
  lanes.forEach((lane) => scene.remove(lane.mesh));
  initaliseValues();
  endDOM.style.visibility = "hidden";
});


function onClick(event) {
  var raycaster = new THREE.Raycaster();
  var mouse = new THREE.Vector2();

  // Calcula la posición del clic del mouse en coordenadas normalizadas
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  // Envuelve el objeto people en un arreglo para intersectObjects
  var intersects = raycaster.intersectObjects([people], true);
  
  // Si hubo intersección con el objeto People, realiza la acción
  if (intersects.length > 0) {
    console.log('Clic en People!');
    // Crear un elemento div para el recuadro
    var popup = document.createElement('div');
    popup.classList.add('popup');
    camera.rotation.x = (25 * Math.PI) / 180;
    camera.rotation.y = (20 * Math.PI) / 180;
    camera.rotation.z = (10 * Math.PI) / 180;
    camera.zoom = zoom * 2.5;
    camera.updateProjectionMatrix();
    // Agregar el icono de "tache" para cerrar
    var closeIcon = document.createElement('span');
    closeIcon.classList.add('close-icon');
    closeIcon.innerHTML = '&times;';
    closeIcon.addEventListener('click', function() {
      document.body.removeChild(popup);
      camera.rotation.x = (25 * Math.PI) / 180;
      camera.rotation.y = (20 * Math.PI) / 180;
      camera.rotation.z = (10 * Math.PI) / 180;
      camera.zoom = zoom / 1.5;
      camera.updateProjectionMatrix(); // Cerrar el recuadro al hacer clic en el icono
    });

    // Agregar el icono al recuadro
    popup.appendChild(closeIcon);
    
    // Crear una lista para mostrar la información
    var infoList = document.createElement('ul');
    
    // Agregar los elementos de la lista
    var nameItem = document.createElement('li');
    nameItem.textContent = 'Rogelio Daniel Roldán Guzmán, 25 years old';
    infoList.appendChild(nameItem);
    
    var portfolioItem = document.createElement('li');
    var portfolioLink = document.createElement('a');
    portfolioLink.href = 'https://rogeliodaniel.github.io/PortafolioV2';
    portfolioLink.textContent = 'Portfolio';
    portfolioLink.style.color = 'blue';
    portfolioItem.appendChild(portfolioLink);
    infoList.appendChild(portfolioItem);
    
    var cvItem = document.createElement('li');
    var cvLink = document.createElement('a');
    cvLink.href = 'https://drive.google.com/file/d/1a_HR-hlMp1yj3uIWpzM3LNz1HsGCqdXv/view?usp=drive_link'; // Reemplaza 'link_al_archivo_pdf' con el enlace real al archivo PDF
    cvLink.textContent = 'CV';
    var cvIcon = document.createElement('i');
    cvIcon.classList.add('fa', 'fa-paperclip');
    cvLink.style.color = 'blue';// Añade clases para el icono de clip usando Font Awesome
    cvLink.appendChild(cvIcon);
    cvItem.appendChild(cvLink);
    infoList.appendChild(cvItem);
    
    // Agregar la lista al recuadro
    popup.appendChild(infoList);

    // Añadir el recuadro al DOM
    document.body.appendChild(popup);
  }
}


// Registra el evento de click en el documento
document.addEventListener('click', onClick);
renderer.domElement.addEventListener("click", onclick, true);



document
  .getElementById("forward")
  .addEventListener("click", () => move("forward"));

document
  .getElementById("backward")
  .addEventListener("click", () => move("backward"));

document.getElementById("left").addEventListener("click", () => move("left"));

document.getElementById("right").addEventListener("click", () => move("right"));

window.addEventListener("keydown", (event) => {
  if (event.keyCode == "38") {
    // up arrow
    move("forward");
  } else if (event.keyCode == "40") {
    // down arrow
    move("backward");
  } else if (event.keyCode == "37") {
    // left arrow
    move("left");
  } else if (event.keyCode == "39") {
    // right arrow
    move("right");
  }
});

function move(direction) {
  const finalPositions = moves.reduce(
    (position, move) => {
      if (move === "forward")
        return { lane: position.lane + 1, column: position.column };
      if (move === "backward")
        return { lane: position.lane - 1, column: position.column };
      if (move === "left")
        return { lane: position.lane, column: position.column - 1 };
      if (move === "right")
        return { lane: position.lane, column: position.column + 1 };
    },
    { lane: currentLane, column: currentColumn }
  );

  if (direction === "forward") {
    if (
      lanes[finalPositions.lane + 1].type === "forest" &&
      lanes[finalPositions.lane + 1].occupiedPositions.has(
        finalPositions.column
      )
    )
      return;
    if (!stepStartTimestamp) startMoving = true;
    addLane();
  } else if (direction === "backward") {
    if (finalPositions.lane === 0) return;
    if (
      lanes[finalPositions.lane - 1].type === "forest" &&
      lanes[finalPositions.lane - 1].occupiedPositions.has(
        finalPositions.column
      )
    )
      return;
    if (!stepStartTimestamp) startMoving = true;
  } else if (direction === "left") {
    if (finalPositions.column === 0) return;
    if (
      lanes[finalPositions.lane].type === "forest" &&
      lanes[finalPositions.lane].occupiedPositions.has(
        finalPositions.column - 1
      )
    )
      return;
    if (!stepStartTimestamp) startMoving = true;
  } else if (direction === "right") {
    if (finalPositions.column === columns - 1) return;
    if (
      lanes[finalPositions.lane].type === "forest" &&
      lanes[finalPositions.lane].occupiedPositions.has(
        finalPositions.column + 1
      )
    )
      return;
    if (!stepStartTimestamp) startMoving = true;
  }
  moves.push(direction);
}

function animate(timestamp) {
  requestAnimationFrame(animate);

  if (!previousTimestamp) previousTimestamp = timestamp;
  const delta = timestamp - previousTimestamp;
  previousTimestamp = timestamp;

  // Animate cars and subways moving on the lane
  lanes.forEach((lane) => {
    if (lane.type === "car" || lane.type === "subway") {
      const aBitBeforeTheBeginingOfLane =
        (-boardWidth * zoom) / 2 - positionWidth * 2 * zoom;
        
      const aBitAfterTheEndOFLane =
        (boardWidth * zoom) / 2 + positionWidth * 2 * zoom;
      lane.vechicles.forEach((vechicle) => {
        if (lane.direction) {
          if(lane.type == "subway"){
            vechicle.rotation.y = 29.8;
            vechicle.rotation.z = 0;
          }
          vechicle.rotation.y = 29.8;
          vechicle.rotation.z = 0;
            
          vechicle.position.x =
            vechicle.position.x < aBitBeforeTheBeginingOfLane
              ? aBitAfterTheEndOFLane
              : (vechicle.position.x -= (lane.speed / 16) * delta);
              
              
        } else {
          vechicle.position.x =
          
            vechicle.position.x > aBitAfterTheEndOFLane
              ? aBitBeforeTheBeginingOfLane
              : (vechicle.position.x += (lane.speed / 16) * delta);
             
              
        }
      });
    }
  });

  if (startMoving) {
    stepStartTimestamp = timestamp;
    startMoving = false;
  }

  if (stepStartTimestamp) {
    const moveDeltaTime = timestamp - stepStartTimestamp;
    const moveDeltaDistance =
      Math.min(moveDeltaTime / stepTime, 1) * positionWidth * zoom;
    const jumpDeltaDistance =
      Math.sin(Math.min(moveDeltaTime / stepTime, 1) * Math.PI) * 8 * zoom;
    switch (moves[0]) {
      case "forward": {
        const positionY =
          currentLane * positionWidth * zoom + moveDeltaDistance;
        camera.position.y = initialCameraPositionY + positionY;
        dirLight.position.y = initialDirLightPositionY + positionY;
         // initial people position is 0
        people.position.z = jumpDeltaDistance;
        
        people.position.z = positionY;
        break;
      }
      case "backward": {
        var positionY = currentLane * positionWidth * zoom - moveDeltaDistance;
        camera.position.y = initialCameraPositionY + positionY;
        dirLight.position.y = initialDirLightPositionY + positionY;
        people.position.y = positionY;

        people.position.z = jumpDeltaDistance;
        break;
      }
      case "left": {
        const positionX =
          (currentColumn * positionWidth + positionWidth / 2) * zoom -
          (boardWidth * zoom) / 2 -
          moveDeltaDistance;
        camera.position.x = initialCameraPositionX + positionX;
        dirLight.position.x = initialDirLightPositionX + positionX;
        people.position.x = positionX; // initial people position is 0
        people.position.z = jumpDeltaDistance;
        break;
      }
      case "right": {
        const positionX =
          (currentColumn * positionWidth + positionWidth / 2) * zoom -
          (boardWidth * zoom) / 2 +
          moveDeltaDistance;
        camera.position.x = initialCameraPositionX + positionX;
        dirLight.position.x = initialDirLightPositionX + positionX;
        people.position.x = positionX;

        people.position.z = jumpDeltaDistance;
        break;
      }
    }
    // Once a step has ended
    if (moveDeltaTime > stepTime) {
      switch (moves[0]) {
        case "forward": {
          currentLane++;
          people.position.z+=10;
          camera.position.z +=50;
          counterDOM.innerHTML = currentLane;
          break;
        }
        case "backward": {
          currentLane--;
          counterDOM.innerHTML = currentLane;
          break;
        }
        case "left": {
          currentColumn--;
          break;
        }
        case "right": {
          currentColumn++;
          break;
        }
      }
      moves.shift();
      // If more steps are to be taken then restart counter otherwise stop stepping
      stepStartTimestamp = moves.length === 0 ? null : timestamp;
    }
  }

  // Hit test
  if (
    lanes[currentLane].type === "car" ||
    lanes[currentLane].type === "subway"
  ) {
    const peopleMinX = people.position.x - (peopleSize * zoom) / 2;
    const peopleMaxX = people.position.x + (peopleSize * zoom) / 2;
    const vechicleLength = { car: 60, subway: 105 }[lanes[currentLane].type];
    lanes[currentLane].vechicles.forEach((vechicle) => {
      const carMinX = vechicle.position.x - (vechicleLength * zoom) / 2;
      const carMaxX = vechicle.position.x + (vechicleLength * zoom) / 2;
      if (peopleMaxX > carMinX && peopleMinX < carMaxX) {
        endDOM.style.visibility = "visible";
      }
    });
  }
  renderer.render(scene, camera);
}

requestAnimationFrame(animate);

// URL de la API de GitHub para obtener la lista de repositorios del usuario
const apiUrl = 'https://api.github.com/users/RogelioDaniel/repos';

// Realizar la solicitud GET a la API de GitHub
fetch(apiUrl)
  .then(response => response.json())
  .then(data => {
    // Una vez que se obtiene la respuesta, procesar los datos
    const projectsContainer = document.getElementById('projects-container');
    data.forEach(repo => {
      // Crear un elemento de lista para cada repositorio
      const repoItem = document.createElement('li');
      // Agregar el nombre del repositorio como enlace
      const repoLink = document.createElement('a');
      repoLink.textContent = repo.name;
      repoLink.href = repo.html_url;
      repoLink.target = '_blank'; // Abrir enlace en una nueva pestaña
      repoItem.appendChild(repoLink);
      // Agregar el elemento de lista al contenedor de proyectos
      projectsContainer.appendChild(repoItem);
    });
  })
  .catch(error => console.error('Error fetching data:', error));


  