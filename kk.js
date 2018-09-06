'use strict';

(() => {
const kk = {
    v: '0.19.0',
//    r: root // window or global
    w: null, // window (global if not)
    d: null, // root.document
//    _b: 'boolean',
//    _u: 'undefined',
//    _o: 'object',
//    _f: 'function',
//    _s: 'string',
//    _n: 'number',
//    _A: Array,
//    _D: Date,
//    _E: Element,
//    _N: Node,
//    _NL: NodeList,
//    _C: HTMLCollection,
};

kk.msg = {
    cb: 'Обратный вызов не определён или не является функцией',
    ae: 'Уже существует'
};

kk.err = {}; // errors

Object.keys(kk.msg).forEach(key => {
    kk.err[key] = Error(kk.msg[key]);
});

kk.__d = () => console.warn('Depricated');


if (
    (typeof Window === 'function' || Window instanceof Function) &&
    (window instanceof Window)
) {
    kk.w = window;
    kk.global = kk.r = kk.w;

} else {
    console.warn(Window, Window instanceof Function, Function);
    console.warn(window, window instanceof Window, Window);
    throw Error(`Неизвестно что`)
}

Object.defineProperty(kk, 'd', { get: () => kk.r.document });

kk.ts = () => Date.now();

kk.r.kk = kk.r.kenzo = kk;

})();

(kk => {
kk.is = (() => {
    const is = {
        u: 'undefined',
        b: 'boolean',
        n: 'number',
        s: 'string',
//        sy: 'symbol',
        o: 'object',
        f: 'function',
        c: 'function', // class
    };

    Object.keys(is).forEach(key => {
        const type = is[key];

        is[key] = (...args) =>
            !(args.filter(item => typeof item !== type).length > 0);
    });

    //Boolean
    //Number
    //String
    //Symbol

    is.addTest = (name, type) => {
        if (is.hasOwnProperty(name))
            throw new kk.err.ae();

        if (!is.c(type))
            throw new TypeError();

        is[name] = (...args) =>
            !(args.filter(item => !(item instanceof type)).length > 0)
    }

    [
        ['A', Array],
        ['AB', ArrayBuffer],
        ['D', Date],
        ['E', Element],
        ['N', Node],
        ['NL', NodeList],
        ['C', HTMLCollection]
    ].forEach(args => {
        is.addTest(...args);
    });

    return is;

})();

})(kk);

(kk => {
// Перебор массива
//
// Перебор прерывается, eсли обратная функция возвращает значение, отличное
// от undefined и false.
// Если третий аргумент функция — то она выполяется после перебора массива,
//     если обратная функция ниразу не возвращала true
// Если последний элемент === true, перебор производится в обратном порядке.

// TODO: MutationRecord;

kk.each = function() {
    var args = arguments;
    var array = [];
    var first = args[0];
    var callback = args[1];

    if (!kk.is.f(callback))
        throw kk.err.cb;

    var def = kk.is.f(args[2]) ? args[2] : false;
    var last = args[args.length - 1];
    var reverse = kk.is.b(last) ? last : false;
    var index;
    var result;
    var pseudo = false;

    if (kk.is.u(first))
        return void 0;

    if (kk.is.s(first) && kk.d) {
        array = kk.d.querySelectorAll(first);
    } else if (kk.is.n(first)) {
        array = Array(Math.floor(Math.max(0, first)));
        pseudo = true;
    } else if (ArrayBuffer.isView(first) && (first.length > 0)) {
        array = Array.prototype.slice.call(first);
        //var args = (arguments.length === 1 ? [arguments[0]] : Array.apply(null, arguments));
    } else if (kk.is.A(first) || kk.is.NL(first) || kk.is.C(first)) {
        array = first;
    }


    if (array.length > 0) {
        if (reverse) {
            for (index = array.length - 1; index >= 0; index--) {
                result = callback(pseudo ? index : array[index], index, array);
                if (!kk.is.u(result))
                    return result;
            }
        } else {
            for (index = 0; index < array.length; index++) {
                result = callback(pseudo ? index : array[index], index, array);
                if (!kk.is.u(result))
                    return result;
            }
        }
    }

    if (def) {
        return def();
    }
};

if (kk.r.each === void 0)
    kk.r.each = kk.each;

})(kk);

