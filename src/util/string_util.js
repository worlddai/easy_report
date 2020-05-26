


//--获取字符串实际长度
export function GetLength(str) {
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
export function cutstr(str, len) {
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



export function splitstring(stringtotal, splitor) {
    var index = stringtotal.indexOf(splitor);

    if (index == 0) {
        var splits = stringtotal.split(splitor);

        if (splits.length > 2) {
            var rets = "";
            for (var i = 1; i < splits.length; i++) {
                if (i != splits.length - 1)
                    rets += (splits[i] + splitor)
                else
                    rets += splits[i];
            }
            return rets;
        } else
            return splits[1];
    }
    return stringtotal;
}



