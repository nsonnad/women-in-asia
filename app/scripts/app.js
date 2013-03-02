define(['drawMap', 'education', 'surveys', 'sexRatio', 'parliament'], function (drawMap, education, surveys, sexRatio, parliament) {
    'use strict';
    var init = function () {
        drawMap.init();
        education.init();
        surveys.init();
        sexRatio.init();
        parliament.init();
    };

    return { init: init };
});