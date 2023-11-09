export class BounusItem {
    height = 32;
    width = 32;
    itemX;
    itemY;
    speed = 4;
    getItem;
    img;
    constructor(number, brickX, brickY) {
        this.img = new Image();
        switch (number) {
            case 1:
                this.getItem = this.tripleBall;
                this.img.src = "../img/triple.jpg";
                break;
            case 2:
                this.getItem = this.paddleBig;
                this.img.src = "../img/big.png";
                break;
            case 3:
                this.getItem = this.paddleSmall;
                this.img.src = "../img/small.png";
                break;
            case 4:
                this.getItem = this.ballSpeedUp;
                this.img.src = "../img/speed.png";
                break;
            case 5:
                this.getItem = this.ballBig;
                this.img.src = "../img/bigball.png";
                break;
            case 6:
                this.getItem = this.ballTripleBig;
                this.img.src = "../img/bigthree.png";
        }
        this.itemX = brickX;
        this.itemY = brickY;
    }

    tripleBall(balls) {
        balls.forEach((element) => {
            element.tripleBall(balls);
        });
    }

    paddleBig(paddle) {
        paddle.paddleBig();
    }

    paddleSmall(paddle) {
        paddle.paddleSmall();
    }

    ballSpeedUp(balls) {
        balls.forEach((element) => {
            element.ballSpeedUp();
        });
    }

    ballBig(balls) {
        balls.forEach((element) => {
            element.ballBig();
        });
    }

    ballTripleBig(balls) {
        balls.forEach((element) => {
            element.ballBig();
            element.tripleBall(balls);
        });
    }

    //ボーナスアイテムの描画
    drawBonusItem(ctx) {
        ctx.beginPath();
        ctx.drawImage(this.img, this.itemX, this.itemY, this.width, this.height);
        // ctx.fillStyle = "pink";
        // ctx.fill();
        ctx.closePath();
    }

    //ボーナスアイテムの移動
    moveBonusItem(ctx) {
        this.itemY += this.speed;
    }
}
