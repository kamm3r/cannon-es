import { Collider } from "../../collision/Collider";
import { Collision } from "../../collision/Collision";
import { Vec3 } from "../../math/Vec3";

export class characterController extends Collider {
    override OnCollisionEnter(collision: Collision): void {
        throw new Error("Method not implemented.");
    }
    override OnCollisionExit(collision: Collision): void {
        throw new Error("Method not implemented.");
    }
    override OnCollisionStay(collision: Collision): void {
        throw new Error("Method not implemented.");
    }
    override OnTriggerEnter(other: Collider): void {
        throw new Error("Method not implemented.");
    }
    override OnTriggerExit(other: Collider): void {
        throw new Error("Method not implemented.");
    }
    override OnTriggerStay(other: Collider): void {
        throw new Error("Method not implemented.");
    }
    velocity: Vec3;
    radius: number;
    height: number;
    isGrounded: boolean;
    center: Vec3;
    slopeLimit: number;
    stepOffset: number;
    skinWidth: number;
    minMoveDistance: number;
    detectCollisions: boolean;
    setWalkDirection(walkDirection: Vec3): void;
    serVelocityForTimeInterval(
        velocity: Vec3,
        timeInterval: number
    ): void;
    reset<T>(collisionWorld: T): void;
    warp(origin: Vec3): void;

    preStep<T>(collisionWorld: T): void;
    playerStep<T>(collisionWorld: T, dt: number): void;
    canJump(): boolean;
    jump(dir: Vec3): void;

    onGround(): boolean;
    setUpInterpolate(value: boolean): void;
}
