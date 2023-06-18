import { MathUtils } from './utils';

/**
 * 3-dimensional vector
 * @example
 *     const v = new Vec3(1, 2, 3)
 *     console.log('x=' + v.x) // x=1
 */
export class Vec3 {
  accessor x: number;
  accessor y: number;
  accessor z: number;

  constructor(x = 0.0, y = 0.0, z = 0.0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
  /**
   * Shorthand for Vec3(0, 0, 0).
   */
  static get zero(): Vec3 {
    return new Vec3(0, 0, 0);
  }
  /**
   * Shorthand for Vec3(1, 1, 1).
   */
  static get one(): Vec3 {
    return new Vec3(1, 1, 1);
  }
  /**
   * Shorthand for Vec3(0, 0, 1).
   */
  static get forward(): Vec3 {
    return new Vec3(0, 0, 1);
  }
  /**
   * Shorthand for Vec3(0, 0, -1).
   */
  static get back(): Vec3 {
    return new Vec3(0, 0, -1);
  }
  /**
   * Shorthand for Vec3(0, 1, 0).
   */
  static get up(): Vec3 {
    return new Vec3(0, 1, 0);
  }
  /**
   * Shorthand for Vec3(0, -1, 0).
   */
  static get down(): Vec3 {
    return new Vec3(0, -1, 0);
  }
  /**
   * Shorthand for Vec3(-1, 0, 0).
   */
  static get left(): Vec3 {
    return new Vec3(-1, 0, 0);
  }
  /**
   * Shorthand for Vec3(1, 0, 0).
   */
  static get right(): Vec3 {
    return new Vec3(1, 0, 0);
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
  get normalized(): Vec3 {
    return Vec3.Normalize(this);
  }

  /**
   * Set the vectors' 3 elements
   */
  Set(x: number, y: number, z: number): void {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  /**
   * Vector addition
   */
  static add(a: Vec3, b: Vec3): Vec3 {
    return new Vec3(a.x + b.x, a.y + b.y, a.z + b.z);
  }

  /**
   * Vector subtraction
   */
  static sub(a: Vec3, b: Vec3): Vec3 {
    return new Vec3(a.x - b.x, a.y - b.y, a.z - b.z);
  }
  /**
   * Multiply the vector with an other vector, component-wise.
   */
  static MultiplyWithVector(a: Vec3, b: Vec3): Vec3 {
    return new Vec3(a.x * b.x, a.y * b.y, a.z * b.z);
  }

  static mult(a: Vec3, d: number): Vec3 {
    return new Vec3(a.x * d, a.y * d, a.z * d);
  }

  static div(a: Vec3, d: number): Vec3 {
    return new Vec3(a.x / d, a.y / d, a.z / d);
  }

  static Min(a: Vec3, b: Vec3): Vec3 {
    return new Vec3(Math.min(a.x, b.x), Math.min(a.y, b.y), Math.min(a.z, b.z));
  }
  static Max(a: Vec3, b: Vec3): Vec3 {
    return new Vec3(Math.max(a.x, b.x), Math.max(a.y, b.y), Math.max(a.z, b.z));
  }

  static Clamp(v: Vec3, min: Vec3, max: Vec3): Vec3 {
    return new Vec3(
      v.x < min.x ? min.x : v.x > max.x ? max.x : v.x,
      v.y < min.y ? min.y : v.y > max.y ? max.y : v.y,
      v.z < min.z ? min.z : v.z > max.z ? max.z : v.z
    );
  }

  /**
   * Normalize the vector. Note that this changes the values in the vector.
   * @return Returns the norm of the vector
   */
  static Normalize(value: Vec3): Vec3 {
    const mag = this.Magnitude(value);
    if (mag > 0.000001) {
      return this.div(value, this.Magnitude(value));
    } else {
      // Make something up
      return Vec3.zero;
    }
  }
  Normalize(): void {
    const mag = Vec3.Magnitude(this);
    if (mag > 0.000001) {
      Vec3.div(this, Vec3.Magnitude(this));
    } else {
      Vec3.zero;
    }
  }

  /**
   * Get the length of the vector
   */
  static Magnitude(vector: Vec3): number {
    return Math.sqrt(this.SqrMagnitude(vector));
  }

  /**
   * Get the squared length of the vector.
   */
  static SqrMagnitude(vector: Vec3): number {
    return vector.x * vector.x + vector.y * vector.y + vector.z * vector.z;
  }

  /**
   * Get distance from this point to another point
   */
  static Distance(a: Vec3, b: Vec3): number {
    return Math.sqrt(this.SqrDistance(a, b));
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

  /**
   * Multiply all the components of the vector with a scalar.
   */
  static Scale(a: Vec3, b: Vec3): Vec3 {
    return new Vec3(a.x * b.x, a.y * b.y, a.z * b.z);
  }
  Scale(scale: Vec3): void {
    this.x * scale.x;
    this.y * scale.y;
    this.z * scale.z;
  }
  /**
   * Vector cross product
   */
  static Cross(a: Vec3, b: Vec3): Vec3 {
    return new Vec3(
      a.y * b.z - a.z * b.y,
      a.z * b.x - a.x * b.z,
      a.x * b.y - a.y * b.x
    );
  }
  static Reflect(inDirection: Vec3, inNormal: Vec3): Vec3 {
    const factor = -2.0 * Vec3.Dot(inNormal, inDirection);
    return new Vec3(
      factor * inNormal.x + inDirection.x,
      factor * inNormal.y + inDirection.y,
      factor * inNormal.z + inDirection.z
    );
  }
  static Project(vector: Vec3, onNormal: Vec3): Vec3 {
    const sqrMag = Vec3.Dot(onNormal, onNormal);
    if (sqrMag < MathUtils.Epsilon) {
      return Vec3.zero;
    } else {
      const dot = Vec3.Dot(vector, onNormal);
      return new Vec3(
        (onNormal.x * dot) / sqrMag,
        (onNormal.y * dot) / sqrMag,
        (onNormal.z * dot) / sqrMag
      );
    }
  }
  static ProjectOnPlane(vector: Vec3, planeNormal: Vec3): Vec3 {
    const sqrMag = Vec3.Dot(planeNormal, planeNormal);
    if (sqrMag < MathUtils.Epsilon) {
      return Vec3.zero;
    } else {
      const dot = Vec3.Dot(vector, planeNormal);
      return new Vec3(
        vector.x - (planeNormal.x * dot) / sqrMag,
        vector.y - (planeNormal.y * dot) / sqrMag,
        vector.z - (planeNormal.z * dot) / sqrMag
      );
    }
  }
  static Angle(from: Vec3, to: Vec3): number {
    const denominator = Math.sqrt(from.sqrMagnitude * to.sqrMagnitude);
    if (denominator < MathUtils.kEpsilonNormalSqrt) {
      return 0;
    }
    const dot = MathUtils.clamp(Vec3.Dot(from, to) / denominator, -1.0, 1.0);
    return Math.acos(dot) * MathUtils.Rad2Deg;
  }
  static SignedAngle(from: Vec3, to: Vec3, axis: Vec3): number {
    const unsignedAngle = Vec3.Angle(from, to);

    const cross_x = from.y * to.z - from.z * to.y;
    const cross_y = from.z * to.x - from.x * to.z;
    const cross_z = from.x * to.y - from.y * to.x;
    const sign = Math.sign(
      axis.x * cross_x + axis.y * cross_y + axis.z * cross_z
    );
    return unsignedAngle * sign;
  }
  static ClampMagnitude(vector: Vec3, maxLength: number): Vec3 {
    const sqrmag = vector.sqrMagnitude;
    if (sqrmag > maxLength * maxLength) {
      const mag = Math.sqrt(sqrmag);
      //these intermediate variables force the intermediate result to be
      //of float precision. without this, the intermediate result can be of higher
      //precision, which changes behavior.
      const normalized_x = vector.x / mag;
      const normalized_y = vector.y / mag;
      const normalized_z = vector.z / mag;
      return new Vec3(
        normalized_x * maxLength,
        normalized_y * maxLength,
        normalized_z * maxLength
      );
    }
    return vector;
  }
  static AngleBetween(from: Vec3, to: Vec3): number {
    return Math.acos(
      MathUtils.clamp(Vec3.Dot(from.normalized, to.normalized), -1.0, 1.0)
    );
  }
  /**
   * Calculate dot product
   */
  static Dot(a: Vec3, b: Vec3): number {
    return a.x * b.x + a.y * b.y + a.z * b.z;
  }

  /**
   * Do a linear interpolation between two vectors
   * @param a The start value, when t is 0
   * @param b The start value, when t is 1
   * @param t The t-value from 0 to 1 representing position along the lerp, clamped between 0 and 1
   *
   */
  static Lerp(a: Vec3, b: Vec3, t: number): Vec3 {
    const res = Vec3.zero;
    res.x = MathUtils.LerpClamped(a.x, b.x, t);
    res.y = MathUtils.LerpClamped(a.y, b.y, t);
    res.z = MathUtils.LerpClamped(a.z, b.z, t);
    return res;
  }
  static LerpUnclamped(a: Vec3, b: Vec3, t: number): Vec3 {
    const res = Vec3.zero;
    res.x = MathUtils.Lerp(a.x, b.x, t);
    res.y = MathUtils.Lerp(a.y, b.y, t);
    res.z = MathUtils.Lerp(a.z, b.z, t);
    return res;
  }
  // TODO:TEST THAT IT WORKS CORRECTLY
  static Slerp(a: Vec3, b: Vec3, t: number): Vec3 {
    // Dot product - the cosine of the angle between 2 vectors.
    const dot = Vec3.Dot(a, b);
    // Clamp it to be in the range of Acos()
    // This may be unnecessary, but floating point
    // precision can be a fickle mistress.
    MathUtils.clamp(dot, -1.0, 1.0);
    // Acos(dot) returns the angle between start and end,
    // And multiplying that by percent returns the angle between
    // start and the final result.
    const theta = Math.acos(dot) * t;
    const RelativeVec = Vec3.sub(a, Vec3.mult(b, dot));
    RelativeVec.Normalize(); // Orthonormal basis
    // The final result.
    return Vec3.add(
      Vec3.mult(a, Math.cos(theta)),
      Vec3.mult(RelativeVec, Math.sin(theta))
    );
  }
  // TODO:TEST THAT IT WORKS CORRECTLY
  static SlerpUnclamped(a: Vec3, b: Vec3, t: number): Vec3 {
    // Dot product - the cosine of the angle between 2 vectors.
    const dot = Vec3.Dot(a, b);
    // Acos(dot) returns the angle between start and end,
    // And multiplying that by percent returns the angle between
    // start and the final result.
    const theta = Math.acos(dot) * t;
    const RelativeVec = Vec3.sub(a, Vec3.mult(b, dot));
    RelativeVec.Normalize(); // Orthonormal basis
    // The final result.
    return Vec3.add(
      Vec3.mult(a, Math.cos(theta)),
      Vec3.mult(RelativeVec, Math.sin(theta))
    );
  }

  /**
   * Make the vector point in the opposite direction.
   */
  static negate(a: Vec3): Vec3 {
    return new Vec3(-a.x, -a.y, -a.z);
  }

  static MoveTowards(
    current: Vec3,
    target: Vec3,
    maxDistanceDelta: number
  ): Vec3 {
    // avoid vector ops because current scripting backends are terrible at inlining
    const toVector_x = target.x - current.x;
    const toVector_y = target.y - current.y;
    const toVector_z = target.z - current.z;

    const sqdist =
      toVector_x * toVector_x +
      toVector_y * toVector_y +
      toVector_z * toVector_z;

    if (
      sqdist == 0 ||
      (maxDistanceDelta >= 0 && sqdist <= maxDistanceDelta * maxDistanceDelta)
    )
      return target;
    const dist = Math.sqrt(sqdist);

    return new Vec3(
      current.x + (toVector_x / dist) * maxDistanceDelta,
      current.y + (toVector_y / dist) * maxDistanceDelta,
      current.z + (toVector_z / dist) * maxDistanceDelta
    );
  }
  static SmoothDamp(
    current: Vec3,
    target: Vec3,
    currentVelocity: Vec3,
    smoothTime: number,
    maxSpeed: number,
    deltaTime: number
  ) {
    let output_x = 0;
    let output_y = 0;
    let output_z = 0;

    // Based on Game Programming Gems 4 Chapter 1.10
    smoothTime = Math.max(0.0001, smoothTime);
    const omega = 2 / smoothTime;

    const x = omega * deltaTime;
    const exp = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x);

    let change_x = current.x - target.x;
    let change_y = current.y - target.y;
    let change_z = current.z - target.z;
    let originalTo = target;

    // Clamp maximum speed
    const maxChange = maxSpeed * smoothTime;

    const maxChangeSq = maxChange * maxChange;
    const sqrmag =
      change_x * change_x + change_y * change_y + change_z * change_z;
    if (sqrmag > maxChangeSq) {
      const mag = Math.sqrt(sqrmag);
      change_x = (change_x / mag) * maxChange;
      change_y = (change_y / mag) * maxChange;
      change_z = (change_z / mag) * maxChange;
    }

    target.x = current.x - change_x;
    target.y = current.y - change_y;
    target.z = current.z - change_z;

    const temp_x = (currentVelocity.x + omega * change_x) * deltaTime;
    const temp_y = (currentVelocity.y + omega * change_y) * deltaTime;
    const temp_z = (currentVelocity.z + omega * change_z) * deltaTime;

    currentVelocity.x = (currentVelocity.x - omega * temp_x) * exp;
    currentVelocity.y = (currentVelocity.y - omega * temp_y) * exp;
    currentVelocity.z = (currentVelocity.z - omega * temp_z) * exp;

    output_x = target.x + (change_x + temp_x) * exp;
    output_y = target.y + (change_y + temp_y) * exp;
    output_z = target.z + (change_z + temp_z) * exp;

    // Prevent overshooting
    const origMinusCurrent_x = originalTo.x - current.x;
    const origMinusCurrent_y = originalTo.y - current.y;
    const origMinusCurrent_z = originalTo.z - current.z;
    let outMinusOrig_x = output_x - originalTo.x;
    let outMinusOrig_y = output_y - originalTo.y;
    let outMinusOrig_z = output_z - originalTo.z;

    if (
      origMinusCurrent_x * outMinusOrig_x +
        origMinusCurrent_y * outMinusOrig_y +
        origMinusCurrent_z * outMinusOrig_z >
      0
    ) {
      output_x = originalTo.x;
      output_y = originalTo.y;
      output_z = originalTo.z;

      currentVelocity.x = (output_x - originalTo.x) / deltaTime;
      currentVelocity.y = (output_y - originalTo.y) / deltaTime;
      currentVelocity.z = (output_z - originalTo.z) / deltaTime;
    }

    return new Vec3(output_x, output_y, output_z);
  }

  isZero(): boolean {
    return this.x === 0 && this.y === 0 && this.z === 0;
  }

  /**
   * Converts to a more readable format
   */
  toString(): string {
    return `${this.x},${this.y},${this.z}`;
  }

  /**
   * Converts to an array
   */
  toArray(): [number, number, number] {
    return [this.x, this.y, this.z];
  }

  /**
   * Copies value of source to this vector.
   */
  copy(vector: Vec3): Vec3 {
    this.x = vector.x;
    this.y = vector.y;
    this.z = vector.z;
    return this;
  }

  /**
   * Check if a vector equals is almost equal to another one.
   */
  almostEquals(vector: Vec3, precision = 1e-6): boolean {
    if (
      Math.abs(this.x - vector.x) > precision ||
      Math.abs(this.y - vector.y) > precision ||
      Math.abs(this.z - vector.z) > precision
    ) {
      return false;
    }
    return true;
  }

  /**
   * Check if a vector is almost zero
   */
  almostZero(precision = 1e-6): boolean {
    if (
      Math.abs(this.x) > precision ||
      Math.abs(this.y) > precision ||
      Math.abs(this.z) > precision
    ) {
      return false;
    }
    return true;
  }

  /**
   * Clone the vector
   */
  clone(): Vec3 {
    return new Vec3(this.x, this.y, this.z);
  }
}
