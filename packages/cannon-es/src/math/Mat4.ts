import { Plane } from '../collision/shapes/Plane';
import { Quaternion } from './Quaternion';
import { Vec3 } from './Vec3';
import { Vec4 } from './Vec4';

export class Mat4 {
    // memory layout:
    //
    //                row no (=vertical)
    //               |  0   1   2   3
    //            ---+----------------
    //            0  | m00 m10 m20 m30
    // column no  1  | m01 m11 m21 m31
    // (=horiz)   2  | m02 m12 m22 m32
    //            3  | m03 m13 m23 m33

    m00: number;
    m10: number;
    m20: number;
    m30: number;

    m01: number;
    m11: number;
    m21: number;
    m31: number;

    m02: number;
    m12: number;
    m22: number;
    m32: number;

    m03: number;
    m13: number;
    m23: number;
    m33: number;

    constructor(column0: Vec4, column1: Vec4, column2: Vec4, column3: Vec4) {
        this.m00 = column0.x;
        this.m01 = column1.x;
        this.m02 = column2.x;
        this.m03 = column3.x;
        this.m10 = column0.y;
        this.m11 = column1.y;
        this.m12 = column2.y;
        this.m13 = column3.y;
        this.m20 = column0.z;
        this.m21 = column1.z;
        this.m22 = column2.z;
        this.m23 = column3.z;
        this.m30 = column0.w;
        this.m31 = column1.w;
        this.m32 = column2.w;
        this.m33 = column3.w;
    }
    /**
     * Returns the identity matri
     */
    static get identity(): Mat4 {
        return new Mat4(
            new Vec4(1, 0, 0, 0),
            new Vec4(0, 1, 0, 0),
            new Vec4(0, 0, 1, 0),
            new Vec4(0, 0, 0, 1)
        );
    }
    /**
     * Returns a matrix with all elements set to zero
     */
    static get zero(): Mat4 {
        return new Mat4(
            new Vec4(0, 0, 0, 0),
            new Vec4(0, 0, 0, 0),
            new Vec4(0, 0, 0, 0),
            new Vec4(0, 0, 0, 0)
        );
    }

    private GetDeterminant(): number {
        let res = 0.0;

        // Cache the matrix values (speed optimization)
        const a00 = this.m00,
            a01 = this.m10,
            a02 = this.m20,
            a03 = this.m30;
        const a10 = this.m01,
            a11 = this.m11,
            a12 = this.m21,
            a13 = this.m31;
        const a20 = this.m02,
            a21 = this.m12,
            a22 = this.m22,
            a23 = this.m32;
        const a30 = this.m03,
            a31 = this.m13,
            a32 = this.m23,
            a33 = this.m33;

        res =
            a30 * a21 * a12 * a03 -
            a20 * a31 * a12 * a03 -
            a30 * a11 * a22 * a03 +
            a10 * a31 * a22 * a03 +
            a20 * a11 * a32 * a03 -
            a10 * a21 * a32 * a03 -
            a30 * a21 * a02 * a13 +
            a20 * a31 * a02 * a13 +
            a30 * a01 * a22 * a13 -
            a00 * a31 * a22 * a13 -
            a20 * a01 * a32 * a13 +
            a00 * a21 * a32 * a13 +
            a30 * a11 * a02 * a23 -
            a10 * a31 * a02 * a23 -
            a30 * a01 * a12 * a23 +
            a00 * a31 * a12 * a23 +
            a10 * a01 * a32 * a23 -
            a00 * a11 * a32 * a23 -
            a20 * a11 * a02 * a33 +
            a10 * a21 * a02 * a33 +
            a20 * a01 * a12 * a33 -
            a00 * a21 * a12 * a33 -
            a10 * a01 * a22 * a33 +
            a00 * a11 * a22 * a33;

        return res;
    }

