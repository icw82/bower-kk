kenzo.path = {};

kenzo.path.convert = function(p){
    if (path.sep === '\\')
        return p.replace(/\\/g, '/');
    else
        return p;
};

kenzo.path.relative = function(original, root){
    var _ = {};

    for (var key in original){
        _[key] = path.relative(root, original[key]);
    }

    return _;
}
