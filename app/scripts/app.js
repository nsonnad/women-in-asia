define(['drawMap', 'education', 'surveys', 'sexRatio', 'parliament', 'boards', 'scroll'], function (drawMap, education, surveys, sexRatio, parliament, boards, scroll) {
    'use strict';
    var init = function () {
        drawMap.init();
        education.init();
        surveys.init();
        sexRatio.init();
        parliament.init();
        boards.init();
        scroll;
    };

    return { init: init };
});