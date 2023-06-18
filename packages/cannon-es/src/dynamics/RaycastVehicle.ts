import type { Rigidbody } from './Rigidbody';
import { Vec3 } from '../math/Vec3';
import { Quaternion } from '../math/Quaternion';
import { Ray } from '../collision/Ray';
import { WheelInfo } from './WheelInfo';
import type { WheelInfoOptions } from './WheelInfo';
import type { Transform } from '../math/Transform';
import type { Constraint } from '../joints/Constraint';
import type { World } from '../simulation/World';

/**
 * Vehicle helper class that casts rays from the wheel positions towards the ground and applies forces.
 */
export class RaycastVehicle {
  /** The car chassis body. */
  chassisBody: Rigidbody;
  /** The wheels. */
  wheelInfos: WheelInfo[];
  /** Will be set to true if the car is sliding. */
  sliding: boolean;
  world: World | null;
  /** Index of the right axis. x=0, y=1, z=2 */
  indexRightAxis: number;
  /** Index of the forward axis. x=0, y=1, z=2 */
  indexForwardAxis: number;
  /** Index of the up axis. x=0, y=1, z=2 */
  indexUpAxis: number;
  /** The constraints. */
  constraints: Constraint[];
  /** Optional pre-step callback. */
  preStepCallback: () => void;
  currentVehicleSpeedKmHour: number;
  /** Number of wheels on the ground. */
  numWheelsOnGround: number;

  constructor(
    chassisBody: Rigidbody,
    indexRightAxis?: number,
    indexForwardAxis?: number,
    indexUpAxis?: number
  ) {
    this.chassisBody = chassisBody;
    this.wheelInfos = [];
    this.sliding = false;
    this.world = null;
    this.indexRightAxis =
      typeof indexRightAxis !== 'undefined' ? indexRightAxis : 2;
    this.indexForwardAxis =
      typeof indexForwardAxis !== 'undefined' ? indexForwardAxis : 0;
    this.indexUpAxis = typeof indexUpAxis !== 'undefined' ? indexUpAxis : 1;
    this.constraints = [];
    this.preStepCallback = () => {};
    this.currentVehicleSpeedKmHour = 0;
    this.numWheelsOnGround = 0;
  }

  /**
   * Add a wheel. For information about the options, see `WheelInfo`.
   */
  addWheel(options: WheelInfoOptions = {}): number {
    const info = new WheelInfo(options);
    const index = this.wheelInfos.length;
    this.wheelInfos.push(info);

    return index;
  }

  /**
   * Set the steering value of a wheel.
   */
  setSteeringValue(value: number, wheelIndex: number): void {
    const wheel = this.wheelInfos[wheelIndex];
    wheel.steering = value;
  }

  /**
   * Set the wheel force to apply on one of the wheels each time step
   */
  applyEngineForce(value: number, wheelIndex: number): void {
    this.wheelInfos[wheelIndex].engineForce = value;
  }

  /**
   * Set the braking force of a wheel
   */
  setBrake(brake: number, wheelIndex: number): void {
    this.wheelInfos[wheelIndex].brake = brake;
  }

  /**
   * Add the vehicle including its constraints to the world.
   */
  addToWorld(world: World): void {
    world.addBody(this.chassisBody);
    const that = this;
    this.preStepCallback = () => {
      that.updateVehicle(world.dt);
    };
    world.addEventListener('preStep', this.preStepCallback);
    this.world = world;
  }

  /**
   * Get one of the wheel axles, world-oriented.
   */
  private getVehicleAxisWorld(axisIndex: number, result: Vec3): void {
    result.set(
      axisIndex === 0 ? 1 : 0,
      axisIndex === 1 ? 1 : 0,
      axisIndex === 2 ? 1 : 0
    );
    this.chassisBody.vectorToWorldFrame(result, result);
  }

