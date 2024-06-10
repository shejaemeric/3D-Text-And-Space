import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";

const gui = new GUI();

const loadManager = new THREE.LoadingManager();

const fontLoader = new FontLoader();

fontLoader.load("fonts/helvetiker_regular.typeface.json", (font) => {
  const textGeometry = new TextGeometry("Hello Three.js!", {
    font: font,
    size: 2.5,
    height: 0.2,
    curveSegments: 5,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 4,
  });
  textGeometry.center();
  const textMaterial = new THREE.MeshBasicMaterial({});
  const textMesh = new THREE.Mesh(textGeometry, textMaterial);
  textMesh.rotation.y = Math.PI;
  textMesh.position.y = 3;
  scene.add(textMesh);
});

loadManager.onStart = () => {
  console.log("Loading texture started");
};

loadManager.onProgress = () => {
  console.log("Loading in progress");
};

loadManager.onLoad = () => {
  console.log("Load finished");
};

loadManager.onError = () => {
  console.log("Error while loading");
};

const textureLoader = new THREE.TextureLoader(loadManager);
const colorTexture = textureLoader.load("/textures/Rock/3/basecolor.jpg");
const heightTexture = textureLoader.load("/textures/Rock/3/height.jpg");
const normalTexture = textureLoader.load("/textures/Rock/3/normal.jpg");
const ambientTexture = textureLoader.load(
  "/textures/Rock/3/ambientocclusion.jpg"
);

const roughnessTexture = textureLoader.load("/textures/Rock/3/roughness.jpg");
const matcapTexture = textureLoader.load("/textures/matcaps/1.png");

const material = new THREE.MeshStandardMaterial({
  // envMap: envTexture,
  map: colorTexture, // Color texture
  displacementMap: heightTexture, // Height texture
  roughnessMap: roughnessTexture,
  normalMap: normalTexture,
  aoMap: ambientTexture,
});

// colorTexture.repeat.x = 1;
// colorTexture.repeat.y = 1;
// colorTexture.wrapS = THREE.RepeatWrapping;
// colorTexture.wrapT = THREE.RepeatWrapping;

// colorTexture.offset.set(0.5, 3);

// colorTexture.rotation = Math.PI / 6;

// colorTexture.center.set(0.5, 0.8);

// colorTexture.magFilter = THREE.NearestFilter;
// colorTexture.minFilter = THREE.NearestFilter;

const sphereGeometry = new THREE.SphereGeometry(4, 64, 64);

gui.add(material, "wireframe");
gui.add(material, "roughness").max(1).min(0).step(0.001);
gui.add(material, "metalness").max(1).min(0).step(0.001);
gui.add(material, "aoMapIntensity").max(10).min(0).step(0.0001);
gui.add(material, "displacementScale").max(10).min(0).step(0.0001);

const mesh = new THREE.Mesh(sphereGeometry, material);
mesh.position.y = -3;

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xd8c2b1);
scene.add(mesh);

// custom small spheres
const customSphereGeometry = new THREE.SphereGeometry(1, 30, 30);
const customSphereMaterial = new THREE.MeshMatcapMaterial({
  matcap: matcapTexture,
});

const customMaterial = new THREE.MeshStandardMaterial({
  //   envMap: envTexture,
  map: colorTexture, // Color texture
});

for (let i = 0; i <= 100; i++) {
  //   const customSphereMesh = new THREE.Mesh(
  //     customSphereGeometry,
  //     customSphereMaterial
  //   );

  const customSphereMesh = new THREE.Mesh(sphereGeometry, customMaterial);

  customSphereMesh.position.x = (Math.random() - 0.5) * 35;
  customSphereMesh.position.y = (Math.random() - 0.5) * 35;
  customSphereMesh.position.z = (Math.random() - 0.5) * 35;

  customSphereMesh.rotation.x = Math.random() * Math.PI;
  customSphereMesh.rotation.y = Math.random() * Math.PI;

  const scale = Math.random() / 3;
  customSphereMesh.scale.set(scale, scale, scale);
  scene.add(customSphereMesh);
}

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 1;
camera.position.y = 1;

camera.position.z = -15;
scene.add(camera);

const light = new THREE.DirectionalLight(0xffffff, 2);
gui.addColor(light, "color").name("Direction Color");
gui.add(light, "intensity").max(50).min(2).step(0.5);
scene.add(light);

const ambientLight = new THREE.AmbientLight(0xededed); // soft white light
gui.addColor(ambientLight, "color").name("Ambient Color");
scene.add(ambientLight);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
