
export default class Component {
    constructor(pid,data) {
        this.pid = pid;
        this.data = data;
        this.$dom = null;
        this.parseOpts();
        this.onInit();
    }
    onInit() {
    }
    parseOpts() {

    }
    getDom() {
        return this.$dom;
    }



};
