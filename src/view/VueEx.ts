import Vue = require('vue');
export class VueEx extends Vue {
    getAttr(e, propName) {
        var str:string = e.target.attributes[propName];
        var a = str.split('=');
        if (a.length === 2) {
            return a[1];
        }
        return null;
    }
}