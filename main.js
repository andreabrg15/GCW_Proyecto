import * as THREE from 'three';

import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';

var nombreJugador2="";
var nombreJugador1="";
const socket = io();

var objArdilla = new THREE.Object3D();

const manager = new THREE.LoadingManager();
manager.onStart = function ( url, itemsLoaded, itemsTotal ) {
    console.log('Starting loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');
};

manager.onLoad = function () {
    console.log('Loading complete!');
};

manager.onProgress = function ( url, itemsLoaded, itemsTotal ) {
    console.log('Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');
};

manager.onError = function ( url ) {
    console.log('There was an error loading ' + url);
};

function Modelos3D(pathModelo, name, posx, posy, posz, scale, angleY) {

    const loader = new OBJLoader(manager);
    var mtl = new MTLLoader(manager);

    mtl.load(pathModelo+'.mtl', function (materials) {
        materials.preload();
        loader.setMaterials(materials);

        loader.load(pathModelo+'.obj',
            function (object) {
                object.name = name;
                object.position.x = posx;
                object.position.y = posy;
                object.position.z = posz;
                object.scale.copy(new THREE.Vector3(scale, scale, scale));
                if (angleY != null) {
                    object.rotation.y = angleY * Math.PI / 180;
                }
                scene.add( object );
        });

        console.log(materials);
    });
}

function ModeloJugador1(pathModelo, name, posx, posy, posz, scale, angleY) {

    const loader = new OBJLoader(manager);
    var mtl = new MTLLoader(manager);

    mtl.load('http://localhost:3000/'+pathModelo+'.mtl', function (materials) {
        materials.preload();
        loader.setMaterials(materials);

        loader.load('http://localhost:3000/'+pathModelo+'.obj',
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
                scene.add( object );
        });

        console.log(materials);
    });
}

ModeloJugador1('models/ardilla/ardilla', 'ardilla', 0, 0, 5, 0.2, 180);

Modelos3D('models/arbol/arbol', 'arbol', -5, -3, -9, 1);
Modelos3D('models/banca/banca', 'banca', 5, -3, -9, 3);
Modelos3D('models/roca/roca', 'roca', -10.5, -3, -9, 2);
Modelos3D('models/arbolito/arbolito', 'arbolito', -17, -3, -9, 4);
Modelos3D('models/columpios/columpios', 'columpios', 16, -3, -9, 0.8);
Modelos3D('models/bellota/bellota', 'bellota', 26, -3, -9, 1);
Modelos3D('models/mesa/mesa', 'mesa', 35, -3, -9, 2, 90);

const scene = new THREE.Scene();

//Estas dos lineas de abajo son para que la escena cargue dentro del div elegido
const container = document.getElementById("game");
const camera = new THREE.PerspectiveCamera( 75, container.offsetWidth / container.offsetHeight, 0.1, 1000);

//Similar a un cubemap o skybox, carga las texturas del fondo
const backColor = new THREE.CubeTextureLoader().setPath("imgs/").load( [
    "back-sky.png", "back-sky.png", 
    "back-sky.png", "back-sky.png", 
    "back-sky.png", "back-sky.png"] );

scene.background = backColor;

const renderer = new THREE.WebGLRenderer();
renderer.setSize( container.offsetWidth, container.offsetHeight );
container.appendChild( renderer.domElement );

//Cubo representando al segundo jugador --PRUEBA--
const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material2 = new THREE.MeshPhongMaterial( { color: 0x00ffff} );
const cube2 = new THREE.Mesh( geometry, material2 );
cube2.position.z= -3;
scene.add(cube2);

//Plano que sera el terreno
const loader = new THREE.TextureLoader();
const grass_material = new THREE.MeshPhysicalMaterial({ map: loader.load('imgs/grass_2.png') });
const ground = new THREE.Mesh(new THREE.PlaneGeometry(100, 100), grass_material);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -3;
ground.visible = true;
scene.add( ground );

const al = new THREE.AmbientLight( 0xffffff, 5 ); //Luz ambiental suave BLANCA
scene.add( al );

const dl = new THREE.DirectionalLight( 0xffffff, 1 ); //Luz direccional
dl.position.set(0, 5, 0);
scene.add( dl );

//Estos controles son para poder mirar alrededor, osea mover hacia donde esta viendo el jugador
const pControls = new PointerLockControls(camera, document.body);

var movementSpeed = 0.5;

renderer.setAnimationLoop( animate );

function animate() {

    socket.on('Iniciar', (nombre) => {
      
        console.log('NombreJugador:'+nombre);
        if(nombre != nombreJugador1){
          nombreJugador2 = nombre;
        }
        
  
    });

    socket.on('Posicion', (position,nombre) => {
        console.log('NombreJugador:'+nombre+' posicion x:'+position.x);
  
        if(nombre == nombreJugador1){
          objArdilla.position.set(position.x,position.y-3,position.z-5);
  
        }
        
        if(nombre == nombreJugador2){
          cube2.position.set(position.x,position.y-3,position.z-5);
        }
        
    });

    renderer.render( scene, camera );
}

$(document).ready(function() {

    $("#idBoton").click(iniciarConexion);

    //Tengo que checar porque al conectar en tiempo real a ambos jugadores, todo se vuelve tan lento
    $(document).keypress(function(e){

        var tecla = e.key;

        if( tecla == 'a' || tecla == 'A') {
            camera.translateX(-movementSpeed);
        }

        if( tecla == 'd' || tecla == 'D') {
            camera.translateX(movementSpeed);
        }

        if( tecla == 's' || tecla == 'S') {
            camera.translateZ(movementSpeed);
        }

        if( tecla == 'w' || tecla == 'W') {
            camera.translateZ(-movementSpeed);
        }

        //Con el espacio activamos el poder mover la vista alrededor con el mouse
        //Para desactivarlo solo se presiona Esc
        if( tecla == ' ' || tecla == 'Spacebar' ) {
            pControls.lock();
        }

        socket.emit('Posicion',camera.position,nombreJugador1);
    });

    function iniciarConexion(){

        nombreJugador1=$("#idNombreJugador").val();
        socket.emit('Iniciar',nombreJugador1);
    
      };
    
 });