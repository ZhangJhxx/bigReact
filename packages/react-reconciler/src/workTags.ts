export type WorkTag =
	| typeof FunctionComponent
	| typeof HostRoot
	| typeof HostComponent
	| typeof HostText;

export const FunctionComponent = 0;
// ReactDOM.render() 挂载的根节点
export const HostRoot = 3;
// 根节点的wrapper元素
export const HostComponent = 5;

export const HostText = 6;
