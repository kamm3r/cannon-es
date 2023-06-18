import { Material } from '../../Material';
import { Transform } from '../../math/Transform';
import { Geometry, Rigidbody } from '../../cannon-es';

export type FilterData = {
  w0: number;
  w1: number;
  w2: number;
  w3: number;
};
/**
 * Base class for shapes
 */
export abstract class Shape {
  abstract setLocalPose(pose: Transform): void;
  abstract getLocalPose(): Transform;
  abstract setSimulationFilterData(data: FilterData): void;
  abstract getSimulationFilterData(): FilterData;
  abstract setQueryFilterData(data: FilterData): void;
  abstract getQueryFilterData(): FilterData;
  abstract setMaterials(materials: Material, materialCount: number): void;
  abstract setSoftBodyMaterials(
    materials: Material,
    materialCount: number
  ): void;
  abstract setClothMaterials(materials: Material, materialCount: number): void;
  abstract getNbMaterials(): number;
  abstract getMaterials(
    userBuffer: Material,
    bufferSize: number,
    startIndex: number
  ): number;
  abstract getSoftBodyMaterials(
    userBuffer: Material,
    bufferSize: number,
    startIndex: number
  ): number;
  abstract getClothMaterials(
    userBuffer: Material,
    bufferSize: number,
    startIndex: number
  ): number;
  abstract setContactOffset(contactOffset: number): void;
  abstract getContactOffset(): number;
  abstract setRestOffset(restOffset: number): void;
  abstract getRestOffset(): number;
  abstract setDensityForFluid(densityForFluid: number): void;
  abstract getDensityForFluid(): number;
  abstract setTorsionalPathRadius(radius: number): void;
  abstract getTorsionalPathRadius(): number;
  abstract setMinTorsionalPathRadius(radius: number): void;
  abstract getMinTorsionalPathRadius(): number;
  abstract setGeometry(geometry: Geometry): void;
  abstract getGeometry(): Geometry;
  abstract setName(name: string): void;
  abstract getName(): string;
  abstract getActor(): Rigidbody;
}
