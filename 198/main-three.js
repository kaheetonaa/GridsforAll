import * as THREE from 'three';
import { LineMaterial } from 'three/addons/lines/LineMaterial.js';
import { LineSegments2 } from 'three/addons/lines/LineSegments2.js';
import { LineSegmentsGeometry } from 'three/addons/lines/LineSegmentsGeometry.js';

let scene, camera, renderer,g,feg,fm,fl,eg ;

init();

function init() {
    scene = new THREE.Scene(); //draw scene
    let cameraHeight=1;
    let screenRatio=window.innerWidth / window.innerHeight;
    camera = new THREE.OrthographicCamera(-cameraHeight*screenRatio, cameraHeight*screenRatio, cameraHeight, -cameraHeight, 1, 1000)
    camera.position.set(2, 2, 2); // Position the camera
    camera.lookAt(0, 0, 0); // Point the camera at the center of the scene

     g = new THREE.BoxGeometry(1, 1, 1);
 eg = new THREE.EdgesGeometry(g);
 feg = new LineSegmentsGeometry().fromEdgesGeometry(eg);
 fm = new LineMaterial({color: "white", linewidth: 0.01, worldUnits: true});

    fl = new LineSegments2(feg, fm);
    //wireframe = new THREE.WireframeGeometry2(geometry);


    scene.add(fl);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setAnimationLoop(animate);//set animation
    document.body.appendChild(renderer.domElement);

    window.addEventListener('resize', onWindowResize);

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}

function animate() {

    fl.rotation.y += 0.001;

    renderer.render(scene, camera);

}