export function delayCall(delay, callback) {
    createjs.Tween.get(this).wait(delay).call(callback);
    // setTimeout(callback, delay/1000);
}

// export function delayFor(start,len,func) {
//     createjs.Tween.get(this).wait(delay, callback);
// }
export function blink(target, time = 80) {
    var blink = time;
    createjs.Tween.get(target)
        .to({alpha: 1}, blink)
        .to({alpha: 0}, blink)
        .to({alpha: 1}, blink)
        .to({alpha: 0}, blink)
        .to({alpha: 1}, blink);
}