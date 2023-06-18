import { Vec3 } from '../cannon-es';
type TriangleType = {
  a: Vec3;
  b: Vec3;
  c: Vec3;
};
export class Triangle {
  verts: TriangleType = { a: Vec3.zero, b: Vec3.zero, c: Vec3.zero };

  constructor(p0 = Vec3.zero, p1 = Vec3.zero, p2 = Vec3.zero) {
    this.verts.a = p0;
    this.verts.b = p1;
    this.verts.c = p2;
  }
}
