import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x000000, 0.002);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.querySelector('.three-bg').appendChild(renderer.domElement);

const glowLight = new THREE.PointLight(0xffcc88, 4, 100);
glowLight.position.set(20, 0, 10);
scene.add(glowLight);

const ambient = new THREE.AmbientLight(0x222222);
scene.add(ambient);

const starGeometry = new THREE.BufferGeometry();
const starCount = 3000;
const starVertices = [];
const starSpeeds = [];

for (let i = 0; i < starCount; i++) {
  const x = THREE.MathUtils.randFloatSpread(400);
  const y = THREE.MathUtils.randFloatSpread(400);
  const z = THREE.MathUtils.randFloatSpread(400);
  starVertices.push(x, y, z);
  starSpeeds.push({
    x: THREE.MathUtils.randFloat(-0.02, 0.02),
    y: THREE.MathUtils.randFloat(-0.02, 0.02),
    z: THREE.MathUtils.randFloat(-0.02, 0.02)
  });
}

starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.1 });
const starField = new THREE.Points(starGeometry, starMaterial);
scene.add(starField);

function animateStars() {
  const positions = starGeometry.attributes.position.array;
  for (let i = 0; i < starCount; i++) {
    const index = i * 3;
    positions[index] += starSpeeds[i].x;
    positions[index + 1] += starSpeeds[i].y;
    positions[index + 2] += starSpeeds[i].z;

    if (positions[index] > 200 || positions[index] < -200) starSpeeds[i].x *= -1;
    if (positions[index + 1] > 200 || positions[index + 1] < -200) starSpeeds[i].y *= -1;
    if (positions[index + 2] > 200 || positions[index + 2] < -200) starSpeeds[i].z *= -1;
  }
  starGeometry.attributes.position.needsUpdate = true;
}

function animate() {
  requestAnimationFrame(animate);
  animateStars();
  renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
