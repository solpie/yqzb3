import Vue = require('vue');
import Component from "vue-class-component";

@Component({
    template: require('./rank.html')
})
export class Rank extends Vue {
    links:{ title:string; url:string }[];

    data():any {
        return {
            playerDataArr: []
        };
    }
}
