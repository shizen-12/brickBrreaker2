export class Paddle {
    paddleHeight;
    paddleWidth;
    paddleSpeed;
    paddleX;
    paddleY;
    constructor(canvas, paddleHeight, paddleWidth, paddleSpeed, paddleY) {
        this.paddleWidth = paddleWidth;
        this.paddleHeight = paddleHeight;
        this.paddleSpeed = paddleSpeed;
        this.paddleX = (canvas.width - this.paddleWidth) / 2; //パドルの開始位置
        this.paddleY = paddleY;
        // console.log("パドル作ったよ");
    }

    paddleBig() {
        this.paddleWidth += 30;
    }

    paddleSmall() {
        this.paddleWidth -= 10;
    }

    //パドルの描画
    drawPaddle(ctx, rightPressed, leftPressed) {
        // console.log("パドルの描画メソッド");
        ctx.beginPath();
        ctx.rect(this.paddleX, this.paddleY, this.paddleWidth, this.paddleHeight);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.strokeStyle = "blue";
        ctx.stroke();
        // strokeは縁取り
        ctx.closePath();
        //右か左が押されていたら変更する
        //右を押している間は壁までpaddleXはpaddleの一番左端の座標なのでpaddleWidthを使って調整
        if (rightPressed) {
            this.paddleX = Math.min(
                this.paddleX + this.paddleSpeed,
                canvas.width - this.paddleWidth
            );
        } else if (leftPressed) {
            this.paddleX = Math.max(this.paddleX - this.paddleSpeed, 0);
        }
    }
}
