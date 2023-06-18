export const BroadPhaseType = {
  SAP: 'SAP', // 3-axes sweep-and-prune
  MBP: 'MBP', // Multi box pruning
  ABP: 'ABP', // Automatic box pruning
  GPU: 'GPU',
  LAST: 'LAST',
} as const;

export type BroadPhaseType =
  (typeof BroadPhaseType)[keyof typeof BroadPhaseType];

/**
 * Base class for BroadPhase implementations
 * @author schteppe
 */
export abstract class BroadPhase {
  type: BroadPhaseType;
  regions: number;
  broadPhaseOverlaps: number;
  shapes: number;
  contextID: number;
  constructor(type: BroadPhaseType) {
    this.type = type;
    this.regions = 1;
    this.broadPhaseOverlaps = 1;
    this.shapes = 1;
    this.contextID = 1;
  }

  release(): void {}
  getType(): BroadPhaseType {
    return this.type;
  }
  getContextID(): number {
    return this.contextID;
  }
  update(): void {}
}
