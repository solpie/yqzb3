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
                {title: "screen ob", url: "/panel/#!/screen/ob"}
            ]
        };
    }
}
