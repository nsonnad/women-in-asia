define(['jquery'], function ($) {
    'use strict';

    $('#nav a').on('click', function () {

        var scrollAnchor = $(this).attr('data-scroll'),
            scrollPoint = $('section[data-anchor="' + scrollAnchor + '"]').offset().top - 53;

        $('body,html').animate({
            scrollTop: scrollPoint
        }, 750);

        return false;

    });

    $(window).scroll(function () {
        var windscroll = $(window).scrollTop();
        $('section').each(function (i) {
            if ($(this).position().top <= windscroll + 80) {
                $('#nav a.active').removeClass('active');
                $('#nav a').eq(i).addClass('active');
            }
        });
    });

});