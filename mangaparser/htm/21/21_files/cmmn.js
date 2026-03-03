if( window.matchMedia('(min-width:768px)').matches ){

	$(function ($) {
		var nav = $('.local_head'),
		offset = nav.offset();
		$(window).scroll(function () {
			if ($(window).scrollTop() > offset.top - parseInt(nav.css('padding-top'), 10)) {
				if (!nav.hasClass('nav_fixed')) {
					nav.addClass('nav_fixed');
					var $content = $('.content');
					$content.css('margin-top', (nav.height() + 20) + 'px');
				}
			} else {
				if (nav.hasClass('nav_fixed')) {
					nav.removeClass('nav_fixed');
					$('.content').css('margin-top', '');
				}
			}
		});
	});

	$('.parent').click(function () {
		$(this).siblings('.child').slideToggle(300);
		$(this).addClass('menu-active');
		$('.parent').not($(this)).siblings('.child').slideUp(100);
		$('.parent').not($(this)).removeClass('menu-active');
	});
	$(document).on('click touchend', function (e) {
		if (!$(e.target).closest('.parent').length) {
		  $('.parent').removeClass('menu-active');
		  $('.child').slideUp(100);
		}
	});
	
};