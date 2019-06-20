export const isNumberLike = value => {
  if (typeof value === 'number' && !isNaN(value)) return true;
  else if (typeof value === 'string') {
    return /^[+-]?(\d+)(\.\d+)?$/.test(value);
  }
  return false;
};
