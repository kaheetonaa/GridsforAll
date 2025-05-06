import * as THREE from 'three';
import { LineMaterial } from 'three/addons/lines/LineMaterial.js';
import { LineSegments2 } from 'three/addons/lines/LineSegments2.js';
import { LineSegmentsGeometry } from 'three/addons/lines/LineSegmentsGeometry.js';
import {OBJLoader} from 'three/addons/loaders/OBJLoader.js';
import {MTLLoader} from 'three/addons/loaders/MTLLoader.js';
let scene, camera, renderer,g,feg,fm,fl,eg,directionalLight;

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
 fm = new LineMaterial({color: "white",linewidth:1});

    fl = new LineSegments2(feg, fm);
    //wireframe = new THREE.WireframeGeometry2(geometry);


    scene.add(fl);

    const crossLoader = new OBJLoader();
    const crossMtl = new THREE.MeshBasicMaterial({color: 0xFF0000}); 

  crossLoader.load('https://raw.githubusercontent.com/kaheetonaa/GridsforAll/refs/heads/main/assets/cross.obj', (cross) => {
    cross.traverse((mesh) => {
  // You can also check for id / name / type here.
  mesh.material = crossMtl;
        mesh.scale.set(.4,.4,.4)
});
      scene.add(cross);
      for (let i=0;i<2;i++){
          for (let j=0;j<2;j++){
              for (let k=0;k<2;k++){
       if(i==0 && j==0 && k==0){
           console.log(i,j,k)
       }else {
      let crossDup=cross.clone();
      crossDup.position.set(i,j,k);
      scene.add(crossDup)
       }
      }
        }
      }
  });

    directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
scene.add( directionalLight );

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

    //fl.rotation.y += 0.001;

    renderer.render(scene, camera);

}