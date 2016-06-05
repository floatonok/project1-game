// Initialise canvas
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var width = window.innerWidth;
var height = window.innerHeight;

canvas.height = height;
canvas.width = width;

// Initialise Game

// Paint canvas
function paintCanvas () {
  ctx.fillStyle = '#343642';
  ctx.fillRect(0, 0, width, height);
}

// Generic function to paint cell for snake/food/wall/items
function paintCell (xCor, yCor, colorFill, colorStroke) {
  ctx.fillStyle = colorFill;
  ctx.fillRect(xCor * cellSize, yCor * cellSize, cellSize, cellSize);
  ctx.strokeStyle = colorStroke;
  ctx.lineWidth = 2;
  ctx.strokeRect(xCor * cellSize, yCor * cellSize, cellSize, cellSize);
}

var cellSize = 15;
var score = 0;
var gameLoop;
// Snake as an object
var snake = {
  bodyArray: [],
  posX: 5,
  posY: 5,
  direction: 'right' // default direction
};

function initGame () {
}
// initGame();

// Initialise Snake
// For loop counting down so first object will be the head of snake
initSnake();
function initSnake () {
  var startLength = 10;
  for (var i = snake.posX + (startLength - 1); i >= snake.posX; i--) {
    snake.bodyArray.push({x: i, y: snake.posY});
  }
}

// Function paint snake
function paintSnake () {
  paintCanvas();
  updateSnake();
  for (var i = 0; i < snake.bodyArray.length; i++) {
    var xyCor = snake.bodyArray[i];
    console.log(xyCor);
    paintCell(xyCor.x, xyCor.y, '#F2EBC7', '#343642');
  }

  // Function update snake
  // Pop out tail (last array) and put it to the head
  function updateSnake () {
    var headX = snake.bodyArray[0].x;
    var headY = snake.bodyArray[0].y;
    if (snake.direction === 'up') headY--;
    if (snake.direction === 'down') headY++;
    if (snake.direction === 'left') headX--;
    if (snake.direction === 'right') headX++;

    snake.bodyArray.pop();
    snake.bodyArray.unshift({x: headX, y: headY});
  }
}

// Function key directions
document.onkeydown = function (event) {
  var key = event.keyCode;
  if (key === 38 && snake.direction !== 'down') snake.direction = 'up';
  if (key === 40 && snake.direction !== 'up') snake.direction = 'down';
  if (key === 37 && snake.direction !== 'right') snake.direction = 'left';
  if (key === 39 && snake.direction !== 'left') snake.direction = 'right';
  if (key) event.preventDefault();
  console.log(snake.direction);
  updateSnake();
};

gameLoop = setInterval(paintSnake, 60);

// Randomise Food
function randomFood () {

}
// Food as object constructor
// Create new food everytime snake collides into food or game over

// Function wall collision

// Function Food collision

// Function self collision

// Reset Function
