import {VueEx, Component} from "../../../VueEx";

@Component({
    template: require('./modal.html'),
    props: {
        isOpen: {
            type: Boolean,
            default: false
        },
        title: {
            type: String,
            default: ""
        }
    },
    watch: {
        isOpen: 'onChange'
    }
})
export class Modaler extends VueEx {
    isOpen:boolean;
    title:string;
    $els:{
        modaler:HTMLElement
    };

    onChange(value:boolean) {
        ($(this.$els.modaler) as any).openModal(value ? 'show' : 'hide');
    }

    close() {
        this.isOpen = false;
    }
}
