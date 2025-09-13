import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as THREE from 'three';
import { Sphere } from '../../src/components/Sphere';

// Mock GSAP
const mockGsap = {
  to: vi.fn()
};
global.gsap = mockGsap;

describe('Sphere Component', () => {
  let sphere: Sphere;

  beforeEach(() => {
    vi.clearAllMocks();
    sphere = new Sphere();
  });

  describe('construction', () => {
    it('should create a sphere object', () => {
      expect(sphere).toBeInstanceOf(Sphere);
      expect(sphere.getObject()).toBeInstanceOf(THREE.Group);
    });

    it('should create wireframe lines for latitude and longitude', () => {
      const object = sphere.getObject();
      
      // Should have lines for latitude (15) + longitude (16) = 31 total
      expect(object.children.length).toBe(31);
      
      // All children should be Line objects
      object.children.forEach(child => {
        expect(child).toBeInstanceOf(THREE.Line);
        expect(child.material).toBeInstanceOf(THREE.LineBasicMaterial);
      });
    });

    it('should position sphere at origin', () => {
      const object = sphere.getObject();
      expect(object.position.x).toBe(0);
      expect(object.position.y).toBe(0);
      expect(object.position.z).toBe(0);
    });

    it('should use white color for wireframe lines', () => {
      const object = sphere.getObject();
      const firstLine = object.children[0] as THREE.Line;
      const material = firstLine.material as THREE.LineBasicMaterial;
      
      expect(material.color.getHex()).toBe(0xffffff);
    });
  });

  describe('updateVisibility', () => {
    it('should call GSAP animation when visible is true', () => {
      sphere.updateVisibility(true, 1.0);

      expect(mockGsap.to).toHaveBeenCalledTimes(2);
      
      // First call should be for opacity animation
      const firstCall = mockGsap.to.mock.calls[0];
      expect(firstCall[1]).toEqual(
        expect.objectContaining({
          opacity: 1.0,
          duration: 1.0,
          ease: "power2.inOut"
        })
      );

      // Second call should be for scale animation  
      const secondCall = mockGsap.to.mock.calls[1];
      expect(secondCall[1]).toEqual(
        expect.objectContaining({
          x: 1.0,
          y: 1.0,
          z: 1.0,
          duration: 1.0,
          ease: "power2.inOut"
        })
      );
    });

    it('should call GSAP animation when visible is false', () => {
      sphere.updateVisibility(false, 0.5);

      expect(mockGsap.to).toHaveBeenCalledTimes(2);
      
      // First call should be for opacity animation
      const firstCall = mockGsap.to.mock.calls[0];
      expect(firstCall[1]).toEqual(
        expect.objectContaining({
          opacity: 0.0,
          duration: 0.5,
          ease: "power2.inOut"
        })
      );

      // Second call should be for scale animation
      const secondCall = mockGsap.to.mock.calls[1];
      expect(secondCall[1]).toEqual(
        expect.objectContaining({
          x: 0.8,
          y: 0.8,
          z: 0.8,
          duration: 0.5,
          ease: "power2.inOut"
        })
      );
    });

    it('should use default duration when not provided', () => {
      sphere.updateVisibility(true);

      expect(mockGsap.to).toHaveBeenCalledTimes(2);
      
      const firstCall = mockGsap.to.mock.calls[0];
      expect(firstCall[1].duration).toBe(0.8);
    });

    it('should handle case when GSAP is not available', () => {
      // Temporarily remove GSAP
      const originalGsap = global.gsap;
      global.gsap = undefined;

      expect(() => {
        sphere.updateVisibility(true);
      }).not.toThrow();

      // Restore GSAP
      global.gsap = originalGsap;
    });
  });

  describe('getObject', () => {
    it('should return the same THREE.Group instance', () => {
      const object1 = sphere.getObject();
      const object2 = sphere.getObject();
      
      expect(object1).toBe(object2);
      expect(object1).toBeInstanceOf(THREE.Group);
    });
  });
});