// this.setState({xx: 1})
// this.setState(({xx: 1}) => {xx:2})
import { Action } from 'shared/ReactTypes';
export interface Update<State> {
	action: Action<State>;
}

export interface UpdateQueue<Action> {
	shared: {
		pending: Update<Action> | null;
	};
}

export const createUpdate = <State>(action: Action<State>): Update<State> => {
	return {
		action
	};
};
export const createUpdateQueue = <Action>() => {
	return {
		shared: {
			pending: null
		}
	} as UpdateQueue<Action>;
};

export const enqueueUpdate = <Action>(
	updateQueue: UpdateQueue<Action>,
	update: Update<Action>
) => {
	updateQueue.shared.pending = update;
};

export const processUpdateQueue = <State>(
	baseState: State,
	pendingUpdate: Update<State> | null
): { memorizedState: State } => {
	const result: ReturnType<typeof processUpdateQueue<State>> = {
		memorizedState: baseState
	};
	if (pendingUpdate !== null) {
		const action = pendingUpdate.action;
		if (action instanceof Function) {
			// baseState 1 update (x) => 4x -> memorizedState 4
			result.memorizedState = action(baseState);
		} else {
			// baseState 1 update 2-> memorizedState 2
			result.memorizedState = action;
		}
	}
	return result;
};
