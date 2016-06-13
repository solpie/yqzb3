import Component from "vue-class-component";

export interface Home extends vuejs.Vue {
}
@Component({
    template: require('./home.html')
})
export class Home {
    links:{ title:string; url:string }[];

    data():any {
        return {
            links: [
                {title: "activity op", url: "/panel/#!/act/op"},
                {title: "stage op", url: "/panel/#!/stage/op"},
                {title: "player op", url: "/panel/#!/player/op"}
            ]
        };
    }
}
