import { Vec3 } from '../../math/Vec3';
import { Quaternion } from '../../math/Quaternion';
import { Ray } from '../Ray';
import { MathUtils } from '../../math/utils';
import { Shape } from './Shape';

/**
 * A plane, facing in the Z direction. The plane has its surface at z=0 and everything below z=0 is assumed to be solid plane. To make the plane face in some other direction than z, you must put it inside a Body and rotate that body. See the demos.
 * @example
 *     const planeShape = new CANNON.Plane(Vec3, 39) TODO:fix
 *     const planeBody = new CANNON.Body({ mass: 0, shape:  planeShape })
 *     planeBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0) // make it face up
 *     world.addBody(planeBody)
 */
export class Plane extends Shape {
  override updateBoundingSphereRadius(): void {
    throw new Error('Method not implemented.');
  }
  override volume(): number {
    throw new Error('Method not implemented.');
  }
  override calculateLocalInertia(mass: number, target: Vec3): void {
    throw new Error('Method not implemented.');
  }
  override calculateWorldAABB(
    position: Vec3,
    rotation: Quaternion,
    min: Vec3,
    max: Vec3
  ): void {
    throw new Error('Method not implemented.');
  }
  /** Normal vector of the plane */
  normal: Vec3;
  /** Distance from the origin to the plane */
  distance: number;

  constructor(inNormal: Vec3, d: number) {
    super('Plane');
    this.normal = Vec3.Normalize(inNormal);
    this.distance = d;
  }
  /**
   * Return a version of the plane that faces the opposite direction
   */
  get flipped(): Plane {
    return new Plane(Vec3.negate(this.normal), -this.distance);
  }

  /**
   * Sets a plane using a point that lies within it plus a normal to orient it
   */
  SetNormalAndPosition(inNormal: Vec3, inPoint: Vec3): void {
    this.normal = Vec3.Normalize(inNormal);
    this.distance = -Vec3.Dot(this.normal, inPoint);
  }
  /**
   *  Sets a plane using three points that lie within it.  The points go around clockwise as you look down on the top surface of the plane.
   */
  Set3Points(a: Vec3, b: Vec3, c: Vec3): void {
    this.normal = Vec3.Normalize(Vec3.Cross(Vec3.sub(b, a), Vec3.sub(c, a)));
    this.distance = -Vec3.Dot(this.normal, a);
  }
  /**
   * Make the plane face the opposite direction
   */
  Flip(): void {
    this.normal = Vec3.negate(this.normal);
    this.distance = -this.distance;
  }
  /**
   * Translates the plane into a given direction
   */
  Translate(translation: Vec3): void {
    this.distance += Vec3.Dot(this.normal, translation);
  }
  /**
   * Calculates the closest point on the plane
   */
  ClosestPointOnPlane(point: Vec3): Vec3 {
    const pointToPlaneDistance = Vec3.Dot(this.normal, point) + this.distance;
    return Vec3.sub(point, Vec3.mult(this.normal, pointToPlaneDistance));
  }
  /**
   * Returns a signed distance from plane to point.
   */
  GetDistanceToPoint(point: Vec3): number {
    return Vec3.Dot(this.normal, point) + this.distance;
  }
  /**
   * Is a point on the positive side of the plane?
   */
  GetSide(point: Vec3): boolean {
    return Vec3.Dot(this.normal, point) + this.distance > 0.0;
  }
  /**
   * Are two points on the same side of the plane?
   */
  SameSide(inPt0: Vec3, inPt1: Vec3): boolean {
    const d0 = this.GetDistanceToPoint(inPt0);
    const d1 = this.GetDistanceToPoint(inPt1);
    return (d0 > 0.0 && d1 > 0.0) || (d0 <= 0.0 && d1 <= 0.0);
  }
  /**
   * Intersects a ray with the plane.
   */
  Raycast(ray: Ray, enter: number): boolean {
    const vdot = Vec3.Dot(ray.direction, this.normal);
    const ndot = -Vec3.Dot(ray.origin, this.normal) - this.distance;

    if (MathUtils.Approximately(vdot, 0.0)) {
      enter = 0.0;
      return false;
    }
    enter = ndot / vdot;

    return enter > 0.0;
  }
}
