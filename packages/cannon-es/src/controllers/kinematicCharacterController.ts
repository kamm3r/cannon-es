import { Quaternion } from "../../math/Quaternion";
import { Vec3 } from "../../math/Vec3";

export class KinematicCharacterController {
  halfHeight: number;
  // ghostObject
  convexShape: any;

  maxPenetrationDepth: number;
  verticalVelocity: number;
  verticalOffset: number;
  fallSpeed: number;
  jumpSpeed: number;
  SetJumpSpeed: number;
  maxJumpHeight: number;
  maxSlopeRadians: number;
  maxSlopeCosine: number;
  gravity: number;

  turnAngle: number;

  stepHeight: number;

  walkDirection: Vec3;
  currentStepOffset: number;
  targetPosition: Vec3;

  currentOrientation: Quaternion;
  targetOrientation: Quaternion;

  touschingContact: boolean;
  touschingNormal: Vec3;

  linearDamping: number;
  angularDamping: number;

  wasOnGround: boolean;
  wasJumping: boolean;
  useGhostObjectSweepTest: boolean;
  useWalkDirection: boolean;
  velocityTimeInterval: number;
  up: Vec3;
  jumpAxis: Vec3;
}
