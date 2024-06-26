let scene,
  camera,
  fieldOfView,
  aspectRatio,
  nearPlane,
  farPlane,
  renderer,
  container,
  rocket,
  HEIGHT,
  WIDTH;

const createScene = () => {
  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;

  scene = new THREE.Scene();

  scene.fog = new THREE.Fog();

  aspectRatio = WIDTH / HEIGHT;
  fieldOfView = 60;
  nearPlane = 1;
  farPlane = 10000;
  camera = new THREE.PerspectiveCamera(
    fieldOfView,
    aspectRatio,
    nearPlane,
    farPlane
  );


  renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
  });
  renderer.setSize(WIDTH, HEIGHT);

  renderer.shadowMap.enabled = true;

  container = document.getElementById("canvas");
  container.appendChild(renderer.domElement);

  window.addEventListener("resize", handleWindowResize, false);

 
};

const handleWindowResize = () => {
  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;
  renderer.setSize(WIDTH, HEIGHT);
  camera.aspect = WIDTH / HEIGHT;
  camera.updateProjectionMatrix();
};

const createLights = () => {
  const ambientLight = new THREE.HemisphereLight(0x404040, 0x404040, 1);

  const directionalLight = new THREE.DirectionalLight(0xdfebff, 1);
  directionalLight.position.set(-300, 0, 600);

  const pointLight = new THREE.PointLight(0xa11148, 2, 1000, 2);
  pointLight.position.set(200, -100, 50);

  scene.add(ambientLight, directionalLight, pointLight);
};

const targetRocketPosition = 40;
const animationDuration = 20000;

// const loop = () => {
//   const t = (Date.now() % animationDuration) / animationDuration;

//   renderer.render(scene, camera);

//   const delta = targetRocketPosition * Math.sin(Math.PI * 2 * t);
//   if (rocket) {
//     rocket.rotation.y += 0.01;
//     rocket.position.y = delta; 
//   }

//   requestAnimationFrame(loop);
// };

const main = () => {
  createScene();
  createLights();

  renderer.render(scene, camera);
  // loop();
};

main();
