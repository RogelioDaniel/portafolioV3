function App() {
  let e = document.querySelector(".Title"),
    o = document.querySelector(".ScrollDown"),
    a = document.querySelector(".TriggerClass"),
    n = document.querySelector(".Wrapper2"),
    nn = document.querySelector(".Wrapper3"),
    r = document.querySelector(".CanvasElementClass"),
    i = (new THREE.Color("#ff375f"), new THREE.Color("#ffd60a")),
    s = new THREE.Color("#ffffff"),
    d = window.innerWidth,
    p = window.innerHeight;

  const c = new THREE.Scene(),
    u = new THREE.WebGLRenderer({ canvas: r, antialias: true, autoSize: true });

  u.setPixelRatio(window.devicePixelRatio), u.setSize(d, p);

  let w = d / p,
    l = new THREE.PerspectiveCamera(50, w, 0.1, 1e3);

  l.position.setZ(50),
    addEventListener("resize", function () {
      (d = window.innerWidth),
        (p = window.innerHeight),
        u.setSize(d, p),
        (l.aspect = d / p),
        l.updateProjectionMatrix();
    });

  const E = new THREE.PointLight(16772574, 0.7),
    h = new THREE.AmbientLight(16777215, 0.6);
  c.add(h);

    
  function render() {

    u.render( c, l );

  }
  function loadModel() {

    object.traverse( function ( child ) {

      if ( child.isMesh ) child.material.map = texture;

    } );

    object.position.y = -10;
    object.scale.setScalar( 0.6 );
    c.add( object );
    render();



  }
  const manager = new THREE.LoadingManager( loadModel );
  const textureLoader = new THREE.TextureLoader( manager );
  const texture = textureLoader.load( './assets/nave.png' );
  texture.colorSpace = THREE.SRGBColorSpace;
    
    
  function onProgress( xhr ) {

    if ( xhr.lengthComputable ) {

      const percentComplete = xhr.loaded / xhr.total * 100;
      console.log( 'model ' + percentComplete.toFixed( 2 ) + '% downloaded' );

    }

  }

  const m = new THREE.OBJLoader( manager );
  m.load( './assets/nave.obj', function ( obj ) {

    object = obj;
    animate();
  },onProgress );

  const S = new THREE.Group();

  //S.add(m),

    c.add(S),
    Array(400).fill().forEach(function () {
      // Generar posiciones aleatorias
      const [x, y] = Array(2).fill().map(() => THREE.MathUtils.randFloatSpread(220));
  
      // Cargar el modelo OBJ
      const objLoader = new THREE.OBJLoader();
      objLoader.load(
          './assets/start.obj', // Ruta al archivo del modelo OBJ
          function (obj) {
              // Objeto cargado exitosamente
              // Recorre todas las partes del modelo y aplica los materiales
              obj.traverse(function (child) {
                  if (child instanceof THREE.Mesh) {
                      // Configura el material para cada parte del modelo
                      const material = new THREE.MeshPhysicalMaterial({ color: s, roughness: 0.13 });
                      // Aplica el material a la parte del modelo
                      child.material = material;
                  }
              });
  
              // Crea un grupo para el objeto cargado
              const group = new THREE.Group();
              obj.scale.setScalar( 0.8 );
              group.add(obj);
  
              // Establecer la posición del grupo
              group.position.set(x, y, -20);
  
              // Agrega el grupo a tu escena
              c.add(group);
  
              // Añade las animaciones
              gsap.timeline({
                  defaults: { duration: 7, ease: "power3.inOut" },
                  repeat: -1,
                  repeatDelay: 0,
                  yoyo: 1,
              }).to(group.position, { z: "+=31", y: "+=31" }, "<+=0.00").to(
                  group.rotation,
                  { y: 0.31 * Math.PI, x: 0.13 * Math.PI, z: 0.22 * Math.PI },
                  "<+=0.00"
              );
          },
          // Función de progreso (opcional)
          function (xhr) {
              console.log((xhr.loaded / xhr.total * 100) + '% loaded');
          },
          // Función de manejo de errores (opcional)
          function (error) {
              console.error('Error loading OBJ:', error);
          }
      );
  });
  
    (u.shadowMap.enabled = true),
    (u.shadowMap.type = THREE.PCFSoftShadowMap),
    (E.castShadow = true),
    (E.shadow.mapSize.width = 2200),
    (E.shadow.mapSize.height = 2200),
    (E.shadow.camera.near = 0.5),
    (E.shadow.camera.far = 220),
    (m.castShadow = true),
    (m.receiveShadow = true),
    //(f.castShadow = true),
    //(f.receiveShadow = true),
    (function e() {
      //(f.rotation.x -= 0.0022),
       // (f.rotation.y += 0.013),
        u.render(c, l),
        requestAnimationFrame(e);
    })(),
    gsap
      .timeline({
        defaults: {
          duration: 1.3,
          ease: "power3.inOut",
          stagger: { from: "end", amount: 0.7 },
        },
      })
      .from(e, { xPercent: -31, opacity: 0 }, "<+=0.00")
      .to(m.rotation, { x: 1 * -Math.PI }, "<+=0.00"),
    gsap
      .timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: a,
          start: "0% 0%",
          end: "100% 0%",
          scrub: 5.2,

          onUpdate: function (e) {
            e.progress > 0.031
              ? gsap.to(o.querySelector("span"), {
                  opacity: 0,
                  duration: 1.3,
                  ease: "power3.out",
                })
              : gsap.to(o.querySelector("span"), {
                  opacity: 1,
                  duration: 1.3,
                  ease: "power3.out",
                });
          },
        },
      })
      .to(e, { y: -700 }, "<+=0.00")
      .to(o, { y: -310, opacity: 0 }, "<+=0.00")
      .from(n.querySelector("h1"), { opacity: 0 }, "<+=0.00")
      .from(n.querySelector("h1 span"), { yPercent: 50 }, "<+=0.00")
      .to(
        l,
        {
          fov: 150,
          onUpdate: function () {
            l.updateProjectionMatrix();
          },
        },
        "<+=0.00"
      )
      .to(l.position, { z: 50 }, "<+=0.00")
      .to(l.rotation, { y: 0.13 * Math.PI, z: 0.7 * Math.PI }, "<+=0.00")
      .to(S.rotation, { y: 2.2 * Math.PI }, "<+=0.00");


