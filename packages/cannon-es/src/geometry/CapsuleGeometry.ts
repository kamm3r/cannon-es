import { Geometry } from './Geometry';

export class CapsuleGeometry extends Geometry {
  /**
   * The radius of the capsule.
   */
  radius: number;
  /**
   * half of the capsule’s height, measured between the centers of the hemispherical ends
   */
  halfHeight: number;

  constructor(radius = 0.0, halfHeight = 0.0) {
    super('Capsule');
    this.radius = radius;
    this.halfHeight = halfHeight;
  }
}