(kk => {
// Случайное целое число
kk.rand = (first, second) => {
    let min;
    let max;

    // Если первым аргументом передан массив
    if (kk.is.A(first))
        return first[ kk.rand(0, first.length - 1) ];

    // Если аргументов нет — выдавать случайно true/false
    if (!kk.is.n(first))
        return !Math.round(Math.random())

    // Если аргумент только один — задаёт разряд случайного числа
    if (!kk.is.n(second)) {
        var depth = Math.floor(Math.abs(first));

        if (depth >= 16)
            throw new Error(`Нельзя задать число более чем в 16 знаков`);

        if (depth === 0)
            return 0;

        if (depth === 1)
            min = 0;
        else
            min = Math.pow(10, depth - 1);

        return kk.rand(min, Math.pow(10, depth) - 1);

    }

    // Если два аргумента
    min = first;
    max = second + 1;

    return Math.floor( Math.random() * (max - min) ) + min;

};

})(kk);

(kk => {
kk.class = function(element, classes, mask) {
    if (!kk.is.E(element))
        throw new TypeError();

    if (kk.is.s(classes))
        classes = [classes];

    if (!kk.is.A(classes))
        throw new TypeError();

    if (!kk.is.A(mask))
        mask = [];

    mask.forEach(function(item) {
        if (!kk.is.s(item))
            throw new TypeError();
    });

    classes.forEach(function(item) {
        if (!kk.is.s(item))
            throw new TypeError();
    });

    mask.forEach(function(item) {
        if (classes.indexOf(item) < 0) {
            element.classList.remove(item);
        }
    });

    classes.forEach(function(item) {
        element.classList.add(item);
    });
}

})(kk);

(kk => {
kk.class_forever = function(name, element) {
    element.classList.add(name);

    var mo = new MutationObserver(function(mutations) {
        mutations.forEach(function(record) {
            if (
                (record.attributeName === 'class') &&
                (record.target === element) &&
                !element.classList.contains(name)
            ) {
                element.classList.add(name);
            }
        });
    });

    mo.observe(element, {attributes: true /*MutationObserverInit*/});
    //mo.disconnect();
}

})(kk);

(kk => {
kk.Event = class kkEvent{
        constructor() {
        this.listeners = [];
        this.queue = [];
        this.state = {
            last: void 0,
            processed: false,
            completed: false
        }
    }

    hasListener(listener) {
        return this.listeners.find(item => item === listener);
    }

    addListener(listener) {
        if (typeof listener !== `function`)
            throw TypeError();

        if (this.hasListener(listener))
            return;

        if (this.state.completed)
            listener(...this.state.last);
        else
            this.listeners.push(listener);

        // Новые слушатели, появившиеся в процессе обхода существующих
        // попадают также в очередь выполнения
        if (this.state.processed)
            this.queue.push(listener);
    }

    removeListener(listener) {
        if (typeof listener !== `function`)
            return;

        this.listeners = this.listeners.filter(item => item !== listener);
    }

    dispatch(...data) {
        if (this.state.completed)
            return;

        this.state.processed = true;
        this.state.last = data;

        this.listeners.forEach(listener => {
            listener(...data);
        });

        while (this.queue.length > 0) {
            const listener = this.queue.shift();
            listener(...data);
        }

        this.state.processed = false;
    }

    complete() {
        if (this.state.completed)
            return;

        this.dispatch.apply(this, arguments);

        this.state.completed = true;
    }
}

})(kk);

(kk => {
kk.find_ancestor = function(descendant, keys, distance) {
    if (!kk.is.n(distance))
        distance = false;

    if (kk.is.s(keys))
        keys = [keys];

    if (kk.is.A(keys)) {
        return kk.each (keys, function(key) {
            if (kk.is.s(key))
                return type(descendant, key, distance);
        });
    }
}

function type(descendant, key, distance) {
    if (key[0] === '#')
        return find(descendant, key.substring(1), distance, true);
    if (key[0] === '.')
        return find(descendant, key.substring(1), distance, false);

    return find(descendant, key, distance, false);
}

function find(descendant, key, distance, type) {
    if (distance !== false && --distance < 0)
        return;

    if (
        kk.is.E(descendant) &&
        ('parentNode' in descendant) &&
        kk.is.E(descendant.parentNode)
    ) {
        var parent = descendant.parentNode;

        if (type) {
            if (parent.getAttribute('id') === key)
                return parent;
        } else {
            if (parent.classList.contains(key))
                return parent;
        }

        return find(parent, key, distance, type);
    }
}

})(kk);

