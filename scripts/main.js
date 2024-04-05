let peopleTouch;
const counterDOM = document.getElementById("counter");
const endDOM = document.getElementById("end");

const scene = new THREE.Scene();

const distance = 700;
const camera = new THREE.OrthographicCamera(
  window.innerWidth / -2,
  window.innerWidth / 2,
  window.innerHeight / 2,
  window.innerHeight / -2,
  0.1,
  10000
);

camera.rotation.x = (25 * Math.PI) / 180;
camera.rotation.y = (20 * Math.PI) / 180;
camera.rotation.z = (10 * Math.PI) / 180;

const initialCameraPositionY = -Math.tan(camera.rotation.x) * distance;
const initialCameraPositionX =
  Math.tan(camera.rotation.y) *
  Math.sqrt(distance ** 2 + initialCameraPositionY ** 2);
camera.position.y = initialCameraPositionY;
camera.position.x = initialCameraPositionX;
camera.position.z = distance;

const zoom = 1.5;

const peopleSize = 15;

const positionWidth = 42;
const columns = 17;
const boardWidth = positionWidth * columns;

const stepTime = 200; // Miliseconds it takes for the people to take a step forward, backward, left or right

let lanes;
let currentLane;
let currentColumn;

let previousTimestamp;
let startMoving;
let moves;
let stepStartTimestamp;
init();
const carFrontTexture = new Texture(40, 80, [{ x: 0, y: 10, w: 30, h: 60 }]);
const carBackTexture = new Texture(40, 80, [{ x: 10, y: 10, w: 30, h: 60 }]);
const carRightSideTexture = new Texture(110, 40, [
  { x: 10, y: 0, w: 50, h: 30 },
  { x: 70, y: 0, w: 30, h: 30 },
]);
const carLeftSideTexture = new Texture(110, 40, [
  { x: 10, y: 10, w: 50, h: 30 },
  { x: 70, y: 10, w: 30, h: 30 },
]);

const subwayFrontTexture = new Texture(30, 30, [{ x: 15, y: 0, w: 10, h: 30 }]);
const subwayRightSideTexture = new Texture(25, 30, [
  { x: 0, y: 15, w: 10, h: 10 },
]);
const subwayLeftSideTexture = new Texture(25, 30, [
  { x: 0, y: 5, w: 10, h: 10 },
]);

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



// Función para mostrar el cuadro de diálogo en la posición del mouse

scene.add(people);


hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
scene.add(hemiLight);

const initialDirLightPositionX = -100;
const initialDirLightPositionY = -100;
dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
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

backLight = new THREE.DirectionalLight(0x000000, 0.4);
backLight.position.set(200, 200, 50);
backLight.castShadow = true;
scene.add(backLight);

const laneTypes = ["car", "subway", "forest"];
const laneSpeeds = [2, 2.5, 3];
const vechicleColors = [0xa52523, 0xbdb638, 0x78b14b];
const threeHeights = [20, 45, 60];

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

function init(){

  
}
function Texture(width, height, rects) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, width, height);
  context.fillStyle = "rgba(0,0,0,0.6)";
  rects.forEach((rect) => {
    context.fillRect(rect.x, rect.y, rect.w, rect.h);
  });
  return new THREE.CanvasTexture(canvas);
}

function Wheel() {
  const wheel = new THREE.Mesh(
    new THREE.BoxBufferGeometry(12 * zoom, 33 * zoom, 12 * zoom),
    new THREE.MeshLambertMaterial({ color: 0x333333, flatShading: true })
  );
  wheel.position.z = 6 * zoom;
  return wheel;
}

function Car() {
  const car = new THREE.Group();

  // Cargar el modelo OBJ del automóvil
  const objLoader = new THREE.OBJLoader();
  objLoader.load(
    './assets/1399 Taxi.obj', // Ruta al archivo del modelo OBJ
    (obj) => {
      // Objeto cargado exitosamente
      const scaleFactor = 1.3; // Factor de escala para hacer el objeto más pequeño
      obj.scale.set(scaleFactor, scaleFactor, scaleFactor);

      // Aplicar textura al material del objeto cargado
      const textureLoader = new THREE.TextureLoader();
      textureLoader.load(
        './assets/1399 Taxi.png', // Ruta a la textura
        (texture) => {
          // Textura cargada exitosamente
          // Aplicar la textura al material del objeto
          obj.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              child.material.map = texture;
            }
          });
        },

      );

      car.rotation.y = -300; // Rotación en el eje Y
      car.rotation.x = 190; // Rotación en el eje X
      car.rotation.z = 0;

      // Agregar el modelo OBJ al grupo del automóvil
      car.add(obj);
    },

  );

  // Ajustes adicionales si es necesario, como posición, sombras, etc.

  return car;
}