  updateVehicle(timeStep: number): void {
    const wheelInfos = this.wheelInfos;
    const numWheels = wheelInfos.length;
    const chassisBody = this.chassisBody;

    for (let i = 0; i < numWheels; i++) {
      this.updateWheelTransform(i);
    }

    this.currentVehicleSpeedKmHour = 3.6 * chassisBody.velocity.length();

    const forwardWorld = new Vec3();
    this.getVehicleAxisWorld(this.indexForwardAxis, forwardWorld);

    if (forwardWorld.dot(chassisBody.velocity) < 0) {
      this.currentVehicleSpeedKmHour *= -1;
    }

    // simulate suspension
    for (let i = 0; i < numWheels; i++) {
      this.castRay(wheelInfos[i]);
    }

    this.updateSuspension(timeStep);

    const impulse = new Vec3();
    const relpos = new Vec3();
    for (let i = 0; i < numWheels; i++) {
      //apply suspension force
      const wheel = wheelInfos[i];
      let suspensionForce = wheel.suspensionForce;
      if (suspensionForce > wheel.maxSuspensionForce) {
        suspensionForce = wheel.maxSuspensionForce;
      }
      wheel.raycastResult.hitNormalWorld.scale(
        suspensionForce * timeStep,
        impulse
      );

      wheel.raycastResult.hitPointWorld.vsub(chassisBody.position, relpos);
      chassisBody.applyImpulse(impulse, relpos);
    }

    this.updateFriction(timeStep);

    const hitNormalWorldScaledWithProj = new Vec3();
    const fwd = new Vec3();
    const vel = new Vec3();
    for (let i = 0; i < numWheels; i++) {
      const wheel = wheelInfos[i];
      //const relpos = new Vec3();
      //wheel.chassisConnectionPointWorld.vsub(chassisBody.position, relpos);
      chassisBody.getVelocityAtWorldPoint(
        wheel.chassisConnectionPointWorld,
        vel
      );

      // Hack to get the rotation in the correct direction
      let m = 1;
      switch (this.indexUpAxis) {
        case 1:
          m = -1;
          break;
      }

      if (wheel.isInContact) {
        this.getVehicleAxisWorld(this.indexForwardAxis, fwd);
        const proj = fwd.dot(wheel.raycastResult.hitNormalWorld);
        wheel.raycastResult.hitNormalWorld.scale(
          proj,
          hitNormalWorldScaledWithProj
        );

        fwd.vsub(hitNormalWorldScaledWithProj, fwd);

        const proj2 = fwd.dot(vel);
        wheel.deltaRotation = (m * proj2 * timeStep) / wheel.radius;
      }

      if (
        (wheel.sliding || !wheel.isInContact) &&
        wheel.engineForce !== 0 &&
        wheel.useCustomSlidingRotationalSpeed
      ) {
        // Apply custom rotation when accelerating and sliding
        wheel.deltaRotation =
          (wheel.engineForce > 0 ? 1 : -1) *
          wheel.customSlidingRotationalSpeed *
          timeStep;
      }

      // Lock wheels
      if (Math.abs(wheel.brake) > Math.abs(wheel.engineForce)) {
        wheel.deltaRotation = 0;
      }

      wheel.rotation += wheel.deltaRotation; // Use the old value
      wheel.deltaRotation *= 0.99; // damping of rotation when not in contact
    }
  }

  updateSuspension(deltaTime: number): void {
    const chassisBody = this.chassisBody;
    const chassisMass = chassisBody.mass;
    const wheelInfos = this.wheelInfos;
    const numWheels = wheelInfos.length;

    for (let w_it = 0; w_it < numWheels; w_it++) {
      const wheel = wheelInfos[w_it];

      if (wheel.isInContact) {
        let force;

        // Spring
        const susp_length = wheel.suspensionRestLength;
        const current_length = wheel.suspensionLength;
        const length_diff = susp_length - current_length;

        force =
          wheel.suspensionStiffness *
          length_diff *
          wheel.clippedInvContactDotSuspension;

        // Damper
        const projected_rel_vel = wheel.suspensionRelativeVelocity;
        let susp_damping;
        if (projected_rel_vel < 0) {
          susp_damping = wheel.dampingCompression;
        } else {
          susp_damping = wheel.dampingRelaxation;
        }
        force -= susp_damping * projected_rel_vel;

        wheel.suspensionForce = force * chassisMass;
        if (wheel.suspensionForce < 0) {
          wheel.suspensionForce = 0;
        }
      } else {
        wheel.suspensionForce = 0;
      }
    }
  }

