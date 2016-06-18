import Container = createjs.Container;
import {ViewConst} from "../../../event/Const";
import {PlayerInfo} from "../../../model/PlayerInfo";
import {StagePlayerCard} from "./PlayerRender";
import {ActivityPanelView} from "../act/ActivityPanelView";
export class ActivityRender {
    ctn:Container;
    nextPageArr:any;
    pageNum:number;

    constructor(parent:ActivityPanelView) {
        this.pageNum = 0;
        this.ctn = parent.ctn;
    }

    fadeIn(gameDocArr, pageNum = 0) {
        this.ctn.removeAllChildren();
        this.ctn.alpha = 0;

        var modal = new createjs.Shape();
        modal.alpha = .8;
        modal.graphics.beginFill("#000").drawRect(0, 0, ViewConst.STAGE_WIDTH, ViewConst.STAGE_HEIGHT);
        this.ctn.addChild(modal);
        // if (len > 6)
        var len = gameDocArr.length;
        var fadeInCount = 0;

        function fadeSingle(ctn, toX, delay) {
            ctn.x = 1920;
            createjs.Tween.get(ctn)
                .wait(delay)
                .to({x: toX}, 200).call(function () {
                fadeInCount++;
            });
        }

        for (var i = 0; i < 6; i++) {
            if (!gameDocArr[i])
                break;
            var gameDoc = gameDocArr[i];
            var gameCtn = new createjs.Container();
            gameCtn.x = (ViewConst.STAGE_WIDTH - 1540) * .5;
            gameCtn.y = i * 169;
            var bg = new createjs.Bitmap('/img/panel/act/bg.png');
            gameCtn.addChild(bg);
            var leftScore = 0;
            var rightScore = 0;
            for (var j = 0; j < gameDoc.playerDocArr.length; j++) {
                var playerInfo = new PlayerInfo(gameDoc.playerDocArr[j]);
                playerInfo.isBlue = (j < 4);
                if (gameDoc.isFinish)
                    playerInfo.eloScore(gameDoc.playerRecArr[j].eloScore);
                var playerCtn = new StagePlayerCard(playerInfo, 1, playerInfo.isBlue);
                playerCtn.y = 50;
                var scoreText = StagePlayerCard.newScoreText();
                scoreText.y = 70;

                if (playerInfo.isBlue) {
                    scoreText.text = gameDoc.redScore + "";
                    scoreText.x = 830;
                    rightScore += playerInfo.eloScore();
                    // playerCtn = new StagePlayerCard(playerInfo, 1, playerInfo.isBlue);
                    playerCtn.x = 26 + j * 148;
                }
                else {
                    scoreText.text = gameDoc.blueScore + "";
                    scoreText.x = 685;
                    leftScore += playerInfo.eloScore();
                    playerCtn.x = 305 + j * 148;
                }
                gameCtn.addChild(scoreText);
                gameCtn.addChild(playerCtn);

            }

            var leftAvgElo = new createjs.Text(Math.floor(leftScore / 4) + "", "18px Arial", "#fff");
            leftAvgElo.textAlign = 'center';
            leftAvgElo.x = 686;
            leftAvgElo.y = 133;
            gameCtn.addChild(leftAvgElo);

            var rightAvgElo = new createjs.Text(Math.floor(rightScore / 4) + "", "18px Arial", "#fff");
            rightAvgElo.textAlign = 'center';
            rightAvgElo.x = 880;
            rightAvgElo.y = leftAvgElo.y;
            gameCtn.addChild(rightAvgElo);

            this.ctn.addChild(gameCtn);
            fadeSingle(gameCtn, gameCtn.x, i * 250);
        }

        createjs.Tween.get(this.ctn)
            .to({alpha: 1}, 300);

        if (gameDocArr.length > 6) {
            var nextPage = [];
            for (var i = 6; i < gameDocArr.length; i++) {
                var gameInfo = gameDocArr[i];
                nextPage.push(gameInfo);
            }
            this.nextPageArr = nextPage;
            this.pageNum++;

            // createjs.Tween.get(this).wait(5000).call(()=> {
            //     this.fadeIn(nextPage);
            // });
        }
        else {
            this.pageNum = 0;
            // createjs.Tween.get(this.ctn)
            //     .wait(5000).to({alpha: 0}, 300);
        }
    }

    nextPage() {
        this.fadeIn(this.nextPageArr, this.pageNum);
    }

    fadeOut() {
        createjs.Tween.get(this.ctn)
            .to({alpha: 0}, 300).call(
            ()=> {
                this.ctn.removeAllChildren();
            }
        );
    }
}