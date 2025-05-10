/**
 * Three.js configurations for 3D scenes
 */

import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';
import { lerp, getRandomNumber } from './utils.js';

// Hero scene with 3D iPhone model
function setupHeroScene() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  // Scene setup
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / 2 / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;

  // Renderer setup
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true
  });
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(5, 5, 5);
  scene.add(directionalLight);

  // Create a simplistic phone model
  const phoneGroup = new THREE.Group();
  
  // Phone body
  const phoneGeometry = new THREE.BoxGeometry(1.5, 3, 0.1);
  const phoneMaterial = new THREE.MeshStandardMaterial({
    color: 0x121212,
    metalness: 0.7,
    roughness: 0.2
  });
  const phone = new THREE.Mesh(phoneGeometry, phoneMaterial);
  phoneGroup.add(phone);

  // Phone screen
  const screenGeometry = new THREE.BoxGeometry(1.4, 2.9, 0.01);
  const screenMaterial = new THREE.MeshStandardMaterial({
    color: 0x0071e3,
    emissive: 0x0071e3,
    emissiveIntensity: 0.2,
    metalness: 0.2,
    roughness: 0.3
  });
  const screen = new THREE.Mesh(screenGeometry, screenMaterial);
  screen.position.z = 0.06;
  phoneGroup.add(screen);

  // Add notch
  const notchGeometry = new THREE.BoxGeometry(0.3, 0.1, 0.02);
  const notchMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
  const notch = new THREE.Mesh(notchGeometry, notchMaterial);
  notch.position.z = 0.07;
  notch.position.y = 1.4;
  phoneGroup.add(notch);

  // Add camera lens
  const lensGeometry = new THREE.CircleGeometry(0.1, 32);
  const lensMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x333333,
    metalness: 0.9,
    roughness: 0.1
  });
  const lens = new THREE.Mesh(lensGeometry, lensMaterial);
  lens.position.set(0.5, 1.3, 0.06);
  lens.rotation.x = -Math.PI / 2;
  phoneGroup.add(lens);

  // Add app grid with colored squares
  const appSize = 0.2;
  const appGeometry = new THREE.PlaneGeometry(appSize, appSize);
  
  const appColors = [
    0xff4336, 0x4caf50, 0x2196f3, 0xffeb3b,
    0x9c27b0, 0xff9800, 0x795548, 0x607d8b
  ];
  
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 2; j++) {
      const appMaterial = new THREE.MeshBasicMaterial({ 
        color: appColors[i * 2 + j],
        transparent: true,
        opacity: 0.9
      });
      const app = new THREE.Mesh(appGeometry, appMaterial);
      
      app.position.x = -0.3 + j * (appSize * 1.5);
      app.position.y = 0.8 - i * (appSize * 1.5);
      app.position.z = 0.07;
      
      screen.add(app);
    }
  }

  scene.add(phoneGroup);

  // Animation variables
  let targetRotationY = 0;
  let targetRotationX = 0;
  let currentRotationY = 0;
  let currentRotationX = 0;

  // Mouse move event for interactive rotation
  window.addEventListener('mousemove', (event) => {
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;
    
    targetRotationY = (event.clientX - windowHalfX) / windowHalfX * 0.5;
    targetRotationX = (event.clientY - windowHalfY) / windowHalfY * 0.3;
  });

  // Handle window resize
  window.addEventListener('resize', () => {
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  });

  // Animation loop
  function animate() {
    requestAnimationFrame(animate);
    
    // Smooth rotation
    currentRotationY = lerp(currentRotationY, targetRotationY, 0.05);
    currentRotationX = lerp(currentRotationX, targetRotationX, 0.05);
    
    phoneGroup.rotation.y = currentRotationY;
    phoneGroup.rotation.x = currentRotationX;
    
    // Add a subtle floating effect
    phoneGroup.position.y = Math.sin(Date.now() * 0.001) * 0.1;
    
    renderer.render(scene, camera);
  }

  animate();
}

