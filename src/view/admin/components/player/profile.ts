import Component from "vue-class-component";
import {VueEx} from "../../../VueEx";
import {StagePlayerCard} from "../../../panel/PlayerRender";
import {PlayerInfo} from "../../../../model/PlayerInfo";
import WatchOption = vuejs.WatchOption;
declare var Cropper;
var _this:Profile;
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
    },
    watch: {
        name: (val)=> {
            _this.bluePlayerCard.setName(val);
            _this.redPlayerCard.setName(val);
        },
        eloScore: (val)=> {
            _this.bluePlayerCard.setEloScore(val);
            _this.redPlayerCard.setEloScore(val);
        },
        style: (val)=> {
            _this.bluePlayerCard.setStyle(val);
            _this.redPlayerCard.setStyle(val);
        },
    }
})
export class Profile extends VueEx {
    imagePath:string;
    playerInfo:PlayerInfo;
    playerImgData:string;
    stage:any;
    bluePlayerCard:StagePlayerCard;
    redPlayerCard:StagePlayerCard;
    cropper:any;
    //props
    eloScore:number;
    name:string;
    realName:string;
    style:number;
    phone:number;
    weight:number;
    height:number;
    qq:number;

    ready() {
        _this = this;
    }

    onSubmitInfo() {
        // this.$parentMethods.onSubmit('sss');
        // var playerAvatar = document.getElementById('playerAvatar');
        this.playerImgData = this.cropper.getCroppedCanvas().toDataURL();
        console.log('onSubmitInfo', this.playerImgData);
        // document.getElementById('playerAvatarData').value = playerAvatar.src;
        $(".cropper-container").hide();
        // isChangeImage = true;
        var playerData:any = {};
        playerData.style = this.style;
        playerData.name = this.name;
        playerData.realName = this.realName;
        playerData.phone = this.phone;
        playerData.qq = this.qq;
        playerData.weight = this.weight;
        playerData.height = this.height;
        playerData.eloScore = this.eloScore;
        playerData.avatar = this.cropper.getCroppedCanvas().toDataURL();
        this.$http.post('/admin/player/add', {playerData:playerData}, function (res) {
            console.log(res);
        })
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

            this.cropper = new Cropper(image, {
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
        if (this.bluePlayerCard && this.bluePlayerCard.avatarBmp) {
            this.bluePlayerCard.avatarBmp.x = -cropData.x / scale;
            this.bluePlayerCard.avatarBmp.y = -cropData.y / scale;
            this.bluePlayerCard.avatarBmp.scaleX = this.bluePlayerCard.avatarBmp.scaleY = 1 / scale;

            this.redPlayerCard.avatarBmp.x = -cropData.x / scale;
            this.redPlayerCard.avatarBmp.y = -cropData.y / scale;
            this.redPlayerCard.avatarBmp.scaleX = this.redPlayerCard.avatarBmp.scaleY = 1 / scale;
        }
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
