if (typeof kenzo === 'object'){
    kenzo.plural_ru = kenzo.plural; // СПК
    var plural_ru = kenzo.plural; // ангажемент, атмр, романтик саунд
    var toggle_class = kenzo.toggle_class;
    var getRandomInt = kenzo.rand;

    kenzo.toggle_class = function(element, classes, classlist, toggle_exist){
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
        each (classes, function(cls){
            if (typeof cls !== kenzo._s){
                stop = true;
                return false;
            }

            if (classlist.indexOf(cls) < 0)
                classlist.push(cls);
            if (!element.classList.contains(cls))
                exist = false;
        });

        if (stop) return false;

        each (classlist, function(cls){
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
