import { Material } from '../Material';
import { Vec3 } from '../math/Vec3';
import { Rigidbody } from '../dynamics/Rigidbody';
import { AABB } from './shapes/AABB';
import { Ray } from './Ray';
import { Collision } from './Collision';
import { RaycastHit } from './RaycastHit';

export abstract class Collider {
  enabled: boolean = false;
  attachedRigidbody: Rigidbody;
  attachedArticulationBody: Rigidbody;
  isTrigger: boolean = false;
  contactOffset: number;
  aabb: AABB;
  hasModifiableContacts: boolean = false;
  providesContacts: boolean = false;
  material: Material;

  ClosestPoint(position: Vec3): Vec3 {
    return position;
  }
  ClosestPointOnAABB(position: Vec3): Vec3 {
    return position;
  }
  GetGeometry<T>(): T {
    return T;
  }
  Raycast(ray: Ray, hitInfo: RaycastHit, maxDistance: number): boolean {
    return true;
  }

  abstract OnCollisionEnter(collision: Collision): void;
  abstract OnCollisionExit(collision: Collision): void;
  abstract OnCollisionStay(collision: Collision): void;
  abstract OnTriggerEnter(other: Collider): void;
  abstract OnTriggerExit(other: Collider): void;
  abstract OnTriggerStay(other: Collider): void;
}
