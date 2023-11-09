//パドルのインポート
import { Paddle } from "./paddle.js";
//ボールのインポート
import { Ball } from "./ball.js";
//stageのインポート
import { Stage } from "./stage.js";
//bonusItemのインポート
import { BounusItem } from "./bonusItem.js";

let canvas = document.getElementById("canvas");
//canvasの要素を変数名canvasに保存
let ctx = canvas.getContext("2d");
//2D描画コンテキストを保存するためにctx変数を作成

//パドルの設定
let paddleHeight = 20;
let paddleWidth = 120;
let paddleSpeed = 10;
const paddleY = canvas.height - 50;
let paddle = new Paddle(canvas, paddleHeight, paddleWidth, paddleSpeed, paddleY);

//ボールの設定
let BALL_RADIUS = 10; //ボールの大きさ
let ballX = (paddle.paddleX * 2 + paddle.paddleWidth) / 2; //paddleの真ん中
let ballY = paddleY - BALL_RADIUS; //ゲーム開始時のY軸の位置
let xMove = 0; //X方向への移動量
let yMove = -5; //Y方向への移動量
//ボールのリスト作成後、インスタンスの追加
let balls = [];
createBall();
function createBall() {
    ballX = (paddle.paddleX * 2 + paddle.paddleWidth) / 2; //paddleの真ん中
    balls.push(new Ball(BALL_RADIUS, ballX, ballY, xMove, yMove));
}

//stageの作成
let stageCount = 1;
let stage = new Stage(stageCount, ctx, canvas);
let maxStage = 3;
let score = 0;
let lives = 5;
let intervalId;
let isPaused = false;

//bonusItemListの作成
let bonusList = [];

//ボタンが押されているかの変数
let rightPressed = false;
let leftPressed = false;
let isGo = false; //Enter押したかどうか

//音声ファイルのURL作成
let seHit = "../se/seHit.mp3";
//seを複数回鳴らすようの処理
function seHitPlay() {
    var audio = new Audio(seHit);
    audio.play();
}

//関数を走らせる
draw();

//イベントリスナー
//真ん中のkeyDownHandler,keyUpHandlerは関数名
//それぞれリスナーが反応したら実行する
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

//イベントハンドラーの関数
//引数(e)はイベントオブジェクト、イベントが発生したときにプロパティにその情報を保存している
//例えばどのキーが押されたか、キーコード、コードプロパティなど
//今回の関数ではkeyのプロパティを取得しています。
function keyDownHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = true;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = true;
    } else if (e.key === "Up" || e.key === "ArrowUp") {
        paddle.paddleBig();
    } else if (e.key === "Down" || e.key === "ArrowDown") {
        paddle.paddleSmall();
    } else if (e.key === " ") {
        isPaused = !isPaused;
        if (!isPaused) {
            draw();
        }
        // balls.forEach((element) => {
        //     element.ballBig();
        // });
    } else if (e.key === "1") {
        createBall();
    } else if (e.key === "Enter") {
        isGo = true;
    }
}

function keyUpHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = false;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = false;
    } else if (e.key === "Enter") {
        isGo = false;
    }
}

//描画処理
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); //描画のクリア
    collisionDetectionBrickBall(); //当たり判定のチェック
    balls.forEach((element) => {
        //ボールの当たり判定チェック
        element.collisionDetectionPaddleBall(paddle);
    });
    balls.forEach((element) => {
        //moveballを回す
        element.moveBall();
    });
    checkBallLive(); //ボールが画面外に行ったら配列から削除
    moveItems(ctx); //アイテムの移動
    bonusCheck(); //ボーナス獲得チェック
    paddle.drawPaddle(ctx, rightPressed, leftPressed); //paddleの描画
    stage.drawBricks(ctx); //stageの描画
    balls.forEach((element) => {
        //ballの描画
        element.drawBall(ctx);
    });
    drawItem(ctx); ///アイテムの描画
    checkBalls(); //ボールがまだあるかどうか、失敗フラグの管理
    drawScore(); //スコアの描画
    drawLives(); //ライフの描画
    pauseCheck(); //一時提唱状態か
    clearCheck(); //クリアフラグが立っているかどうか
}

//filter関数
//filterの後ろの関数を実行しtrueのものだけを再度balls配列に戻します。
function checkBallLive() {
    balls = balls.filter((ball) => {
        if (ball.ballY <= canvas.height) {
            return true;
        } else {
            return false;
        }
    });
}

