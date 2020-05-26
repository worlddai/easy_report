import Component from "./Component";


export default class Img extends Component {
    constructor(data) {
        super(data);
    }
    parseOpts() {
        this.defaults = {
            url: "",
            msg: "图1",
            tipsHeight: 20,
            maxWidth: 700,
            maxHight: 700,
            onLoad: function () { }
        }
        this.opts = $.extend(true, this.defaults, this.data);
        this._bLoaded = false;
        this.$dom = $('<div class = "img_parent"></div>');
        this.$img = $('<img class = "_img" style = "visibility:hidden">').appendTo('body');
        this._width = 0;
        this._height = 0;
    }
    onInit() {
        this.$img.get(0).src = this.opts.url;
        setTimeout(() => {
            var nImgHeight = this.$img.height();
            var nImgWidth = this.$img.width();
            if (nImgHeight > this.opts.maxHeight || nImgWidth > this.opts.maxWidth) {
                this.DrawImage(this.$img.get(0));
            }
            nImgHeight = this.$img.height();
            nImgWidth = this.$img.width();

            this._width = nImgWidth;

            this._height = nImgHeight;

            if (this.opts.msg)
                this._height += this.opts.tipsHeight;


            this.$dom.width(nImgWidth);
            this.$img.css('visibility', 'inherit');
            this.$dom.append(this.$img);
            if (this.opts.msg)
                this.$dom.append($('<div style = "width:' + nImgWidth + 'px;height:' + this.opts.tipsHeight + 'px" class = "img-tips">' + this.opts.msg + '</div>'));
            this.opts.onLoad.call(this);

        }, 80)
    }
    DrawImage(ImgD) {
        //参数(图片,允许的宽度,允许的高度)          
        var image = new Image();
        var iwidth = this.opts.maxWidth;
        var iheight = this.opts.maxHight;
        image.src = ImgD.src;
        if (image.width > 0 && image.height > 0) {
            if (image.width / image.height >= iwidth / iheight) {
                if (image.width > iwidth) {
                    ImgD.width = iwidth;
                    ImgD.height = (image.height * iwidth) / image.width;
                } else {
                    ImgD.width = image.width;
                    ImgD.height = image.height;
                }
            } else {
                if (image.height > iheight) {
                    ImgD.height = iheight;
                    ImgD.width = (image.width * iheight) / image.height;
                } else {
                    ImgD.width = image.width;
                    ImgD.height = image.height;
                }
            }
        }
    }


};
