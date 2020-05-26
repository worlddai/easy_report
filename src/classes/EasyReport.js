import Container from "./Container";
import Processes from "../processes"
import Font from './core/Font'
import Title from './core/Title'
import CTable from './core/CTable'
import ImgPreloader from './core/ImgPreloader'
import Global from '../global'
import {getUniqueId} from '../util/core'
export default class EasyReport {
    constructor(parent, options) {
        this.defaults = {
            width: 700,
            height: 500,
            onCreatePage() { }
        }
        this._id = getUniqueId();
        this.containers = [];
        this.parent = parent;
        this.opts = $.extend(true, this.defaults, options);
        this.curindex = 0;
        this._init();

    }
    _init() {
        Global.setConfig(this._id,{
            width: this.opts.width,
            height: this.opts.height
        })
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
        })
        this.containers = [];

        Font.unprepare(this.parent,this._id);
        Global.removeConfig(this._id)
    }
    process(data) {
        const loop = function (obj_container, onedata, fn_create) {
            return Processes[onedata.type](obj_container, onedata, fn_create, loop);
        }
        const createContainer = () => {
            return this.createContainer();
        }
        let cur_container = this.createContainer();
        this.preprocess(data).then((d) => {
            for (var i = 0; i < d.length; i++) {
                cur_container = loop(cur_container, d[i], createContainer, loop);
            }
        })

    }

};
