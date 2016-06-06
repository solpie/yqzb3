import Component from "vue-class-component";
import {Modal} from "../modal/modal";
import {storageKey} from "../../constants";
import Vue = require('vue');

@Component({
    template: require('./player.html'),
    components: {Modal},
    route: {
        data(transition:vuejs.Transition<any, any, any, any, any>) {
            const date = new Date();
            const messages:any[] = JSON.parse(localStorage.getItem(storageKey)) || []
            transition.next({
                year: date.getFullYear(),
                month: date.getMonth() + 1,
                date: date.getDate(),
                messages: messages
            })
        }
    }
})
export class Player extends Vue{
    year:number;
    month:number;
    date:number;
    message:string;
    messages:{ date:string; text:string }[];
    isOpen:boolean;

    ready() {
        console.log('player Ready!!');
        this.$http.post('/db/player', {all: true}).then(function (res) {
            console.log(JSON.stringify(res));
        });
    }

    data():any {
        return {
            year: 2015,
            month: 12,
            date: 4,
            message: "",
            messages: [],
            isOpen: false
        };
    }

    get today():string {
        return `${this.year}/${this.month}/${this.date}`;
    }

    get isToday():boolean {
        return this.month === 12 && this.date === 4;
    }

    open() {
        this.message = "";
        this.isOpen = true;
    }

    close() {
        this.isOpen = false;
    }

    save() {
        const date = new Date();
        this.messages.push({
            date: `${date.getHours()}時${date.getMinutes()}分${date.getSeconds()}秒`,
            text: this.message
        });
        this.store();
        this.close();
    }

    store() {
        setTimeout(() => {
            localStorage.setItem(storageKey, JSON.stringify(this.messages));
        }, 0);
    }

    remove(item:{ date:string, text:string }) {
        this.messages.$remove(item);
        this.store();
    }
}
