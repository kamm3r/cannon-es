import { BroadPhase } from './BroadPhase';

/**
 * Automatic box pruning
 */
export class BroadPhaseABP extends BroadPhase {
  constructor() {
    super('ABP');
  }
}
