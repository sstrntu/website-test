import * as THREE from 'three';
import { SPHERE_RADIUS } from '../utils/constants';

/**
 * Creates and manages the wireframe sphere component.
 */
export class Sphere {
  private sphere: THREE.Group;

  constructor() {
    this.sphere = new THREE.Group();
    this.createWireframeSphere();
  }

  /**
   * Creates a clean wireframe sphere with latitude and longitude lines.
   */
  private createWireframeSphere(): void {
    console.log('Creating clean wireframe sphere...');
    
    // Create horizontal circles (latitude lines)
    const latitudes = 16;
    for (let i = 1; i < latitudes; i++) {
      const phi = (i / latitudes) * Math.PI;
      const y = SPHERE_RADIUS * Math.cos(phi);
      const radius = SPHERE_RADIUS * Math.sin(phi);
      
      const points: THREE.Vector3[] = [];
      for (let j = 0; j <= 32; j++) {
        const theta = (j / 32) * Math.PI * 2;
        points.push(new THREE.Vector3(
          radius * Math.cos(theta),
          y,
          radius * Math.sin(theta)
        ));
      }
      
      const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
      const circleMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
      const line = new THREE.Line(lineGeometry, circleMaterial);
      this.sphere.add(line);
    }
    
    // Create vertical circles (longitude lines)
    const longitudes = 16;
    for (let i = 0; i < longitudes; i++) {
      const theta = (i / longitudes) * Math.PI * 2;
      
      const points: THREE.Vector3[] = [];
      for (let j = 0; j <= 32; j++) {
        const phi = (j / 32) * Math.PI;
        points.push(new THREE.Vector3(
          SPHERE_RADIUS * Math.sin(phi) * Math.cos(theta),
          SPHERE_RADIUS * Math.cos(phi),
          SPHERE_RADIUS * Math.sin(phi) * Math.sin(theta)
        ));
      }
      
      const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
      const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
      const line = new THREE.Line(lineGeometry, lineMaterial);
      this.sphere.add(line);
    }
    
    // Position sphere at origin
    this.sphere.position.set(0, 0, 0);
    
    console.log('Clean wireframe sphere created with radius:', SPHERE_RADIUS);
  }

  /**
   * Updates sphere visibility with animation.
   */
  public updateVisibility(visible: boolean, duration: number = 0.8): void {
    if (typeof gsap !== 'undefined') {
      gsap.to(this.sphere, {
        opacity: visible ? 1.0 : 0.0,
        duration,
        ease: "power2.inOut",
        onUpdate: () => {
          this.sphere.children.forEach(line => {
            if (line.material && 'opacity' in line.material) {
              (line.material as any).opacity = (this.sphere as any).opacity || (visible ? 1.0 : 0.0);
            }
          });
        }
      });

      gsap.to(this.sphere.scale, {
        x: visible ? 1.0 : 0.8,
        y: visible ? 1.0 : 0.8,
        z: visible ? 1.0 : 0.8,
        duration,
        ease: "power2.inOut"
      });
    }
  }

  /**
   * Gets the sphere group for adding to scene.
   */
  public getObject(): THREE.Group {
    return this.sphere;
  }
}