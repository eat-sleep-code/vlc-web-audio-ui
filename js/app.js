var ccmd = "";
var current_que = 'main';
var current_playlist_id = -1;
var intv = 0;
var pollStatus = true;
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
	}
}



function updateStatus() {
	$.ajax({
		url: 'requests/status.xml',
		success: function (data, status, jqXHR) {
			if (current_que == 'main') {
				//console.log(data);
				$('.dynamic').empty();
				if ($('[name="title"]', data).text().length > 0) {
					$('#sourceStream').append($('[name="title"]', data).text());
				} else {
					$('#sourceStream').append($('[name="filename"]', data).text());
				}
				$('#sourceNowPlaying').append($('[name="now_playing"]', data).text());
				$('#sourcePlayTime').append(format_time($('time', data).text()));
				$('#currentVolume').append(Math.round($('volume', data).text() / 2.56) + '%');
				if (!$('#volumeSlider').data('clicked')) {
					$('#volumeSlider').slider({
						value: ($('volume', data).text() / 5.12)
					});
				}
				$('#buttonPlay').attr('state', $('state', data).text()).attr('mrl', $('[name="filename"]', data).text());
				if ($('state', data).text() == 'playing') {
					$('#buttonPlay').removeClass('fa-play').addClass('fa-pause');
				} else {
					$('#buttonPlay').removeClass('fa-pause').addClass('fa-play');
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
	$.ajax({
		url: 'requests/status.xml',
		data: params,
		success: function (data, status, jqXHR) {
			if (append != undefined) {
				eval(append);
			}
		}
	});
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
			$("#currentVolume").empty().append(ui.value + "%");
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
		if ($(this).attr('state') == 'stopped') {
			sendCommand({
				'command': 'pl_play',
				'id': current_playlist_id
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

	updateStatus();
});
