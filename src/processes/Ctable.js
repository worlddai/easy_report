
import Global from '../global'
import TR from '../classes/core/TR'
import CTable from '../classes/core/CTable'
export default function (obj_container, onedata, fn_create, fn_loop) {

    var table = new CTable({
        width: Global.getContainerWidth() - 20,
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
        }

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
    }

    if (obj_container.tryAdd(test_th + table.height)) {
        if (onedata.title) {
            table.addTH(onedata.title);
            table.height += test_th;
        }


        for (var i = 0; i < onedata.rows.length; i++) {

            var tr = new TR(0, onedata.rows[i], {
                colums: onedata.size,
                width: Global.getContainerWidth() - 20,
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
                        width: Global.getContainerWidth() - 20,
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
    ;
    obj_container.add(table.$dom, table.height);
    return obj_container;


};
