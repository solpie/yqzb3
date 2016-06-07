import Vue = require('vue');
import Component from "vue-class-component";

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
export class Modal extends Vue{

    isOpen:boolean;

    title:string;

    $els:{
        modal:HTMLElement
    };

    onChange(value:boolean) {
        // ($(this.$els.modal) as any).modal(value ? 'show' : 'hide');
    }

    close() {
        this.isOpen = false;
    }
}
