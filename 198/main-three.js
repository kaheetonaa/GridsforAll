import * as THREE from 'three';
import { TrackballControls } from 'three/addons/controls/TrackballControls.js';

let scene, camera, renderer, geometry, wireframe, line, material;

init();

function init() {
    scene = new THREE.Scene(); //draw scene
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000); //camera

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setAnimationLoop(animate);//set animation
    document.body.appendChild(renderer.domElement);

    geometry = new THREE.BoxGeometry(1, 1, 1);
    wireframe = new THREE.WireframeGeometry(geometry);

    
    material = new THREE.LineBasicMaterial({
        color: 0xffffff,
        linewidth: 1,
        linecap: 'round', //ignored by WebGLRenderer
        linejoin: 'round' //ignored by WebGLRenderer
    });

    line = new THREE.LineSegments(wireframe,materialline = new THREE.LineSegments(wireframe););

    scene.add(line);

    camera.position.z = 5;
    //controls = new TrackballControls(camera, renderer.domElement);

    window.addEventListener('resize', onWindowResize);

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}

function animate() {
    //controls.update();

    /* cube.rotation.x += 0.01;*/

    line.rotation.y += 0.01;

    renderer.render(scene, camera);

}