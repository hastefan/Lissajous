let canvas = document.getElementById('canvas');
/** @type {CanvasRenderingContext2D} */
let ctx = canvas.getContext('2d');

/*
// fit canvas to screen
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
*/

ctx.lineWidth = 1;
ctx.fillStyle = "white";

let canvasWidth = canvas.width;
let canvasHeight = canvas.height;
let d = 80;
let r = d / 2;
let gap = d * 0.2;
let rows = Math.floor(canvasHeight / (d + gap)) - 1;
let cols = Math.floor(canvasWidth / (d + gap)) - 1;
let angle = 0;

let images = [[]];
for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
        images[i] = [];
    }
}

class LissajousImage {
    constructor() {
        this.X = [];
        this.Y = [];
    }

    addVector(x, y) {
        this.X.push(x);
        this.Y.push(y);
    }
}

let strokeY = [];
let strokeX = [];

initValues();
requestAnimationFrame(draw);
function draw(timeStamp) {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    drawTable();
    drawLissajousImages();
    angle += 0.01;
    if (angle >= 2 * Math.PI) {
        angle = 0;
        initializeLissajousArray();
        //return;
    }
    requestAnimationFrame(draw);
}

function drawTable() {
    ctx.strokeStyle = "white";
    ctx.fillStyle = "white";
    for (let i = 0; i < rows; i++) {
        let cx = r;
        let cy = (d + gap) * (i + 1) + r;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, 2 * Math.PI);
        ctx.stroke();
        let x = r * Math.cos(angle * (i + 1) - Math.PI / 2);
        let y = r * Math.sin(angle * (i + 1) - Math.PI / 2);
        ctx.beginPath();
        ctx.arc(x + cx, y + cy, d * 0.05, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, cy + y);
        ctx.lineTo(canvasWidth, cy + y);
        ctx.stroke();
        strokeY[i] = cy + y;
    }

    for (let j = 0; j < cols; j++) {
        let cx = (d + gap) * (j + 1) + r;
        let cy = r;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, 2 * Math.PI);
        ctx.stroke();
        let x = r * Math.cos(angle * (j + 1) - Math.PI / 2);
        let y = r * Math.sin(angle * (j + 1) - Math.PI / 2);
        ctx.beginPath();
        ctx.arc(x + cx, y + cy, d * 0.05, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(cx + x, 0);
        ctx.lineTo(cx + x, canvasHeight);
        ctx.stroke();
        strokeX[j] = cx + x;
    }

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            images[i][j].addVector(strokeX[j], strokeY[i]);
        }
    }
}

function initializeLissajousArray() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            images[i][j] = new LissajousImage();
        }
    }
}

function drawLissajousImages() {
    ctx.strokeStyle = "cyan";
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            ctx.beginPath();
            for (let k = 0; k < images[i][j].X.length; k++) {
                if (k == 0) {
                    ctx.moveTo(images[i][j].X[k], images[i][j].Y[k]);
                } else {
                    ctx.lineTo(images[i][j].X[k], images[i][j].Y[k]);
                }
            }
            ctx.stroke();
        }
    }
}

function initValues() {
    canvasWidth = canvas.width;
    canvasHeight = canvas.height;
    r = d / 2;
    gap = d * 0.2;
    rows = Math.floor(canvasHeight / (d + gap)) - 1;
    cols = Math.floor(canvasWidth / (d + gap)) - 1;
    angle = 0;
    images = [[]];
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            images[i] = [];
        }
    }

    initializeLissajousArray();
}

let widthSlider = document.getElementById('widthSlider');
let heightSlider = document.getElementById('heightSlider');
let diameterSlider = document.getElementById('diameterSlider');

widthSlider.addEventListener("change", (event) => {
    canvas.width = parseInt(widthSlider.value);
    initValues();
});

heightSlider.addEventListener("change", (event) => {
    canvas.height = parseInt(heightSlider.value);
    initValues();
});

diameterSlider.addEventListener("change", (event) => {
    d = parseInt(diameterSlider.value);
    initValues();
});