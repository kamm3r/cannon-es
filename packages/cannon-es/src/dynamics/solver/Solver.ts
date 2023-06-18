import type { World } from './World';

/**
 * Constraint equation solver base class.
 */
export abstract class Solver {
	/**
	 * All equations to be solved
	 */
	equations: Equation[] = [];

	/**
	 * Should be implemented in subclasses!
	 * @return number of iterations performed
	 */
	abstract solve(dt: number, world: World): number;

	/**
	 * Add an equation
	 */
	addEquation(eq: Equation): void {
		if (eq.enabled && !eq.bi.isTrigger && !eq.bj.isTrigger) {
			this.equations.push(eq);
		}
	}

	/**
	 * Remove an equation
	 */
	removeEquation(eq: Equation): void {
		const eqs = this.equations;
		const i = eqs.indexOf(eq);
		if (i !== -1) {
			eqs.splice(i, 1);
		}
	}

	/**
	 * Add all equations
	 */
	removeAllEquations(): void {
		this.equations.length = 0;
	}
}
