import {VueEx} from "../VueEx";
export class BasePanelView extends VueEx {
    op:boolean;

    ready() {
        var panel:any = this.$parent;
        this.op = panel.isOp;
        console.log("BasePanelView.ready", panel.isOp);
        return panel.connect();
    }
}