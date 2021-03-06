var ProcessControls = require('./control-section.js').ProcessControls;

var DownloadControls = function(cubeMarch, exporter, editor, ractive) {
    ProcessControls.call(this, ractive);
    this.exporter = exporter;
    this.cubeMarch = cubeMarch;
    this.editor = editor;
};

DownloadControls.prototype = Object.create(ProcessControls.prototype);
DownloadControls.prototype.constructor = DownloadControls;
DownloadControls.prototype.namespace = 'download';

DownloadControls.prototype.update = function(data) {
    if ( ! data) {
        return;
    }
    this.exporter.addSection(data.vertices, data.faces);
};

DownloadControls.prototype.done = function() {
    ProcessControls.prototype.done.call(this);
    this.exporter.finishModel();
};

DownloadControls.prototype.start = function() {
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
    var filename = [
        'marched',
        new Date().getTime(),
        dims[0] + 'x' + dims[1] + 'x' + dims[2]
    ].join('-');
    this.exporter.startModel(filename);

    this.cubeMarch.march({
        onSection: this.update.bind(this),
        onProgress: this.progress.bind(this),
        onDone: this.done.bind(this),
        mapDistance: this.editor.getValue()
    });
};

DownloadControls.prototype.cancel =function() {
    ProcessControls.prototype.cancel.call(this);
    this.cubeMarch.abort();
};

DownloadControls.prototype.progressMessage = function(cubesMarched, totalCubes) {
    var message = ProcessControls.prototype.progressMessage.call(this, cubesMarched, totalCubes);
    return 'Generating STL: ' + message;
};

DownloadControls.prototype.doneMessage = function() {
    var message = ProcessControls.prototype.doneMessage.call(this);
    return 'STL generation ' + message;
};

module.exports = DownloadControls;
