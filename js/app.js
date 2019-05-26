var clickCommand = "";
var interval = 0;
var currentPlaylistId = -1;
var previousPlaylistId = -1;



function formatTime(s) {
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



function setInterval() {
	if (interval > 0) {
		interval++;
		setTimeout(setInterval, 500);
	} else {
		interval = 0;
	}
}



function updateStatus() {
	$.ajax({
		url: 'requests/status.xml',
		success: function (data, status, jqXHR) {
			//console.log(data);
			$('.dynamic').empty();
			if ($('[name="title"]', data).text().length > 0) {
				$('#sourceStream').append($('[name="title"]', data).text());
			} else {
				$('#sourceStream').append($('[name="filename"]', data).text());
			}
			$('#sourceNowPlaying').append($('[name="now_playing"]', data).text());
			$('#sourcePlayTime').append(formatTime($('time', data).text()));
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

			currentPlaylistId = parseInt($('currentplid', data).text());
			if (previousPlaylistId != currentPlaylistId) {
				previousPlaylistId = currentPlaylistId;
			}

			setTimeout(updateStatus, 1000);
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
	$('#volumeSlider').slider({
		range: "min",
		value: 50,
		min: 0,
		max: 100,
		start: function (event, ui) {
			$('#volumeSlider').data('clicked', true);
		},
		stop: function (event, ui) {
			$('#currentVolume').empty().append(ui.value + "%");
			sendCommand({
				'command': 'volume',
				'val': Math.round(ui.value * 5.12)
			})
			$('#volumeSlider').data('clicked', false);
		}
	});
	$('#volumeSlider').data('clicked', false);

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
				'id': currentPlaylistId
			});
		} else {
			sendCommand({
				'command': 'pl_pause'
			});
		}
		return false;
	});

	$('#buttonPrev').mousedown(function () {
		interval = 1;
		clickCommand = 'prev';
		setInterval();
		return false;
	});
	$('#buttonPrev').mouseup(function () {
		if (interval <= 5) {
			sendCommand({ 'command': 'pl_previous' });
		}
		interval = 0;
		return false;
	});

	$('#buttonNext').mousedown(function () {
		interval = 1;
		clickCommand = 'next';
		setInterval();
		return false;
	});
	$('#buttonNext').mouseup(function () {
		if (interval <= 5) {
			sendCommand({ 'command': 'pl_next' });
		}
		interval = 0;
		return false;
	});

	$('#buttonAdd').click(function() {
		var quickAddUrl = prompt('Enter the url of the stream that you wish to listen to:');
		if (quickAddUrl) {
			sendCommand({
				'command': 'in_play',
				'input': quickAddUrl,
				'option': 'novideo'
			})
		}
	});

	updateStatus();
});
