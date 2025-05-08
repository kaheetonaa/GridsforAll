import * as THREE from 'three';
import { LineMaterial } from 'three/addons/lines/LineMaterial.js';
import { LineSegments2 } from 'three/addons/lines/LineSegments2.js';
import { LineSegmentsGeometry } from 'three/addons/lines/LineSegmentsGeometry.js';
import {OBJLoader} from 'three/addons/loaders/OBJLoader.js';
import {MTLLoader} from 'three/addons/loaders/MTLLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

//load data
let input_data,filtered_data,temp_photo,
    scene, camera, renderer,g,eg,feg,fm,fl,
    basemap,l2,t2,g2,m2,fl2,eg2,
    g3,feg3,fm3,fl3,eg3,
    data_point,data_point_material,data_point_geom,data_point_array,
    directionalLight,controls;

let time_slider=document.getElementById('timescale')
let x_slider=document.getElementById('x')
let y_slider=document.getElementById('y')

async function fetchCSV(url) {
            try {
                const response = await fetch(url);
                const data = await response.text();
                input_data=Papa.parse(data,{header:true});
                console.log('load complete data')
                preload();
                init();
            } catch (error) {
                console.error('Error fetching CSV:', error);
            }
        }

fetchCSV('test.csv');





const manager = new THREE.LoadingManager();
manager.onStart = function ( url, itemsLoaded, itemsTotal ) {
	console.log( 'Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
};

manager.onLoad = function ( ) {
	console.log( 'Loading complete!');
};

manager.onProgress = function ( url, itemsLoaded, itemsTotal ) {
	console.log( 'Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
};

manager.onError = function ( url ) {
	console.log( 'There was an error loading ' + url );
};



function preload(){
    basemap=['https://raw.githubusercontent.com/kaheetonaa/GridsforAll/refs/heads/gh-pages/198/assets/basemape/2024-12-12.jpeg',
             'https://raw.githubusercontent.com/kaheetonaa/GridsforAll/refs/heads/gh-pa	ges/198/assets/basemape/2023-06-13.jpeg',
             'https://raw.githubusercontent.com/kaheetonaa/GridsforAll/refs/heads/gh-pages/198/assets/basemape/2022-06-08.jpeg',
             'https://raw.githubusercontent.com/kaheetonaa/GridsforAll/refs/heads/gh-pages/198/assets/basemape/2019-12-12.jpeg',
             'https://raw.githubusercontent.com/kaheetonaa/GridsforAll/refs/heads/gh-pages/198/assets/basemape/2018-03-28.jpeg',
             'https://raw.githubusercontent.com/kaheetonaa/GridsforAll/refs/heads/gh-pages/198/assets/basemape/2017-03-15.jpeg',
             'https://raw.githubusercontent.com/kaheetonaa/GridsforAll/refs/heads/gh-pages/198/assets/basemape/2015-03-18.jpeg'
             ]
    time_slider.max=basemap.length-1;
    time_slider.min=0;
    time_slider.step=1;
    l2 = new THREE.TextureLoader(manager);
    t2 = [];
    for ( let x=0;x<basemap.length;x++) {
        t2[x]=l2.load(basemap[x]);
        t2[x].colorSpace = THREE.SRGBColorSpace;
    }
    //console.log(t2)
}

function init() {
    scene = new THREE.Scene(); //draw scene
    let cameraHeight=1;
    let screenRatio=window.innerWidth / window.innerHeight;
    camera = new THREE.OrthographicCamera(-cameraHeight*screenRatio, cameraHeight*screenRatio, cameraHeight, -cameraHeight, 1, 1000)
    camera.position.set(1, 2, 2); // Position the camera
    camera.lookAt(0, 0, 0); // Point the camera at the center of the scene

     g = new THREE.BoxGeometry(1, 1, 1);
    
    

 eg = new THREE.EdgesGeometry(g);
 feg = new LineSegmentsGeometry().fromEdgesGeometry(eg);
 fm = new LineMaterial({color: "white",linewidth:1});

    fl = new LineSegments2(feg, fm);

    scene.add(fl);
    
    g2 = new THREE.PlaneGeometry( 1, 1 );
    m2 = new THREE.MeshBasicMaterial({
        map: t2[0],
        side:THREE.DoubleSide
    })
    fl2 = new THREE.Mesh( g2, m2 );
    fl2.rotation.x= -Math.PI / 2;
    fl2.position.y= -0.5

    scene.add(fl2);

    g3 = new THREE.CylinderGeometry( .1, .1, 1, 8 )
    
    

 eg3 = new THREE.EdgesGeometry(g3);
 feg3 = new LineSegmentsGeometry().fromEdgesGeometry(eg3);
fm3 = new LineMaterial({color: "lightgray",linewidth:1});
    fl3 = new LineSegments2(feg3, fm3);

    scene.add(fl3);

    const crossLoader = new OBJLoader(manager);
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
           //console.log(i,j,k)
       }else {
      let crossDup=cross.clone();
      crossDup.position.set(i-0.5,j-0.5,k-0.5);
      scene.add(crossDup)
       }
      }
        }
      }
  });

    //data Point
    console.log(input_data)
    data_point_array=[]
    data_point_array=addPoint(input_data['data']);
    data_point_geom = new THREE.BufferGeometry();
    data_point_geom.setFromPoints(data_point_array)
    data_point_material = new THREE.PointsMaterial( {color:'#00FF00',size: 10, sizeAttenuation: false } );
    data_point = new THREE.Points( data_point_geom, data_point_material );
    scene.add( data_point );

    directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