  /**
   * Remove the vehicle including its constraints from the world.
   */
  removeFromWorld(world: World): void {
    const constraints = this.constraints;
    world.removeBody(this.chassisBody);
    world.removeEventListener('preStep', this.preStepCallback);
    this.world = null;
  }

  castRay(wheel: WheelInfo): number {
    const rayvector = castRay_rayvector;
    const target = castRay_target;

    this.updateWheelTransformWorld(wheel);
    const chassisBody = this.chassisBody;

    let depth = -1;

    const raylen = wheel.suspensionRestLength + wheel.radius;

    wheel.directionWorld.scale(raylen, rayvector);
    const source = wheel.chassisConnectionPointWorld;
    source.vadd(rayvector, target);
    const raycastResult = wheel.raycastResult;

    const param = 0;

    raycastResult.reset();
    // Turn off ray collision with the chassis temporarily
    const oldState = chassisBody.collisionResponse;
    chassisBody.collisionResponse = false;

    // Cast ray against world
    this.world!.rayTest(source, target, raycastResult);
    chassisBody.collisionResponse = oldState;

    const object = raycastResult.body;

    wheel.raycastResult.groundObject = 0;

    if (object) {
      depth = raycastResult.distance;
      wheel.raycastResult.hitNormalWorld = raycastResult.hitNormalWorld;
      wheel.isInContact = true;

      const hitDistance = raycastResult.distance;
      wheel.suspensionLength = hitDistance - wheel.radius;

      // clamp on max suspension travel
      const minSuspensionLength =
        wheel.suspensionRestLength - wheel.maxSuspensionTravel;
      const maxSuspensionLength =
        wheel.suspensionRestLength + wheel.maxSuspensionTravel;
      if (wheel.suspensionLength < minSuspensionLength) {
        wheel.suspensionLength = minSuspensionLength;
      }
      if (wheel.suspensionLength > maxSuspensionLength) {
        wheel.suspensionLength = maxSuspensionLength;
        wheel.raycastResult.reset();
      }

      const denominator = wheel.raycastResult.hitNormalWorld.dot(
        wheel.directionWorld
      );

      const chassis_velocity_at_contactPoint = new Vec3();
      chassisBody.getVelocityAtWorldPoint(
        wheel.raycastResult.hitPointWorld,
        chassis_velocity_at_contactPoint
      );

      const projVel = wheel.raycastResult.hitNormalWorld.dot(
        chassis_velocity_at_contactPoint
      );

      if (denominator >= -0.1) {
        wheel.suspensionRelativeVelocity = 0;
        wheel.clippedInvContactDotSuspension = 1 / 0.1;
      } else {
        const inv = -1 / denominator;
        wheel.suspensionRelativeVelocity = projVel * inv;
        wheel.clippedInvContactDotSuspension = inv;
      }
    } else {
      //put wheel info as in rest position
      wheel.suspensionLength =
        wheel.suspensionRestLength + 0 * wheel.maxSuspensionTravel;
      wheel.suspensionRelativeVelocity = 0.0;
      wheel.directionWorld.scale(-1, wheel.raycastResult.hitNormalWorld);
      wheel.clippedInvContactDotSuspension = 1.0;
    }

    return depth;
  }

  updateWheelTransformWorld(wheel: WheelInfo): void {
    wheel.isInContact = false;
    const chassisBody = this.chassisBody;
    chassisBody.pointToWorldFrame(
      wheel.chassisConnectionPointLocal,
      wheel.chassisConnectionPointWorld
    );
    chassisBody.vectorToWorldFrame(wheel.directionLocal, wheel.directionWorld);
    chassisBody.vectorToWorldFrame(wheel.axleLocal, wheel.axleWorld);
  }

