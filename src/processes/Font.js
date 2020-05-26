import Font from '../../src/classes/core/Font'
import { GetLength, splitstring } from '../util/string_util'
export default function (obj_container, onedata, fn_create, fn_loop) {

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
                    }
                }
            }
            else {

                str_obj = Font.cutString(obj_container.pid,pes, onedata.value, font.mode, font.getLineSize());

                if (GetLength(str_obj.subed) < font.getLineSize()) {

                    var second_cut_str = Font.getbalanceStr(obj_container.pid,str_obj.subed, str_obj.remained, font.mode);

                    str_obj = {
                        subed: second_cut_str,
                        remained: splitstring(onedata.value, second_cut_str)
                    }

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
};
