import { Vec3 } from './Vec3';
import { MathUtils } from './utils';

export class Vec2 {
  x: number;
  y: number;

  constructor(x = 0.0, y = 0.0) {
    this.x = x;
    this.y = y;
  }
  static get up(): Vec2 {
    return new Vec2(0, 1);
  }
  static get down(): Vec2 {
    return new Vec2(0, -1);
  }
  static get left(): Vec2 {
    return new Vec2(-1, 0);
  }
  static get right(): Vec2 {
    return new Vec2(1, 0);
  }
  static get zero(): Vec2 {
    return new Vec2(0, 0);
  }
  static get one(): Vec2 {
    return new Vec2(1, 1);
  }
  get magnitude(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }
  get sqrMagnitude(): number {
    return this.x * this.x + this.y * this.y;
  }

  static add(a: Vec2, b: Vec2): Vec2 {
    return new Vec2(a.x + b.x, a.y + b.y);
  }
  static sub(a: Vec2, b: Vec2): Vec2 {
    return new Vec2(a.x - b.x, a.y - b.y);
  }
  static mult(a: Vec2, b: Vec2): Vec2 {
    return new Vec2(a.x * b.x, a.y * b.y);
  }
  static div(a: Vec2, b: Vec2): Vec2 {
    return new Vec2(a.x / b.x, a.y / b.y);
  }
  static negate(a: Vec2): Vec2 {
    return new Vec2(-a.x, -a.y);
  }
  static scalarMult(a: Vec2, d: number): Vec2 {
    return new Vec2(a.x * d, a.y * d);
  }
  static scalarDiv(a: Vec2, d: number): Vec2 {
    return new Vec2(a.x / d, a.y / d);
  }
  static Min(a: Vec2, b: Vec2): Vec2 {
    return new Vec2(Math.min(a.x, b.x), Math.min(a.y, b.y));
  }
  static Max(a: Vec2, b: Vec2): Vec2 {
    return new Vec2(Math.max(a.x, b.x), Math.max(a.y, b.y));
  }
  Set(x: number, y: number): void {
    this.x = x;
    this.y = y;
  }
  static Lerp(a: Vec2, b: Vec2, t: number): Vec2 {
    const res = Vec2.zero;
    res.x = MathUtils.LerpClamped(a.x, b.x, t);
    res.y = MathUtils.LerpClamped(a.y, b.y, t);
    return res;
  }
  static LerpUnclamped(a: Vec2, b: Vec2, t: number): Vec2 {
    const res = Vec2.zero;
    res.x = MathUtils.Lerp(a.x, b.x, t);
    res.y = MathUtils.Lerp(a.y, b.y, t);
    return res;
  }
  static MoveTowards(
    current: Vec2,
    target: Vec2,
    maxDistanceDelta: number
  ): Vec2 {
    // avoid vector ops because current scripting backends are terrible at inlining
    const toVector_x = target.x - current.x;
    const toVector_y = target.y - current.y;

    const sqDist = toVector_x * toVector_x + toVector_y * toVector_y;

    if (
      sqDist == 0 ||
      (maxDistanceDelta >= 0 && sqDist <= maxDistanceDelta * maxDistanceDelta)
    )
      return target;

    const dist = Math.sqrt(sqDist);

    return new Vec2(
      current.x + (toVector_x / dist) * maxDistanceDelta,
      current.y + (toVector_y / dist) * maxDistanceDelta
    );
  }
  static Scale(a: Vec2, b: Vec2): Vec2 {
    return new Vec2(a.x * b.x, a.y * b.y);
  }
  Scale(scale: Vec2): void {
    this.x *= scale.x;
    this.y *= scale.y;
  }
  Normalize(): void {
    const mag = this.magnitude;
    if (mag > MathUtils.kEpsilon) {
      this.x /= mag;
      this.y /= mag;
    } else {
      this.x = Vec2.zero.x;
      this.y = Vec2.zero.y;
    }
  }
  get normalize() {
    const v = new Vec2(this.x, this.y);
    v.Normalize();
    return v;
  }
  static Reflect(inDirection: Vec2, inNormal: Vec2): Vec2 {
    const factor = -2.0 * Vec2.Dot(inNormal, inDirection);
    return new Vec2(
      factor * inNormal.x + inDirection.x,
      factor * inNormal.y + inDirection.y
    );
  }
  static Perpendicular(inDirection: Vec2): Vec2 {
    return new Vec2(-inDirection.y, inDirection.x);
  }
  static Dot(lhs: Vec2, rhs: Vec2): number {
    return lhs.x * rhs.x + lhs.y * rhs.y;
  }
  static Angle(from: Vec2, to: Vec2): number {
    const denominator = Math.sqrt(from.sqrMagnitude * to.sqrMagnitude);
    if (denominator < MathUtils.kEpsilonNormalSqrt) {
      return 0.0;
    }
    const dot = MathUtils.clamp(Vec2.Dot(from, to) / denominator, -1.0, 1.0);
    return Math.acos(dot) * MathUtils.Rad2Deg;
  }
  static SignedAngle(from: Vec2, to: Vec2): number {
    const unsigned_angle = Vec2.Angle(from, to);
    const sign = Math.sign(from.x * to.y - from.y * to.x);
    return unsigned_angle * sign;
  }
  static Distance(a: Vec2, b: Vec2): number {
    const diff_x = a.x - b.x;
    const diff_y = a.y - b.y;
    return Math.sqrt(diff_x * diff_x + diff_y * diff_y);
  }
  static ClampMagnitude(vector: Vec2, maxLength: number): Vec2 {
    const sqrMagnitude = vector.sqrMagnitude;
    if (sqrMagnitude > maxLength * maxLength) {
      const mag = Math.sqrt(sqrMagnitude);

      //these intermediate variables force the intermediate result to be
      //of float precision. without this, the intermediate result can be of higher
      //precision, which changes behavior.
      const normalized_x = vector.x / mag;
      const normalized_y = vector.y / mag;
      return new Vec2(normalized_x * maxLength, normalized_y * maxLength);
    }
    return vector;
  }
  static SqrMagnitude(a: Vec2): number {
    return a.x * a.x + a.y * a.y;
  }
  SqrMagnitude(): number {
    return this.x * this.x + this.y * this.y;
  }
  static SmoothDamp(
    current: Vec2,
    target: Vec2,
    currentVelocity: Vec2,
    smoothTime: number,
    maxSpeed: number,
    deltaTime: number
  ) {
    // Based on Game Programming Gems 4 Chapter 1.10
    smoothTime = MathUtils.Max(0.0001, smoothTime);
    const omega = 2 / smoothTime;

    const x = omega * deltaTime;
    const exp = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x);