    static Determinant(m: Mat4): number {
        return m.determinant;
    }
    /**
     * The determinant of the matrix
     */
    get determinant(): number {
        return this.GetDeterminant();
    }
    /** TODO:TEST that it works correctly */
    static Inverse(m: Mat4): Mat4 {
        const res = Mat4.zero;
        // Cache the matrix values (speed optimization)
        const a00 = m.m00,
            a01 = m.m10,
            a02 = m.m20,
            a03 = m.m30;
        const a10 = m.m01,
            a11 = m.m11,
            a12 = m.m21,
            a13 = m.m31;
        const a20 = m.m02,
            a21 = m.m12,
            a22 = m.m22,
            a23 = m.m32;
        const a30 = m.m03,
            a31 = m.m13,
            a32 = m.m23,
            a33 = m.m33;

        const b00 = a00 * a11 - a01 * a10;
        const b01 = a00 * a12 - a02 * a10;
        const b02 = a00 * a13 - a03 * a10;
        const b03 = a01 * a12 - a02 * a11;
        const b04 = a01 * a13 - a03 * a11;
        const b05 = a02 * a13 - a03 * a12;
        const b06 = a20 * a31 - a21 * a30;
        const b07 = a20 * a32 - a22 * a30;
        const b08 = a20 * a33 - a23 * a30;
        const b09 = a21 * a32 - a22 * a31;
        const b10 = a21 * a33 - a23 * a31;
        const b11 = a22 * a33 - a23 * a32;

        // Calculate the invert determinant (inlined to avoid double-caching)
        const invDet =
            1.0 /
            (b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06);

        res.m00 = (a11 * b11 - a12 * b10 + a13 * b09) * invDet;
        res.m10 = (-a01 * b11 + a02 * b10 - a03 * b09) * invDet;
        res.m20 = (a31 * b05 - a32 * b04 + a33 * b03) * invDet;
        res.m30 = (-a21 * b05 + a22 * b04 - a23 * b03) * invDet;
        res.m01 = (-a10 * b11 + a12 * b08 - a13 * b07) * invDet;
        res.m11 = (a00 * b11 - a02 * b08 + a03 * b07) * invDet;
        res.m21 = (-a30 * b05 + a32 * b02 - a33 * b01) * invDet;
        res.m31 = (a20 * b05 - a22 * b02 + a23 * b01) * invDet;
        res.m02 = (a10 * b10 - a11 * b08 + a13 * b06) * invDet;
        res.m12 = (-a00 * b10 + a01 * b08 - a03 * b06) * invDet;
        res.m22 = (a30 * b04 - a31 * b02 + a33 * b00) * invDet;
        res.m32 = (-a20 * b04 + a21 * b02 - a23 * b00) * invDet;
        res.m03 = (-a10 * b09 + a11 * b07 - a12 * b06) * invDet;
        res.m13 = (a00 * b09 - a01 * b07 + a02 * b06) * invDet;
        res.m23 = (-a30 * b03 + a31 * b01 - a32 * b00) * invDet;
        res.m33 = (a20 * b03 - a21 * b01 + a22 * b00) * invDet;
        return res;
    }
    /**
     * The determinant of the matrix.
     */
    get inverse(): Mat4 {
        return Mat4.Inverse(this);
    }
    private GetRotation(): Quaternion {
        const res = Quaternion.identity;
        const fourWSquaredMinus1 = this.m00 + this.m11 + this.m22;
        const fourXSquaredMinus1 = this.m00 - this.m11 - this.m22;
        const fourYSquaredMinus1 = this.m11 - this.m00 - this.m22;
        const fourZSquaredMinus1 = this.m22 - this.m00 - this.m11;

        let biggestIndex = 0;
        let fourBiggestSquaredMinus1 = fourWSquaredMinus1;
        if (fourXSquaredMinus1 > fourBiggestSquaredMinus1) {
            fourBiggestSquaredMinus1 = fourXSquaredMinus1;
            biggestIndex = 1;
        }

        if (fourYSquaredMinus1 > fourBiggestSquaredMinus1) {
            fourBiggestSquaredMinus1 = fourYSquaredMinus1;
            biggestIndex = 2;
        }

        if (fourZSquaredMinus1 > fourBiggestSquaredMinus1) {
            fourBiggestSquaredMinus1 = fourZSquaredMinus1;
            biggestIndex = 3;
        }

        const biggestVal = Math.sqrt(fourBiggestSquaredMinus1 + 1.0) * 0.5;
        const mult = 0.25 / biggestVal;

        switch (biggestIndex) {
            case 0:
                res.w = biggestVal;
                res.x = (this.m21 - this.m12) * mult;
                res.y = (this.m02 - this.m20) * mult;
                res.z = (this.m10 - this.m01) * mult;
                break;
            case 1:
                res.x = biggestVal;
                res.w = (this.m21 - this.m12) * mult;
                res.y = (this.m10 + this.m01) * mult;
                res.z = (this.m02 + this.m20) * mult;
                break;
            case 2:
                res.y = biggestVal;
                res.w = (this.m02 - this.m20) * mult;
                res.x = (this.m10 + this.m01) * mult;
                res.z = (this.m21 + this.m12) * mult;
                break;
            case 3:
                res.z = biggestVal;
                res.w = (this.m10 - this.m01) * mult;
                res.x = (this.m02 + this.m20) * mult;
                res.y = (this.m21 + this.m12) * mult;
                break;
        }

        return res;
    }
    /**
     * Attempts to get a rotation quaternion from this matrix
     */
    get rotation(): Quaternion {
        return this.GetRotation();
    }
    static Transpose(m: Mat4): Mat4 {
        const res = Mat4.zero;
        res.m00 = m.m00;
        res.m10 = m.m01;
        res.m20 = m.m02;
        res.m30 = m.m03;
        res.m01 = m.m10;
        res.m11 = m.m11;
        res.m21 = m.m12;
        res.m31 = m.m13;
        res.m02 = m.m20;
        res.m12 = m.m21;
        res.m22 = m.m22;
        res.m32 = m.m23;
        res.m03 = m.m30;
        res.m13 = m.m31;
        res.m23 = m.m32;
        res.m33 = m.m33;
        return res;
    }
    /**
     * Returns the transpose of this matrix
     */
    get transpose(): Mat4 {
        return Mat4.Transpose(this);
    }

