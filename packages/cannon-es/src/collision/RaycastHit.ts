import { Vec3 } from '../math/Vec3';
import type { Rigidbody } from '../dynamics/Rigidbody';
import { Collider } from './Collider';
import { Transform } from '../cannon-es';

/**
 * Storage for Ray casting data
 */
export class RaycastHit {
  barycentricCoordinate: Vec3;
  collider: Collider;
  distance: number;
  normal: Vec3;
  point: Vec3;
  rigidbody: Rigidbody;
  transform: Transform;

  constructor() {
    this.collider;
    this.rigidbody;
  }
}
