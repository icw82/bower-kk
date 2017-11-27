'use strict';

(function(kk) {
/*
    Модуль для работы с графическим интерфейсом




    Структура страницы по KK
    body
        layout-global-wrapper
            layout-wrapper
                … content …
            layout-top-layer
                layout-top-layer__shadow
                layout-wrapper

*/

if (!kk.viewport) {

}

kk.ui = {}

})(kk);

(function(kk) {
// Класс .hover и .pressed всем ссылкам на один и тот же документ
//kenzo.anchors = (function() {
//    // TODO: 'xlink:href'
//    var _ = {},
//        anchors = document.querySelectorAll('a[href]');
//
//    _.add = function(anchor) {
//        try {
//            var url = anchor.getAttribute('href').replace(/[\n\r\b\t]/g, ''),
//                same = document.querySelectorAll('a[href="' + url + '"]');
//
//            anchor.addEventListener('mouseover', function() {
//                each (same, function(o) {
//                    (o.classList.contains('hover')) || (o.classList.add('hover'))
//                });
//            }, false);
//
//            anchor.addEventListener('mouseout', function() {
//                each (same, function(o) {
//                    (o.classList.contains('hover')) && (o.classList.remove('hover'))
//                });
//            }, false);
//
//            anchor.addEventListener('mousedown', function() {
//                each (same, function(o) {
//                    (o.classList.contains('pressed')) || (o.classList.add('pressed'))
//                });
//            }, false);
//
//            anchor.addEventListener('mouseup', function() {
//                each (same, function(o) {
//                    (o.classList.contains('pressed')) && (o.classList.remove('pressed'))
//                });
//            }, false);
//        } catch (e) {
//            console.warn(e);
//        }
//    }
//
//    each (anchors, _.add);
//
//    return _;
//})();

})(kk);

(function(kk) {
class Billboard {
    constructor (list) {
        const self = this;

        this.limit = 100;

        this.source = list;

        this.width = 0;
        this.heigth = 0;

        this.list = [];

    }

    set_size(width, heigth) {
        if (kk.is_s(width))
            width = parseInt(width);

        if (kk.is_s(heigth))
            heigth = parseInt(heigth);

        if (kk.is_n(width) && kk.is_n(heigth)) {
            if (!isNaN(width) && !isNaN(heigth)) {
                // TODO: проверка
                this.width = width;
                this.heigth = heigth;

                this.limit = (width * heigth) ** 2;

                this.update();

                return;
            }
        }

        console.error(width, heigth);
        throw new Error('Размеры не заданы');
    }

    static convert(list) {
        return list.map(item => {
            if (kk.is_o(item))
                return item

            if (kk.is_n(item))
                return {value: item}

            throw Error('Неверный формат элемента ряда');
        });
    }

    static left(state) {
        let count = 0;

        let list = state.list.slice(0, state.cursor);

        list.forEach(item => {
            count += item.value;
        });

        return state.limit - (count % state.limit);
    }

    static process(state) {
        const offsets = [
            [0, 0], // 0
            [1, 0], // 1
            [0, 1], // 2
            [1, 1], // 3
            [0, 2], // 4
            [1, 2], // 5
            [2, 0], // 6
            [2, 1], // 7
            [2, 2], // 8
            [0, 3], // 9
            [1, 3], // 10
            [2, 3], // 11
            [3, 0], // 12
            [3, 1], // 13
            [3, 2], // 14
            [3, 3], // 15
            [0, 4], // 16
        ];

        for (let i in offsets) {
            const a = offsets[i][0];
            const b = offsets[i][1];

//            console.log('i', i);
//            console.log('cursor', state.cursor);
//            console.log('a', a);
//            console.log('b', b);

            const left = Billboard.left({
                list: state.list,
                cursor: state.cursor - b,
                limit: state.limit
            });

            const temp = state.list[state.cursor + a];

            if (!kk.is_o(temp)) {
//                console.log('Список закончен');
                state.cursor = state.cursor - b + 1;
                return state;
            }

            if (state.list[state.cursor + a].value <= left) {
                state.list[state.cursor + a] =
                    state.list[state.cursor - b];
                state.list[state.cursor - b] = temp;

                state.cursor = state.cursor - b + 1;

//                console.log('state', state.list.map(i => i.value));
                break;
            }
        }

        return state;
    }

    update() {
        const self = this;
        let source = [];

        // Игнорировать элементы, больше максимального значения
        this.source.forEach(item => {
            if (!('width' in item))
                throw new Error('Ширина элемента не задана');

            if (item.width <= this.width)
                source.push(item);
        });

        let state = {
            list: source,
            cursor: 0,
            limit: self.width
        }

        while (state.cursor < state.list.length) {
            this.limit--;
            if (this.limit < 0) {
                console.warn('Признаки зацикленности');
                break;
//                throw new Error('Признаки зацикленности');
            }

            state = Billboard.process(state);

        }

        this.list = state.list;
    }
}

kk.ui.Billboard = Billboard;

})(kk);