    GetColumn(index: number): Vec4 {
        switch (index) {
            case 0:
                return new Vec4(this.m00, this.m10, this.m20, this.m30);
            case 1:
                return new Vec4(this.m01, this.m11, this.m21, this.m31);
            case 2:
                return new Vec4(this.m02, this.m12, this.m22, this.m32);
            case 3:
                return new Vec4(this.m03, this.m13, this.m23, this.m33);
            default:
                throw new Error('Invalid column index!');
        }
    }
    GetRow(index: number): Vec4 {
        switch (index) {
            case 0:
                return new Vec4(this.m00, this.m01, this.m02, this.m03);
            case 1:
                return new Vec4(this.m10, this.m11, this.m12, this.m13);
            case 2:
                return new Vec4(this.m20, this.m21, this.m22, this.m23);
            case 3:
                return new Vec4(this.m30, this.m31, this.m32, this.m33);
            default:
                throw new Error('Invalid column index!');
        }
    }
    GetPosition(): Vec3 {
        return new Vec3(this.m03, this.m13, this.m23);
    }

    SetColumn(index: number, col: Vec4): void {
        this.GetColumn(index).x = col.x;
        this.GetColumn(index).y = col.y;
        this.GetColumn(index).z = col.z;
        this.GetColumn(index).w = col.w;
    }
    SetRow(index: number, row: Vec4): void {
        this.GetRow(index).x = row.x;
        this.GetRow(index).y = row.y;
        this.GetRow(index).z = row.z;
        this.GetRow(index).w = row.w;
    }

