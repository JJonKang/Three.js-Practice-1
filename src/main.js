import './style.css'
import * as THREE from 'three'
import * as dat from 'dat.gui'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';

import space from './images/spaceResize.jpg';
import nebula from './images/potm2412aResize.jpg';

const vendingMachine = new URL('./assets/vendingMachine.glb', import.meta.url);
const donut = new URL('./assets/donut.glb', import.meta.url);

const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const orbit = new OrbitControls(camera, renderer.domElement);

const axesHelper = new THREE.AxesHelper(8
);
scene.add(axesHelper);

camera.position.set(-10,30,30);
orbit.update();

const boxGeometry = new THREE.BoxGeometry();
const boxMaterial = new THREE.MeshStandardMaterial({
  color: 0x00FF00
});
const box = new THREE.Mesh(boxGeometry, boxMaterial);
scene.add(box);

const planeGeometry = new THREE.PlaneGeometry(30, 30);
const planeMaterial = new THREE.MeshStandardMaterial({
  color: 0xFFFFFF,
  side: THREE.DoubleSide
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(plane);
plane.rotation.x = Math.PI/-2;
plane.receiveShadow = true;

const gridHelper = new THREE.GridHelper(30);
scene.add(gridHelper);

const sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
const sphereMaterial = new THREE.MeshStandardMaterial({
  color: 0x0000FF,
  wireframe: true
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphere);
sphere.position.set(-10, 0, 0);
sphere.castShadow = true;

const ambientLight = new THREE.AmbientLight(0x333333, 2);
scene.add(ambientLight);

// const directionalLight = new THREE.DirectionalLight(0xFFFFFF, .8);
// scene.add(directionalLight);
// directionalLight.position.set(-30, 50, 0);
// directionalLight.castShadow = true;
// directionalLight.shadow.camera.bottom = -12;

// const dLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5);
// scene.add(dLightHelper);

// const dLightShadowHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
// scene.add(dLightShadowHelper);

const spotLight = new THREE.SpotLight(0xFFFFFF);
scene.add(spotLight);
spotLight.position.set(-100,100,0);
spotLight.castShadow = true;
spotLight.angle = 0.2;

const sLightHelper = new THREE.SpotLightHelper(spotLight);
scene.add(sLightHelper);

//scene.fog = new THREE.Fog(0xFFFFFF, 0, 200);
scene.fog = new THREE.FogExp2(0xFFFFFF, 0.01);

//renderer.setClearColor(0xF000F); //sets background a color

//const textureLoader = new THREE.TextureLoader(); //2d background texture 
//scene.background = textureLoader.load(space); //2d background texture

const cubeTextureLoader = new THREE.CubeTextureLoader(); //3d background texture 
scene.background = cubeTextureLoader.load([ //3d background texture through a cube
  space,
  space,
  space,
  space,
  space,
  space
]);

//const textureLoader = new THREE.TextureLoader();
//const nebulaTexture = textureLoader.load(nebula); //these two lines are alternatives to the map thing already made

const box2Geometry = new THREE.BoxGeometry(6,6,6);
const box2Material = new THREE.MeshStandardMaterial({
  map: new THREE.TextureLoader().load(nebula)
});
// const box2MultiMaterial = [ for 6 face textures
//   new THREE.MeshStandardMaterial({map: new THREE.TextureLoader().load(nebula)}),
//   new THREE.MeshStandardMaterial({map: new THREE.TextureLoader().load(nebula)}),
//   new THREE.MeshStandardMaterial({map: new THREE.TextureLoader().load(nebula)}),
//   new THREE.MeshStandardMaterial({map: new THREE.TextureLoader().load(nebula)}),
//   new THREE.MeshStandardMaterial({map: new THREE.TextureLoader().load(nebula)}),
//   new THREE.MeshStandardMaterial({map: new THREE.TextureLoader().load(nebula)}),
// ];
// const box2 = new THREE.Mesh(box2Geometry, box2MultiMaterial);

const box2 = new THREE.Mesh(box2Geometry, box2Material);
scene.add(box2);
//box2.material.map = nebulaTexture; //this is another alternative texturing after the scene implemenetation
box2.position.set(10, 3.04, 10);
box2.castShadow = true;

const plane2Geometry = new THREE.PlaneGeometry(10, 10, 10, 10);
const plane2Material = new THREE.MeshStandardMaterial({
  color: 0xFFFFFF,
  wireframe: true
})
const plane2 = new THREE.Mesh(plane2Geometry, plane2Material);
scene.add(plane2);
plane2.position.set(10,5,15);
plane2.castShadow = true;

//vertex 1: xyz, vertex 2: xyz, etc etc
plane2.geometry.attributes.position.array[6] -= 10 * Math.random(); //
plane2.geometry.attributes.position.array[7] -= 10 * Math.random();
plane2.geometry.attributes.position.array[8] -= 10 * Math.random();
const lastPointZ = plane2.geometry.attributes.position.array.length - 1;
plane2.geometry.attributes.position.array[lastPointZ] -= 10 * Math.random();

const sphere2Geometry = new THREE.SphereGeometry(4);
const vShader = `
  void main(){
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const fShader = `
  void main(){
    gl_FragColor = vec4(.7,.4,1,1); //appears to be RGB Intensity?
  }
`;

const sphere2Material = new THREE.ShaderMaterial({
  vertexShader: vShader,
  fragmentShader: fShader
});
const sphere2 = new THREE.Mesh(sphere2Geometry, sphere2Material);
scene.add(sphere2);
sphere2.position.set(5, 4, -9);
sphere2.castShadow = true;

const assetLoader = new GLTFLoader();
assetLoader.load(vendingMachine.href, function(gltf){
  const model = gltf.scene;
  scene.add(model);
  model.position.set(-10,0.04,10);
  model.traverse((node) => {
    if (node.isMesh) {
        node.castShadow = true; // Enable shadow casting
    }
});
}, undefined, function(error){
  console.error(error);
});

assetLoader.load(donut.href, function(gltf){
  const model = gltf.scene;
  model.traverse((node) => {
    if (node.isMesh) {
        node.castShadow = true; // Enable shadow casting
    }
  });
  scene.add(model);
  model.position.set(0,2,0);
}, undefined, function(error){
  console.error(error);
});


const gui = new dat.GUI();
const options = {
  sphereColor: '#ffea00',
  wireframe: true,
  speed: 0.01,
  angle: 0.2,
  penumbra: 0,
  intensity: 30000,
};
gui.addColor(options, 'sphereColor').onChange(function(e){
  sphere.material.color.set(e);
})
gui.add(options, 'wireframe').onChange(function(e){
  sphere.material.wireframe = e;
})

gui.add(options, 'speed', 0, 0.1);
gui.add(options, 'angle', 0, 1);
gui.add(options, 'penumbra', 0, 1);
gui.add(options, 'intensity', 0, 30000);

let step = 0;

const mousePosition = new THREE.Vector2();
window.addEventListener('mousemove', function(e){
  mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1;
  mousePosition.y = -(e.clientY / window.innerHeight) * 2 + 1;
});

const rayCaster = new THREE.Raycaster();

const sphereId = sphere.id;
box2.name = 'theBox';

const randomHexColorCode = () => {
  let n = (Math.random() * 0xfffff * 1000000).toString(16);
  return '#' + n.slice(0, 6);
};


function animate(time){
  box.rotation.x = time / 1500;
  box.rotation.y = time / 1500;
  step += options.speed;
  sphere.position.y = 10 * Math.abs(Math.sin(step)) + 4;

  spotLight.angle = options.angle;
  spotLight.penumbra = options.penumbra;
  spotLight.intensity = options.intensity;
  sLightHelper.update();

  rayCaster.setFromCamera(mousePosition, camera);
  const intersects = rayCaster.intersectObjects(scene.children);
  //console.log(intersects); for logging purposes and checking

  for(let i = 0; i < intersects.length; i++){
    if(intersects[i].object.id === sphereId){
      intersects[i].object.material.color.set(randomHexColorCode());
    }
    if(intersects[i].object.name === 'theBox'){
      intersects[i].object.rotation.x += 0.005;
      intersects[i].object.rotation.y += 0.005;
    }
  }

  //vertex 1: xyz, vertex 2: xyz, etc etc
  plane2.geometry.attributes.position.array[6] = 3 * Math.random(); //
  plane2.geometry.attributes.position.array[7] = 3 * Math.random();
  plane2.geometry.attributes.position.array[8] = 3 * Math.random();
  plane2.geometry.attributes.position.array[lastPointZ] = 3 * Math.random();
  plane2.geometry.attributes.position.needsUpdate = true; //NEEDED FOR ANIMATION

  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener('resize', function(){
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});