//ボールが画面上に0個になったときの処理
function checkBalls() {
    if (balls.length == 0) {
        lives--;
        if (lives <= 0) {
            alert("GAME OVER");
            document.location.reload();
            lives = 5;
        } else {
            paddle.paddleX = (canvas.width - paddle.paddleWidth) / 2;
            //ボールを初期位置に移動したあと一時停止処理する
            //0ms後にsetTimeoutの第一引数の関数を実行する。
            //この処理をしないと失敗時の場所で停止してしまう。
            setTimeout(() => {
                createBall();
                isPaused = true;
            }, 0);
        }
    }
}

//ブロックの判定
function collisionDetectionBrickBall() {
    for (let i = 0; i < stage.stageBricks.length; i++) {
        for (let j = 0; j < stage.stageBricks[i].length; j++) {
            let tempBrick = stage.stageBricks[i][j];
            if (tempBrick.lives > 0) {
                balls.forEach((element) => {
                    //ボールの中心とブロックの各辺との距離を計算
                    //Math.absは絶対値を返す関数
                    //Math.sqrtで角距離が一番遠いときの距離を出しています。sqrtは平方根
                    let distX = Math.abs(element.ballX - tempBrick.brickX - stage.brickWidth / 2);
                    let distY = Math.abs(element.ballY - tempBrick.brickY - stage.brickHeight / 2);
                    let distXY = Math.sqrt(distX * distX + distY * distY);
                    if (
                        //条件式brickの周囲ball.radius分の四角形以内で、なおかつ最大の長さが角の距離の長さdistXY以下
                        element.ballY + element.radius > tempBrick.brickY &&
                        element.ballY - element.radius < tempBrick.brickY + stage.brickHeight &&
                        element.ballX + element.radius > tempBrick.brickX &&
                        element.ballX - element.radius < tempBrick.brickX + stage.brickWidth &&
                        distX < distXY &&
                        distY < distXY
                    ) {
                        if (distX > distY) {
                            // ボールがブロックの左右に衝突
                            element.ballTurnX = true;
                        } else {
                            // ボールがブロックの上下に衝突
                            element.ballTurnY = true;
                        }
                        tempBrick.lives--;
                        tempBrick.isHit = 5;
                        seHitPlay();
                        score++;
                        if (tempBrick.lives == 0) {
                            let num = Math.floor(Math.random() * 18) + 1;
                            if (num <= 6 && num >= 1) {
                                bonusList.push(
                                    new BounusItem(num, tempBrick.brickX, tempBrick.brickY)
                                );
                            }
                        }
                    }
                });
            }
        }
    }
}

//ボーナスアイテムの描画
function drawItem(ctx) {
    bonusList.forEach((element) => {
        element.drawBonusItem(ctx);
    });
}

//ボーナスアイテムの移動
function moveItems(ctx) {
    bonusList.forEach((element) => {
        element.moveBonusItem(ctx);
    });
}

//ボーナスアイテムの取得チェック
function bonusCheck() {
    bonusList = bonusList.filter((item) => {
        if (
            item.itemY + item.height >= paddle.paddleY &&
            item.itemX + item.width > paddle.paddleX &&
            item.itemX < paddle.paddleX + paddle.paddleWidth
        ) {
            if (item.getItem == item.paddleBig || item.getItem == item.paddleSmall) {
                item.getItem(paddle);
            } else {
                item.getItem(balls);
            }
            return false;
        } else if (item.itemY > canvas.height) {
            return false;
        } else {
            return true;
        }
    });
}

//スコアの描画
function drawScore() {
    ctx.font = "30px Impact";
    ctx.fillStyle = "orange";
    ctx.fillText(`Score: ${score}`, 8, 30);
}

//ライフの描画
function drawLives() {
    ctx.font = "30px Impact";
    ctx.fillStyle = "#0095DD";
    ctx.fillText(`Lives: ${lives}`, canvas.width - 95, 30);
}

