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
//转换唯一数组

export function mapToArr(map) {
    var a = [];
    for (var k in map) {
        a.push(map[k])
    }
    return a;
}
//数组相同元素个数
export function arrCountSame(arrA:Array<any>, arrB:Array<any>) {
    var n = 0;
    for (var i = 0; i < arrB.length; i++) {
        var obj = arrB[i];
        if (arrA.indexOf(obj) > -1) {
            n++;
        }
    }
    return n;
}
//混合数组
export function arrMix2Elem(arrA:Array<any>, arrB:Array<any>) {
    var idx = Math.floor(Math.random() * 4) % 4;
    var tmp = arrA[idx];
    arrA[idx] = arrB[idx];
    arrB[idx] = tmp;
    var idx2 = (idx + 1) % 4;
    tmp = arrA[idx2];
    arrA[idx2] = arrB[idx2];
    arrB[idx2] = tmp;
}
// Array.sort().filter(arrUniqueFilter)
export function arrUniqueFilter(el, i, a):boolean {
    return i == a.indexOf(el);
}

export function arrUniqueProp(arr, prop):Array<any> {
    var m:any = {};
    for (var i = 0; i < arr.length; i++) {
        m[arr[i][prop]] = arr[i];
    }
    return mapToArr(m);
}

export function arrMaxElem(arr) {
    return Math.max.apply(Math, arr);
}

export function arrMinElem(arr) {
    return Math.min.apply(Math, arr);
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

export function combineArr(arr, num) {
    var r = [];
    (function f(t, a, n) {
        if (n == 0) {
            return r.push(t);
        }
        for (var i = 0, l = a.length; i <= l - n; i++) {
            f(t.concat(a[i]), a.slice(i + 1), n - 1);
        }
    })([], arr, num);
    return r;
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