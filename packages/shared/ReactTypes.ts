export type Type = any;
export type Key = any;
export type Ref = any;
export type Props = any;
export type ElementType = any;

export interface ReactElement {
  $$typeof: symbol | number;
  type: Type;
  key: Key;
  ref: Ref;
  props: Props;
  // 用于标记区分于原有的react
  __mark: string;
}