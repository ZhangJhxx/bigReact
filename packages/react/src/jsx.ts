// createElement
import { REACT_ELEMENT_TYPE } from '../../shared/ReactSymbols';
import { Type, Key, Ref, Props, ReactElement, ElementType } from '../../shared/ReactTypes';

const ReactElement = (type: Type, key: Key, ref: Ref, props: Props): ReactElement => {
  const element: ReactElement = {
    $$typeof: REACT_ELEMENT_TYPE,
    type,
    key,
    ref,
    props,
    __mark: 'x',
  }
  return element;
}

export const jsx = (
  type: ElementType,
  config: any,
  ...maybeChildren: any
) => {
  let key: Key = null;
  const props: Props = {};
  let ref: Ref = null;

  for (const prop in config) {
    const val = config[prop];
    if (prop === 'ref') {
      if (val !== undefined) {
        ref = val;
      }
      continue;
    }
    // TODO: 这段有疑问 key 可能是单独拎出来的
    if (prop === 'ref') {
      if (val !== undefined) {
        ref = val;
      }
      continue;
    }
    if (prop === 'key') {
      if (val !== undefined) {
        key = val;
      }
      continue;
    }
    if ({}.hasOwnProperty.call(config, prop)) {
      props[prop] = val;
    }
  }
  const maybeChildrenLength = maybeChildren.length;
  if (maybeChildrenLength) {
    if (maybeChildrenLength === 1) {
      props.children = maybeChildren[0];
    } else {
      props.children = maybeChildren;
    }
  }
  return ReactElement(type, key, ref, props);
}

const jsxDEV = jsx;