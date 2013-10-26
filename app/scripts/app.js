define(['drawMap', 'education', 'surveys', 'sexRatio', 'parliament', 'boards', 'scroll'], function (drawMap, education, surveys, sexRatio, parliament, boards, scroll) {
    'use strict';
    var render = function () {
        drawMap.init();
        education.init();
        surveys.init();
        sexRatio.init();
        parliament.init();
        boards.init();
        scroll;
    }

    var init = function () {
        $('#loader').remove();
        $('#headlineWrap').fadeIn(2500, function () { $('#navWrap').fadeIn(1000); });
        $('#container1, #container2').removeClass('loading').addClass('loaded');
        
        render();
    };

    return { init: init };
});