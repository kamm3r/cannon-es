import { EventTarget } from '../utils/EventTarget';
import { Vec3 } from '../math/Vec3';
import { Quaternion } from '../math/Quaternion';

/**
 * BODY_TYPES
 */
export const BODY_TYPES = {
  /** DYNAMIC */
  DYNAMIC: 1,
  /** STATIC */
  STATIC: 2,
  /** KINEMATIC */
  KINEMATIC: 4,
} as const;

/**
 * BodyType
 */
export type BodyType = (typeof BODY_TYPES)[keyof typeof BODY_TYPES];

/**
 * BODY_SLEEP_STATES
 */
export const BODY_SLEEP_STATES = {
  /** AWAKE */
  AWAKE: 0,
  /** SLEEPY */
  SLEEPY: 1,
  /** SLEEPING */
  SLEEPING: 2,
} as const;

/**
 * BodySleepState
 */
export type BodySleepState =
  (typeof BODY_SLEEP_STATES)[keyof typeof BODY_SLEEP_STATES];

/**
 * Base class for all body types.
 * @example
 *     const collider = new CANNON.Sphere(1)
 *     const body = new CANNON.Rigidbody ()
 *     world.addBody(body)
 */
export class Rigidbody extends EventTarget {
  /** The angular drag of the object */
  angularDrag: number;
  /** The angular velocity vector of the rigidbody measured in radians per second */
  angularVelocity: Vec3;
  /** The center of mass relative to the transform's origin */
  centerOfMass: Vec3;
  /** The Rigidbody's collision detection mode */
  collisionDetectionMode: any;
  /** Controls which degrees of freedom are allowed for the simulation of this Rigidbody */
  constraints: any;
  /** Should collision detection be enabled? (By default always enabled) */
  detectCollision: boolean;
  /** The drag of the object */
  drag: number;
  /** Controls whether physics will change the rotation of the object */
  fixedRotation: boolean;
  /** The inertia tensor of this body, defined as a diagonal matrix in a reference frame positioned at this body's center of mass and rotated by inertiaTensorRotation */
  inertiaTensor: Vec3;
  /** The rotation of the inertia tensor */
  inertiaTensorRotation: Quaternion;
  /** Interpolation provides a way to manage the appearance of jitter in the movement of your Rigidbody at run time */
  interpolation: number;
  /** Controls whether physics affects the rigidbody */
  isKinematic: boolean;
  /** The mass of the body */
  mass: number;
  /** The maximum angular velocity of the rigidbody measured in radians per second. (Default 7) range { 0, infinity } */
  maxAngularVelocity: number;
  /** Maximum velocity of a rigidbody when moving out of penetrating state */
  maxDepenetrationVelocity: number;
  /** The maximum linear velocity of the rigidbody measured in meters per second */
  maxLinearVelocity: number;
  /** The position of the rigidbody  */
  position: Vec3;
  /** The rotation of the rigidbody */
  rotation: Quaternion;
  /** The mass-normalized energy threshold, below which objects start going to sleep */
  sleepThreshold: number;
  /** Controls whether gravity affects this rigidbody */
  useGravity: boolean;
  /** The velocity vector of the rigidbody. It represents the rate of change of Rigidbody position */
  velocity: Vec3;
  /** The center of mass of the rigidbody in world space */
  worldCenterOfMass: Vec3;

  constructor() {
    super();

    this.angularDrag = 0;
    this.angularVelocity = Vec3.zero;
    this.centerOfMass = Vec3.zero;
    this.collisionDetectionMode = 0;
    this.constraints = 0;
    this.detectCollision = true;
    this.drag = 0;
    this.fixedRotation = false;
    this.inertiaTensor = Vec3.zero;
    this.inertiaTensorRotation = Quaternion.identity;
    this.interpolation = 1;
    this.isKinematic = false;
    this.mass = 0;
    this.maxAngularVelocity = 1;
    this.maxDepenetrationVelocity = 1;
    this.maxLinearVelocity = 1;
    this.position = Vec3.zero;
    this.rotation = Quaternion.identity;
    this.sleepThreshold = 0;
    this.useGravity = false;
    this.velocity = Vec3.zero;
    this.worldCenterOfMass = Vec3.zero
  }

  /**
   * Apply force to a point of the body. This could for example be a point on the Body surface.
   * Applying force this way will add to Body.force and Body.torque.
   * @param force The amount of force to add.
   * @param relativePoint A point relative to the center of mass to apply the force on.
   */
  addForce(force: Vec3): void {
    // Compute produced rotational force
    // const rotForce = Body_applyForce_rotForce;
    const rotForce = Vec3.Cross(force, Vec3.zero);

    // Add linear force
    Vec3.add(force, Vec3.zero);

    // Add rotational force
    Vec3.add(rotForce, Vec3.zero);
    // TODO: wake up body if sleeping
  }

  /**
   * Apply torque to the body.
   * @param torque The amount of torque to add.
   */
  addTorque(torque: Vec3): void {
    // Add rotational force
    Vec3.add(torque, Vec3.zero);
    // TODO: wake up body if sleeping
  }


  /**
   * Applies a force to a rigidbody that simulates explosion effects
   * @param impulse The amount of impulse to add.
   * @param relativePoint A point relative to the center of mass to apply the force on.
   */
  addExplosiveForce(explosionForce: number, explosionPosition: Vec3, explosionRadius: number, upwardsModifier: number): void { }

  /**
   * The velocity of the rigidbody at the point worldPoint in global space
   * @param worldPoint
   * @param result
   * @return The result vector.
   */
  getPointVelocity(worldPoint: Vec3): Vec3 {
    const r = Vec3.sub(worldPoint, this.position);
    Vec3.Cross(this.angularVelocity, r);
    Vec3.add(this.velocity, r);
    return r;
  }
  /** The velocity relative to the rigidbody at the point relativePoint */
  getRelativePointVelocity(relativePoint: Vec3): Vec3 {
    const r = Vec3.sub(relativePoint, this.position);
    Vec3.Cross(this.angularVelocity, r);
    Vec3.add(this.velocity, r);
    return r;
  }

  isSleeping(): boolean { }
  move(position: Vec3, rotation: Quaternion): void { }
  movePosition(position: Vec3): void { }
  moveRotation(rotation: Quaternion): void { }
  setDensity(density: number): void { }
  sleep(): void { }
  wakeUp(): void { }

}
