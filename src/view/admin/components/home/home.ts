import Component from "vue-class-component";

export interface OpLinks extends vuejs.Vue {
}
@Component({
    template: require('./home.html')
})
export class OpLinks {
    links:{ title:string; url:string }[];

    data():any {
        return {
            links: [
                {title: "activity op", url: "/panel/#!/act/op"},
                {title: "stage op", url: "/panel/#!/stage/op"},
                {title: "stage op mobile", url: "/m/#!/panel/stage/op"},
                {title: "player op", url: "/panel/#!/player/op"}
            ]
        };
    }
}
