import { ScaleThresholdConfig } from '../types';

export const SPHERE_RADIUS = 1500;

export const SCALE_THRESHOLDS: ScaleThresholdConfig = {
  sphere: { min: 2500, max: Infinity },
  stadium: { min: 500, max: 2500 },
  detail: { min: 1, max: 500 }
};

export const CAMERA_POSITIONS = {
  SPHERE_START: { x: 0, y: 0, z: 4000 },
  DETAIL_END: { x: 19.4319229067779, y: 9.883097359294862, z: 21.532109433098107 }
};

export const FLOODLIGHT_POSITIONS = [
  { x: -100, y: 150, z: -60, name: 'NW Tower' },
  { x: 100, y: 150, z: -60, name: 'NE Tower' },
  { x: -100, y: 150, z: 60, name: 'SW Tower' },
  { x: 100, y: 150, z: 60, name: 'SE Tower' }
];

export const COLORS = {
  SCENE_BACKGROUND: 0x001122,
  FOG_COLOR: 0x001122,
  AMBIENT_LIGHT: 0x404080,
  FLOODLIGHT: 0xffffff,
  RIM_LIGHT: 0x8899ff,
  FILL_LIGHT: 0xff8844
};

export const ANIMATION_DURATIONS = {
  INTRO_ZOOM: 5.0,
  CAMERA_TRANSITION: 2.0,
  VISIBILITY_FADE: 0.8
};