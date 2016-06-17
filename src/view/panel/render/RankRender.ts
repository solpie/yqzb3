import {loadImgArr} from "../../../utils/JsFunc";
import {ViewConst} from "../../../event/Const";
import {ActivityPanelView} from "../act/ActivityPanelView";
import {PlayerInfo} from "../../../model/PlayerInfo";
import Container = createjs.Container;
export class RankRender {
    ctn:Container;
    stageWidth:number = ViewConst.STAGE_WIDTH;
    stageHeight:number = ViewConst.STAGE_HEIGHT;

    constructor(parant:ActivityPanelView) {
        this.ctn = new Container();
        parant.stage.addChild(this.ctn);
    }

    fadeInRank(playerDocArr, pageNum = 0) {
        this.ctn.removeAllChildren();
        this.ctn.alpha = 0;

        var modal = new createjs.Shape();
        modal.alpha = .8;
        modal.graphics.beginFill("#000").drawRect(0, 0, this.stageWidth, this.stageHeight);
        this.ctn.addChild(modal);

        var title = new createjs.Bitmap('/img/panel/act/rankTitle.png');
        title.x = (this.stageWidth - 1200) * .5;
        title.y = 20;
        this.ctn.addChild(title);

        var imgArr = [];
        for (var i = 0; i < 10; i++) {
            var playerData = playerDocArr[i];
            if (!playerData)break;
            imgArr.push(playerData.avatar);
        }

        loadImgArr(imgArr, ()=> {
            for (var i = 0; i < 10; i++) {
                var playerData = playerDocArr[i];
                if (!playerData)break;
                imgArr.push(playerData.avatar);

                var item = new createjs.Bitmap('/img/panel/act/rankItem.png');
                item.x = title.x;
                item.y = title.y + i * 95 + 105;
                this.ctn.addChild(item);

                var avatar = new createjs.Bitmap(playerData.avatar);
                avatar.x = item.x + 10;
                avatar.y = item.y + 10;
                var scale = 70 / avatar.getBounds().height;
                avatar.scaleX = avatar.scaleY = scale;
                this.ctn.addChild(avatar);

                var nameLabel = new createjs.Text(playerData.name, "28px Arial", "#fff");
                nameLabel.textAlign = 'center';
                nameLabel.x = item.x + 300;
                nameLabel.y = item.y + 30;
                this.ctn.addChild(nameLabel);

                var gameCount = new createjs.Text(playerData.gameCount, "28px Arial", "#fff");
                gameCount.textAlign = 'center';
                gameCount.x = item.x + 495;
                gameCount.y = nameLabel.y;
                this.ctn.addChild(gameCount);

                var winPercent = new createjs.Text(((playerData.winpercent || 0) * 100).toFixed(2) + "%", "28px Arial", "#fff");
                winPercent.textAlign = 'center';
                winPercent.x = item.x + 710;
                winPercent.y = nameLabel.y;
                this.ctn.addChild(winPercent);

                var eloText = '新秀';
                if (PlayerInfo.gameCount(playerData) >= 3)
                    eloText = playerData.eloScore;
                var eloScore = new createjs.Text(eloText, "28px Arial", "#fff");
                eloScore.textAlign = 'center';
                eloScore.x = item.x + 900;
                eloScore.y = nameLabel.y;
                this.ctn.addChild(eloScore);

                var rankPos = new createjs.Text((pageNum * 10 + i + 1).toString(), "28px Arial", "#fff");
                rankPos.textAlign = 'center';
                rankPos.x = item.x + 1100;
                rankPos.y = nameLabel.y;
                this.ctn.addChild(rankPos);
            }

        });

        createjs.Tween.get(this.ctn)
            .to({alpha: 1}, 300);

        if (10 < playerDocArr.length) {
            var nextPage = [];
            for (var i = 10; i < playerDocArr.length; i++) {
                var playerData = playerDocArr[i];
                nextPage.push(playerData);
            }
            createjs.Tween.get(this).wait(10000).call(()=> {
                this.fadeInRank(nextPage, pageNum + 1);
            });
        }
    }

    fadeOut() {
        createjs.Tween.get(this.ctn)
            .to({alpha: 0}, 300).call(
            ()=> {
                this.ctn.removeAllChildren();
            }
        );
    }

    fadeOutRank() {


    }

}