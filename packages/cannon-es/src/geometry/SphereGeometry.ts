import { Geometry } from './Geometry';

/**
 * Spherical shape
 * @example
 *     const radius = 1
 *     const sphereShape = new CANNON.Sphere(radius)
 *     const sphereBody = new CANNON.Body({ mass: 1, shape: sphereShape })
 *     world.addBody(sphereBody)
 */
export class SphereGeometry extends Geometry {
  /**
   * The radius of the sphere
   */
  radius: number;

  constructor(radius = 0.0) {
    super('Sphere');

    this.radius = radius;
  }
}
