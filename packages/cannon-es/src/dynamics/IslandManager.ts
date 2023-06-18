import { Vec3 } from '../math/Vec3';

export class Island {
  bodyCapacity: number;
  contactCapacity: number;
  jointCapacity: number;

  bodyCount: number;
  contactCount: number;
  jointCount: number;

  bodies: number;
  contacts: number;
  joints: number;

  velocities: Vec3;
  translations: Vec3;
  constructor(
    bodyCapacity: number,
    contactCapacity: number,
    jointCapacity: number
  ) {
    this.bodyCapacity = bodyCapacity;
    this.contactCapacity = contactCapacity;
    this.jointCapacity = jointCapacity;

    this.bodyCount = 0;
    this.contactCount = 0;
    this.jointCount = 0;

    this.bodies = 0;
    this.contacts = 0;
    this.joints = 0;

    this.velocities = Vec3.zero;
    this.translations = Vec3.zero;
  }

  Solve(
    profile: unknown,
    step: number,
    gravity: Vec3,
    allowSleep: boolean
  ): void {}
}
