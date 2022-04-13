var app = window.Vue.createApp({
	data: function () {
		return {
			multiplier: 20,
			width: 20,
			height: 20,
			lastPoint: null,
			currentColor: '#fff',
			colors: 'ff5400-ff6d00-ff8500-ff9100-ff9e00-00b4d8-0096c7-0077b6-023e8a-03045e'.split('-'),
		};
	},
	mounted: function () {
		this.context = this.$refs.a.getContext('2d');
		this.context.strokeStyle = this.currentColor;
		this.context.lineWidth = 5;
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
				width: this.aProps.width * this.multiplier,
				height: this.aProps.width * this.multiplier,
			};
		},
		drawHandlers: function () {
			return {
				mousedown: this.mousedown,
				mousemove: this.mousemove,
				mouseup: this.mouseup,
			}
		},
	},
	methods: {
		setBrushColor: function (color) {
			this.currentColor = color;
			this.context.strokeStyle = this.currentColor;
		},
		getPointFromEvent: function (event) {
			return {
				x: event.offsetX / this.multiplier,
				y: event.offsetY / this.multiplier,
			};
		},
		mousedown: function (event) {
			var point = this.getPointFromEvent(event);
			console.log('CLICK!!!', point);
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
				console.log('MOVE!!!', point);
				var context = this.context;
				context.beginPath();
				context.moveTo(this.lastPoint.x, this.lastPoint.y);
				context.lineTo(point.x, point.y);
				context.stroke();
				this.lastPoint = point;
			}
		},
		mouseup: function (event) {
			var point = this.getPointFromEvent(event);
			console.log('END!!!', point);
			var context = this.context;
			context.beginPath();
			context.moveTo(this.lastPoint.x, this.lastPoint.y);
			context.lineTo(point.x, point.y);
			context.stroke();
			this.lastPoint = null;
		},
	}
})

app.mount('#app')
