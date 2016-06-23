import {ScreenView} from "./ScreenView";
import Container = createjs.Container;
import BitmapText = createjs.BitmapText;
export class BigScorePanel {
    ctn:Container;
    leftFoulText:BitmapText;
    rightFoulText:BitmapText;
    leftScoreText:BitmapText;
    rightScoreText:BitmapText;

    constructor(parent:ScreenView) {
        var bigScoreCtn = new createjs.Container();
        parent.stage.addChild(bigScoreCtn);
        this.ctn = bigScoreCtn;


        //////////////////
        var bg = new createjs.Bitmap('/img/panel/screen/score/bg.jpg');
        bigScoreCtn.addChild(bg);

        var sheet = new createjs.SpriteSheet({
            animations: {
                "0": 0, "1": 1, "2": 2, "3": 3, "4": 4,
                "5": 5, "6": 6, "7": 7, "8": 8, "9": 9
            },
            images: ["/img/panel/screen/score/scoreNum.png"],
            frames: [
                [0, 0, 315, 435],
                [316, 0, 315, 435],
                [0, 436, 315, 435],
                [316, 436, 315, 435],
                [632, 0, 315, 435],
                [632, 436, 315, 435],
                [948, 0, 315, 435],
                [948, 436, 315, 435],
                [0, 872, 315, 435],
                [316, 872, 315, 435]
            ]
        });

        var leftScoreText = new createjs.BitmapText("7", sheet);
        leftScoreText.x = 260;
        leftScoreText.y = 210;
        this.leftScoreText = leftScoreText;
        bigScoreCtn.addChild(leftScoreText);

        var rightScoreText = new createjs.BitmapText("7", sheet);
        rightScoreText.x = 1380;
        rightScoreText.y = leftScoreText.y;
        this.rightScoreText = rightScoreText;
        bigScoreCtn.addChild(rightScoreText);


        var foulSheet = new createjs.SpriteSheet({
            animations: {
                "0": 0, "1": 1, "2": 2, "3": 3, "4": 4,
                "5": 5, "6": 6, "7": 7, "8": 8, "9": 9, "x": 10
            },
            images: ["/img/panel/screen/score/foulNum.png"],
            frames: [
                [166, 0, 165, 255],
                [332, 256, 165, 255],
                [332, 0, 165, 255],
                [0, 256, 165, 255],
                [166, 256, 165, 255],
                [0, 0, 165, 255],
                [498, 0, 165, 255],
                [498, 256, 165, 255],
                [0, 512, 165, 255],
                [166, 512, 165, 255],
                [332, 512, 165, 255]
            ]
        });
        var leftFoulText = new createjs.BitmapText("x", foulSheet);
        leftFoulText.x = 750;
        leftFoulText.y = 130;
        this.leftFoulText = leftFoulText;
        bigScoreCtn.addChild(leftFoulText);

        var rightFoulText = new createjs.BitmapText("1", foulSheet);
        rightFoulText.x = 1050;
        rightFoulText.y = leftFoulText.y;
        this.rightFoulText = rightFoulText;
        bigScoreCtn.addChild(rightFoulText);
    }

    setLeftScore(leftScore:number) {
        this.leftScoreText.text = `${leftScore}`;
    }

    setRightScore(rightScore:number) {
        this.rightScoreText.text = `${rightScore}`;
    }

    setLeftFoulNum(foulNum:number) {
        this.leftFoulText.text = `${foulNum}`;
    }

    setRightFoulNum(foulNum:number) {
        this.rightFoulText.text = `${foulNum}`;
    }
}


// [0,0,315,435]
// [316,0,315,435]
// [0,436,315,435]
// [316,436,315,435]
// [632,0,315,435]
// [632,436,315,435]
// [948,0,315,435]
// [948,436,315,435]
// [0,872,315,435]
// [316,872,315,435]

