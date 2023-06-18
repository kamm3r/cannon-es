import { Geometry } from './Geometry';
import { Heightfield } from './HeightField';

/**
 * Heightfield shape class. Height data is given as an array. These data points are spread out evenly with a given distance.
 * @todo Should be possible to use along all axes, not just y
 * @todo should be possible to scale along all axes
 * @todo Refactor elementSize to elementSizeX and elementSizeY
 *
 * @example
 *     // Generate some height data (y-values).
 *     const data = []
 *     for (let i = 0; i < 1000; i++) {
 *         const y = 0.5 * Math.cos(0.2 * i)
 *         data.push(y)
 *     }
 *
 *     // Create the heightfield shape
 *     const heightfieldShape = new CANNON.Heightfield(data, {
 *         elementSize: 1 // Distance between the data points in X and Y directions
 *     })
 *     const heightfieldBody = new CANNON.Body({ shape: heightfieldShape })
 *     world.addBody(heightfieldBody)
 */
export class HeightfieldGeometry extends Geometry {
  /**
   * The height field data TODO:fix
   */
  heightField: Heightfield | null;
  /**
   * The scaling factor for the height field in vertical direction (y direction in local space)
   */
  heightScale: number;
  /**
   * The scaling factor for the height field in the row direction (x direction in local space)
   */
  rowScale: number;
  /**
   * The scaling factor for the height field in the column direction (z direction in local space)
   */
  columnScale: number;
  /**
   * Flags to specify some collision properties for the height field
   */
  heightFieldFlags: any;
  /**
   * padding for mesh flags
   */
  paddingFromFlags: any;
  constructor(
    hf = null,
    flags = 'ds',
    heightScale = 1.0,
    rowScale = 1.0,
    columnScale = 1.0
  ) {
    super('Heightfield');
    this.heightField = hf;
    this.heightFieldFlags = flags;
    this.heightScale = heightScale;
    this.rowScale = rowScale;
    this.columnScale = columnScale;
    this.paddingFromFlags = this.heightFieldFlags;
  }
}
