require(['drawMap'], function(drawMap) {

  $('a[href^=#]').click(function(e){

    var name = $(this).attr('href').substr(1);
    var pos = $('[id='+name+']').offset();
    var center = ($(window).height() - $('[id='+name+']').height()) / 2

    $('body').animate({ scrollTop: pos.top - center });
    e.preventDefault();

    drawMap.panMap($(this).html())
	// drawMap.panMap($(this).html())
	
	});
});