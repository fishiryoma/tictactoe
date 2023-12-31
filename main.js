const playground = document.querySelector(".playground");
const message = document.querySelector("h1");
const start = document.querySelector(".start-game");
const chooseFirst = document.querySelector(".choose-first");
const img = document.querySelector(".img");
const playAgain = document.querySelector(".play-again");
const allDrawBtn = document.querySelectorAll("[data-index]");
const allDrawLine = document.querySelectorAll("[data-line]");
const playerScore = document.querySelector(".player_score");
const computerScore = document.querySelector(".computer_score");
const tieScore = document.querySelector(".tie_score");
const winCondition = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
  [1, 4, 7],
  [2, 5, 8],
  [3, 6, 9],
  [1, 5, 9],
  [3, 5, 7],
];

let currentStatus = "over";
let circlePosition = [];
let crossPosition = [];
let playerPosition;
let computerPosition;
let winArray = [];
let pScore = 0;
let cScore = 0;
let tScore = 0;

// 寫入分數
function updateScore() {
  playerScore.textContent = pScore;
  computerScore.textContent = cScore;
  tieScore.textContent = tScore;
}
// DRAW OOXX
function draw(position, currentStatus) {
  document
    .querySelector(`[data-index="${position}"]`)
    .classList.add(currentStatus);
}

// 更換目前選手狀態
function playerSwitch() {
  if (currentStatus === "circle") {
    return (currentStatus = "cross");
  } else {
    return (currentStatus = "circle");
  }
}

// 重置遊戲
function reset() {
  // 重置資料內容
  currentStatus = "circle";
  circlePosition = [];
  crossPosition = [];
  playerPosition = [];
  computerPosition = [];
  winArray = [];
  allDrawBtn.forEach((btn) => (btn.classList = ""));
  allDrawLine.forEach((line) => (line.classList = ""));
  // 回到選擇先後攻畫面
  img.src = "./img/new_game.png";
  img.classList.add("slideUpDown");
  img.classList.remove("game-over");
  chooseFirst.classList.remove("visible");
  playAgain.classList.add("visible");
  message.innerText = "OXゲーム";
}

function createLine() {
  if (!winArray.length) return;
  document
    .querySelector(`[data-line="${winArray[0] + 1}"]`)
    .classList.add(`line${winArray[0] + 1}`);
}

// 畫完連線後顯示遊戲結束畫面
function showGameOver() {
  let delayTime = 1800;
  if (!winArray.length) delayTime = 800;
  setTimeout(() => {
    playground.classList.add("visible");
    img.classList.add("game-over");
    img.classList.remove("visible", "slideUpDown");
    playAgain.classList.remove("visible");
  }, delayTime);
}

// 電腦找出最佳位置
function bestPosition(playerPosition, computerPosition) {
  const allPosition = [...playerPosition, ...computerPosition];
  const emptyPosition = Array.from(Array(9).keys(), (e) => e + 1).filter(
    (num) => !allPosition.includes(num)
  );
  // 測試用
  // console.log(emptyPosition);

  // 下了就贏的位置
  const winPosition = emptyPosition.filter((num) => {
    const temPosition = [...computerPosition];
    temPosition.push(num);
    if (isWin(temPosition)) return num;
  });

  // 不下就輸的位置
  const defensePostion = emptyPosition.filter((num) => {
    const temPosition = [...playerPosition];
    temPosition.push(num);
    if (isWin(temPosition)) return num;
  });
  // 判斷要return下了就贏還是不下就輸的位置
  if (winPosition.length) return winPosition[0];
  if (!winPosition.length && defensePostion.length) return defensePostion[0];

  // 測試用
  // console.log(winPosition, defensePostion);

  // 中間如果是空的就先return中間
  if (!allPosition.includes(5)) return 5;
  // 隨機挑一個位置
  const randomNum = Math.floor(Math.random() * emptyPosition.length);
  // console.log(randomNum);
  return emptyPosition[randomNum];
}

// 確認是否已沒空位可下
function noEmptyToDraw() {
  if (circlePosition.length + crossPosition.length === 9) return true;
}

// 是否符合獲勝條件
function isWin(positionArr) {
  for (const arr of winCondition.entries()) {
    if (arr[1].every((num) => positionArr.includes(num))) {
      winArray = arr;
      return true;
    }
  }
  return false;
}

function whoWin(playerPosition, computerPosition) {
  if (!noEmptyToDraw() && !isWin(playerPosition) && !isWin(computerPosition))
    return false;
  if (noEmptyToDraw()) return "tie";
  if (isWin(playerPosition)) return "win";
  if (isWin(computerPosition)) return "lose";
}

// 判斷誰贏了並輸出獲勝訊息
function winMessage(msg) {
  img.src = `./img/${msg}.png`;
  // 平手
  if (msg === "tie") {
    message.innerText = "引き分け";
    winArray = [];
    tScore++;
  }
  // WIN
  if (msg === "win") {
    message.innerText = "🎉勝った🎉";
    pScore++;
  }
  // LOSE
  if (msg === "lose") {
    message.innerText = "負けた";
    cScore++;
  }
  currentStatus = "over";
  // 畫連線CSS
  createLine();
  // 設定setTimeout顯示遊戲結束畫面
  showGameOver();
  updateScore();
}

// 將位置推入陣列並確認是否有輸贏
function pushPosition(position, positionArray) {
  positionArray.push(position);
  playerSwitch();
  return whoWin(playerPosition, computerPosition);
}

// 電腦下，延遲0.25秒假裝電腦在思考
function computerAction(playerPosition, computerPosition) {
  if (noEmptyToDraw()) return;
  let position = bestPosition(playerPosition, computerPosition);
  setTimeout(function () {
    draw(position, currentStatus);
    let isComputerWin = pushPosition(position, computerPosition);
    if (!isComputerWin) return;
    winMessage(isComputerWin);
  }, 250);
}

// ---EVENT LISTENER----
start.addEventListener("click", function () {
  // 渲染開始畫面
  start.classList.add("visible");
  chooseFirst.classList.remove("visible");
  currentStatus = "circle";
});

chooseFirst.addEventListener("click", function whoFirst(e) {
  // 選擇先後攻畫面渲染
  img.classList.add("visible");
  chooseFirst.classList.add("visible");
  playground.classList.remove("visible");
  // 先攻
  if (e.target.classList.contains("player-first")) {
    playerPosition = circlePosition;
    computerPosition = crossPosition;
  }
  // 後攻
  if (e.target.classList.contains("computer-first")) {
    playerPosition = crossPosition;
    computerPosition = circlePosition;
    computerAction(crossPosition, circlePosition);
  }
});

// GAME EVENT LISTENER
playground.addEventListener("click", function clickTable(event) {
  if (event.target.tagName !== "BUTTON") return;
  // 定義區域變數
  let position = +event.target.dataset.index;
  if ([...circlePosition, ...crossPosition].includes(position)) return;
  // 畫OOXX
  draw(position, currentStatus);
  // 將位置推入陣列並驗證是否有贏家
  let isPlayerWin = pushPosition(position, playerPosition);
  if (!isPlayerWin) {
    return computerAction(playerPosition, computerPosition);
  }
  winMessage(isPlayerWin);
});

playAgain.addEventListener("click", function playagain() {
  reset();
});
