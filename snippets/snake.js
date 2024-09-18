// Create a new matrix component to represent the game board
let matrixComponent = createMatrix();

// Matrix dimensions
const width = 10;
const height = 10;

// Directions
const directions = {
  UP: [0, -1],
  DOWN: [0, 1],
  LEFT: [-1, 0],
  RIGHT: [1, 0],
};

// Initialize the matrix with empty cells
function initializeMatrix() {
  const matrix = Array.from({ length: height }, () => Array(width).fill(" "));
  matrixComponent.content(matrix);
  matrixComponent.colors({ S: "bg-green-600", F: "bg-red-600", H: "bg-green-950" }); // Colors for snake body, food, and head
}

// Get a random position for the food
function getRandomPosition() {
  return [Math.floor(Math.random() * width), Math.floor(Math.random() * height)];
}

// Update the matrix to show the snake and the food
function updateMatrix(snake, food) {
  const matrix = Array.from({ length: height }, () => Array(width).fill(" "));

  // Place the snake in the matrix
  for (let i = 0; i < snake.length; i++) {
    const [x, y] = snake[i];
    matrix[y][x] = i === 0 ? "H" : "S"; // Mark head with "H", body with "S"
  }

  // Place the food in the matrix
  const [foodX, foodY] = food;
  matrix[foodY][foodX] = "F";

  matrixComponent.content(matrix);
}

// Move the snake in the direction of the food
function moveSnake(snake, direction) {
  const [dx, dy] = direction;
  const [headX, headY] = snake[0];
  const newHead = [headX + dx, headY + dy];

  // Move the snake: Add new head and remove tail
  snake.unshift(newHead);
  snake.pop();
}

// Simple AI to decide the next move
function getNextDirection(snake, food) {
  const [headX, headY] = snake[0];
  const [foodX, foodY] = food;

  // Move towards the food
  if (foodX > headX) return directions.RIGHT;
  if (foodX < headX) return directions.LEFT;
  if (foodY > headY) return directions.DOWN;
  if (foodY < headY) return directions.UP;

  return directions.RIGHT; // Default direction
}

// Initialize the game
function initializeGame() {
  initializeMatrix();
  let snake = [[Math.floor(width / 2), Math.floor(height / 2)]]; // Initial snake position
  let food = getRandomPosition(); // Random food position

  // Simulate the game for 100 frames
  for (let frame = 0; frame < 50; frame++) {
    updateMatrix(snake, food);

    // Get the next direction for the snake
    const direction = getNextDirection(snake, food);

    // Move the snake
    moveSnake(snake, direction);

    // Check if the snake has eaten the food
    if (snake[0][0] === food[0] && snake[0][1] === food[1]) {
      snake.push(snake[snake.length - 1]); // Grow the snake
      food = getRandomPosition(); // New food position
    }
  }
}

// Run the game simulation
initializeGame();
