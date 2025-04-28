const startBtn = document.getElementById('startBtn');
const timerDisplay = document.getElementById('timer');
const pivot = document.getElementById('pivot');
const rows = [document.getElementById('row1'), document.getElementById('row2'), document.getElementById('row3')];

let timeRemaining = 600;
let timer;
let currentTile = null;

startBtn.addEventListener('click', startGame);

function startGame() {
  pivot.innerHTML = 'Pivot';
  clearInterval(timer);
  timeRemaining = 600;
  updateTimerDisplay();

  let numbers = Array.from({ length: 15 }, (_, i) => i + 1).sort(() => Math.random() - 0.5);
  for (let i = 0; i < 3; i++) {
    rows[i].innerHTML = '';
    numbers.slice(i * 5, i * 5 + 5).forEach(num => {
      const tile = createTile(num);
      rows[i].appendChild(tile);
    });
  }

  timer = setInterval(() => {
    timeRemaining--;
    updateTimerDisplay();
    if (timeRemaining <= 0) {
      clearInterval(timer);
      alert("⏳ Time's up! Try again!");
    }
  }, 1000);
  
  
}

document.getElementById("startBtn").addEventListener("click", () => {
  const bgMusic = document.getElementById("bgMusic");
  if (bgMusic) {
    bgMusic.play().catch(() => {
      console.log("Autoplay blocked until user interaction");
    });
  }
});

function updateTimerDisplay() {
  const min = String(Math.floor(timeRemaining / 60)).padStart(2, '0');
  const sec = String(timeRemaining % 60).padStart(2, '0');
  timerDisplay.textContent = `${min}:${sec}`;
}

function createTile(num) {
  const tile = document.createElement('div');
  tile.classList.add('tile');
  tile.textContent = num;
  tile.draggable = true;

  tile.addEventListener('dragstart', (e) => {
    currentTile = tile;
    setTimeout(() => tile.style.display = 'none', 0);
  });

  tile.addEventListener('dragend', (e) => {
    tile.style.display = '';
  });

  return tile;
}

rows.forEach((row) => {
  row.addEventListener('click', () => {
    if (pivot.children.length === 0 && row.children.length > 0) {
      const firstTile = row.children[0];
      pivot.appendChild(firstTile);
    }
  });

  row.addEventListener('dragover', (e) => e.preventDefault());
  row.addEventListener('drop', (e) => {
    e.preventDefault();
    if (currentTile && pivot.contains(currentTile)) {
      const isFull = row.children.length >= 5;
      if (isFull) {
        const firstTile = row.children[0];
        row.removeChild(firstTile);
        pivot.innerHTML = '';
        pivot.appendChild(firstTile);
      }
      row.appendChild(currentTile);
      currentTile = null;
      checkWin();
    }
  });
});

function checkWin() {
  const target = [
    [1, 2, 3, 4, 5],
    [6, 7, 8, 9, 10],
    [11, 12, 13, 14, 15]
  ];
  let success = true;

  for (let i = 0; i < 3; i++) {
    const nums = Array.from(rows[i].children).map(tile => parseInt(tile.textContent));
    if (nums.length !== 5 || !nums.every((v, j) => v === target[i][j])) {
      success = false;
      break;
    }
  }

  if (success) {
    clearInterval(timer);
    document.getElementById("winSound").play();
    confetti({ particleCount: 200, spread: 100 });
    alert("🎉 You win! Survivor-style!");
  }
}
