import { BroadPhase } from '../collision/BroadPhase';
import { Narrowphase } from '../collision/NarrowPhase';
import { Solver } from './Solver';
import { Material } from '../Material';
import { Rigidbody } from '../dynamics/Rigidbody';
import { Vec3 } from '../math/Vec3';
import { Constraint } from '../joints/Constraint';

/**
 * The physics world
 */
export class World {
  /**
   * Currently / last used timestep. Is set to -1 if not available. This value is updated before each internal step, which means that it is "fresh" inside event callbacks.
   */
  deltatime: number;

  /**
   * All the current contacts (instances of ContactEquation) in the world.
   */
  contacts: Set;

  subStepping: boolean;
  /**
   * Makes bodies go to sleep when they've been inactive.
   * @default true
   */
  allowSleep: boolean;
  /**
   * The gravity of the world.
   */
  gravity: Vec3;

  /**
   * The broadphase algorithm to use.
   * @default NaiveBroadphase
   */
  // broadphase: BroadPhase;

  /**
   * All bodies in this world
   */
  bodies: Set<Rigidbody>;

  /**
   * True if any bodies are not sleeping, false if every body is sleeping.
   */
  hasActiveBodies: boolean;

  /**
   * The solver algorithm to use.
   * @default GSSolver
   */
  // solver: Solver;
  constraints: Set<Constraint>;
  narrowphase: Narrowphase;

  /**
   * The default material of the bodies.
   */
  defaultMaterial: Material;

  doProfiling: boolean;
  profile: {
    solve: number;
    makeContactConstraints: number;
    broadphase: number;
    integrate: number;
    narrowphase: number;
  };

  /**
   * Time accumulator for interpolation.
   * @see https://gafferongames.com/game-physics/fix-your-timestep/
   */
  accumulator: number;

  constructor(dt = 1 / 60, gravity = Vec3.zero) {
    this.deltatime = dt;
    this.allowSleep = true;
    this.contacts = new Set<Rigidbody>();
    this.subStepping = false;

    this.gravity = gravity;

    // this.broadphase = new BroadPhaseMBP();
    this.bodies = new Set<Rigidbody>();
    this.hasActiveBodies = false;
    // this.solver = new GSSolver();
    this.constraints = new Set<Constraint>();
    this.narrowphase = new Narrowphase(this);
    this.defaultMaterial = new Material();
    this.doProfiling = false;
    this.profile = {
      solve: 0,
      makeContactConstraints: 0,
      broadphase: 0,
      integrate: 0,
      narrowphase: 0,
    };

    this.accumulator = 0;
  }

  getGravity(): Vec3 {
    return this.gravity;
  }
  setGravity(gravity: Vec3): Vec3 {
    return (this.gravity = gravity);
  }

  /**
   * Add a constraint to the simulation.
   */
  addConstraint(c: Constraint): void {
    this.constraints.add(c);
  }

  /**
   * Removes a constraint
   */
  removeConstraint(c: Constraint): void {
      this.constraints.delete(c);
  }

  /**
   * Add a rigid body to the simulation.
   * @todo If the simulation has not yet started, why recrete and copy arrays for each body? Accumulate in dynamic arrays in this case.
   * @todo Adding an array of bodies should be possible. This would save some loops too
   */
  addBody(body: Rigidbody): void {
    if (this.bodies.has(body)) {
      return;
    }
    this.bodies.add(body);
    body.position.copy(body.position);
    body.velocity.copy(body.velocity);
    if (body instanceof Rigidbody) {
      body.angularVelocity.copy(body.angularVelocity);
      body.rotation.copy(body.rotation);
    }
  }

  /**
   * Remove a rigid body from the simulation.
   */
  removeBody(body: Rigidbody): void {
    this.bodies.delete(body)
  }

  getBodies(): Rigidbody[] {
    return [...this.bodies.values()];
  }

  /**
   * Step the simulation forward keeping track of last called time
   * to be able to step the world at a fixed rate, independently of framerate.
   *
   * @param dt The fixed time step size to use (default: 1 / 60).
   * @param maxSubSteps Maximum number of fixed steps to take per function call (default: 10).
   * @see https://gafferongames.com/post/fix_your_timestep/
   * @example
   *     // Run the simulation independently of framerate every 1 / 60 ms
   *     world.fixedStep()
   */
  fixedStep(dt = 1 / 60, maxSubSteps = 10): void {}

  /**
   * Step the physics world forward in time.
   *
   * There are two modes. The simple mode is fixed timestepping without interpolation. In this case you only use the first argument. The second case uses interpolation. In that you also provide the time since the function was last used, as well as the maximum fixed timesteps to take.
   *
   * @param dt The fixed time step size to use.
   * @param timeSinceLastCalled The time elapsed since the function was last called.
   * @param maxSubSteps Maximum number of fixed steps to take per function call (default: 10).
   * @see https://web.archive.org/web/20180426154531/http://bulletphysics.org/mediawiki-1.5.8/index.php/Stepping_The_World#What_do_the_parameters_to_btDynamicsWorld::stepSimulation_mean.3F
   * @example
   *     // fixed timestepping without interpolation
   *     world.step(1 / 60)
   */
  step(dt: number, timeSinceLastCalled?: number, maxSubSteps = 10): void {}

  static Simulate(step: number): void {}
}
