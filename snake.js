// Initialise canvas
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var width = window.innerWidth;
var height = window.innerHeight;

canvas.height = height;
canvas.width = width;

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
var food = {x: null, y: null};
// var lastTime = 0;

var snake = {
  bodyArray: [],
  posX: 5,
  posY: 5,
  direction: 'right'
};

// function initGame () {
//   // gameLoop = setInterval(paintSnake, 40);
// }
// initGame();

// Initialise Snake
// For loop counting down so first object will be the head of snake
initSnake();
function initSnake () {
  var startLength = 5;
  for (var i = snake.posX + (startLength - 1); i >= snake.posX; i--) {
    snake.bodyArray.push({x: i, y: snake.posY});
  }
}

// Function paint snake
// function paintSnake () {
//   // var now = new Date().getTime();
//   // console.log(now - lastTime);
//   // lastTime = now;
//   paintCanvas();
//   createFood();
//   paintObstacle();
//   updateSnake();
//   for (var i = 0; i < snake.bodyArray.length; i++) {
//     var xyCor = snake.bodyArray[i];
//     paintCell(xyCor.x, xyCor.y, '#F2EBC7', '#343642');
//   }
// }
// Function update snake
// Pop out tail (last array) and put it to the head
function updateSnake () {
  var headX = snake.bodyArray[0].x;
  var headY = snake.bodyArray[0].y;
  if (snake.direction === 'up') headY--;
  if (snake.direction === 'down') headY++;
  if (snake.direction === 'left') headX--;
  if (snake.direction === 'right') headX++;
// Obstacle Collision
  for (var h = 0; h < obstacleSquare.length; h++) {
    for (var g = 0; g < obstacleSquare[h].array.length; g++) {
      var xyObstacle = obstacleSquare[h].array[g];
      if (headX === xyObstacle.x && headY === xyObstacle.y) {
        clearInterval(gameLoop);
        return;
      }
    }
  }

  snake.bodyArray.pop();
  snake.bodyArray.unshift({x: headX, y: headY});
  // console.log('X: ' + headX + '  Y: ' + headY);

  if (headX === food.x && headY === food.y) {
    snake.bodyArray.unshift({x: food.x, y: food.y});
    food.x = Math.round(Math.random() * (width - cellSize) / cellSize);
    food.y = Math.round(Math.random() * (height - cellSize) / cellSize);
    score++;
    createFood();
  }

  for (var j = 2; j < snake.bodyArray.length; j++) {
    if (headX === snake.bodyArray[j].x && headY === snake.bodyArray[j].y) {
      clearInterval(gameLoop);
    }
  }

  for (var i = 0; i < snake.bodyArray.length; i++) {
    if (snake.bodyArray[i].x === Math.round(width / cellSize)) snake.bodyArray[i].x = 0;
    if (snake.bodyArray[i].x === (-1)) snake.bodyArray[i].x = Math.round(width / cellSize) - 1;
    if (snake.bodyArray[i].y === Math.round(height / cellSize) + 1) snake.bodyArray[i].y = 0;
    if (snake.bodyArray[i].y === (-1)) snake.bodyArray[i].y = Math.round(height / cellSize) - 1;
  }
  return snake.bodyArray;
}

// Randomise Food
function randomFood () {
  food.x = Math.round(Math.random() * (width - cellSize) / cellSize);
  food.y = Math.round(Math.random() * (height - cellSize) / cellSize);
  console.log('Food X: ' + food.x);
  console.log('Food Y: ' + food.y);
  for (var k = 0; k < snake.bodyArray.length; k++) {
    if (food.x === snake.bodyArray[k].x && food.y === snake.bodyArray[k].y) return randomFood();
  }
}
randomFood();
function createFood () {
  // console.log(food);
  paintCell(food.x, food.y, '#962D3E', '#962D3E');
}

// Obstacles
function Obstacle (obsLength, posX, posY) {
  this.obsLength = obsLength;
  this.array = [];
  this.posX = posX;
  this.posY = posY;
}

var obstacle0 = new Obstacle(height / cellSize, 20, 10);
var obstacle1 = new Obstacle(height / cellSize, 20, 20);
var obstacle2 = new Obstacle(height / cellSize, 20, 30);

var obstacleSquare = [obstacle0, obstacle1, obstacle2];

for (var h = 0; h < obstacleSquare.length; h++) {
  for (var i = obstacleSquare[h].posX; i < obstacleSquare[h].obsLength + obstacleSquare[h].posX; i++) {
    obstacleSquare[h].array.push({x: i, y: obstacleSquare[h].posY});
  }
}

function paintObstacle () {
  for (var h = 0; h < obstacleSquare.length; h++) {
    for (var g = 0; g < obstacleSquare[h].array.length; g++) {
      var xyObstacle = obstacleSquare[h].array[g];
      paintCell(xyObstacle.x, xyObstacle.y, '#348899', '#348899');
    }
  }
}
paintObstacle();
// gameLoop = setInterval(paintObstacle, 40);

// Function key directions
document.onkeydown = function (event) {
  var key = event.keyCode;
  if (key === 38 && snake.direction !== 'down') snake.direction = 'up';
  if (key === 40 && snake.direction !== 'up') snake.direction = 'down';
  if (key === 37 && snake.direction !== 'right') snake.direction = 'left';
  if (key === 39 && snake.direction !== 'left') snake.direction = 'right';
  if (key === 32) location.reload();
  if (key) event.preventDefault();
  updateSnake();
};

var fps = 30;
function paint () {
  setTimeout(function () {
    requestAnimationFrame(paint);
    // Drawing code goes here
    paintCanvas();
    createFood();
    paintObstacle();
    updateSnake();
    for (var i = 0; i < snake.bodyArray.length; i++) {
      var xyCor = snake.bodyArray[i];
      paintCell(xyCor.x, xyCor.y, '#F2EBC7', '#343642');
    }
  }, 1000 / fps);
}

paint();