function Subway() {
  const subway = new THREE.Group();

  // Cargar el modelo OBJ
  const objLoader = new THREE.OBJLoader();
  objLoader.load(
    './assets/1377 Car.obj', // Ruta al archivo del modelo OBJ
    (obj) => {
      const textureLoader = new THREE.TextureLoader();
      // Objeto cargado exitosamente
textureLoader.load(
        './assets/1377 Car.png', // Ruta a la textura
        (texture) => {
          // Textura cargada exitosamente
          // Aplicar la textura al material del objeto
          obj.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              child.material.map = texture;
            }
          });
      // Ajustar el tamaño del objeto
      const scaleFactor = 1.5; // Factor de escala para hacer el objeto más pequeño
      obj.scale.set(scaleFactor, scaleFactor, scaleFactor);
      // Rotar el modelo en su eje Y y X
      subway.rotation.y = -300; // Rotación en el eje Y
      subway.rotation.x = 190; // Rotación en el eje X
      subway.rotation.z = 0;
      // Crear una textura

      
        },
      );

      subway.add(obj); // Agregar el modelo OBJ al grupo subway
    },

  );

  return subway;
}







function Three() {
  const three = new THREE.Group();

  const trunk = new THREE.Mesh(
    new THREE.BoxBufferGeometry(15 * zoom, 15 * zoom, 20 * zoom),
    new THREE.MeshPhongMaterial({ color: 0x4d2926, flatShading: true })
  );
  trunk.position.z = 10 * zoom;
  trunk.castShadow = true;
  trunk.receiveShadow = true;
  three.add(trunk);

  height = threeHeights[Math.floor(Math.random() * threeHeights.length)];

  const crown = new THREE.Mesh(
    new THREE.BoxBufferGeometry(30 * zoom, 30 * zoom, height * zoom),
    new THREE.MeshLambertMaterial({ color: 0x7aa21d, flatShading: true })
  );
  crown.position.z = (height / 2 + 20) * zoom;
  crown.castShadow = true;
  crown.receiveShadow = false;
  three.add(crown);

  return three;
}


function Building() {
  const building = new THREE.Group();

  // Cargar el modelo OBJ
  const objLoader = new THREE.OBJLoader();
  objLoader.load(
    './assets/DonutStore.obj', // Ruta al archivo del modelo OBJ
    (obj) => {
      const textureLoader = new THREE.TextureLoader();
      // Objeto cargado exitosamente
textureLoader.load(
        './assets/WindowsDonutStore.png', // Ruta a la textura
        (texture) => {
          // Textura cargada exitosamente
          // Aplicar la textura al material del objeto
          obj.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              child.material.map = texture;
            }
          });      
        },
        
      );
      // Ajustar el tamaño del objeto
      const scaleFactor = 20; // Factor de escala para hacer el objeto más pequeño
      obj.scale.set(scaleFactor, scaleFactor, scaleFactor);
      // Rotar el modelo en su eje Y y X
      building.rotation.y = -300; // Rotación en el eje Y
      building.rotation.x = -300; // Rotación en el eje X
      building.rotation.z = 0;
      building.position.z = 25 * zoom;
   
      building.add(obj); // Agregar el modelo OBJ al grupo subway
    },

  );

  return building;
}



