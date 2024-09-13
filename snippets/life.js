let matrixComponent = createMatrix();

matrixComponent.colors({ 1: "green" }, false);

function initializeMatrix(matrix, probability = 0.3) {
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      matrix[i][j] = Math.random() < probability ? 1 : 0;
    }
  }
}

// Count live neighbors around a specific cell
function countLiveNeighbors(matrix, x, y) {
  const directions = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];

  let liveNeighbors = 0;

  for (let dir of directions) {
    let newX = x + dir[0];
    let newY = y + dir[1];

    // Check bounds and count live cells (1)
    if (newX >= 0 && newX < matrix.length && newY >= 0 && newY < matrix[0].length) {
      liveNeighbors += matrix[newX][newY];
    }
  }

  return liveNeighbors;
}

// Update the matrix based on Game of Life rules
function updateMatrix(matrix) {
  const rows = matrix.length;
  const cols = matrix[0].length;
  let newMatrix = new Array(rows).fill(null).map(() => new Array(cols).fill(0));

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const liveNeighbors = countLiveNeighbors(matrix, i, j);

      if (matrix[i][j] === 1) {
        // Cell is alive
        newMatrix[i][j] = liveNeighbors === 2 || liveNeighbors === 3 ? 1 : 0;
      } else {
        // Cell is dead
        newMatrix[i][j] = liveNeighbors === 3 ? 1 : 0;
      }
    }
  }

  return newMatrix;
}

let matrix = new Array(10).fill(null).map(() => new Array(10).fill(0));
initializeMatrix(matrix);

for (let i = 0; i < 50; i++) {
  matrixComponent.content(matrix);
  matrix = updateMatrix(matrix);

  if (matrix.some(row => row.some(cell => cell != 0)) === false) {
    break;
  }
}

matrixComponent.content(new Array(10).fill(null).map(() => new Array(10).fill(0)));