  /**
   * Update one of the wheel transform.
   * Note when rendering wheels: during each step, wheel transforms are updated BEFORE the chassis; ie. their position becomes invalid after the step. Thus when you render wheels, you must update wheel transforms before rendering them. See raycastVehicle demo for an example.
   * @param wheelIndex The wheel index to update.
   */
  updateWheelTransform(wheelIndex: number): void {
    const up = tmpVec4;
    const right = tmpVec5;
    const fwd = tmpVec6;

    const wheel = this.wheelInfos[wheelIndex];
    this.updateWheelTransformWorld(wheel);

    wheel.directionLocal.scale(-1, up);
    right.copy(wheel.axleLocal);
    up.cross(right, fwd);
    fwd.normalize();
    right.normalize();

    // Rotate around steering over the wheelAxle
    const steering = wheel.steering;
    const steeringOrn = new Quaternion();
    steeringOrn.setFromAxisAngle(up, steering);

    const rotatingOrn = new Quaternion();
    rotatingOrn.setFromAxisAngle(right, wheel.rotation);

    // World rotation of the wheel
    const q = wheel.worldTransform.quaternion;
    this.chassisBody.quaternion.mult(steeringOrn, q);
    q.mult(rotatingOrn, q);

    q.normalize();

    // world position of the wheel
    const p = wheel.worldTransform.position;
    p.copy(wheel.directionWorld);
    p.scale(wheel.suspensionLength, p);
    p.vadd(wheel.chassisConnectionPointWorld, p);
  }

  /**
   * Get the world transform of one of the wheels
   */
  getWheelTransformWorld(wheelIndex: number): Transform {
    return this.wheelInfos[wheelIndex].worldTransform;
  }

