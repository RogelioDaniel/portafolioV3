
const zoom = 1.5;


const positionWidth = 42;
const columns = 17;
const boardWidth = positionWidth * columns;


export function Texture(width, height, rects) {
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
  
export function Wheel() {
    const wheel = new THREE.Mesh(
      new THREE.BoxBufferGeometry(12 * zoom, 33 * zoom, 12 * zoom),
      new THREE.MeshLambertMaterial({ color: 0x333333, flatShading: true })
    );
    wheel.position.z = 6 * zoom;
    return wheel;
  }
  
export function Car() {
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
  
export function Subway() {
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
  
export function Three() {
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
  
  
export function Building() {
    const building = new THREE.Group();
  
    // Cargar el modelo OBJ
    const objLoader = new THREE.OBJLoader();
    objLoader.load(
      './assets/Skyscraper.obj', // Ruta al archivo del modelo OBJ
      (obj) => {
        const textureLoader = new THREE.TextureLoader();
        // Objeto cargado exitosamente
  textureLoader.load(
          './assets/Skyscraper_BaseColor.png', // Ruta a la textura
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
        const scaleFactor = 10; // Factor de escala para hacer el objeto más pequeño
        obj.scale.set(scaleFactor, scaleFactor, scaleFactor);
        // Rotar el modelo en su eje Y y X
        building.rotation.y = -300; // Rotación en el eje Y
        building.rotation.x = -300; // Rotación en el eje X
        building.rotation.z = 0;
        
     
        building.add(obj); // Agregar el modelo OBJ al grupo subway
      },
  
    );
  
    return building;
  }
  
  
  
export function People() {
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
  
  
export function MetroTracks() {
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
  
  
  
export function Grass() {
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
  
  
  
  
  
  
  
  