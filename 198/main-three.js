import * as THREE from 'three';
import { TrackballControls } from 'three/addons/controls/TrackballControls.js';

let scene, camera, renderer, geometry, material, cube, controls;

init();

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setAnimationLoop(animate);
    document.body.appendChild(renderer.domElement);

    geometry = new THREE.BoxGeometry(1, 1, 1);
    material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    camera.position.z = 5;
    controls = new TrackballControls(camera, effect.domElement);

    window.addEventListener('resize', onWindowResize);

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
    effect.setSize(window.innerWidth, window.innerHeight);

}

function animate() {

    cube.rotation.x += 0.01;
    //cube.rotation.y += 0.01;

    renderer.render(scene, camera);

}