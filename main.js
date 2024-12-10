import * as THREE from 'three';
 
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
 
var nombreJugador2 = "";
var nombreJugador1 = "";
const socket = io();
 
const rotationSpeed = 0.09; // Velocidad de rotación de la camara
 
 
var objArdilla = new THREE.Object3D();
var objArdilla2 = new THREE.Object3D();
var niño = new THREE.Object3D();
let boxNiño = new THREE.Box3().setFromObject(niño);
let boxArdilla = new THREE.Box3().setFromObject(objArdilla);
const players = sessionStorage.getItem('players');
const difficulty = sessionStorage.getItem('mode');
const cajasDeColision = [];
var cajasDeColisionBellotas = [];
 
var puntuacion = 0;
 
const manager = new THREE.LoadingManager();
manager.onStart = function (url, itemsLoaded, itemsTotal) {
  console.log('Starting loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');
};
 
manager.onLoad = function () {
  console.log('Loading complete!');
};
 
manager.onProgress = function (url, itemsLoaded, itemsTotal) {
  console.log('Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');
};
 
manager.onError = function (url) {
  console.log('There was an error loading ' + url);
};
 
function Modelos3D(pathModelo, name, posx, posy, posz, scale, angleY) {
  const loader = new OBJLoader(manager);
  var mtl = new MTLLoader(manager);
  mtl.load(pathModelo + '.mtl', function (materials) {
    materials.preload();
    loader.setMaterials(materials);
 
    loader.load(pathModelo + '.obj',
      function (object) {
        object.name = name;
        object.position.x = posx;
        object.position.y = posy;
        object.position.z = posz;
        object.scale.copy(new THREE.Vector3(scale, scale, scale));
        if (angleY != null) {
          object.rotation.y = angleY * Math.PI / 180;
        }
        scene.add(object);
      });
 
    console.log(materials);
  });
}
 
function ModeloJugador1(pathModelo, name, posx, posy, posz, scale, angleY) {
 
  const loader = new OBJLoader(manager);
  var mtl = new MTLLoader(manager);
 
  mtl.load('http://localhost:3000/' + pathModelo + '.mtl', function (materials) {
    materials.preload();
    loader.setMaterials(materials);
 
    loader.load('http://localhost:3000/' + pathModelo + '.obj',
      function (object) {
 
        objArdilla = object;
        object.name = name;
        object.position.x = 12;
        object.position.y = 0;
        object.position.z = 12;
        object.scale.copy(new THREE.Vector3(scale, scale, scale));
        if (angleY != null) {
          object.rotation.y = angleY * Math.PI / 180;
        }
        scene.add(object);
      });
    console.log(materials);
  });
}
 
function ModeloJugador2(pathModelo, name, posx, posy, posz, scale, angleY) {
 
  const loader = new OBJLoader(manager);
  var mtl = new MTLLoader(manager);
 
  mtl.load('http://localhost:3000/' + pathModelo + '.mtl', function (materials) {
    materials.preload();
    loader.setMaterials(materials);
 
    loader.load('http://localhost:3000/' + pathModelo + '.obj',
      function (object) {
 
        objArdilla2 = object;
        object.name = name;
        object.position.x = posx;
        object.position.y = posy;
        object.position.z = posz;
        object.scale.copy(new THREE.Vector3(scale, scale, scale));
        if (angleY != null) {
          object.rotation.y = angleY * Math.PI / 180;
        }
        scene.add(object);
      });
 
    console.log(materials);
  });
}
 
function ModeloNiño(pathModelo, name, posx, posy, posz, scale, angleY) {
 
  const loader = new OBJLoader(manager);
  var mtl = new MTLLoader(manager);
 
  mtl.load('http://localhost:3000/' + pathModelo + '.mtl', function (materials) {
    materials.preload();
    loader.setMaterials(materials);
 
    loader.load('http://localhost:3000/' + pathModelo + '.obj',
      function (object) {
 
        niño = object;
        object.name = name;
        object.position.x = posx;
        object.position.y = posy;
        object.position.z = posz;
        object.scale.copy(new THREE.Vector3(scale, scale, scale));
        if (angleY != null) {
          object.rotation.y = angleY * Math.PI / 180;
        }
        scene.add(object);
      });
 
    console.log(materials);
  });
}
 
