import { Vec3 } from '../math/Vec3';
import { Vec4 } from '../math/Vec4';
import { Quaternion } from '../math/Quaternion';
import { Mat4 } from './Mat4';
//import { MathUtils } from './utils';

const Space = {
	local: 'local',
	world: 'world',
} as const;

type Space = (typeof Space)[keyof typeof Space];

/**
 * Transformation utilities.
 */
export class Transform {
	/** The position of the transform in world space */
	get translation(): Vec3 {
		return Vec3.zero;
	}
	set translation(value: Vec3) {
		this.translation = value;
	}
	/** The rotation of the transform in world space stored as a quaternion */
	get rotation(): Quaternion {
		return Quaternion.identity;
	}
	set rotation(value: Quaternion) {
		this.rotation = value;
	}
	/** The rotation of the transform in world space stored as a quaternion */
	get scale(): Vec3 {
		return Vec3.one;
	}
	set scale(value: Vec3) {
		this.scale = value;
	}
	// Returns the topmost transform in the hierarchy
//	get root(): Transform {
//		return this.GetRoot();
//	}
//	private GetRoot(): Transform {
//		return new Transform();
//	}
	/**
	 * Position of the transform relative to the parent transform
	 */
	get localTranslation(): Vec3 {
		return Vec3.zero;
	}
	set localTranslation(value: Vec3) {
		this.localTranslation = value;
	}
	/**
	 * The rotation of the transform relative to the parent transform's rotation
	 */
	get localRotation(): Quaternion {
		return Quaternion.identity;
	}
	set localRotation(value: Quaternion) {
		this.localRotation = value;
	}
	/**
	 * The scale of the transform relative to the parent.
	 */
	get localScale(): Vec3 {
		return Vec3.zero;
	}
	set localScale(value: Vec3) {
		this.localScale = value;
	}
	/**
	 * The rotation as Euler angles in degrees
	 */
	get eulerAngles(): Vec3 {
		return this.rotation.eulerAngles;
	}
	set eulerAngles(value: Vec3) {
		this.rotation = Quaternion.Euler(value);
	}
	/**
	 * The rotation as Euler angles in degrees relative to the parent transform's rotation
	 */
	get localEulerAngles(): Vec3 {
		return this.localRotation.eulerAngles;
	}
	set localEulerAngles(value: Vec3) {
		this.localRotation = Quaternion.Euler(value);
	}
	/**
	 * The blue axis of the transform in world space
	 */
	get forward(): Vec3 {
		return Quaternion.multiplyWithVec3(this.rotation, Vec3.forward);
	}
	set forward(value: Vec3) {
		this.rotation = Quaternion.LookRotation(value);
	}
	/**
	 * The red axis of the transform in world space
	 */
	get right(): Vec3 {
		return Quaternion.multiplyWithVec3(this.rotation, Vec3.right);
	}
	set right(value: Vec3) {
		this.rotation = Quaternion.FromToRotation(Vec3.right, value);
	}
	/**
	 * The green axis of the transform in world space
	 */
	get up(): Vec3 {
		return Quaternion.multiplyWithVec3(this.rotation, Vec3.up);
	}
	set up(value: Vec3) {
		this.rotation = Quaternion.FromToRotation(Vec3.up, value);
	}
	get worldToLocalMatrix(): Mat4 {
		return Mat4.TRS(this.localTranslation, this.localRotation, this.localScale)
			.inverse;
	}
	get localToWorldMatrix(): Mat4 {
		return Mat4.TRS(this.localTranslation, this.localRotation, this.localScale);
	}

	Translate(translation: Vec3): void {
		this.translation = Vec3.add(
			this.translation,
			this.TransrformDirection(translation)
		);
	}

	Rotate(eulers: Vec3, relativeTo = Space.local): void {
		const eulerRot = Quaternion.Euler(eulers);
		if (relativeTo === Space.local) {
			this.localRotation = Quaternion.mult(this.localRotation, eulerRot);
		} else {
			this.rotation = Quaternion.mult(
				Quaternion.mult(
					Quaternion.mult(this.rotation, Quaternion.Inverse(this.rotation)),
					eulerRot
				),
				this.rotation
			);
		}
	}

	RotateAround(point: Vec3, axis: Vec3, angle: number): void {
		let worldPos = this.translation;
		const q = Quaternion.AngleAxis(angle, axis);
		let dif = Vec3.sub(worldPos, point);
		dif = Quaternion.multiplyWithVec3(q, dif);
		worldPos = Vec3.add(point, dif);
		this.translation = worldPos;
	}
	/**
	 * Rotates the transform so the forward vector points at target's current position
	 * @param target Object to point towards
	 * @param worldUp Vector specifying the upward direction
	 */
	LookAt(target: Transform, worldUp = Vec3.up): void {
		const d = Mat4.LookAt(this.translation, target.translation, worldUp);
		this.translation = d.GetPosition();
		this.rotation = d.rotation;
	}
	/** Transforms direction from local space to world space */
	TransrformDirection(direction: Vec3): Vec3 {
		return Quaternion.multiplyWithVec3(this.rotation, direction);
	}
	/** Transforms direction from world space to local space */
	InverseTransrformDirection(direction: Vec3): Vec3 {
		return Quaternion.multiplyWithVec3(
			Quaternion.Inverse(this.rotation),
			direction
		);
	}
	/** Transforms vector from local space to world space */
	TransformVector(vector: Vec3): Vec3 {
		return Vec4.toVec3(
			Mat4.multiplyVec4(
				this.localToWorldMatrix,
				new Vec4(vector.x, vector.y, vector.z, 0)
			)
		);
	}
	/** Transforms vector from world space to local space */
	InverseTransformVector(vector: Vec3): Vec3 {
		return Vec4.toVec3(
			Mat4.multiplyVec4(
				this.worldToLocalMatrix,
				new Vec4(vector.x, vector.y, vector.z, 0)
			)
		);
	}
	/** Transforms point from local space to world space */
	TransformPoint(local: Vec3): Vec3 {
		return this.localToWorldMatrix.MultiplyPoint3x4(local);
	}
	/** Transforms point from world space to local space */
	InverseTransformPoint(world: Vec3): Vec3 {
		return this.worldToLocalMatrix.MultiplyPoint3x4(world);
	}
	get hasChanged(): boolean {
		if (this.parent !== null && this.parent.hasChanged) {
			return true
		} else if (this.translation !== this.localTranslation) {
			return true
		} else if (this.rotation !== this.localRotation) {
			return true
		} else if (this.scale !== this.localScale) {
			return true
		} else {
			return false;
		}
	}
	set hasChanged(value: boolean) {
		this.hasChanged = value;
	}
	get parent(): Transform {
		return this.parentInternal;
	}
	set parent(value: Transform) {
		this.parentInternal = value;
	}
	private get parentInternal(): Transform {
		return this.GetParent();
	}
	private set parentInternal(value: Transform) {
		this.SetParent(value, true);
	}
	private GetParent(): Transform {
		return new Transform();
	}
	SetParent(parent: Transform, worldTranslationStays: boolean): void {
		if (worldTranslationStays) {
			this.parent = parent;
		}
	}
}
