import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';

import { ToggleContainer, ToggleOption } from './styles';

export interface ToggleSwitchProps<T = string> {
  options: { value: T; label: string }[];
  defaultActive: T;
  onToggleCb: (payload: ToggleCbPayload<T>) => void;
}

export type ToggleCbPayload<T> = {
  value: T;
  currentIndex: number;
  prevIndex: number;
};

// TODO: refactor and make ToggleSwitch more flexible and ready for using in forms
export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  options,
  defaultActive,
  onToggleCb,
}) => {
  const containerRef = useRef<HTMLUListElement>(null);
  const [activeOption, setActive] = useState<string>(() => defaultActive);
  const [[prevElementWidth, activeIndexWidth], setWidth] = useState<
    [number, number]
  >([0, 0]);
  const [[positionDiff, prevPositionX], setPosition] = useState<
    [number, number]
  >([0, 0]);
  const [prevActiveIndex, setPrevActiveIndex] = useState<number>(() =>
    options.findIndex((option) => option.value === defaultActive),
  );

  useEffect(() => {
    if (!activeOption && activeOption !== defaultActive) {
      setActive(defaultActive);
    }
  }, [activeOption, defaultActive]);

  const handleClick = (value: string) => {
    setPrevActiveIndex(activeIndex);
    setActive(value);
    const currentIndex = options.findIndex((option) => option.value === value);
    onToggleCb({ value, currentIndex, prevIndex: activeIndex });
  };

  const activeIndex = options.findIndex(
    (option) => option.value === activeOption,
  );

  useLayoutEffect(() => {
    const element = document.getElementById(`to_${activeOption}`);
    const list = containerRef.current?.children;
    let prevElement;
    let activeElement;

    if (element) {
      prevElement = element.parentElement?.children[prevActiveIndex];
      activeElement = element;
    } else if (list) {
      prevElement = list[prevActiveIndex];
      activeElement = list[activeIndex];
    }

    if (prevElement && activeElement && containerRef.current) {
      const { width: prevWidth, x: prevX } =
        prevElement.getBoundingClientRect();
      const { width: activeWidth, x: activeX } =
        activeElement.getBoundingClientRect();
      const { x: parentX } = containerRef.current.getBoundingClientRect();

      setWidth([prevWidth, activeWidth]);
      setPosition([activeX - parentX, prevX - parentX]);
    }
  }, [activeOption, activeIndex, prevActiveIndex]);

  return (
    <ToggleContainer
      ref={containerRef}
      role="group"
      aria-labelledby="Toggle Switch"
      prevElementWidth={prevElementWidth}
      activeIndexWidth={activeIndexWidth}
      positionDiff={positionDiff}
      prevPositionX={prevPositionX}
    >
      {options.map((option) => {
        const isActive = activeOption === option.value;

        return (
          <ToggleOption
            key={option.value}
            id={`to_${option.value}`}
            role="radio"
            aria-checked={isActive}
            aria-label={option.label}
            isActive={isActive}
            onClick={() => handleClick(option.value)}
          >
            {option.label}
          </ToggleOption>
        );
      })}
    </ToggleContainer>
  );
};
