// 全局的指针指向正在工作的fiberNode
import { FiberNode, FiberRootNode, createWorkInProgress } from './fiber';
import { beginWork } from './beginWork';
import { completeWork } from './completeWork';
import { HostRoot } from './workTags';

let workInProgress: FiberNode | null = null;
function prepareFreshStack(root: FiberRootNode) {
	// workInProgress = fiber;
	workInProgress = createWorkInProgress(root.current, {});
}

function completeUnitOfWork(fiber: FiberNode) {
	// 此时没有子节点， 遍历兄弟节点, 递归
	let node: FiberNode | null = fiber;
	do {
		completeWork(node);

		const sibling = node.sibling;
		if (sibling !== null) {
			workInProgress = sibling;
			return;
		}
		node = node.return;
		workInProgress = node;
	} while (node !== null);
}

function performUnitOfWork(fiber: FiberNode) {
	const next = beginWork(fiber);
	fiber.memorizedProps = fiber.pendingProps;
	if (next === null) {
		completeUnitOfWork(fiber);
	} else {
		workInProgress = next;
	}
}
function workLoop() {
	while (workInProgress !== null) {
		performUnitOfWork(workInProgress);
	}
}

function renderRoot(root: FiberRootNode) {
	// 初始化
	prepareFreshStack(root);

	do {
		try {
			workLoop();
			break;
		} catch (e) {
			console.warn('workLoop 发生错误', e);
			workInProgress = null;
		}
	} while (true);
}

// 连接renderRoot 和 updateContainer
export function scheduleUpdateOnFiber(fiber: FiberNode) {
	// 调度功能
	// 从当前传进来的fiber找到根节点fiberRootNode
	const root = markUpdateFromFiberToRoot(fiber);
	renderRoot(root);
}

// 查找 fiberRootNode
function markUpdateFromFiberToRoot(fiber: FiberNode) {
	let node = fiber;
	let parent = node.return;
	while (parent !== null) {
		node = parent;
		parent = node.return;
	}
	if (node.tag === HostRoot) {
		return node.stateNode;
	}
	return null;
}
