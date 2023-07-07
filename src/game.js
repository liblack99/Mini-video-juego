const canvas = document.getElementById("canvasGame");
const game = canvas.getContext("2d");
const buttonUp = document.getElementById("buttonUp");
const buttonLeft = document.getElementById("buttonLeft");
const buttonRight = document.getElementById("buttonRight");
const buttonDown = document.getElementById("buttonDown");
const livesSpan = document.getElementById("lives");
const timeSpan = document.getElementById("time");
const recordSpan = document.getElementById("record");
const pResult = document.getElementById("result");
const btnStart = document.getElementById("btnStart")
const mainContainer = document.getElementById("gameContainer")
const startContainer = document.getElementById("startContainer")

btnStart.addEventListener("click", showGame)
buttonUp.addEventListener("click", moveUp);
buttonLeft.addEventListener("click", moveLeft);
buttonRight.addEventListener("click", moveRight);
buttonDown.addEventListener("click", moveDown);
window.addEventListener("keydown", moveKeyboard);
window.addEventListener('resize', setCanvasSize);


let timeStart;
let timePlayer;
let timeInterval;
let canvasSize;
let elementsSize;
let level = 0;
let lives = 3;

let playerPosition = {
  x: undefined,
  y: undefined
};

let giftPosition = {
  x: undefined,
  y: undefined
};
let enemyPosition = [];

function setCanvasSize() {
  if (window.innerHeight > window.innerWidth) {
    canvasSize = window.innerWidth * 0.7;
  } else {
    canvasSize = window.innerHeight * 0.7;
  };
  canvasSize = canvasSize.toFixed(0)

  canvas.setAttribute('width', canvasSize);
  canvas.setAttribute('height', canvasSize);
  
  elementsSize = canvasSize / 10;
  
  playerPosition.x = undefined;
  playerPosition.y = undefined;
  startGame()
};

function startGame() {
  game.font = elementsSize + "px arial";
  game.textAlign = "end";
  
  const map = maps[level];

  if (!map){
    gameWin();
    return;
  };

  if(!timeStart){
    timeStart = Date.now();
    timeInterval= setInterval(showTime, 100);
    showRecord();
  };

  const mapRows = map.trim().split('\n');
  const mapRowsColm = mapRows.map(row => row.trim().split(""));
  showLives()

  enemyPosition = [];
  game.clearRect(0, 0, canvasSize, canvasSize);
  mapRowsColm.forEach((row, rowIndex) => { 
    row.forEach((colm, colmIndex) =>  {
      const emoji = emojis[colm];
      const posiX = elementsSize * (colmIndex + 1 );
      const posiY = elementsSize * (rowIndex + 1);
      
      if (colm == "O") {
        if(!playerPosition.x && !playerPosition.y){
          playerPosition.x = posiX;
          playerPosition.y = posiY;
        }
      }else if(colm == "I" ){
        giftPosition.x = posiX
        giftPosition.y = posiY
      }else if (colm == "X" ){
        enemyPosition.push({
          x: posiX,
          y: posiY
        });
      }
      game.fillText(emoji, posiX, posiY);

    });
    
  });
  // 
  movePlayer();
  
};
function showGame(){
  mainContainer.classList.toggle("hidden")
  startContainer.classList.add("hidden")
  setCanvasSize()
}

function movePlayer() {
  const collision = playerPosition.x.toFixed(3) == giftPosition.x.toFixed(3) && playerPosition.y.toFixed(3) == giftPosition.y.toFixed(3);
  if(collision){
    levelWin();
  };

  const enemyCollison = enemyPosition.find(enemy =>  { 
    const isCollision = enemy.x.toFixed(3) == playerPosition.x.toFixed(3) && enemy.y.toFixed(3) == playerPosition.y.toFixed(3);
    return isCollision  ;
  });

  if (enemyCollison) {
    lavelFail();
  };
  game.fillText(emojis["PLAYER"], playerPosition.x, playerPosition.y );
};
function levelWin(){
  level++;
  startGame();
};
function gameWin(){
   clearInterval(timeInterval);

   const record = localStorage.getItem("record_time");
   const playerTime = Date.now() - timeStart ;
    console.log(record)
   if (record) {
    if(record >= playerTime){
      localStorage.setItem("record_time", playerTime)
      pResult.innerHTML ="Superaste el record"
    }else{
      pResult.innerHTML ="No superaste el record"
    }
   }else{
    localStorage.setItem("record_time", playerTime)
    pResult.innerHTML ="Tienes un record"
   }
   
};
function lavelFail(){
  lives--;
  if (lives <= 0) {
    level = 0;
    lives = 3;
    timeStart = undefined;
  }
  playerPosition.x = undefined;
  playerPosition.y = undefined;
  startGame()
};
function showLives() {
  const hearts = Array(lives).fill(emojis["HEART"]);
  livesSpan.innerHTML ="";
  hearts.forEach(heart => livesSpan.append(heart));
};
function showTime(){
   timeSpan.innerHTML = parseInt((Date.now() - timeStart) / 1000) ;
};
function showRecord() {
    recordSpan.innerHTML = localStorage.getItem("record_time")
};
function moveKeyboard(event) {
  switch (event.key) {
    case "ArrowUp":
      moveUp()
      break;
      case "ArrowLeft":
        moveLeft();
      
      break;
      case "ArrowRight":
       moveRight();
      break;
      case "ArrowDown":
        moveDown();
      break;
  
    default:
      break;
  }
};
function moveUp(){
  if((playerPosition.y - elementsSize) < elementsSize ){

  }else{
    playerPosition.y -= elementsSize;
  }
  startGame();
};
function moveLeft(){
  if((playerPosition.x - elementsSize) < elementsSize){

  }else{
    playerPosition.x -= elementsSize;
  }
  startGame();
};
function moveRight() {
  if((playerPosition.x + elementsSize) > canvasSize){

  }else{
    playerPosition.x += elementsSize;
  }
  startGame();
};
function moveDown() {
  if ((playerPosition.y + elementsSize) > canvasSize) {
    
  }else{
    playerPosition.y += elementsSize;
  }
  startGame();
};