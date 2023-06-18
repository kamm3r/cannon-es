import { Geometry } from './Geometry';
import { TriangleMesh } from './TriangleMesh';

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
export class TriangleMeshGeometry extends Geometry {
  /** The scaling transformation */
  scale: number;
  /** A reference to the convex mesh object TODO:fix */
  triangleMesh: TriangleMesh | null;
  /** Mesh flags */
  meshFlags: any;
  /** padding for mesh flags */
  paddingFromFlags: any;

  constructor(mesh = null, scaling = 0, flags = 'df') {
    super('TriangleMesh');

    this.triangleMesh = mesh;
    this.scale = scaling;
    this.meshFlags = flags;
    this.paddingFromFlags = this.meshFlags;
  }
}
