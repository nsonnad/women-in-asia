define(['font!google,families:[Enriqueta]', 'drawMap', 'education', 'surveys', 'sexRatio', 'parliament', 'scroll'], function (font, drawMap, education, surveys, sexRatio, parliament, scroll) {
    'use strict';
    var init = function () {
        drawMap.init();
        education.init();
        surveys.init();
        sexRatio.init();
        parliament.init();
        scroll;
    };

    return { init: init };
});