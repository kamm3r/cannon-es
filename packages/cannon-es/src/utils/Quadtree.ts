import { AABB } from '../cannon-es';
import { Vec2 } from '../math/Vec2';

export class Quadtree {
  static readonly CAPACITY = 4;
  boundary: AABB;
  points: Vec2[] = new Array<Vec2>(Quadtree.CAPACITY);
  nw: Quadtree | null = null;
  ne: Quadtree | null = null;
  sw: Quadtree | null = null;
  se: Quadtree | null = null;
  constructor(boundary: AABB) {
    this.boundary = boundary;
  }

  insert(p: Vec2): boolean {
    // Ignore objects that do not belong in this quad tree
    if (!this.boundary.Contains(Vec2.toVec3(p))) return false; // object cannot be added

    // If there is space in this quad tree and if doesn't have subdivisions, add the object here
    if (this.points.length < Quadtree.CAPACITY && this.nw === null) {
      this.points.push(p);
      return true;
    }

    // Otherwise, subdivide and then add the point to whichever node will accept it
    if (this.nw === null) this.subdivide();
    // We have to add the points/data contained in this quad array to the new quads if we only want
    // the last node to hold the data

    if (this.nw?.insert(p)) return true;
    if (this.ne?.insert(p)) return true;
    if (this.sw?.insert(p)) return true;
    if (this.se?.insert(p)) return true;

    // Otherwise, the point cannot be inserted for some unknown reason (this should never happen)
    return false;
  }
  subdivide(): void {
    this.ne = new Quadtree(this.boundary);
    this.nw = new Quadtree(this.boundary);
    this.se = new Quadtree(this.boundary);
    this.sw = new Quadtree(this.boundary);
  }
  queryRange(range: AABB): Vec2[] {
    // Prepare an array of results
    const pointsInRange = this.points;
    // Automatically abort if the range does not intersect this quad
    if (!this.boundary.Intersects(range)) {
      return pointsInRange; // empty list
    }
    // Check objects at this quad level
    for (let p = 0; p < this.points.length; p++) {
      if (range.Contains(Vec2.toVec3(this.points[p]!)))
        pointsInRange.push(this.points[p]!);
    }

    // Terminate here, if there are no children
    if (this.nw === null) {
      return pointsInRange;
    }

    // Otherwise, add the points from the children
    pointsInRange.push(...this.nw!.queryRange(range));
    pointsInRange.push(...this.ne!.queryRange(range));
    pointsInRange.push(...this.sw!.queryRange(range));
    pointsInRange.push(...this.se!.queryRange(range));

    return pointsInRange;
  }
}
