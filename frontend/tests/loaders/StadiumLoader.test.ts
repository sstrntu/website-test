import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as THREE from 'three';
import { StadiumLoader } from '../../src/loaders/StadiumLoader';

// Mock Three.js loaders
const mockGLTFLoader = {
  load: vi.fn(),
  setDRACOLoader: vi.fn()
};

const mockDRACOLoader = {
  setDecoderPath: vi.fn()
};

// Mock GSAP
const mockGsap = {
  to: vi.fn()
};
global.gsap = mockGsap;

vi.mock('three/addons/loaders/GLTFLoader.js', () => ({
  GLTFLoader: vi.fn(() => mockGLTFLoader)
}));

vi.mock('three/addons/loaders/DRACOLoader.js', () => ({
  DRACOLoader: vi.fn(() => mockDRACOLoader)
}));

describe('StadiumLoader', () => {
  let stadiumLoader: StadiumLoader;

  beforeEach(() => {
    vi.clearAllMocks();
    stadiumLoader = new StadiumLoader();
  });

  describe('construction', () => {
    it('should initialize GLTF and Draco loaders', () => {
      expect(mockDRACOLoader.setDecoderPath).toHaveBeenCalledWith(
        'https://unpkg.com/three@0.158.0/examples/jsm/libs/draco/'
      );
      expect(mockGLTFLoader.setDRACOLoader).toHaveBeenCalledWith(mockDRACOLoader);
    });
  });

  describe('loadStadium', () => {
    it('should successfully load stadium model', async () => {
      // Mock successful load
      const mockStadium = new THREE.Group();
      mockStadium.add(new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshBasicMaterial()));
      
      const mockGLTF = {
        scene: mockStadium,
        animations: []
      };

      mockGLTFLoader.load.mockImplementation((path, onLoad) => {
        setTimeout(() => onLoad(mockGLTF), 0);
      });

      const result = await stadiumLoader.loadStadium('./test-stadium.glb');

      expect(result).toBe(mockStadium);
      expect(mockGLTFLoader.load).toHaveBeenCalledWith(
        './test-stadium.glb',
        expect.any(Function),
        expect.any(Function),
        expect.any(Function)
      );
    });

    it('should handle loading errors', async () => {
      const mockError = new Error('Failed to load model');
      
      mockGLTFLoader.load.mockImplementation((path, onLoad, onProgress, onError) => {
        setTimeout(() => onError(mockError), 0);
      });

      await expect(stadiumLoader.loadStadium('./non-existent.glb')).rejects.toThrow('Failed to load model');
    });

    it('should scale model if too small', async () => {
      const mockStadium = new THREE.Group();
      const smallMesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial());
      mockStadium.add(smallMesh);
      
      const mockGLTF = {
        scene: mockStadium,
        animations: []
      };

      mockGLTFLoader.load.mockImplementation((path, onLoad) => {
        setTimeout(() => onLoad(mockGLTF), 0);
      });

      const result = await stadiumLoader.loadStadium();

      // Model should be scaled up if too small
      expect(result.scale.x).toBeGreaterThan(1);
    });

    it('should handle animations if present', async () => {
      const mockStadium = new THREE.Group();
      const mockAnimation = new THREE.AnimationClip('test', 1, []);
      
      const mockGLTF = {
        scene: mockStadium,
        animations: [mockAnimation]
      };

      const mockMixer = {
        clipAction: vi.fn().mockReturnValue({
          play: vi.fn()
        })
      };

      // Mock AnimationMixer
      vi.spyOn(THREE, 'AnimationMixer').mockImplementation(() => mockMixer as any);

      mockGLTFLoader.load.mockImplementation((path, onLoad) => {
        setTimeout(() => onLoad(mockGLTF), 0);
      });

      await stadiumLoader.loadStadium();

      expect(THREE.AnimationMixer).toHaveBeenCalledWith(mockStadium);
      expect(mockMixer.clipAction).toHaveBeenCalledWith(mockAnimation);
    });
  });

  describe('updateStadiumVisibility', () => {
    it('should show stadium with animation', () => {
      const mockStadium = new THREE.Group();
      const mockMesh = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshBasicMaterial());
      mockStadium.add(mockMesh);

      stadiumLoader.updateStadiumVisibility(mockStadium, true, 1.0);

      expect(mockStadium.visible).toBe(true);
      expect(mockGsap.to).toHaveBeenCalledWith(
        mockMesh.material,
        expect.objectContaining({
          opacity: 1.0,
          duration: 1.0,
          ease: "power2.inOut"
        })
      );
    });

    it('should hide stadium without animation', () => {
      const mockStadium = new THREE.Group();
      const mockMesh = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshBasicMaterial());
      mockStadium.add(mockMesh);

      stadiumLoader.updateStadiumVisibility(mockStadium, false);

      expect(mockStadium.visible).toBe(false);
      expect(mockMesh.material.opacity).toBe(0.0);
    });

    it('should handle array of materials', () => {
      const mockStadium = new THREE.Group();
      const materials = [new THREE.MeshBasicMaterial(), new THREE.MeshBasicMaterial()];
      const mockMesh = new THREE.Mesh(new THREE.BoxGeometry(), materials);
      mockStadium.add(mockMesh);

      stadiumLoader.updateStadiumVisibility(mockStadium, true, 0.5);

      expect(mockGsap.to).toHaveBeenCalledTimes(2);
      materials.forEach(material => {
        expect(mockGsap.to).toHaveBeenCalledWith(
          material,
          expect.objectContaining({
            opacity: 1.0,
            duration: 0.5
          })
        );
      });
    });
  });
});