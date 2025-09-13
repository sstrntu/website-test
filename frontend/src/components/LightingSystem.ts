import * as THREE from 'three';
import { COLORS, FLOODLIGHT_POSITIONS } from '../utils/constants';
import { AppConfig } from '../types';

/**
 * Manages all lighting in the stadium scene.
 */
export class LightingSystem {
  private scene: THREE.Scene;
  private floodlights: THREE.SpotLight[] = [];
  private config: AppConfig;

  constructor(scene: THREE.Scene, config: AppConfig) {
    this.scene = scene;
    this.config = config;
    this.setupLighting();
  }

  /**
   * Sets up cinematic stadium lighting.
   */
  private setupLighting(): void {
    console.log('Setting up cinematic stadium lighting...');
    
    // Reduced ambient for dramatic contrast
    const ambientLight = new THREE.AmbientLight(COLORS.AMBIENT_LIGHT, 0.3);
    this.scene.add(ambientLight);
    console.log('Low-key ambient light added');

    // Main stadium floodlights with dramatic intensity
    FLOODLIGHT_POSITIONS.forEach((pos, index) => {
      // Main powerful floodlight
      const floodlight = new THREE.SpotLight(
        COLORS.FLOODLIGHT,     // Pure white
        8.0,                   // High intensity for bloom effect
        400,                   // Long range
        Math.PI * 0.25,        // Wide cone angle
        0.3,                   // Soft penumbra
        1.5                    // Distance decay
      );
      
      floodlight.position.set(pos.x, pos.y, pos.z);
      floodlight.target.position.set(0, 0, 0);
      
      // Start with reduced intensity (will increase at detail scale)
      floodlight.intensity = 2.0;
      
      // Shadows disabled for performance
      if (this.config.effectsEnabled) {
        floodlight.castShadow = true;
        floodlight.shadow.mapSize.width = 2048;
        floodlight.shadow.mapSize.height = 2048;
        floodlight.shadow.camera.near = 10;
        floodlight.shadow.camera.far = 500;
        floodlight.shadow.camera.fov = 45;
      }

      this.scene.add(floodlight);
      this.scene.add(floodlight.target);
      this.floodlights.push(floodlight);
      
      // Add light helper visualization (remove in production)
      if (!this.config.isLowEnd) {
        const helper = new THREE.SpotLightHelper(floodlight);
        helper.visible = false; // Hidden by default
        this.scene.add(helper);
      }
    });

    // Rim lighting for dramatic silhouettes
    const rimLight = new THREE.DirectionalLight(COLORS.RIM_LIGHT, 2.0);
    rimLight.position.set(-200, 100, 200);
    this.scene.add(rimLight);

    // Atmospheric fill light
    const fillLight = new THREE.DirectionalLight(COLORS.FILL_LIGHT, 0.8);
    fillLight.position.set(200, 50, -100);
    this.scene.add(fillLight);

    console.log(`Stadium lighting rig completed: ${this.floodlights.length} floodlights + atmospheric lighting`);
  }

  /**
   * Updates floodlight intensity based on detail visibility.
   */
  public updateFloodlightIntensity(isDetailMode: boolean, duration: number = 0.8): void {
    this.floodlights.forEach(light => {
      if (typeof gsap !== 'undefined') {
        gsap.to(light, {
          intensity: isDetailMode ? 8.0 : 2.0,
          duration,
          ease: "power2.inOut"
        });
      } else {
        light.intensity = isDetailMode ? 8.0 : 2.0;
      }
    });
  }

  /**
   * Animates floodlight intensity for dramatic effect.
   */
  public animateFloodlights(time: number): void {
    this.floodlights.forEach((light, index) => {
      const baseIntensity = light.intensity;
      light.intensity = baseIntensity + Math.sin(time * 0.5 + index) * 1.5 + Math.random() * 0.2;
    });
  }

  /**
   * Gets all floodlights for external access.
   */
  public getFloodlights(): THREE.SpotLight[] {
    return this.floodlights;
  }
}