(function(kk) {
/*
    v.2 2017.04.11

    Модуль связывает всплывающие панели (popups) и якоря (anchors).

    Popup — всплывающая в верхнем (top layer) слое панель.
    Anchor — якорь, являющийся переключателем для понели, может быть
        представлен в виде любого объекта


*/


///*
//wrapper — обёртка сайта, элемент .layout-wrapper.
//    Обычно имеет ширину отличную от ширины окна браузера.
//anchor — элемент-якорь.
//window — окно браузера.
//
//Настройки панели
//    data-kenzo-popup-panel {string}
//      — идентификатор (имя) панели
//    data-kenzo-option-mutex {string} ("all" | "panel1 panel2 panelN")
//      — при открытии панели закрываются другие панели, указанные в атрибуте
//    data-modal {boolean}
//      — подложка, блокирующая основное содержимое.
//        При открытии такого попапа все остальные попапы закрываются
//        вне зависимости от значений атрибута data-kenzo-option-mutex.
//        (false по умолчанию)
//    data-close-on-blur {boolean}
//      — закрывать попап по нажатию вне его.
//        (true по умолчанию)
//
//    data-width {string} ("100", "40.5%")
//      — ширина панели. Если в процентах, то относительно .layout-wrapper.
//        Значение с процентами будет преобразовано во Float;
//        если процента в конце строки нет, строка будет преобразована в Integer.
//    data-height {string} ("100", "40.5%")
//      — высота панели. Если в процентах, то относительно высоты окна.
//        Значение с процентами будет преобразовано во Float;
//        если процента в конце строки нет, строка будет преобразована в Integer.
//
//    FURURE: условия привести в порядок.
//
//    data-rel-x {string} ("wrapper" | "anchor" | "window")
//      — относительно чего распологать попап по оси X
//        ("anchor" по умолчанию) (приоритет над data-rel)
//    data-rel-y {string} ("wrapper" | "anchor" | "window")
//      — относительно чего распологать попап по оси Y
//        ("anchor" по умолчанию) (приоритет над data-rel)
//    data-rel {string} ("wrapper" | "anchor" | "window")
//      — относительно чего распологать попап.
//        Краткая запись для data-rel-left="" и data-rel-top="". Например:
//        data-rel="window"         = data-rel-x="window"  и data-rel-y="window",
//        data-rel="wrapper anchor" = data-rel-x="wrapper" и data-rel-y="anchor",
//
////    data-pos-x {string} ("left" | "center" | "right") center
////      — позиционирование панели относительно выбранного объекта
////    data-pos-y {string} ("top" | "center" | "bottom") top
////      — позиционирование панели относительно выбранного объекта
////
////    data-align-x {string} ("left" | "center" | "right") center
////      — выравнивание панели
////    data-align-y {string} ("top" | "center" | "bottom") top
////      — выравнивание панели
//
//    FUTURE: data-auto-open, data-auto-close
//
//Deprecated:
//    data-kenzo-option-left {boolean}
//      — если true синоним для data-rel-x="anchor"
//        если false синоним для data-rel-x="wrapper"
//    data-kenzo-option-top {boolean}
//      — если true синоним для data-rel-y="anchor"
//        если false синоним для data-rel-y="wrapper"
//    data-temp-center = true
//      — Распологать панель по центру экрана.
//
//Deleted:
//
//*/
//// Только для именованных якорей и панелей
//kenzo.popup = (function() {
//    if (!kenzo.toplayer) return false;
//
//    var popup_layer = kenzo.toplayer.get_popup_layer(),
//        panels = [],
//        current = [],
//        block_hide = false;
//
//    var default_options = {
//        mutex: false, // значение по умолчанию не используется
//        modal: false,
//        close_on_blur: true,
//        width: { // значение по умолчанию не используется
//            value: 320,
//            units: 'px'
//        },
//        height: { // значение по умолчанию не используется
//            value: null,
//            units: 'auto'
//        },
//        rel: {
//            x: 'anchor',
//            y: 'anchor'
//        },
//        pos: {
//            x: 'center',
//            y: 'top'
//        },
//    };
//
//    if (!(popup_layer instanceof Element)) return false;
//
//    var get_option__bool = function(element, attribute, default_value) {
//        var data = element.getAttribute(attribute);
//
//        if (typeof default_value == 'undefined')
//            default_value = false;
//
//        if (data === 'true')
//            return true;
//        else if (data === 'false')
//            return false;
//        else
//            return default_value || false;
//    }
//
//    var get_value = function(element, attribute) {
//        var _ = {},
//            data = element.getAttribute(attribute);
//
//        if (data === null) return null;
//
//        _.value = data.match(/([\d]+\.[\d]+|[\d]+)%/);
//        if (_.value !== null)
//            _.units = '%';
//        else {
//            _.value = data.match(/(\d+)/);
//
//            if (_.value !== null)
//                _.units = 'px';
//            else
//                return null;
//        }
//
//        _.value = parseFloat(_.value[1]);
//
//        return _;
//    }
//
//    var get_panel_option_rel = function(panel) {
//        var _ = {},
//            options = ['wrapper', 'anchor', 'window'];
//
//        var x = panel.getAttribute('data-rel-x'),
//            y = panel.getAttribute('data-rel-y');
//
//        if ((x !== null) && (options.indexOf(x) === -1)) x = null;
//        if ((y !== null) && (options.indexOf(y) === -1)) y = null;
//
//        if (!x || !y) {
//            var rel = panel.getAttribute('data-rel');
//
//            if (rel !== null) {
//                rel = rel
//                    .replace(/,+/g, ' ')
//                    .replace(/\s{2,}/g, ' ')
//                    .split(' ');
//
//                if (rel.length === 1)
//                     rel[1] = rel[0];
//
//                if (options.indexOf(rel[0]) === -1)
//                    rel[0] = null;
//                if (options.indexOf(rel[1]) === -1)
//                    rel[1] = null;
//            }
//        }
//
//        _.x = x || (rel ? rel[0] : null);
//        _.y = y || (rel ? rel[1] : null);
//
//        // Old way
//        if (!_.x) {
//            var left = panel.getAttribute('data-kenzo-option-left');
//            if (left !== null) {
//                if (left === 'true')
//                    _.x = 'anchor';
//                else if (left === 'false')
//                    _.x = 'wrapper';
//            }
//        }
//
//        if (!_.y) {
//            var top = panel.getAttribute('data-kenzo-option-top');
//
//            if (top !== null) {
//                if (top === 'true')
//                    _.y = 'anchor';
//                else if (top === 'false')
//                    _.y = 'wrapper';
//            }
//        }
//
//        // Defaults
//        if (!_.x) _.x = default_options.rel.x;
//        if (!_.y) _.y = default_options.rel.y;
//
//        return _;
//    }
//
//    var get_panel_option_pos = function(panel) {
//        var _ = {},
//            options_x = ['left', 'center', 'right'],
//            options_y = ['top', 'center', 'bottom'];
//
//        var x = panel.getAttribute('data-pos-x'),
//            y = panel.getAttribute('data-pos-y');
//
//        if ((x !== null) && (options_x.indexOf(x) === -1)) x = null;
//        if ((y !== null) && (options_y.indexOf(y) === -1)) y = null;
//
//        if (!x || !y) {
//            var pos = panel.getAttribute('data-pos');
//
//            if (pos !== null) {
//                pos = pos
//                    .replace(/,+/g, ' ')
//                    .replace(/\s{2,}/g, ' ')
//                    .split(' ');
//
//                if (pos.length === 1)
//                    pos[1] = pos[0];
//
//                if (options_x.indexOf(pos[0]) === -1)
//                    pos[0] = null;
//                if (options_y.indexOf(pos[1]) === -1)
//                    pos[1] = null;
//            }
//        }
//
//        _.x = x || (pos ? pos[0] : null);
//        _.y = y || (pos ? pos[1] : null);
//
//        // Defaults
//        if (!_.x) _.x = default_options.pos.x;
//        if (!_.y) _.y = default_options.pos.y;
//
//        return _;
//    }
//
//    var get_panel_options = function(panel) {
//        var _ = {};
//
//        _.mutex = (function() {
//            var data = panel.getAttribute('data-kenzo-option-mutex');
//
//            if (data) {
//                data = data.replace(/,+/g, ' ').replace(/\s{2,}/g, ' ');
//                return data.split(' ');
//            }
//            // FUTURE: all, исключения"
//        })();
//
//        _.modal = get_option__bool(panel, 'data-modal', default_options.modal);
//        _.close_on_blur =
//            get_option__bool(panel, 'data-close-on-blur', default_options.close_on_blur);
//
//        _.width = get_value(panel, 'data-width');
//        _.height = get_value(panel, 'data-height');
//        _.rel = get_panel_option_rel(panel);
//        _.pos = get_panel_option_pos(panel);
//
//        _.temp_center = get_option__bool(panel, 'data-temp-center', false);
//
//        if (_.temp_center) {
//            _.rel.x = 'window';
//            _.rel.y = 'window';
//        }
//        // ?
////        if (_.modal === true)
////            _.mutex = ['all'];
//
//        return _;
//    }
//
//    var get_panel_object = function(name, panel) {
//        var stat = {
//            'name': name,
//            'dom': panel,
//            'show': false,
//            'anchor': null,
//            'anchor_clones': [],
//            'anchor_clones_wrapper':
//                panel.querySelector('[data-kenzo-popup-anchor-clone="' + name + '"]'),
//            'pointer': (function() {
//                return panel.querySelector('[data-kenzo-popup-pointer="' + name + '"]');
//            })(),
//            'options': get_panel_options(panel),
//            'update': {
//                'width': true,
//                'height': true
//            }
//        }
//
//        return stat;
//    };
//
//    // Индексирование и перемещение Панели в верхний слой
//    var add = function(panel) {
//        var name = panel.getAttribute('data-kenzo-popup-panel');
//
//        if (name !== '') {
//            each (panels, function(item) {
//                if (item.name === name) {
//                    console.warn('Две или более одноимённых панелей:', name);
//                    return true;
//                }
//            }, function() {
//                // Если панель с таким именем ещё не индексирована, она индексируется.
//                panels.push( get_panel_object(name, panel) );
//            });
//        }
//
//        popup_layer.appendChild(panel);
//    }
//
//    var get = function() {
//        var panel, name, element;
//
//        if (typeof arguments[0] === 'string')
//            name = arguments[0];
//        else if (arguments[0] instanceof Element) {
//            element = arguments[0];
//            name =
//                element.getAttribute('data-kenzo-popup-anchor') ||
//                element.getAttribute('data-kenzo-popup-close') ||
//                element.getAttribute('data-kenzo-popup-close-button');
//        }
//
//        if (!name || name === '') return panel;
//
//        // В Array.forEach нет остановки итерации
//        each (panels, function(item) {
//            if (item.name === name) {
//                panel = item;
//                return true;
//            }
//        });
//
//        return panel;
//    }
//
//    var update_sizes = function(panel) {
//        var _ = {
//            width: panel.options.width,
//            height: panel.options.height
//        };
//
//        if (panel.update.width && _.width && _.width.value > 0) {
//            panel.dom.style.width = _.width.value + _.width.units;
//            panel.update.width = false;
//        }
//
//        if (panel.update.height && _.height && _.height.value > 0) {
//            if (_.height.units === 'px') {
//                panel.dom.style.height = _.height.value + _.height.units;
//                panel.update.height = false;
//            } else if (_.height.units === '%') {
//                panel.dom.style.height = kenzo.get_window_params().h / 100 * _.height.value + 'px';
//            }
//        }
//    }
//
//    var update_position = function(panel) {
//        var wrapper = popup_layer.getBoundingClientRect(),
//            _ = {
//                width: panel.options.width,
//                height: panel.options.height,
//                rel: panel.options.rel,
//                pos: panel.options.pos
//            };
//
//        if (panel.anchor instanceof Element)
//            var anchor = kenzo.get_offset(panel.anchor);
//
//        if (_.width && _.width.value > 0) {
//
//            // center top
//            if (panel.dom.classList.contains('std'))
//                panel.dom.style.marginLeft = -Math.round(_.width.value/2) + _.width.units;
//        }
//
//        // NOTE: временно
//        if (panel.options.temp_center) {
//            var scroll_top = kenzo.get_window_params().y,
//                client_height = kenzo.get_window_params().h;
//
//            panel.dom.style.left = '50%';
//            panel.dom.style.top = scroll_top
//                + ( (client_height - panel.dom.offsetHeight)/2 ) + 'px';
//        }
//
////        if (_.rel.x === 'window') { }
////        if (_.rel.y === 'window') { }
//
//        if ((_.rel.x === 'anchor') && anchor) {
//            var left = anchor.left - wrapper.left + anchor.width/2;
//            panel.dom.style.left = left + 'px';
//            var panel_left = panel.dom.getBoundingClientRect().left - wrapper.left;
//
//            if (panel_left + panel.dom.offsetWidth > wrapper.width - 10) {
//                panel.dom.style.removeProperty('left');
//                panel.dom.style.right = '10px';
//            } else if (panel_left < 10) {
//                panel.dom.style.left = Math.round(panel.dom.offsetWidth/2) + 10 + 'px';
//            }
//        }
//
//        if ((_.rel.y === 'anchor') && anchor) {
//            var top = anchor.top + anchor.height;
//            panel.dom.style.top = top + 'px';
//        }
//    }
//
//    var update_pointer = function(panel) {
//        var panel_offset = kenzo.get_offset(panel.dom);
//
//        if (panel.anchor instanceof Element)
//            var anchor = kenzo.get_offset(panel.anchor);
//
//        if (anchor) {
//            if (panel.pointer) {
//                panel.pointer.style.left =
//                    (anchor.left + anchor.width/2 - panel_offset.left) + 'px';
//            }
//
//            if (panel.anchor_clones_wrapper) {
//                panel.anchor_clones_wrapper.style.left =
//                    (anchor.left - panel_offset.left) + 'px';
//
//                panel.anchor_clones_wrapper.style.top =
//                    (anchor.top - panel_offset.top) + 'px';
//            }
//        }
//    }
//
//    var update = function() {
//        each (current, function(panel) {
//            if (!panel.show) return false;
//
////            if (panel.anchor instanceof Element)
////                var anchor = kenzo.get_offset(panel.anchor);
////            else
////                return false;
//
//            update_sizes(panel);
//            update_position(panel);
//            update_pointer(panel);
//
//        });
//    }
//
//    window.addEventListener('resize', update, true);
//
//    // В качестве первого аргумента можно указывать якорь, название панели
//    // или саму панель (элемент).
//    // Если второй аргумент является элементом, то он указывается как якорь.
//    // Если второй или третий аргумент имеют значение false, то якорь,
//    // если он есть, не будет становиться активным (останется без класса .active).
//    var show = function() {
//        var panel = get(arguments[0]),
//            active = true,
//            anchor, current_clone;
//
//        if (!panel) return false;
//
//        if (arguments[0] instanceof Element) {
//            if (arguments[0] !== panel.dom)
//                anchor = arguments[0];
//        } else if (arguments[1] instanceof Element) {
//            anchor = arguments[1];
//
//            if (typeof arguments[2] == 'boolean') {
//                active = arguments[2];
//            }
//        } else if (typeof arguments[1] == 'boolean') {
//            active = arguments[1];
//        }
//
//        block_hide = true;
//
//        if (panel.options.mutex instanceof Array) {
//            if (panel.options.mutex.indexOf('all') > -1) {
//                each (current, function(item) {
//                    hide(item.name);
//                });
//            } else {
//                each (panel.options.mutex, function(name) {
//                    hide(name);
//                });
//            }
//
//        }
//
//        if (anchor) {
//            panel.anchor = anchor;
//
//            if (panel.anchor_clones_wrapper) {
//                current_clone = null;
//                each (panel.anchor_clones, function(clone) {
//                    if (clone.original === panel.anchor) {
//                        current_clone = clone.dom;
//                    } else {
//                        clone.dom.style.display = 'none';
//                    }
//                });
//
//                if (!current_clone) {
//                    var current_clone = anchor.cloneNode(true);
//                    current_clone = init_anchor(anchor, panel.name).clone;
//                }
//
//                current_clone.style.removeProperty('display');
//                current_clone.classList.remove('active');
//            }
//        }
//
//        if (panel.options.modal === true)
//            kenzo.toplayer.show(true);
//
//        panel.dom.classList.add('visible');
//        panel.show = true;
//
//        each (current, function(item) {
//            if (item == panel)
//                return true;
//        }, function() {
//            current.push(panel);
//        });
//
//        update();
//
//        var first_field = panel.dom.querySelector('input, textarea');
//        if (first_field instanceof Element)
//            first_field.focus();
//
//        if (active && current_clone) current_clone.classList.add('active');
//        if (active && anchor) anchor.classList.add('active');
//    }
//
//    var hide = function() {
//        var panel = get(arguments[0]),
//            blur = arguments[1];
//
//        if (typeof blur !== 'boolean')
//            blur = false;
//
//        if (!panel || !panel.show) return false;
//
//        if (!panel.options.close_on_blur && blur) return false;
//
//        if (panel.anchor) {
//            panel.anchor.classList.remove('active');
//            panel.anchor = null;
//        }
//
//        panel.dom.classList.remove('visible');
//        panel.show = false;
//
//        if (panel.options.modal === true)
//            kenzo.toplayer.hide();
//
//        each (current, function(item, i) {
//            if (item == panel)
//                current.splice(i, 1);
//        });
//    }
//
//    // FUTURE: toggle
//
//    var init_anchor = function(anchor) {
//        if (arguments[0] instanceof Element)
//            var panel = get(arguments[0]);
//
//        if (typeof arguments[1] == 'string')
//            var steppanel = get(arguments[1]);
//
//        if (!panel) return false;
//
//        var clone;
//
//        var onclick = function(event) {
//            if ((panel.show === false) || (panel.anchor !== anchor)) {
//                show(anchor);
//            } else {
//                hide(anchor);
//            }
//        }
//
//        if (!('kz-initiated' in anchor)) {
//            anchor.addEventListener('click', onclick);
//            anchor['kz-initiated'] = true;
//        }
//
//        // Клонирование якоря
//        if (panel.anchor_clones_wrapper) {
//            clone = anchor.cloneNode(true);
//            var newobj = {
//                'original': anchor,
//                'dom': clone
//            };
//
//            if (steppanel) {
//                steppanel.anchor_clones.push(newobj);
//                steppanel.anchor_clones_wrapper.appendChild(clone);
//            } else{
//                panel.anchor_clones.push(newobj);
//                panel.anchor_clones_wrapper.appendChild(clone);
//            }
//
//            clone.addEventListener('click', onclick);
//        }
//
//        return {
//            'anchor': anchor,
//            'clone': clone
//        }
//    }
//
//    // Панели
//    each ('[data-kenzo-popup-panel]', add);
//
//    // Якори
//    each ('[data-kenzo-popup-anchor]', function(item, i) {
//        // Костыль для инвалида IE
//        if ((typeof item.classList === 'undefined') && (item instanceof SVGSVGElement)) {
//            var wrapper = document.createElement('span');
//            item.parentNode.insertBefore(wrapper, item);
//            wrapper.appendChild(item);
//            wrapper.setAttribute(
//                'data-kenzo-popup-anchor',
//                item.getAttribute('data-kenzo-popup-anchor')
//            );
//            init_anchor(wrapper, i);
//        } else
//            init_anchor(item, i);
//    });
//
//    // Проводники
//    // Проводит событие 'click' в первый одноимённый якорь в элементах блока
//    each ('[data-kenzo-popup-conductor]', function(conductor) {
//        var name = conductor.getAttribute('data-kenzo-popup-conductor');
//
//        if (name === '')
//            name = null;
//        else {
//            var panel = get(name);
//            if (!panel) return false;
//            // Не имеет смысла искать якорь при отсутсивии панели.
//            // FUTURE: если панели будут подгружаемыми, эту строку нужно изменить.
//        }
//
//        var anchor;
//
//        var search_anchor = function(node) {
//            if (anchor === document.body)
//                return false;
//
//            if (name) {
//                if (node.parentNode == document.body) {
//                    console.warn('kenzo.popup: Якорь не найден');
//                    return false;
//                }
//                anchor = node.parentNode
//                    .querySelector('[data-kenzo-popup-anchor="' + name + '"]');
//            } else {
//                anchor = node.parentNode
//                    .querySelector('[data-kenzo-popup-anchor]');
//            }
//
//            if (!anchor)
//                search_anchor(node.parentNode);
//        }
//
//        search_anchor(conductor);
//
//        conductor.addEventListener('click', function(event) {
//            anchor.click();
//        });
//    });
//
//    // Кнопки и другие элементы для закрытия панели
//    each ('[data-kenzo-popup-close], [data-kenzo-popup-close-button]', function(item) {
//        item.addEventListener('click', function() {
//            hide(item);
//        });
//    });
//
//    var is_popup = function(element) {
//        if (element instanceof Element) {
//            if (element === document.body) {
//                return false;
//            } else if (
//                element.hasAttribute('data-kenzo-popup-panel') ||
//                element.hasAttribute('data-kenzo-popup-anchor') ||
//                element.hasAttribute('data-kenzo-popup-conductor')
//            ) {
//                return true;
//            } else if (element.parentNode !== document.body) {
//                return is_popup(element.parentNode);
//            } else {
//                return false;
//            }
//        } else if (element instanceof SVGElementInstance) {
//            return is_popup(element.correspondingUseElement);
//        }
//    }
//
//    // Закрытие всех панелей по щелчку вне их;
//    document.addEventListener('click', function(event) {
//        if (block_hide) {
//            block_hide = false;
//            return false;
//        }
//
//        if ((current.length > 0) && (!is_popup(event.target))) {
//            var len = current.length;
//            for (len; len > 0; len--) {
//                hide(current[0].name, true);
//            }
//        }
//    });
//
//    return {
//        'get': get,
//        'show': show,
//        'hide': hide
//    }
//
//})();

})(kk);

