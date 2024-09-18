// Create a new matrix component to represent the game board
let matrixComponent = createMatrix();

// Matrix dimensions
const width = 10;
const height = 10;

// Define colors
const EMPTY_COLOR = "#FFFFFF"; // White for empty cells
const SNAKE_COLOR = "#00FF00"; // Green for the snake
const FOOD_COLOR = "#FF0000"; // Red for the food

// Initialize the matrix with empty cells
function initializeMatrix() {
  const matrix = Array.from({ length: height }, () => Array(width).fill(EMPTY_COLOR));
  matrixComponent.content(matrix);
}

// Get a random position for the food
function getRandomPosition() {
  return [Math.floor(Math.random() * width), Math.floor(Math.random() * height)];
}

// Update the matrix to show the snake and the food using colors
function updateMatrix(snake, food) {
  const matrix = Array.from({ length: height }, () => Array(width).fill(EMPTY_COLOR));

  // Place the snake in the matrix
  for (const [x, y] of snake) {
    matrix[y][x] = SNAKE_COLOR;
  }

  // Place the food in the matrix
  const [foodX, foodY] = food;
  matrix[foodY][foodX] = FOOD_COLOR;

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
  if (foodX > headX) return [1, 0]; // RIGHT
  if (foodX < headX) return [-1, 0]; // LEFT
  if (foodY > headY) return [0, 1]; // DOWN
  if (foodY < headY) return [0, -1]; // UP

  return [1, 0]; // Default direction (RIGHT)
}

// Initialize the game
function initializeGame() {
  initializeMatrix();
  let snake = [[Math.floor(width / 2), Math.floor(height / 2)]]; // Initial snake position
  let food = getRandomPosition(); // Random food position

  // Simulate the game for 100 frames
  for (let frame = 0; frame < 100; frame++) {
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
