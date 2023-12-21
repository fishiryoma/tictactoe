const playground = document.querySelector(".playground");
const message = document.querySelector("h1");
const start = document.querySelector(".start-game");
const chooseFirst = document.querySelector(".choose-first");
const img = document.querySelector(".img");
const playAgain = document.querySelector(".play-again");
const allDrawBtn = document.querySelectorAll("[data-index]");
const allDrawLine = document.querySelectorAll("[data-line]");
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

const situation = { playerFirst: false, computerFisrt: false };
let currentStatus = "over";
let circlePosition = [];
let crossPosition = [];
let winArray = [];

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
  winArray = [];
  situation.playerFirst = false;
  situation.computerFisrt = false;
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

function drawWinLine() {
  if (winArray) {
    switch (winArray.join("")) {
      case "123":
        document.querySelector('[data-line="1"]').classList.add("line1");
        break;
      case "456":
        document.querySelector('[data-line="2"]').classList.add("line2");
        break;
      case "789":
        document.querySelector('[data-line="3"]').classList.add("line3");
        break;
      case "147":
        document.querySelector('[data-line="4"]').classList.add("line4");
        break;
      case "258":
        document.querySelector('[data-line="5"]').classList.add("line5");
        break;
      case "369":
        document.querySelector('[data-line="6"]').classList.add("line6");
        break;
      case "159":
        document.querySelector('[data-line="7"]').classList.add("line7");
        break;
      case "357":
        document.querySelector('[data-line="8"]').classList.add("line8");
        console.log("test");
        break;
    }
  }
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
  for (const arr of winCondition) {
    if (arr.every((num) => positionArr.includes(num))) {
      winArray = arr;
      return true;
    }
  }
  return false;
}

// 判斷誰贏了並輸出獲勝訊息
function winMessage(playerPosition, computerPosition) {
  if (!noEmptyToDraw() && !isWin(playerPosition) && !isWin(computerPosition))
    return;
  // 平手
  if (noEmptyToDraw()) {
    message.innerText = "引き分け";
    img.src = "./img/tie.png";
    winArray = [];
  }
  // WIN
  if (isWin(playerPosition)) {
    message.innerText = "🎉勝った🎉";
    img.src = "./img/win.png";
  }
  // LOSE
  if (isWin(computerPosition)) {
    message.innerText = "負けた";
    img.src = "./img/lose.png";
  }
  currentStatus = "over";
  // 畫連線CSS有transition延遲
  drawWinLine();
  // 設定setTimeout顯示遊戲結束畫面
  showGameOver();
}

// 將位置推入陣列並確認是否有輸贏
function pushPosition(position, positionArray) {
  positionArray.push(position);
  playerSwitch();
}

// 電腦下，延遲0.25秒假裝電腦在思考
function computerAction(playerPosition, computerPosition) {
  let position = bestPosition(playerPosition, computerPosition);
  if (noEmptyToDraw()) return;
  setTimeout(function () {
    draw(position, currentStatus);
    // 測試用，電腦下的位置回報
    // console.log(position);
    pushPosition(position, computerPosition);
    winMessage(playerPosition, computerPosition);
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
    situation.playerFirst = true;
  }
  // 後攻
  if (e.target.classList.contains("computer-first")) {
    situation.computerFisrt = true;
    computerAction(crossPosition, circlePosition);
  }
});

// GAME EVENT LISTENER
playground.addEventListener("click", function clickTable(event) {
  if (event.target.tagName !== "BUTTON") return;
  // 定義區域變數
  let position = +event.target.dataset.index;
  if ([...circlePosition, crossPosition].includes(position)) return;
  draw(position, currentStatus);
  let playerPosition;
  let computerPosition;
  // 設定先後攻需要傳入的Array
  if (situation.playerFirst) {
    playerPosition = circlePosition;
    computerPosition = crossPosition;
  }
  if (situation.computerFisrt) {
    playerPosition = crossPosition;
    computerPosition = circlePosition;
  }
  pushPosition(position, playerPosition);
  winMessage(playerPosition, computerPosition);
  computerAction(playerPosition, computerPosition);
});

playAgain.addEventListener("click", function playagain() {
  reset();
});
