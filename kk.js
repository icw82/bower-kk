(function() {
'use strict';

var root;
var cons = console;
var kenzo = {
    v: '0.2.0',
//    r: root // window or global
    w: false, // window (global if not)
    d: false, // root.document
//    _b: 'boolean',
//    _u: 'undefined',
//    _o: 'object',
//    _f: 'function',
//    _s: 'string',
//    _n: 'number',
//    _A: Array,
//    _E: Element,
//    _N: Node,
//    _NL: NodeList,
//    _C: HTMLCollection,
};

kenzo.msg = {
    cb: 'Обратный вызов не определён или не является функцией',
    ia: 'Некорректные аргументы'
};

kenzo.__a = function() {cons.error(kenzo.msg.ia)};
kenzo.__d = function() {cons.warn('Depricated')};
kenzo.__ae = function() {cons.warn('Уже существует')};

// TODO: errors

['undefined', 'boolean', 'number', 'string', 'object', 'function'].forEach(function(s) {
    kenzo['_' + s[0]] = s;
    kenzo['is_' + s[0]] = function(a) {return typeof a === s}
});

if (
    kenzo.is_o(window) &&
    (kenzo.is_f(Window) || kenzo.is_o(Window)) &&
    (window instanceof Window)
) {
    root = window;
    kenzo.w = window;
} else if (kenzo.is_o(global)) {
    root = global;
}

if (kenzo.is_o(root.document))
    kenzo.d = root.document;

[
    [Array, 'A'],
    [Element, 'E'],
    [Node, 'N'],
    [NodeList, 'NL'],
    [HTMLCollection, 'C']
].forEach(function(p) {
    if (typeof p[0] !== kenzo._u && ( kenzo.is_f(p[0]) || kenzo.is_o(p[0]) ) ) {
        kenzo['_' + p[1]] = p[0];
        kenzo['is_' + p[1]] = function(a) {return a instanceof p[0]}
    }
});

root.kenzo = root.kk = kenzo;

kenzo.ts = function() {
    var time = new Date();
    return time.getTime();
}

if (typeof module !== kenzo._u && kenzo.is_o(module) && kenzo.is_o(module.exports)) {
    // FUTURE: запилить для ноды
    module.exports = kenzo;
}

kenzo.r = root;

}());

// Перебор массива
//
// Перебор прерывается, eсли обратная функция возвращает значение, отличное от undefined и false.
// Если третий аргумент функция — то она выполяется после перебора массива,
//     если обратная функция ниразу не возвращала true
// Если последний элемент === true, перебор производится в обратном порядке.

// TODO: MutationRecord;

kk.each = function() {
    var kenzo = kk;
    var args = arguments;
    var array = [];
    var first = args[0];
    var callback = args[1];

    if (!kenzo.is_f(callback))
        throw kk.msg.cb;

    var def = kenzo.is_f(args[2]) ? args[2] : false;
    var last = args[args.length - 1];
    var reverse = kenzo.is_b(last) ? last : false;
    var index;
    var result;
    var pseudo = false;

    if (kenzo.is_s(first) && kenzo.d) {
        array = kenzo.d.querySelectorAll(first);
    } else if (kenzo.is_n(first)) {
        array = kenzo._A(Math.floor(Math.max(0, first)));
        pseudo = true;
    } else if (ArrayBuffer.isView(first) && (first.length > 0)) {
        array = kenzo._A.prototype.slice.call(first);
    } else if (kenzo.is_A(first) || kenzo.is_NL(first) || kenzo.is_C(first)) {
        array = first;
    }

    if (array.length > 0) {
        if (reverse) {
            for (index = array.length - 1; index >= 0; index--) {
                result = callback(pseudo ? index : array[index], index, array);
                if (!kenzo.is_u(result))
                    return result;
            }
        } else {
            for (index = 0; index < array.length; index++) {
                result = callback(pseudo ? index : array[index], index, array);
                if (!kenzo.is_u(result))
                    return result;
            }
        }
    }

    if (def) {
        return def();
    }
};

if (typeof kk.r.each === kenzo._u)
    kk.r.each = kk.each;

