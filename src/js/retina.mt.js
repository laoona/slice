/**
 * @author: laoono
 * @date:  2016-09-29
 * @time: 10:11
 * @contact: laoono.com
 * @description: #
 */

(function() {
    // 根据屏幕大小及dpi调整缩放和大小
    var scale = 1.0;
    var ratio = 1;
    if (window.devicePixelRatio >= 2) {
        scale *= 0.5;
        ratio *= 2;
    }
    
    var text = '<meta name="viewport" content="initial-scale=' + scale + ', maximum-scale=' + scale +', minimum-scale=' + scale + ', width=device-width, user-scalable=no" />';
    document.write(text);
    document.documentElement.style.fontSize = 50 * ratio + "px";

    // 给js调用的，某一dpr下rem和px之间的转换函数
    window.rem2px = function (v) {
        v = parseFloat(v);
        return v * rem;
    };
    
    window.px2rem = function (v) {
        v = parseFloat(v);
        return v / rem;
    };

    window.dpr = ratio;
    window.rem = 50 * ratio;
})();
     