const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const scoresPerBinColor = {
    green: { paper: -5, glass: 10, organic: -5, nonRecyclableWaste: -5, plastic: -5 },
    blue: { paper: 10, glass: -5, organic: -5, nonRecyclableWaste: -5, plastic: -5 },
    red: { paper: -5, glass: -5, organic: 10, nonRecyclableWaste: -5, plastic: -5 },
    yellow: { paper: -5, glass: -5, organic: -5, nonRecyclableWaste: -5, plastic: 10 },
    black: { paper: -5, glass: -5, organic: -5, nonRecyclableWaste: 10, plastic: -5 },
};

let recycleBinImage, redBinImage, blackBinImage, yellowBinImage, greenBinImage, blueBinImage;
let bottleImages, paperImages, plasticImages, trashImages, organicImages;
let recycleBin, currentItem;
let score = 0;

function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function getImageArray(itemType) {
    switch (itemType) {
        case 'glass': return bottleImages;
        case 'paper': return paperImages;
        case 'plastic': return plasticImages;
        case 'nonRecyclableWaste': return trashImages;
        case 'organic': return organicImages;
        default: return [];
    }
}

function selectRandomBin() {
    const bins = [redBinImage, blackBinImage, yellowBinImage, greenBinImage, blueBinImage];
    const colors = ["red", "black", "yellow", "green", "blue"];
    const randomIndex = Math.floor(Math.random() * bins.length);
    recycleBin.color = colors[randomIndex];
    recycleBinImage = bins[randomIndex];
}

function drawRecycleBin() {
    ctx.drawImage(recycleBinImage, recycleBin.x, recycleBin.y, recycleBin.width, recycleBin.height);
}

function drawItem(item) {
    if (item) {
        ctx.drawImage(item.image, item.x, item.y, item.width, item.height);
    }
}

function drawScore() {
    ctx.fillStyle = 'black';
    ctx.font = '24px Arial';
    ctx.fillText('Score: ' + score, 10, 30);
}

function updateGame() {
    let speedIncrease = 1;

    if (!currentItem) {
        const items = ['glass', 'paper', 'plastic', 'nonRecyclableWaste', 'organic'];
        let itemType = items[Math.floor(Math.random() * items.length)];
        currentItem = {
            x: Math.random() * (canvas.width - 50),
            y: 0,
            width: 90,
            height: 90,
            type: itemType,
            image: pickRandom(getImageArray(itemType))
        };
    } else {
        currentItem.y += 2 * speedIncrease;

        if (currentItem.x < recycleBin.x + recycleBin.width &&
            currentItem.x + currentItem.width > recycleBin.x &&
            currentItem.y < recycleBin.y + recycleBin.height &&
            currentItem.y + currentItem.height > recycleBin.y) {
            score += scoresPerBinColor[recycleBin.color][currentItem.type];
            currentItem = null;
        }

        if (currentItem && currentItem.y > canvas.height) {
            currentItem = null;
        }
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawRecycleBin();
    drawItem(currentItem);
    drawScore();
    requestAnimationFrame(updateGame);
}

function initializeGame() {
    // Initialize bin images
    redBinImage = new Image(); redBinImage.src = "./assets/images/red-bin.png";
    blackBinImage = new Image(); blackBinImage.src = "./assets/images/black-bin.png";
    yellowBinImage = new Image(); yellowBinImage.src = "./assets/images/yellow-bin.png";
    greenBinImage = new Image(); greenBinImage.src = "./assets/images/green-bin.png";
    blueBinImage = new Image(); blueBinImage.src = "./assets/images/blue-bin.png";

    // Initialize arrays for each category
    bottleImages = ['./assets/images/bottle.png', './assets/images/wine.png', './assets/images/broken-glass.png', './assets/images/pickle.png' /* other paths */].map(src => { const img = new Image(); img.src = src; return img; });
    paperImages = ['./assets/images/paper.png', './assets/images/newspaper.png', './assets/images/envelope.png', './assets/images/toilet-paper.png', './assets/images/packaging.png', './assets/images/package.png',/* other paths */].map(src => { const img = new Image(); img.src = src; return img; });
    plasticImages = ['./assets/images/plastic.png', './assets/images/plastic-cup.png', './assets/images/milk-carton.png', './assets/images/plastic-bag.png',/* other paths */].map(src => { const img = new Image(); img.src = src; return img; });
    trashImages = ['./assets/images/diaper.png', './assets/images/poop.png', /* other paths */].map(src => { const img = new Image(); img.src = src; return img; });
    organicImages = ['./assets/images/banana.png', './assets/images/apple.png', './assets/images/egg.png',/* other paths */].map(src => { const img = new Image(); img.src = src; return img; });

    // Initialize game state
    recycleBin = { color: "blue", x: canvas.width / 2 - 75, y: canvas.height - 150, width: 150, height: 150 };
    currentItem = null;
    score = 0;
    selectRandomBin();
    updateGame();
}

function resetGame() {
    location.reload();
}

function onCanvasMouseMove(event) {
    const canvasRect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - canvasRect.left;
    const binHalfWidth = recycleBin.width / 2;
    recycleBin.x = Math.min(Math.max(mouseX - binHalfWidth, 0), canvas.width - recycleBin.width);
}

canvas.addEventListener('mousemove', onCanvasMouseMove);

function startGame() {
    
    document.getElementById('welcomeSection').style.display = 'none';
    document.getElementById('gameSection').style.display = 'block';
    }
    


function endGame() {
    document.getElementById('gameSection').style.display = 'none';
    document.getElementById('endSection').style.display = 'block';
    document.getElementById('finalScore').textContent = score.toString();
}

function restartGame() {
    document.getElementById('endSection').style.display = 'none';
    document.getElementById('welcomeSection').style.display = 'block';
    score = 0;
    resetGame();
}

initializeGame();

const binSwitchHandler = (event) => {
    if (event.key === "a") {
        recycleBin.color = "red";
        recycleBinImage = redBinImage;
    } else if (event.key === "s") {
        recycleBin.color = "green";
        recycleBinImage = greenBinImage;
    } else if (event.key === "d") {
        recycleBin.color = "blue";
        recycleBinImage = blueBinImage;
    } else if (event.key === "f") {
        recycleBin.color = "yellow";
        recycleBinImage = yellowBinImage;
    } else if (event.code === "Space"  || event.key === "g") {
        recycleBin.color = "black";
        recycleBinImage = blackBinImage;
    }
};

document.addEventListener("keydown", binSwitchHandler);
