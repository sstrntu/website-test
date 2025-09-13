import * as THREE from 'three';

export interface CameraPosition {
  x: number;
  y: number;
  z: number;
}

export interface CameraTarget {
  x: number;
  y: number;
  z: number;
}

export interface CameraTransition {
  position: CameraPosition;
  target: CameraTarget;
  name: string;
}

export interface ScaleThresholds {
  min: number;
  max: number;
}

export interface ScaleThresholdConfig {
  sphere: ScaleThresholds;
  stadium: ScaleThresholds; 
  detail: ScaleThresholds;
}

export type ZoomScale = 'sphere' | 'stadium' | 'detail';

export interface AtmosphericParticleSystem {
  particles: THREE.Points;
  type: 'dust' | 'mist';
  geometry: THREE.BufferGeometry;
}

export interface AppConfig {
  performanceMode: 'high' | 'low';
  isMobile: boolean;
  isLowEnd: boolean;
  effectsEnabled: boolean;
}

export interface SceneElements {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  controls: any; // OrbitControls
  composer?: any; // EffectComposer
  
  // 3D Objects
  sphere?: THREE.Group;
  stadium?: THREE.Object3D;
  textMesh?: THREE.Object3D;
  groundReflector?: any; // Reflector
  groundMist?: THREE.Mesh;
  
  // Arrays
  floodlights: THREE.SpotLight[];
  atmosphericParticles: AtmosphericParticleSystem[];
  clickableTargets: THREE.Object3D[];
}

export interface AppState {
  currentZoomScale: ZoomScale;
  sphereVisible: boolean;
  stadiumTextVisible: boolean;
  stadiumDetailVisible: boolean;
  hasSeenIntroSequence: boolean;
  isAnimationPlaying: boolean;
  isTransitioning: boolean;
  activeOrbitTween?: any; // GSAP Tween
}