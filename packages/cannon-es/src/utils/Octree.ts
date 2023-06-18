import { AABB } from '../collision/shapes/AABB';
import { Vec3 } from '../math/Vec3';

/**
 * Octree
 */
export class Octree {
  static readonly CAPACITY = 8;
  /** The root/parent node */
  // root: OctreeNode;
  /** Children to this node */
  children: Octree[];
  /** Boundary of this node */
  boundary: AABB;
  points: Vec3[] = new Array<Vec3>(Octree.CAPACITY);

  constructor(boundary: AABB) {
    this.boundary = boundary;
    this.children = [];
  }

  /**
   * reset
   */
  reset(): void {
    this.children.length = this.points.length = 0;
  }

  /**
   * Insert object into node
   * @return True if successful, otherwise false
   */
  insert(p: Vec3): boolean {
    // Ignore objects that do not belong in this node
    if (!this.boundary.Contains(p)) {
      return false; // object cannot be added
    }

    if (this.points.length < Octree.CAPACITY && this.children[0] === null) {
      this.points.push(p);
      return true;
    }

    if (this.children[0] === null) this.subdivide();

    if (this.children[0]?.insert(p)) return true;
    if (this.children[1]?.insert(p)) return true;
    if (this.children[2]?.insert(p)) return true;
    if (this.children[3]?.insert(p)) return true;
    if (this.children[4]?.insert(p)) return true;
    if (this.children[5]?.insert(p)) return true;
    if (this.children[6]?.insert(p)) return true;
    if (this.children[7]?.insert(p)) return true;

    return false;
  }

  /**
   * Create 8 equally sized children nodes and put them in the `children` array.
   */
  subdivide(): void {
    const { x, y, z } = this.boundary.center;
    const halfWidth = this.boundary.extents.x / 2;
    const halfHeight = this.boundary.extents.y / 2;
    const halfDepth = this.boundary.extents.z / 2;
    this.children[0] = new Octree(
      new AABB(
        new Vec3(x - halfWidth, y + halfHeight, z - halfDepth),
        new Vec3(Octree.CAPACITY)
      )
    );
    this.children[1] = new Octree(
      new AABB(
        new Vec3(x + halfWidth, y + halfHeight, z - halfDepth),
        new Vec3(Octree.CAPACITY)
      )
    );
    this.children[2] = new Octree(
      new AABB(
        new Vec3(x - halfWidth, y - halfHeight, z - halfDepth),
        new Vec3(Octree.CAPACITY)
      )
    );
    this.children[3] = new Octree(
      new AABB(
        new Vec3(x + halfWidth, y - halfHeight, z - halfDepth),
        new Vec3(Octree.CAPACITY)
      )
    );
    this.children[4] = new Octree(
      new AABB(
        new Vec3(x - halfWidth, y + halfHeight, z + halfDepth),
        new Vec3(Octree.CAPACITY)
      )
    );
    this.children[5] = new Octree(
      new AABB(
        new Vec3(x + halfWidth, y + halfHeight, z + halfDepth),
        new Vec3(Octree.CAPACITY)
      )
    );
    this.children[6] = new Octree(
      new AABB(
        new Vec3(x - halfWidth, y - halfHeight, z + halfDepth),
        new Vec3(Octree.CAPACITY)
      )
    );
    this.children[7] = new Octree(
      new AABB(
        new Vec3(x + halfWidth, y - halfHeight, z + halfDepth),
        new Vec3(Octree.CAPACITY)
      )
    );
  }

  /**
   * Get all data, potentially within an AABB
   * @return The "result" object
   */
  queryRange(range: AABB): Vec3[] {
    // Prepare an array of results
    const pointsInRange = this.points;
    // Automatically abort if the range does not intersect this quad
    if (!this.boundary.Intersects(range)) {
      return pointsInRange; // empty list
    }
    // Check objects at this quad level
    for (let p = 0; p < this.points.length; p++) {
      if (range.Contains(this.points[p]!)) pointsInRange.push(this.points[p]!);
    }

    // Terminate here, if there are no children
    if (this.children[0] === null) {
      return pointsInRange;
    }

    // Otherwise, add the points from the children
    pointsInRange.push(...this.children[0]!.queryRange(range));
    pointsInRange.push(...this.children[1]!.queryRange(range));
    pointsInRange.push(...this.children[2]!.queryRange(range));
    pointsInRange.push(...this.children[3]!.queryRange(range));
    pointsInRange.push(...this.children[4]!.queryRange(range));
    pointsInRange.push(...this.children[5]!.queryRange(range));
    pointsInRange.push(...this.children[6]!.queryRange(range));
    pointsInRange.push(...this.children[7]!.queryRange(range));

    return pointsInRange;
  }

  /**
   * Get all data, potentially intersected by a ray.
   * @return The "result" object
   */
  // rayQuery(ray: Ray, treeTransform: Transform, result: number[]): number[] {
  //   // Use aabb query for now.
  //   /** @todo implement real ray query which needs less lookups */
  //   ray.GetPoint(6);
  //   tmpAABB.toLocalFrame(treeTransform, tmpAABB);
  //   this.aabbQuery(tmpAABB, result);

  //   return result;
  // }

  /**
   * removeEmptyNodes
   */
  removeEmptyNodes(): void {
    for (let i = this.children.length - 1; i >= 0; --i) {
      this.children[i]?.removeEmptyNodes();
      if (
        !this.children[i]?.children.length &&
        !this.children[i]?.points.length
      ) {
        this.children.splice(i, 1);
      }
    }
  }
}
