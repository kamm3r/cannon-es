import { Vec3 } from '../math/Vec3';
import { Collider } from './Collider';
import { Collision } from './Collision';

export class CapsuleCollider extends Collider {
  center: Vec3;
  radius: number;
  height: number;
  direction: number;

  constructor(center: Vec3, radius: number, height: number) {
    super();
    this.center = center;
    this.radius = radius;
    this.height = height;
    this.direction = 1;
  }

  override OnCollisionEnter(collision: Collision): void {
    throw new Error('Method not implemented.');
  }
  override OnCollisionExit(collision: Collision): void {
    throw new Error('Method not implemented.');
  }
  override OnCollisionStay(collision: Collision): void {
    throw new Error('Method not implemented.');
  }
  override OnTriggerEnter(other: Collider): void {
    throw new Error('Method not implemented.');
  }
  override OnTriggerExit(other: Collider): void {
    throw new Error('Method not implemented.');
  }
  override OnTriggerStay(other: Collider): void {
    throw new Error('Method not implemented.');
  }
}
