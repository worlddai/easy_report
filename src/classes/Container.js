
export default class Container {
    constructor(parent,pid, width, height) {
        this.$dom = $(`<div style = "width:${width}px;height:${height}px" class = "er-container"></div>`).appendTo(parent);
        this.remainderHeight = height;
        this.tagheight = 0;
        this.pid = pid;
    }

    tryAdd(nHeight) {
        return this.remainderHeight > nHeight;
    }
    add(ele, nHeight) {
        this.$dom.append(ele);
        this.remainderHeight = this.remainderHeight - nHeight;
    }
    addHeightTag() {
        this.tagheight = this.remainderHeight;
    }
    restoreHeightTag() {
        this.remainderHeight = this.tagheight;
        this.tagheight = 0;
    }
    addHeight(h) {
        this.remainderHeight = this.remainderHeight - h;
    }
    destory()
    {
        $(this.$dom).remove();
        this.$dom = null;
    }
};
