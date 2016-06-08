import Component from "vue-class-component";
import {VueEx} from "../../../VueEx";
import {StagePlayerCard} from "../../../panel/PlayerRender";
import {PlayerInfo} from "../../../../model/PlayerInfo";
declare var Cropper;

@Component({
    template: require('./profile.html'),
    props: {
        name: {
            type: String,
            required: true,
            default: '斯蒂芬库里'
        },
        realName: {
            type: String,
            default: ""
        },
        phone: {
            type: Number,
        },
        qq: {
            type: Number,
        },
        height: {
            type: Number,
            default: 178
        },
        weight: {
            type: Number,
            default: 70
        },
        eloScore: {
            type: Number,
            required: true,
            default: 2000
        },
        style: {
            type: Number,
            required: true,
            default: 1
        }
    }
})
export class Profile extends VueEx {
    imagePath:string;
    playerInfo:PlayerInfo;
    playerImgData:string;
    stage:any;
    bluePlayerCard:StagePlayerCard;
    redPlayerCard:StagePlayerCard;
    //props
    eloScore:number;
    name:number;
    style:number;

    ready() {
        super.ready();
        this.$parentMethods.onSubmit('sss')
    }

    showFile(e) {
        var fr = new FileReader();
        var image = document.getElementById('image');
        console.log("showFile", e.target.files[0]);
        fr.readAsDataURL(e.target.files[0]);
        fr.onload = (e)=> {
//            document.getElementById("playerAvatar").src = e.target.result;
            ///init
            this.imagePath = (e.target as any).result;
            (image as any).src = this.imagePath;

            this.stage = this.initCanvas(this.imagePath, 1);

            var cropper = new Cropper(image, {
                aspectRatio: 180 / 76,
                crop: (e) => {
                    // console.log(e.detail.x);
                    // console.log(e.detail.y);
                    // console.log(e.detail.width);
                    // console.log(e.detail.height);
//            console.log(e.detail.rotate);
//            console.log(e.detail.scaleX);
//            console.log(e.detail.scaleY);
                    this.onUpdateCropPreview(e.detail);
                }
            });
        };
    }

    onUpdateCropPreview(cropData:any) {
        var scale = cropData.width / 180;
        this.bluePlayerCard.avatarBmp.x = -cropData.x / scale;
        this.bluePlayerCard.avatarBmp.y = -cropData.y / scale;
        this.bluePlayerCard.avatarBmp.scaleX = this.bluePlayerCard.avatarBmp.scaleY = 1 / scale;

        this.redPlayerCard.avatarBmp.x = -cropData.x / scale;
        this.redPlayerCard.avatarBmp.y = -cropData.y / scale;
        this.redPlayerCard.avatarBmp.scaleX = this.redPlayerCard.avatarBmp.scaleY = 1 / scale;
    }

    initCanvas(imagePath, scale) {
        var stageWidth = 500;
        var stageHeight = 130;
        var canvas = document.getElementById("avatarPreview");
        canvas.setAttribute("width", stageWidth + "");
        canvas.setAttribute("height", stageHeight + "");
        var stage = new createjs.Stage(canvas);
        stage.autoClear = true;
        createjs.Ticker.framerate = 60;
        createjs.Ticker.addEventListener("tick", function () {
            stage.update();
        });
        var playerInfo = new PlayerInfo();
        playerInfo.name(this.name);
        playerInfo.avatar(imagePath);
        playerInfo.eloScore(this.eloScore);
        playerInfo.style(this.style);
        playerInfo.backNumber = 30;
        this.playerInfo = playerInfo;
        var bluePlayerCard = new StagePlayerCard(playerInfo, scale);
        this.bluePlayerCard = bluePlayerCard;
        var redPlayerCard = new StagePlayerCard(playerInfo, scale, false);
        this.redPlayerCard = redPlayerCard;
        stage.addChild(bluePlayerCard);
        redPlayerCard.x = 250;
        stage.addChild(redPlayerCard);
        return stage;
    }
}
