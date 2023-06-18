import { Transform, Vec3 } from '../cannon-es';
import { Rigidbody } from '../dynamics/Rigidbody';
import { Collider } from './Collider';

export abstract class Collision {
  private header: boolean;
  private pair: boolean;
  private flipped: boolean;

  impulse: Vec3;
  relativeVelocity: Vec3;
  rigidbody: Rigidbody;
  articulationBody: ArticulationBody;
  body: any;
  collider: Collider;
  transform: Transform;
  gameObject: Object;

  constructor() {
    this.flipped = false;
  }
  /** ContactPoint The contact at the specified index */
  GetContact(index: number) {
    return index;
  } /** Returns the number of contacts placed in the contacts array. */
  GetContacts(contacts: number): number {
    return contacts;
  }
}
