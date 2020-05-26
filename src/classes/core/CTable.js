import Component from "./Component";
import Global from '../../global'

export default class CTable extends Component {
    constructor(data) {
        super(data);
    }
    static prepare(container) {
      const template =  `<table style="position: absolute;visibility: hidden;" id="test-c-table" class="c-table" width="500">
            <tbody>
                <tr id="test-tr">
                    <td width=5%></td>
                </tr>
            </tbody>
         </table>`
        $(template).appendTo(container) 
    }
    static caculateTd(tablewidth, rowdata, width) {

        $('#test-c-table').attr('width', tablewidth);

        var align = rowdata.options ? rowdata.options.align || 'center' : 'center';

        $('#test-tr').empty();
        $('#test-tr').append("<td  width = " + (1 - width) * 100 + '%' + "></td>");
        $('#test-tr').append("<td  style ='text-align:" + align + "' width = " + (width) * 100 + '%' + ">" + (rowdata.text.trim() || "c") + "</td>");
        return $("#test-tr").height();
    }
    static caculateTH(tablewidth, texts, size, aligns) {

        $('#test-c-table').attr('width', tablewidth);

        $('#test-tr').empty();
        texts.map(function (t, i) {
            var align = aligns[i] || 'center';
            $('#test-tr').append("<td style ='text-align:" + align + "' width = " + (size[i]) * 100 + '%' + ">" + texts[i] + "</td>");
        })

        // $('#test-th').append("<td width = " + (width) * 100 + '%' + ">" + text + "</td>");
        return $("#test-tr").height();
    }
    parseOpts() {
        this.defaults = {
            width: Global.getContainerWidth() - 20,
            marginleft: 5,
            margintop: 10,
            marginbottom: 5,
            colums: [0.4, 0.2, 0.3, 0.1]
        }
        this.opts = $.extend(true, this.defaults, this.data);
    }
    onInit() {
        this.height = this.opts.margintop + this.opts.marginbottom;
        this.$dom = $('<div class = "ctable-wapper" style = "margin-top:' + this.opts.margintop + 'px;margin-bottom:' + this.opts.marginbottom + 'px;margin-left:' + this.opts.marginleft + 'px;width:' + this.opts.width + 'px"><table width=' + this.opts.width + ' class = "c-table"></table></div>');
    }
    addTH(title) {
        var th = "";

        for (var i = 0; i < title.texts.length; i++) {
            var aligns = title.aligns || [];
            var align = aligns[i] || 'center';
            th += "<td style ='text-align:" + align + "'  width=" + this.opts.colums[i] * 100 + "%" + ">" + title.texts[i] + "</td>"
        }
        th += ""

        this.$dom.children(0).append(th);
    }
    testAddTh(title) {
        return g_caculateTH(this.opts.width, title.texts, this.opts.colums, title.align || []);
    }
    addTR(_tr) {
        var loop = function (tr) {
            var children = tr.getChilds();
            if (children.length) {
                var total_child_num = 0;
                var retarr = [];
                var temp = { val: 0 };
                for (var i = 0; i < children.length; i++) {

                    var childs = loop(children[i]);

                    childs.map(function (cc, i) {
                        cc.unshift({
                            text: tr.rowdata.text,
                            options: tr.rowdata.options,
                            level: tr.level,
                            child_space: temp
                        })
                        retarr.push(cc);
                    })
                }
                temp.val = retarr.length;
                return retarr
            } else {
                return [[{
                    text: tr.rowdata.text,
                    options: tr.rowdata.options,
                    level: tr.level,
                    child_space: { val: 1 }
                }]]
            }
        }

        var alls = loop(_tr).map(function (mm) {

            return mm.map(function (m2) {
                return {
                    text: m2.text,
                    level: m2.level,
                    options: m2.options,
                    child_space: m2.child_space.val,
                }
            })
        });

        var deletedbArr = function (dbarr, x, y, z) {
            for (var i = 0; i < dbarr.length; i++) {
                if (i >= x && i <= x + y) {
                    dbarr[i].splice(z, 1);
                }
            }

        }

        for (var i = 0; i < alls.length; i++) {
            var subs = alls[i];
            var peice = 0;
            for (var j = 0; j < subs.length; j++) {
                var td = subs[j];

                if (td.child_space > 1 && !td.is_removed) {
                    deletedbArr(alls, i + 1, td.child_space - 2, j - peice);
                    peice++;
                    j--;
                    td.is_removed = true;
                }
            }

        }

        var total = ""
        for (var i = 0; i < alls.length; i++) {
            total += "<tr>";

            var cd = alls[i];
            for (var j = 0; j < cd.length; j++) {
                var td = cd[j];
                var align = td.options ? td.options.align || 'center' : 'center';

                if (j == cd.length - 1 && td.level != this.opts.colums.length - 1) {
                    var colspan = this.opts.colums.length - td.level;
                    total += ("<td style ='text-align:" + align + "' " + "colspan=" + colspan + (td.child_space > 1 ? (" rowspan = " + td.child_space) : "") + ">" + td.text.trim() + "</td>");
                } else {
                    total += ("<td style ='text-align:" + align + "'" + (td.child_space > 1 ? ("rowspan=" + td.child_space) : "") + ">" + td.text.trim() + "</td>");
                }

            }
            total += "</tr>";
        }
        this.$dom.children(0).append(total);
    }
    add(tablerow) {

    }
};
