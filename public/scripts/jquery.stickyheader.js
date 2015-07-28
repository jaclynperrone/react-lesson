$(function(){
	$('table').each(function() {
		if($(this).find('thead').length > 0 && $(this).find('th').length > 0) {
			// Clone <thead>
			var $w	   = $(window),
					$t	   = $(this),
					$thead = $t.find('thead').clone();

			// Create new sticky table head (basic)
			$t.after('<table class="sticky-thead" />');

			// Create shorthand for things
			var $stickyHead  = $(this).siblings('.sticky-thead'),
				$stickyInsct = $(this).siblings('.sticky-intersect'),
				$stickyWrap  = $(this).parent('.sticky-wrap');

			$stickyHead.append($thead);

			$stickyInsct.html('<thead><tr><th>'+$t.find('thead th:first-child').html()+'</th></tr></thead>');
			
			// Set widths
			var setWidths = function () {
					$t
					.find('thead th').each(function (i) {
						$stickyHead.find('th').eq(i).width($(this).width());
					});

					// Set width of sticky table head
					$stickyHead.width($t.width());

				},
				repositionStickyHead = function () {
				
					// Check if wrapper parent is overflowing along the y-axis
					if($t.height() > $stickyWrap.height()) {
						// If it is overflowing (advanced layout)
						// Position sticky header based on wrapper scrollTop()
						if($stickyWrap.scrollTop() > 0) {
							// When top of wrapping parent is out of view
							$stickyHead.add($stickyInsct).css({
								opacity: 1,
								top: $stickyWrap.scrollTop()
							});
						} else {
							// When top of wrapping parent is in view
							$stickyHead.add($stickyInsct).css({
								opacity: 0,
								top: 0
							});
						}
					} else {
						// If it is not overflowing (basic layout)
						// Position sticky header based on viewport scrollTop
						if($w.scrollTop() > $t.offset().top && $w.scrollTop() < $t.offset().top + $t.outerHeight()) {
							// When top of viewport is in the table itself
							$stickyHead.add($stickyInsct).css({
								opacity: 1,
								top: $w.scrollTop() - $t.offset().top
							});
						} else {
							// When top of viewport is above or below table
							$stickyHead.add($stickyInsct).css({
								opacity: 0,
								top: 0
							});
						}
					}
				};

			setWidths();
 			//Listen to scrolling event on the parent wrapper (will fire if there is an overflow)
			$t.parent('.sticky-wrap').scroll($.throttle(250, function() {
				repositionStickyHead();
			}));

			$w
			.load(setWidths)
			.resize($.debounce(250, function () {
				setWidths();
				repositionStickyHead();
			}))
			.scroll($.throttle(250, repositionStickyHead));
		}
	});
});