import './style.css';
import * as dat from 'dat.gui';
import {
  Clock, Color, Mesh, MeshBasicMaterial, PerspectiveCamera, PointLight, Scene, TorusGeometry, WebGLRenderer
} from 'three';
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector('canvas');

// Scene
const scene = new Scene();

// Objects
const geometry = new TorusGeometry(.7, .2, 16, 100);

// Materials

const material = new MeshBasicMaterial();
material.color = new Color(0xff0000);

// Mesh
const sphere = new Mesh(geometry, material);
scene.add(sphere);

// Lights

const pointLight = new PointLight(0xffffff, 0.1);
pointLight.position.x = 2;
pointLight.position.y = 3;
pointLight.position.z = 4;
scene.add(pointLight);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
};

window.addEventListener('resize', () => {
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
const camera = new PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 2;
scene.add(camera);

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */

const clock = new Clock();

const tick = () => {

  const elapsedTime = clock.getElapsedTime();

  // Update objects
  sphere.rotation.y = .5 * elapsedTime;

  // Update Orbital Controls
  // controls.update()

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
