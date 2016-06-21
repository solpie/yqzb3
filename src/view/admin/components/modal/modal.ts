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
        if (value)
            this.modaler.openModal();
        else
            this.modaler.closeModal();
    }

    get modaler():any {
        return $(this.$els.modaler)
    }
}