(kk => {
kk.format = {};

const split = string => {
    if (!kk.is.s(string))
        throw new TypeError('Expected a string');

    let output = string;

    output = output.replace(/([\s-–—_]+)/g, `-`);
    output = output.replace(/([a-z])([A-Z])/g, `$1-$2`);
    output = output.toLowerCase();

    return output.split('-');
}

//kenzo.num_to_ru = function(n) {
//    if (typeof n == 'number')
//        return n.toString().replace(/\./,',');
//    if (typeof n == 'string')
//        return n.replace(/\./,',');
//}

kk.format.camelize = (string, dont_first_letter) =>
    split(string).map((part, index) => {
        let first_letter = part.charAt(0);
        
        if (!(index === 0 && dont_first_letter))
            first_letter = first_letter.toUpperCase();

        return first_letter + part.substr(1);
    }).join('');

kk.format.capitalize = (string) =>
    string.charAt(0).toUpperCase() + string.substr(1);

kk.format.date_range_to_string = (start, end) => {
    if (kk.is.s(start))
        start = new Date(start);

    if (kk.is.s(end))
        end = new Date(end);

    if (kk.is.D(start) && kk.is.D(end)) {
        return `с ${ kk.date_to_string(start) } по ${ kk.date_to_string(end) }`
    } else {
        throw new Error(kk.msg.ia);
    }
}

kk.format.date_to_string = input => {
    const months = [
        'января',
        'февраля',
        'марта',
        'апреля',
        'мая',
        'июня',
        'июля',
        'августа',
        'сентября',
        'октября',
        'ноября',
        'декабря'
    ];

    let output = [];
    let now = new Date();

    if (kk.is.s(input)) {
        input = new Date(input);
    }

    if (!(kk.is.D(input)))
        return input;

    let day = input.getDate();
    let month = months[input.getMonth()];
    let year = input.getFullYear();

    output.push(day);
    output.push(month);

    if (year !== now.getFullYear())
        output.push(year);

    return output.join(' ');
}

kk.format.decamelize = string => split(string).join('-');

kk.format.number = input => {
    if (kk.is.n(input))
        input = String(input);

    if (!kk.is.s(input) || input === '')
        throw new TypeError();

    var output = '';
    var delimiter = ' ';

    kk.each (input.split(''), function(item, index) {
        output = item + output;

        if (index !== 0 && (input.length - index) % 3 === 0) {
            output = delimiter + output;
        }

    }, true);

    return output;
}

// Российские номера
// TODO: не только российские
kk.format.phone = input => {
    if (kk.is.n(input))
        input = String(input);

    if (!kk.is.s(input) || input === '')
        throw new TypeError();

    var output = '';
    var number = input
        .replace(/[^\d]/g, '')
        .match(/^(?:7|8)([\d]{10})/);

    if (number === null)
        return;

    number = number[1];

    output = '+7 ('
        + number.slice(0, 3) + ') '
        + number.slice(3, 6) + '-'
        + number.slice(6, 8) + '-'
        + number.slice(8, 10);

    return output;
}

kk.format.seconds_to_string = seconds => {
    if (!kk.is.n(seconds))
        return seconds;

    const time = [           // 1        2 3 4     5 6 7 8 9
        ['seconds',      1, ['секунда', 'секунды', 'секунд']],
        ['minutes',     60, ['минута', 'минуты', 'минут']],
        ['hours',     3600, ['час', 'часа', 'часов']],
        ['days',     86400, ['день', 'дня', 'дней']],
        ['weeks',   604800, ['неделя', 'недели', 'недель']],
        ['months', 2592000, ['месяц', 'месяца', 'месяцев']],
        ['years', 22118400, ['год', 'года', 'лет']]
    ].map(unit => {
        return {
            unit: unit[0],
            value: Math.abs(Math.round(seconds / unit[1])), // !!!
            forms: unit[2]
        }
    }).filter(unit => Math.abs(unit.value) > 1).pop();

    return `${ time.value } ${ kk.plural(time.value, time.forms) }`;
}

})(kk);

