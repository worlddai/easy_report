import Component from "./Component";

export default class Title extends Component {
    constructor(pid,data) {
        super(pid,data);
    }
    static prepare(parent,pid)
    {
        $(`<div style="position: absolute;visibility: hidden;" class="er-title-container" id="er-test-title-${pid}"></div>`).appendTo(parent);
    }
    onInit() {
        this.$dom = $('<div class = "er-title-container">' + this.data.value + '</div>')
    }
    getHeight() {
        $(`#er-test-title-${this.pid}`).text(this.data.value);
        return $(`#er-test-title-${this.pid}`).height();
    }

};