/**
 * Случайное целое число
 * param {Number} Минимальное значение или разрядность слуайного числа,
 *     если не указан второй аргумент
 * param {Number} Максимальное значение
 * @returns {Number} Случайное число из заданного диапазона
 */
kk.rand = function() {
    var kenzo = kk,
        args = arguments,
        min,
        max;

    if (typeof args[0] == kenzo._n) {
        if (typeof args[1] == kenzo._n) {
            min = args[0];
            max = args[1] + 1;

            return Math.floor( Math.random() * (max - min) ) + min;
        } else {
            var depth = args[0];

            if (depth < 0)
                depth = -depth;

            if (depth < 16) {
                depth = Math.floor(depth);

                if (depth === 0)
                    return 0;
                else if (depth === 1)
                    min = 0;
                else
                    min = Math.pow(10, depth - 1);

                return kenzo.rand(min, Math.pow(10, depth) - 1);

            } else
                kenzo.__a();
        }
    } else // TODO: boolian если нет аргументов
        kenzo.__a();
};

kk.class = function(element, classes, mask) {
    var kenzo = kk,
        each = kenzo.each,
        abort;

    if (element instanceof kenzo._E) {
        if (typeof classes == kenzo._s)
            classes = [classes];

        each (classes, function(c) {
            if (typeof c != kenzo._s) {
                abort = true;
                return true;
            }
        });

        if (!abort && classes instanceof kenzo._A) {
            if (typeof mask == kenzo._u)
                mask = [];

            if (mask instanceof kenzo._A) {
                each (mask, function(c) {
                    if (typeof c != kenzo._s) {
                        abort = true;
                        return true;
                    }
                });

                if (!abort) {
                    each (mask, function(c) {
                        if (classes.indexOf(c) < 0) {
                            element.classList.remove(c);
                        }
                    });

                    each (classes, function(c) {
                        element.classList.add(c);
                    });

                    return true;
                } else
                    kenzo.__a();
            } else
                kenzo.__a();
        } else
            kenzo.__a();
    } else
        kenzo.__a();
}

kk.class_forever = function(class_name, element){
    element.classList.add(class_name);

    var mo = new MutationObserver(function(mutations){
        each (mutations, function(mr){
            if (
                (mr.attributeName == 'class') &&
                (mr.target == element) &&
                !element.classList.contains(class_name)
            ){
                element.classList.add(class_name);
            }
        });
    });

    mo.observe(element, {attributes: true /*MutationObserverInit*/});
    //mo.disconnect();
}

kk.Event = function(key) {
    var kenzo = kk;
    var listeners = [];

    Object.defineProperty(this, 'key', {
        get: function() {return key}
    });

    this.hasListener = function(listener) {
        return kenzo.each (listeners, function(item) {
            return item === listener;
        });
    }

    this.addListener = function(listener) {
        if (!kenzo.is_f(listener) || this.hasListener(listener))
            return;

        listeners.push(listener);
    }

    this.removeListener = function(listener) {
        if (!kenzo.is_f(listener))
            return;

        listeners = listeners.filter(function(item) {
           return item !== listener;
        });
    }

    // Если ключ задан, то он передаётся первым аргументом.
    this.dispatch = function() {
        var args = arguments;
        var data;

        if (kenzo.is_u(this.key)) {
            data = args[0];
        } else {
            if (this.key === args[0]) {
                data = args[1];
            } else {
                return;
            }
        }

        kk.each (listeners, function(listener) {
            listener(data);
        });
    }
};


// TODO: переработать
kk.event = (function() {
    var _ = {},
        create_event = document.createEvent;

    _.resize = function(delay) {
        if (typeof create_event == kk._f) {
            var event = create_event('Event');
            event.initEvent('resize', true, true);
            window.dispatchEvent(event);
        }
    }

    _.stop = function(event) {
        event = event || window.event;

        if (!event)
            return false;

        while (event.originalEvent) {
            event = event.originalEvent
        }

        if (event.preventDefault)
            event.preventDefault();
        if (event.stopPropagation)
            event.stopPropagation();

        event.cancelBubble = true;

        return false;
    }

    return _;

})();