(kk => {
kk.generate_key = length => {
    if (!kk.is.n(length) || length < 1)
        length = 1;

    return Array(length).fill('').reduce((prev, item) =>
        prev + String.fromCharCode(kk.rand(19968, 40869))
    , '');
};

})(kk);

(kk => {
kk.get_buffer = function(/*url, [ranges,] in_one_request =  false*/) {
//    console.log(arguments);

    var args = Array.prototype.slice.call(arguments);

    return new Promise((resolve, reject) => {
        try {
            var url = args.shift();
            var ranges;
            var in_one_request = false;

            if (args.length > 1 && kk.is.b(args[args.length - 1]))
                in_one_request = args.pop();

            ranges = args;

//            console.log(url, ranges, in_one_request);

            if (!kk.is.s(url))
                reject('URL не задан');

            if (
                (ranges.length === 0) ||
                (ranges.length === 1 && ranges[0] === 0)
            ) {
                get_whole_file(url).then(resolve, reject);
                return;
            }

            // Валидация запроса
            ranges = ranges.map(function(item, i) {
                if (
                    kk.is.n(item) || (
                        kk.is.A(item) &&
                        kk.is.n(item[0]) && item[0] >= 0 &&
                        kk.is.n(item[1]) && item[1] >= 0
                    )
                ) {
                    return item;
                }

                return false;
            });

            // console.warn(ranges);

            if (in_one_request) {
                // TODO: Попилить классику, если она вообще нужна

                // var separator = (function(type){
                //     var out = type.match(/boundary=(.+)$/);
                //     if (out && out[1])
                //         return out[1];
                //     else
                //         return false;
                // })(xhr.getResponseHeader('Content-Type'));
                // var parts = get_separated_parts(xhr.response, separator);
                //
                // ranges.forEach(function(item) {
                //     if (item !== false) {
                //         response.push(parts.shift());
                //     } else {
                //         response.push(false);
                //     }
                // });
                // resolve(response);

            } else {
                if (ranges.length === 1) {
                    get_part(url, ranges[0]).then(resolve, reject);
                } else {
                    Promise.all(ranges.map(function(range, i) {
                        if (range !== false)
                            return get_part(url, range);
                    })).then(resolve, reject);
                }
            }

        } catch (error) {
            console.error(error);
            // throw error;
        }
    });
};

function range_to_string(range) {
    if (kk.is.n(range)) {
        if (range >= 0) {
            // Содержимое начиная с range байта файла
            return(range + '-');
        } else {
            // Содержимое начиная с range байта с конца файла
            return(range);
        }
    }

    if (kk.is.A(range) &&
        kk.is.n(range[0]) && range[0] >= 0 &&
        kk.is.n(range[1]) && range[1] >= 0
    ) {
        return(range[0] + '-' + range[1]);
    }
}

function get_whole_file(url) { return new Promise(function(resolve, reject) {
    try {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'arraybuffer';

        xhr.addEventListener('loadend', function(event) {
            if (xhr.status === 200) {
                resolve(convert_xhr(xhr));
            } else {
                reject({
                    url: xhr.responseURL,
                    status: xhr.status,
                    range: xhr.getResponseHeader('Content-Type')
                });
            }
        });

        xhr.send();

    } catch (error) {
        console.error(error);
        // throw error;
    }
})}

function get_part(url, range) { return new Promise(function(resolve, reject) {
    try {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'arraybuffer';
        xhr.setRequestHeader('Range', 'bytes=' + range_to_string(range));

        xhr.addEventListener('loadend', function(event) {
            if (xhr.status === 206) {
                if (xhr.getResponseHeader('Content-Range')) {
                    var response = convert_xhr(xhr);
                    response.range = range;
                    resolve(response);
                }
            } else {
                console.error(url, range, xhr.status);
                console.log('range >', xhr.getResponseHeader('Content-Type'));
                reject([url, range, xhr.status])
            }
        });

        xhr.send();

    } catch (error) {
        console.error(error);
        // throw error;
    }
})}

function convert_xhr(xhr) {
    return {
        'headers': xhr.getAllResponseHeaders(),
        'getHeader': function(name) {
            return xhr.getResponseHeader(name);
        },
        'content': xhr.response
    }
}

function get_separated_parts(response, separator) {
    var out = [];
    var ranges = separate(response, separator);

    ranges.forEach(function(item) {
        var headers = '';
        var headers_array = new Uint8Array(
            response,
            item.headers,
            item.begin - 4 - item.headers
        );

        headers_array.forEach(function(item) {
            headers += String.fromCharCode(item);
        });

        out.push({
            'headers': headers,
            'getHeader': function(header) {
                var regexp = new RegExp(header + ': (.+)');
                var matches = this.headers.match(regexp);
                return matches[1];
            },
            'content': response.slice(item.begin, item.end)
        });
    });

    return out;
};

function separate(response, separator){
    var view = new Uint8Array(response);
    var ranges = [];
    var cur = 0;
    // indian Magic (рождённое в муках)
    // Не знаю как, но это работает >__>
    // Поиск начала данных раздела
    while (cur < response.byteLength){
        if ((view[cur] === 45) && (view[cur + 1] === 45)){
            cur += 2;

            for (var i = 0; i < separator.length; i++) {
                if (separator.charCodeAt(i) === view[cur]){
                    if (i == separator.length - 1){
                        cur++;
                        // Если после разделителя идёт перенос
                        if (view[cur] === 13 && view[cur + 1] === 10){
                            cur += 2;
                            if (ranges.length > 0){
                                ranges[ranges.length - 1].end =
                                    cur - separator.length - 6;
                            }

                            ranges.push({headers: cur});

                            while (
                                cur < response.byteLength &&
                                !(view[cur + 2] === 45 && view[cur + 3] === 45)
                            ){
                                if (
                                    view[cur] === 13 && view[cur + 1] === 10 &&
                                    view[cur + 2] === 13 && view[cur + 3] === 10
                                ){
                                    cur += 4;
                                    break;
                                } else {
                                    cur++;
                                }
                            }

                            if (cur !== response.byteLength - 1)
                                ranges[ranges.length - 1].begin = cur;

                        } else if (view[cur] === 45 && view[cur + 1] === 45){
                            // Последние два дефиса
                            ranges[ranges.length - 1].end =
                                cur - separator.length - 4;
                        }
                    }
                } else {
                    break;
                }

                cur++;
            }
        } else {
            cur++;
        }
    }

    return ranges;
}

})(kk);

