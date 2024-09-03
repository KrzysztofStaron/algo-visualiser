
const arr = createArray();

arr.frame({
  index: 4,
  content: [1, 2, 3, 4, 5],
});

arr.group([4]);

arr.frame({
  index: 3,
  content: [1, 2, 3, 4],
});

arr.group([3]);

arr.frame({
  index: 2,
  content: [1, 2, 3],
});

arr.group([2]);

  arr.frame({
  index: 1,
  content: [1, 2],
});

arr.group([1]);

arr.frame({
  index: 0,
  content: [1],
});

arr.group([0]);
arr.setArr([])