import {ActivityPanelView} from "./ActivityPanelView";
import {loadImg} from "../../../utils/JsFunc";
import Container = createjs.Container;
import Shape = createjs.Shape;
export class NoticePanel {
    ctn:Container;
    contentCtn:Container;
    parent:Container;
    mask:Shape;
    isInit:boolean;
    noticeImg:any;

    constructor(parent:ActivityPanelView) {
        this.parent = parent.ctn;
    }

    initPanel() {
        this.ctn = new createjs.Container();
        var bg = new createjs.Bitmap('/img/panel/act/noticeBg.png');
        this.ctn.addChild(bg);

        // this.noticeLabel = new createjs.Text("手动风尚大奖哦手动风尚大奖哦手动风尚大奖哦手动风尚大奖哦手动风尚大奖哦手动风尚大奖哦手动风尚大奖哦手动风尚大奖哦手动风尚大奖哦手动风尚大奖哦手动风尚大奖哦手动风尚大奖哦手动风尚大奖哦手动风尚大奖哦手动风尚大奖哦手动风尚大奖哦手动风尚大奖哦手动风尚大奖哦手动风尚大奖哦", "28px Arial", "#e2e2e2");
        // this.ctn.addChild(this.noticeLabel);
        this.contentCtn = new createjs.Container();
        this.contentCtn.x = 72;
        this.contentCtn.y = 26;
        this.ctn.addChild(this.contentCtn);
        this.mask = new createjs.Shape();
        this.mask.graphics.beginFill("#eee")
            .drawRect(0, 0, 930, 50);
        // this.ctn.addChild(mask);
        // this.contentCtn.addChild(mask);
        // this.noticeLabel.mask = mask;
        this.parent.addChild(this.ctn);
        this.isInit = true;
    }

    loadNoticeImg(imgData) {
        if (this.noticeImg) {
            this.contentCtn.removeChild(this.noticeImg);
        }
        this.noticeImg = new createjs.Bitmap(imgData);
        this.noticeImg.mask = this.mask;
        this.contentCtn.addChild(this.noticeImg);
        return this.noticeImg;
    }

    fadeInNoticePanel(imgData) {
        if (!this.isInit)
            this.initPanel();

        var ctn = this.ctn;
        ctn.x = (1920 - 1070) * .5;
        ctn.y = 1080 - 130;
        ctn.alpha = 0;
        loadImg(imgData, ()=> {
            var noticeImg = this.loadNoticeImg(imgData);
            noticeImg.x = 800;
            var noticeImgWidth = noticeImg.getBounds().width;
            var showSec = noticeImgWidth / 100 * 1000;


            createjs.Tween.get(ctn)
                .to({alpha: 1}, 200)
                .call(() => {
                    createjs.Tween.get(noticeImg)
                        .to({x: -noticeImgWidth}, showSec)
                        .call(()=> {
                            createjs.Tween.get(ctn)
                                .wait(500)
                                .to({alpha: 0}, 200)
                        });
                });
        });

    }

    fadeOut() {
        createjs.Tween.get(this.ctn)
            .to({alpha: 0}, 200)
    }
}