import { Geometry } from './Geometry';
import { Vec3 } from '../math/Vec3';

/**
 * A 3d box shape.
 * @example
 *     const size = 1
 *     const halfExtents = new CANNON.Vec3(size, size, size)
 *     const boxShape = new CANNON.Box(halfExtents)
 *     const boxBody = new CANNON.Body({ mass: 1, shape: boxShape })
 *     world.addBody(boxBody)
 */
export class BoxGeometry extends Geometry {
  /**
   * Half of the width, height, and depth of the boxThe half extents of the box.
   */
  halfExtents: Vec3;

  constructor(halfExtents = Vec3.zero) {
    super('Box');

    this.halfExtents = halfExtents;
  }
}