/// segundo parrafo
      gsap
      .timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: a,
          start: "0% 0%",
          end: "100% 0%",
          scrub: 5.2,

          onUpdate: function (e) {
            e.progress > 0.031
              ? gsap.to(o.querySelector("span"), {
                  opacity: 0,
                  duration: 1.3,
                  ease: "power3.out",
                })
              : gsap.to(o.querySelector("span"), {
                  opacity: 1,
                  duration: 1.3,
                  ease: "power3.out",
                });
          },
        },
      })
      .to(e, { y: -700 }, "<+=0.00")
      .to(o, { y: -310, opacity: 0 }, "<+=0.00")
      .from(nn.querySelector("h1"), { opacity: 0 }, "<+=0.00")
      .from(nn.querySelector("h1 span"), { yPercent: 50 }, "<+=0.00")

  const T = new THREE.Group();
  T.add(l),
    c.add(T),
    window.addEventListener("mousemove", function (e) {
      let t = window.innerWidth,
        o = e.clientX,
        a = t / 2 - o;
      a < 0 && (a *= -1),
        (iiXÆAX =
          ((XÆAXii = t / 2 - 0),
          (iXÆAXi = 1),
          Number((((t / 2 - o - 0) * iXÆAXi) / XÆAXii + 0).toFixed(4)))),
        (XiiXÆA =
          ((XÆAXii = t / 2 - 0),
          (iXÆAXi = 1),
          Number((((a - 0) * iXÆAXi) / XÆAXii + 0).toFixed(4)))),
        gsap
          .timeline({
            defaults: {
              duration: 1.3,
              ease: "power3.out",
              stagger: { from: "end", amount: 0.7 },
            },
          })
          .to(m.rotation, { y: (Math.PI * iiXÆAX) / -3 }, "<+=0.00")
          .to(T.rotation, { y: (Math.PI * iiXÆAX) / -13 }, "<+=0.00");
    });
}
window.onload = () => {
  App(), gsap.to("body", { opacity: 1, duration: 0.5 });
};
function animate() {
  // Rotar el objeto

  object.rotation.y += 0.005;

  // Solicitar el próximo cuadro de animación
  requestAnimationFrame(animate);
}

function isMobileDevice() {
  return /Mobi|Android/i.test(navigator.userAgent);
}

function handleScroll() {
  if (isMobileDevice()) {
      // Lógica para scroll con celular
  } else {
      // Lógica para scroll con mouse
  }
}

document.addEventListener("DOMContentLoaded", function() {
  const preloader = document.getElementById('preloader');
  const loader = document.getElementById('loader');

  // Ocultar el preloader una vez que la página esté completamente cargada
  window.addEventListener('load', function() {
      document.body.classList.add('loaded');
      preloader.style.display = 'none';
  });

  handleScroll();
});
