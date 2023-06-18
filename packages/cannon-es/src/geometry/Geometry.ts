/**
 * The available Geometry types.
 */
export const GeometryTypes = {
  SPHERE: 'Sphere',
  PLANE: 'Plane',
  CAPSULE: 'Capsule',
  BOX: 'Box',
  CONVEXMESH: 'ConvexMesh',
  TRIANGLEMESH: 'TriangleMesh',
  HEIGHTFIELD: 'Heightfield',
  GEOMETRY_COUNT: 'Geometry_Count', //!< internal use only!
  INVALID: -1, //!< internal use only!
} as const;

export type GeometryTypes = (typeof GeometryTypes)[keyof typeof GeometryTypes];

/**
 * Base class for Geomtry
 */
export abstract class Geometry {
  /**
   * The type of this geometry. Must be set to an int > 0 by subclasses.
   */
  geometryType: GeometryTypes;

  constructor(geometryType: GeometryTypes) {
    this.geometryType = geometryType;
  }

  getType(): GeometryTypes {
    return this.geometryType;
  }
}
