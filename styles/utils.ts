export const getColorTransparency = (color: string, value: string) => {
  return `color-mix(in display-p3, ${color} ${value}, transparent)`;
};
