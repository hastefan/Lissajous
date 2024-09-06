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
let diameterSlider = document.getElementById('diameterSlider');


/*
// fit canvas to screen
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
*/

ctx.lineWidth = 1;
ctx.fillStyle = "white";

let canvasWidth;
let canvasHeight;

let d = 80;
let rows = 6;
let cols = 6;
let r = d / 2;
let gap = d * 0.2;
let angle = 0;

let images = [];

let strokeY = [];
let strokeX = [];

initValues();
requestAnimationFrame(draw);

function initValues() {
    d = parseInt(diameterSlider.value);
    rows = parseInt(rowSlider.value);
    cols = parseInt(colSlider.value);

    r = d / 2;
    gap = d * 0.2;
    
    canvasHeight = rows * (d + gap) + (d + gap);
    canvasWidth = cols * (d + gap) + (d + gap);
    canvas.height = canvasHeight;
    canvas.width = canvasWidth;

    angle = 0;
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

colSlider.addEventListener("change", initValues);
rowSlider.addEventListener("change", initValues);
diameterSlider.addEventListener("change", initValues);