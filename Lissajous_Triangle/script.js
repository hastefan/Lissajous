"use strict";

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

let canvas = document.getElementById('canvas');
/** @type {CanvasRenderingContext2D} */
let ctx = canvas.getContext('2d');

let rowSlider = document.getElementById('rowSlider');
let colSlider = document.getElementById('colSlider');
let sideLengthSlider = document.getElementById('sideLengthSlider');


/*
// fit canvas to screen
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
*/

ctx.lineWidth = 1;
ctx.fillStyle = "white";

let canvasWidth;
let canvasHeight;

let a = 80;
let h = Math.sqrt(Math.pow(a, 2) - Math.pow(a / 2, 2));
let gap = a * 0.2;
let rows = 6;
let cols = 6;
let progress = 0;

let images = [];

let strokeY = [];
let strokeX = [];

initValues();
requestAnimationFrame(draw);

function initValues() {
    a = parseInt(sideLengthSlider.value);
    rows = parseInt(rowSlider.value);
    cols = parseInt(colSlider.value);

    h = Math.sqrt(Math.pow(a, 2) - Math.pow(a / 2, 2));
    gap = a * 0.2;

    canvasHeight = rows * (h + gap) + (h + gap);
    canvasWidth = cols * (a + gap) + (a + gap);
    canvas.height = canvasHeight;
    canvas.width = canvasWidth;

    progress = 0;
    images = [];
    for (let i = 0; i < rows; i++) {
        images[i] = [];
    }

    initializeLissajousArray();
}

function initializeLissajousArray() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            images[i][j] = new LissajousImage();
        }
    }
}

function draw(timeStamp) {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    drawTable();
    drawLissajousImages();
    progress += 0.005;
    if (progress >= 3) {
        progress = 0;
        initializeLissajousArray();
        //return;
    }
    requestAnimationFrame(draw);
}

function drawTable() {
    ctx.strokeStyle = "white";
    ctx.fillStyle = "white";
    for (let i = 0; i < rows; i++) {
        let startX = 0;
        let startY = (h + gap) * (i + 1) + h;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(startX + a, startY);
        ctx.lineTo((startX + a / 2), startY - h);
        ctx.lineTo(startX, startY);
        ctx.stroke();
        let x;
        let y;
        let drawProgress = (progress * (i + 1)) % 3;
        if (drawProgress <= 1) {
            x = startX + a * drawProgress;
            y = startY;
        } else if (drawProgress <= 2) {
            x = startX + a - (a * (drawProgress - 1) * Math.cos(60 * Math.PI / 180));
            y = startY - a * (drawProgress - 1) * Math.sin(60 * Math.PI / 180);
        } else {
            x = startX + a / 2 - a * (drawProgress - 2) * Math.cos(60 * Math.PI / 180);
            y = startY - h + a * (drawProgress - 2) * Math.sin(60 * Math.PI / 180);
        }
        ctx.beginPath();
        ctx.arc(x, y, a * 0.05, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvasWidth, y);
        ctx.stroke();
        strokeY[i] = y;
    }
    for (let j = 0; j < cols; j++) {
        let startX = (a + gap) * (j + 1);
        let startY = h;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(startX + a, startY);
        ctx.lineTo((startX + a / 2), startY - h);
        ctx.lineTo(startX, startY);
        ctx.stroke();
        let x;
        let y;
        let drawProgress = (progress * (j + 1)) % 3;
        if (drawProgress <= 1) {
            x = startX + a * drawProgress;
            y = startY;
        } else if (drawProgress <= 2) {
            x = startX + a - (a * (drawProgress - 1) * Math.cos(60 * Math.PI / 180));
            y = startY - a * (drawProgress - 1) * Math.sin(60 * Math.PI / 180);
        } else {
            x = startX + a / 2 - a * (drawProgress - 2) * Math.cos(60 * Math.PI / 180);
            y = startY - h + a * (drawProgress - 2) * Math.sin(60 * Math.PI / 180);
        }
        ctx.beginPath();
        ctx.arc(x, y, a * 0.05, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvasHeight);
        ctx.stroke();
        strokeX[j] = x;
    }

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            images[i][j].addVector(strokeX[j], strokeY[i]);
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

rowSlider.addEventListener("change",initValues);
colSlider.addEventListener("change", initValues);
sideLengthSlider.addEventListener("change", initValues);