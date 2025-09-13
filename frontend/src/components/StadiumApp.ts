import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

import { Sphere } from './Sphere';
import { LightingSystem } from './LightingSystem';
import { StadiumLoader } from '../loaders/StadiumLoader';
import { detectPerformance, getPerformanceSettings } from '../utils/performance';
import { 
  COLORS, 
  SCALE_THRESHOLDS, 
  CAMERA_POSITIONS, 
  ANIMATION_DURATIONS 
} from '../utils/constants';
import { SceneElements, AppState, ZoomScale } from '../types';

/**
 * Main application class that orchestrates the 3D stadium experience.
 */
export class StadiumApp {
  private container: HTMLElement;
  private sceneElements: Partial<SceneElements> = {
    floodlights: [],
    atmosphericParticles: [],
    clickableTargets: []
  };
  
  private appState: AppState = {
    currentZoomScale: 'sphere',
    sphereVisible: true,
    stadiumTextVisible: false,
    stadiumDetailVisible: false,
    hasSeenIntroSequence: false,
    isAnimationPlaying: true,
    isTransitioning: false
  };

  private config = detectPerformance();
  private settings = getPerformanceSettings(this.config);
  
  private sphere?: Sphere;
  private lightingSystem?: LightingSystem;
  private stadiumLoader = new StadiumLoader();

  constructor(container: HTMLElement) {
    this.container = container;
  }

  /**
   * Initializes the 3D scene and all components.
   */
  public async init(): Promise<void> {
    console.log('Initializing Stadium App...');
    
    // Scene setup
    this.initScene();
    this.initCamera();
    this.initRenderer();
    this.initControls();
    
    // Create components
    this.sphere = new Sphere();
    this.sceneElements.scene!.add(this.sphere.getObject());
    this.sceneElements.clickableTargets!.push(this.sphere.getObject());
    
    // Setup lighting
    this.lightingSystem = new LightingSystem(this.sceneElements.scene!, this.config);
    this.sceneElements.floodlights = this.lightingSystem.getFloodlights();
    
    // Load stadium
    try {
      this.sceneElements.stadium = await this.stadiumLoader.loadStadium();
      this.sceneElements.scene!.add(this.sceneElements.stadium);
      console.log('Stadium loaded and added to scene');
    } catch (error) {
      console.error('Failed to load stadium:', error);
      console.log('Continuing without stadium model');
    }
    
    // Setup post-processing if enabled
    if (this.settings.postProcessing) {
      this.initPostProcessing();
    }
    
    // Setup event listeners
    this.setupEventListeners();
    
    // Start intro sequence
    this.startIntroSequence();
    
    console.log('Stadium App initialized successfully');
  }

  /**
   * Initializes the Three.js scene.
   */
  private initScene(): void {
    this.sceneElements.scene = new THREE.Scene();
    this.sceneElements.scene.background = new THREE.Color(COLORS.SCENE_BACKGROUND);
    this.sceneElements.scene.fog = new THREE.Fog(COLORS.FOG_COLOR, 50, 8000);
  }

  /**
   * Initializes the camera.
   */
  private initCamera(): void {
    this.sceneElements.camera = new THREE.PerspectiveCamera(
      45, 
      window.innerWidth / window.innerHeight, 
      1, 
      15000
    );
    this.sceneElements.camera.position.set(
      CAMERA_POSITIONS.SPHERE_START.x,
      CAMERA_POSITIONS.SPHERE_START.y,
      CAMERA_POSITIONS.SPHERE_START.z
    );
  }

  /**
   * Initializes the WebGL renderer.
   */
  private initRenderer(): void {
    this.sceneElements.renderer = new THREE.WebGLRenderer({ 
      antialias: this.settings.antialias,
      powerPreference: "default"
    });
    
    this.sceneElements.renderer.setPixelRatio(this.settings.pixelRatio);
    this.sceneElements.renderer.setSize(window.innerWidth, window.innerHeight);
    this.sceneElements.renderer.shadowMap.enabled = this.settings.shadows;
    this.sceneElements.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.sceneElements.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.sceneElements.renderer.toneMappingExposure = 1.2;
    
    this.container.appendChild(this.sceneElements.renderer.domElement);
  }

  /**
   * Initializes orbit controls.
   */
  private initControls(): void {
    this.sceneElements.controls = new OrbitControls(
      this.sceneElements.camera!, 
      this.sceneElements.renderer!.domElement
    );
    
    this.sceneElements.controls.enableDamping = true;
    this.sceneElements.controls.dampingFactor = 0.08;
    this.sceneElements.controls.minDistance = 1;
    this.sceneElements.controls.maxDistance = 6000;
    this.sceneElements.controls.maxPolarAngle = Math.PI * 0.48;
    this.sceneElements.controls.autoRotate = false;
    this.sceneElements.controls.autoRotateSpeed = 0.3;
    this.sceneElements.controls.zoomSpeed = 1.2;
    this.sceneElements.controls.panSpeed = 0.8;
  }

