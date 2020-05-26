import Component from "./Component";
import Global from '../../global'


export default class ImgContainer extends Component {
    constructor(data) {
        super(data);
      
    }
  
    parseOpts() {
        this.defaults = {
            margin_left: 10,
            margin_right: 5,
            img_splice: 5,
            margin_top: 5,
            margin_bottom: 5
        }
        this.opts = $.extend(true, this.defaults, this.data);
        this.$dom = $('<div style = "padding-top:' + this.opts.margin_top + 'px;padding-bottom:' + this.opts.margin_bottom + 'px" class = "img-container"><div class = "content-clear"></div></div>')
        this.retainedWidth = Global.getContainerWidth();
        this.height = 0;
        this.curBegin = this.opts.margin_left;
        this.arr_img = [];
    }
    testAdd(img) {

        if (!this.arr_img.length)//--第一张直接放
            return true;
        else {
            return this.retainedWidth > (img._width + this.opts.img_splice + this.opts.margin_left);
        }

    }
    add(img) {

        img.$dom.insertBefore(this.$dom.find("div.content-clear"));

        if (!this.arr_img.length)//--第一个图距左边的距离
        {
            img.$dom.css('margin-left', this.opts.margin_left);
            this.retainedWidth = this.retainedWidth - img._width - this.opts.margin_left;
        }

        else {
            img.$dom.css('margin-left', this.opts.img_splice + this.opts.margin_left);//--每个图间隔
            this.retainedWidth = this.retainedWidth - img._width - this.opts.margin_left - this.opts.img_splice;
        }


        this.arr_img.push(img);
        this.height = Math.max.apply({}, this.arr_img.map(function (img) {
            return img._height;
        })) + this.opts.margin_top + this.opts.margin_bottom
    }

};
