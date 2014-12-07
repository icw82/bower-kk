(function(){
// start ——————————————————————————————————————————————————————————————————————————————————— 100 ——|
'use strict';

var root,
    kenzo = {
        v: '3.0.0',
        w: false,
        d: false,
        _o: 'object',
        _f: 'function',
        _u: 'undefined',
        _s: 'string',
        _n: 'number',
        __arg: 'Некорректные аргументы'
    };

if (typeof window == kenzo._o && typeof Window == kenzo._f && (window instanceof Window)){
    root = window;
    kenzo.w = true;
} else if (typeof global == kenzo._o){
    root = global;
}

if (typeof root.document == kenzo._o)
    kenzo.d = true;

root.kenzo = root.kk = kenzo;

if (typeof module == kenzo._o && typeof module.exports == kenzo._o){
    // FUTURE: запилить для ноды
    module.exports = kenzo;
}

kenzo.r = root;

// end ————————————————————————————————————————————————————————————————————————————————————— 100 ——|
}());


//  – — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — —|

//kenzo.plural = function(){
//    var amount, singular, paucal, plural, fr;
//
//    if (typeof arguments[0] === 'number'){
//        amount = arguments[0];
//    } else if (arguments[0] instanceof Array){
//        amount = arguments[0].length;
//    } else if (typeof arguments[0] == 'object'){
//        amount = (function(){
//            var counter = 0;
//            for (var j in arguments[0]) counter++;
//            return counter;
//        })();
//    }
//
//    if (typeof amount === 'undefined'){
//        return false;
//    } else if (amount < 0){
//        amount = -amount;
//    }
//
//    if (
//        (arguments[1] instanceof Array) &&
//        (typeof arguments[1][0] == 'string') &&
//        (typeof arguments[1][1] == 'string') &&
//        (typeof arguments[1][2] == 'string')
//    ){
//        singular = arguments[1][0];
//        paucal = arguments[1][1];
//        plural = arguments[1][2];
//
//    } else if (
//        (typeof arguments[1] == 'string') &&
//        (typeof arguments[2] == 'string') &&
//        (typeof arguments[3] == 'string')
//    ){
//        singular = arguments[1];
//        paucal = arguments[2];
//        plural = arguments[3];
//    } else {
//        console.warn('Формы не заданы');
//        return false;
//    }
//
//    (fr = amount.toString().match(/(\.\d+)/)) &&
//        (amount *= Math.pow(10, fr[0].length - 1));
//
//    if (fr !== null)
//        return plural;
//    if ((amount % 10 == 1) && (amount % 100 != 11))
//        return singular;
//    else
//        if ((amount % 10 >= 2) && (amount % 10 <= 4) &&
//            ((amount % 100 < 10) || (amount % 100 >= 20)))
//            return paucal;
//        else
//            return plural;
//}
//
//kenzo.num_to_ru = function(n){
//    if (typeof n == 'number')
//        return n.toString().replace(/\./,',');
//    if (typeof n == 'string')
//        return n.replace(/\./,',');
//}
//
//// Вызов событий
//kenzo.generate = (function(){
//    var resize = function(delay){
//        if (typeof document.createEvent == 'function'){
//            var event = document.createEvent('Event');
//            event.initEvent('resize', true, true);
//            window.dispatchEvent(event);
//        }
//    }
//
//    return {
//        'resize': resize
//    }
//})();
//
//kenzo.is_nodes = function(){
//    if ((typeof StaticNodeList == 'object') && (arguments[0] instanceof StaticNodeList))
//        if (arguments[0].length > 0)
//            return true;
//        else
//            return false;
//
//    if (arguments[0] instanceof NodeList)
//        if (arguments[0].length > 0)
//            return true;
//        else
//            return false;
//}
//
//kenzo.toggle_class = function(element, classes, classlist, toggle_exist){
//    if (!(element instanceof Element)) return false;
//
//    if (typeof classes === 'string') classes = [classes];
//    if (!(classes instanceof Array)) return false;
//    if (!(classlist instanceof Array))
//        classlist = classes;
//
//    var exist = true;
//
//    if (toggle_exist !== false)
//        toggle_exist = true;
//
//    each (classes, function(cls){
//        if (classlist.indexOf(cls) < 0)
//            classlist.push(cls);
//        if (!element.classList.contains(cls))
//            exist = false;
//    });
//
//    each (classlist, function(cls){
//        if (toggle_exist && exist) {
//            element.classList.remove(cls);
//        } else {
//            if (classes.indexOf(cls) < 0)
//                element.classList.remove(cls);
//            else
//                element.classList.add(cls);
//        }
//    });
//}
//
//