function People() {
  const people = new THREE.Group();


// Función para generar un color aleatorio en formato hexadecimal
function getRandomColor() {
  return Math.floor(Math.random() * 16777215);
}

// Función para generar dimensiones aleatorias para el cuerpo dentro del rango especificado
function generateRandomBodySize() {
  // Valores aleatorios para el tamaño del cuerpo dentro del rango de 10 a 30
  const width = Math.random() * (30 - 10) + 10;
  const height = Math.random() * (30 - 10) + 10;
  const depth = Math.random() * (30 - 10) + 10;

  return new THREE.Vector3(width * zoom, height * zoom, depth * zoom);
}

// Generar tamaño y color aleatorios para el cuerpo
const bodySize = generateRandomBodySize();
const bodyColor = getRandomColor();

// Cuerpo
const body = new THREE.Mesh(
  new THREE.BoxBufferGeometry(bodySize.x, bodySize.y, bodySize.z),
  new THREE.MeshPhongMaterial({ color: bodyColor, flatShading: true })
);
body.position.z = 10 * zoom;
body.castShadow = true;
body.receiveShadow = true;
people.add(body);


 // Generar un color aleatorio
function getRandomColor() {
  return new THREE.Color(Math.random(), Math.random(), Math.random());
}

// Cabeza
const head = new THREE.Mesh(
  new THREE.SphereBufferGeometry(8 * zoom, 32, 32),
  new THREE.MeshPhongMaterial({ color: 0xffccaa, flatShading: true })
);
head.position.z = 30 * zoom;
head.castShadow = true;
head.receiveShadow = false;
people.add(head);

// Función para generar cabello aleatorio detrás de la cabeza
function generateRandomHair() {
  // Valores aleatorios para las dimensiones del cabello dentro del rango de 4 a 6
  const width = Math.random() * (6 - 2) + 3;
  const height = Math.random() * (6 -2) + 3;
  const depth = Math.random() * (6 - 2) + 3;

  return new THREE.BoxBufferGeometry(width * zoom, height * zoom, depth * zoom);
}

// Generar cabello aleatorio y añadirlo detrás de la cabeza
const randomHair = generateRandomHair();
const hair = new THREE.Mesh(
  randomHair,
  new THREE.MeshPhongMaterial({ color: 0x886633, flatShading: true })
);
hair.position.x = 0 * zoom;
hair.position.y = 0 * zoom;
hair.position.z = 10 * zoom; // Ajustar la posición para que esté pegado a la cabeza
head.add(hair); // Agregar el cabello como hijo de la cabeza
  // Brazos
  const armGeometry = new THREE.BoxBufferGeometry(3 * zoom, 15 * zoom, 10 * zoom);
  const leftArm = new THREE.Mesh(armGeometry, new THREE.MeshPhongMaterial({ color: 0xffccaa }));
  leftArm.position.set(-12 * zoom, 5 * zoom, 15 * zoom);
  leftArm.castShadow = true;
  leftArm.receiveShadow = true;
  people.add(leftArm);

  const rightArm = leftArm.clone();
  rightArm.position.x *= -1;
  people.add(rightArm);

  // Piernas
  const legGeometry = new THREE.BoxBufferGeometry(5 * zoom, 15 * zoom, 10 * zoom);
  const leftLeg = new THREE.Mesh(legGeometry, new THREE.MeshPhongMaterial({ color: 0x000000 }));
  leftLeg.position.set(-5 * zoom, -7 * zoom, 0);
  leftLeg.castShadow = true;
  leftLeg.receiveShadow = true;
  people.add(leftLeg);

  const rightLeg = leftLeg.clone();
  rightLeg.position.x *= -1;
  people.add(rightLeg);
 
  return people;
}


function MetroTracks() {
  const metroTracks = new THREE.Group();
  const platformWidth = 10;
  // Texturas
  const trackTexture = new THREE.TextureLoader().load('./assets/road.jpg');


  // Función para crear secciones de las vías del metro con texturas
  const createSectionWithTexture = (width, height, texture) => {
    const geometry = new THREE.PlaneBufferGeometry(width, height);
    const material = new THREE.MeshPhongMaterial({ map: texture });
    return new THREE.Mesh(geometry, material);
  };

  // Sección central de las vías del metro con textura
  const middleTrack = createSectionWithTexture(boardWidth * zoom, positionWidth * zoom, trackTexture);

  middleTrack.receiveShadow = true;
  metroTracks.add(middleTrack);

  // Vía de la izquierda
  const leftTrack = createSectionWithTexture(boardWidth * zoom, positionWidth * zoom, trackTexture);
  leftTrack.position.x = -boardWidth * zoom;
  metroTracks.add(leftTrack);

  // Vía de la derecha
  const rightTrack = createSectionWithTexture(boardWidth * zoom, positionWidth * zoom, trackTexture);
  rightTrack.position.x = boardWidth * zoom;
  metroTracks.add(rightTrack);

  // Plataformas del metro a los lados de las vías con textura


  return metroTracks;
}



