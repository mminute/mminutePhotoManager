import { ReactNode } from 'react';
import useElementUIStateController from './utils/useElementUIStateController';

interface Props {
  children: ({
    active,
    focused,
    hovered,
  }: {
    active: boolean;
    focused: boolean;
    hovered: boolean;
  }) => ReactNode;
}

export default function ElementUIStateController({ children }: Props) {
  const {
    active,
    focused,
    hovered,
    onBlur,
    onFocus,
    onMouseDown,
    onMouseEnter,
    onMouseLeave,
    onMouseUp,
  } = useElementUIStateController();

  return (
    <div
      onBlur={onBlur}
      onFocus={onFocus}
      onMouseDown={onMouseDown}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onMouseUp={onMouseUp}
      role="button"
      tabIndex={0}
    >
      {children({ active, focused, hovered })}
    </div>
  );
}
