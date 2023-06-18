import { Vec3 } from '../math/Vec3';
import { MathUtils } from './utils';

/**
 * A Quaternion describes a rotation in 3D space. The Quaternion is mathematically defined as Q = x*i + y*j + z*k + w, where (i,j,k) are imaginary basis vectors. (x,y,z) can be seen as a vector related to the axis of rotation, while the real multiplier, w, is related to the amount of rotation.
 * @param x Multiplier of the imaginary basis vector i.
 * @param y Multiplier of the imaginary basis vector j.
 * @param z Multiplier of the imaginary basis vector k.
 * @param w Multiplier of the real part.
 * @see http://en.wikipedia.org/wiki/Quaternion
 */
export class Quaternion {
  accessor x: number;
  accessor y: number;
  accessor z: number;
  accessor w: number;

  constructor(x = 0, y = 0, z = 0, w = 1) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
  }
  static get identity(): Quaternion {
    return new Quaternion(0, 0, 0, 1);
  }

  get eulerAngles(): Vec3 {
    return Quaternion.Internal_MakePositive(
      Vec3.mult(Quaternion.Internal_ToEuler(this), MathUtils.Rad2Deg)
    );
  }
  set eulerAngles(value: Vec3) {
    Quaternion.Internal_FromEuler(Vec3.mult(value, MathUtils.Rad2Deg));
  }
  get normalized(): Quaternion {
    return Quaternion.Normalize(this);
  }

  /**
   * Set the value of the quaternion.
   */
  Set(x: number, y: number, z: number, w: number): void {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
  }
  /**
   * Is the dot product of two quaternions within tolerance for them to be considered equal?
   */
  static IsEqualUsingDot(dot: number): boolean {
    return dot > 1.0 - MathUtils.kEpsilon;
  }

  /**
   * Multiply the quaternion with an other quaternion.
   */
  static mult(lhs: Quaternion, rhs: Quaternion): Quaternion {
    return new Quaternion(
      lhs.w * rhs.x + lhs.x * rhs.w + lhs.y * rhs.z - lhs.z * rhs.y,
      lhs.w * rhs.y + lhs.y * rhs.w + lhs.z * rhs.x - lhs.x * rhs.z,
      lhs.w * rhs.z + lhs.z * rhs.w + lhs.x * rhs.y - lhs.y * rhs.x,
      lhs.w * rhs.w - lhs.x * rhs.x - lhs.y * rhs.y - lhs.z * rhs.z
    );
  }

  /**
   * Rotates the point point with rotation.
   */
  static multiplyWithVec3(rotation: Quaternion, point: Vec3): Vec3 {
    const x = rotation.x * 2;
    const y = rotation.y * 2;
    const z = rotation.z * 2;
    const xx = rotation.x * x;
    const yy = rotation.y * y;
    const zz = rotation.z * z;
    const xy = rotation.x * y;
    const xz = rotation.x * z;
    const yz = rotation.y * z;
    const wx = rotation.w * x;
    const wy = rotation.w * y;
    const wz = rotation.w * z;

    return new Vec3(
      (1 - (yy + zz)) * point.x + (xy - wz) * point.y + (xz + wy) * point.z,
      (xy + wz) * point.x + (1 - (xx + zz)) * point.y + (yz - wx) * point.z,
      (xz - wy) * point.x + (yz + wx) * point.y + (1 - (xx + yy)) * point.z
    );
  }

  /**
   * The dot product between two rotations
   */
  static Dot(a: Quaternion, b: Quaternion): number {
    return a.x * b.x + a.y * b.y + a.z * b.z + a.w * b.w;
  }
  /**
   * Returns the angle in degrees between two rotations a and b
   */
  static Angle(a: Quaternion, b: Quaternion): number {
    const dot = MathUtils.Min(MathUtils.Abs(Quaternion.Dot(a, b)), 1.0);
    return Quaternion.IsEqualUsingDot(dot)
      ? 0.0
      : Math.acos(dot) * 2.0 * MathUtils.Rad2Deg;
  }
  /**
   * Creates a rotation which rotates angle degrees around axis
   */
  static AngleAxis(angle: number, axis: Vec3): Quaternion {
    return Quaternion.Internal_FromAxisAngle(MathUtils.Rad2Deg * angle, axis);
  }
  /**
   * Set the quaternion value given two vectors. The resulting rotation will be the needed rotation to rotate u to v.
   */
  static FromToRotation(from: Vec3, to: Vec3): Quaternion {
    const res = Quaternion.identity;

    const cos2Theta = from.x * to.x + from.y * to.y + from.z * to.z; // Vector3DotProduct(from, to)
    const cross = new Vec3(
      from.y * to.z - from.z * to.y,
      from.z * to.x - from.x * to.z,
      from.x * to.y - from.y * to.x
    ); // Vector3CrossProduct(from, to)

    res.x = cross.x;
    res.y = cross.y;
    res.z = cross.z;
    res.w = 1.0 + cos2Theta;

    // QuaternionNormalize(q);
    // NOTE: Normalize to essentially nlerp the original and identity to 0.5
    let q = res;
    let length = Math.sqrt(q.x * q.x + q.y * q.y + q.z * q.z + q.w * q.w);
    if (length === 0.0) length = 1.0;
    const ilength = 1.0 / length;

    res.x = q.x * ilength;
    res.y = q.y * ilength;
    res.z = q.z * ilength;
    res.w = q.w * ilength;

    return res;
  }

  SetFromToRotation(fromDirection: Vec3, toDirection: Vec3): void {
    Quaternion.FromToRotation(fromDirection, toDirection);
  }
  SetLookRotation(view: Vec3): void {
    const up = Vec3.up;
    Quaternion.LookRotation(view, up);
  }
  ToAngleAxis(angle: number, axis: Vec3): void {
    Quaternion.Internal_ToAxisAngle(this, angle, axis);
    angle *= MathUtils.Deg2Rad;
  }

  /**
   * Get the inverse quaternion rotation. TODO:NEEDS TESTING
   */
  static Inverse(rotation: Quaternion): Quaternion {
    let res = rotation;

    const magnitudeSq =
      rotation.x * rotation.x +
      rotation.y * rotation.y +
      rotation.z * rotation.z +
      rotation.w * rotation.w;
    if (magnitudeSq !== 0.0) {
      let invMagnitude = 1.0 / magnitudeSq;
      res.x *= -invMagnitude;
      res.y *= -invMagnitude;
      res.z *= -invMagnitude;
      res.w *= -invMagnitude;
    }

    return res;
  }
  /**
   * 	Creates a rotation with the specified forward and upwards directions TODO:NEED testing
   * @param forward The direction to look in
   * @param upwards The vector that defines in which direction up is
   */
  static LookRotation(forward: Vec3, upwards = Vec3.up): Quaternion {
    const res = Quaternion.identity;

    const cos2Theta =
      forward.x * upwards.x + forward.y * upwards.y + forward.z * upwards.z; // Vector3DotProduct(forward, upwards)
    const cross = new Vec3(
      forward.y * upwards.z - forward.z * upwards.y,
      forward.z * upwards.x - forward.x * upwards.z,
      forward.x * upwards.y - forward.y * upwards.x
    ); // Vector3CrossProduct(forward, upwards)

    res.x = cross.x;
    res.y = cross.y;
    res.z = cross.z;
    res.w = 1.0 + cos2Theta;

    // QuaternionNormalize(q);
    // NOTE: Normalize to essentially nlerp the original and identity to 0.5
    let q = res;
    let length = Math.sqrt(q.x * q.x + q.y * q.y + q.z * q.z + q.w * q.w);
    if (length === 0.0) length = 1.0;
    const ilength = 1.0 / length;

    res.x = q.x * ilength;
    res.y = q.y * ilength;
    res.z = q.z * ilength;
    res.w = q.w * ilength;

    return res;
  }
  /**
   * Normalize the quaternion. Note that this changes the values of the quaternion.
   */
  static Normalize(q: Quaternion): Quaternion {
    const mag = Math.sqrt(Quaternion.Dot(q, q));
    if (mag < MathUtils.kEpsilon) {
      return Quaternion.identity;
    }

    return new Quaternion(q.x / mag, q.y / mag, q.z / mag, q.w / mag);
  }

  Normalize(): void {
    Quaternion.Normalize(this);
  }

  static Euler(euler: Vec3): Quaternion {
    return Quaternion.Internal_FromEuler(Vec3.mult(euler, MathUtils.Deg2Rad));
  }
  /**
   * Performs a linear interpolation between two quat
   *
   * @param a Start value, returned when t = 0
   * @param b End value, returned when t = 1
   * @param t Interpolation ratio is clamped.
   * @returns {Quaternion} A quaternion interpolated between quaternions a and b
   */
  static Lerp(a: Quaternion, b: Quaternion, t: number): Quaternion {
    const res = Quaternion.identity;
    res.x = MathUtils.LerpClamped(a.x, b.x, t);
    res.y = MathUtils.LerpClamped(a.y, b.y, t);
    res.z = MathUtils.LerpClamped(a.z, b.z, t);
    res.w = MathUtils.LerpClamped(a.w, b.w, t);
    return res;
  }
  /**
   * Performs a linear interpolation between two quat
   *
   * @param a Start value, returned when t = 0
   * @param b End value, returned when t = 1
   * @param t Interpolation ratio is not clamped.
   * @returns {Quaternion} A quaternion interpolated between quaternions a and b
   */
  static LerpUnclamped(a: Quaternion, b: Quaternion, t: number): Quaternion {
    const res = Quaternion.identity;
    res.x = MathUtils.Lerp(a.x, b.x, t);
    res.y = MathUtils.Lerp(a.y, b.y, t);
    res.z = MathUtils.Lerp(a.z, b.z, t);
    res.w = MathUtils.Lerp(a.w, b.w, t);
    return res;
  }
  /**
   * Calculate slerp-optimized interpolation between two quaternions
   */
  static Nlerp(a: Quaternion, b: Quaternion, t: number): Quaternion {
    const res = Quaternion.identity;
    // QuaternionLerp(q1, q2, amount)
    res.x = a.x + t * (b.x - a.x);
    res.y = a.y + t * (b.y - a.y);
    res.z = a.z + t * (b.z - a.z);
    res.w = a.w + t * (b.w - a.w);

    // QuaternionNormalize(q);
    let q = res;
    let length = Math.sqrt(q.x * q.x + q.y * q.y + q.z * q.z + q.w * q.w);
    if (length == 0.0) length = 1.0;
    let ilength = 1.0 / length;

    res.x = q.x * ilength;
    res.y = q.y * ilength;
    res.z = q.z * ilength;
    res.w = q.w * ilength;

    return res;
  }
  static RotateTowards(
    from: Quaternion,
    to: Quaternion,
    maxDegreesDelta: number
  ): Quaternion {
    const angle = Quaternion.Angle(from, to);
    if (angle === 0.0) {
      return to;
    }
    return Quaternion.SlerpUnclamped(
      from,
      to,
      MathUtils.Min(1.0, maxDegreesDelta / angle)
    );
  }
  /**
   * Performs a spherical linear interpolation between two quat
   *
   * @param a Start value, returned when t = 0
   * @param b End value, returned when t = 1
   * @param t Interpolation ratio be created
   * @returns {Quaternion} A quaternion spherically interpolated between quaternions a and b
   */
  static Slerp(a: Quaternion, b: Quaternion, t: number): Quaternion {
    let res = Quaternion.identity;
    let cosHalfTheta = a.x * b.x + a.y * b.y + a.z * b.z + a.w * b.w;

    if (cosHalfTheta < 0) {
      b.x = -b.x;
      b.y = -b.y;
      b.z = -b.z;
      b.w = -b.w;
      cosHalfTheta = -cosHalfTheta;
    }

    if (Math.abs(cosHalfTheta) >= 1.0) res = a;
    else if (cosHalfTheta > 0.95) res = this.Nlerp(a, b, t);
    else {
      const halfTheta = Math.acos(cosHalfTheta);
      const sinHalfTheta = Math.sqrt(1.0 - cosHalfTheta * cosHalfTheta);

      if (Math.abs(sinHalfTheta) < 0.001) {
        res.x = a.x * 0.5 + b.x * 0.5;
        res.y = a.y * 0.5 + b.y * 0.5;
        res.z = a.z * 0.5 + b.z * 0.5;
        res.w = a.w * 0.5 + b.w * 0.5;
      } else {
        const ratioA = Math.sin((1 - t) * halfTheta) / sinHalfTheta;
        const ratioB = Math.sin(t * halfTheta) / sinHalfTheta;

        res.x = a.x * ratioA + b.x * ratioB;
        res.y = a.y * ratioA + b.y * ratioB;
        res.z = a.z * ratioA + b.z * ratioB;
        res.w = a.w * ratioA + b.w * ratioB;
      }
    }

    return res;
  }
  // TODO:AKSUALLY unclamped
  static SlerpUnclamped(a: Quaternion, b: Quaternion, t: number): Quaternion {
    let res = Quaternion.identity;
    let cosHalfTheta = a.x * b.x + a.y * b.y + a.z * b.z + a.w * b.w;

    if (cosHalfTheta < 0) {
      b.x = -b.x;
      b.y = -b.y;
      b.z = -b.z;
      b.w = -b.w;
      cosHalfTheta = -cosHalfTheta;
    }

    if (Math.abs(cosHalfTheta) >= 1.0) res = a;
    else if (cosHalfTheta > 0.95) res = this.Nlerp(a, b, t);
    else {
      const halfTheta = Math.acos(cosHalfTheta);
      const sinHalfTheta = Math.sqrt(1.0 - cosHalfTheta * cosHalfTheta);

      if (Math.abs(sinHalfTheta) < 0.001) {
        res.x = a.x * 0.5 + b.x * 0.5;
        res.y = a.y * 0.5 + b.y * 0.5;
        res.z = a.z * 0.5 + b.z * 0.5;
        res.w = a.w * 0.5 + b.w * 0.5;
      } else {
        const ratioA = Math.sin((1 - t) * halfTheta) / sinHalfTheta;
        const ratioB = Math.sin(t * halfTheta) / sinHalfTheta;

        res.x = a.x * ratioA + b.x * ratioB;
        res.y = a.y * ratioA + b.y * ratioB;
        res.z = a.z * ratioA + b.z * ratioB;
        res.w = a.w * ratioA + b.w * ratioB;
      }
    }

    return res;
  }

  /**
   * Copies value of source to this quaternion.
   * @return this
   */
  copy(quat: Quaternion): Quaternion {
    this.x = quat.x;
    this.y = quat.y;
    this.z = quat.z;
    this.w = quat.w;
    return this;
  }

  clone(): Quaternion {
    return new Quaternion(this.x, this.y, this.z, this.w);
  }

  /**
   * Convert to a readable format
   * @return "x,y,z,w"
   */
  toString(): string {
    return `${this.x},${this.y},${this.z},${this.w}`;
  }

  /**
   * Convert to an Array
   * @return [x, y, z, w]
   */
  toArray(): [number, number, number, number] {
    return [this.x, this.y, this.z, this.w];
  }

  /**
   * Makes euler angles positive 0/360 with 0.0001 hacked to support old behaviour of QuaternionToEuler
   */
  private static Internal_MakePositive(euler: Vec3): Vec3 {
    const negativeFlip = -0.0001 * MathUtils.Rad2Deg;
    const positiveFlip = 360.0 + negativeFlip;

    if (euler.x < negativeFlip) euler.x += 360.0;
    else if (euler.x > positiveFlip) euler.x -= 360.0;

    if (euler.y < negativeFlip) euler.y += 360.0;
    else if (euler.y > positiveFlip) euler.y -= 360.0;

    if (euler.z < negativeFlip) euler.z += 360.0;
    else if (euler.z > positiveFlip) euler.z -= 360.0;

    return euler;
  }

  /**
   *  Get the Euler angles equivalent to quaternion (roll, pitch, yaw)
   *  NOTE: Angles are returned in a Vector3 struct in radians
   */
  private static Internal_ToEuler(q: Quaternion): Vec3 {
    const res = Vec3.zero;

    // Roll (x-axis rotation)
    const x0 = 2.0 * (q.w * q.x + q.y * q.z);
    const x1 = 1.0 - 2.0 * (q.x * q.x + q.y * q.y);
    res.x = Math.atan2(x0, x1);

    // Pitch (y-axis rotation)
    let y0 = 2.0 * (q.w * q.y - q.z * q.x);
    y0 = y0 > 1.0 ? 1.0 : y0;
    y0 = y0 < -1.0 ? -1.0 : y0;
    res.y = Math.asin(y0);

    // Yaw (z-axis rotation)
    const z0 = 2.0 * (q.w * q.z + q.x * q.y);
    const z1 = 1.0 - 2.0 * (q.y * q.y + q.z * q.z);
    res.z = Math.atan2(z0, z1);

    return res;
  }

  /**
   * Get the quaternion equivalent to Euler angles.
   * NOTE: Rotation order is ZYX
   */
  private static Internal_FromEuler(euler: Vec3): Quaternion {
    const res = Quaternion.identity;
    const x0 = Math.cos(euler.x * 0.5);
    const x1 = Math.sin(euler.x * 0.5);
    const y0 = Math.cos(euler.y * 0.5);
    const y1 = Math.sin(euler.y * 0.5);
    const z0 = Math.cos(euler.z * 0.5);
    const z1 = Math.sin(euler.z * 0.5);

    res.x = x1 * y0 * z0 - x0 * y1 * z1;
    res.y = x0 * y1 * z0 + x1 * y0 * z1;
    res.z = x0 * y0 * z1 - x1 * y1 * z0;
    res.w = x0 * y0 * z0 + x1 * y1 * z1;

    return res;
  }
  /**
   * Get the rotation angle and axis for a given quaternion
   */
  private static Internal_ToAxisAngle(
    q: Quaternion,
    _angle: number,
    _axis: Vec3
  ): void {
    if (Math.abs(q.w) > 1.0) {
      // QuaternionNormalize(q);
      let length = Math.sqrt(q.x * q.x + q.y * q.y + q.z * q.z + q.w * q.w);
      if (length === 0.0) length = 1.0;
      const ilength = 1.0 / length;

      q.x = q.x * ilength;
      q.y = q.y * ilength;
      q.z = q.z * ilength;
      q.w = q.w * ilength;
    }

    const resAxis = new Vec3(0.0, 0.0, 0.0);
    let resAngle = 2.0 * Math.acos(q.w);
    let den = Math.sqrt(1.0 - q.w * q.w);

    if (den > MathUtils.kEpsilon) {
      resAxis.x = q.x / den;
      resAxis.y = q.y / den;
      resAxis.z = q.z / den;
    } else {
      // This occurs when the angle is zero.
      // Not a problem: just set an arbitrary normalized axis.
      resAxis.x = 1.0;
    }

    _axis = resAxis;
    _angle = resAngle;
  }
  /**
   * Get rotation quaternion for an angle and axis
   * NOTE: Angle must be provided in radians
   */
  private static Internal_FromAxisAngle(angle: number, axis: Vec3): Quaternion {
    const res = Quaternion.identity;
    const axisLength = Math.sqrt(
      axis.x * axis.x + axis.y * axis.y + axis.z * axis.z
    );

    if (axisLength != 0.0) {
      angle *= 0.5;

      let length = 0.0;
      let ilength = 0.0;

      // Vector3Normalize(axis)
      let v = axis;
      length = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
      if (length == 0.0) length = 1.0;
      ilength = 1.0 / length;
      axis.x *= ilength;
      axis.y *= ilength;
      axis.z *= ilength;

      const sinres = Math.sin(angle);
      const cosres = Math.cos(angle);

      res.x = axis.x * sinres;
      res.y = axis.y * sinres;
      res.z = axis.z * sinres;
      res.w = cosres;

      // QuaternionNormalize(q);
      let q = res;
      length = Math.sqrt(q.x * q.x + q.y * q.y + q.z * q.z + q.w * q.w);
      if (length == 0.0) length = 1.0;
      ilength = 1.0 / length;
      res.x = q.x * ilength;
      res.y = q.y * ilength;
      res.z = q.z * ilength;
      res.w = q.w * ilength;
    }

    return res;
  }
}