    /**
     * Multiplies two matrices
     */
    static mult(lhs: Mat4, rhs: Mat4): Mat4 {
        const res = Mat4.zero;

        res.m00 =
            lhs.m00 * rhs.m00 +
            lhs.m01 * rhs.m10 +
            lhs.m02 * rhs.m20 +
            lhs.m03 * rhs.m30;
        res.m01 =
            lhs.m00 * rhs.m01 +
            lhs.m01 * rhs.m11 +
            lhs.m02 * rhs.m21 +
            lhs.m03 * rhs.m31;
        res.m02 =
            lhs.m00 * rhs.m02 +
            lhs.m01 * rhs.m12 +
            lhs.m02 * rhs.m22 +
            lhs.m03 * rhs.m32;
        res.m03 =
            lhs.m00 * rhs.m03 +
            lhs.m01 * rhs.m13 +
            lhs.m02 * rhs.m23 +
            lhs.m03 * rhs.m33;

        res.m10 =
            lhs.m10 * rhs.m00 +
            lhs.m11 * rhs.m10 +
            lhs.m12 * rhs.m20 +
            lhs.m13 * rhs.m30;
        res.m11 =
            lhs.m10 * rhs.m01 +
            lhs.m11 * rhs.m11 +
            lhs.m12 * rhs.m21 +
            lhs.m13 * rhs.m31;
        res.m12 =
            lhs.m10 * rhs.m02 +
            lhs.m11 * rhs.m12 +
            lhs.m12 * rhs.m22 +
            lhs.m13 * rhs.m32;
        res.m13 =
            lhs.m10 * rhs.m03 +
            lhs.m11 * rhs.m13 +
            lhs.m12 * rhs.m23 +
            lhs.m13 * rhs.m33;

        res.m20 =
            lhs.m20 * rhs.m00 +
            lhs.m21 * rhs.m10 +
            lhs.m22 * rhs.m20 +
            lhs.m23 * rhs.m30;
        res.m21 =
            lhs.m20 * rhs.m01 +
            lhs.m21 * rhs.m11 +
            lhs.m22 * rhs.m21 +
            lhs.m23 * rhs.m31;
        res.m22 =
            lhs.m20 * rhs.m02 +
            lhs.m21 * rhs.m12 +
            lhs.m22 * rhs.m22 +
            lhs.m23 * rhs.m32;
        res.m23 =
            lhs.m20 * rhs.m03 +
            lhs.m21 * rhs.m13 +
            lhs.m22 * rhs.m23 +
            lhs.m23 * rhs.m33;

        res.m30 =
            lhs.m30 * rhs.m00 +
            lhs.m31 * rhs.m10 +
            lhs.m32 * rhs.m20 +
            lhs.m33 * rhs.m30;
        res.m31 =
            lhs.m30 * rhs.m01 +
            lhs.m31 * rhs.m11 +
            lhs.m32 * rhs.m21 +
            lhs.m33 * rhs.m31;
        res.m32 =
            lhs.m30 * rhs.m02 +
            lhs.m31 * rhs.m12 +
            lhs.m32 * rhs.m22 +
            lhs.m33 * rhs.m32;
        res.m33 =
            lhs.m30 * rhs.m03 +
            lhs.m31 * rhs.m13 +
            lhs.m32 * rhs.m23 +
            lhs.m33 * rhs.m33;

        return res;
    }
    /**
     * Transforms a Vec4 by a matrix
     */
    static multiplyVec4(lhs: Mat4, vector: Vec4): Vec4 {
        const res = new Vec4();
        res.x =
            lhs.m00 * vector.x +
            lhs.m01 * vector.y +
            lhs.m02 * vector.z +
            lhs.m03 * vector.w;
        res.y =
            lhs.m10 * vector.x +
            lhs.m11 * vector.y +
            lhs.m12 * vector.z +
            lhs.m13 * vector.w;
        res.z =
            lhs.m20 * vector.x +
            lhs.m21 * vector.y +
            lhs.m22 * vector.z +
            lhs.m23 * vector.w;
        res.w =
            lhs.m30 * vector.x +
            lhs.m31 * vector.y +
            lhs.m32 * vector.z +
            lhs.m33 * vector.w;
        return res;
    }
    /**
     * Transforms a position by this matrix, with a perspective divide
     */
    MultiplyPoint(point: Vec3): Vec3 {
        const res = new Vec3();
        let w: number;
        res.x =
            this.m00 * point.x + this.m01 * point.y + this.m02 * point.z + this.m03;
        res.y =
            this.m10 * point.x + this.m11 * point.y + this.m12 * point.z + this.m13;
        res.z =
            this.m20 * point.x + this.m21 * point.y + this.m22 * point.z + this.m23;
        w = this.m30 * point.x + this.m31 * point.y + this.m32 * point.z + this.m33;

        w = 1 / w;
        res.x *= w;
        res.y *= w;
        res.z *= w;
        return res;
    }
    /**
     * Transforms a position by this matrix, without a perspective divide
     */
    MultiplyPoint3x4(point: Vec3): Vec3 {
        const res = new Vec3();
        res.x =
            this.m00 * point.x + this.m01 * point.y + this.m02 * point.z + this.m03;
        res.y =
            this.m10 * point.x + this.m11 * point.y + this.m12 * point.z + this.m13;
        res.z =
            this.m20 * point.x + this.m21 * point.y + this.m22 * point.z + this.m23;
        return res;
    }
    /**
     * Transforms a direction by this matrix
     */
    MultiplyVector(vector: Vec3): Vec3 {
        const res = new Vec3();
        res.x = this.m00 * vector.x + this.m01 * vector.y + this.m02 * vector.z;
        res.y = this.m10 * vector.x + this.m11 * vector.y + this.m12 * vector.z;
        res.z = this.m20 * vector.x + this.m21 * vector.y + this.m22 * vector.z;
        return res;
    }

