/*

*/

(function($) {
	/*
		Global IMV namespace to keep the objects organized
	*/
	window.Imv = Imv = {};
	
	var debug = true;
	
	var nextPlayerId = 1;
	
	function cbWrapper() {
		var a = Array.prototype.slice.call(arguments);
		var func = a.shift();
		return function () {
			a.concat(Array.prototype.slice.call(arguments));
			func.apply(null, a);
		}
	}
	
	/*
		A video frame (Player) is the actual player object that is manipulated and moved
		around the screen.
	*/
	Imv.Player = function Player(container, sources) {
		var sources = sources;
		this.id = nextPlayerId++;
		
		var self = this;
		
		var ready = false;
		
		var video = $('<video>');
		//video.attr('controls', 'controls');
		video.addClass('imv-video');
		this.video = video[0];
		
		this.video.addEventListener('loadedmetadata', videoReady);
		
		video.attr('id', 'imv_player' + this.id);
		//video.attr('src', sources[0].src);
		
		for (var i in sources) {
			video.append($('<source src="' + sources[i].src + '" type="' + sources[i].type + '" />'));
		}
		
		var div = this.div = $('<div>');
		
		div.attr('id', 'imv_outer' + this.id);
		div.addClass('imv-abs');
		//div.hide();
		var crop = $('<div>');
		crop.attr('id', 'imv_crop' + this.id);
		crop.addClass('imv-rel imv-crop imv-full');
		div.append(crop);
		crop.append(video);
		
		container.append(div);
		
		var doc = $(document);
		
		var mouseoff = {x: 0, y: 0};
		var defoff = {x: 0, y: 0};
		
		var startx, starty;
		
		function useMouse() {
			div.mousedown(mousedown);
		}
		this.useMouse = useMouse;
		
		function mute() {
			var a = arguments;
			if (a.length == 0) {
				return this.video.muted;
			} else if (a.length == 1) {
				this.video.muted = a[0];
			}
			return this;
		}
		this.mute = mute;
		
		function videoReady() {
			ready = true;
		}
		
		function isReady() {
			return ready;
		}
		this.isReady = isReady;
		
		function doOffset() {
			var vw = self.video.width;
			var vh = self.video.height;
			
			var cx = div.width() / 2;
			var cy = div.height() / 2;
			
			var vw2 = vw / 2, vh2 = vh / 2;
			
			var cx2 = cx - vw2;
			var cy2 = cy - vh2;
			
			l = defoff.x + mouseoff.x;
			t = defoff.y + mouseoff.y;
			
			if (l < -1) {
				l = -1;
			} else if (l > 1) {
				l = 1;
			}
			
			if (t < -1) {
				t = -1;
			} else if (t > 1) {
				t = 1;
			}
			
			x = cx2 * (1 + l);
			y = cy2 * (1 + t);
			
			video.css('margin-left', x).css('margin-top', y);
		}
		
		function mousedown(evt) {
			startx = evt.clientX;
			starty = evt.clientY;
			
			doc.mousemove(mousemove);
			doc.mouseup(mouseup);
			
			evt.preventDefault();
			return false;
		}
		
		function mousemove(evt) {
			var dx = evt.clientX - startx;
			var dy = evt.clientY - starty;
			var rx = dx / (div.width() / 2);
			var ry = dy / (div.height() / 2);
			
			mouseoff.x = rx;
			mouseoff.y = ry;
			
			doOffset();
			
			evt.preventDefault();
			return false;
		}
		
		function mouseup(evt) {
			doc.unbind('mousemove');
			doc.unbind('mouseup');
			
			mouseoff.x = 0;
			mouseoff.y = 0;
			
			evt.preventDefault();
			return false;
		}
		
		function scale() {
			var a = arguments;
			if (a.length == 1) {
				var s = a[0];
				var vw, vh, cw, ch, sw, sh, w, h;
				
				/*vw = this.video.videoWidth * a[0];
				vh = this.video.videoHeight * a[0];
				cw = container.width() * a[0];
				ch = container.height() * a[0];
				
				this.video.width = vw < cw ? vw : cw;
				this.video.height = vh < ch ? vh : ch;*/
				
				vw = self.video.videoWidth;
				vh = self.video.videoHeight;
				cw = container.width();
				ch = container.height();
				
				if (cw < vw) {
					w = cw * s;
					sw = w / vw;
				} else {
					w = vw * s;
					sw = s;
				}
				
				if (ch < vh) {
					h = ch * s;
					sh = h / vh;
				} else {
					h = vh * s;
					sh = s;
				}
				
				if (sw < sh) {
					sh = sw;
				} else if (sh < sw) {
					sw = sh;
				}
				
				self.video.width = vw * sw;
				self.video.height = vh * sh;
				
				return self;
			} else {
				return self.video.width / self.video.videoWidth;
			}
		}
		this.scale = scale;
		
		function position() {
			var a = arguments;
			var x, y;
			if (a.length == 0) {
				x = div.css('left');
				x += div.width() / 2;
				
				y = div.css('top');
				y += div.height() / 2;
				
				return {x: x, y: y};
			} else if (a.length == 1) {
				x = a[0].x;
				y = a[0].y;
			} else if (a.length == 2) {
				x = a[0];
				y = a[1];
			}
			
			var dw2 = div.width() / 2;
			var dh2 = div.height() / 2;
			
			var w = container.width();
			var h = container.height();
			
			var w2 = w / 2, h2 = h / 2;
			
			div.css('margin-left', x * w - dw2 + w2).css('margin-top', y * h - dh2 + h2);
			return self;
		}
		this.position = position;
		
		function size() {
			var a = arguments;
			var w, h, vw, vh, cw, ch, sw, sh;
			
			if (a.length == 0) {
				
			} else if (a.length == 1) {
				sw = a[0].w;
				sh = a[0].h;
			} else if (a.length == 2) {
				sw = a[0];
				sh = a[1];
			}
			
			vw = self.video.videoWidth;
			vh = self.video.videoHeight;
			cw = container.width();
			ch = container.height();
			
			if (cw < vw) {
				w = cw * sw;
				sw = w / vw;
			} else {
				w = vw * sw;
				//sw = s;
			}
			
			if (ch < vh) {
				h = ch * sh;
				sh = h / vh;
			} else {
				h = vh * sh;
				//sh = s;
			}
				
			if (sw < sh) {
				sh = sw;
			} else if (sh < sw) {
				sw = sh;
			}
			
			w = vw * sw;
			h = vh * sh;
			
			crop.width(w);
			crop.height(h);
			div.width(w);
			div.height(h);
			
			return self;
		}
		this.size = size;
		
		function offset() {
			var a = arguments;
			var x, y, cx, cy, l, t;
				
			if (a.length == 0) {
				
				return {l: x, t: y};
			} else if (a.length == 1) {
				l = a[0].l;
				t = a[0].t;
			} else if (a.length == 2) {
				l = a[0];
				t = a[1];
			}
			
			defoff.x = l;
			defoff.y = t;
			
			doOffset();
			
			//video.css('margin-left', x - div.width() / 2 + cx).css('margin-top', y - div.height() / 2 + cy);
			return self;
		}
		this.offset = offset;
		
		function visible() {
			var a = arguments;
			if (a.length == 0) {
				return div.css('display') != 'none';
			} else if (a.length == 1) {
				if (a[0]) {
					div.hide();
				} else {
					div.show();
				}
			}
			return self;
		}
		this.visible = visible;
	}
	
	/*
		A control instance handles event creation of the player controls.
		Which controls are visible can be specified, such as Play/Pause,
		Stop, Scrubber, Time, etc.
		
		A Sync object is passed in as the recipient of the interface events.
	*/
	Imv.Imv = function Imv(opts) {
		var obj = this.obj = {};
		
		obj.play = null;
		obj.stop = null;
		obj.scrubber = null;
		obj.volume = null;
		obj.mute = null;
		obj.time = null;
		
		var players = null;
		var mainPlayer = null;
		var config = null;
		
		var layoutDelay = 1000;
		var syncDelay = 1000;
		
		var heightDiff;
		
		var paused = true;
		
		var layoutTimer, syncTimer;
		
		function play() {
			if (!mainPlayer.video.ended && !mainPlayer.video.paused) {
				pause();
			} else {
				for (var i = players.length - 1; i >= 0; --i) {
					$('#imv_player' + players[i].id)[0].play();
				}
				
				paused = false;
				
				doLayout();
				doSync();
			}
		}
		this.play = play;
		
		function doLayout() {
			if (layoutTimer) clearTimeout(layoutTimer);
			
			config.applyLayout(mainPlayer.video.currentTime, players);
			
			if (!paused) {
				layoutTimer = setTimeout(doLayout, layoutDelay);
			}
		}
		
		function doSync() {
			if (syncTimer) clearTimeout(syncTimer);
			
			if (!paused) {
				syncTimer = setTimeout(doSync, syncDelay);
			}
		}
		
		function pause() {
			for (var i = 0; i < players.length; ++i) {
				$('#imv_player' + players[i].id)[0].pause();
			}
			
			paused = true;
		}
		this.pause = pause;
		
		function videoPlay() {
				if (obj.play && obj.play.object) {
					obj.play.object.attr('value', 'Pause');
				}
		}
		
		function videoStop() {
			if (obj.play && obj.play.object) {
				obj.play.object.attr('value', 'Play');
			}
			
			paused = true;
		}
		
		//time in seconds
		function scrub(time) {
			var ready = true;
			for (var i in players) {
				ready = ready && players[i].isReady();
			}

			if (!ready) {
				setTimeout(cbWrapper(scrub, time), 100);
			} else {
				config.reset();
				mainPlayer.video.currentTime = time;
				videoUpdate();
				doLayout();
			}
		}
		this.scrub = scrub;
		
		function volume(level) {
		}
		this.volume = volume;
		
		function stopEvt(evt) {
			evt.preventDefault();
			return false;
		}
		
		function videoUpdate(evt) {
			var v = mainPlayer.video;
			if (obj.time && obj.time.object) {
				var min = Math.floor(v.currentTime / 60);
				var sec = Math.floor(v.currentTime % 60);
				if (sec < 10) {
					sec = '0' + sec;
				}
				
				obj.time.object.html(min + ':' + sec);
			}
			
			if (obj.scrubber && obj.scrubber.object) {
				var w = v.currentTime / v.duration;
				obj.scrubber.object.width((w * 100) + '%');
			}
		}
		
		function fixSync() {
			var sTime = mainPlayer.video.currentTime;
			//If only the main video is playing, there's no need to sync...
			if (config.numVideos(sTime) <= 1) {
				return;
			}
			
			var times = config.playerTimes(sTime);
			
			for (var i = 0; i < times.length; ++i) {
				players[times[i].index].video.currentTime = times[i] + mainPlayer.video.currentTime - sTime;
			}
		}
		this.fixSync = fixSync;
		
		function mouseUpScrubber(evt) {
			var off = obj.scrubber.object.parent().offset();
			var x = evt.pageX - off.left;
			var l = x / obj.scrubber.object.parent().width();
			var t = mainPlayer.video.duration * l;
			
			pause();
			
			scrub(t);
			
			play();
			
			return stopEvt(evt);
		}
		
		function playClick(evt) {
			play();
			return stopEvt(evt);
		}
		
		function resize() {
			mainPlayer.div.parent().height($(window).height() - heightDiff);
			//config.applyLayout(mainPlayer.video.currentTime, players);
		}
		
		//*********************************************************
		// Instance initialization
		//*********************************************************
		
		if (opts.play && opts.play.object) {
			obj.play = {
				object: opts.play.object
			};
			
			obj.play.object.click(playClick);
		}
		
		if (opts.scrubber && opts.scrubber.object) {
			obj.scrubber = {
				object: opts.scrubber.object
			};
			
			obj.scrubber.object.parent().mouseup(mouseUpScrubber);
			obj.scrubber.object.parent().mousedown(stopEvt);
		}
		
		if (opts.time && opts.time.object) {
			obj.time = {
				object: opts.time.object
			};
		}
		
		if (opts.syncRate) {
			syncRate = opts.syncRate;
		}
		
		if (opts.layoutRate) {
			layoutDelay = 1000 / opts.layoutRate;
		}
		
		if (opts.syncRate) {
			syncDelay = 1000 / opts.syncRate;
		}
		
		players = opts.players;
		mainPlayer = players[0];
		config = opts.config;
		
		heightDiff = $(window).height() - mainPlayer.div.parent().height();
		
		config.setImv(this);
		
		mainPlayer.video.addEventListener('timeupdate', videoUpdate);
		mainPlayer.video.addEventListener('play', videoPlay);
		mainPlayer.video.addEventListener('pause', videoStop);
		mainPlayer.video.addEventListener('ended', videoStop);
		
		$(window).resize(resize);
	}
	
	/*
		Config is pointed to a JavaScript object that describes how
		many assets are loaded, how many video players are visible,
		movements, transitions, etc.
		
		The main object: Imv(), uses an instance of Config for performing the
		layout of the videos.
	*/
	Imv.Config = function Config(opts) {
		
		var keysRaw;
		
		//keyHash is an array, an index for each player object.
		//at each position is a dict keyed by the time of the keyframe.
		var keyHash = {};
		var spanHash = {};
		
		var imv;
		
		var dataReady = false;
		var init = false;
		var lastTS = {};
		
		function setImv(i) {
			imv = i;
			if (dataReady && !init) {
				imv.scrub(0);
				init = true;
			}
		}
		this.setImv = setImv;
		
		function ajaxData(cfg) {
			$.ajax({
				url: cfg.url,
				dataType: 'json',
				data: cfg.data,
				success: function(data) {
					setData(data);
					
					if (opts.success) {
						opts.success();
					}
				},
				error: function() {
					if (opts.error) {
						opts.error();
					}
				}
			});
		}
		this.ajaxData = ajaxData;
		
		function numVideos(time) {
		}
		this.numVideos = numVideos;
		
		function playerTimes(time) {
			return [];
		}
		this.playerTimes = playerTimes;
		
		function applyLayout(time, players) {
			for (var p in players) {
				var player = players[p];
				var l = getAbsolute(p, time);
				if (l) {
					player.scale(l.scale).position(l.pos).offset(l.offset)
						.size(l.size).visible(l.paused);
						
					if (p != 0 && (!lastTS[p] || l.id != lastTS[p].id)) {
						player.video.currentTime = l.time;
						lastTS[p] = l;
					}
				}
			}
		}
		this.applyLayout = applyLayout;
		
		function reset() {
			lastTS = {};
		}
		this.reset = reset;
		
		function getDelta(player, time, delta) {
			var ts = findPrev(player, time, 1);
			if (ts) {
				return ts.getDelta(delta);
			}
		}
		this.getDelta = getDelta;
		
		function getAbsolute(player, time) {
			var ts = findPrev(player, time, 1);
			if (ts) {
				return ts.getAbsolute(time);
			}
		}
		this.getAbsolute = getAbsolute;
		
		function findPrev(player, time, span) {
			var pHash;
			
			if (span) {
				pHash = spanHash[player];
			} else {
				pHash = keyHash[player];
			}
			
			if (!pHash) {
				return;
			}
			
			var t = Math.floor(time);
			while (t >= 0) {
				if (pHash[t]) {
					var tHash = pHash[t];
					var times = Object.keys(tHash);
					
					for (var i = times.length - 1; i >= 0; --i) {
						var at = times[i];
						if (at <= time) {
							return tHash[at];
						}
					}
				}
				--t;
			}
		}
		this.findPrev = findPrev;
		
		function findNext(player, time, span) {
			var pHash;
			
			if (span) {
				pHash = spanHash[player];
			} else {
				pHash = keyHash[player];
			}
			
			var t = Math.floor(time);
			var secs = Object.keys(pHash);
			var max = secs[secs.length - 1];
			
			while (t <= max) {
				if (pHash[t]) {
					tHash = pHash[t];
					for (var at in tHash) {
						if (at > time) {
							return tHash[at];
						}
					}
				}
				++t;
			}
		}
		this.findNext = findNext;
		
		function setData(data) {
			keysRaw = data.keyFrames;
			
			for (var i = 0; i < keysRaw.length; ++i) {
				var p = keysRaw[i].player;
				var t = Math.floor(keysRaw[i].time);
				
				if (!keyHash[p]) {
					keyHash[p] = {};
				}
				
				if (!keyHash[p][t]) {
					keyHash[p][t] = {};
				}
				
				if (keyHash[p][t][keysRaw[i].time]) {
					console.log('Time collision detected in keyframes for video ' + p + ' in time ' + t);
				}
				
				keyHash[p][t][keysRaw[i].time] = keysRaw[i];
			}
			
			createTimeSpans();
			
			dataReady = true;
			if (imv) {
				imv.scrub(0);
				init = true;
			}
		}
		this.setData = setData;
		
		function createTimeSpans() {
			var first;
			var prev;
			
			for (var p in keyHash) {
				first = true;
				for (var s in keyHash[p]) {
					for (var t in keyHash[p][s]) {
						if (first) {
							first = false;
							prev = keyHash[p][s][t];
						} else {
							if (!spanHash[p]) {
								spanHash[p] = {};
							}
							var ps = Math.floor(prev.time);
							if (!spanHash[p][ps]) {
								spanHash[p][ps] = {};
							}
							
							spanHash[p][ps][prev.time] = new TimeSpan(prev, keyHash[p][s][t]);
							prev = keyHash[p][s][t];
						}
					}
				}
			}
		}
		
		if (opts.keyFrames) {
			setData({keyFrames: opts.keyFrames});
		} else if (opts.url) {
			ajaxData({url: opts.url});
		}
		
		if (debug) {
			window.keyHash = keyHash;
		}
	}
	
	/*
		pos = {x: 0, y: 0}
		size = {w: 0, h: 0}
		offset = {l: 0, t: 0}
		
		All of the above are relative to the parent container.
		
		Pos references the center of the video player
		
		Times are all in milliseconds.
	*/
	
	var KeyFrame = Imv.KeyFrame = function(playerID, time, timeSync, pos, size, offset, scale, paused) {
		this.player = player;
		this.time = time;
		this.timeSync = timeSync;
		this.pos = pos;
		this.size = size;
		this.offset = offset;
		this.scale = scale;
		this.paused = paused;
	}
	
	/*
		TimeSpan takes two KeyFrames and pre-calculates the deltas used
		for updating the page layout during every triggered event.
	*/
	var TimeSpan = Imv.TimeSpan = function(startKey, endKey) {
		/*
			Used during normal timeUpdate event triggers to return
			how much the layout of the videos should change.
		*/
		function getDeltas(delta) {
			return {
				dx: this.dx * delta,
				dy: this.dy * delta,
				dw: this.dw * delta,
				dh: this.dh * delta,
				ds: this.ds * delta
			}
		}
		this.getDeltas = getDeltas;
		
		/*
			Used after a time reset to figure out what the specific properties
			of the layout should be, instead of just how much it's changed in a given
			time delta.
		*/
		function getAbsolute(time) {
			var delta = time - this.start.time;
			
			return {
				pos: {
					x: this.dx * delta + this.start.pos.x,
					y: this.dy * delta + this.start.pos.y
				},
				size: {
					w: this.dw * delta + this.start.size.w,
					h: this.dh * delta + this.start.size.h
				},
				offset: {
					l: this.start.offset.l,
					t: this.start.offset.t
				},
				scale: this.ds * delta + this.start.scale,
				paused: this.paused,
				time: time + this.sync,
				id: this.start.time
			}
		}
		this.getAbsolute = getAbsolute;
		
		this.start = startKey;
		this.end = endKey;
		
		this.span = endKey.time - startKey.time;
		
		this.sync = this.start.timeSync;
		
		this.paused = this.start.paused;
		
		//Change in position per mS
		this.dx = (this.end.pos.x - this.start.pos.x) / this.span;
		this.dy = (this.end.pos.y - this.start.pos.y) / this.span;
		
		//Change in size per mS
		this.dw = (this.end.size.w - this.start.size.w) / this.span;
		this.dh = (this.end.size.h - this.start.size.h) / this.span;
		
		//Change in offset per mS
		this.dl = (this.end.offset.l - this.start.offset.l) / this.span;
		this.dt = (this.end.offset.t - this.start.offset.t) / this.span;
		
		//Change in scale per mS
		this.ds = (this.end.scale - this.start.scale) / this.span;
	}
})(jQuery);
