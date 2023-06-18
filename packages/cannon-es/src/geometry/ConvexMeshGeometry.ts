import { ConvexMesh } from './ConvexMesh';
import { Geometry } from './Geometry';

/**
 * A set of polygons describing a convex shape.
 *
 * The shape MUST be convex for the code to work properly. No polygons may be coplanar (contained
 * in the same 3D plane), instead these should be merged into one polygon.
 *
 * @author qiao / https://github.com/qiao (original author, see https://github.com/qiao/three.js/commit/85026f0c769e4000148a67d45a9e9b9c5108836f)
 * @author schteppe / https://github.com/schteppe
 * @see https://www.altdevblogaday.com/2011/05/13/contact-generation-between-3d-convex-meshes/
 *
 * @todo Move the clipping functions to ContactGenerator?
 * @todo Automatically merge coplanar polygons in constructor.
 * @example
 *     const convexShape = new CANNON.ConvexPolyhedron({ vertices, faces })
 *     const convexBody = new CANNON.Body({ mass: 1, shape: convexShape })
 *     world.addBody(convexBody)
 */

export class ConvexMeshGeometry extends Geometry {
  /**
   * The scaling transformation (from vertex space to shape space)
   */
  scale: number;
  /**
   * A reference to the convex mesh object TODO:fix
   */
  convexMesh: ConvexMesh | null;
  /**
   * Mesh flags
   */
  meshFlags: any;
  /**
   * padding for mesh flags
   */
  paddingFromFlags: any;

  constructor(mesh = null, scaling = 0, flags = 'df') {
    super('ConvexMesh');

    this.convexMesh = mesh;
    this.scale = scaling;
    this.meshFlags = flags;
    this.paddingFromFlags = this.meshFlags;
  }
}
