import * as THREE from 'three';
import { LineMaterial } from 'three/addons/lines/LineMaterial.js';
import { LineSegments2 } from 'three/addons/lines/LineSegments2.js';
import { LineSegmentsGeometry } from 'three/addons/lines/LineSegmentsGeometry.js';
import {OBJLoader} from 'three/addons/loaders/OBJLoader.js';
import {MTLLoader} from 'three/addons/loaders/MTLLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

let scene, camera, renderer,g,eg,feg,fm,fl,g2,feg2,fm2,fl2,eg2,directionalLight,controls;
let slider=document.getElementById('myRange')
init();

function init() {
    scene = new THREE.Scene(); //draw scene
    let cameraHeight=1;
    let screenRatio=window.innerWidth / window.innerHeight;
    camera = new THREE.OrthographicCamera(-cameraHeight*screenRatio, cameraHeight*screenRatio, cameraHeight, -cameraHeight, 1, 1000)
    camera.position.set(1, 2, 1); // Position the camera
    camera.lookAt(0, 0, 0); // Point the camera at the center of the scene

     g = new THREE.BoxGeometry(1, 1, 1);
    
    

 eg = new THREE.EdgesGeometry(g);
 feg = new LineSegmentsGeometry().fromEdgesGeometry(eg);
 fm = new LineMaterial({color: "white",linewidth:1});

    fl = new LineSegments2(feg, fm);

    scene.add(fl);

    g2 = new THREE.BoxGeometry(.1, 1, 1);
    
    

 eg2 = new THREE.EdgesGeometry(g2);
 feg2 = new LineSegmentsGeometry().fromEdgesGeometry(eg2);
fm2 = new LineMaterial({color: "red",linewidth:1});
    fl2 = new LineSegments2(feg2, fm2);

    scene.add(fl2);

    const crossLoader = new OBJLoader();
    const crossMtl = new THREE.MeshBasicMaterial({color: 0xFF0000}); 

  crossLoader.load('https://raw.githubusercontent.com/kaheetonaa/GridsforAll/refs/heads/main/assets/cross.obj', (cross) => {
    cross.traverse((mesh) => {
  // You can also check for id / name / type here.
  mesh.material = crossMtl;
        mesh.scale.set(.4,.4,.4);
});
      cross.position.set(-0.5,-0.5,-0.5)
      scene.add(cross);
      for (let i=0;i<2;i++){
          for (let j=0;j<2;j++){
              for (let k=0;k<2;k++){
       if(i==0 && j==0 && k==0){
           console.log(i,j,k)
       }else {
      let crossDup=cross.clone();
      crossDup.position.set(i-0.5,j-0.5,k-0.5);
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
    renderer.render(scene, camera);
    window.addEventListener('resize', onWindowResize);
    controls = new OrbitControls( camera, renderer.domElement );

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
    

}

slider.addEventListener('change',()=>{
    
renderer.render(scene, camera);
    console.log(slider.value);
    
})


function animate() {
    controls.update();
    fl2.position.set(slider.value,0,0)
    renderer.render(scene, camera);

}