// fibernode 数据结构
import { Key, Props, Ref } from 'shared/ReactTypes';
import { WorkTag } from './workTags';
import { Container } from 'hostConfig';
import { Flags, NoFlags } from './fiberFlags';

export class FiberNode {
	type: any;
	tag: WorkTag;

	key: Key;
	ref: Ref;
	stateNode: any;
	return: FiberNode | null;
	sibling: FiberNode | null;
	child: FiberNode | null;
	index: number;

	flags: Flags;

	pendingProps: Props;
	memorizedProps: Props | null;
	memorizedState: any;
	updateQueue: unknown;

	alternate: FiberNode | null;

	constructor(tag: WorkTag, pendingProps: Props, key: Key) {
		this.tag = tag;
		this.key = key;
		this.ref = null;
		// eg HostComponent <div> div DOM
		this.stateNode = null;
		// 两棵树互相转换的节点
		this.alternate = null;
		// eg Function ()=>{}
		this.type = null;

		// 树状结构
		this.return = null;
		this.sibling = null;
		this.child = null;
		this.index = 0;

		// 作为工作单元
		this.memorizedProps = null;
		this.pendingProps = pendingProps;
		this.memorizedState = null;
		this.updateQueue = null;

		// 副作用
		this.flags = NoFlags;
	}
}
/**
 *     fiberRootNode
 *  current ↓↑ stateNode
 *     hostRootFiber
 *    child ↓↑ return
 *          APP
 */
export class FiberRootNode {
	// 宿主环境
	container: Container;
	current: FiberNode;
	finishedWork: FiberNode | null;

	constructor(container: Container, hostRootFiber: FiberNode) {
		this.container = container;
		this.current = hostRootFiber;
		hostRootFiber.stateNode = this.current;
		this.finishedWork = null;
	}
}

export const createWorkInProgress = (
	current: FiberNode,
	pendingProps: Props
): FiberNode => {
	let wip = current.alternate;

	if (wip === null) {
		// mount
		wip = new FiberNode(current.tag, pendingProps, current.key);

		wip.stateNode = current.stateNode;
		wip.alternate = current;
	} else {
		//update
		wip.pendingProps = pendingProps;
		wip.flags = NoFlags;
	}
	wip.type = current.type;
	wip.updateQueue = current.updateQueue;
	wip.child = current.child;
	wip.memorizedProps = current.memorizedProps;
	wip.memorizedState = current.memorizedState;
	return wip;
};
