var ProcessControls = require('./control-section.js').ProcessControls;

var PreviewControls = function(cubeMarch, renderer, editor, ractive) {
    ProcessControls.call(this, ractive);
    this.renderer = renderer;
    this.cubeMarch = cubeMarch;
    this.editor = editor;
};

PreviewControls.prototype = Object.create(ProcessControls.prototype);
PreviewControls.prototype.constructor = PreviewControls;
PreviewControls.prototype.namespace = 'preview';

PreviewControls.prototype.update = function(data) {
    if ( ! data) {
        return;
    }
    this.renderer.addSection(data.vertices, data.faces);
};

PreviewControls.prototype.start = function() {
    ProcessControls.prototype.start.call(this);
    this.cubeMarch.abort();
    var res = this.ractive.get(this.ns('resolution'));
    var dims = [
        parseInt(res.x, 10),
        parseInt(res.y, 10),
        parseInt(res.z, 10)
    ];
    var bounds = this.ractive.get('bounds');
    this.cubeMarch.setVolume(dims, bounds);
    this.renderer.startModel();

    this.cubeMarch.march({
        onSection: this.update.bind(this),
        onProgress: this.progress.bind(this),
        onDone: this.done.bind(this),
        mapDistance: this.editor.getValue()
    });
};

PreviewControls.prototype.cancel =function() {
    ProcessControls.prototype.cancel.call(this);
    this.cubeMarch.abort();
};

module.exports = PreviewControls;