function CajasDeColisiones(escala, posicion) {
  const geometria = new THREE.BoxGeometry(escala.x, escala.y, escala.z);
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const cubo = new THREE.Mesh(geometria, material);
 
  cubo.position.set(posicion.x, posicion.y, posicion.z);
 
  scene.add(cubo);
  cubo.visible = false;
  const boundingBox = new THREE.Box3().setFromObject(cubo);
  // const boxHelper = new THREE.BoxHelper(cubo, 0xff0000);
  // boxHelper.update();
 
  cubo.boundingBox = boundingBox;
  // cubo.boxHelper = boxHelper;
 
  // scene.add(boxHelper);
 
  cajasDeColision.push(cubo);
 
}
 
function bellotas(name, posx, posy, posz, scale){
  const loader = new OBJLoader(manager);
  var mtl = new MTLLoader(manager);
  mtl.load("models/bellota/bellota" + '.mtl', function (materials) {
    materials.preload();
    loader.setMaterials(materials);
 
    loader.load("models/bellota/bellota" + '.obj',
      function (object) {
        object.name = name;
        object.position.x = posx;
        object.position.y = posy;
        object.position.z = posz;
        object.scale.copy(new THREE.Vector3(scale, scale, scale));
        scene.add(object);
 
        const boundingBox = new THREE.Box3().setFromObject(object);
        // const boxHelper = new THREE.BoxHelper(object, 0xff0000);
        // boxHelper.update();
     
        object.boundingBox = boundingBox;
        // object.boxHelper = boxHelper;
     
        // scene.add(boxHelper);
     
        cajasDeColisionBellotas.push(object);
      });
 
    console.log(materials);
  });
}
 
ModeloJugador1('models/ardilla/ardilla', 'ardilla', 0, 0, 5, 0.2, 180);
 
if(players == '2') 
ModeloJugador2('models/ardilla2/ardilla', 'ardilla2', 0, 0, 5, 0.2, 180);
 
//Niño que persigue a la ardilla (el jugador)
ModeloNiño('models/niño/niño', 'niño', 10, -3, -10, 0.02);
 
Modelos3D('models/1st/1st', '1st', 25, -3, 25, 2);
Modelos3D('models/2nd/2nd', '2nd', -25, -3, 25, 2);
Modelos3D('models/3rd/3rd', '3rd', -25, -3, -25, 2);
Modelos3D('models/4th/4th', '4rd', 25, -3, -25, 2);
Modelos3D('models/wall/wall', 'wall1', 0, -3, 40, 2, 90);
Modelos3D('models/wall/wall', 'wall2', 0, -3, 12, 2, 90);
Modelos3D('models/wall/wall', 'wall3', 40, -3, 0, 2);
Modelos3D('models/wall/wall', 'wall4', 12, -3, 0, 2);
Modelos3D('models/wall/wall', 'wall1', 0, -3, -40, 2, 90);
Modelos3D('models/wall/wall', 'wall2', 0, -3, -12, 2, 90);
Modelos3D('models/wall/wall', 'wall3', -40, -3, 0, 2);
Modelos3D('models/wall/wall', 'wall4', -12, -3, 0, 2);
 
bellotas("bellota2", 5, -1.8, 5, 0.5);
bellotas("bellota3", 31, -1.8, 26, 0.5);
bellotas("bellota4", 31, -1.8, 34, 0.5);
bellotas("bellota5", 31, -1.8, 18, 0.5);
bellotas("bellota6", 18, -1.8, 18, 0.5);
bellotas("bellota7", 18, -1.8, 26, 0.5);
bellotas("bellota8", 18, -1.8, 34, 0.5);
 
