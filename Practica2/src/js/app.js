import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui';

import sosio from '../img/AAA.jpg';
import sosio2 from '../img/bbb.jpg';
import { Raycaster } from 'three';

// INSTANCIAMOS EL RENDERER LA ESCENA, CAMARA Y LOS CONTROLES DE CAMARA
const renderer = new THREE.WebGL1Renderer();
renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth, window.innerHeight  );
document.body.appendChild(renderer.domElement);
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)
const orbit = new OrbitControls(camera, renderer.domElement);


// CREAMOS LOS EJES DE COORDENADAS 
const axesHelper = new THREE.AxesHelper(3);
scene.add(axesHelper);


// CAMBIAMOS LA CAMARA Y ACTUALIZAMOS EL CONTROL DE LA MISMA
camera.position.set(-10,30,30);
orbit.update();

// CREACION DEL PLANO
const planeGeometry = new THREE.PlaneGeometry(30,30);
const planeMaterial = new THREE.MeshStandardMaterial({
    color: 0xFFFFFF,
    side: THREE.DoubleSide});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.receiveShadow = true;
scene.add(plane);
plane.rotation.x = -.5 * Math.PI;


const plane2geometry = new THREE.PlaneGeometry(10, 10, 10, 10)
const plane2material = new THREE.MeshBasicMaterial({
    color: 0xFFFFFF,
    wireframe: true
})
const plane2 = new THREE.Mesh(plane2geometry, plane2material);
plane2.position.set(10, 10, 15);
scene.add(plane2);




// CREACION DEL GRID
const gridHelper = new THREE.GridHelper(30,15);
scene.add(gridHelper);


// CREACION DE LA CAJA
const boxgeometry = new THREE.BoxGeometry();
const boxmaterial = new THREE.MeshBasicMaterial({color: 0x00FF00});
const box = new THREE.Mesh(boxgeometry, boxmaterial);
scene.add(box)




// CREACION DE LA ESFERA
const spheregeometry = new THREE.SphereGeometry(4, 50, 50);
const spherematerial = new THREE.MeshStandardMaterial({
    color:0x444444,
    wireframe: false
})
const sphere = new THREE.Mesh(spheregeometry, spherematerial);
scene.add(sphere);
sphere.castShadow = true;
sphere.position.set( -10, 10, 0 );
sphereId = sphere.id;

// INSTANCIAMOS UNA LUZ Y DOS HELPER, UNO DE LUZ Y OTRO DE SOMBRAS

    // AmbientLight

    // const ambienLight = new THREE.AmbientLight(0xfff000); AMARILLO
    // scene.add(ambienLight);



    // Directional Light

    // const directionalLight = new THREE.DirectionalLight(0xFFFFFF, .8);
    // scene.add(directionalLight);
    // directionalLight.position.set(-30, 50, 0);
    // directionalLight.castShadow = true;

    // const dLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5);
    // scene.add(dLightHelper);

    // const dLightShadowHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
    // scene.add(dLightShadowHelper);

    // directionalLight.shadow.camera.bottom = -12;


    // Spot Light
    const spotLight = new THREE.SpotLight(0xFFFFFF);
    spotLight.position.set(-100,100,);
    spotLight.castShadow = true;
    const sLightHelper = new THREE.SpotLightHelper(spotLight);
    scene.add(sLightHelper);
    scene.add(spotLight);


// PARA CAMBIAR EL COLOR DE FONDO
// renderer. setClearColor(0xFFEA00);

const textureLoader = new THREE.TextureLoader();
// scene.background = textureLoader.load(sosio)

const cubeTextureLoader = new THREE.CubeTextureLoader();
scene.background  = cubeTextureLoader.load([ sosio, sosio, sosio, sosio, sosio, sosio ])



