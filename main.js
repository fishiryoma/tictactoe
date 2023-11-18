const table = document.querySelector("#app table");
const msg = document.querySelectorAll(".msg");
const winMsg = document.querySelector(".win-msg");
const loseMsg = document.querySelector(".lose-msg");
const tieMsg = document.querySelector(".tie-msg");
const start = document.querySelector(".btn-start");
const playAgain = document.querySelectorAll(".play-again");
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

function reset() {
  currentStatus = "circle";
  circlePosition = [];
  crossPosition = [];
  document.querySelectorAll("td").forEach((node) => (node.innerHTML = ""));
}

function bestPosition() {
  const allPosition = [...circlePosition, ...crossPosition];
  const emptyPosition = Array.from(Array(9).keys(), (e) => e + 1).filter(
    (num) => !allPosition.includes(num)
  );

  // 下了就贏的位置
  const winPosition = emptyPosition.filter((num) => {
    const temCrossPosition = [...crossPosition];
    temCrossPosition.push(num);
    if (isWin(temCrossPosition)) return num;
  });

  // 不下就輸的位置
  const defensePostion = emptyPosition.filter((num) => {
    const temCirclePosition = [...circlePosition];
    temCirclePosition.push(num);
    if (isWin(temCirclePosition)) return num;
  });

  if (winPosition.length) return winPosition[0];
  if (!winPosition.length && defensePostion.length) return defensePostion[0];
  // 看中間是不是空的
  if (!allPosition.includes(5)) return 5;
  // 隨機挑一個位置
  const randomNum = Math.floor(Math.random() * emptyPosition.length);
  // console.log(randomNum);
  return emptyPosition[randomNum];
}

function noEmpty() {
  if (circlePosition.length + crossPosition.length === 9) return true;
}

function winMessage() {
  if (noEmpty()) {
    tieMsg.classList.remove("visible");
    currentStatus = "over";
  }

  if (isWin(circlePosition)) {
    winMsg.classList.remove("visible");
  } else if (isWin(crossPosition)) {
    loseMsg.classList.remove("visible");
    currentStatus = "over";
  }
}

function isWin(positionArr) {
  for (const arr of winCondition) {
    if (arr.every((num) => positionArr.includes(num))) {
      return true;
    }
  }
}

function playerSwitch() {
  if (currentStatus === "circle") {
    return (currentStatus = "cross");
  } else {
    return (currentStatus = "circle");
  }
}
function draw(position, currentStatus) {
  document.querySelector(
    `[data-index="${position}"]`
  ).innerHTML = `<div class="${currentStatus}"></div>`;
  playerSwitch();
}

function changeToComputer(position) {
  circlePosition.push(position);
  winMessage();
  setTimeout(function () {
    if (noEmpty()) return;
    const crossP = bestPosition();
    if (currentStatus === "cross") crossPosition.push(crossP);
    draw(crossP, currentStatus);
    winMessage();
  }, 250);
}

start.addEventListener("click", function () {
  currentStatus = "circle";
  start.classList.add("visible");
});

table.addEventListener("click", function clickTable(event) {
  const position = +event.target.dataset.index;
  if (
    event.target.tagName !== "TD" ||
    currentStatus === "over" ||
    circlePosition.includes(position)
  )
    return;

  draw(position, currentStatus);
  changeToComputer(position);
});

playAgain.forEach(function (btn) {
  btn.addEventListener("click", function () {
    reset();
    msg.forEach(function (btn) {
      btn.classList.remove("visilbe");
      btn.classList.add("visible");
    });
  });
});