(kk => {
kk.get_offset = function(element) {
    var boundingClientRect = element.getBoundingClientRect();

    return {
        top: boundingClientRect.top + window.pageYOffset,
        left: boundingClientRect.left + window.pageXOffset,
        width: boundingClientRect.width,
        height: boundingClientRect.height
    }
}

})(kk);

(kk => {
kk.i8to2 = function(int8) {
    var output = int8.toString(2);

    while (output.length < 8) {
        output = '0' + output;
    }

    return output;
}

kk.i8ArrayTo2 = function(array) {
    var output = '';

    array.forEach(function(item) {
        output += kk.i8to2(item);
    });

    return output;
}

kk.i8ArrayToString = function(array) {
    var output = '';

    array.forEach(function(item) {
        output += String.fromCharCode(item);
    });

    return output;
}

})(kk);

(kk => {
// Локальное хранилище
kk.ls = (function(kk, localStorage) {
    const _ = {};

    _.on_change = new kk.Event();

    _.create = (key, value = null) => {
        if (kk.is.s(key) && !localStorage.getItem(key)) {
            _.set(key, value, true);
        }
    }

    _.get = (address, default_value) => {
        const data = localStorage.getItem(address);

        if (!data && kk.is.o(default_value))
            return _.set(address, default_value);

        return JSON.parse(data);
    }

    _.ts = address => localStorage.getItem(`@` + address);

    _.set = (address, data, mute) => {
        localStorage.setItem(address, JSON.stringify(data));
        localStorage.setItem(`@` + address, Date.now());

        mute || _.on_change.dispatch();

        return data;
    }

    _.remove = (address) => {
        localStorage.removeItem(address)
        localStorage.removeItem(`@` + address)

        _.on_change.dispatch(`remove`);
    }

    return _;

})(kk, localStorage);

})(kk);

