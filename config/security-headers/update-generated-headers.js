/**
* @param {{ key: string, value: string }[]} headers
* @returns {{ key: string, value: string }[]}
*/
export const updateGeneratedHeaders = (headers) => {
  const index = headers.findLastIndex((header) => header.key === 'X-XSS-Protection');
  let updatedHeaders = headers;

  if (index > -1) {
    updatedHeaders = headers.toSpliced(index, 1);
  }

  return updatedHeaders;
}
