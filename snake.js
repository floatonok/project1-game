// Initialise canvas
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var width = window.innerWidth;
var height = window.innerHeight;

canvas.height = height;
canvas.width = width;

var bgMusic = new Audio('./aWalk.mp3');
var obstacleMusic = new Audio('./obstacle.mp3');
var eatMusic = new Audio('./gotItem.mp3');
var youDie = new Audio('./gameOver.wav');
var loopOne = new Audio('./loopOne.mp3');
var loopTwo = new Audio('./loopTwo.mp3');
var loopThree = new Audio('./loopThree.mp3');
loopOne.loop = true;
loopTwo.loop = true;
loopThree.loop = true;
bgMusic.volume = 0.2;
obstacleMusic.volume = 0.5;
// bgMusic.play();

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
var food = {x: null, y: null};
var running = true;
var obstacleFood = [];
var hitObstacle = true;
// var lastTime = 0;

var snake = {
  bodyArray: [],
  posX: 5,
  posY: 5,
  direction: 'right'
};

// For loop counting down so first object will be the head of snake
initSnake();
function initSnake () {
  var startLength = 5;
  for (var i = snake.posX + (startLength - 1); i >= snake.posX; i--) {
    snake.bodyArray.push({x: i, y: snake.posY});
  }
}

function updateSnake () {
  var headX = snake.bodyArray[0].x;
  var headY = snake.bodyArray[0].y;
  if (snake.direction === 'up') headY--;
  if (snake.direction === 'down') headY++;
  if (snake.direction === 'left') headX--;
  if (snake.direction === 'right') headX++;
  // Obstacle Collision
  if (hitObstacle) {
    for (var h = 0; h < totalObstacles.length; h++) {
      for (var g = 0; g < totalObstacles[h].array.length; g++) {
        var xyObstacle = totalObstacles[h].array[g];
        if (xyObstacle.x === food.x && xyObstacle.y === food.y) {
          randomFood();
          createFood();
        }
        if (headX === xyObstacle.x && headY === xyObstacle.y) {
          youDie.play();
          running = false;
          return;
        }
        // Self Collision
        for (var j = 0; j < snake.bodyArray.length; j++) {
          if (snake.bodyArray[j].x === xyObstacle.x && snake.bodyArray[j].y === xyObstacle.y) {
            youDie.play();
            running = false;
            return;
          }
        }
      }
    }
  }
  for (var t = 2; t < snake.bodyArray.length; t++) {
    if (headX === snake.bodyArray[t].x && headY === snake.bodyArray[t].y) {
      youDie.play();
      running = false;
      return;
    }
  }

  snake.bodyArray.pop();
  snake.bodyArray.unshift({x: headX, y: headY});
  // Eating Food
  if (headX === food.x && headY === food.y) {
    eatMusic.currentTime = 0;
    eatMusic.play();
    snake.bodyArray.unshift({x: food.x, y: food.y});
    food.x = Math.round(Math.random() * (width - cellSize) / cellSize);
    food.y = Math.round(Math.random() * (height - cellSize) / cellSize);
    if (initObsSquare && initObsScatter && initObsVertical) {
      score += 10;
      return;
    }
    if (initObsSquare && initObsScatter && !initObsVertical || initObsSquare && initObsVertical && !initObsScatter || initObsVertical && initObsScatter && !initObsSquare ) {
      score += 5;
      return;
    }
    if (initObsSquare || initObsScatter || initObsVertical) {
      score += 2;
      return;
    }
    if (!initObsSquare && !initObsScatter && !initObsVertical) {
      score++;
      return;
    }
    createFood();
  }

  if (!initObsSquare && headX === obstacleFood[0].x && headY === obstacleFood[0].y) {
    loopOne.play();
    initObstacleSquare();
    hitObstacle = false;
    setTimeout(function () {
      hitObstacle = true;
    }, 5000);
  }

  if (!initObsScatter && headX === obstacleFood[1].x && headY === obstacleFood[1].y) {
    loopTwo.play();
    initObstacleScatter();
    hitObstacle = false;
    setTimeout(function () {
      hitObstacle = true;
    }, 5000);
  }

  if (!initObsVertical && headX === obstacleFood[2].x && headY === obstacleFood[2].y) {
    loopThree.play();
    initObstacleVertical();
    hitObstacle = false;
    setTimeout(function () {
      hitObstacle = true;
    }, 5000);
  }

  // Prevents the snake from escaping the canvas
  for (var i = 0; i < snake.bodyArray.length; i++) {
    if (snake.bodyArray[i].x === Math.round(width / cellSize)) snake.bodyArray[i].x = 0;
    if (snake.bodyArray[i].x === (-1)) snake.bodyArray[i].x = Math.round(width / cellSize) - 1;
    if (snake.bodyArray[i].y === Math.round(height / cellSize) + 1) snake.bodyArray[i].y = 0;
    if (snake.bodyArray[i].y === (-1)) snake.bodyArray[i].y = Math.round(height / cellSize) - 1;
  }
  return snake.bodyArray;
}
var gameLoop = setInterval(updateSnake, 60);