(function(kk) {
var module = {};

var top_layer = document.querySelector('.layout-top-layer');
if (!kk.is_E(top_layer)) {
    console.log('Верхний слой не обнаружен');
    return;
}

var popup_layer = document.querySelector('.layout-top-layer');
if (!kk.is_E(popup_layer)) {
    console.log('Слой для панелей не обнаружен');
    return;
}

var shadow_layer = document.querySelector('.layout-top-layer');
if (!kk.is_E(shadow_layer)) {
    console.log('Затеняющий слой не обнаружен');
    return;
}

module.show = function() {

}


kk.toplayer = module;


//    _.show = function(show_shadow_layer) {
//        top_layer.classList.add('visible');
//        if (show_shadow_layer === true)
//            shadow_layer.classList.add('visible');
//    }
//
//    _.hide = function() {
//        top_layer.classList.remove('visible');
//        shadow_layer.classList.remove('visible');
//    }
//
//    _.get_popup_layer = function() {
//        return popup_layer;
//    }
//
//    _.get_shadow_layer = function() {
//        return shadow_layer;
//    }
//
//    _.get_popup_layer_state = function() {
//        return top_layer.classList.contains('visible');
//    }
//
//    _.get_shadow_layer_state = function() {
//        return shadow_layer.classList.contains('visible');
//    }
//
//    return _;
//
//})();

})(kk);
