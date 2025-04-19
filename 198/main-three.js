import * as THREE from 'three';

let scene, camera, renderer, geometry, wireframe, line, material;

init();

function init() {
    scene = new THREE.Scene(); //draw scene
    camera = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, 1, 1000 )

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

    line = new THREE.LineSegments(wireframe,material);

    scene.add(line);

    camera.position.z = 5;

    window.addEventListener('resize', onWindowResize);

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}

function animate() {

    line.rotation.y += 0.01;

    renderer.render(scene, camera);

}