import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { ToggleContainer, ToggleOption } from './styles';

export interface ToggleSwitchProps<T = string> {
  options: { value: T; label: string }[];
  defaultValue: T;
  value?: T;
  onToggle?: (payload: ToggleCbPayload<T>) => void;
  onChange?: (value: T) => void;
  name?: string;
}

export type ToggleCbPayload<T> = {
  value: T;
  currentIndex: number;
  prevIndex: number;
};

export const ToggleSwitch = forwardRef(function ToggleSwitch<T extends string>(
  {
    options,
    defaultValue,
    value: controlledValue,
    onToggle,
    onChange,
    name,
  }: ToggleSwitchProps<T>,
  ref: React.Ref<HTMLUListElement>,
) {
  const containerRef = useRef<HTMLUListElement>(null);
  const isControlled = controlledValue !== undefined;
  const [activeOption, setActive] = useState<T>(defaultValue);
  const prevActiveRef = useRef<T>(defaultValue);

  const activeValue = isControlled ? controlledValue : activeOption;

  const updateDimensions = useCallback(() => {
    if (!containerRef.current) return;

    const activeIndex = options.findIndex(
      (option) => option.value === activeValue,
    );
    const prevActiveIndex = options.findIndex(
      (option) => option.value === prevActiveRef.current,
    );

    const prevElement = containerRef.current.children[prevActiveIndex];
    const activeElement = containerRef.current.children[activeIndex];

    if (!prevElement || !activeElement) return;

    const { width: prevWidth, x: prevX } = prevElement.getBoundingClientRect();
    const { width: activeWidth, x: activeX } =
      activeElement.getBoundingClientRect();
    const { x: parentX } = containerRef.current.getBoundingClientRect();

    return {
      prevElementWidth: prevWidth,
      activeIndexWidth: activeWidth,
      positionDiff: activeX - parentX,
      prevPositionX: prevX - parentX,
    };
  }, [activeValue, options]);

  const [dimensions, setDimensions] = useState({
    prevElementWidth: 0,
    activeIndexWidth: 0,
    positionDiff: 0,
    prevPositionX: 0,
  });

  useEffect(() => {
    if (isControlled) {
      setActive(controlledValue);
    }
  }, [isControlled, controlledValue]);

  useEffect(() => {
    const newDimensions = updateDimensions();
    if (newDimensions) setDimensions(newDimensions);
    prevActiveRef.current = activeValue;
  }, [activeValue, updateDimensions]);

  const handleClick = useCallback(
    (value: T) => {
      if (isControlled && !onChange) return;

      const prevIndex = options.findIndex(
        (option) => option.value === prevActiveRef.current,
      );
      const currentIndex = options.findIndex(
        (option) => option.value === value,
      );

      if (!isControlled) {
        setActive(value);
      }
      onChange?.(value);
      onToggle?.({
        value,
        currentIndex,
        prevIndex,
      });
    },
    [isControlled, onChange, onToggle, options],
  );

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  useImperativeHandle(ref, () => containerRef.current!);

  return (
    <ToggleContainer
      ref={containerRef}
      role="radiogroup"
      aria-labelledby="Toggle Switch"
      prevElementWidth={dimensions.prevElementWidth}
      activeIndexWidth={dimensions.activeIndexWidth}
      positionDiff={dimensions.positionDiff}
      prevPositionX={dimensions.prevPositionX}
      data-name={name}
    >
      {options.map((option) => {
        const isActive = activeValue === option.value;
        return (
          <ToggleOption
            key={option.value}
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
});
