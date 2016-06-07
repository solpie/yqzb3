import Vue = require('vue');
import Component from "vue-class-component";

@Component({
    template: require('./search.html')
})
export class Search extends Vue {
    links:{ title:string; url:string }[];

    data():any {
        return {
            playerDataArr: []
        };
    }
}
