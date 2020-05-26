
import ImgContainer from '../classes/core/ImgContainer'
export default function (obj_container, onedata, fn_create, fn_loop) {

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
};
