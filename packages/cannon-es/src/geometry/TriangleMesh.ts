import { Vec3 } from '../cannon-es';

/**
 * Trimesh.
 * @example
 *     // How to make a mesh with a single triangle
 *     const vertices = [
 *         0, 0, 0, // vertex 0
 *         1, 0, 0, // vertex 1
 *         0, 1, 0  // vertex 2
 *     ]
 *     const indices = [
 *         0, 1, 2  // triangle 0
 *     ]
 *     const trimeshShape = new CANNON.Trimesh(vertices, indices)
 */
export class TriangleMesh {
  /** Returns the number of vertices */
  getNbVertices(): number {
    return 0;
  }
  /** Returns the vertices */
  getVertices(): Vec3 {
    return new Vec3();
  }
  /** Returns the number of vertices */
  getNbTriangles(): number {
    return 0;
  }
  /** Returns the vertices */
  getTriangles(): void {
    new Vec3();
  }
}
