'use strict';

(function(kk) {
kk.path = {};

kk.path.convert = function(p) {
    if (path.sep === '\\')
        return p.replace(/\\/g, '/');
    else
        return p;
};

kk.path.relative = function(original, root) {
    var _ = {};

    for (var key in original) {
        _[key] = path.relative(root, original[key]);
    }

    return _;
}

})(kk);