(kk => {
kk.plural = function() {
    // TODO: Для других языков.

    var lang = 'ru';
    var langs = ['ru'];
    var args = arguments;
    var first = args[0];
    var second = args[1];
    var amount, singular, paucal, plural, fr;

    if (kk.is.s(first)) {
        if (langs.indexOf(first) > -1) {
            lang = first;
            return true;
        } else
            return false;
    }

    if (kk.is.n(first)) {
        amount = first;
    } else if (kk.is.A(first)) {
        amount = first.length;
    } else if (kk.is.o(first)) {
        // NOTE: Может убрать к херам?
        amount = 0;
        for (var j in first)
            amount++;
    } else
        return false;

    if (amount < 0)
        amount = -amount;

    if (
        kk.is.A(second) &&
        kk.is.s(second[0]) &&
        kk.is.s(second[1]) &&
        kk.is.s(second[2])
    ) {
        singular = second[0];
        paucal = second[1];
        plural = second[2];

    } else if (
        kk.is.s(args[1]) &&
        kk.is.s(args[2]) &&
        kk.is.s(args[3])
    ) {
//        kk.__d();
        return kk.plural(amount, [args[1], args[2], args[3]]);
    } else
        return false;

    (fr = amount.toString().match(/(\.\d+)/)) &&
        (amount *= Math.pow(10, fr[0].length - 1));

    if (fr !== null)
        return plural;
    if ((amount % 10 == 1) && (amount % 100 != 11))
        return singular;
    else
        if ((amount % 10 >= 2) && (amount % 10 <= 4) &&
            ((amount % 100 < 10) || (amount % 100 >= 20)))
            return paucal;
        else
            return plural;
}

})(kk);

(kk => {
// Обёртка IDB для простых операций с одним хранилищем (storage);
class SimpleStore {
    constructor(schema) {
        if (!kk.is.o(schema))
            throw new TypeError();

        if (!kk.is.s(schema.name))
            throw new TypeError();

        if (!kk.is.o(schema.store))
            throw new TypeError();

        if (!kk.is.s(schema.store.name))
            throw new TypeError();

        // Если версия не указана и база с таким названием не найдена,
        // то будет создана база данных указанным названием и версией 1.

        // Если версия не указана и база с таким названием найдена,
        // то соединение с ней будет открыто без изменения версии
        // (то есть с текущей версией).

        if (('version' in schema) && !kk.is.n(schema.version))
            throw new TypeError();

        const self = this;

        this.schema = schema;

        this.db = new Promise((resolve, reject) => {
            const request = indexedDB.open(schema.name, schema.version);

            request.onupgradeneeded = self.upgrade.bind(self);

            request.onsuccess = event => resolve(request.result);

            request.onerror = event => reject(event);

            request.onblocked = event => reject(event);
        });
    }

    upgrade (event) {
        const self = this;
        const database = event.target.result;
        const name = this.schema.store.name;
        const key = this.schema.store.key || false;
        const indexes = kk.is.A(this.schema.store.indexes) ? this.schema.store.indexes : [];
        const options = {};

        if (database.objectStoreNames.contains(name)) {
            database.deleteObjectStore(name);
            console.log('SimpleStore: хранилище удалено');
        }

        if (key) {
            options.keyPath = key;
        } else {
            options.autoIncrement = true;
        }

        const store = database.createObjectStore(name, options);

        each (indexes, name => {
            store.createIndex(name, name);
        });
    }

    put (data) {
        const self = this;

        return new Promise((resolve, reject) => {
            self.db.then(db => {
                const request = db
                    .transaction(self.schema.store.name, 'readwrite')
                    .objectStore(self.schema.store.name)
                    .put(data);

                request.onsuccess = event => {
                    resolve(event.target.result);
//                    db.close(); // closePending

                };

                request.onerror = event => {
                    reject(event);
                };

            }, reject);
        });
    }

    get (id, index) {
        const self = this;

        return new Promise((resolve, reject) => {
            self.db.then(db => {
                let store = db
                    .transaction(self.schema.store.name, 'readonly')
                    .objectStore(self.schema.store.name);

                if (kk.is.s(index) && self.schema.store.indexes.includes(index)) {
                    store = store.index(index);

                    const key = IDBKeyRange.only(id);
                    const request = store.openCursor(key);
                    const result = [];

                    request.onsuccess = event => {
                        let cursor = event.target.result;

                        if (cursor) {
                            result.push(cursor.value);
                            cursor.continue();
                        } else {
                            if (result.length > 0)
                                resolve(result);
                            else
                                reject(event);
                        }
                    }

                    request.onerror = event => {
                        reject(event);
                    };
                } else {
                    let request = store.get(id);
                    request.onsuccess = event => {
                        if (request.result)
                            resolve(request.result);
                        else
                            reject();
                    }

                    request.onerror = event => {
                        reject(event);
                    };
                }

            }, reject);
        });
    }

    // TODO: delete
    delete (id, index) {

    }

    drop () {

    }
}

kk.SimpleStore = SimpleStore;

})(kk);

