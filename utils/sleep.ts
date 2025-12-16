export const sleep = <T = undefined>(ms: number, result?: T) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(result), ms);
  });
};