scene.add( directionalLight );

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setAnimationLoop(animate);//set animation
    document.getElementById('threedscene').appendChild(renderer.domElement);
    renderer.render(scene, camera);
    renderer.setClearColor( 0xffff00, .1);
    window.addEventListener('resize', onWindowResize);
    controls = new OrbitControls( camera, renderer.domElement );
    addListener()
}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
    

}
function addPoint(input) {
    let array=[];
//input_data['data']
//data_point_array
    for (let i in input) {
        console.log(i)
        let temp_data=input[i]
        array.push(new THREE.Vector3(Number(temp_data['x'])-0.5,Number(temp_data['z'])-0.5,-Number(temp_data['y'])+0.5))
    }
    return array;
}

function addListener(){
    document.getElementById('photo').addEventListener('pointerdown', photoPointerDown, false);
    window.addEventListener('pointerup', pointerUp, false);
}
function pointerUp()
{
    console.log('up')
    window.removeEventListener('pointermove', photoMove, true);
    let photo = document.getElementById('photo');
    let photo_x= Number(photo.style.left.replace('px',''))
    let photo_y= Number(photo.style.top.replace('px',''))   
    if (photo_x<0){
        photo.style.left='0px'
    }
    if (photo_x>window.innerWidth-150){
        photo.style.left=(window.innerWidth-150)+'px'
    }
    if (photo_y<0){
        photo.style.top='0px'
    }
    if (photo_y>window.innerHeight-150){
        photo.style.top=(window.innerHeight-150)+'px'
    }
}

function photoPointerDown(e){
    console.log('down')
  window.addEventListener('pointermove', photoMove, true);
}
function photoMove(e){
    console.log('move')
    console.log(window.innerWidth-150/2)
    let photo = document.getElementById('photo');
    photo.style.top = (e.clientY-150/2) + 'px';
    photo.style.left = (e.clientX-150/2) + 'px';
}

time_slider.addEventListener('change',()=>{
    filtered_data=input_data['data'].filter(slideFilter)
    console.log(filtered_data)
    showFilter();
})
x_slider.addEventListener('change',()=>{
    filtered_data=input_data['data'].filter(drillFilter)
    showFilter();   
})
y_slider.addEventListener('change',()=>{
    filtered_data=input_data['data'].filter(drillFilter)
    showFilter();
})
function slideFilter(a) {
    return Number(a['z'])>0.5
}
function drillFilter(a) {
    return Number(a['angle'])>150
}
function showFilter(){
    //document.querySelectorAll(".photo").forEach(el => el.remove());
    document.getElementById('photo').style.backgroundImage="url("+filtered_data[0]['thumb_256']+")"
    //for (let i in filtered_data){
        //temp_photo=document.createElement('img');
        //temp_photo.src=filtered_data[i]['thumb_256'];
        //temp_photo.classList.add("photo")
        //document.getElementById('photo').appendChild(temp_photo);
    //}
}


function animate() {
    
fl3.position.set(x_slider.value-.5,0,1-y_slider.value-.5)
fl2.material.map = t2[t2.length-Number(time_slider.value)-1];
fl2.material.needsUpdate = true;
    fl2.position.set(0,time_slider.value/(basemap.length-1)-.5,0)
    controls.update();
    //fl2.position.set(time_slider.value,0,0)
    renderer.render(scene, camera);

}
