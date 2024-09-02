
const [group, setIndex, setArray] = useArray();

let arr = [0, 0, 0, 0, 1]


for (let j=0; j < 4; j ++) {
  for (let i=arr.length-1; i >= 0; i--) {
    arr[0] = 0;
    arr[i] = 1;
    if (i+1 != arr.length) {
      arr[i+1] = 0;
    }

    setIndex(i)
    setArray(arr, true);
  
  }
  arr.pop()
}