// Randomise Food
function randomFood () {
  food.x = Math.round(Math.random() * (width - cellSize) / cellSize);
  food.y = Math.round(Math.random() * (height - cellSize) / cellSize);
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
var totalObstacles = [];

var obstacle0 = new Obstacle(width / cellSize / 1.2, 0, 10);
var obstacle1 = new Obstacle(width / cellSize / 1.2, 40, 25);
var obstacle2 = new Obstacle(width / cellSize / 1.2, 10, 40);

var obstacle4 = new Obstacle(10, 10, 0);
var obstacle5 = new Obstacle(10, 10, 20);
var obstacle6 = new Obstacle(10, 10, 40);
var obstacle7 = new Obstacle(10, 45, 0);
var obstacle8 = new Obstacle(10, 45, 20);
var obstacle9 = new Obstacle(10, 45, 40);
var obstacle10 = new Obstacle(10, 80, 0);
var obstacle11 = new Obstacle(10, 80, 20);
var obstacle12 = new Obstacle(10, 80, 40);

var obstacleVertical = [obstacle4, obstacle5, obstacle6, obstacle7, obstacle8, obstacle9, obstacle10, obstacle11, obstacle12];

var initObsVertical = false;
function initObstacleVertical () {
  for (var h = 0; h < obstacleVertical.length; h++) {
    for (var i = obstacleVertical[h].posY; i < obstacleVertical[h].obsLength + obstacleVertical[h].posY; i++) {
      obstacleVertical[h].array.push({x: obstacleVertical[h].posX, y: i});
    }
  }
  initObsVertical = true;
  totalObstacles = obstacleSquare.concat(obstacleScatter, obstacleVertical);
}

function paintObstacleVertical () {
  for (var h = 0; h < obstacleVertical.length; h++) {
    for (var g = 0; g < obstacleVertical[h].array.length; g++) {
      var xyObstacle = obstacleVertical[h].array[g];
      paintCell(xyObstacle.x, xyObstacle.y, '#979C9C', '#979C9C');
    }
  }
}

var obstacleSquare = [obstacle0, obstacle1, obstacle2];

var initObsSquare = false;
function initObstacleSquare () {
  for (var h = 0; h < obstacleSquare.length; h++) {
    for (var i = obstacleSquare[h].posX; i < obstacleSquare[h].obsLength + obstacleSquare[h].posX; i++) {
      obstacleSquare[h].array.push({x: i, y: obstacleSquare[h].posY});
    }
  }

  function updateObstacle () {
    for (var h = 0; h < obstacleSquare.length; h++) {
      for (var g = 0; g < obstacleSquare[h].array.length; g++) {
        var xyObstacle = obstacleSquare[h].array[g];
        xyObstacle.x++;
        if (xyObstacle.x === Math.round(width / cellSize)) xyObstacle.x = 0;
        if (xyObstacle.x === (-1)) xyObstacle.x = Math.round(width / cellSize) - 1;
        if (xyObstacle.y === Math.round(height / cellSize) + 1) xyObstacle.y = 0;
        if (xyObstacle.y === (-1)) xyObstacle.y = Math.round(height / cellSize) - 1;
      }
    }
  }
  initObsSquare = true;
  totalObstacles = obstacleSquare.concat(obstacleScatter, obstacleVertical);
  var animateObstacle = setInterval(updateObstacle, 100);
}

function paintObstacleSquare () {
  for (var h = 0; h < obstacleSquare.length; h++) {
    for (var g = 0; g < obstacleSquare[h].array.length; g++) {
      var xyObstacle = obstacleSquare[h].array[g];
      paintCell(xyObstacle.x, xyObstacle.y, '#979C9C', '#979C9C');
    }
  }
}

var initObsScatter = false;
var obstacleScatter = [];
function initObstacleScatter () {
  var numOfScatter = 30;
  for (var i = 0; i < numOfScatter; i++) {
    var scatterX = Math.round(Math.random() * (width - cellSize) / cellSize);
    var scatterY = Math.round(Math.random() * (height - cellSize) / cellSize);
    var obstacle3 = new Obstacle(cellSize, scatterX, scatterY);
    obstacleScatter.push(obstacle3);
  }
  for (var j = 0; j < numOfScatter; j++) {
    obstacleScatter[j].array.push({x: obstacleScatter[j].posX, y: obstacleScatter[j].posY});
    console.log(obstacleScatter[j].array);
  }
  initObsScatter = true;
  totalObstacles = obstacleSquare.concat(obstacleScatter, obstacleVertical);
}

function paintObstacleScatter () {
  for (var h = 0; h < obstacleScatter.length; h++) {
    for (var g = 0; g < obstacleScatter[h].array.length; g++) {
      var xyObstacle = obstacleScatter[h].array[g];
      paintCell(xyObstacle.x, xyObstacle.y, '#979C9C', '#979C9C');
    }
  }
}
function randomObstacleFood () {
  var numOfObsFood = 3;
  for (var i = 0; i < numOfObsFood; i++) {
    var obstacleFoodX = Math.round(Math.random() * (width - cellSize) / cellSize);
    var obstacleFoodY = Math.round(Math.random() * (height - cellSize) / cellSize);
    obstacleFood.push({x: obstacleFoodX, y: obstacleFoodY});
  }
  return obstacleFood;
}
randomObstacleFood();

function paintObstacleFood () {
  for (var i = 0; i < obstacleFood.length; i++) {
    paintCell(obstacleFood[i].x, obstacleFood[i].y, '#348899', '#348899');
  }
}

function paint () {
  if (running) {
    requestAnimationFrame(paint);
    // Drawing code goes here
    paintCanvas();
    createFood();
    paintObstacleFood();
    paintObstacleSquare();
    paintObstacleScatter();
    paintObstacleVertical();
    // updateSnake();
    // paint snake
    for (var i = 0; i < snake.bodyArray.length; i++) {
      var xyCor = snake.bodyArray[i];
      paintCell(xyCor.x, xyCor.y, '#F2EBC7', '#343642');
    }
    ctx.font = '20px sans-serif';
    ctx.fillStyle = '#F2EBC7';
    ctx.fillText(score, 5, 25);
  }
}
paint();

// Function key directions
document.onkeydown = function (event) {
  var key = event.keyCode;
  if (key === 38 && snake.direction !== 'down') snake.direction = 'up';
  if (key === 40 && snake.direction !== 'up') snake.direction = 'down';
  if (key === 37 && snake.direction !== 'right') snake.direction = 'left';
  if (key === 39 && snake.direction !== 'left') snake.direction = 'right';
  if (key === 32) location.reload();
  if (key) event.preventDefault();
};

// ========================================================================================
// function initGame () {
//   // gameLoop = setInterval(paintSnake, 40);
// }
// initGame();

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

// var fpsObstacle = 1;
// function paintObstacle () {
//   setTimeout(function () {
//     requestAnimationFrame(paintObstacle);
//     for (var h = 0; h < obstacleSquare.length; h++) {
//       for (var g = 0; g < obstacleSquare[h].array.length; g++) {
//         var xyObstacle = obstacleSquare[h].array[g];
//         xyObstacle.x++;
//         paintCell(xyObstacle.x, xyObstacle.y, '#348899', '#348899');
//       }
//     }
//   }, 1000 / fpsObstacle);
// }
// paintObstacle();
