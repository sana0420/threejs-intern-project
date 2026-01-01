import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf0f0f0);
// Camera
const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    100
);
camera.position.set(2, 2, 3);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(devicePixelRatio);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;


const ambient = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambient);

const directional = new THREE.DirectionalLight(0xffffff, 1);
directional.position.set(3, 5, 2);
scene.add(directional);

let product = null;

const loader = new GLTFLoader();
loader.load(
    "/chair.glb",
    (gltf) => {
        product = gltf.scene;

        // optional: scale to reasonable size
        product.scale.set(1.5, 1.5, 1.5);

        scene.add(product);
    },
    undefined,
    (err) => console.error(err)
);

function setColor(hex) {
    if (!product) return;

    product.traverse((child) => {
        if (child.isMesh && child.material && child.material.color) {
            child.material.color.set(hex);
        }
    });
}

document.querySelectorAll("button").forEach(btn => {
    btn.addEventListener("click", () => {
        setColor(btn.dataset.color);
    });
});


function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

animate();

window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
  