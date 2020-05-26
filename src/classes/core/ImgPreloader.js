import Component from "./Component";
import Img from './Img'
import Global from '../../global'

export default class ImgPreloader {
    constructor() {

    }
    loadImg(index, imgdata, callback) {
        var retArr = [];
        var interval = 0;

        imgdata.forEach(function (imgdata, i) {
            new Img({
                msg: imgdata.msg,
                url: imgdata.url,
                maxWidth: Global.getContainerWidth() - 15,//--imageContainer maringleft+marginright
                maxHight: Global.getContainerHeight(),
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
        }, 10)
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
                })
            }
        })

        return new Promise((resove, reject) => {

            interval = setInterval(function () {
                if (nTotalCallback == curCalbackEd) {
                    clearInterval(interval);
                    resove(retData);
                }
            }, 10)
        })

    }

};