    let change_x = current.x - target.x;
    let change_y = current.y - target.y;
    const originalTo = target;

    // Clamp maximum speed
    const maxChange = maxSpeed * smoothTime;

    const maxChangeSq = maxChange * maxChange;
    const sqDist = change_x * change_x + change_y * change_y;
    if (sqDist > maxChangeSq) {
      const mag = Math.sqrt(sqDist);
      change_x = (change_x / mag) * maxChange;
      change_y = (change_y / mag) * maxChange;
    }

    target.x = current.x - change_x;
    target.y = current.y - change_y;

    const temp_x = (currentVelocity.x + omega * change_x) * deltaTime;
    const temp_y = (currentVelocity.y + omega * change_y) * deltaTime;

    currentVelocity.x = (currentVelocity.x - omega * temp_x) * exp;
    currentVelocity.y = (currentVelocity.y - omega * temp_y) * exp;

    let output_x = target.x + (change_x + temp_x) * exp;
    let output_y = target.y + (change_y + temp_y) * exp;

    // Prevent overshooting
    const origMinusCurrent_x = originalTo.x - current.x;
    const origMinusCurrent_y = originalTo.y - current.y;
    const outMinusOrig_x = output_x - originalTo.x;
    const outMinusOrig_y = output_y - originalTo.y;

    if (
      origMinusCurrent_x * outMinusOrig_x +
        origMinusCurrent_y * outMinusOrig_y >
      0
    ) {
      output_x = originalTo.x;
      output_y = originalTo.y;

      currentVelocity.x = (output_x - originalTo.x) / deltaTime;
      currentVelocity.y = (output_y - originalTo.y) / deltaTime;
    }
    return new Vec2(output_x, output_y);
  }

  static toVec2(v: Vec3): Vec2 {
    return new Vec2(v.x, v.y);
  }
  static toVec3(v: Vec2): Vec3 {
    return new Vec3(v.x, v.y, 0);
  }
}