  /**
   * Initializes post-processing effects.
   */
  private initPostProcessing(): void {
    if (!this.settings.postProcessing) return;

    this.sceneElements.composer = new EffectComposer(this.sceneElements.renderer!);
    const renderPass = new RenderPass(this.sceneElements.scene!, this.sceneElements.camera!);
    this.sceneElements.composer.addPass(renderPass);

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      2.0,    // Higher bloom strength for stadium lights
      0.3,    // Bloom radius
      0.95    // Bloom threshold - only bright lights bloom
    );
    this.sceneElements.composer.addPass(bloomPass);
    console.log('Enhanced bloom post-processing enabled');
  }

  /**
   * Sets up event listeners for window resize and keyboard controls.
   */
  private setupEventListeners(): void {
    window.addEventListener('resize', this.onWindowResize.bind(this));
    window.addEventListener('keydown', this.onKeyDown.bind(this));
  }

  /**
   * Starts the intro zoom sequence.
   */
  private startIntroSequence(): void {
    console.log('Starting sphere-to-stadium zoom sequence...');
    
    // Disable user controls during intro
    this.sceneElements.controls!.enableRotate = false;
    this.sceneElements.controls!.enableZoom = false;
    this.sceneElements.controls!.enablePan = false;
    
    console.log('Starting instant zoom to stadium...');
    
    // Immediate continuous zoom from sphere directly to detail view
    if (typeof gsap !== 'undefined') {
      gsap.to(this.sceneElements.camera!.position, {
        x: CAMERA_POSITIONS.DETAIL_END.x,
        y: CAMERA_POSITIONS.DETAIL_END.y,
        z: CAMERA_POSITIONS.DETAIL_END.z,
        duration: ANIMATION_DURATIONS.INTRO_ZOOM,
        ease: "power1.inOut",
        onComplete: () => {
          // Re-enable user controls after intro
          this.sceneElements.controls!.enableRotate = true;
          this.sceneElements.controls!.enableZoom = true;
          this.sceneElements.controls!.enablePan = true;
          this.appState.hasSeenIntroSequence = true;
          
          console.log('Zoom sequence complete - user controls enabled');
        }
      });
    }
  }

  /**
   * Starts the animation loop.
   */
  public start(): void {
    this.animate();
  }

  /**
   * Main animation loop.
   */
  private animate(): void {
    requestAnimationFrame(() => this.animate());
    
    // Update scale-based visibility
    this.updateScaleBasedVisibility();

    // Animations
    if (this.appState.isAnimationPlaying) {
      const time = Date.now() * 0.001;
      
      // Dynamic floodlight intensity for dramatic effect (only in detail mode)
      if (this.lightingSystem && this.appState.currentZoomScale === 'detail') {
        this.lightingSystem.animateFloodlights(time);
      }
    }

    this.sceneElements.controls!.update();

    // Render
    if (this.sceneElements.composer && this.settings.postProcessing) {
      this.sceneElements.composer.render();
    } else {
      this.sceneElements.renderer!.render(this.sceneElements.scene!, this.sceneElements.camera!);
    }
  }

  /**
   * Updates visibility of scene elements based on camera distance.
   */
  private updateScaleBasedVisibility(): void {
    const distance = this.sceneElements.camera!.position.distanceTo(
      this.sceneElements.controls!.target
    );
    
    let newScale: ZoomScale = this.appState.currentZoomScale;
    if (distance >= SCALE_THRESHOLDS.sphere.min) {
      newScale = 'sphere';
    } else if (distance >= SCALE_THRESHOLDS.stadium.min) {
      newScale = 'stadium';
    } else {
      newScale = 'detail';
    }
    
    // If scale changed, update visibility
    if (newScale !== this.appState.currentZoomScale) {
      this.appState.currentZoomScale = newScale;
      this.updateElementVisibility();
    }
  }

  /**
   * Updates element visibility based on current zoom scale.
   */
  private updateElementVisibility(): void {
    // Sphere visibility
    const shouldShowSphere = this.appState.currentZoomScale === 'sphere';
    if (shouldShowSphere !== this.appState.sphereVisible) {
      this.appState.sphereVisible = shouldShowSphere;
      this.sphere?.updateVisibility(shouldShowSphere);
    }
    
    // Stadium visibility
    const shouldShowStadium = this.appState.currentZoomScale !== 'sphere';
    if (this.sceneElements.stadium) {
      this.stadiumLoader.updateStadiumVisibility(
        this.sceneElements.stadium, 
        shouldShowStadium
      );
    }
    
    // Detail visibility (floodlight intensity)
    const shouldShowDetail = this.appState.currentZoomScale === 'detail';
    if (shouldShowDetail !== this.appState.stadiumDetailVisible) {
      this.appState.stadiumDetailVisible = shouldShowDetail;
      this.lightingSystem?.updateFloodlightIntensity(shouldShowDetail);
    }
  }

  /**
   * Handles window resize events.
   */
  private onWindowResize(): void {
    if (!this.sceneElements.camera || !this.sceneElements.renderer) return;
    
    this.sceneElements.camera.aspect = window.innerWidth / window.innerHeight;
    this.sceneElements.camera.updateProjectionMatrix();
    this.sceneElements.renderer.setSize(window.innerWidth, window.innerHeight);
    
    if (this.sceneElements.composer) {
      this.sceneElements.composer.setSize(window.innerWidth, window.innerHeight);
    }
  }

  /**
   * Handles keyboard input for camera controls.
   */
  private onKeyDown(event: KeyboardEvent): void {
    if (!this.sceneElements.camera || typeof gsap === 'undefined') return;

    switch(event.key.toLowerCase()) {
      case 'g':
        // Jump to sphere scale
        gsap.to(this.sceneElements.camera.position, {
          x: CAMERA_POSITIONS.SPHERE_START.x,
          y: CAMERA_POSITIONS.SPHERE_START.y, 
          z: CAMERA_POSITIONS.SPHERE_START.z,
          duration: 1.5,
          ease: "power2.inOut"
        });
        break;
      case 'd':
        // Jump to detail scale
        gsap.to(this.sceneElements.camera.position, {
          x: CAMERA_POSITIONS.DETAIL_END.x,
          y: CAMERA_POSITIONS.DETAIL_END.y,
          z: CAMERA_POSITIONS.DETAIL_END.z,
          duration: 1.5,
          ease: "power2.inOut"
        });
        break;
    }
  }
}