export const timeRangesString = (timeRangesArray) => {
  let string = timeRangesArray.reduce((acc, timeRange) => {
    acc += `${timeRange.start.toFixed(2)} => ${timeRange.end.toFixed(2)}, `;
    return acc;
  }, '');

  return string.substring(0, string.length - 2);
};