// CREACION DE OTRA CAJA
const box2geometry = new THREE.BoxGeometry(4, 4, 4);
// podemos asignar un material diferente a cada cara 
const box2Multimaterial = [
    new THREE.MeshStandardMaterial({color: 0xffffff, map:textureLoader.load(sosio2)}),
    new THREE.MeshStandardMaterial({color: 0xffffff, map:textureLoader.load(sosio2)}),
    new THREE.MeshStandardMaterial({color: 0xffffff, map:textureLoader.load(sosio2)}),
    new THREE.MeshStandardMaterial({color: 0xffffff, map:textureLoader.load(sosio2)}),
    new THREE.MeshStandardMaterial({color: 0xffffff, map:textureLoader.load(sosio2)}),
    new THREE.MeshStandardMaterial({color: 0xffffff, map:textureLoader.load(sosio2)})
];
const box2 = new THREE.Mesh(box2geometry, box2Multimaterial);
box2.castShadow = true;
scene.add(box2);
box2.position.set(-2, 10, 10);
box2.name = "box2";


// INSTANCIAMOS EL CONTROL DE LA INTERFAZ
const gui = new dat.GUI();


// INSTANCIAMOS FOG (NIEBLA)
// scene.fog = new THREE.Fog(0xFFFFFF, 0, 200); EN ESTE DECLARAMOS HASTA QUE DISTANCIA QUEREMOS NO TENER NIEBLA COMPLETA
// scene.fog = new THREE.FogExp2(0xFFFFFF, 0.01) EN ESTE LA NIEBLA CRECE EXPONENCIALMENTE CON LA DISTANCIA DE LA CAMARA


// OPCIONES DE LA GUI
const options = {
    sphereColor: '#ffea00',
    wireframe:false,
    speed: 0.1,
    angle: 0.2,
    penumbra: 0,
    intensity: 1,
    rotation: 0.01
};


// AÑADIMOS UN CONTROL PARA CAMBIAR EL COLOR DE LA ESFERA
gui.addColor(options, 'sphereColor').onChange(function(e){
    sphere.material.color.set(e)
})
// AÑADIMOS UN CONTROL PARA CAMBIAR A WIREFRAME
gui.add(options, 'wireframe').onChange(function(e){
    sphere.material.wireframe = e
})
// AÑADIMOS UN CONTROL PARA CONTROLAR LA VELOCIDAD DE LA ANIMACION DE LA ESFERA
gui.add(options, 'speed', 0, 0.1)
gui.add(options, 'angle', 0, 1)
gui.add(options, 'penumbra', 0, 1)
gui.add(options, 'intensity', 0, 1)
gui.add(options, 'rotation', 0.01, 1)


let step = 0;

const mousePosition = new THREE.Vector2();
window.addEventListener('mousemove', function(e){
    mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1
    mousePosition.y = - (e.clientY / window.innerHeight) * 2 + 1 
})

const rayCaster = new THREE.Raycaster();

// CREAMOS LA FUNCION QUE CREARÁ LAS ANIMACIONES Y MOSTRARÁ TODO
function animate(){
    box.rotation.x += 0.01;
    box.rotation.y += 0.01;

    step += options.speed;
    sphere.position.y = 2 * (Math.abs(Math.sin(step)) )+ 8;
    spotLight.angle = options.angle;
    spotLight.penumbra = options.penumbra;
    spotLight.intensity = options.intensity;
    sLightHelper.update();
    
    rayCaster.setFromCamera(mousePosition, camera);
    const intersects = rayCaster.intersectObjects(scene.children);

    for(let i = 0; i < intersects.length; i++){
        if(intersects[i].object.id === sphereId){
            intersects[i].object.material.color.set(0xFF0000);
        }
        if(intersects[i].object.name === "box2"){
                box2.rotation.x += options.rotation;
    box2.rotation.y += options.rotation;
        }
    }


    plane2.geometry.attributes.position.array[0] = 3 * Math.random();
    plane2.geometry.attributes.position.array[1] = 3 * Math.random();
    plane2.geometry.attributes.position.array[2] = 3 * Math.random();
    const lastPointZ = plane2.geometry.attributes.position.array.length - 1;
    plane2.geometry.attributes.position.array[lastPointZ] = 3 * Math.random();
    plane2.geometry.attributes.position.needsUpdate = true;
    

    renderer.render(scene, camera);

    
}

// CREAMOS UN BUCLE
renderer.setAnimationLoop(animate);


