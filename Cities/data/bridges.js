/*
	KeyFrames for Like Vintage - Bridges music video using Imv library

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
	
	//template:
	{
		time: ,
		player: ,
		timeSync: ,
		pos: {x: , y: },
		size: {w: , h: },
		offset: {l: , t: },
		scale: ,
		paused: 
 	}
*/

var drvPlay = 0;

var drvFullScale = 0.8;
var drvMidScale = 0.8;

var drvStartX = 0;
var drvMidX = -0.25;

var memPlay = 1;

var memMidSize = 0.8;
var memMidScale = 1.5;

var memStartX = 0.45;
var memMidX = 0.25;

var keyFrames = [
	{
		time: 0,
		player: drvPlay,
		timeSync: 0,
		pos: {x: drvStartX, y: 0},
		size: {w: 'auto', h: 'auto'},
		offset: {l: 0, t: 0},
		scale: drvFullScale,
		paused: false
 	},
 	{
		time: 0,
		player: memPlay,
		timeSync: 0,
		pos: {x: memStartX, y: 0},
		size: {w: memMidSize, h: memMidSize},
		offset: {l: 0, t: 0},
		scale: 0,
		paused: true
 	},
	{
		time: 35,
		player: drvPlay,
		timeSync: 0,
		pos: {x: drvStartX, y: 0},
		size: {w: 'auto', h: 'auto'},
		offset: {l: 0, t: 0},
		scale: drvFullScale,
		paused: false
 	},
 	{
		time: 35,
		player: memPlay,
		timeSync: -35,
		pos: {x: memStartX, y: 0},
		size: {w: memMidSize, h: memMidSize},
		offset: {l: 0, t: 0},
		scale: 0,
		paused: false
 	},
 	{
		time: 40,
		player: drvPlay,
		timeSync: 0,
		pos: {x: drvMidX, y: 0},
		size: {w: 'auto', h: 'auto'},
		offset: {l: 0, t: 0},
		scale: drvMidScale,
		paused: false
 	},
 	{
		time: 40,
		player: memPlay,
		timeSync: -35,
		pos: {x: memMidX, y: 0},
		size: {w: memMidSize, h: memMidSize},
		offset: {l: 0, t: 0},
		scale: memMidScale,
		paused: false
 	},
 	
 	//The following are time fixes for the memory videos which should be fixed/removed if the
 	//memory video is updated
 	
	{
		time: 53,
		player: memPlay,
		timeSync: -35,
		pos: {x: memMidX, y: 0},
		size: {w: memMidSize, h: memMidSize},
		offset: {l: 0, t: -.5},
		scale: memMidScale,
		paused: false
 	},
 	{
		time: 126,
		player: memPlay,
		timeSync: -25,
		pos: {x: memMidX, y: 0},
		size: {w: memMidSize, h: memMidSize},
		offset: {l: 0, t: -.5},
		scale: memMidScale,
		paused: false
 	},
 	
 	//End sequencing:
 	
	{
		time: 150,
		player: drvPlay,
		timeSync: 0,
		pos: {x: drvMidX, y: 0},
		size: {w: 'auto', h: 'auto'},
		offset: {l: 0, t: 0},
		scale: drvMidScale,
		paused: false
 	},
	{
		time: 155,
		player: drvPlay,
		timeSync: 0,
		pos: {x: drvStartX, y: 0},
		size: {w: 'auto', h: 'auto'},
		offset: {l: 0, t: 0},
		scale: drvFullScale,
		paused: false
 	},
	{
		time: 150,
		player: memPlay,
		timeSync: -25,
		pos: {x: memMidX, y: 0},
		size: {w: memMidSize, h: memMidSize},
		offset: {l: 0, t: 0},
		scale: memMidScale,
		paused: true
 	},
	{
		time: 155,
		player: memPlay,
		timeSync: -25,
		pos: {x: memStartX, y: 0},
		size: {w: 0, h: 0},
		offset: {l: 0, t: 0},
		scale: 0,
		paused: true
 	},
	{
		time: 181,
		player: drvPlay,
		timeSync: 0,
		pos: {x: drvStartX, y: 0},
		size: {w: 'auto', h: 'auto'},
		offset: {l: 0, t: 0},
		scale: drvFullScale,
		paused: false
 	},
	{
		time: 181,
		player: memPlay,
		timeSync: 0,
		pos: {x: 0, y: 0},
		size: {w: 0, h: 0},
		offset: {l: 0, t: 0},
		scale: 0,
		paused: true
 	}
];