  updateFriction(timeStep: number): void {
    const surfNormalWS_scaled_proj = updateFriction_surfNormalWS_scaled_proj;

    //calculate the impulse, so that the wheels don't move sidewards
    const wheelInfos = this.wheelInfos;
    const numWheels = wheelInfos.length;
    const chassisBody = this.chassisBody;
    const forwardWS = updateFriction_forwardWS;
    const axle = updateFriction_axle;

    this.numWheelsOnGround = 0;

    for (let i = 0; i < numWheels; i++) {
      const wheel = wheelInfos[i];

      const groundObject = wheel.raycastResult.body;
      if (groundObject) {
        this.numWheelsOnGround++;
      }

      wheel.sideImpulse = 0;
      wheel.forwardImpulse = 0;
      if (!forwardWS[i]) {
        forwardWS[i] = new Vec3();
      }
      if (!axle[i]) {
        axle[i] = new Vec3();
      }
    }

    for (let i = 0; i < numWheels; i++) {
      const wheel = wheelInfos[i];

      const groundObject = wheel.raycastResult.body;

      if (groundObject) {
        const axlei = axle[i];
        const wheelTrans = this.getWheelTransformWorld(i);

        // Get world axle
        wheelTrans.vectorToWorldFrame(directions[this.indexRightAxis], axlei);

        const surfNormalWS = wheel.raycastResult.hitNormalWorld;
        const proj = axlei.dot(surfNormalWS);
        surfNormalWS.scale(proj, surfNormalWS_scaled_proj);
        axlei.vsub(surfNormalWS_scaled_proj, axlei);
        axlei.normalize();

        surfNormalWS.cross(axlei, forwardWS[i]);
        forwardWS[i].normalize();

        wheel.sideImpulse = resolveSingleBilateral(
          chassisBody,
          wheel.raycastResult.hitPointWorld,
          groundObject,
          wheel.raycastResult.hitPointWorld,
          axlei
        );

        wheel.sideImpulse *= sideFrictionStiffness2;
      }
    }

    const sideFactor = 1;
    const fwdFactor = 0.5;

    this.sliding = false;
    for (let i = 0; i < numWheels; i++) {
      const wheel = wheelInfos[i];
      const groundObject = wheel.raycastResult.body;

      let rollingFriction = 0;

      wheel.slipInfo = 1;
      if (groundObject) {
        const defaultRollingFrictionImpulse = 0;
        const maxImpulse = wheel.brake
          ? wheel.brake
          : defaultRollingFrictionImpulse;

        // btWheelContactPoint contactPt(chassisBody,groundObject,wheelInfraycastInfo.hitPointWorld,forwardWS[wheel],maxImpulse);
        // rollingFriction = calcRollingFriction(contactPt);
        rollingFriction = calcRollingFriction(
          chassisBody,
          groundObject,
          wheel.raycastResult.hitPointWorld,
          forwardWS[i],
          maxImpulse
        );

        rollingFriction += wheel.engineForce * timeStep;

        // rollingFriction = 0;
        const factor = maxImpulse / rollingFriction;
        wheel.slipInfo *= factor;
      }

      //switch between active rolling (throttle), braking and non-active rolling friction (nthrottle/break)

      wheel.forwardImpulse = 0;
      wheel.skidInfo = 1;

      if (groundObject) {
        wheel.skidInfo = 1;

        const maximp = wheel.suspensionForce * timeStep * wheel.frictionSlip;
        const maximpSide = maximp;

        const maximpSquared = maximp * maximpSide;

        wheel.forwardImpulse = rollingFriction; //wheelInfo.engineForce* timeStep;

        const x =
          (wheel.forwardImpulse * fwdFactor) / wheel.forwardAcceleration;
        const y = (wheel.sideImpulse * sideFactor) / wheel.sideAcceleration;

        const impulseSquared = x * x + y * y;

        wheel.sliding = false;
        if (impulseSquared > maximpSquared) {
          this.sliding = true;
          wheel.sliding = true;

          const factor = maximp / Math.sqrt(impulseSquared);

          wheel.skidInfo *= factor;
        }
      }
    }

    if (this.sliding) {
      for (let i = 0; i < numWheels; i++) {
        const wheel = wheelInfos[i];
        if (wheel.sideImpulse !== 0) {
          if (wheel.skidInfo < 1) {
            wheel.forwardImpulse *= wheel.skidInfo;
            wheel.sideImpulse *= wheel.skidInfo;
          }
        }
      }
    }

    // apply the impulses
    for (let i = 0; i < numWheels; i++) {
      const wheel = wheelInfos[i];

      const rel_pos = new Vec3();
      wheel.raycastResult.hitPointWorld.vsub(chassisBody.position, rel_pos);
      // cannons applyimpulse is using world coord for the position
      //rel_pos.copy(wheel.raycastResult.hitPointWorld);

      if (wheel.forwardImpulse !== 0) {
        const impulse = new Vec3();
        forwardWS[i].scale(wheel.forwardImpulse, impulse);
        chassisBody.applyImpulse(impulse, rel_pos);
      }

      if (wheel.sideImpulse !== 0) {
        const groundObject = wheel.raycastResult.body;

        const rel_pos2 = new Vec3();
        wheel.raycastResult.hitPointWorld.vsub(groundObject.position, rel_pos2);
        //rel_pos2.copy(wheel.raycastResult.hitPointWorld);
        const sideImp = new Vec3();
        axle[i].scale(wheel.sideImpulse, sideImp);

        // Scale the relative position in the up direction with rollInfluence.
        // If rollInfluence is 1, the impulse will be applied on the hitPoint (easy to roll over), if it is zero it will be applied in the same plane as the center of mass (not easy to roll over).
        chassisBody.vectorToLocalFrame(rel_pos, rel_pos);
        rel_pos['xyz'[this.indexUpAxis] as 'x' | 'y' | 'z'] *=
          wheel.rollInfluence;
        chassisBody.vectorToWorldFrame(rel_pos, rel_pos);
        chassisBody.applyImpulse(sideImp, rel_pos);

        //apply friction impulse on the ground
        sideImp.scale(-1, sideImp);
        groundObject.applyImpulse(sideImp, rel_pos2);
      }
    }
  }
}
