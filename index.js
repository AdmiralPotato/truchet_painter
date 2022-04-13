var tau = Math.PI * 2;
var quarterTurn = tau * 0.25;
var app = window.Vue.createApp({
	data: function () {
		return {
			multiplier: 20,
			width: 20,
			height: 20,
			lastPoint: null,
			currentColor: '#fff',
			colors: 'ff5400-ff6d00-ff8500-ff9100-ff9e00-00b4d8-0096c7-0077b6-023e8a-03045e-03071e-370617-6a040f-9d0208-d00000-dc2f02-e85d04-f48c06-faa307-ffba08'.split('-'),
			brushSize: 5,
			randomSeed: 5,
		};
	},
	watch: {
		currentColor: function (newValue) {
			this.context.strokeStyle = '#' + newValue + '33';
		},
		brushSize: function (newValue) {
			this.context.lineWidth = newValue;
		},
		randomSeed: 'drawToTheBiggerCanvas',
	},
	mounted: function () {
		this.context = this.$refs.aCanvas.getContext('2d');
		this.context.strokeStyle = this.currentColor;
		this.context.lineWidth = this.brushSize;
		this.context.lineCap = 'round';
	},
	computed: {
		buttonSize: function () {
			var width = this.width;
			var multiplier = this.multiplier;
			var numColors = this.colors.length;
			return (width * 2 * multiplier / numColors) + 'px';
		},
		aProps: function () {
			var width = this.width;
			var height = this.height;
			var multiplier = this.multiplier;
			return {
				width: width,
				height: height,
				style: {
					width: (width * multiplier) + 'px',
					height: (height * multiplier) + 'px',
				}
			};
		},
		bProps: function () {
			return {
				width: this.width * this.multiplier,
				height: this.height * this.multiplier,
			};
		},
		drawHandlers: function () {
			return {
				mousedown: this.mousedown,
				mousemove: this.mousemove,
				mouseup: this.mouseup,
				mouseout: this.mouseout,
			};
		},
	},
	methods: {
		getPointFromEvent: function (event) {
			return {
				x: event.offsetX / this.multiplier,
				y: event.offsetY / this.multiplier,
			};
		},
		mousedown: function (event) {
			var point = this.getPointFromEvent(event);
			var context = this.context;
			context.beginPath();
			context.moveTo(point.x, point.y);
			context.lineTo(point.x, point.y);
			context.stroke();
			this.lastPoint = point;
		},
		mousemove: function (event) {
			if (this.lastPoint) {
				var point = this.getPointFromEvent(event);
				var context = this.context;
				context.beginPath();
				context.moveTo(this.lastPoint.x, this.lastPoint.y);
				context.lineTo(point.x, point.y);
				context.stroke();
				this.lastPoint = point;
			}
		},
		mouseup: function (event) {
			if (this.lastPoint) {
				var point = this.getPointFromEvent(event);
				var context = this.context;
				context.beginPath();
				context.moveTo(this.lastPoint.x, this.lastPoint.y);
				context.lineTo(point.x, point.y);
				context.stroke();
				this.lastPoint = null;
				this.drawToTheBiggerCanvas();
			}
		},
		mouseout: function () {
			this.lastPoint = null;
		},
		drawToTheBiggerCanvas: function () {
			var sourceContext = this.context;
			var destinationContext = this.$refs.bCanvas.getContext('2d');
			var sourceColors = sourceContext.getImageData(0, 0, this.width, this.height).data;
			var width = this.width;
			var height = this.height;
			var multiplier = this.multiplier;
			var half = multiplier / 2;
			var rng = new Math.seedrandom(this.randomSeed);
			var startAngleTurns = 0;
			var startAngle = 0;
			var color;
			var pixelOffset;
			destinationContext.lineWidth = half;
			destinationContext.lineCap = 'round';
			destinationContext.clearRect(0, 0, width * multiplier, height * multiplier);
			for (var y = 0; y < height; y++) {
				for (var x = 0; x < width; x++) {
					startAngleTurns = Math.floor(rng() * 4);
					startAngle = startAngleTurns * quarterTurn;
					pixelOffset = ((y * width) + x) * 4;
					color = sourceColors.slice(pixelOffset, pixelOffset + 3);
					destinationContext.strokeStyle = `rgb(${color.join(',')})`;
					destinationContext.beginPath();
					destinationContext.arc(
						(x * multiplier) + half,
						(y * multiplier) + half,
						half,
						startAngle,
						(startAngleTurns * quarterTurn) + quarterTurn
					);
					destinationContext.stroke();
				}
			}
		},
	}
});

app.mount('#app');