kk.find_ancestor = function(descendant, keys, distance) {
    var kenzo = kk;
    if (!kenzo.is_n(distance))
        distance = false;

    if (kenzo.is_s(keys))
        return type(keys);

    if (kenzo.is_A(keys)) {
        return kenzo.each (keys, function(key) {
            if (kenzo.is_s(key))
                return type(key);
        });
    }

    function type(key) {
        var dist = distance;
        if (key[0] === '#')
            return find(descendant, key.substring(1), dist, true);
        if (key[0] === '.')
            return find(descendant, key.substring(1), dist, false);

        return find(descendant, key, dist, false);
    }

    function find(descendant, key, distance, type) {
        if (distance !== false && --distance < 0)
            return;

        if (
            kenzo.is_E(descendant) &&
            ('parentNode' in descendant) &&
            kenzo.is_E(descendant.parentNode)
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
}

kk.format = (function() {
    var each = kk.each,
        _ = {};

    _.number = function(string) {
        var _ = '',
            delimiter = ' ';

        if (string && string != '') {
            var numbers = String(string);
            numbers = numbers.split('');

            each (numbers.length, function(item, i) {
                _ = numbers[i] + _;

                if (i !== 0 && (numbers.length - i) % 3 === 0) {
                    _ = delimiter + _;
                }

            }, true);
        }

        return _;
    }

    // Российские номера
    // TODO: не только российские
    _.phone = function() {
        if (arguments.length === 0)
            return false;

        if (typeof arguments[0] !== 'string')
            return false;

        var string = arguments[0],
            number = string
                .replace(/[^\d]/g, '')
                .match(/^(?:7|8)([\d]{10})/);

        if (number === null)
            return false;

        number = number[1];

        return '+7 ('
            + number.slice(0, 3) + ') '
            + number.slice(3, 6) + '-'
            + number.slice(6, 8) + '-'
            + number.slice(8, 10);
    }

    return _;
})();

//kenzo.num_to_ru = function(n) {
//    if (typeof n == 'number')
//        return n.toString().replace(/\./,',');
//    if (typeof n == 'string')
//        return n.replace(/\./,',');
//}

kk.generate_key = function(length) {
    if (typeof length !== 'number') {
        length = 1;
        console.warn('generate_key 1');
    }

    if (length < 1) {
        length = 1;
        console.warn('generate_key 2');
    }

    var key = '';

    each (length, function() {
        key += String.fromCharCode(kk.rand(19968, 40869));
    });

    return key;
};

// TODO: возможность задавать промежутки разными способами (начало--конец, начало--длина).

/*
Examples of byte-ranges-specifier values (assuming an entity-body of
length 10000):

   - The first 500 bytes (byte offsets 0-499, inclusive):
     bytes=0-499

   - The second 500 bytes (byte offsets 500-999, inclusive):
     bytes=500-999

   - The final 500 bytes (byte offsets 9500-9999, inclusive):
     bytes=-500

   - Or bytes=9500-

   - The first and last bytes only (bytes 0 and 9999):
     bytes=0-0,-1

   - Several legal but not canonical specifications of the second 500
     bytes (byte offsets 500-999, inclusive):
     bytes=500-600,601-999
     bytes=500-700,601-999

*/

(function(kk){
'use strict';

kk.get_buffer = function(url /*[, range1[, rangeN]]*/) {
    var ranges = kenzo._A.prototype.slice.call(arguments).splice(1);

    return new Promise(function(resolve, reject) {
        if (!kk.is_s(url))
            throw new Error(kk.msg.ia);

        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);

        if (ranges.length !== 0) {
            var bytes = [];

            ranges = ranges.map(function(item, i) {
                if (kk.is_n(item)) {
                    if (item >= 0) {
                        bytes.push(item + '-');
                    } else {
                        bytes.push(item);
                    }
                    return item;
                }

                if (kk.is_A(item) &&
                    kk.is_n(item[0]) && item[0] >= 0 &&
                    kk.is_n(item[1]) && item[1] >= 0
                ) {
                    bytes.push(item[0] + '-' + item[1]);
                    return item;
                }

                return false;
            });

            bytes = bytes.join(',');

            if (bytes !== '' && bytes !== '0-') {
                xhr.setRequestHeader('Range', 'bytes=' + bytes);
            }
        }

        function convert_xhr(xhr) {
            return {
                'headers': xhr.getAllResponseHeaders(),
                'getHeader': function(name) {
                    return xhr.getResponseHeader(name);
                },
                'content': xhr.response
            }
        }

        xhr.addEventListener('loadend', function() {
            if (xhr.status === 200) {
                resolve(convert_xhr(xhr));
            } else if (xhr.status === 206) {
                var response = [];

                if (xhr.getResponseHeader('Content-Range')) {
                    resolve(convert_xhr(xhr));
                } else {
                    var separator = (function(type){
                        var out = type.match(/boundary=(.+)$/);
                        if (out && out[1])
                            return out[1];
                        else
                            return false;
                    })(xhr.getResponseHeader('Content-Type'));
                    var parts = get_parts(xhr.response, separator);

                    kk.each (ranges, function(item) {
                        if (item !== false) {
                            response.push(parts.shift());
                        } else {
                            response.push(false);
                        }
                    });
                    resolve(response);
                }

            } else {
                console.error(xhr.status);
                console.log('bytes >', bytes);
                console.log('status >', xhr.status);
                console.log('range >', xhr.getResponseHeader('Content-Type'));

            }

        });

        xhr.responseType = 'arraybuffer';
        xhr.send();

    });
};

function get_parts(response, separator) {
    var out = [];
    var ranges = get_ranges(response, separator);

    kk.each (ranges, function(item) {
        var headers = '';
        var headers_array = new Uint8Array(
            response,
            item.headers,
            item.begin - 4 - item.headers
        );

        kk.each (headers_array, function(item) {
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

function get_ranges(response, separator){
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
                                ranges[ranges.length - 1].end = cur - separator.length - 6;
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
                            ranges[ranges.length - 1].end = cur - separator.length - 4;
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

kk.get_offset = function(element) {
    var boundingClientRect = element.getBoundingClientRect();

    // NOTE: Для ie8 может понадобиться полифилл
    return {
        top: boundingClientRect.top + window.pageYOffset,
        left: boundingClientRect.left + window.pageXOffset,
        width: boundingClientRect.width,
        height: boundingClientRect.height
    }
}

kk.i8to2 = function(int8) {
    var _ = int8.toString(2);
    while (_.length < 8) {
        _ = '0' + _;
    }
    return _;
}

kk.i8ArrayTo2 = function(array) {
    var _ = '';
    kk.each (array, function(item) {
        _ += kk.i8to2(item);
    });
    return _;
}

kk.i8ArrayToString = function(array) {
    var _ = '';
    kk.each (array, function(item) {
        _ += String.fromCharCode(item);
    });
    return _;
}

kk.is_nodes = function() {
    var arg = arguments[0];

    if ((typeof StaticNodeList == kk._o) && (arg instanceof StaticNodeList))
        if (arg.length > 0)
            return true;
        else
            return false;

    if (arg instanceof kk._NL)
        if (arg.length > 0)
            return true;
        else
            return false;
}

// Локальное хранилище
kk.ls = (function(kk, localStorage) {
    var _ = {};

    _.create = function() {
        kk.each (arguments, function(item) {
            if ((typeof item == kk._s) && (!localStorage.getItem(item))) {
                localStorage.setItem(item, JSON.stringify([]));
                localStorage.setItem('@' + item, kk.ts());
            }
        })
    }

    _.get = function(address) {
        return JSON.parse(localStorage.getItem(address));
    }

    _.ts = function(address) {
        return localStorage.getItem('@' + address);
    }

    _.update = function(address, data) {
        localStorage.setItem(address, JSON.stringify(data));
        localStorage.setItem('@' + address, kk.ts());

        return true;
    }

    return _;

})(kk, localStorage);

kk.plural = function() {
    // TODO: Для других языков.

    var kenzo = kk,
        lang = 'ru',
        langs = ['ru'],
        args = arguments,
        first = args[0],
        second = args[1],
        amount, singular, paucal, plural, fr;

    if (typeof first == kenzo._s) {
        if (langs.indexOf(first) > -1) {
            lang = first;
            return true;
        } else
            return false;
    }

    if (typeof first == kenzo._n) {
        amount = first;
    } else if (first instanceof kenzo._A) {
        amount = first.length;
    } else if (typeof first == kenzo._o) {
        // NOTE: Может убрать к херам?
        amount = 0;
        for (var j in first)
            amount++;
    } else
        return false;

    if (amount < 0)
        amount = -amount;

    if (
        (second instanceof kenzo._A) &&
        (typeof second[0] == kenzo._s) &&
        (typeof second[1] == kenzo._s) &&
        (typeof second[2] == kenzo._s)
    ) {
        singular = second[0];
        paucal = second[1];
        plural = second[2];

    } else if (
        (typeof args[1] == kenzo._s) &&
        (typeof args[2] == kenzo._s) &&
        (typeof args[3] == kenzo._s)
    ) {
        kenzo.__d();
        return kenzo.plural(amount, [args[1], args[2], args[3]]);
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

kk.proxy = (function(kk) {

    kk.ProxyStorage = function() {}

    var proxy_storage_name = '__proxy__';

    return function(/*object, [property(-ies),] callback*/) {
        var proxy_storage;
        var args = arguments;
        var object = args[0];

        // TODO: Добавить больше исключений
        if (
            typeof object !== kk._o ||
            object instanceof kk._A ||
            object instanceof kk._NL
        ) {
            kk.__a();
            return;
        }

        // Проверка существовоания хранилища переменных
        if (object[proxy_storage_name] instanceof kk.ProxyStorage) {
            proxy_storage = object[proxy_storage_name];
        }

        // Функция вторым аргументом
        if (typeof args[1] === kk._f) {
            var callback = args[1];
            // Прокси для каждого ключа
            return kk.proxy(object, Object.keys(object), callback);

        // Функция третьим аргументом
        } else if (typeof args[2] === kk._f) {
            var callback = args[2];

            // Массив вторым аргументом
            if (args[1] instanceof kk._A) {
                kk.each(args[1], create);
                // TODO: Не возвращает False
            } else {
                if (create(args[1]) === false)
                    return false;
            }
        } else {
            kk.__a();
            return;
        }

        function create(property) {
            // Имя свойства указано
            if (typeof property === kk._s) {
                if (!proxy_storage) {
                    Object.defineProperty(object, proxy_storage_name, {
                        enumerable: false,
                        writable: true
                    });

                    proxy_storage = object[proxy_storage_name] = new kk.ProxyStorage;
                }

                // Проверка существования прокси
                if (property in proxy_storage) {
                    kk.__ae();
                    return false;
                }

                // Cуществует ли уже такое свойство
                if (property in object) {
                    proxy_storage[property] = object[property];
                    delete object[property];
                } else {
                    proxy_storage[property] = void(0);
                }

                // Создание прокси
                Object.defineProperty(object, property, {
                    enumerable: true,
                    get: function() {return proxy_storage[property]},
                    set: function(new_value) {
                        proxy_storage[property] = new_value;
                        callback(object, property);
                    }
                });

            } else {
                kk.__a();
                return;
            }
        }

        return true;

    }

})(kk);

kk.viewport = (function(kenzo, window, document) {
    var root = document.documentElement;
    var body = document.body;
    var define = Object.defineProperty;
    var _ = {
        root: {}
    };

    if (window.pageXOffset !== kenzo._u) {
        define(_, 'x', {
            get: function() {
                return window.pageXOffset
            }
        });

        define(_, 'y', {
            get: function() {
                return window.pageYOffset
            }
        });

    } else {
        define(_, 'x', {
            get: function() {
                return (root || body.parentNode || body).scrollLeft
            }
        });

        define(_, 'y', {
            get: function() {
                return (root || body.parentNode || body).scrollTop
            }
        });
    }

    define(_, 'w', {
        get: function() {
            return window.innerWidth
        }
    });

    define(_, 'h', {
        get: function() {
            return window.innerHeight
        }
    });

    define(_.root, 'w', {
        get: function() {
            return root.clientWidth
        }
    });

    define(_.root, 'h', {
        get: function() {
            return root.clientHeight
        }
    });

    return _;

})(kk, window, document)
