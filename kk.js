'use strict';

(function() {
var root;
var cons = console;
var kenzo = {
    v: '0.12.0',
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

kenzo.msg = {
    cb: 'Обратный вызов не определён или не является функцией',
    ia: 'Некорректные аргументы',
    ae: 'Уже существует'
};

kenzo.err = {}; // errors

Object.keys(kenzo.msg)
    .forEach(function(key) {
        kenzo.err[key] = Error(kenzo.msg[key]);
    });

kenzo.__d = function() {cons.warn('Depricated')};

kenzo.__a = function() {
    cons.error(kenzo.msg.ia); kenzo.__d();
};
kenzo.__ae = function() {
    cons.warn(kenzo.msg.ae); kenzo.__d();
};

// TODO: errors

[
    'undefined',
    'boolean',
    'number',
    'string',
    'object',
    'function'
].forEach(function(s) {
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
    [ArrayBuffer, 'AB'],
    [Date, 'D'],
    [Element, 'E'],
    [Node, 'N'],
    [NodeList, 'NL'],
    [HTMLCollection, 'C']
].forEach(function(p) {
    if (
        typeof p[0] !== kenzo._u &&
        (kenzo.is_f(p[0]) || kenzo.is_o(p[0]))
    ) {
        kenzo['_' + p[1]] = p[0];
        kenzo['is_' + p[1]] = function(a) {return a instanceof p[0]}
    }
});

root.kenzo = root.kk = kenzo;

kenzo.ts = function() {
    var time = new Date();
    return time.getTime();
}

if (
    typeof module !== kenzo._u &&
    kenzo.is_o(module) &&
    kenzo.is_o(module.exports)
) {
    // FUTURE: запилить для ноды
    module.exports = kenzo;
}

kenzo.r = root;

})();

(function(kk) {
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

    if (!kk.is_f(callback))
        throw kk.err.cb;

    var def = kk.is_f(args[2]) ? args[2] : false;
    var last = args[args.length - 1];
    var reverse = kk.is_b(last) ? last : false;
    var index;
    var result;
    var pseudo = false;

    if (kk.is_s(first) && kk.d) {
        array = kk.d.querySelectorAll(first);
    } else if (kk.is_n(first)) {
        array = kk._A(Math.floor(Math.max(0, first)));
        pseudo = true;
    } else if (ArrayBuffer.isView(first) && (first.length > 0)) {
        array = kk._A.prototype.slice.call(first);
        //var args = (arguments.length === 1 ? [arguments[0]] : Array.apply(null, arguments));
    } else if (kk.is_A(first) || kk.is_NL(first) || kk.is_C(first)) {
        array = first;
    }

    if (array.length > 0) {
        if (reverse) {
            for (index = array.length - 1; index >= 0; index--) {
                result = callback(pseudo ? index : array[index], index, array);
                if (!kk.is_u(result))
                    return result;
            }
        } else {
            for (index = 0; index < array.length; index++) {
                result = callback(pseudo ? index : array[index], index, array);
                if (!kk.is_u(result))
                    return result;
            }
        }
    }

    if (def) {
        return def();
    }
};

if (typeof kk.r.each === kk._u)
    kk.r.each = kk.each;

})(kk);

(function(kk) {
// Случайное целое число
kk.rand = function() {
    var args = arguments;
    var min;
    var max;

    // Если аргументов нет — выдавать случайно true/false
    if (!kk.is_n(args[0]))
        return !Math.round(Math.random())

    // Если аргумент только один — задаёт разряд случайного числа
    if (!kk.is_n(args[1])) {
        var depth = Math.floor(Math.abs(args[0]));

        if (depth >= 16)
            throw kk.err.ia;

        if (depth === 0)
            return 0;

        if (depth === 1)
            min = 0;
        else
            min = Math.pow(10, depth - 1);

        return kk.rand(min, Math.pow(10, depth) - 1);

    }

    // Если два аргумента
    min = args[0];
    max = args[1] + 1;

    return Math.floor( Math.random() * (max - min) ) + min;

};

})(kk);

(function(kk) {
kk.class = function(element, classes, mask) {
    if (!kk.is_E(element))
        throw kk.err.ia;

    if (kk.is_s(classes))
        classes = [classes];

    if (!kk.is_A(classes))
        throw kk.err.ia;

    if (!kk.is_A(mask))
        mask = [];

    mask.forEach(function(item) {
        if (!kk.is_s(item))
            throw kk.err.ia;
    });

    classes.forEach(function(item) {
        if (!kk.is_s(item))
            throw kk.err.ia;
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

(function(kk) {
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

(function(kk) {
kk.Event = class kkEvent{
    constructor(key) {
        this.listeners = [];
        this.state = {
            last: undefined,
            completed: false
        }

        Object.defineProperty(this, 'key', {
            get: () => key
        });

    }

    hasListener(listener) {
        return this.listeners.find(item => item === listener);
    }

    addListener(listener) {
        if (!kk.is_f(listener) || this.hasListener(listener))
            return;

        if (this.state.completed)
            listener(...this.state.last);
        else
            this.listeners.push(listener);

    }

    removeListener(listener) {
        if (!kk.is_f(listener))
            return;

        this.listeners = this.listeners.filter(item => item !== listener);
    }

    // Если ключ задан, то он передаётся первым аргументом.
    dispatch(...data) {
        let key;

        if (this.state.completed)
            return;

        if (this.key !== undefined) {
            key = data.shift();
            if (key !== this.key)
                return false;
        }

        this.state.last = data;

        this.listeners.forEach(listener => listener(...data));
    }

    complete() {
        if (this.state.completed)
            return;

        this.dispatch.apply(this, arguments);
        this.state.completed = true;
    }

}

})(kk);

(function(kk) {
kk.find_ancestor = function(descendant, keys, distance) {
    if (!kk.is_n(distance))
        distance = false;

    if (kk.is_s(keys))
        keys = [keys];

    if (kk.is_A(keys)) {
        return kk.each (keys, function(key) {
            if (kk.is_s(key))
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
        kk.is_E(descendant) &&
        ('parentNode' in descendant) &&
        kk.is_E(descendant.parentNode)
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

(function(kk) {
kk.format = {
    number: number,
    phone: phone
};

//kenzo.num_to_ru = function(n) {
//    if (typeof n == 'number')
//        return n.toString().replace(/\./,',');
//    if (typeof n == 'string')
//        return n.replace(/\./,',');
//}

function number(input) {
    if (kk.is_n(input))
        input = String(input);

    if (!kk.is_s(input) || input === '')
        throw kk.err.ia;

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
function phone(input) {
    if (kk.is_n(input))
        input = String(input);

    if (!kk.is_s(input) || input === '')
        throw kk.err.ia;

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

})(kk);

(function(kk) {
kk.generate_key = length => {
    if (!kk.is_n(length) || length < 1)
        length = 1;

    return Array(length).fill('').reduce((prev, item) =>
        prev + String.fromCharCode(kk.rand(19968, 40869))
    , '');
};

})(kk);

(function(kk) {
kk.get_buffer = function(/*url, [ranges,] in_one_request =  false*/) {
    var args = kk._A.prototype.slice.call(arguments);

    return new Promise(function(resolve, reject) {
        try {
            var url = args.shift();
            var ranges;
            var in_one_request = false;

            if (args.length > 1 && kk.is_b(args[args.length - 1]))
                in_one_request = args.pop();

            ranges = args;

            // console.log(url, ranges, in_one_request);

            if (!kk.is_s(url)) {
                reject(kk.err.ia);
                return;
            }

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
                    kk.is_n(item) || (
                        kk.is_A(item) &&
                        kk.is_n(item[0]) && item[0] >= 0 &&
                        kk.is_n(item[1]) && item[1] >= 0
                    )
                ) {
                    return item;
                }

                // console.warn(kk.msg.ia, item);
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
    if (kk.is_n(range)) {
        if (range >= 0) {
            // Содержимое начиная с range байта файла
            return(range + '-');
        } else {
            // Содержимое начиная с range байта с конца файла
            return(range);
        }
    }

    if (kk.is_A(range) &&
        kk.is_n(range[0]) && range[0] >= 0 &&
        kk.is_n(range[1]) && range[1] >= 0
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

(function(kk) {
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

(function(kk) {
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

(function(kk) {
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

})(kk);

(function(kk) {
kk.plural = function() {
    // TODO: Для других языков.

    var lang = 'ru';
    var langs = ['ru'];
    var args = arguments;
    var first = args[0];
    var second = args[1];
    var amount, singular, paucal, plural, fr;

    if (kk.is_s(first)) {
        if (langs.indexOf(first) > -1) {
            lang = first;
            return true;
        } else
            return false;
    }

    if (kk.is_n(first)) {
        amount = first;
    } else if (first instanceof kk._A) {
        amount = first.length;
    } else if (typeof first == kk._o) {
        // NOTE: Может убрать к херам?
        amount = 0;
        for (var j in first)
            amount++;
    } else
        return false;

    if (amount < 0)
        amount = -amount;

    if (
        kk.is_A(second) &&
        kk.is_s(second[0]) &&
        kk.is_s(second[1]) &&
        kk.is_s(second[2])
    ) {
        singular = second[0];
        paucal = second[1];
        plural = second[2];

    } else if (
        kk.is_s(args[1]) &&
        kk.is_s(args[2]) &&
        kk.is_s(args[3])
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

(function(kk) {
// Обёртка IDB для простых операций с одним хранилищем (storage);
class SimpleStore {
    constructor(schema) {
        if (!kk.is_o(schema))
            throw kk.msg.ia;

        if (!kk.is_s(schema.name))
            throw kk.msg.ia;

        if (!kk.is_o(schema.store))
            throw kk.msg.ia;

        if (!kk.is_s(schema.store.name))
            throw kk.msg.ia;

        // Если версия не указана и база с таким названием не найдена,
        // то будет создана база данных указанным названием и версией 1.

        // Если версия не указана и база с таким названием найдена,
        // то соединение с ней будет открыто без изменения версии
        // (то есть с текущей версией).

        if (('version' in schema) && !kk.is_n(schema.version))
            throw kk.msg.ia;

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
        const indexes = kk.is_A(this.schema.store.indexes) ? this.schema.store.indexes : [];
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

                if (kk.is_s(index) && self.schema.store.indexes.includes(index)) {
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

(function(kk) {
if (!kk.d) return;

var define = Object.defineProperty;
var body = kk.d.body;
var viewport = {
    body: {},
};

viewport.root = viewport.body; // DEPRECATED
kk.viewport = viewport;

if (kk.is_n(kk.r.pageXOffset)) {
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

(function(kk) {
var proxy_storage_name = '__proxy__';

kk.ProxyStorage = function() {}

function process(input) {
    var output = [];

    var check_and_push = function(item) {
        if (!~output.indexOf(item))
            output.push(item);
    };

    input.forEach(function(item) {
        if (kk.is_s(item)) {
            check_and_push(item);
        } else if (kk.is_A(item)) {
            process(item).forEach(check_and_push);
        }
    });

    return output;
}

/* object, [property(-ies),] callback */
kk.watch = function() {
    var properties = [].slice.call(arguments);
    //var args = (arguments.length === 1 ? [arguments[0]] : Array.apply(null, arguments));
    var object = properties.shift();
    var callback = properties.pop();
    var proxy_storage;

    // TODO: Добавить больше исключений
    if (
        !kk.is_o(object) ||
        kk.is_A(object) ||
        kk.is_NL(object) ||
        !kk.is_f(callback)
    )
        throw kk.err.ia;

    // Проверка существовоания хранилища переменных
    if (object[proxy_storage_name] instanceof kk.ProxyStorage) {
        proxy_storage = object[proxy_storage_name];
    } else {
        Object.defineProperty(object, proxy_storage_name, {
            enumerable: false,
            writable: true
        });

        proxy_storage = object[proxy_storage_name] = new kk.ProxyStorage;
    }

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
            get: function() {return proxy_storage[property]},
            set: function(value) {
                proxy_storage[property] = value;
                callback(object, property);
            }
        });
    });
}

})(kk);