function Grass() {
  const grass = new THREE.Group();

  // Función para crear una sección con textura
  const createSection = (texture) => {
      // Ajusta la escala de mapeo de textura en el material

    const material = new THREE.MeshPhongMaterial({ map: texture });
    return new THREE.Mesh(
      new THREE.BoxBufferGeometry(
        boardWidth * zoom,
        positionWidth * zoom,
        3 * zoom
      ),
      material
    );
  };

  // Cargar las texturas
  const textureLoader = new THREE.TextureLoader();
  const middleTexture = textureLoader.load('./assets/pavement.jpg');
  const leftTexture = textureLoader.load('./assets/gravel.jpg');
  const rightTexture = textureLoader.load('./assets/gravel.jpg');

  // Crear secciones con textura y agregarlas al grupo
  const middle = createSection(middleTexture);
  middle.receiveShadow = true;
  grass.add(middle);

  const left = createSection(leftTexture);
  left.position.x = -boardWidth * zoom;
  grass.add(left);

  const right = createSection(rightTexture);
  right.position.x = boardWidth * zoom;
  grass.add(right);

  grass.position.z = 1.5 * zoom;

  return grass;
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
      let usePeople = false; // Variable para alternar entre Three y People
    
      this.threes = [1, 2, 3, 4].map(() => {
        const object = usePeople ? new Building () : new Three(); // Usar People o Three según el valor de usePeople
        let position;
        do {
          position = Math.floor(Math.random() * columns);
        } while (this.occupiedPositions.has(position));
        this.occupiedPositions.add(position);
        object.position.x =
          (position * positionWidth + positionWidth / 2) * zoom -
          (boardWidth * zoom) / 2;
        this.mesh.add(object);
        usePeople = !usePeople; // Alternar el valor de usePeople para la próxima iteración
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
        people.position.y = positionY; // initial people position is 0

        people.position.z = jumpDeltaDistance;
        break;
      }
      case "backward": {
        positionY = currentLane * positionWidth * zoom - moveDeltaDistance;
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

function getFirstObjectWithName(event, window, camera, scene, name){
    
  const raycaster = new THREE.Raycaster();
  const getFirstValue = true;

  const mousePointer = getMouseVector2(event, window);
const intersections = checkRayIntersections(mousePointer, camera, raycaster, scene, getFirstValue);
const wheelList = getObjectsByName(intersections, name);

  if(typeof wheelList[0] !== 'undefined'){
      return wheelList[0]
  }

  return null;
}

function getMouseVector2(event, window){
  let mousePointer = new THREE.Vector2()

  mousePointer.x = (event.clientX / window.innerWidth) * 2 - 1;
mousePointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

  return mousePointer;
}

function checkRayIntersections(mousePointer, camera, raycaster, scene) {
  raycaster.setFromCamera(mousePointer, camera);

  let intersections = raycaster.intersectObjects(scene.children, true);

  return intersections;
}

function getObjectsByName(objectList, name){
  const wheelObjects = [];
  
  objectList.forEach((object) => {
      const objectName = object.object.name || "Unnamed Object";
      objectName.includes(name) ? wheelObjects.push(object.object) : null;
  });

  return wheelObjects;
}

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

// Función para cerrar el contenedor de proyectos cuando se hace clic fuera de él
function closeProjectsContainer(event) {
  var projectsContainer = document.getElementById('projects-container');
  // Verificar si el clic ocurrió fuera del contenedor de proyectos
  if (!projectsContainer.contains(event.target)) {
    projectsContainer.style.display = 'none'; // Ocultar el contenedor
    // Remover el event listener para evitar múltiples cierres si se hace clic nuevamente fuera del contenedor
    document.removeEventListener('click', closeProjectsContainer);
  }
}


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
        // Realiza aquí cualquier otra acción que necesites al cerrar el contenedor de proyectos
    }
}, 0);
}


  