'use strict';

export var escapeHTML = function (s, escape_characters, escape_map) {
    return s.replace(escape_characters, function (c) {
        return escape_map[c];
    })
};

export var exportToCSV = function (csvFile, fileName) {
    if(csvFile !== null) {
        var blob = new Blob([csvFile], {type: 'text/csv;charset=utf-8;'});
        if (navigator.msSaveBlob) { // IE 10+
            navigator.msSaveBlob(blob, fileName);
        } else {
            var link = document.createElement("a");
            if (link.download !== undefined) { // feature detection
                // Browsers that support HTML5 download attribute
                var url = URL.createObjectURL(blob);
                link.setAttribute("href", url);
                link.setAttribute("download", fileName);
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        }
    }
}