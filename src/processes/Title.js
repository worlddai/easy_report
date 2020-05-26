import Title from '../../src/classes/core/Title'
export default function (obj_container,onedata, fn_create,fn_loop) {

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
};