// Project preview 3D scene
function setupProjectPreview() {
  const canvas = document.getElementById('project-preview-canvas');
  if (!canvas) return;

  // Scene setup (we'll initialize it but not create any content yet)
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
  camera.position.z = 5;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true
  });
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(5, 5, 5);
  scene.add(directionalLight);

  // Group to hold the current project model
  const projectGroup = new THREE.Group();
  scene.add(projectGroup);

  // Function to update project preview with new content
  function updateProjectPreview(projectData) {
    // Clear previous content
    while(projectGroup.children.length > 0) {
      const object = projectGroup.children[0];
      projectGroup.remove(object);
    }

    // Create a device based on project type
    if (projectData.type === 'ios-app') {
      // iPhone model
      const phoneGeometry = new THREE.BoxGeometry(1.5, 3, 0.1);
      const phoneMaterial = new THREE.MeshStandardMaterial({
        color: 0x121212,
        metalness: 0.7,
        roughness: 0.2
      });
      const phone = new THREE.Mesh(phoneGeometry, phoneMaterial);
      projectGroup.add(phone);

      // Phone screen
      const screenGeometry = new THREE.BoxGeometry(1.4, 2.9, 0.01);
      const screenMaterial = new THREE.MeshStandardMaterial({
        color: projectData.color || 0x0071e3,
        emissive: projectData.color || 0x0071e3,
        emissiveIntensity: 0.2,
        metalness: 0.2,
        roughness: 0.3
      });
      const screen = new THREE.Mesh(screenGeometry, screenMaterial);
      screen.position.z = 0.06;
      projectGroup.add(screen);
    } else if (projectData.type === 'watchos-app') {
      // Apple Watch model
      const watchGeometry = new THREE.BoxGeometry(1.2, 1.4, 0.1);
      const watchMaterial = new THREE.MeshStandardMaterial({
        color: 0x121212,
        metalness: 0.8,
        roughness: 0.2
      });
      const watch = new THREE.Mesh(watchGeometry, watchMaterial);
      projectGroup.add(watch);

      // Watch screen (rounded rectangle)
      const screenGeometry = new THREE.BoxGeometry(1.0, 1.2, 0.01);
      const screenMaterial = new THREE.MeshStandardMaterial({
        color: projectData.color || 0x0071e3,
        emissive: projectData.color || 0x0071e3,
        emissiveIntensity: 0.2,
        metalness: 0.2,
        roughness: 0.3
      });
      const screen = new THREE.Mesh(screenGeometry, screenMaterial);
      screen.position.z = 0.06;
      projectGroup.add(screen);

      // Add digital crown
      const crownGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.2, 32);
      const crownMaterial = new THREE.MeshStandardMaterial({
        color: 0xcccccc,
        metalness: 0.9,
        roughness: 0.1
      });
      const crown = new THREE.Mesh(crownGeometry, crownMaterial);
      crown.rotation.x = Math.PI / 2;
      crown.position.set(0.7, 0, 0);
      projectGroup.add(crown);
    }
  }

  // Animation loop
  function animate() {
    requestAnimationFrame(animate);
    
    // Rotate the project group
    projectGroup.rotation.y += 0.005;
    
    renderer.render(scene, camera);
  }

  animate();

  // Make the update function available
  return { updateProjectPreview };
}

// 3D form background effects
function setupFormBackground() {
  const canvas = document.getElementById('form-canvas');
  if (!canvas) return;

  // Scene setup
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
  camera.position.z = 5;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true
  });
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Create particles
  const particlesGeometry = new THREE.BufferGeometry();
  const particlesCount = 500;
  
  const posArray = new Float32Array(particlesCount * 3);
  const scaleArray = new Float32Array(particlesCount);
  
  for (let i = 0; i < particlesCount * 3; i += 3) {
    // Position
    posArray[i] = (Math.random() - 0.5) * 10;      // x
    posArray[i+1] = (Math.random() - 0.5) * 10;    // y
    posArray[i+2] = (Math.random() - 0.5) * 10;    // z
    
    // Scale
    scaleArray[i/3] = Math.random();
  }
  
  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
  particlesGeometry.setAttribute('scale', new THREE.BufferAttribute(scaleArray, 1));
  
  // Material with custom shader
  const particlesMaterial = new THREE.PointsMaterial({
    size: 0.05,
    sizeAttenuation: true,
    color: 0x0071e3,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending
  });
  
  // Create the particle system
  const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
  scene.add(particlesMesh);

  // Mouse movement effect
  let mouseX = 0, mouseY = 0;
  
  window.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
  });

  // Animation loop
  function animate() {
    requestAnimationFrame(animate);
    
    // Rotate particles
    particlesMesh.rotation.x += 0.001;
    particlesMesh.rotation.y += 0.001;
    
    // Respond to mouse movement
    particlesMesh.rotation.x += mouseY * 0.01;
    particlesMesh.rotation.y += mouseX * 0.01;
    
    renderer.render(scene, camera);
  }

  animate();
}

export { setupHeroScene, setupProjectPreview, setupFormBackground };