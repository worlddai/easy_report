var ER = (function () {
    'use strict';

    class Container {
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
    }

    class Global {

        constructor() {
            this._data_map = new Map();
        }
        setConfig(id, obj) {
            this._data_map.set(id, obj);
        }
        removeConfig(id)
        {
          return this._data_map.delete(id);
        }
        getContainerWidth(id) {
            const o = this._data_map.get(id);
            if (!o)
                return null
            return o.width
        }
        getContainerHeight() {
            const o = this._data_map.get(id);
            if (!o)
                return null
            return o.height
        }
    }

    var Global$1 = new Global();

    class Component {
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



    }

    class CTable extends Component {
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
         </table>`;
            $(template).appendTo(container); 
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
            });

            // $('#test-th').append("<td width = " + (width) * 100 + '%' + ">" + text + "</td>");
            return $("#test-tr").height();
        }
        parseOpts() {
            this.defaults = {
                width: Global$1.getContainerWidth() - 20,
                marginleft: 5,
                margintop: 10,
                marginbottom: 5,
                colums: [0.4, 0.2, 0.3, 0.1]
            };
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
                th += "<td style ='text-align:" + align + "'  width=" + this.opts.colums[i] * 100 + "%" + ">" + title.texts[i] + "</td>";
            }
            th += "";

            this.$dom.children(0).append(th);
        }
        testAddTh(title) {
            return g_caculateTH(this.opts.width, title.texts, this.opts.colums, title.align || []);
        }
        addTR(_tr) {
            var loop = function (tr) {
                var children = tr.getChilds();
                if (children.length) {
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
                            });
                            retarr.push(cc);
                        });
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
            };

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

            };

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

            var total = "";
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
    }

    class TR  {
        constructor(level, rowdata, opt) {
            // super(data);
            this.level = level;
            this.height = 0;
            this.rowdata = rowdata;
            this.parseOpts(opt);
        }
        parseOpts(opt) {
            this.defaults = {
                width: Global$1.getContainerWidth() - 20,
                colums: [0.4, 0.2, 0.3, 0.1]
            };
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

                }, this);
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

    }

    function CTable$1 (obj_container, onedata, fn_create, fn_loop) {

        var table = new CTable({
            width: Global$1.getContainerWidth() - 20,
            marginleft: 10,
            colums: onedata.size
        });
        var test_th = 0;
        if (onedata.title)
            test_th = table.testAddTh(onedata.title);


        var loopAdd = function (tr, obj_container) {


            if (!tr.getChilds().length) {
                return null;
            }


            var will_add = {
                text: tr.rowdata.text,
                children: []
            };

            for (var i = 0; i < tr.getChilds().length; i++) {

                var ctr = tr.getChilds()[i];
                var ctr_height = ctr.testAdd();

                if (obj_container.tryAdd(ctr_height)) {
                    // table.addTR(tr);
                    obj_container.addHeight(ctr_height);
                    will_add.children.push(ctr.rowdata);
                    tr.removeChild(i);
                    i--;
                } else {

                    //--8.2更新 当子元素不足2个的时候，返回
                    if (ctr.getChilds().length < 2) {
                        return will_add;
                    }


                    var c_will_add = loopAdd(ctr, obj_container);
                    if (c_will_add && c_will_add.children.length)
                        will_add.children.push(c_will_add);
                }
            }
            return will_add;
        };

        if (obj_container.tryAdd(test_th + table.height)) {
            if (onedata.title) {
                table.addTH(onedata.title);
                table.height += test_th;
            }


            for (var i = 0; i < onedata.rows.length; i++) {

                var tr = new TR(0, onedata.rows[i], {
                    colums: onedata.size,
                    width: Global$1.getContainerWidth() - 20,
                });
                var height_row = tr.testAdd();

                if (obj_container.tryAdd(table.height + height_row)) {
                    table.addTR(tr);
                    //--
                    //                    obj_container.addHeight(height_row);
                    table.height += height_row;
                    onedata.rows.splice(i, 1);
                    i--;
                }
                else {
                    //--8.2更新 当子元素不足2个的时候，直接换页
                    if (tr.getChilds().length < 2) {
                        obj_container.add(table.$dom, table.height);
                        var obj_container_new = fn_create();
                        return fn_loop(obj_container_new, onedata,fn_create, fn_loop);
                    }

                    //-loopadd会测试能否添加,会改变height,故添加tag,完事后还原
                    obj_container.addHeight(table.height);
                    obj_container.addHeightTag();

                    var will_add = loopAdd(tr, obj_container);
                    //--当最后一行够但是加上表格的margin不够时，换业
                    if (!will_add || !will_add.children.length) {
                        obj_container.add(table.$dom, table.height);
                        obj_container.restoreHeightTag();
                        var obj_container_new = fn_create();


                        return fn_loop(obj_container_new, onedata,fn_create, fn_loop)
                    }

                    obj_container.restoreHeightTag();

                    table.addTR(new TR(0, will_add,
                        {
                            colums: onedata.size,
                            width: Global$1.getContainerWidth() - 20,
                        }));

                    obj_container.add(table.$dom, table.height);

                    var obj_container_new = fn_create();

                    onedata.rows.splice(i, 1, tr.rowdata);
                    i--;

                    //将onedata处理.带入新一个循环
                    return fn_loop(obj_container_new, onedata,fn_create, fn_loop)
                }
            }
        } else {
            var obj_container_new = fn_create();
            return fn_loop(obj_container_new, onedata,fn_create, fn_loop)
        }
        obj_container.add(table.$dom, table.height);
        return obj_container;


    }

    class Title extends Component {
        constructor(pid,data) {
            super(pid,data);
        }
        static prepare(parent,pid)
        {
            $(`<div style="position: absolute;visibility: hidden;" class="er-title-container" id="er-test-title-${pid}"></div>`).appendTo(parent);
        }
        onInit() {
            this.$dom = $('<div class = "er-title-container">' + this.data.value + '</div>');
        }
        getHeight() {
            $(`#er-test-title-${this.pid}`).text(this.data.value);
            return $(`#er-test-title-${this.pid}`).height();
        }

    }

    function Title$1 (obj_container,onedata, fn_create,fn_loop) {

        var title = new Title(obj_container.pid,onedata);
        if (onedata.callpages) {
            obj_container = fn_create();
        }

        const height = title.getHeight();

        if (obj_container.tryAdd(height)) {
            obj_container.add(title.getDom(), height);
            return obj_container;
        } else {
            var obj_container_new = fn_create();
            return fn_loop(obj_container_new, onedata, fn_create,fn_loop)
        }
    }

    var FontEnum = {
        "NORMAL":0,
        "INDENT":-1
    };

    //--获取字符串实际长度
    function GetLength(str) {
        var realLength = 0,
            len = str.length,
            charCode = -1;
        for (var i = 0; i < len; i++) {
            charCode = str.charCodeAt(i);
            if (charCode >= 0 && charCode <= 128) realLength += 1;
            else realLength += 2;
        }
        return realLength;
    }

    //--截取
    function cutstr(str, len) {
        var str_length = 0;
        var str_len = 0;
        var str_cut = new String();
        var str_len = str.length;
        for (var i = 0; i < str_len; i++) {
           var a = str.charAt(i);
            str_length++;
            if (escape(a).length > 4) {
                //中文字符的长度经编码之后大于4  
                str_length++;
            }
            str_cut = str_cut.concat(a);
            if (str_length >= len) {
                return str_cut;
            }
        }
        if (str_length < len) {
            return str;
        }
    }



    function splitstring(stringtotal, splitor) {
        var index = stringtotal.indexOf(splitor);

        if (index == 0) {
            var splits = stringtotal.split(splitor);

            if (splits.length > 2) {
                var rets = "";
                for (var i = 1; i < splits.length; i++) {
                    if (i != splits.length - 1)
                        rets += (splits[i] + splitor);
                    else
                        rets += splits[i];
                }
                return rets;
            } else
                return splits[1];
        }
        return stringtotal;
    }

    class Font extends Component {
        constructor(pid,data) {
            super(pid,data);
        }
        parseOpts() {
            this.defaults = {
                indent: true,//--顶部不空格
                margintop: 10,
                marginbuttom: 0,
                marginleft: 20,
                width: Global$1.getContainerWidth(this.pid)
            };
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

                curHeight = Font.cacuFontHeight(curTestStr += "a",pid, 0);
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
            for (var i = 0; i < part2.length; i++) {
                testPart = testPart + part2.charAt(i);
                $container.get(0).innerHTML = testPart;
                if (orgHeight != $container.height()) {
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


    }

    function Font$1 (obj_container, onedata, fn_create, fn_loop) {

        const font = new Font(obj_container.pid,onedata);

        const totalheight = font.getHeight();
        const fontheight = font.getFontHeight();
        const extra_height = font.getExtraHeight();
        if (obj_container.tryAdd(totalheight)) {

            obj_container.add(font.getDom(), totalheight);

            return obj_container;
        } else {
            var str_obj = {};
            if (obj_container.remainderHeight - extra_height > font.getLineHeight()) {

                var pes = (obj_container.remainderHeight - extra_height) / fontheight;

                var remainedLength = GetLength(onedata.value);

                if (remainedLength < 2 * font.getLineSize()) {
                    if (remainedLength < font.getLineSize())
                        str_obj = { subed: "", remained: onedata.value };
                    else {
                        var firstChar = onedata.value.charAt(0);
                        var second_cut_str = Font.getbalanceStr(firstChar, splitstring(onedata.value, firstChar), font.mode);

                        str_obj = {
                            subed: second_cut_str,
                            remained: splitstring(onedata.value, second_cut_str)
                        };
                    }
                }
                else {

                    str_obj = Font.cutString(obj_container.pid,pes, onedata.value, font.mode, font.getLineSize());

                    if (GetLength(str_obj.subed) < font.getLineSize()) {

                        var second_cut_str = Font.getbalanceStr(obj_container.pid,str_obj.subed, str_obj.remained, font.mode);

                        str_obj = {
                            subed: second_cut_str,
                            remained: splitstring(onedata.value, second_cut_str)
                        };

                    }
                }
                const subject_font = new Font(obj_container.pid,$.extend({}, onedata, { value: str_obj.subed }));
                const subject_font_totalheight = subject_font.getHeight();
                obj_container.add(subject_font.$dom, subject_font_totalheight);
            }
            else {
                str_obj = { subed: "", remained: onedata.value };
            }

            var obj_container_new = fn_create();


            return fn_loop(obj_container_new, {
                "type": "font",
                "value": str_obj.remained,
                "margintop": 10,
                "indent": false
            }, fn_create, fn_loop)

        }
    }

    class ImgContainer extends Component {
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
            };
            this.opts = $.extend(true, this.defaults, this.data);
            this.$dom = $('<div style = "padding-top:' + this.opts.margin_top + 'px;padding-bottom:' + this.opts.margin_bottom + 'px" class = "img-container"><div class = "content-clear"></div></div>');
            this.retainedWidth = Global$1.getContainerWidth();
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
            })) + this.opts.margin_top + this.opts.margin_bottom;
        }

    }

    function Img (obj_container, onedata, fn_create, fn_loop) {

        var curRetData = { index: 0, container: null };

     

        function appendImg(obj_img_container, ImgData, curIndex) {

            for (var i = curIndex; i < ImgData.length; i++) {
                var objImg = ImgData[i];
                if (obj_img_container.testAdd(objImg)) {
                    obj_img_container.add(objImg);
                } else {
                    return {
                        container: obj_img_container,
                        index: i
                    }
                }
            }
            return {
                container: obj_img_container,
                index: ImgData.length
            }

        }

        while (curRetData.index != onedata.value.length) {

            var obj_img_container = new ImgContainer();

            var beforeIndex = curRetData.index;

            curRetData = appendImg(obj_img_container, onedata.value, curRetData.index);

            if (obj_container.tryAdd(curRetData.container.height)) {
                obj_container.add(curRetData.container.$dom, curRetData.container.height);
            } else {

                var obj_container_new = fn_create();

                var newDataArray = onedata.value.slice(beforeIndex);
                return fn_loop(obj_container_new, { "type": "img", value: newDataArray }, fn_create, fn_loop)
            }

        }
        return obj_container;
    }

    var Processes = {
        "ctable":CTable$1,
        "title":Title$1,
        "font":Font$1,
        'img':Img,
    };

    class Img$1 extends Component {
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
            };
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

            }, 80);
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


    }

    class ImgPreloader {
        constructor() {

        }
        loadImg(index, imgdata, callback) {
            var retArr = [];
            var interval = 0;

            imgdata.forEach(function (imgdata, i) {
                new Img$1({
                    msg: imgdata.msg,
                    url: imgdata.url,
                    maxWidth: Global$1.getContainerWidth() - 15,//--imageContainer maringleft+marginright
                    maxHight: Global$1.getContainerHeight(),
                    onLoad: function () {
                        retArr.push({
                            obj: this,
                            i: i
                        });
                    }
                });
            }, this);

            interval = setInterval(function () {
                if (imgdata.length == retArr.length) {
                    clearInterval(interval);
                    callback(retArr.sort(function (a, b) {
                        return a.i - b.i;
                    }).map(function (d) {
                        return d.obj
                    }), index);
                }
            }, 10);
        }
        process(data) {

            var retData = data;
            var curCalbackEd = 0;
            var interval = 0;

            var nTotalCallback = data.filter(function (onedata) {
                return onedata.type == 'img';
            }).length;

            data.forEach((onedata, n) => {
                if (onedata.type == 'img') {
                    this.loadImg(n, onedata.value, function (imgarr, index) {
                        retData[index].value = imgarr;
                        curCalbackEd++;
                    });
                }
            });

            return new Promise((resove, reject) => {

                interval = setInterval(function () {
                    if (nTotalCallback == curCalbackEd) {
                        clearInterval(interval);
                        resove(retData);
                    }
                }, 10);
            })

        }

    }

    let cur_id = 1000;
    function getUniqueId(len) {
        return cur_id++;
    }

    class EasyReport {
        constructor(parent, options) {
            this.defaults = {
                width: 700,
                height: 500,
                onCreatePage() { }
            };
            this._id = getUniqueId();
            this.containers = [];
            this.parent = parent;
            this.opts = $.extend(true, this.defaults, options);
            this.curindex = 0;
            this._init();

        }
        _init() {
            Global$1.setConfig(this._id,{
                width: this.opts.width,
                height: this.opts.height
            });
            Font.prepare(this.parent,this._id);
            Title.prepare(this.parent,this._id);
            CTable.prepare(this.parent,this._id);

        }
        createContainer() {
            const c = new Container(this.parent,this._id, this.opts.width, this.opts.height);
            this.containers.push(c);
            this.opts.onCreatePage.call(this, c.$dom, this.curindex++);
            return c;
        }
        getContainer(index) {
            return this.containers[index];
        }
        preprocess(data) {
            return new Promise((resove, reject) => {
                return new ImgPreloader().process(data).then((d) => {
                    resove(d);
                })
            })
        }
        destory() {
            this.containers.map((c) => {
                c.destory();
            });
            this.containers = [];

            Font.unprepare(this.parent,this._id);
            Global$1.removeConfig(this._id);
        }
        process(data) {
            const loop = function (obj_container, onedata, fn_create) {
                return Processes[onedata.type](obj_container, onedata, fn_create, loop);
            };
            const createContainer = () => {
                return this.createContainer();
            };
            let cur_container = this.createContainer();
            this.preprocess(data).then((d) => {
                for (var i = 0; i < d.length; i++) {
                    cur_container = loop(cur_container, d[i], createContainer, loop);
                }
            });

        }

    }

    // import MODE from './enum/mode'

    // const instance =null;
    const ER = {
        version: "1.0.0",

        getInstance(parent, opts) {
            return new EasyReport(parent, opts);    }   

    };

    return ER;

}());
