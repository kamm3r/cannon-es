import { Rigidbody, Vec3 } from '../cannon-es';

export class PrismaticJoint {
  bodyA: Rigidbody;
  bodyB: Rigidbody;
  localAnchorA: number;
  localAnchorB: number;
  localAxisA: number;
  referenceAngle: number;
  impulse: Vec3;
  axialMass: number;
  motorImpulse: number;
  lowerImpulse: number;
  upperImpulse: number;
  lowerTranslation: number;
  upperTranslation: number;

  getPositon(): number {}
  getVelicty(): number {}
  setLimit(): void {}
  getLimit(): void {}
}
