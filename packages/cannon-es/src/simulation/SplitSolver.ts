import { Solver } from './Solver';
import { Rigidbody } from '../dynamics/Rigidbody';
import type { World } from './World';
import { GSSolver } from './GSSolver';

type SplitSolverNode = {
  body: Rigidbody | null;
  children: SplitSolverNode[];
  visited: boolean;
};

/**
 * Splits the equations into islands and solves them independently. Can improve performance.
 */
export class SplitSolver extends Solver {
  /**
   * The number of solver iterations determines quality of the constraints in the world. The more iterations, the more correct simulation. More iterations need more computations though. If you have a large gravity force in your world, you will need more iterations.
   */
  iterations: number;

  /**
   * When tolerance is reached, the system is assumed to be converged.
   */
  tolerance: number;
  /** subsolver */
  subsolver: GSSolver;
  nodes: SplitSolverNode[];
  nodePool: SplitSolverNode[];

  constructor(subsolver: GSSolver) {
	super();

	this.iterations = 10;
	this.tolerance = 1e-7;
	this.subsolver = subsolver;
	this.nodes = [];
	this.nodePool = [];

	// Create needed nodes, reuse if possible
	while (this.nodePool.length < 128) {
	  this.nodePool.push(this.createNode());
	}
  }

  /**
   * createNode
   */
  createNode(): SplitSolverNode {
	return { body: null, children: [], eqs: [], visited: false };
  }

  /**
   * Solve the subsystems
   * @return number of iterations performed
   */
  solve(dt: number, world: World): number {
	const nodes = SplitSolver_solve_nodes;
	const nodePool = this.nodePool;
	const bodies = world.bodies;
	const equations = this.equations;
	const Neq = equations.length;
	const Nbodies = bodies.length;
	const subsolver = this.subsolver;

	// Create needed nodes, reuse if possible
	while (nodePool.length < Nbodies) {
	  nodePool.push(this.createNode());
	}
	nodes.length = Nbodies;
	for (let i = 0; i < Nbodies; ++i) {
	  nodes[i] = nodePool[i];
	}

	// Reset node values
	for (let i = 0; i !== Nbodies; ++i) {
	  const node = nodes[i];
	  node.body = bodies[i];
	  node.children.length = 0;
	  node.eqs.length = 0;
	  node.visited = false;
	}
	for (let k = 0; k !== Neq; ++k) {
	  const eq = equations[k];
	  const i = bodies.indexOf(eq.bi);
	  const j = bodies.indexOf(eq.bj);
	  const ni = nodes[i];
	  const nj = nodes[j];
	  ni.children.push(nj);
	  ni.eqs.push(eq);
	  nj.children.push(ni);
	  nj.eqs.push(eq);
	}

	let child: SplitSolverNode | false;
	let n = 0;
	let eqs = SplitSolver_solve_eqs;

	subsolver.tolerance = this.tolerance;
	subsolver.iterations = this.iterations;

	const dummyWorld = SplitSolver_solve_dummyWorld;
	while ((child = getUnvisitedNode(nodes))) {
	  eqs.length = 0;
	  dummyWorld.bodies.length = 0;
	  bfs(child, visitFunc, dummyWorld.bodies, eqs);

	  const Neqs = eqs.length;

	  eqs = eqs.sort(sortById);

	  for (let i = 0; i !== Neqs; ++i) {
		subsolver.addEquation(eqs[i]);
	  }

	  const iter = subsolver.solve(dt, dummyWorld as World);
	  subsolver.removeAllEquations();
	  n++;
	}

	return n;
  }
}
