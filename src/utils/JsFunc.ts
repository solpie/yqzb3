//Array.sort(ascendingProp('prop'))
//升序
export function ascendingProp(prop) {
    return function (a, b) {
        return a[prop] - b[prop];
    }
}
//降序
export function descendingProp(prop) {
    return function (a, b) {
        return b[prop] - a[prop];
    }
}
export function mapToSortArray(map, prop, sortFunc) {
    var arr = [];
    for (var k in map) {
        arr.push(map[k]);
    }
    arr.sort(sortFunc(prop));
    return arr;
}
export function loadImg(path1, callback) {
    var img = new Image();
    img.onload = callback;
    img.src = path1;
}

export function loadImgArr(pathArr, callback) {
    var count = pathArr.length;

    function onLoadImg() {
        count--;
        if (count === 0)
            callback();
    }

    for (var i = 0; i < pathArr.length; i++) {
        var p = pathArr[i];
        var img = new Image();
        img.onload = onLoadImg;
        img.src = p;
    }
}

export function formatSecond(sec, minStr = ":", secStr = "") {
    var min = Math.floor(sec / 60);
    var s = sec % 60;
    var strMin = min + "";
    var strSec = s + "";
    if (min < 10)
        strMin = "0" + strMin;
    if (s < 10)
        strSec = "0" + strSec;
    return strMin + minStr + strSec + secStr;
}