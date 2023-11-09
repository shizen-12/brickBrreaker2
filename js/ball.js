export class Ball {
    radius; //半径
    ballX;
    ballY;
    xMove; //X方向への移動量
    yMove; //Y方向への移動量
    ballTurnX = false; //X方向に反転するかどうか
    ballTurnY = false; //Y方向に反転するかどうか
    addAngleSpeed = 0; //4分の1の端なら反射をどの程度するかの数値
    speed; //スピード計算
    color = this.getRandomRainbowColor();
    // isPlusX = false;
    // isMinusX = false;

    constructor(BALL_RADIUS, ballX, ballY, xMove, yMove) {
        this.radius = BALL_RADIUS;
        this.ballX = ballX;
        this.ballY = ballY;
        this.xMove = xMove;
        this.yMove = yMove;
        this.speed = Math.sqrt(Math.abs(this.xMove) ** 2 + Math.abs(this.yMove) ** 2);
        //x軸とy軸の移動速度絶対値を出して三平方の定理でspeedを計算
    }

    //ボールの描画
    drawBall(ctx) {
        ctx.beginPath();
        //描画の始まりのメソッド
        ctx.arc(this.ballX, this.ballY, this.radius, 0, Math.PI * 2);
        //ctxにballXとballYの座標に描画している。BALL_RADIUSは半径、(0,Math.PI*2)は円弧の始点から最大まで、つまり全円を表示している
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
        //描画の終わりのメソッド
    }

    //ボールを動かす関数
    //ボールが反転状態か判断して移動
    moveBall() {
        //xが反転フラグ立ってたら反転、なければそのまま
        if (this.ballTurnX) {
            this.xMove = -this.xMove;
        }
        //yが反転フラグ立っていたら反転、なければそのまま
        if (this.ballTurnY) {
            this.yMove = -this.yMove;
        }
        //yMoveが全く動いていないならyMoveをマイナス方向(上方向)に1加算
        if (this.yMove <= 1 && this.yMove >= -1) {
            this.yMove--;
        }
        //実際の移動
        this.ballX += this.xMove;
        this.ballY += this.yMove;
        //フラグの削除
        this.ballTurnX = false;
        this.ballTurnY = false;
    }

    //ボールの色をランダムにする関数
    getRandomRainbowColor() {
        const hue = Math.floor(Math.random() * 360);
        return `hsl(${hue}, 100%, 50%)`;
    }

    //ボールの反射を管理する関数
    //もしボールのY軸の位置と移動量の合計が0（一番上）もしくはcanvas.height（一番下）なら移動量を反転させる。
    collisionDetectionPaddleBall(Paddle) {
        let topOver = this.ballY + this.yMove + this.radius >= Paddle.paddleY;
        let bottomOver =
            this.ballY + this.yMove - this.radius <= Paddle.paddleY + Paddle.paddleHeight;
        let leftOver = this.ballX + this.xMove + this.radius >= Paddle.paddleX;
        let rigthOver =
            this.ballX + this.xMove - this.radius <= Paddle.paddleX + Paddle.paddleWidth;
        let paddleQtr = Paddle.paddleWidth / 4;
        if (this.ballY + this.yMove < 0) {
            //天井の反転フラグ
            this.ballTurnY = true;
            this.color = this.getRandomRainbowColor();
        } else if (
            //壁の反転フラグ
            this.ballX + this.xMove < this.radius ||
            this.ballX + this.xMove > canvas.width - this.radius
        ) {
            //もしボールのX軸の位置と移動量の合計が0（一番左）もしくはcanvas.width（一番右）なら移動量を反転させる。
            this.ballTurnX = true;
            this.color = this.getRandomRainbowColor();
        } else if (
            //paddleY軸反転フラグ 上左右がパドルの内側、かつボールの移動先がパドルの底辺以上なら
            topOver &&
            bottomOver &&
            leftOver &&
            rigthOver
        ) {
            this.color = this.getRandomRainbowColor();
            if (this.ballY + this.radius - this.yMove < Paddle.paddleY) {
                this.ballTurnY = true;
                this.addAngleSpeed = 1 + this.xMove / 10;
                if (
                    //パドルの4分の1左ならx軸マイナスに補正
                    this.ballX + this.xMove <=
                    Paddle.paddleX + paddleQtr
                ) {
                    this.xMove -= this.addAngleSpeed;
                } else if (
                    //パドルの4分の1右ならx軸プラスに補正
                    this.ballX + this.xMove >=
                    Paddle.paddleX + Paddle.paddleWidth - paddleQtr
                ) {
                    this.xMove += this.addAngleSpeed;
                }
            } else {
                this.ballTurnX = true;
            }
        }
    }

    tripleBall(balls) {
        if (balls.length < 50) {
            let xM = Math.floor(Math.random() * 8) + 1;
            let yM = 8 - xM;
            balls.push(new Ball(this.radius, this.ballX, this.ballY, xM, yM));
            xM = Math.floor(Math.random() * 8) + 1;
            yM = 8 - xM;
            balls.push(new Ball(this.radius, this.ballX, this.ballY, xM, yM));
        }
    }

    ballSpeedUp() {
        this.xMove *= 1.3;
        this.yMove *= 1.3;
    }

    ballBig() {
        this.radius += 5;
    }
}
