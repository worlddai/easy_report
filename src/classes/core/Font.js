import Component from "./Component";
import FontEnum from '../../enum/font_enum'
import { GetLength, splitstring,cutstr} from '../../util/string_util'
import Global from '../../global'

export default class Font extends Component {
    constructor(pid,data) {
        super(pid,data);
    }
    parseOpts() {
        this.defaults = {
            indent: true,//--顶部不空格
            margintop: 10,
            marginbuttom: 0,
            marginleft: 20,
            width: Global.getContainerWidth(this.pid)
        }
        this.opts = $.extend(true, this.defaults, this.data);
        this.mode = this.opts.indent ? FontEnum.INDENT : FontEnum.NORMAL;
        this.linesize = null;
        this.lineheight = null;
    }
    static unprepare(container,pid)
    {
        $(`#test-font-${pid}`).remove();
        $(`#test-font-indent-${pid}`).remove();
    }
    static prepare(container,pid) {
        $(`<div style="position: absolute;visibility: hidden;" id="test-font-${pid}" class="text-container"></div>`).appendTo(container);
        $(`<div style="position: absolute;visibility: hidden;" id="test-font-indent-${pid}" class="text-container indent"></div>`).appendTo(container);
    }
    //--计算一行容纳的字节数
    static cacuLineSize(pid) {

        var curTestStr = "a";
        var orgHeight = Font.cacuFontHeight(curTestStr,pid, 0);
        var curHeight = orgHeight;
        var nSize = 1;
        while (curHeight == orgHeight) {

            curHeight = Font.cacuFontHeight(curTestStr += "a",pid, 0)
            nSize++;
        }
        return nSize;
    }
    //--计算一行的高度
    static caculineHeight(pid) {
        $(`#test-font-${pid}`).text("我");
        return $(`#test-font-${pid}`).height();
    }
    static getContainer(pid,mode) {
        var $container;
        switch (mode) {
            case FontEnum.NORMAL:
                $container = $(`#test-font-${pid}`);
                break;
            case FontEnum.INDENT:
                $container = $(`#test-font-indent-${pid}`);
                break;
        }
        return $container;
    }
    //--计算容器的高度
    static cacuFontHeight(str,pid, mode) {
        var $container = Font.getContainer(pid,mode);

        $container.get(0).innerHTML = str;

        return $container.height();
    }
    static setTestWidth(pid,width) {
        $(`#test-font-${pid}`).width(width);
        $(`#test-font-indent-${pid}`).width(width);
    }
    //--补充字符串直到填充满一行
    static getbalanceStr(pid,part1, part2, mode) {
        var $container = Font.getContainer(pid,mode);

        $container.get(0).innerHTML = part1;
        var orgHeight = $container.height();
        var testPart = part1;
        var totolOffset = 0;
        for (var i = 0; i < part2.length; i++) {
            testPart = testPart + part2.charAt(i);
            $container.get(0).innerHTML = testPart;
            if (orgHeight != $container.height()) {
                totolOffset = i;
                break;
            }
        }
        return testPart.substr(0, testPart.length - 1)
    }
    //--截取总字符串
    static cutString(pid,pes, str, nMode, linesize) {

        var totalWord = GetLength(str);

        var nLinedRemain = Math.floor(totalWord * pes / linesize) - 1;

        var sublen = nLinedRemain * linesize;

        var first_cut_str = cutstr(str, sublen);

        var first_remained_str = splitstring(str, first_cut_str);

        var second_cut_str = Font.getbalanceStr(pid,first_cut_str, first_remained_str, nMode);

        return {
            subed: second_cut_str,
            remained: splitstring(str, second_cut_str)
        }
    }
    getLineSize() {
        if (!this.linesize) {
            this.linesize = Font.cacuLineSize(this.pid);
        }
        return this.linesize;
    }
    getLineHeight() {
        if (!this.lineheight) {
            this.lineheight = Font.caculineHeight(this.pid,this.opts.width);
        }
        return this.lineheight;
    }
    getHeight() {
        var org_height = Font.cacuFontHeight(this.data.value,this.pid,this.mode);
        return org_height + this.opts.margintop + this.opts.marginbuttom;
    }
    //--获取不包含margin和padding的实际高度
    getFontHeight() {
        return Font.cacuFontHeight(this.data.value, this.pid,this.mode);
    }
    getExtraHeight() {
        return this.opts.margintop + this.opts.marginbuttom;
    }
    onInit() {
        Font.setTestWidth(this.pid,this.opts.width-this.opts.marginleft);
        var createClass = this.mode == FontEnum.INDENT ? "indent" : "";
        this.$dom = $('<div style = "width:' + (this.opts.width-this.opts.marginleft) + 'px;margin-left:'+this.opts.marginleft+'px;margin-bottom:' + this.opts.marginbuttom + 'px;margin-top:' + this.opts.margintop + 'px;" class = "text-container ' + createClass + '">' + this.opts.value + '</div>');
    }


};
