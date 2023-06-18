import { Vec3 } from '../../math/Vec3';
import type { Ray } from '../Ray';

/**
 * Axis aligned bounding box class.
 */
export class AABB {
  /**
   * The center of the bounding box.
   */
  accessor center: Vec3;
  /**
   * The extents of the Bounding Box. This is always half of the size of the Bounds.
   */
  accessor extents: Vec3;

  constructor(center: Vec3, size: Vec3) {
    this.center = center;
    this.extents = Vec3.mult(size, 0.5);
  }
  get min(): Vec3 {
    return Vec3.sub(this.center, this.extents);
  }
  get max(): Vec3 {
    return Vec3.add(this.center, this.extents);
  }
  get size(): Vec3 {
    return Vec3.mult(this.extents, 2.0);
  }

  set min(value: Vec3) {
    this.SetMinMax(value, this.max);
  }
  set max(value: Vec3) {
    this.SetMinMax(this.min, value);
  }

  set size(value: Vec3) {
    this.extents = Vec3.mult(value, 0.5);
  }

  SetMinMax(min: Vec3, max: Vec3): void {
    this.extents = Vec3.mult(Vec3.sub(max, min), 0.5);
    this.center = Vec3.add(min, this.extents);
  }

  /**
   *  Expand the bounds by increasing its /size/ by /amount/ along each side.
   */
  Expand(amount: Vec3): void {
    Vec3.add(this.extents, Vec3.mult(amount, 0.5));
  }

  /**
   * Does another bounding box intersect with this bounding box.
   */
  Intersects(aabb: AABB): boolean {
    return (
      this.min.x <= aabb.max.x &&
      this.max.x >= aabb.min.x &&
      this.min.y <= aabb.max.y &&
      this.max.y >= aabb.min.y &&
      this.min.z <= aabb.max.z &&
      this.max.z >= aabb.min.z
    );
  }

  /**
   *  Grows the Bounds to include the /point/.
   */
  Encapsulate(point: Vec3): void {
    this.SetMinMax(Vec3.Min(this.min, point), Vec3.Max(this.max, point));
  }

  ClosestPoint(point: Vec3): Vec3 {
    return Vec3.Clamp(point, this.min, this.max);
  }

  Contains(point: Vec3): boolean {
    return (
      this.min.x <= point.x &&
      this.max.x >= point.x &&
      this.min.y <= point.y &&
      this.max.y >= point.y &&
      this.min.z <= point.z &&
      this.max.z >= point.z
    );
  }

  /**
   * The smallest squared distance between the point and this bounding box.
   */
  SqrDistance(point: Vec3): number {
    return Vec3.SqrDistance(this.ClosestPoint(point), point);
  }

  /**
   * Check if the AABB is hit by a ray.
   */
  IntersectRay(ray: Ray): boolean {
    const { direction, origin } = ray;
    let t = 0;

    // ray.direction is unit direction vector of ray
    const dirFracX = 1 / direction.x;
    const dirFracY = 1 / direction.y;
    const dirFracZ = 1 / direction.z;

    // this.lowerBound is the corner of AABB with minimal coordinates - left bottom, rt is maximal corner
    const t1 = (this.min.x - origin.x) * dirFracX;
    const t2 = (this.max.x - origin.x) * dirFracX;
    const t3 = (this.min.y - origin.y) * dirFracY;
    const t4 = (this.max.y - origin.y) * dirFracY;
    const t5 = (this.min.z - origin.z) * dirFracZ;
    const t6 = (this.max.z - origin.z) * dirFracZ;

    const tmin = Math.max(
      Math.max(Math.min(t1, t2), Math.min(t3, t4)),
      Math.min(t5, t6)
    );
    const tmax = Math.min(
      Math.min(Math.max(t1, t2), Math.max(t3, t4)),
      Math.max(t5, t6)
    );

    // if tmax < 0, ray (line) is intersecting AABB, but whole AABB is behing us
    if (tmax < 0) {
      t = tmax;
      return false;
    }

    // if tmin > tmax, ray doesn't intersect AABB
    if (tmin > tmax) {
      t = tmax;
      return false;
    }

    t = tmin;
    return true;
  }
}
