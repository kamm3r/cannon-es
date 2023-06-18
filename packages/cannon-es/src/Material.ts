/**
 * Defines a physics material.
 */
export class Material {
  /**
   * Friction for this material.
   * If non-negative, it will be used instead of the friction given by ContactMaterials. If there's no matching ContactMaterial, the value from `defaultContactMaterial` in the World will be used.
   */
  friction: number;
  /**
   * Restitution for this material.
   * If non-negative, it will be used instead of the restitution given by ContactMaterials. If there's no matching ContactMaterial, the value from `defaultContactMaterial` in the World will be used.
   */
  restitution: number;

  damping: number;

  constructor(friction = 0, restitution = 0) {
    this.friction = friction;
    this.restitution = restitution;
    this.damping = 0;
  }
}
