import Component from "./Component";
import Global from '../../global'
import CTable from './CTable'

export default class TR  {
    constructor(level, rowdata, opt) {
        // super(data);
        this.level = level;
        this.height = 0;
        this.rowdata = rowdata;
        this.parseOpts(opt);
    }
    parseOpts(opt) {
        this.defaults = {
            width: Global.getContainerWidth() - 20,
            colums: [0.4, 0.2, 0.3, 0.1]
        }
        this.opts= $.extend(true, this.defaults, opt);
    }
    testAdd() {
        if (this.rowdata.children) {
            var total = 0;
            this.rowdata.children.map(function (d) {
                var tr = new TR(this.level + 1, d, {
                    colums: this.opts.colums,
                    width: this.opts.width
                });
                total += tr.testAdd(d);

            }, this)
            var myheight = this.testTDHeight(this.rowdata, this.level);
            this.height = Math.max(total, myheight);

        } else {
            this.height = this.testTDHeight(this.rowdata, this.level);

        }
        return this.height;
    }
    getChilds() {
        if (this.rowdata.children) {
            return this.rowdata.children.map(function (d) {
                return new TR(this.level + 1, d, {
                    colums: this.opts.colums,
                    width: this.opts.width
                })
            }, this)
        } else
            return [];
    }
    removeChild(index) {
        this.rowdata.children.splice(index, 1);
    }
    testTDHeight(rowdata, level) {
        return CTable.caculateTd(this.opts.width, rowdata, this.opts.colums[level]);
    }

};
