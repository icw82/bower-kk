if (typeof kenzo === 'object') {

    var plural_ru = kenzo.plural; // ангажемент, атмр, романтик саунд
    var toggle_class = kenzo.toggle_class;
    var getRandomInt = kenzo.rand;
    var getWindowParams = kenzo.get_window_params;
    var getTimestump = kk.ts;
    var numderTypo = kk.format.number;

    kenzo.plural_ru = kenzo.plural; // СПК
    kenzo.generate = kenzo.event;

    Element.prototype.getOffset = function() {
        kenzo.get_offset(this);
    };

    kenzo.toggle_class = function(element, classes, classlist, toggle_exist) {
        var kenzo = kk,
            stop = false;

        if (!(element instanceof kenzo._E))
            return false;

        if (typeof classes === kenzo._s)
            classes = [classes];

        if (!(classes instanceof kenzo._A))
            return false;

        if (typeof classlist === kenzo._u)
            classlist = classes;
        else if (!(classlist instanceof kenzo._A))
            return false;

        var exist = true;

        if (toggle_exist === false)
            return kenzo.class(element, classes, classlist)
        else
            toggle_exist = true;

        // Объединение классов
        each (classes, function(cls) {
            if (typeof cls !== kenzo._s) {
                stop = true;
                return false;
            }

            if (classlist.indexOf(cls) < 0)
                classlist.push(cls);
            if (!element.classList.contains(cls))
                exist = false;
        });

        if (stop) return false;

        each (classlist, function(cls) {
            if (toggle_exist && exist) {
                element.classList.remove(cls);
            } else {
                if (classes.indexOf(cls)  < 0)
                    element.classList.remove(cls);
                else
                    element.classList.add(cls);
            }
        });
    }

    toggle_class = kenzo.toggle_class;
}

kk.get_window_params = function() {
    console.warn('get_window_params is DEPRECATED. Use kk.viewport.');

    return {
        x: kk.viewport.x,
        y: kk.viewport.y,
        w: kk.viewport.w,
        h: kk.viewport.h
    };
}

// SPK, Sakura, Evis
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

