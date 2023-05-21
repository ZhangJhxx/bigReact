// 全局的指针指向正在工作的fiberNode
import { FiberNode } from "./fiber";
import { beginWork } from "./beginWork";
import { completeWork } from "./completeWork";

let workInProgress: FiberNode | null = null;
function prepareFreshStack(fiber: FiberNode) {
  workInProgress = fiber;
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

function renderRoot(root: FiberNode) {
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