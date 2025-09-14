import * as THREE from 'three';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { COLORS } from '../utils/constants';

/**
 * Creates and manages 3D text similar to Jesse Zhou's style.
 */
export class Text3D {
  private textMesh?: THREE.Object3D;
  private fontLoader: FontLoader;
  private scene: THREE.Scene;

  constructor(scene: THREE.Scene) {
    this.scene = scene;
    this.fontLoader = new FontLoader();
  }

  /**
   * Creates 3D text with Jesse Zhou inspired styling.
   */
  public async create3DText(text: string = 'TURFMAPP', position = { x: 0, y: 20, z: 0 }): Promise<void> {
    return new Promise((resolve, reject) => {
      this.fontLoader.load(
        'https://unpkg.com/three@0.158.0/examples/fonts/helvetiker_bold.typeface.json',
        (font) => {
          console.log('Font loaded for 3D text');

          // Create text geometry
          const textGeometry = new TextGeometry(text, {
            font: font,
            size: 8,
            height: 2,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 0.5,
            bevelSize: 0.3,
            bevelOffset: 0,
            bevelSegments: 8
          });

          // Center the geometry
          textGeometry.computeBoundingBox();
          const centerOffsetX = -0.5 * (textGeometry.boundingBox!.max.x - textGeometry.boundingBox!.min.x);
          const centerOffsetY = -0.5 * (textGeometry.boundingBox!.max.y - textGeometry.boundingBox!.min.y);
          textGeometry.translate(centerOffsetX, centerOffsetY, 0);

          // Create materials
          const materials = this.createTextMaterials();

          // Create text mesh
          this.textMesh = new THREE.Group();

          // Main text with neon green glow
          const mainTextMesh = new THREE.Mesh(textGeometry, materials.main);
          this.textMesh.add(mainTextMesh);

          // Create outline/glow effect
          const outlineGeometry = textGeometry.clone();
          const outlineMesh = new THREE.Mesh(outlineGeometry, materials.outline);
          outlineMesh.scale.setScalar(1.05);
          outlineMesh.position.z = -0.1;
          this.textMesh.add(outlineMesh);

          // Add subtle inner glow
          const glowMesh = new THREE.Mesh(outlineGeometry, materials.glow);
          glowMesh.scale.setScalar(1.02);
          glowMesh.position.z = 0.1;
          this.textMesh.add(glowMesh);

          // Position the text
          this.textMesh.position.set(position.x, position.y, position.z);

          // Start hidden
          this.textMesh.visible = false;
          this.textMesh.children.forEach(child => {
            if (child.material) {
              (child.material as any).opacity = 0.0;
            }
          });

          this.scene.add(this.textMesh);
          console.log('Jesse Zhou style 3D text created at position:', position);
          resolve();
        },
        (progress) => {
          console.log('Font loading progress:', progress);
        },
        (error) => {
          console.error('Error loading font for 3D text:', error);
          reject(error);
        }
      );
    });
  }

  /**
   * Creates materials for Jesse Zhou inspired text styling.
   */
  private createTextMaterials() {
    // Main text material - neon green with emission
    const main = new THREE.MeshPhongMaterial({
      color: COLORS.TURFMAPP_TEXT,
      emissive: new THREE.Color(COLORS.TURFMAPP_TEXT).multiplyScalar(0.2),
      shininess: 100,
      transparent: true,
      opacity: 1.0
    });

    // Outline material for depth
    const outline = new THREE.MeshBasicMaterial({
      color: new THREE.Color(COLORS.TURFMAPP_TEXT).multiplyScalar(0.3),
      transparent: true,
      opacity: 0.8,
      side: THREE.BackSide
    });

    // Glow material for inner light
    const glow = new THREE.MeshBasicMaterial({
      color: COLORS.TURFMAPP_TEXT,
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending
    });

    return { main, outline, glow };
  }

  /**
   * Updates text visibility with animation.
   */
  public updateVisibility(visible: boolean, duration: number = 0.8): void {
    if (!this.textMesh) return;

    this.textMesh.visible = visible;

    if (typeof gsap !== 'undefined') {
      this.textMesh.children.forEach((child, index) => {
        if (child.material) {
          const material = child.material as any;
          const targetOpacity = visible ? this.getTargetOpacity(index) : 0.0;

          gsap.to(material, {
            opacity: targetOpacity,
            duration,
            ease: "power2.inOut"
          });
        }
      });

      // Add subtle scale animation for dramatic effect
      gsap.to(this.textMesh.scale, {
        x: visible ? 1.0 : 0.8,
        y: visible ? 1.0 : 0.8,
        z: visible ? 1.0 : 0.8,
        duration,
        ease: "back.out(1.7)"
      });
    }
  }

  /**
   * Gets target opacity for each text layer.
   */
  private getTargetOpacity(index: number): number {
    switch (index) {
      case 0: return 1.0; // Main text
      case 1: return 0.8; // Outline
      case 2: return 0.3; // Glow
      default: return 1.0;
    }
  }

  /**
   * Animates text to always face the camera.
   */
  public lookAtCamera(camera: THREE.Camera): void {
    if (this.textMesh) {
      this.textMesh.lookAt(camera.position);
    }
  }

  /**
   * Gets the text mesh for external access.
   */
  public getTextMesh(): THREE.Object3D | undefined {
    return this.textMesh;
  }

  /**
   * Permanently removes the text from the scene.
   */
  public remove(): void {
    if (this.textMesh) {
      this.scene.remove(this.textMesh);
      this.textMesh = undefined;
      console.log('3D text permanently removed');
    }
  }
}