    /**
     * Transforms a plane by this matrix
     */
    TransformPlane(plane: Plane): Plane {
        const ittrans = this.inverse;
        const x = plane.normal.x,
            y = plane.normal.y,
            z = plane.normal.z,
            w = plane.distance;
        // note: a transpose is part of this transformation
        const a =
            ittrans.m00 * x + ittrans.m10 * y + ittrans.m20 * z + ittrans.m30 * w;
        const b =
            ittrans.m01 * x + ittrans.m11 * y + ittrans.m21 * z + ittrans.m31 * w;
        const c =
            ittrans.m02 * x + ittrans.m12 * y + ittrans.m22 * z + ittrans.m32 * w;
        const d =
            ittrans.m03 * x + ittrans.m13 * y + ittrans.m23 * z + ittrans.m33 * w;

        return new Plane(new Vec3(a, b, c), d);
    }
    /**
     * Creates a scaling matrix
     */
    static Scale(vector: Vec3): Mat4 {
        const m = Mat4.zero;
        m.m00 = vector.x;
        m.m11 = vector.y;
        m.m22 = vector.z;
        m.m33 = 1;
        return m;
    }
    /**
     * Creates a translation matrix
     */
    static Translate(vector: Vec3): Mat4 {
        const m = Mat4.identity;
        m.m03 = vector.x;
        m.m13 = vector.y;
        m.m23 = vector.z;
        return m;
    }
    /**
     * Creates a rotation matrix. Note: Assumes unit quaternion
     */
    static Rotate(q: Quaternion): Mat4 {
        const m = Mat4.identity;

        const xx = q.x * q.x;
        const yy = q.y * q.y;
        const zz = q.z * q.z;
        const xy = q.x * q.y;
        const xz = q.x * q.z;
        const yz = q.y * q.z;
        const wx = q.w * q.x;
        const wy = q.w * q.y;
        const wz = q.w * q.z;

        m.m00 = 1 - 2 * (yy + zz);
        m.m01 = 2 * (xy + wz);
        m.m02 = 2 * (xz - wy);

        m.m10 = 2 * (xy - wz);
        m.m11 = 1 - 2 * (xx + zz);
        m.m12 = 2 * (yz + wx);

        m.m20 = 2 * (xz + wy);
        m.m21 = 2 * (yz - wx);
        m.m22 = 1 - 2 * (xx + yy);
        return m;
    }
    /**
     * This function returns a projection matrix with viewing frustum that has a near plane defined by the coordinates that were passed in
     */
    static Frustum(
        left: number,
        right: number,
        bottom: number,
        top: number,
        zNear: number,
        zFar: number
    ): Mat4 {
        const m = Mat4.zero;
        let rl = right - left;
        let tb = top - bottom;
        let fn = zFar - zNear;

        m.m00 = (zNear * 2.0) / rl;
        m.m11 = (zNear * 2.0) / tb;
        m.m20 = (right + left) / rl;
        m.m21 = (top + bottom) / tb;
        m.m22 = -(zFar + zNear) / fn;
        m.m23 = -1;
        m.m32 = -(zFar * zNear * 2.0) / fn;
        return m;
    }
    /**
     * Create a perspective projection matrix
     */
    static Perspective(
        fov: number,
        aspect: number,
        zNear: number,
        zFar: number
    ): Mat4 {
        const res = Mat4.zero;
        const top = zNear * Math.tan(fov * 0.5);
        const bottom = -top;
        const right = top * aspect;
        const left = -right;

        // MatrixFrustum(-right, right, -top, top, near, far);
        const rl = right - left;
        const tb = top - bottom;
        const fn = zFar - zNear;

        res.m00 = (zNear * 2) / rl;
        res.m11 = (zNear * 2) / tb;
        res.m20 = (right + left) / rl;
        res.m21 = (top + bottom) / tb;
        res.m22 = -(zFar + zNear) / fn;
        res.m23 = -1;
        res.m32 = -(zFar * zNear * 2) / fn;

        return res;
    }
    /**
     * Create an orthogonal projection matrix
     */
    static Ortho(
        left: number,
        right: number,
        bottom: number,
        top: number,
        zNear: number,
        zFar: number
    ): Mat4 {
        const res = Mat4.zero;

        const rl = right - left;
        const tb = top - bottom;
        const fn = zFar - zNear;

        res.m00 = 2.0 / rl;
        res.m11 = 2.0 / tb;
        res.m22 = -2.0 / fn;
        res.m30 = -(left + right) / rl;
        res.m31 = -(top + bottom) / tb;
        res.m32 = -(zFar + zNear) / fn;
        res.m33 = 1.0;

        return res;
    }
    /**
     * Create a "look at" matrix.
     */
    static LookAt(from: Vec3, to: Vec3, up: Vec3): Mat4 {
        const res = Mat4.zero;

        let length = 0.0;
        let ilength = 0.0;

        // Vector3Subtract(eye, target)
        const vz = Vec3.sub(from, to);

        // Vector3Normalize(vz)
        let v = vz;
        length = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
        if (length == 0.0) length = 1.0;
        ilength = 1.0 / length;
        vz.x *= ilength;
        vz.y *= ilength;
        vz.z *= ilength;

        // Vector3CrossProduct(up, vz)
        const vx = Vec3.Cross(up, vz);

        // Vector3Normalize(x)
        v = vx;
        length = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
        if (length == 0.0) length = 1.0;
        ilength = 1.0 / length;
        vx.x *= ilength;
        vx.y *= ilength;
        vx.z *= ilength;

        // Vector3CrossProduct(vz, vx)
        const vy = Vec3.Cross(vz, vx);

        res.m00 = vx.x;
        res.m10 = vy.x;
        res.m20 = vz.x;
        res.m30 = 0.0;
        res.m01 = vx.y;
        res.m11 = vy.y;
        res.m21 = vz.y;
        res.m31 = 0.0;
        res.m02 = vx.z;
        res.m12 = vy.z;
        res.m22 = vz.z;
        res.m32 = 0.0;
        res.m03 = -(vx.x * from.x + vx.y * from.y + vx.z * from.z);
        res.m13 = -(vy.x * from.x + vy.y * from.y + vy.z * from.z);
        res.m23 = -(vz.x * from.x + vz.y * from.y + vz.z * from.z);
        res.m33 = 1.0;

        return res;
    }
    //static Inverse3DAffine(input: Mat4, result: Mat4): boolean {
    //    return true;
    // }

    // TODO:TEST
    static TRS(translation: Vec3, rotation: Quaternion, scale: Vec3): Mat4 {
        return Mat4.mult(Mat4.mult(this.Translate(translation), this.Rotate(rotation)), this.Scale(scale))
    }
    // TODO:FIX
    SetTRS(translation: Vec3, rotation: Quaternion, scale: Vec3): void {
        Mat4.TRS(translation, rotation, scale);
    }
}
