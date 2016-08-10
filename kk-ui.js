// TODO: Классы закрытия,а не открытия.


//kenzo.browser = (function() {
//    if ('transform' in document.body.style)
//        return 'normal';
//    else if ('webkitTransform' in document.body.style)
//        return 'webkit';
//    else
//        return 'old';
//})();


//kenzo.toplayer = (function() {
//    var _ = {},
//        top_layer = document.querySelector('.layout-top-layer');
//
//    if (!(top_layer instanceof Element)) return false;
//
//    var popup_layer = top_layer.querySelector('.layout-wrapper'),
//        shadow_layer = top_layer.querySelector('.layout-top-layer__shadow');
//
//    if (!(popup_layer instanceof Element)) {
//        console.warn('Отсутсвует верхний слой');
//        return false
//    }
//
//    if (!(shadow_layer instanceof Element)) {
//        console.warn('Отсутсвует затеняющий слой');
//        return false
//    }
//
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
//
//kenzo.tabs = (function() {
//    var anchors = [],
//        panels = [],
//        preactivated_groups = [];
//
//    // Индексирование якоря или панели
//    var add = function(element) {
//        if (!(element instanceof Element)) return false;
//
//        var anchor_name = element.getAttribute('data-kenzo-tab-anchor'),
//            group_name = element.getAttribute('data-kenzo-tab-group'),
//            panel_name = element.getAttribute('data-kenzo-tab-panel'),
//            exist = false;
//
//        if (group_name === '') group_name = null;
//
//        if (anchor_name) {
//            each (anchors, function(item) {
//                if ((anchor_name === item.name) && (group_name === item.group)) {
//                    exist = true;
//                    item.dom.push(element);
//                    return true;
//                }
//            });
//
//            exist || anchors.push({
//                'name': anchor_name,
//                'group': group_name,
//                'dom': [element]
//            });
//
//            element.kenzo_anchor_name = anchor_name;
//            element.kenzo_group_name = group_name;
//            element.addEventListener('click', anchor_listner);
//
//            if (element.classList.contains('current')) {
//                if (preactivated_groups.indexOf(group_name) > -1) {
//                    element.classList.remove('current');
//                } else {
//                    preactivated_groups.push(group_name);
//                    show(anchor_name, group_name);
//                }
//            }
//        } else if (panel_name) {
//            each (panels, function(item) {
//                if ((panel_name === item.name) && (group_name === item.group)) {
//                    exist = true;
//                    item.dom.push(element);
//                    return true;
//                }
//            });
//
//            exist || panels.push({
//                'name': panel_name,
//                'group': group_name,
//                'dom': [element]
//            });
//        }
//    }
//
//    var anchor_listner = function(event) {
//        var anchor_search = function(child) {
//            if (child.getAttribute('data-kenzo-tab-anchor'))
//                return child;
//            else if (child.parentNode !== document.body)
//                return anchor_search(child.parentNode);
//        }
//
//        var anchor = anchor_search(event.target),
//            name = anchor.kenzo_anchor_name,
//            group = anchor.kenzo_group_name;
//
//        if (!(anchor instanceof Element) || anchor.classList.contains('current')) return false;
//
//        each (anchors, function(item) {
//            if (item.group === group) {
//
//                if (item.name === name) {
//                    each (item.dom, function(element) {
//                        element.classList.add('current');
//                    });
//                } else {
//                    each (item.dom, function(element) {
//                        element.classList.remove('current');
//                    });
//                }
//            }
//        });
//
//        show(name, group);
//    }
//
//    var show = function(name, group) {
//        if (typeof name != 'string') return false;
//        if (typeof group != 'string') group = null;
//
//        // TODO: prev and next;
//
//        each (panels, function(item) {
//            if (item.group === group) {
//                if (item.name === name) {
//                    each (item.dom, function(element) {
//                        element.classList.add('current');
//                    });
//                } else {
//                    each (item.dom, function(element) {
//                        element.classList.remove('current');
//                    });
//                }
//            }
//        });
//
//        kenzo.generate.resize();
//    }
//
//    // Панели
//    each ('[data-kenzo-tab-panel]', add);
//
//    // Якори
//    each ('[data-kenzo-tab-anchor]', add);
//
//    return {
//        'add': add,
//        'show': show
//    }
//})();
//
//
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
//
//
///*
//
//Набор элементов:
//    .kenzo-slider — корневой элемент слайдера
//        data-base-width="[ number ]" — базовая ширина слайдера;
//        data-flipspeed="[ number ]" — скорость анимации в секундах;
//        data-autoflip="[ number ]" — период автоматического перелистывания в секундах;
//        data-distribution="[ number ]" — распределяет в слайды то количество элементов,
//            что указано.
//            Если атрибут отсутсвует, элементы распределяются, заполняя слайд до базовой ширины;
//        data-options="[ string ]" — опции, разделены пробелами:
//            proportional-font-size — изменяет размер шрифта рамки пропорционально ширине слайдера;
//
//    .kenzo-slider__frame — рамка слайдера;
//    .kenzo-slider__container — контейнер (он же слайдер самолично);
//    .kenzo-slider__slide — слайд (генерируется скриптом);
//    .kenzo-slider__item — элемент слайдера (помещается скриптом в слайды);
//
//    .kenzo-slider__prev — элемент управления, листает слайды назад;
//    .kenzo-slider__next — элемент управления, листает слайды вперёд;
//
//    .kenzo-slider__indicator — элемент управления, показывает слайд,
//        соответсвующий порядковому номеру индикатора.
//
//Структура:
//    slider → frame → container → *slide* → item
//    slider → prev, next, indicator
//
//*/
//kenzo.slider = (function() {
//    var model = [],
//        defaults = {
//            'flipspeed': .4,
//            'autoflip': null,
//            'base_width': null,
//            'distribution': null,
//            'user_pause': 30
//        };
//
//    var add = function(block) {
//
//        if (!(block instanceof Element) || (!block.classList.contains('kenzo-slider')))
//            return false;
//
//        var frame = block.querySelector('.kenzo-slider__frame');
//        if (frame === null) {console.warn('Отсутсвует рамка', block); return false }
//
//        var container = frame.querySelector('.kenzo-slider__container');
//        if (container === null) {console.warn('Отсутсвует контейнер', block); return false }
//
//        var items = container.querySelectorAll('.kenzo-slider__item');
//
//        if (!kenzo.is_nodes(items)) {
//            console.warn('Отсутсвуют элементы', block);
//            return false;
//        }
//
//        var slides = [],
//            controls = {
//                prev: block.querySelector('.kenzo-slider__prev'),
//                next: block.querySelector('.kenzo-slider__next'),
//                indicators: block.querySelectorAll('.kenzo-slider__indicator')
//            },
//            settings = {
//                'flipspeed':
//                    parseFloat(block.getAttribute('data-flipspeed')) || defaults.flipspeed,
//                'autoflip':
//                    parseFloat(block.getAttribute('data-autoflip')) || defaults.autoflip,
//                'base_width':
//                    parseInt(block.getAttribute('data-base-width')) || defaults.base_width,
//                'distribution':
//                    parseInt(block.getAttribute('data-distribution')) || defaults.distribution
//            },
//            options = (function() {
//                var options = block.getAttribute('data-options');
//
//                if ((typeof options == 'string') && (options !== "")) {
//                    options = options
//                        .replace(/(?:^|\s)([^_a-zA-Z][\w\-]*)/g, '')
//                        .trim();
//                    options = options
//                        .split(' ')
//                        .sort();
//                }
//
//                if (!(options instanceof Array)) options = [];
//
//                return options;
//            })();
//
//        // Распределение элементов по слайдам
//        // Не пересчитывается при изменении размера рамки.
//        if (settings.distribution > 0) {
//            var wrapper = document.createDocumentFragment(),
//                number_of_slides = Math.ceil(items.length / settings.distribution);
//
//            for (var slide_index = 0; slide_index < number_of_slides; slide_index++) {
//                var slide = document.createElement('div');
//                slide.classList.add('kenzo-slider__slide');
//
//                for (
//                    var item_index = slide_index * settings.distribution;
//                    (item_index < (slide_index + 1) * settings.distribution)
//                        && (item_index < items.length);
//                    item_index++
//                ) {
//                    slide.appendChild(items[item_index]);
//                }
//
//                slides.push(slide);
//                wrapper.appendChild(slide);
//            }
//            container.appendChild(wrapper);
//
//        } else if (settings.base_width > 0) {
//            var width_sum = 0,
//                stack = [],
//                wrapper = document.createDocumentFragment();
//
//            each (items, function(item, i) {
//                stack.push(item);
//                width_sum += item.offsetWidth;
//
//                if (
//                    (i + 1 === items.length) ||
//                    (width_sum + items[i + 1].offsetWidth > settings.base_width)
//                ) {
//                    var
//                        k = width_sum / settings.base_width,
//                        slide = document.createElement('div');
//                    slide.classList.add('kenzo-slider__slide');
//
//                    if (k < .85)
//                        width_sum = Math.round(settings.base_width * .95);
//
//                    each (stack, function(e) {
//                        e.style.width = (Math.floor(e.offsetWidth/width_sum*10000) / 100) + '%';
//                        slide.appendChild(e);
//                    });
//
//                    stack = [];
//                    width_sum = 0;
//
//                    slides.push(slide);
//                    wrapper.appendChild(slide);
//                }
//            });
//
//            container.appendChild(wrapper);
//
//        } else {
//            console.warn('kenzo.slider:', 'Cледует указать либо базовую ширину,'
//                + ' либо количество элементов в слайде.');
//            return false;
//        }
//
//        // Индикаторы
//        if (kenzo.is_nodes(controls.indicators)) {
//            for (var i = slides.length; i < controls.indicators.length; i++) {
//                controls.indicators[i].parentNode.removeChild(controls.indicators[i]);
//            }
//
//            var wrapper = document.createDocumentFragment();
//
//            for (var i = controls.indicators.length; i < slides.length; i++) {
//                wrapper.appendChild( controls.indicators[0].cloneNode() );
//            }
//
//            controls.indicators[0].parentNode.appendChild(wrapper);
//            controls.indicators = block.parentNode.querySelectorAll('.kenzo-slider__indicator');
//        } else {
//            controls.indicators = null;
//        }
//
//        model.push({
//            'dom': block,
//            'frame': frame,
//            'container': container,
//            'slides': slides,
//            'items': items,
//            'controls': controls,
//            'settings': settings,
//            'options': options,
//            'width': null,
//            'height': null,
//            'current': null
//        });
//
//        var index = model.length - 1;
//
//        choose(model[index], 0);
//        block.classList.add('activated');
//        set_flip_interval(model[index]);
//        set_transition(model[index]);
//
//        window.addEventListener('resize', function() {
//            update(model[index]);
//        });
//
//        if (controls.next instanceof Element)
//            controls.next.addEventListener('click', function() { next(model[index], 'user') });
//        if (controls.prev instanceof Element)
//            controls.prev.addEventListener('click', function() { prev(model[index], 'user') });
//
//        each (controls.indicators, function(indicator, i) {
//            indicator.addEventListener('click', function() { choose(model[index], i, 'user') });
//        });
//
//        each (slides, function(slide, i) {
//            slide.addEventListener('click', function() { choose(model[index], i, 'user') });
//        })
//    }
//
//    // Выбор слайда
//    var choose = function(block, slide, source) {
//        if ((source == 'user') && (block.settings.flip_interval > 0)) {
//            clearInterval(block.settings.flip_interval);
//            setTimeout(function() {
//                set_flip_interval(block);
//            }, defaults.user_pause * 1000);
//        }
//
//        var need_update = false;
//
//        if (block.current !== slide) {
//            block.current = slide;
//            need_update = true;
//        }
//
//        need_update && update(block);
//    }
//
//    var next = function(block, source) {
//        if ((block.current !== null) && (block.current + 1 < block.slides.length)) {
//            choose(block, block.current + 1, source);
//        } else {
//            choose(block, 0, source);
//        }
//    }
//
//    var prev = function(block, source) {
//        if ((block.current !== null) && (block.current - 1 >= 0)) {
//            choose(block, block.current - 1, source);
//        } else {
//            choose(block, block.slides.length - 1, source);
//        }
//    }
//
//    // Установка периода перелистывания
//    var set_flip_interval = function(block) {
//        if (block.settings.autoflip > 0) {
//            clearInterval(block.settings.flip_interval);
//            block.settings.flip_interval = setInterval(function() {
//                next(block);
//            }, block.settings.autoflip * 1000);
//        }
//    }
//
//    var set_transition = function(block) {
//        if (kenzo.browser === 'normal' || kenzo.browser === 'webkit') {
//            block.container.style.transitionDuration = block.settings.flipspeed + 's';
//            block.container.style.transitionTimingFunction = 'ease';
//
//            //block.frame.style.transitionDuration = flipspeed + 's';
//            //block.frame.style.transitionTimingFunction = 'ease';
//
//            if (kenzo.browser === 'normal') {
//                block.container.style.transitionProperty = 'transform';
//            } else if (kenzo.browser === 'webkit') {
//                block.container.style.transitionProperty = '-webkit-transform';
//            } else {
//                block.container.style.transitionProperty = 'left';
//            }
//
//            //block.frame.style.transitionProperty = 'height';
//        }
//    };
//
//    var update = function(block) {
//        if (block.current === null) return false;
//
//        block.width = block.frame.offsetWidth;
//        each (block.slides, function(slide) {
//            slide.style.width = block.width + 'px';
//        });
//
//        block.height = block.slides[block.current].offsetHeight;
//        block.container.style.width = block.width * block.slides.length + 'px';
//        block.frame.style.height = block.height + 'px';
//
//        // FIXME: Не учитывется поздняя загрузка изображений.
//
////        if (block.height > 0) {
////            if (block.height > block.settings.base_max_height) {
////                block.height = block.settings.base_max_height
////            }
////            if (block.height > block.frame.style.height) {
////                block.frame.style.height = block.height + 'px';
////            }
////        }
//
//        if (
//            (block.options.indexOf('proportional-font-size') > -1) &&
//            (block.settings.base_width > 0)
//        )
//            block.frame.style.fontSize = block.width / block.settings.base_width + 'em';
//
//        if (kenzo.is_nodes(block.controls.indicators)) {
//            each (block.controls.indicators, function(indicator, i) {
//                if (i === block.current)
//                    indicator.classList.add('current');
//                else
//                    indicator.classList.remove('current');
//            });
//        }
//
//        var container_shift = -block.width * block.current + 'px',
//            container_transform = 'translate3d(' + container_shift + ', 0px, 0px)';
//
//        if (kenzo.browser == 'normal')
//            block.container.style.transform = container_transform;
//        else if (kenzo.browser == 'webkit')
//            block.container.style.webkitTransform = container_transform;
//        else
//            block.container.style.left = container_shift;
//
//        each (block.slides, function(slide, i) {
//            if (i === block.current) {
//                slide.classList.add('current');
//            } else {
//                slide.classList.remove('current');
//            }
//        });
//    }
//
//    return {
//        'add': add
//    }
//})();
//
//
///*
//
//Набор элементов:
//    .kenzo-scroll-content
//        data-name="[имя]"
//    .kenzo-scroll-bar
//        data-name="[имя]"
//        data-type="[dot | proportional]"
//        data-orientation="[horizontal | vertical]"
//    .kenzo-scroll-thumb
//        * должен находиться в элементе .kenzo-scroll-bar
//
//*/
//kenzo.scroller = (function() {
//    var
//        model = [],
//        current, current_bar, current_bar_type, last_pos;
//
//    var search_bar = function(child) {
//        if (child.classList.contains('kenzo-scroll-bar'))
//            return child;
//        else if (child.parentNode !== document.body)
//            return search_bar(child.parentNode);
//    }
//
//    var mouse_capture = function(event) {
//        if ((current !== null) && (current_bar !== null)) {
//            if (last_pos === null) {
//                last_pos = event.clientX;
//                var offset = 0;
//            } else {
//                var offset = last_pos - event.clientX;
//                last_pos = event.clientX;
//            }
//
//            var thumb = current_bar.querySelector('.kenzo-scroll-thumb');
//
//            if (!current.pos) current.pos = 0;
//
//            if (current_bar_type == 'proportional') {
//                current.pos = (thumb.offsetLeft - offset) /
//                    (current_bar.offsetWidth - thumb.offsetWidth);
//            } else {
//                current.pos = (current.pos * current_bar.offsetWidth - offset) /
//                    (current_bar.offsetWidth - thumb.offsetWidth);
//            }
//
//            if (current.pos > 1)
//                current.pos = 1;
//            else if (current.pos < 0)
//                current.pos = 0;
//
//        } else {
//            stop_mouse_capture();
//        }
//
//        event.preventDefault();
//        update(current);
//    };
//
//    var stop_mouse_capture = function() {
//        if (current !== null) {
//            current = null;
//            current_bar = null;
//            current_bar_type = null;
//            last_pos = null;
//            document.removeEventListener('mousemove', mouse_capture, true);
//        }
//    }
//
//    document.addEventListener('mouseup', stop_mouse_capture);
//
//    var add = function(element) {
//        if (!(element instanceof Element)) return false;
//        var name = element.getAttribute('data-name');
//        if (name === null) return false;
//
//        if (element.classList.contains('kenzo-scroll-content')) {
//            each (model, function(item) {
//                if (item.name === name) {
//                    item.content.dom = element;
//                    return true;
//                }
//            }, function() {
//                model.push({
//                    'name': name,
//                    'pos': 0,
//                    'content': {
//                        'dom': element
//                    },
//                    'bars': []
//                });
//            });
//
//        } else if (element.classList.contains('kenzo-scroll-bar')) {
//            var
//                index,
//                thumb = element.querySelector('.kenzo-scroll-thumb'),
//                type = element.getAttribute('data-type');
//            each (model, function(item, i) {
//                if (item.name === name) {
//                    item.bars.push({
//                        'dom': element,
//                        'type': type,
//                        'thumb': {
//                            'dom': thumb
//                        }
//                    });
//
//                    index = i;
//                    return true;
//                }
//            }, function() {
//                if (!(thumb instanceof Element)) return false;
//
//                model.push({
//                    'name': name,
//                    'pos': 0,
//                    'content': {
//                        'dom': null
//                    },
//                    'bars': [{
//                        'dom': element,
//                        'type': type,
//                        'thumb': {
//                            'dom': thumb
//                        }
//                    }]
//                });
//
//                index = model.length - 1;
//            });
//
//            if (index === null) return false;
//
//            each (model[index].bars, function(bar) {
//                bar.thumb.dom.addEventListener('mousedown', function(event) {
//                    event.preventDefault();
//                    current = model[index];
//                    current_bar = search_bar(event.target);
//                    current_bar_type = bar.type;
//                    document.addEventListener('mousemove', mouse_capture, true);
//                }, true);
//            });
//
//        }
//    }
//
//    var update = function() {
//        each (model, function() {
//            var
//                name = arguments[0].name,
//                pos = arguments[0].pos,
//                content = arguments[0].content,
//                bars = arguments[0].bars;
//
//            if (
//                !(content.dom instanceof Element) ||
//                !(bars.length > 0)
//            ) return false;
//
//            if (content.dom.scrollWidth > content.dom.offsetWidth)
//                var show = true;
//            else
//                var show = false;
//
//            if (show) {
//                if (pos === 0) {
//                    content.dom.classList.remove('left');
//                    content.dom.classList.add('right');
//                } else if (pos === 1) {
//                    content.dom.classList.add('left');
//                    content.dom.classList.remove('right');
//                } else {
//                    content.dom.classList.add('left');
//                    content.dom.classList.add('right');
//                }
//            } else {
//                content.dom.classList.remove('left');
//                content.dom.classList.remove('right');
//            }
//
//            each (bars, function(bar) {
//                if (show) {
//                    bar.dom.classList.remove('hidden');
//
//                    if (bar.type == 'proportional') {
//                    //bar.thumb.width =
//                    //    Math.round((content.dom.offsetWidth / content.dom.scrollWidth) *
//                    //        bar.dom.offsetWidth);
//
//                    //if (bar.thumb.width > 372)
//                        bar.thumb.width = 372;
//                    } else {
//                        bar.thumb.width = 0;
//                    }
//
//                    bar.thumb.dom.style.width = bar.thumb.width  + 'px';
//                    bar.thumb.dom.style.left =
//                        Math.round((bar.dom.offsetWidth - bar.thumb.width) * pos) + 'px';
//                } else {
//                    bar.dom.classList.add('hidden');
//                }
//            });
//
//            content.dom.scrollLeft =
//                Math.round((content.dom.scrollWidth - content.dom.offsetWidth) * pos);
//        });
//    }
//
//    each ('.kenzo-scroll-content', add);
//    each ('.kenzo-scroll-bar', add);
//
//    update();
//
//    window.addEventListener('resize', update);
//
//    return {
//        'add': add,
//        'update': update
//    }
//
//})();
