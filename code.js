const left = createArray({orientation: "v", anim: false});
const top = createArray();
const text = createLabel();

let arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
text.set(arr.length-1, false)

left.frame({
  content: arr, 
  index: 10,
}, false);

top.frame({
  content: arr,
  group: arr
});

while (arr.length != 1) {
  let r = arr.pop();
  top.group(arr, false);
  text.set(r, false)
  left.frame({
    content: arr,
    index: arr.length-1,
  });
}

while (arr.length != 11) {
  text.set(arr.length, false)
  arr.push(arr.length);
  top.group(arr, false);
  left.frame({
    content: arr,
    index: arr.length-1,
  });
}

top.group(arr);
