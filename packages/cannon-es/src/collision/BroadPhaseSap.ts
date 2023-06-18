import { BroadPhase } from './BroadPhase';

/**
 * Sweep and prune broadphase along one axis.
 * 3-axes sweep-and-prune
 */
export class BroadPhaseSAP extends BroadPhase {
  constructor() {
    super('SAP');
  }
}
