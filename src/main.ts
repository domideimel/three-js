import './style.css';
import normalMap from './textures/normalmap.png'
import {
  Clock,
  Color,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  PointLight,
  Scene,
  SphereGeometry,
  TextureLoader,
  WebGLRenderer
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Sizes } from './types/Sizes';

// Loading
const textureLoader: TextureLoader = new TextureLoader();

// Canvas
const canvas = document.querySelector<HTMLCanvasElement>('#app')!;

// Scene
const scene: Scene = new Scene();

// Objects
const geometry: SphereGeometry = new SphereGeometry(.5, 64, 64);

// Materials
const material: MeshStandardMaterial = new MeshStandardMaterial({
  metalness: 0.7,
  roughness: 0.2,
  color: new Color(0x292929),
  normalMap: textureLoader.load(normalMap)
});

// Mesh
const sphere: Mesh<SphereGeometry, MeshStandardMaterial> = new Mesh(geometry, material);
scene.add(sphere);

// Lights
const pointLight: PointLight = new PointLight(0xffffff, 0.1);
pointLight.position.set(2, 3, 4);
scene.add(pointLight);

const pointLight2: PointLight = new PointLight(0xff0000, 10);
pointLight2.position.set(-1.86, 1, -1.65);
scene.add(pointLight2);

const pointLight3: PointLight = new PointLight(0xe1ff, 6.8);
pointLight3.position.set(2.13, -3, -1.98);
scene.add(pointLight3);

/**
 * Sizes
 */
const sizes: Sizes = {
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
const camera: PerspectiveCamera = new PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.set(0, 0, 2);
scene.add(camera);

// Controls
const controls: OrbitControls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer: WebGLRenderer = new WebGLRenderer({
  canvas,
  alpha: true
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
let mouseX: number = 0;
let mouseY: number = 0;

let targetX: number = 0;
let targetY: number = 0;

const windowX: number = window.innerWidth / 2;
const windowY: number = window.innerHeight / 2;

const onDocumentMouseMove = (event: MouseEvent) => {
  mouseX = (event.clientX - windowX);
  mouseY = (event.clientY - windowY);
};

window.addEventListener('mousemove', onDocumentMouseMove);
const clock: Clock = new Clock();

const tick = () => {
  targetX = mouseX * .001;
  targetY = mouseY * .001;

  const elapsedTime = clock.getElapsedTime();
  // Update objects
  sphere.rotation.y = .5 * elapsedTime;
  sphere.rotation.y += .5 * (targetX - sphere.rotation.y);
  sphere.rotation.x += .5 * (targetY - sphere.rotation.x);
  sphere.position.z += .5 * (targetY - sphere.rotation.x);
  // Update Orbital Controls
  controls.update();
  // Render
  renderer.render(scene, camera);
  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();

//Debugging
if (import.meta.env.DEV) {
  // GUI
  import('dat.gui').then(({ GUI }) => {
    const gui = new GUI();
    [pointLight, pointLight2, pointLight3].forEach((pointLight, index) => {
      const lightColor = {
        color: 0xff0000
      };
      const folder = gui.addFolder(`Light ${ index + 1 }`);

      folder.add(pointLight.position, 'x', -6, 6, .01);
      folder.add(pointLight.position, 'y', -3, 3, .01);
      folder.add(pointLight.position, 'z', -6, 6, .01);
      folder.add(pointLight, 'intensity', 0, 10, .01);
      folder.addColor(lightColor, 'color')
            .onChange(() => {
              pointLight.color.set(lightColor.color);
            });
    });
  });

  // PointLightHelper
  import('three').then(({ PointLightHelper }) => {
    [pointLight, pointLight2, pointLight3].forEach(pointLight => {
      const pointLightHelper = new PointLightHelper(pointLight, 1);
      scene.add(pointLightHelper);
    });
  });
}
