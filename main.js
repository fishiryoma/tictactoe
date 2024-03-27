const playground = document.querySelector(".playground");
const message = document.querySelector("h1");
const start = document.querySelector(".start-game");
const chooseFirst = document.querySelector(".choose-first");
const playerFirst = document.querySelector(".player-first");
const computerFirst = document.querySelector(".computer-first");
const img = document.querySelector(".img");
const messageBox = document.querySelector(".message-box");
const playAgain = document.querySelector(".play-again");
const allDrawBtn = document.querySelectorAll("[data-index]");
const drawLine = document.querySelector(".line");
const playerScore = document.querySelector(".player_score");
const computerScore = document.querySelector(".computer_score");
const tieScore = document.querySelector(".tie_score");
const twitterBtn = document.querySelector(".twitter_btn");
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

const View = {
  enterStart() {
    start.classList.add("clickMsg");
    start.addEventListener("animationend", () => {
      setTimeout(() => {
        start.classList.add("hidden");
        chooseFirst.classList.remove("hidden");
        start.classList.remove("clickMsg");
      }, 250);
    });
  },
  choosePlayer(firstPlayer) {
    if (firstPlayer) {
      playerFirst.classList.add("clickMsg");
      playerFirst.addEventListener("animationend", () => {
        setTimeout(() => {
          toPlayground();
          playerFirst.classList.remove("clickMsg");
        }, 250);
      });
    } else {
      computerFirst.classList.add("clickMsg");
      computerFirst.addEventListener("animationend", () => {
        setTimeout(() => {
          toPlayground();
          computerFirst.classList.remove("clickMsg");
        }, 250);
      });
    }
    function toPlayground() {
      img.classList.add("hidden");
      messageBox.classList.add("hidden");
      playground.classList.remove("hidden");
    }
  },
  draw(position, currentStatus) {
    document
      .querySelector(`[data-index="${position}"]`)
      .classList.add(currentStatus);
  },
  winMessage(msg) {
    // 平手
    if (msg === "tie") {
      message.innerText = "引き分け";
      img.classList.add("tie");
      winArray = [];
      Module.tScore++;
      this.showGameOver();
    }
    // WIN
    if (msg === "win") {
      message.innerText = "勝った";
      img.classList.add("win");
      Module.pScore++;
    }
    // LOSE
    if (msg === "lose") {
      message.innerText = "負けた";
      img.classList.add("lose");
      Module.cScore++;
    }
    // 畫連線CSS
    if (Module.winArray.length) {
      console.log(Module.winArray);
      drawLine.classList.add(`line${Module.winArray[0] + 1}`);
      drawLine.addEventListener("animationend", () => {
        // 設定setTimeout顯示遊戲結束畫面
        this.showGameOver();
      });
    }
    this.updateScore();
  },
  updateScore() {
    playerScore.textContent = Module.pScore;
    computerScore.textContent = Module.cScore;
    tieScore.textContent = Module.tScore;
    // 客製化推特訊息
    twitterBtn.href = `https://twitter.com/intent/tweet?text=OXゲームで${
      Module.pScore
    }回勝った、${Module.cScore}回負けた、${Module.tScore}回引き分け...${
      Module.pScore > Module.cScore ? "天才だ❤️" : "だめだ😭"
    }@tess_taiwan,Link:'https://tictactoe-tess.netlify.app/'`;
  },
  showGameOver() {
    setTimeout(() => {
      playground.classList.add("hidden");
      img.classList.remove("hidden", "slideUpDown");
      messageBox.classList.remove("hidden");
      playAgain.classList.remove("hidden");
      chooseFirst.classList.add("hidden");
    }, 700);
  },
  resetView() {
    drawLine.className = "line";
    allDrawBtn.forEach((btn) => (btn.classList = ""));
    // 回到選擇先後攻畫面
    playAgain.classList.add("clickMsg");
    playAgain.addEventListener("animationend", () => {
      setTimeout(() => {
        playAgain.classList.remove("clickMsg");
        playAgain.classList.add("hidden");
        chooseFirst.classList.remove("hidden");
        img.className = "img welcome slideUpDown";
        message.innerText = "OXゲーム";
      }, 250);
    });
  },
};

