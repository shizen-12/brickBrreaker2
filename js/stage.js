import { Brick } from "./brick.js";
import { Stage1 } from "./stage1.js";
import { Stage2 } from "./stage2.js";
import { Stage3 } from "./stage3.js";

export class Stage {
    color1;
    color2;
    color3;
    color4;
    color5;

    brickArray;
    imgPath;
    isClear = false;
    brickWidth = 32;
    brickHeight = 32;
    brickPadding = 2;
    brickOffsetTop = 40;
    brickOffsetLeft = 52;

    //16*16で中身がnullの2次元配列
    stageBricks = Array(16)
        .fill()
        .map(() => Array(16).fill(null));

    constructor(stageSelect, ctx, canvas) {
        let stageNum;
        switch (stageSelect) {
            case 1:
                stageNum = new Stage1();
                this.imgPath = 'url("../img/back1.jpg")';
                break;
            case 2:
                stageNum = new Stage2();
                this.imgPath = 'url("../img/back2.jpg")';
                break;
            case 3:
                stageNum = new Stage3();
                this.imgPath = 'url("../img//back3.jpg")';
                break;
        }
        this.color1 = stageNum.color1;
        this.color2 = stageNum.color2;
        this.color3 = stageNum.color3;
        this.color4 = stageNum.color4;
        this.color5 = stageNum.color5;
        this.brickArray = stageNum.brickArray;
        this.brickGenerate();
        let element = document.getElementById("canvas");
        element.style.backgroundImage = this.imgPath;
        element.style.backgroundSize = "cover";
    }

    //brickの生成、そして配列へ収める。
    brickGenerate() {
        for (let i = 0; i < this.stageBricks.length; i++) {
            for (let j = 0; j < this.stageBricks[i].length; j++) {
                this.stageBricks[i][j] = new Brick(this.brickArray[i][j]);
            }
        }
    }

    drawBricks(ctx) {
        //配列brickArrayに基づいてbrickを描画する
        for (let i = 0; i < this.brickArray.length; i++) {
            for (let j = 0; j < this.brickArray[i].length; j++) {
                if (this.stageBricks[i][j].lives > 0) {
                    const brickX = j * (this.brickWidth + this.brickPadding) + this.brickOffsetLeft;
                    const brickY = i * (this.brickHeight + this.brickPadding) + this.brickOffsetTop;
                    this.stageBricks[i][j].brickX = brickX;
                    this.stageBricks[i][j].brickY = brickY;
                    ctx.beginPath();
                    ctx.rect(brickX, brickY, this.brickWidth, this.brickHeight);
                    let color;
                    switch (this.brickArray[i][j]) {
                        case 1:
                            color = this.color1;
                            break;
                        case 2:
                            color = this.color2;
                            break;
                        case 3:
                            color = this.color3;
                            break;
                        case 4:
                            color = this.color4;
                            break;
                        case 5:
                            color = this.color5;
                            break;
                        default:
                            color = "white";
                    }
                    if (this.stageBricks[i][j].isHit > 0) {
                        color = "white";
                    }
                    ctx.fillStyle = color;
                    ctx.fill();
                    ctx.closePath();
                }
                this.stageBricks[i][j].isHit = 0;
            }
        }
        //livesが全部0か調べる
        let allZeroLives = true;
        for (let i = 0; i < this.stageBricks.length; i++) {
            for (let j = 0; j < this.stageBricks[i].length; j++) {
                if (this.stageBricks[i][j].lives > 0) {
                    allZeroLives = false;
                    break;
                }
            }
            if (allZeroLives == false) {
                break;
            }
        }
        if (allZeroLives) {
            this.isClear = true; //0ならクリアフラグ
        }
    }
}
