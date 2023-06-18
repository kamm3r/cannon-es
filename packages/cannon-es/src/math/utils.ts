export class MathUtils {
  /**
   * The circle constant. Defined as the circumference of a circle divided by its radius. Equivalent to 2*pi
   */
  static TAU = 6.28318530717959;
  /**
   * An obscure circle constant. Defined as the circumference of a circle divided by its diameter. Equivalent to 0.5*tau
   */
  static PI = 3.14159265359;
  /**
   * Euler's number. The base of the natural logarithm. f(x)=e^x is equal to its own derivative
   */
  static E = 2.71828182846;
  /**
   * The golden ratio. It is the value of a/b where a/b = (a+b)/a. It's the positive root of x^2-x-
   */
  static GOLDEN_RATIO = 1.61803398875;
  /**
   * The square root of two. The length of the vector (1,1)
   */
  static SQRT2 = 1.41421356237;
  /**
   * The square root of two. The length of the vector (1,1)
   */
  static RSQRT2 = 1 / this.SQRT2;
  /**
   * Multiply an angle in degrees by this, to convert it to radians
   */
  static Deg2Rad = this.TAU / 360;
  /**
   * Multiply an angle in radians by this, to convert it to degrees
   */
  static Rad2Deg = 360 / this.TAU;
  static Epsilon = Number.EPSILON;
  static kEpsilon = 0.000001;
  static kEpsilonNormalSqrt = 1e-15;
  static Infinity = Number.POSITIVE_INFINITY;
  static NegativeInfinity = Number.NEGATIVE_INFINITY;
  static Abs(value: number): number {
    return Math.abs(value);
  }
  static Min(a: number, b: number): number {
    return a < b ? a : b;
  }
  static Max(a: number, b: number): number {
    return a > b ? a : b;
  }
  static clamp(value: number, min: number, max: number): number {
    return value < min ? min : value > max ? max : value;
  }
  static clamp01(value: number): number {
    return value < 0 ? 0 : value > 1 ? 1 : value;
  }

  static Lerp(a: number, b: number, t: number): number {
    return (1 - t) * a + t * b;
  }

  static FastLerp(a: number, b: number, t: number): number {
    return a + (b - a) * t;
  }
  static LerpClamped(a: number, b: number, t: number): number {
    return this.Lerp(a, b, this.clamp01(t));
  }
  static Approximately(a: number, b: number): boolean {
    return (
      this.Abs(b - a) <
      this.Max(
        this.kEpsilon * this.Max(this.Abs(a), this.Abs(a)),
        this.kEpsilon * 8
      )
    );
  }
}