(kk => {
if (!kk.d) return;

var define = Object.defineProperty;
var body = kk.d.body;
var viewport = {
    body: {},
};

viewport.root = viewport.body; // DEPRECATED
kk.viewport = viewport;

if (kk.is.n(kk.r.pageXOffset)) {
    define(viewport, 'x', {
        get: function() {
            return kk.r.pageXOffset
        }
    });

    define(viewport, 'y', {
        get: function() {
            return kk.r.pageYOffset
        }
    });

} else {
    define(viewport, 'x', {
        get: function() {
            return (kk.d || body.parentNode || body).scrollLeft
        }
    });

    define(viewport, 'y', {
        get: function() {
            return (kk.d || body.parentNode || body).scrollTop
        }
    });
}

define(viewport, 'w', {
    get: function() {
        return kk.r.innerWidth
    }
});

define(viewport, 'h', {
    get: function() {
        return kk.r.innerHeight
    }
});

define(viewport.body, 'w', {
    get: function() {
        return kk.d.clientWidth
    }
});

define(viewport.body, 'h', {
    get: function() {
        return kk.d.clientHeight
    }
});

})(kk);

(kk => {
const PROXI_STORAGE_NAME = '__proxy__';

kk.ProxyStorage = class ProxyStorage {
    constructor() {}
}

function process(input) {
    var output = [];

    var check_and_push = function(item) {
        if (!~output.indexOf(item))
            output.push(item);
    };

    input.forEach(function(item) {
        if (kk.is.s(item)) {
            check_and_push(item);
        } else if (kk.is.A(item)) {
            process(item).forEach(check_and_push);
        }
    });

    return output;
}

kk.watch = (object, ...properties) => {
    const callback = properties.pop();

    if (
        (!kk.is.o(object) || object === null) ||
        (!kk.is.f(callback) && !(callback instanceof kk.Event)) ||
        (properties.length > 0 && !kk.is.s(...properties))
    )
        throw new TypeError();

    if (!object.hasOwnProperty(PROXI_STORAGE_NAME)) {
        Object.defineProperty(object, PROXI_STORAGE_NAME, {
            enumerable: false,
            writable: true
        });
    }

    if (!(object[PROXI_STORAGE_NAME] instanceof kk.ProxyStorage)) {
        object[PROXI_STORAGE_NAME] = new kk.ProxyStorage();
    }

    const proxy_storage = object[PROXI_STORAGE_NAME];

    // Имена свойств не заданы, прокси для каждого ключа
    if (properties.length === 0) {
        properties = Object.keys(object);
    } else {
        properties = process(properties);
    }

    properties.forEach(function(property) {
        // Проверка существования прокси
        if (property in proxy_storage)
            return;

        // Cуществует ли уже такое свойство
        if (property in object) {
            proxy_storage[property] = object[property];
            delete object[property];
        } else {
            proxy_storage[property] = void(0);
        }

        // Создание прокси
        // FIXME: привести в соответствие с Proxy
        Object.defineProperty(object, property, {
            enumerable: true,
            get: () => proxy_storage[property],
            set: (new_value) => {
                const prev_value = proxy_storage[property];
                proxy_storage[property] = new_value;

                if (new_value !== prev_value) {
                    if (callback instanceof kk.Event)
                        callback.dispatch(prev_value, new_value);
                    else
                        callback(prev_value, new_value);
                }
            }
        });
    });
}

})(kk);