//一時停止の描画
function drawPause() {
    let text = "Pause";
    ctx.font = "48px Impact";
    ctx.fillStyle = "black";
    let textWidth = ctx.measureText(text).width; //テキストの幅の取得
    let x = (canvas.width - textWidth) / 2; //テキストの開始位置
    let y = canvas.height / 2; //テキストの開始位置
    ctx.strokeStyle = "silver"; // 縁取りの色を指定
    ctx.lineWidth = 3; // 縁取りの幅を指定
    ctx.strokeText(text, x, y); // 縁取りを描画
    ctx.fillText(text, x, y);
    let text2 = "Press space to start";
    ctx.font = "24px Impact";
    ctx.fillStyle = "black";
    ctx.strokeStyle = "silver"; // 縁取りの色を指定
    ctx.lineWidth = 3; // 縁取りの幅を指定
    let textWidth2 = ctx.measureText(text2).width; //テキストの幅の取得
    let x2 = (canvas.width - textWidth2) / 2; //テキストの開始位置
    let y2 = canvas.height / 2 + 60; //テキストの開始位置
    ctx.strokeText(text2, x2, y2); // 縁取りを描画
    ctx.fillText(text2, x2, y2);
}

//一時提唱状態かどうかのチェック
function pauseCheck() {
    if (!isPaused) {
        // ゲームがポーズ状態でなければ次のフレームを描画
        clearInterval(intervalId); //一旦描画を止めてから
        intervalId = setInterval(draw, 1000 / 60); // 60FPSで描画 1000msの60分の1です。
    } else {
        drawPause(); //ポーズ中の表記を出してから
        clearInterval(intervalId); // 描画を停止
    }
}

//クリアフラグが立ったかどうかのチェック
async function clearCheck() {
    if (stage.isClear == true) {
        clearResult();
        stageCount++;
        if (stageCount > maxStage) {
            stageCount = maxStage;
        }
        clearInterval(intervalId); // 描画を停止
        await waitForIsGo(); //isGoがtrueになるまで待つ
        intervalId = setInterval(draw, 1000 / 60); // 60FPSで描画 1000msの60分の1です。
        ctx.clearRect(0, 0, canvas.width, canvas.height); //描画のクリア
        stage = new Stage(stageCount, ctx, canvas);
        stage.isClear = false;
        balls.length = 0; //nullだと消えない！ﾅﾝﾃﾞｪ！
        bonusList.length = 0;
        paddle.paddleWidth = 120;
        paddle.paddleX = (canvas.width - paddle.paddleWidth) / 2; //パドルの開始位置
        setTimeout(() => {
            createBall();
            draw();
        }, 0);
    }
}

function waitForIsGo() {
    return new Promise((resolve) => {
        const checkInterval = setInterval(() => {
            //setInterval関数 if文以下を100msごとにチェック
            if (isGo) {
                clearInterval(checkInterval); //CheckIntervalのタイマーを停止
                resolve(); //promiseを成功状態にします。
            }
        }, 100); //100ミリ秒ごとにisGoをチェック
    });
}
//クリア結果表示
function clearResult() {
    ctx.font = "70px Impact";
    ctx.fillStyle = "orange";
    let text1 = "Congratulations!!";
    let textWidth = ctx.measureText(text1).width; //テキストの幅の取得
    let x = (canvas.width - textWidth) / 2; //テキストの開始位置
    let y = canvas.height / 2; //テキストの開始位置
    ctx.fillText(text1, x, y);
    let text2 = `Score: ${score}`;
    let textWidth2 = ctx.measureText(text2).width; //テキストの幅の取得
    let x2 = (canvas.width - textWidth2) / 2; //テキストの開始位置
    let y2 = canvas.height / 2; //テキストの開始位置
    ctx.fillText(text2, x2, y2 - 70);
    if (stageCount < maxStage) {
        ctx.font = "50px Impact";
        ctx.fillStyle = "red";
        let text3 = "press Enter to Next Stage";
        let textWidth3 = ctx.measureText(text3).width; //テキストの幅の取得
        let x3 = (canvas.width - textWidth3) / 2; //テキストの開始位置
        let y3 = canvas.height / 2; //テキストの開始位置
        ctx.fillText(text3, x3, y3 + 170);
    }
}

// requestAnimationFrame(draw);
//requestAnimationFrameはブラウザの描画タイミングと一致して描画するため綺麗に見えるが、
//その描画タイミングはブラウザのリソースの割当に依存してしまう。
//フルスクリーンとウィンドウで速度が変わるのはそのため
//setInterval()やsetTimeout()は一定間隔で描画を行うが
//逆にブラウザの描画タイミングと一致しないためスムーズなアニメーションに見えない場合がある。