const Module = {
  currentStatus: "over",
  circlePosition: [],
  crossPosition: [],
  firstPlayer: "",
  winArray: [],
  pScore: 0,
  cScore: 0,
  tScore: 0,
  computerAction() {
    if (this.firstPlayer === "player") {
      playerPosition = this.circlePosition;
      computerPosition = this.crossPosition;
    } else {
      playerPosition = this.crossPosition;
      computerPosition = this.circlePosition;
    }
    // 如果沒地方下了就結束
    if (this.noEmptyToDraw()) return;

    let position = this.bestPosition(playerPosition, computerPosition);

    setTimeout(() => {
      View.draw(position, this.currentStatus);
      const amIWin = this.pushPosition(position, computerPosition);
      // 電腦獲勝
      if (amIWin) View.winMessage("lose");
      // 平手
      if (!amIWin && this.noEmptyToDraw()) {
        View.winMessage("tie");
      }
    }, 150);
  },

  noEmptyToDraw() {
    if (this.circlePosition.length + this.crossPosition.length === 9) {
      return true;
    } else return false;
  },
  // 電腦找出最佳位置
  bestPosition(playerPosition, computerPosition) {
    const allPosition = [...playerPosition, ...computerPosition];
    const emptyPosition = Array.from(Array(9).keys(), (e) => e + 1).filter(
      (num) => !allPosition.includes(num)
    );
    // 測試用
    // console.log(emptyPosition);
    function isWin(positionArr) {
      for (const arr of winCondition.entries()) {
        if (arr[1].every((num) => positionArr.includes(num))) {
          return true;
        }
      }
      return false;
    }
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
  },

  pushPosition(position, positionArray) {
    positionArray.push(position);
    this.playerSwitch();
    for (const arr of winCondition.entries()) {
      if (arr[1].every((num) => positionArray.includes(num))) {
        this.winArray = arr;
        return true;
      }
    }
    return false;
  },
  playerSwitch() {
    if (this.currentStatus === "circle") {
      this.currentStatus = "cross";
    } else {
      this.currentStatus = "circle";
    }
  },
  resetData() {
    this.currentStatus = "circle";
    this.circlePosition = [];
    this.crossPosition = [];
    this.winArray = [];
    this.firstPlayer = "";
  },
};

const Controller = {
  startGame() {
    start.addEventListener("click", function () {
      // 渲染開始畫面
      View.enterStart();
    });
    chooseFirst.addEventListener("click", function whoFirst(e) {
      // 選擇先後攻畫面渲染
      const player = e.target.classList.contains("player-first");
      View.choosePlayer(player);
      Module.currentStatus = "circle";
      // 先攻
      if (e.target.classList.contains("player-first")) {
        Module.firstPlayer = "player";
      }
      // 後攻
      if (e.target.classList.contains("computer-first")) {
        Module.firstPlayer = "computer";
        computerAction();
      }
    });

    playground.addEventListener("click", function clickTable(e) {
      if (e.target.tagName !== "BUTTON" || Module.currentStatus === "over")
        return;
      let position = +e.target.dataset.index;
      if (
        [...Module.circlePosition, ...Module.crossPosition].includes(position)
      )
        return;
      // 畫OOXX
      View.draw(position, Module.currentStatus);
      if (Module.firstPlayer === "player") {
        playerPosition = Module.circlePosition;
      } else playerPosition = Module.crossPosition;

      let isPlayerWin = Module.pushPosition(position, playerPosition);
      if (!isPlayerWin && Module.noEmptyToDraw()) {
        View.winMessage("tie");
      } else if (isPlayerWin) {
        View.winMessage("win");
      } else Module.computerAction();
    });

    playAgain.addEventListener("click", function playagain() {
      Module.resetData();
      View.resetView();
    });
  },
};

Controller.startGame();
