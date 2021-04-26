class Shape {
	constructor(ctx, color) {
		this.ctx = ctx;
		this.color = color;
	}
}

class Circle extends Shape {
	constructor (ctx, color) {
		super(ctx, color);
		this.size = 300
	}
	draw(pos) {
		var x = this.size / 2;
		var y = this.size / 2;
		var radius = this.size / 2;
		var startAngle = 0;
		this.ctx.fillStyle = this.color;
		this.ctx.beginPath();
		this.ctx.arc(pos + x, y, radius, 0, 2*Math.PI);
		
		this.ctx.fill();
	}
}


class HalfCircle extends Shape {
	constructor (ctx, color) {
		super(ctx, color);
		this.size = 237.5
	}
	draw(pos) {
		var x = 300 / 2;
		var y = (300) / 2;
		var radius = (300 ) / 2;
		this.ctx.fillStyle = this.color;
		this.ctx.beginPath();
		this.ctx.arc(pos + x, y, radius, Math.PI / 4, 7 * Math.PI / 4);
		
		this.ctx.fill();
	}
}

class Polygon1 extends Shape {
	constructor (ctx, color) {
		super(ctx, color);
		this.size = 237.5
	}
	draw(pos) {
		var x = 300 / 2;
		var y = 300 / 2;

		this.ctx.fillStyle = this.color;
		this.ctx.fillRect(pos + x - 105, y - 105, 210 , 210);


		this.ctx.beginPath();
		this.ctx.moveTo(pos + x - 105, y - 105);
		this.ctx.lineTo(pos + x - 150, y);
		this.ctx.lineTo(pos + x - 105, y + 105);
		this.ctx.fill();
	}
}

class Polygon2 extends Shape {
	constructor (ctx, color) {
		super(ctx, color);
		this.size = 237.5
	}

	draw(pos) {
		var x = 150;
		var y = 150;

		this.ctx.fillStyle = this.color;
		this.ctx.fillRect(pos + x - 106, y - 105, 177 ,210);


		this.ctx.beginPath();
		this.ctx.moveTo(pos + x - 105, y - 105);
		this.ctx.lineTo(pos + x - 150, y);
		this.ctx.lineTo(pos + x - 105, y + 105);
		this.ctx.fill();


		this.ctx.beginPath();
		this.ctx.moveTo(pos + x + 70, y - 105);
		this.ctx.lineTo(pos + x + 110 , y);
		this.ctx.lineTo(pos + x + 70, y + 105);
		this.ctx.fill();
	}
}

export function draw(type, offset) {
	var canvas = document.getElementById('canvas');
	var ctx = canvas.getContext('2d');

	ctx.globalCompositeOperation = 'source-over';

	ctx.fillStyle = 'black';
	ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);

	ctx.globalCompositeOperation = 'screen'

	let shapes1 = Array.from(new Float32Array(7))
	let shapes2 = Array.from(new Float32Array(7))

	switch(type) {
		case 0:
			shapes1 = shapes1.map(() => new Circle(ctx, 'red'))
			shapes2 = shapes2.map(() => new Circle(ctx, 'cyan'))
			break;
		case 1:
			shapes1 = shapes1.map(() => new HalfCircle(ctx, 'yellow'))
			shapes2 = shapes2.map(() => new Polygon1(ctx, 'blue'))
			break;
		case 2:
			shapes1 = shapes1.map(() => new Polygon2(ctx, 'red'))
			shapes2 = shapes2.map(() => new Polygon2(ctx, 'cyan'))
			break;
	}
	

	shapes1.forEach((shape, i) => {
		shape.draw(shape.size * (i - 1))
	});
	shapes2.forEach((shape, i) => {
		shape.draw(shape.size * (i - 1) - (shape.size / 100) * offset)
	});
}