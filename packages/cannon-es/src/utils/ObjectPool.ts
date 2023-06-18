import { Vec3 } from '../cannon-es';

export class GameObject {
	translation: Vec3;
	rotation: Vec3;
	scale: Vec3;

	constructor() {
		this.translation = new Vec3();
		this.rotation = new Vec3();
		this.scale = new Vec3();
	}

	clear() {
		this.translation = Vec3.zero;
		this.rotation = Vec3.zero;
		this.scale = Vec3.zero;
	}
}

interface IObjectPool<T> {
	get CountInactive(): number;
	Get(): T;
	Release(element: T): void;
	Clear(): void
}

type Action<T> = (args: T) => void

/**
 * For pooling objects that can be reused.
 */
export class ObjectPool<T> implements IObjectPool<T> {
	private List: Array<T>
	private CreateFunc: () => T
	private ActionOnGet: Action<T>
	private ActionOnRelease: Action<T>
	private ActionOnDestroy: Action<T>
	private MaxSize: number
	private CollectionCheck: boolean
	FreashlyReleased: T | null = null

	CountAll: number = 0;
	get CountActive(): number {
		return this.CountAll - this.CountInactive;
	}
	get CountInactive(): number {
		return this.List.length + (this.FreashlyReleased ? 1 : 0);
	}

	constructor(createFunc: () => T, actionOnGet: Action<T>, actionOnRelease: Action<T>, actionOnDestroy: Action<T>, collectionCheck = true, defaultCapacity = 10, maxSize = 10000) {
		if (createFunc === null) {
			throw new Error(`function is null ${createFunc}`)
		}
		if (maxSize <= 0) {
			throw new Error(`Max size must be greater than 0, current size ${maxSize}`)
		}
		this.List = new Array<T>(defaultCapacity)
		this.CreateFunc = createFunc
		this.MaxSize = maxSize
		this.ActionOnGet = actionOnGet;
		this.ActionOnRelease = actionOnRelease;
		this.ActionOnDestroy = actionOnDestroy;
		this.CollectionCheck = collectionCheck
	}

	Get(): T {
		let element: T
		if (this.FreashlyReleased !== null) {
			element = this.FreashlyReleased
			this.FreashlyReleased = null
		} else if (this.List.length === 0) {
			element = this.CreateFunc()
			this.CountAll++
		} else {
			const idx = this.List.length - 1
			element = this.List[idx]!
			this.List.splice(1, idx)
		}
		this.ActionOnGet(element)
		return element
	}
	Release(element: T): void {
		if (this.CollectionCheck && (this.List.length - 1 > 0 || this.FreashlyReleased !== null)) {
			if (element === this.FreashlyReleased) {
				throw new Error(
					"Trying to release an object that has already been released to the pool."
				);
			}
			for (let i = 0; i < this.List.length; i++) {
				if (element === this.List[i]) {
					throw new Error(
						"Trying to release an object that has already been released to the pool."
					);
				}
			}
		}

		if (this.ActionOnRelease) {
			this.ActionOnRelease(element);
		}

		if (!this.FreashlyReleased) {
			this.FreashlyReleased = element;
		} else if (this.CountInactive < this.MaxSize) {
			this.List.push(element);
		} else if (this.ActionOnDestroy) {
			this.ActionOnDestroy(element);
		}
	}

	Clear(): void {
		if (this.ActionOnDestroy) {

			for (const item of this.List) {
				this.ActionOnDestroy(item);
			}

			if (this.FreashlyReleased) {
				this.ActionOnDestroy(this.FreashlyReleased);
			}
		}

		this.FreashlyReleased = null;
		this.List.length = 0;
		this.CountAll = 0
	}
	Dispose(): void {
		this.Clear()
	}
	HasElement(element: T): boolean {
		return this.FreashlyReleased === element || this.List.includes(element)
	}

}
