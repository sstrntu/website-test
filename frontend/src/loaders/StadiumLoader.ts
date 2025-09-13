import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';

/**
 * Handles loading and setup of the 3D stadium model.
 */
export class StadiumLoader {
  private loader: GLTFLoader;

  constructor() {
    this.loader = new GLTFLoader();
    
    // Setup Draco loader for compressed models
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://unpkg.com/three@0.158.0/examples/jsm/libs/draco/');
    this.loader.setDRACOLoader(dracoLoader);
  }

  /**
   * Loads the stadium model from the specified path.
   */
  public async loadStadium(modelPath: string = './assets/stadium.glb'): Promise<THREE.Object3D> {
    return new Promise((resolve, reject) => {
      this.loader.load(
        modelPath,
        (gltf) => {
          console.log('Stadium model loaded successfully');
          console.log('Model bounding box:', gltf.scene);
          console.log('Model children:', gltf.scene.children);
          
          const stadium = gltf.scene;
          
          // Get model dimensions for proper camera positioning
          const box = new THREE.Box3().setFromObject(stadium);
          const center = box.getCenter(new THREE.Vector3());
          const size = box.getSize(new THREE.Vector3());
          
          console.log('Model center:', center);
          console.log('Model size:', size);
          
          // Position model at center
          stadium.position.sub(center);
          
          // Scale if too small/large
          const maxDim = Math.max(size.x, size.y, size.z);
          if (maxDim > 0) {
            const scale = maxDim < 10 ? 10 : maxDim > 200 ? 200/maxDim : 1;
            stadium.scale.setScalar(scale);
            console.log('Applied scale:', scale);
          }
          
          // Prepare stadium for visibility management
          this.prepareStadiumMaterials(stadium);
          
          // If the model has animations, set them up
          if (gltf.animations && gltf.animations.length) {
            const mixer = new THREE.AnimationMixer(stadium);
            gltf.animations.forEach((clip) => {
              mixer.clipAction(clip).play();
            });
            console.log('Animations set up:', gltf.animations.length);
          }
          
          resolve(stadium);
        },
        (progress) => {
          console.log('Loading progress:', (progress.loaded / progress.total * 100) + '%');
        },
        (error) => {
          console.error('Error loading stadium model:', error);
          reject(error);
        }
      );
    });
  }

  /**
   * Prepares stadium materials for visibility management.
   */
  private prepareStadiumMaterials(stadium: THREE.Object3D): void {
    // Start with stadium completely invisible (will appear when zooming in)
    stadium.visible = false;
    
    // Hide all stadium children materials immediately
    stadium.traverse((child) => {
      if (child.isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.visible = false; // Hide mesh completely
        console.log('Mesh found and hidden:', mesh.name, mesh.material);
        
        // Also hide materials
        if (mesh.material) {
          // Handle both single materials and arrays
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach(mat => {
              mat.transparent = true;
              mat.opacity = 0.0;
            });
          } else {
            mesh.material.transparent = true;
            mesh.material.opacity = 0.0;
          }
        }
      }
    });
  }

  /**
   * Updates stadium visibility with smooth transitions.
   */
  public updateStadiumVisibility(stadium: THREE.Object3D, visible: boolean, duration: number = 0.8): void {
    stadium.visible = visible;
    
    // Also show/hide all stadium children
    stadium.traverse((child) => {
      if (child.isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.visible = visible;
        
        if (mesh.material) {
          // Handle both single materials and arrays
          const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          
          materials.forEach(mat => {
            if (visible) {
              // Fade in stadium
              if (typeof gsap !== 'undefined') {
                gsap.to(mat, {
                  opacity: 1.0,
                  duration,
                  ease: "power2.inOut"
                });
              } else {
                mat.opacity = 1.0;
              }
            } else {
              // Fade out stadium
              mat.opacity = 0.0;
            }
          });
        }
      }
    });
  }
}