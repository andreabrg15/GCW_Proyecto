import * as THREE from 'three';

import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';

var nombreJugador2 = "";
var nombreJugador1 = "";
const socket = io();

var objArdilla = new THREE.Object3D();
var objArdilla2 = new THREE.Object3D();
var niño = new THREE.Object3D();

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



ModeloJugador1('models/ardilla/ardilla', 'ardilla', 0, 0, 5, 0.2, 180);

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



var generalVolume = 50.0;
var musicVolume = 50.0;
const scene = new THREE.Scene();

//Estas dos lineas de abajo son para que la escena cargue dentro del div elegido
const container = document.getElementById("game");
const camera = new THREE.PerspectiveCamera(60, container.offsetWidth / container.offsetHeight, 0.1, 2000);



const renderer = new THREE.WebGLRenderer();
renderer.setSize(container.offsetWidth, container.offsetHeight);
container.appendChild(renderer.domElement);


const scenario = sessionStorage.getItem("scenario");
console.log (scenario);
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
                    "nievecielo.jpg",
                    "nievecielo.jpg",
                    "nievecielo.jpg",
                    "nievecielo.jpg",
                    "nievecielo.jpg",
                    "nievecielo.jpg",
                ]);

            scene.background = backColor;

            //Plano que sera el terreno
            grass_material = new THREE.MeshPhysicalMaterial({
                map: loader.load("imgs/nievecielo.jpg"),
            });
            ground = new THREE.Mesh(
                new THREE.PlaneGeometry(100, 100),
                grass_material
            );
            ground.rotation.x = -Math.PI / 2;
            ground.position.y = -3;
            ground.visible = true;
            scene.add(ground);

            // Luz ambiental invernal (azul tenue)
            const alWinter = new THREE.AmbientLight(0x99ccff, 1.2); // Color frío, intensidad más baja
            scene.add(alWinter);

            // Luz focal invernal (azul intenso)
            const plWinter = new THREE.PointLight(0x3399ff, 4, 12, 2); // Luz fría, alcance moderado
            scene.add(plWinter);


            break;
        case "3":
            console.log("Cargando mapa 3...");
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

            grass_material = new THREE.MeshPhysicalMaterial({
                map: loader.load("imgs/grass_3.png"),
            });
            ground = new THREE.Mesh(
                new THREE.PlaneGeometry(100, 100),
                grass_material
            );
            ground.rotation.x = -Math.PI / 2;
            ground.position.y = -3;
            ground.visible = true;
            scene.add(ground);

            // Luz ambiental otoñal (amarillo cálido)
            const alAutumn = new THREE.AmbientLight(0xffcc99, 1.5); // Color cálido, intensidad moderada
            scene.add(alAutumn);

            // Luz focal otoñal (naranja)
            const plAutumn = new THREE.PointLight(0xff9900, 5, 15, 2); // Luz cálida, alcance moderado
            scene.add(plAutumn);


            break;
        default:
            console.log("Escenario desconocido.");
    }
} else {
    console.log("No hay escenario definido en sessionStorage.");
}


//Estos controles son para poder mirar alrededor, osea mover hacia donde esta viendo el jugador
const pControls = new PointerLockControls(camera, document.body);

var movementSpeed = 40.0;
var movementKid = 20.0;
var deltaTime;
renderer.setAnimationLoop(animate);
let lastTime = performance.now();

function animate() {

    let currentTime = performance.now();
    deltaTime = (currentTime - lastTime) / 1000; // En segundos
    lastTime = currentTime;
    if (deltaTime > 0.15) {
        deltaTime = 0.15;
    }
    socket.on('Iniciar', (nombre) => {

        console.log('NombreJugador:' + nombre);
        if (nombre != nombreJugador1) {
            nombreJugador2 = nombre;
        }


    });

    socket.on('Posicion', (position, nombre) => {
        console.log('NombreJugador:' + nombre + ' posicion x:' + position.x);

        if (nombre == nombreJugador1) {
            objArdilla.position.set(position.x, position.y - 3, position.z - 5);

        }

        if (nombre == nombreJugador2) {
            objArdilla2.position.set(position.x, position.y - 3, position.z - 5);
        }

    });

    pl.position.set(objArdilla.x, objArdilla.y + 2, objArdilla.z);

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


    iniciarConexion();

    const audio = new Audio('loop.ogg');
    audio.volume = 1.0; // Volumen entre 0.0 y 1.0
    audio.loop = true; // Repetir sonido
    audio.play()
        .then(() => console.log("Reproduciendo..."))
        .catch(err => console.error("Error al reproducir:", err));
    //Tengo que checar porque al conectar en tiempo real a ambos jugadores, todo se vuelve tan lento
    $(document).keypress(function (e) {

        var tecla = e.key;

        // Validar colisiones con paredes
        //
        const point = { x: camera.position.x, y: camera.position.y, z: camera.position.z }; // Coordenadas del punto
        const cube = { x: -2.5, y: -3, z: 30, width: 5, height: 5, depth: 25 };
        if (isWallColliding(point, cube)) {
            //console.log("El punto choca con el cubo. Px:" + point.x + " Pz: " + point.z);
        }
        //

        if (tecla == 'a' || tecla == 'A') {
            console.log("x: " + point.x + " y: " + point.y + " z: " + point.z);
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
        // Verificar si recoje algun objeto
        //

        //

        //Con el espacio activamos el poder mover la vista alrededor con el mouse
        //Para desactivarlo solo se presiona Esc
        if (tecla == ' ' || tecla == 'Spacebar') {
            pControls.lock();
        }

        socket.emit('Posicion', camera.position, nombreJugador1);
        console.log('Posicion niño', niño.position);

        //Niño persigue a la ardilla
        PerseguiralJugador();

        if (isColliding(-20, 1, 25, camera.position.x, camera.position.y, camera.position.z, 10, 3) || //columpios
        isColliding(25, 1, 24, camera.position.x, camera.position.y, camera.position.z, 4, 3) || //mesa
        isColliding(25, 1, -24, camera.position.x, camera.position.y, camera.position.z, 3, 3) || //arbol1
        isColliding(20, 1, -12, camera.position.x, camera.position.y, camera.position.z, 2, 3) || //arbol2
        isColliding(23, 1, -12, camera.position.x, camera.position.y, camera.position.z, 2, 3) //roca
            ) {
                console.log("¡Colisión detectada! Revirtiendo movimiento...");
                camera.position.copy(ultimaPosicion);
            }
     


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
        detectarColision(niño, objArdilla);
    }

    // Función para detectar colisiones entre el niño y la ardilla
    function detectarColision(niño, ardilla) {

        const distancia = niño.position.distanceTo(ardilla.position);

        if (distancia < 2) {
            socket.emit('perdiste', camera.position, nombreJugador1);

            perderJuego();
        }
    }

    function perderJuego() {
        document.removeEventListener('keydown', moverJugador);

        const gameOverModal = new bootstrap.Modal(document.getElementById('GameOverModal'));
        gameOverModal.show();
    }



});