import { Vec2 } from './Vec2';
import { Vec3 } from './Vec3';
import { MathUtils } from './utils';

export class Vec4 {
  x: number;
  y: number;
  z: number;
  w: number;

  constructor(x = 0.0, y = 0.0, z = 0.0, w = 0.0) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
  }
  static get zero(): Vec4 {
    return new Vec4(0, 0, 0, 0);
  }
  static get one(): Vec4 {
    return new Vec4(1, 1, 1, 1);
  }

  /**
   * Returns the length of this vector
   */
  get magnitude(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }
  /**
   * Returns the squared length of this vector
   */
  get sqrMagnitude(): number {
    return this.x * this.x + this.y * this.y + this.z * this.z;
  }
  /**
   * Returns this vector with a magnitude of 1
   */
  get normalized(): Vec4 {
    return Vec4.Normalize(this);
  }
  /**
   * Vector addition
   */
  static add(a: Vec4, b: Vec4): Vec4 {
    return new Vec4(a.x + b.x, a.y + b.y, a.z + b.z, a.w + b.w);
  }

  /**
   * Vector subtraction
   * @param target Optional target to save in.
   */
  static sub(a: Vec4, b: Vec4): Vec4 {
    return new Vec4(a.x - b.x, a.y - b.y, a.z - b.z, a.w - b.w);
  }
  /**
   * Multiply the vector with an other vector, component-wise.
   * @param target The vector to save the result in.
   */
  static MultiplyWithVector(a: Vec4, b: Vec4): Vec4 {
    return new Vec4(a.x * b.x, a.y * b.y, a.z * b.z, a.w * b.w);
  }

  static mult(a: Vec4, d: number): Vec4 {
    return new Vec4(a.x * d, a.y * d, a.z * d, a.w * d);
  }

  static div(a: Vec4, d: number): Vec4 {
    return new Vec4(a.x / d, a.y / d, a.z / d, a.w / d);
  }
  static negate(a: Vec4): Vec4 {
    return new Vec4(-a.x, -a.y, -a.z, -a.w);
  }

  static Min(a: Vec4, b: Vec4): Vec4 {
    return new Vec4(
      Math.min(a.x, b.x),
      Math.min(a.y, b.y),
      Math.min(a.z, b.z),
      Math.min(a.w, b.w)
    );
  }
  static Max(a: Vec4, b: Vec4): Vec4 {
    return new Vec4(
      Math.max(a.x, b.x),
      Math.max(a.y, b.y),
      Math.max(a.z, b.z),
      Math.max(a.w, b.w)
    );
  }

  Set(x: number, y: number, z: number, w: number): void {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
  }
  static Lerp(a: Vec4, b: Vec4, t: number): Vec4 {
    const res = Vec4.zero;
    res.x = MathUtils.LerpClamped(a.x, b.x, t);
    res.y = MathUtils.LerpClamped(a.y, b.y, t);
    res.z = MathUtils.LerpClamped(a.z, b.z, t);
    res.w = MathUtils.LerpClamped(a.w, b.w, t);
    return res;
  }
  static LerpUnclamped(a: Vec4, b: Vec4, t: number): Vec4 {
    const res = Vec4.zero;
    res.x = MathUtils.Lerp(a.x, b.x, t);
    res.y = MathUtils.Lerp(a.y, b.y, t);
    res.z = MathUtils.Lerp(a.z, b.z, t);
    res.w = MathUtils.LerpClamped(a.w, b.w, t);
    return res;
  }
  static MoveTowards(
    current: Vec4,
    target: Vec4,
    maxDistanceDelta: number
  ): Vec4 {
    const toVector_x = target.x - current.x;
    const toVector_y = target.y - current.y;
    const toVector_z = target.z - current.z;
    const toVector_w = target.w - current.w;

    const sqdist =
      toVector_x * toVector_x +
      toVector_y * toVector_y +
      toVector_z * toVector_z +
      toVector_w * toVector_w;

    if (
      sqdist == 0 ||
      (maxDistanceDelta >= 0 && sqdist <= maxDistanceDelta * maxDistanceDelta)
    )
      return target;

    const dist = Math.sqrt(sqdist);

    return new Vec4(
      current.x + (toVector_x / dist) * maxDistanceDelta,
      current.y + (toVector_y / dist) * maxDistanceDelta,
      current.z + (toVector_z / dist) * maxDistanceDelta,
      current.w + (toVector_w / dist) * maxDistanceDelta
    );
  }
  static Scale(a: Vec4, b: Vec4): Vec4 {
    return new Vec4(a.x * b.x, a.y * b.y, a.z * b.z, a.w * b.w);
  }
  Scale(scale: Vec4): void {
    this.x *= scale.x;
    this.y *= scale.y;
    this.z *= scale.z;
    this.w *= scale.w;
  }
  static Normalize(value: Vec4): Vec4 {
    const mag = this.Magnitude(value);
    if (mag > 0.000001) {
      return this.div(value, this.Magnitude(value));
    } else {
      // Make something up
      return Vec4.zero;
    }
  }
  Normalize(): void {
    const mag = Vec4.Magnitude(this);
    if (mag > 0.000001) {
      Vec4.div(this, Vec4.Magnitude(this));
    } else {
      Vec4.zero;
    }
  }
  /**
   * Get the length of the vector
   */
  static Magnitude(vector: Vec4): number {
    return Math.sqrt(this.Dot(vector, vector));
  }

  /**
   * Get the squared length of the vector.
   */
  static SqrMagnitude(vector: Vec4): number {
    return vector.x * vector.x + vector.y * vector.y + vector.z * vector.z;
  }

  /**
   * Get distance from this point to another point
   */
  static Distance(a: Vec4, b: Vec4): number {
    return this.Magnitude(this.sub(a, b));
  }

  /**
   * Get squared distance from this point to another point
   */
  static SqrDistance(a: Vec3, b: Vec3): number {
    return (
      (a.x - b.x) * (a.x - b.x) +
      (a.y - b.y) * (a.y - b.y) +
      (a.z - b.z) * (a.z - b.z)
    );
  }

  static Dot(a: Vec4, b: Vec4): number {
    return a.x * b.x + a.y * b.y + a.z * b.z + a.w * b.w;
  }
  static Project(a: Vec4, b: Vec4): Vec4 {
    return Vec4.mult(b, this.Dot(a, b) / this.Dot(b, b));
  }

  static Vec3toVec4(v: Vec3): Vec4 {
    return new Vec4(v.x, v.y, v.z, 0.0);
  }
  static Vec2toVec4(v: Vec2): Vec4 {
    return new Vec4(v.x, v.y, 0.0, 0.0);
  }
  static toVec3(v: Vec4): Vec3 {
    return new Vec3(v.x, v.y, v.z);
  }
  static toVec2(v: Vec4): Vec2 {
    return new Vec2(v.x, v.y);
  }
}
