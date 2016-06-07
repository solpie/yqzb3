import Component from "vue-class-component";
import {VueEx} from "../../../VueEx";
declare var Cropper;

@Component({
    template: require('./profile.html'),
    props: {
        name: {
            type: String,
            required: true,
            default: ''
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
    showFile(e){
        var fr = new FileReader();
        var image = document.getElementById('image');
        console.log("showFile", e.target.files[0]);
        fr.readAsDataURL(e.target.files[0]);
        fr.onload = (e)=> {
//            document.getElementById("playerAvatar").src = e.target.result;
            ///init
            this.imagePath = (e.target as any).result;
            (image as any).src = this.imagePath;

            // stage = initCanvas(imagePath, 1);

            var cropper = new Cropper(image, {
                aspectRatio: 180 / 76,
                crop: function (e) {
                    console.log(e.detail.x);
                    console.log(e.detail.y);
                    console.log(e.detail.width);
                    console.log(e.detail.height);
//            console.log(e.detail.rotate);
//            console.log(e.detail.scaleX);
//            console.log(e.detail.scaleY);
//                     onUpdateCropPreview(e.detail);
                }
            });
        };
    }
}
