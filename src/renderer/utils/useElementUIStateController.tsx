import { useState } from 'react';

export default function useElementUIStateController() {
  const [active, setActive] = useState(false);
  const [focused, setFocused] = useState(false);
  const [hovered, setHovered] = useState(false);

  return {
    active,
    focused,
    hovered,
    onBlur: () => {
      setFocused(false);
      setActive(false);
    },
    onFocus: () => setFocused(true),
    onMouseDown: () => setActive(true),
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => {
      setHovered(false);
      setActive(false);
      setFocused(false);
    },
    onMouseUp: () => setActive(false),
  };
}
