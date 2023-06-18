import { Vec3 } from '../math/Vec3';

export type SpringModifiers = {
  stiffness: number;
  damping: number;
};
export type RestitutionModifiers = {
  restitution: number;
  velocityThreshold: number;
};

/** Constraint class*/
export abstract class Constraint {
  linear0: Vec3;
  geometricError: number;
  angular0: Vec3;
  velocityTarget: number;

  linear1: Vec3;
  minImpulse: number;
  angular1: Vec3;
  maxImpulse: number;

  spring: SpringModifiers;
  bounce: RestitutionModifiers;

  flags: number;
  solveHint: number;
}
