import Component from "vue-class-component";

export interface Rank extends vuejs.Vue {
}
@Component({
    template: require('./rank.html')
})
export class Rank {
    links:{ title:string; url:string }[];
    data():any {
        return {
            playerDataArr: []
        };
    }
}
