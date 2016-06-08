import Component from "vue-class-component";
import {VueEx} from "../../../VueEx";
import {getStagePlayerCard} from "../../../panel/PlayerRender";
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
    stage:any;
    //props
    eloScore:number;
    name:number;
    style:number;
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
        // leftAvatarBmp.x = -cropData.x / scale;
        // leftAvatarBmp.y = -cropData.y / scale;
        // leftAvatarBmp.scaleX = leftAvatarBmp.scaleY = 1 / scale;
        //
        // rightAvatarBmp.x = -cropData.x / scale;
        // rightAvatarBmp.y = -cropData.y / scale;
        // rightAvatarBmp.scaleX = rightAvatarBmp.scaleY = 1 / scale;
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
        stage.addChild(getStagePlayerCard(playerInfo, scale));
        var rightAvatarCtn = getStagePlayerCard(playerInfo, scale, false);
        rightAvatarCtn.x = 250;
        stage.addChild(rightAvatarCtn);
        return stage;
    }
}
