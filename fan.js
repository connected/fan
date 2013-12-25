/**
 * This is the test task requested by DEGO Interactive.
 *
 * @link http://www.dego.lv/ru/careers/coder-needed
 * @author Andrew Silin
 * @version 1.0
 */
(function(){

	/**
	 * @type {String} ID of the DOM contaier element.
	 */
	var container = 'container';

	/**
	 * @type {Object} Fader layer absolute position object.
	 * This object has only x and y properties. Example: {x: 100, y: 200}
	 */
	var flap;

	/**
	 * @type {Kinetic.Animation} Propeller layer animation instance.
	 */
	var anim;

	/**
	 * @type {Number} Min. y axis speed control fader drag bounds.
	 */
	var minY;

	/**
	 * @type {Number} Max. y axis speed control fader drag bounds.
	 */
	var maxY;

	/**
	 * @type {Float} Fan propeller animation speed.
	 */
	var speed;

	/**
	 * Define fan layers and shapes.
	 * It's pretty much self-explanatory here...
	 */
	var stage = new Kinetic.Stage({
	    container: container,
	    width:  600,
	    height: 600
	});

	var propellerLayer = new Kinetic.Layer({
		x: 250,
		y: 200
	});

	var towerLayer = new Kinetic.Layer({
		x: 250,
		y: 200
	});

	var faderLayer = new Kinetic.Layer({
		x: 500,
		y: 200
	});

	var blade1 = new Kinetic.Ellipse({
		width: 160,
		height: 30,
		fill: '#001914',
		offset: [-80, 0]
	});

	var blade2 = new Kinetic.Ellipse({
		x: 0,
		y: 0,
		width: 160,
		height: 30,
		fill: '#001914',
		offset: [80, 0]
	});

	var rotor = new Kinetic.Circle({
		x: 0,
		y: 0,
		radius: 25,
		fill: '#008D78'
	});

	var tower = new Kinetic.Path({
		data: 'M 0 0 L 70 300 L 0 240 L -70 300 z',
		fill: '#E6E6E6'
	});

	var track = new Kinetic.Rect({
	    width:  6,
	    height: 200,
	 	fill: '#E6E6E6',
	 	offset: [3, -12]
	});

	var fader = new Kinetic.Rect({
	    width:  50,
	    height: 25,
	    y: 200,
	    fill: '#001914',
	    draggable: true,
	    offset: [25, 0],
		dragBoundFunc: function(pos) {
			return {
				x: this.getAbsolutePosition().x,
				y: (pos.y > maxY)? maxY : (pos.y < minY)? minY : pos.y
			};
		}
	});

	var fast = new Kinetic.Text({
		text: 'FAST',
		fontStyle: 'bold',
		fontSize: 13,
		align: 'center',
		fill: '#D2D2D2',
		width: 100,
		offset: [50, 20]
	});

	var slow = new Kinetic.Text({
		text: 'SLOW',
		fontStyle: 'bold',
		fontSize: 13,
		align: 'center',
		fill: '#D2D2D2',
		width: 100,
		offset: [50, -(track.getHeight() + 30)]
	});

	/**
	 * Compile all layers and shapes together to form the resulting image.
	 * It's pretty much self-explanatory here also...
	 */
	towerLayer.add(tower);

	faderLayer.add(track);
	faderLayer.add(fader);
	faderLayer.add(slow);
	faderLayer.add(fast);

	propellerLayer.add(blade1);
	propellerLayer.add(blade2);
	propellerLayer.add(rotor);

	stage.add(towerLayer);
	stage.add(faderLayer);
	stage.add(propellerLayer);

	/**
	 * Get fan speed, based on current fader position.
	 * Resulting value may be used to control fan rotation animation speed.
	 *
	 * @returns {Float} Fan speed.
	 */
	function getSpeed()
	{
		return (track.getHeight() - fader.getY() + 1) / track.getHeight();
	}

	//Set initial speed based on fader position
	speed = getSpeed();

	flap = faderLayer.getAbsolutePosition();
	minY = flap.y;
	maxY = minY + track.getHeight();

	/**
	 * Define fader drag event handler.
	 * This allows user to change fan rotation speed while draging
	 * speed conrol fader.
	 */
	fader.on('dragmove', function(e) {
		speed = getSpeed();
	});

	/**
	 * Define fader track click event handler.
	 * This allows user to click on speed control track(groove)
	 * instead of draging fader itself to change fan rotation speed.
	 */
	track.on('click', function(e) {

		/**
		 * Calculate fader y position depending on where 
		 * user had clicked on the fader track shape.
		 */
		fader.setY(e.layerY - flap.y + track.getOffsetY());

		faderLayer.draw(); //Redraw fader layer
		fader.fire('dragmove'); //Emulate drag on fader
	});

	/**
	 * Define propeller layer rotation animation.
	 */
	anim = new Kinetic.Animation(function(frame) {
		propellerLayer.rotate(speed);
	}, propellerLayer);

	//Start animation after the script is loaded.
	anim.start();

})();