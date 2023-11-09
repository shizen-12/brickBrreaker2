let canvas = document.getElementById("canvas");
//canvasの要素を変数名canvasに保存
let ctx = canvas.getContext("2d");
//2D描画コンテキストを保存するためにctx変数を作成

let rightPressed = false;
let leftPressed = false;

//パドルのインポート
import { Paddle } from "./paddle.js";
//パドルの設定
let paddleHeight = 20;
let paddleWidth = 120;
let paddleSpeed = 10;
let paddle = new Paddle(canvas, paddleHeight, paddleWidth, paddleSpeed);
paddle.drawPaddle(ctx, rightPressed, leftPressed);
