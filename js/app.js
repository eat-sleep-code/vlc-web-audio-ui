var intv = 0;
var ccmd = "";
var pollStatus = true;
var current_que = 'main';
var current_playlist_id = -1;
var previous_playlist_id = -1;


var stream_server = window.location.hostname;

function format_time(s) {
	var hours = Math.floor(s / 3600);
	var minutes = Math.floor((s / 60) % 60);
	var seconds = Math.floor(s % 60);
	hours = hours < 10 ? "0" + hours : hours;
	minutes = minutes < 10 ? "0" + minutes : minutes;
	seconds = seconds < 10 ? "0" + seconds : seconds;
	return hours + ":" + minutes + ":" + seconds;
}

function toFloat(text) {
	return parseFloat(text.replace(',', '.'));
}

function setIntv() {
	if (intv > 0) {
		intv++;
		setTimeout(setIntv, 500);
	} else {
		intv = 0;
	}
	if (intv > 5) {
		var nt = 0;
		switch (ccmd) {
			case 'prev':
				nt = Math.max(0, $('#seekSlider').slider('value') - 10);
				break;
			case 'next':
				nt = Math.max(0, $('#seekSlider').slider('value') + 10);
				break;
		}
        /* switch (current_que) {
        case 'main':
            sendCommand({
                'command': 'seek',
                'val': Math.round((nt / 100) * $('#seekSlider').attr('totalLength')),
                plreload: false
            });
            break;
        case 'stream':
            sendVLMCmd('control Current seek ' + nt);
            break;
		}
		*/
	}
}







function updateStatus() {
	$.ajax({
		url: 'requests/status.xml',
		success: function (data, status, jqXHR) {
			if (current_que == 'main') {
				$('.dynamic').empty();
				$('#mediaTitle').append($('[name="filename"]', data).text());
				$('#currentTime').append(format_time($('time', data).text()));
				$('#currentVolume').append(Math.round($('volume', data).text() / 2.56) + '%');
				if (!$('#volumeSlider').data('clicked')) {
					$('#volumeSlider').slider({
						value: ($('volume', data).text() / 5.12)
					});
				}
				$('#buttonPlay').attr('state', $('state', data).text()).attr('mrl', $('[name="filename"]', data).text());
				if ($('state', data).text() == 'playing') {
					$('#buttonPlay').removeClass('paused').addClass('playing');
				} else {
					$('#buttonPlay').removeClass('playing').addClass('paused');
				}

				current_playlist_id = parseInt($('currentplid', data).text());
				if (previous_playlist_id != current_playlist_id) {
					previous_playlist_id = current_playlist_id;
				}

				if (pollStatus) {
					setTimeout(updateStatus, 1000);
				}
			}
		},
		error: function (jqXHR, status, error) {
			setTimeout(updateStatus, 500);
		}
	});
}

function sendCommand(params, append) {
	if (current_que == 'stream') {
		$.ajax({
			url: 'requests/status.xml',
			data: params,
			success: function (data, status, jqXHR) {
				console.log('1');
				if (append != undefined) {
					eval(append);
				}
				updateStatus();
			}
		});
	} else {
		if (params.plreload === false) {
			$.ajax({
				url: 'requests/status.xml',
				data: params,
				success: function (data, status, jqXHR) {
					console.log('2');
					if (append != undefined) {
						eval(append);
					}
				}
			});
		} else {
			$.ajax({
				url: 'requests/status.xml',
				data: params,
				success: function (data, status, jqXHR) {
					console.log('3');
					if (append != undefined) {
						eval(append);
					}
				}
			});
		}
	}
}


$(function () {
	$("#volumeSlider").slider({
		range: "min",
		value: 50,
		min: 0,
		max: 100,
		start: function (event, ui) {
			$("#volumeSlider").data('clicked', true);
		},
		stop: function (event, ui) {
			$("#currentVolume").empty().append(ui.value * 2 + "%");
			sendCommand({
				'command': 'volume',
				'val': Math.round(ui.value * 5.12)
			})
			$("#volumeSlider").data('clicked', false);
		}
	});
	$("#volumeSlider").data('clicked', false);

	$('#buttonStop').click(function () {
		sendCommand({
			'command': 'pl_stop'
		})
		return false;
	});

	$('#buttonPlay').click(function () {
		current_id = 0;
		if ($(this).attr('state') == 'stopped') {
			var id = current_id;
			sendCommand({
				'command': 'pl_play',
				'id': id
			});
		} else {
			sendCommand({
				'command': 'pl_pause'
			});
		}
		return false;
	});

	$('#buttonPrev').mousedown(function () {
		intv = 1;
		ccmd = 'prev';
		setIntv();
		return false;
	});
	$('#buttonPrev').mouseup(function () {
		if (intv <= 5) {
			sendCommand({ 'command': 'pl_previous' });
		}
		intv = 0;
		return false;
	});

	$('#buttonNext').mousedown(function () {
		intv = 1;
		ccmd = 'next';
		setIntv();
		return false;
	});
	$('#buttonNext').mouseup(function () {
		if (intv <= 5) {
			sendCommand({ 'command': 'pl_next' });
		}
		intv = 0;
		return false;
	});

	/* $('.buttonszone').each(function(i){
		$(this).mouseover(function(){
			$(this).addClass('buttonszone_active');
		}).mouseleave(function () {
		$(this).removeClass('buttonszone_active');
		});
	});
	*/
	updateStatus();
});
