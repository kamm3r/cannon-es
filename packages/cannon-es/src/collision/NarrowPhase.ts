import type { World } from '../simulation/World';

// Naming rule: based of the order in SHAPE_TYPES,
// the first part of the method is formed by the
// shape type that comes before, in the second part
// there is the shape type that comes after in the SHAPE_TYPES list
export const COLLISION_TYPES = {} as const;

export type CollisionType =
  (typeof COLLISION_TYPES)[keyof typeof COLLISION_TYPES];

/**
 * Helper class for the World. Generates ContactEquations.
 * @todo Sphere-ConvexPolyhedron contacts
 * @todo Contact reduction
 * @todo should move methods to prototype
 */
export class Narrowphase {
  /**
   * Internal storage of pooled contact points.
   */
  // contactPointPool: ContactEquation[];
  // frictionEquationPool: FrictionEquation[];
  // result: ContactEquation[];
  // frictionResult: FrictionEquation[];
  world: World;
  // currentContactMaterial: ContactMaterial;
  enableFrictionReduction: boolean;

  constructor(world: World) {
    // this.contactPointPool = [];
    // this.frictionEquationPool = [];
    // this.result = [];
    // this.frictionResult = [];
    this.world = world;
    // this.currentContactMaterial = world.defaultContactMaterial;
    this.enableFrictionReduction = false;
  }
}
