import { Vec3 } from '../math/Vec3';

/**
 * A line in 3D space that intersects bodies and return points.
 */
export class Ray {
  /**
   * The origin point of the ray
   */
  private m_Origin: Vec3;
  /**
   * The direction of the ray
   */
  private m_Direction: Vec3;

  constructor(origin: Vec3, direction: Vec3) {
    this.m_Origin = origin;
    this.m_Direction = direction;
  }
  /**
   * The origin point of the ray
   */
  get origin(): Vec3 {
    return this.m_Origin;
  }
  set origin(value: Vec3) {
    this.m_Origin = value;
  }

  /**
   * The direction of the ray
   */
  get direction(): Vec3 {
    return this.m_Direction;
  }
  set direction(value: Vec3) {
    this.m_Direction = value.normalized;
  }

  /**
   * Returns a point at distance units along the ray
   */
  GetPoint(distance: number): Vec3 {
    return Vec3.mult(Vec3.add(this.m_Origin, this.m_Direction), distance);
  }
}