//
//kenzo.browser = (function(){
//    if ('transform' in document.body.style)
//        return 'normal';
//    else if ('webkitTransform' in document.body.style)
//        return 'webkit';
//    else
//        return 'old';
//})();
//
//
//kenzo.format = {}
//// Российские номера
//kenzo.format.phone = function(){
//    if (arguments.length === 0) return false;
//    if (typeof arguments[0] !== 'string') return false;
//
//    var
//        string = arguments[0],
//        number = string
//            .replace(/[^\d\+]/g, '')
//            .match(/^(?:\+7|8)([\d]{10})/);
//
//    if (number === null) return false;
//    number = number[1];
//
//    return '+7 ('
//        + number.slice(0, 3) + ') '
//        + number.slice(3, 6) + '-'
//        + number.slice(6, 8) + '-'
//        + number.slice(8, 10);
//}
//
//// Локальное хранилище
//kenzo.ls = {
//    'create': function(){
//        each (arguments, function(item){
//            if ((typeof item == 'string') && (!localStorage.getItem(item))){
//                localStorage.setItem(item, JSON.stringify([]));
//                localStorage.setItem('@' + item, getTimestump());
//            }
//        })
//    },
//    'get': function(address){
//        return JSON.parse(localStorage.getItem(address));
//    },
//    'ts': function(address){
//        return localStorage.getItem('@' + address);
//    },
//    'update': function(address, data){
//        localStorage.setItem(address, JSON.stringify(data));
//        localStorage.setItem('@' + address, getTimestump());
//        return true;
//    }
//}
//
//
//kenzo.stop_event = function(event){
//    event = event || window.event;
//    if (!event) return false;
//    while (event.originalEvent){event = event.originalEvent}
//    if (event.preventDefault) event.preventDefault();
//    if (event.stopPropagation) event.stopPropagation();
//    event.cancelBubble = true;
//    return false;
//}
//
//kenzo.i8ArrayTo2 = function(array){
//    var _ = '';
//    each (array, function(item){
//        _ += kenzo.i8to2(item);
//    });
//    return _;
//}
//
//kenzo.i8to2 = function(int8){
//    var _ = int8.toString(2);
//    while (_.length < 8){
//        _ = '0' + _;
//    }
//    return _;
//}
//
//kenzo.i8ArrayToString = function(array){
//    var _ = '';
//    each (array, function(item){
//        _ += String.fromCharCode(item);
//    });
//    return _;
//}
//
//
//// Старое
//

//function getTimestump(){
//    var time = new Date();
//    return time.getTime();
//}
//
//// Разделение чисел на разряды
//function numderTypo(input){
//    var output = '';
//
//    if(input && input != ''){
//        var numbers = String(input);
//        numbers = numbers.split('');
//
//        for(n = numbers.length - 1; n >= 0; n--){
//            output = numbers[n] + output;
//            if((numbers.length - n) % 3 == 0)
//                output = ' ' + output;
//        }
//    }
//
//    return output;
//}
//
//function timeTypo(input){
//    var
//        hours = Math.floor(input/60),
//        minutes = input - hours*60,
//        output = '';
//
//    if(hours)
//        output += plural_ru(hours, 'час', 'часа', 'часов') + (minutes ? ' ' : '');
//
//    if(minutes)
//        output += plural_ru(minutes, 'минута', 'минуты', 'минут');
//
//    return output;
//}
//
//
//function getWindowParams(){
//    var sizes = {};
//    sizes.x = (window.pageXOffset !== undefined) ? window.pageXOffset :
//        (document.documentElement || document.body.parentNode || document.body).scrollLeft;
//    sizes.y = (window.pageYOffset !== undefined) ? window.pageYOffset :
//        (document.documentElement || document.body.parentNode || document.body).scrollTop;
//    sizes.w = ('innerWidth' in window) ? window.innerWidth :
//        document.documentElement.clientWidth
//    sizes.h = ('innerWidth' in window) ? window.innerHeight :
//        document.documentElement.clientHeight;
//    return sizes;
//}
//
//Element.prototype.getOffset = function(){
//    var boundingClientRect = this.getBoundingClientRect();
//
//    // NOTE: Для ie8 может понадобиться полифилл (лучше отдельным файлом)
//    return {
//        top: boundingClientRect.top + window.pageYOffset,
//        left: boundingClientRect.left + window.pageXOffset,
//        width: boundingClientRect.width,
//        height: boundingClientRect.height
//    }
//};

// Перебор массива
// Если обратная функция возвращает true, перебор прерывается.
// Если третий аргумент функция — то она выполяется после перебора массива,
//     если обратная функция ниразу не возвращала true
// Если последний элемент === true, перебор производится в обратном порядке.
kenzo.each = function(array, callback){
    var kenzo = kk,
        args = arguments,
        reverse,
        def,
        nothing = true,
        index;

    if (typeof array === kenzo._s && kenzo.d)
        array = document.querySelectorAll(array);
    else if (typeof array === kenzo._n)
        array = Array(array);

    if (typeof args[2] == kenzo._f){
        def = args[2];
        if (args[3] === true)
            reverse = true;
    } else if (args[2] === true){
        reverse = true;
    }

    if (typeof array == kenzo._o && ('length' in array) && typeof callback == kenzo._f){
        if (reverse) {
            for (index = array.length - 1; index >= 0; index--){
                if (callback(array[index], index) === true){
                    nothing = false;
                    break;
                }
            }
        } else {
            for (index = 0; index < array.length; index++){
                if (callback(array[index], index) === true){
                    nothing = false;
                    break;
                }
            }
        }

        if (nothing && typeof def == kenzo._f) {
            def();
        }
    }
};

if (typeof kk.r.each === kenzo._u)
    kk.r.each = kk.each;

/**
 * [[Description]]
 * param {Number} Минимальное значение или длина диапазона от нуля
 * param {Number} Максимальное значение
 * @returns {Number} Случайное число из заданного диапазона
 */
kenzo.rand = function(){
    var kenzo = kk,
        args = arguments,
        depth,
        min,
        max;

    if (typeof args[0] == kenzo._n){
        if (typeof args[1] == kenzo._n){
            min = args[0];
            max = args[1] + 1;

            return Math.floor( Math.random() * (max - min) ) + min;
        } else {
            depth = args[0];

            if (depth < 0)
                depth = -depth;

            depth = Math.floor(depth);

            if (depth === 0)
                return 0;
            else if (depth === 1)
                min = 0;
            else
                min = Math.pow(10, depth - 1);

            return kenzo.rand(min, Math.pow(10, depth) - 1);
        }
    } else
        console.warn(kenzo.__arg);
};