bellotas("bellota9", -28, -1.8, 22, 0.5);
bellotas("bellota10", -22, -1.8, 22, 0.5);
 
bellotas("bellota11", -22, -1.8, -10, 0.5);
 
bellotas("bellota12", 22, -1.8, -10, 0.5);
 
bellotas("bellota13", 25, -1.8, 18, 0.5);
 
 
var generalVolume = 100.0;
var musicVolume = 100.0;
const scene = new THREE.Scene();
 
//Estas dos lineas de abajo son para que la escena cargue dentro del div elegido
const container = document.getElementById("game");
const camera = new THREE.PerspectiveCamera(60, container.offsetWidth / container.offsetHeight, 0.1, 2000);
 
 
const howManyPlayers = sessionStorage.getItem("players");
if (howManyPlayers == "1") {
  camera.position.set(12, 0, 15);
}
else if (howManyPlayers == "2") {
  // CAMARA DESDE ARRIBA
  camera.position.set(0, 100, 0);
  camera.lookAt(0, 0, 0);
}
else {
  console.log("error, falta escoger cuantos jugadores seran");
}
 
const renderer = new THREE.WebGLRenderer();
renderer.setSize(container.offsetWidth, container.offsetHeight);
container.appendChild(renderer.domElement);
 
const scenario = sessionStorage.getItem("scenario");
var backColor;
const loader = new THREE.TextureLoader();
var grass_material;
var ground;
var al;
var pl;
if (scenario) {
  switch (scenario) {
    case "1":
      console.log("Cargando mapa 1...");
      //Similar a un cubemap o skybox, carga las texturas del fondo
      backColor = new THREE.CubeTextureLoader()
        .setPath("imgs/")
        .load([
          "back-sky.png",
          "back-sky.png",
          "back-sky.png",
          "back-sky.png",
          "back-sky.png",
          "back-sky.png",
        ]);
 
      scene.background = backColor;
 
      //Plano que sera el terreno
 
      grass_material = new THREE.MeshPhysicalMaterial({
        map: loader.load("imgs/grass_2.png"),
      });
      ground = new THREE.Mesh(
        new THREE.PlaneGeometry(100, 100),
        grass_material
      );
      ground.rotation.x = -Math.PI / 2;
      ground.position.y = -3;
      ground.visible = true;
      scene.add(ground);
 
      al = new THREE.AmbientLight(0xffffff, 2); //Luz ambiental suave BLANCA
      scene.add(al);
 
      pl = new THREE.PointLight(0xffffff, 10, 10, 2); //Luz focal al jugador
      scene.add(pl);
 
      break;
    case "2":
      console.log("Cargando mapa 2...");
      //Similar a un cubemap o skybox, carga las texturas del fondo
      backColor = new THREE.CubeTextureLoader()
        .setPath("imgs/")
        .load([
          "otoñocielo.jpg",
          "otoñocielo.jpg",
          "otoñocielo.jpg",
          "otoñocielo.jpg",
          "otoñocielo.jpg",
          "otoñocielo.jpg",
        ]);
 
      scene.background = backColor;
 
      //Plano que sera el terreno
      grass_material = new THREE.MeshPhysicalMaterial({
        map: loader.load("imgs/otoñoarbusto.jpg"),
      });
      ground = new THREE.Mesh(
        new THREE.PlaneGeometry(100, 100),
        grass_material
      );
      ground.rotation.x = -Math.PI / 2;
      ground.position.y = -3;
      ground.visible = true;
      scene.add(ground);
 
      al = new THREE.AmbientLight(0xffffff, 2); //Luz ambiental suave BLANCA
      scene.add(al);
 
      pl = new THREE.PointLight(0xffffff, 10, 10, 2); //Luz focal al jugador
      scene.add(pl);
 
      break;
    case "3":
      console.log("Cargando mapa 3...");
      //Similar a un cubemap o skybox, carga las texturas del fondo
      backColor = new THREE.CubeTextureLoader()
        .setPath("imgs/")
        .load([
          "nievecielo.jpg",
          "nievecielo.jpg",
          "nievecielo.jpg",
          "nievecielo.jpg",
          "nievecielo.jpg",
          "nievecielo.jpg",
        ]);
 
      scene.background = backColor;
 
      grass_material = new THREE.MeshPhysicalMaterial({
        map: loader.load("imgs/nievearbusto.jpg"),
      });
      ground = new THREE.Mesh(
        new THREE.PlaneGeometry(100, 100),
        grass_material
      );
      ground.rotation.x = -Math.PI / 2;
      ground.position.y = -3;
      ground.visible = true;
      scene.add(ground);
 
      al = new THREE.AmbientLight(0xffffff, 2); //Luz ambiental suave BLANCA
      scene.add(al);
 
      pl = new THREE.PointLight(0xffffff, 10, 10, 2); //Luz focal al jugador
      scene.add(pl);
      break;
    default:
      console.log("Escenario desconocido.");
      backColor = new THREE.CubeTextureLoader()
        .setPath("imgs/")
        .load([
          "nievecielo.jpg",
          "nievecielo.jpg",
          "nievecielo.jpg",
          "nievecielo.jpg",
          "nievecielo.jpg",
          "nievecielo.jpg",
        ]);
 
      scene.background = backColor;
 
      grass_material = new THREE.MeshPhysicalMaterial({
        map: loader.load("imgs/nievearbusto.jpg"),
      });
      ground = new THREE.Mesh(
        new THREE.PlaneGeometry(100, 100),
        grass_material
      );
      ground.rotation.x = -Math.PI / 2;
      ground.position.y = -3;
      ground.visible = true;
      scene.add(ground);
 
      al = new THREE.AmbientLight(0xffffff, 2); //Luz ambiental suave BLANCA
      scene.add(al);
 
      pl = new THREE.PointLight(0xffffff, 10, 10, 2); //Luz focal al jugador
      scene.add(pl);
  }
} else {
  console.log("No hay escenario definido en sessionStorage.");
 
  console.log("Cargando mapa 1...");
  //Similar a un cubemap o skybox, carga las texturas del fondo
  backColor = new THREE.CubeTextureLoader()
    .setPath("imgs/")
    .load([
      "back-sky.png",
      "back-sky.png",
      "back-sky.png",
      "back-sky.png",
      "back-sky.png",
      "back-sky.png",
    ]);
 
  scene.background = backColor;
 
  //Plano que sera el terreno
 
  grass_material = new THREE.MeshPhysicalMaterial({
    map: loader.load("imgs/grass_2.png"),
  });
  ground = new THREE.Mesh(
    new THREE.PlaneGeometry(100, 100),
    grass_material
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -3;
  ground.visible = true;
  scene.add(ground);
 
  al = new THREE.AmbientLight(0xffffff, 2); //Luz ambiental suave BLANCA
  scene.add(al);
 
  pl = new THREE.PointLight(0xffffff, 10, 10, 2); //Luz focal al jugador
  scene.add(pl);
}
 
//Estos controles son para poder mirar alrededor, osea mover hacia donde esta viendo el jugador
const pControls = new PointerLockControls(camera, document.body);
 
var movementSpeed = 0;
var movementKid = 0;
const dificultad = sessionStorage.getItem("mode");
if (dificultad == "easy") {
  var movementSpeed = 40.0;
  var movementKid = 18.0;
}
else if (dificultad == "hard") {
  var movementSpeed = 40.0;
  var movementKid = 27.0;
}
else {
  console.log("error. falta escoger el modo de juego")
}
const movimientoPocision = 2;
 
var deltaTime;
renderer.setAnimationLoop(animate);
let lastTime = performance.now();
 
 
CajasDeColisiones(new THREE.Vector3(3, 10, 100), new THREE.Vector3(52, 0, 0)); //pared derecha
CajasDeColisiones(new THREE.Vector3(3, 10, 100), new THREE.Vector3(-52, 0, 0)); //pared izquierda
CajasDeColisiones(new THREE.Vector3(110, 10, 3), new THREE.Vector3(0, 0, 52)); //pared abajo
CajasDeColisiones(new THREE.Vector3(110, 10, 3), new THREE.Vector3(0, 0, -52)); //pared arriba
 
CajasDeColisiones(new THREE.Vector3(3.5, 6, 20), new THREE.Vector3(0, 0, 12)); //arbusto 1
CajasDeColisiones(new THREE.Vector3(3.5, 6, 20), new THREE.Vector3(0, 0, -12)); //arbusto 2
CajasDeColisiones(new THREE.Vector3(3.5, 6, 20), new THREE.Vector3(0, 0, -39.2)); //arbusto
CajasDeColisiones(new THREE.Vector3(3.5, 6, 20), new THREE.Vector3(0, 0, 40)); //arbusto
CajasDeColisiones(new THREE.Vector3(20, 6, 3.5), new THREE.Vector3(12, 0, 0)); //arbusto 3
CajasDeColisiones(new THREE.Vector3(20, 6, 3.5), new THREE.Vector3(-12, 0, 0)); //arbusto 6
CajasDeColisiones(new THREE.Vector3(20, 6, 3.5), new THREE.Vector3(39.9, 0, 0)); //arbusto derecha
CajasDeColisiones(new THREE.Vector3(20, 6, 3.5), new THREE.Vector3(-39.9, 0, 0)); //arbusto izquierda
CajasDeColisiones(new THREE.Vector3(4, 6, 20), new THREE.Vector3(37, 0, 25)); //arbusto
CajasDeColisiones(new THREE.Vector3(4, 6, 20), new THREE.Vector3(13, 0, 25)); //arbusto
CajasDeColisiones(new THREE.Vector3(20, 6, 4), new THREE.Vector3(-25, 0, 37)); //arbusto
CajasDeColisiones(new THREE.Vector3(20, 6, 3.5), new THREE.Vector3(-25, 0, 13)); //arbusto
CajasDeColisiones(new THREE.Vector3(8, 6, 20), new THREE.Vector3(-25, 0, -25)); //arbusto
CajasDeColisiones(new THREE.Vector3(20, 6, 4), new THREE.Vector3(25, 0, -36)); //arbusto
 
CajasDeColisiones(new THREE.Vector3(1, 10, 6), new THREE.Vector3(-33.5, 1, 25)); //columpios
CajasDeColisiones(new THREE.Vector3(1, 10, 6), new THREE.Vector3(-16.5, 1, 25)); //columpios
CajasDeColisiones(new THREE.Vector3(2.5, 10, 1), new THREE.Vector3(-29, 1, 25)); //columpios
CajasDeColisiones(new THREE.Vector3(2.5, 10, 1), new THREE.Vector3(-21, 1, 25)); //columpios
CajasDeColisiones(new THREE.Vector3(8, 12, 7.8), new THREE.Vector3(25, 1, 25)); // MESA
CajasDeColisiones(new THREE.Vector3(2, 40, 2), new THREE.Vector3(25, 1, -25)); //arbol1
CajasDeColisiones(new THREE.Vector3(1, 40, 1), new THREE.Vector3(22, 1, -13.6)); //arbol2
CajasDeColisiones(new THREE.Vector3(5, 40, 2), new THREE.Vector3(26, 1, -15)); //roca
CajasDeColisiones(new THREE.Vector3(2, 40, 5.5), new THREE.Vector3(29, 1, -25)); //BANCA
 
function orbitarArdilla(cameraPositionX, cameraPositionY, cameraPositionZ, cameraRotationY) {
  const distancia = -5;
  const anguloY = cameraRotationY;
 
  const offsetX = Math.sin(anguloY) * distancia;
  const offsetZ = Math.cos(anguloY) * distancia;
 
  objArdilla.position.set(
    cameraPositionX + offsetX,
    objArdilla.position.y,
    cameraPositionZ + offsetZ
  );
 
  const direccionOpuesta = new THREE.Vector3(
    cameraPositionX - offsetX,
    cameraPositionY,
    cameraPositionZ - offsetZ
  );
 
  objArdilla.lookAt(direccionOpuesta);
}
 
function actualizarBoundingBoxes() {
  boxNiño.setFromObject(niño);
  boxArdilla.setFromObject(objArdilla);
}
 
 
function animate() {
 
  let currentTime = performance.now();
  deltaTime = (currentTime - lastTime) / 1000; // En segundos
  lastTime = currentTime;
  if (deltaTime > 0.15) {
    deltaTime = 0.15;
  }
  // socket.on('Iniciar', (nombre) => {
 
  //   // console.log('NombreJugador:'+nombre);
  //   if (nombre != nombreJugador1) {
  //     nombreJugador2 = nombre;
  //   }
  //   socket.on('Iniciar', (nombre) => {
     
  //       console.log('NombreJugador:'+nombre);
  //       if(nombre != nombreJugador1){
  //         nombreJugador2 = nombre;
  //       }
       
 
  if (howManyPlayers == "1") {
    socket.on('Posicion', (position, nombre, rotation) => {
      // console.log('NombreJugador:'+nombre+' posicion x:'+position.x+'Rotacion:'+rotation);
      if (nombre == nombreJugador1) {
        objArdilla.position.set(position.x, position.y - 3, position.z - 5);
        orbitarArdilla(position.x, position.y, position.z, camera.rotation.y);
        //orbitarArdilla(camera.position.x, camera.position.y, camera.position.z, camera.rotation.y);
      }
 
    // socket.on('Posicion', (position,nombre) => {
    //     console.log('NombreJugador:'+nombre+' posicion x:'+position.x);
    //     if(nombre == nombreJugador1){
    //       objArdilla.position.set(position.x,position.y-3,position.z-5);
 
    });

    if(players == '1') 
    objArdilla.position.set(camera.position.x,camera.position.y-3,camera.position.z-5);

    if(pl)
    pl.position.set(objArdilla.x, objArdilla.y + 2, objArdilla.z);
  }
  // else if(howManyPlayers == "2"){
 
  // }
 
  actualizarBoundingBoxes();
 
  if (boxNiño.intersectsBox(boxArdilla)) {
    const gameOverModal = new bootstrap.Modal(document.getElementById('GameOverModal'));
    gameOverModal.show();
  }
 
  if (puntuacion == 9) {
    const winModal = new bootstrap.Modal(document.getElementById('WinModal'));
    winModal.show();
  }
  //else {
  //     console.log("No hay colisión.");
  // }
if(howManyPlayers == "2"){
  for (const caja of cajasDeColisionBellotas) {
    const isCollidingArdilla = caja.boundingBox.containsPoint(objArdilla.position);
 
    if (isCollidingArdilla) {
      scene.remove(caja);
      cajasDeColisionBellotas = cajasDeColisionBellotas.filter(item => item !== caja);
      puntuacion += 1;
      console.log(puntuacion);
    }
  }
}
  else if (howManyPlayers == "1"){
    for (const caja of cajasDeColisionBellotas) {
      const isCollidingArdilla = caja.boundingBox.containsPoint(camera.position);
 
      if (isCollidingArdilla) {
        scene.remove(caja);
        cajasDeColisionBellotas = cajasDeColisionBellotas.filter(item => item !== caja);
        puntuacion += 1;
        console.log(puntuacion);
      }
    }
  }
 
  if (niño && howManyPlayers == "1") {
    const targetPosition = new THREE.Vector3(
      objArdilla.position.x,
      niño.position.y,
      objArdilla.position.z
    );
    niño.lookAt(targetPosition);
 
    const speed = 0.02;
    const direction = new THREE.Vector3();
    direction.subVectors(targetPosition, niño.position).normalize();
 
    direction.y = 0;
 
    niño.position.add(direction.multiplyScalar(speed));
  }
 
 
  renderer.render(scene, camera);
}
 
function isColliding(obj1_x, obj1_y, obj1_z, obj2_x, obj2_y, obj2_z, obj1_radius, obj2_radius) {
  let distance = Math.sqrt(Math.pow(obj2_x - obj1_x, 2) + Math.pow(obj2_y - obj1_y, 2) + Math.pow(obj2_z - obj1_z, 2));
  return (distance < (obj1_radius + obj2_radius));
}
 
function isWallColliding(point, cube) {
  const { x: px, y: py, z: pz } = point;
  const { x: cx, y: cy, z: cz, width, height, depth } = cube;
 
  // Verificar si el punto está dentro de los límites del cubo
  const inX = px >= cx && px <= cx + width;
  const inY = py >= cy && py <= cy + height;
  const inZ = pz >= cz && pz <= cz + depth;
 
  // Si el punto está dentro de todas las dimensiones, hay colisión
  return inX && inY && inZ;
}
 
 
$(document).ready(function () {
  const sliders = [
    { slider: "id-range-general", output: "id-general" },
    { slider: "id-range-music", output: "id-music" },
    { slider: "id-range-enemys", output: "id-enemys" }
  ];
 
  sliders.forEach(({ slider, output }) => {
    const sliderElem = document.getElementById(slider);
    const outputElem = document.getElementById(output);
 
    // Mostrar valor inicial
    outputElem.innerHTML = sliderElem.value;
 
    // Actualizar valor en cada input
    sliderElem.oninput = function () {
      if (slider === "id-range-general") {
        generalVolume = parseFloat(this.value) / 100;
      }
      if (slider === "id-range-music") {
        musicVolume = parseFloat(this.value) / 100;
      }
      outputElem.innerHTML = this.value;
      this.style.setProperty('--value', this.value + '%');
      audio.volume = (1.0 * musicVolume) * generalVolume;
    };
 
    // Inicializar el color del camino recorrido
    sliderElem.dispatchEvent(new Event('input'));
  });
 
    if(players == '2') 
    iniciarConexion();
 
  const audio = new Audio('loop.ogg');
  audio.volume = 1.0; // Volumen entre 0.0 y 1.0
  audio.loop = true; // Repetir sonido
  audio.play()
    .then(() => console.log("Reproduciendo..."))
    .catch(err => console.error("Error al reproducir:", err));
  //Tengo que checar porque al conectar en tiempo real a ambos jugadores, todo se vuelve tan lento
  $(document).keydown(function (e) {
 
    const tecla = e.key;
 
 
 
    if (howManyPlayers == "1") {
 
      let ultimaPosicion = camera.position.clone();
      if (tecla == 'a' || tecla == 'A') {
        // console.log("x: " + point.x + " y: " + point.y + " z: " + point.z);
        camera.translateX(-movementSpeed * deltaTime);
      }
 
      if (tecla == 'd' || tecla == 'D') {
        camera.translateX(movementSpeed * deltaTime);
      }
 
      if (tecla == 's' || tecla == 'S') {
        camera.translateZ(movementSpeed * deltaTime);
      }
 
      if (tecla == 'w' || tecla == 'W') {
        camera.translateZ(-movementSpeed * deltaTime);
      }
      if (tecla === "ArrowLeft") {
        camera.rotation.y += rotationSpeed; // Rotar hacia la izquierda
      } if (tecla === "ArrowRight") {
        camera.rotation.y -= rotationSpeed; // Rotar hacia la derecha
      }
 
        if(players == '2') 
        socket.emit('Posicion',camera.position,nombreJugador1);
 
      //
 
      //Con el espacio activamos el poder mover la vista alrededor con el mouse
      //Para desactivarlo solo se presiona Esc
      if (tecla == ' ' || tecla == 'Spacebar') {
        pControls.lock();
      }
 
      socket.emit('Posicion', camera.position, nombreJugador1, camera.rotation.y);
 
      ////////////////// COLISIONES MUNDO ////////////////////
      const playerPosition = new THREE.Vector3(camera.position.x, camera.position.y - 3, camera.position.z);
      for (const caja of cajasDeColision) {
        const isColliding = caja.boundingBox.containsPoint(playerPosition);
 
        if (isColliding) {
          camera.position.copy(ultimaPosicion);
        }
      }
    }
    else if (howManyPlayers == "2") {
 
      let ultimaPosicionArdilla = objArdilla.position.clone();
      let ultimaPosicionNiño = niño.position.clone();
 
      if (tecla == 'a' || tecla == 'A') {
        objArdilla.position.x = objArdilla.position.x - 1;
        objArdilla.rotation.y = THREE.MathUtils.degToRad(-90);
      }
 
      if (tecla == 'd' || tecla == 'D') {
        objArdilla.position.x = objArdilla.position.x + 1;
        objArdilla.rotation.y = THREE.MathUtils.degToRad(90);
      }
 
      if (tecla == 's' || tecla == 'S') {
        objArdilla.position.z = objArdilla.position.z + 1;
        objArdilla.rotation.y = THREE.MathUtils.degToRad(0);
      }
 
      if (tecla == 'w' || tecla == 'W') {
        objArdilla.position.z = objArdilla.position.z - 1;
        objArdilla.rotation.y = THREE.MathUtils.degToRad(180);
      }
 
 
      // Movimiento y rotación del niño (niño)
      if (tecla === "ArrowLeft") {
        niño.position.x = niño.position.x - 1;
        niño.rotation.y = THREE.MathUtils.degToRad(-90);
      }
 
      if (tecla === "ArrowRight") {
        niño.position.x = niño.position.x + 1;
        niño.rotation.y = THREE.MathUtils.degToRad(90);
      }
 
      if (tecla === "ArrowUp") {
        niño.position.z = niño.position.z - 1;
        niño.rotation.y = THREE.MathUtils.degToRad(180);
      }
 
      if (tecla === "ArrowDown") {
        niño.position.z = niño.position.z + 1;
        niño.rotation.y = THREE.MathUtils.degToRad(0);
      }
 
 
      // Verificar si recoje algun objeto
      //
 
      //
 
      //Con el espacio activamos el poder mover la vista alrededor con el mouse
      //Para desactivarlo solo se presiona Esc
      if (tecla == ' ' || tecla == 'Spacebar') {
        pControls.lock();
      }
 
      for (const caja of cajasDeColision) {
        const isCollidingArdilla = caja.boundingBox.containsPoint(objArdilla.position);
        const isCollidingNiño = caja.boundingBox.containsPoint(niño.position);
 
        if (isCollidingArdilla) {
          objArdilla.position.copy(ultimaPosicionArdilla);
        }
        if (isCollidingNiño) {
          niño.position.copy(ultimaPosicionNiño);
        }
      }
 
    }
 
    //Niño persigue a la ardilla
    // PerseguiralJugador();
 
    // // Validar colisiones con paredes
    // //
    // const point = { x: camera.position.x, y: camera.position.y, z: camera.position.z }; // Coordenadas del punto
    // const cube = { x: -2.5, y: -3, z: 30, width: 5, height: 5, depth: 25};
    // if (isWallColliding(point, cube)) {
    //     //console.log("El punto choca con el cubo. Px:" + point.x + " Pz: " + point.z);
    //     camera.position.copy(ultimaPosicion);
    // }
  });
 
  function iniciarConexion() {
 
    nombreJugador1 = sessionStorage.getItem('nombreUsuario');
    socket.emit('Iniciar', nombreJugador1);
 
  };
 
  function PerseguiralJugador() {
    if (niño.position.x > objArdilla.position.x) {
      niño.translateX(-movementKid * deltaTime);
    }
 
    if (niño.position.x < objArdilla.position.x) {
      niño.translateX(movementKid * deltaTime);
    }
 
    if (niño.position.z > objArdilla.position.z) {
      niño.translateZ(-movementKid * deltaTime);
    }
 
    if (niño.position.z < objArdilla.position.z) {
      niño.translateZ(movementKid * deltaTime);
    }
  }
 
 
 
});
 