let ar = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

const r = () => {
  group([]);
  setIndex(-1);
  setArray(ar);
};

r();

for (let i = 0; i < ar.length; i++) {
  if (i == 0) {
    ar[0] = 1;
  } else if (i == 1) {
    ar[1] = 2;
  } else {
    ar[i] = ar[i - 1] + ar[i - 2];
  }

  setArray(ar);
  group([i - 1, i - 2]);
  setIndex(i);
}

r();
