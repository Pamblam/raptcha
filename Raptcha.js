export default class Raptcha{

	#container;
	#canvas;
	#result;
	#input;
	#keyup_listener;
	#keys_pressed;
	#render_count;
	#mouse_activity;
	#mouse_listener;

	constructor(ele, input){
		this.#mouse_activity = false;
		this.#input = input;
		this.#container = ele;
		this.#render_count = 0;
		this.#keyup_listener = this.#onKeyUp.bind(this);
		this.#mouse_listener = this.#onMouseMove.bind(this);

		this.#input.addEventListener('keyup', this.#keyup_listener);
		window.addEventListener('mousemove', this.#mouse_listener);
		this.render();
	}

	destroy(){
		this.#input.removeEventListener('keyup', this.#keyup_listener);
		window.removeEventListener('mousemove', this.#mouse_listener);
		this.#container.innerHTML = '';
	}

	isHuman(){
		// Ensure the challenge was passed
		if(this.#result !== this.#input.value) return false;

		// Ensure the mouse has moved at some point
		if(!this.#mouse_activity) return false;

		// If it took more than 10 tried, that's a fail
		if(this.#render_count > 10) return false;

		// Make sure the challenge was passed by pressing individual keys
		if(this.#keys_pressed < this.#result.length) return false;

		// Make sure the user agent is obviously a bot
		if([/bot/i, /crawl/i, /spider/i, /slurp/i, /headless/i].some(p=>p.test(navigator.userAgent))) return false;
		
		return true;
	}

	render(){
		this.#render_count++;
		this.#keys_pressed = 0;
		this.#input.value = '';

		this.#result = this.#generateRandomString(6);

		let canvas = document.createElement('canvas');
		canvas.width = 500;
		canvas.height = 500;
		let ctx = canvas.getContext('2d');

		const skewX = (Math.random() - 0.5) * 0.5;
		const skewY = (Math.random() - 0.5) * 0.5;
		ctx.setTransform(1, skewY, skewX, 1, 0, 0);

		let x = 100, y = 100;
		for (let i = 0; i < this.#result.length; i++) {
			let letter = this.#renderLetter(this.#result[i]);
			ctx.drawImage(letter, x, y);
			x += (letter.width + (Math.floor(Math.random() * (1 - (-3) + 1)) + (-3)));
		}
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		canvas = this.#cropCanvas(canvas);
		

		this.#canvas = document.createElement('canvas');
		this.#canvas.width=200;
		this.#canvas.height=70;
		ctx = this.#canvas.getContext('2d');
		ctx.drawImage(canvas, (200-canvas.width)/2, (70-canvas.height)/2);

		this.#canvas.style.border = '1px solid black';
		this.#container.innerHTML = '';
		this.#container.append(this.#canvas);
	}

	#renderLetter(letter){
		let canvas = document.createElement('canvas');
		canvas.width=500;
		canvas.height=500;
		let ctx = canvas.getContext('2d');
		const skewX = (Math.random() - 0.5) * 0.5;
		const skewY = (Math.random() - 0.5) * 0.5;
		ctx.setTransform(1, skewY, skewX, 1, 0, 0);
		ctx.textBaseline = "top";
		ctx.textAlign = "center";
		ctx.font = "30px Arial";
		ctx.fillStyle = "black";
		ctx.fillText(letter, 250, 235);
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		return this.#cropCanvas(canvas);
	}

	#generateRandomString(length) {
		const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		let result = '';
		for (let i = 0; i < length; i++) {
			const randomIndex = Math.floor(Math.random() * characters.length);
			result += characters.charAt(randomIndex);
		}
		return result;
	}

	#cropCanvas(canvas) {
		const ctx = canvas.getContext("2d");
		const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
		const pixels = imageData.data;
		
		let minX = canvas.width, minY = canvas.height, maxX = 0, maxY = 0;
		
		for (let y = 0; y < canvas.height; y++) {
			for (let x = 0; x < canvas.width; x++) {
				let index = (y * canvas.width + x) * 4;
				if (pixels[index + 3] > 0) {
					minX = Math.min(minX, x);
					minY = Math.min(minY, y);
					maxX = Math.max(maxX, x);
					maxY = Math.max(maxY, y);
				}
			}
		}
		
		if (maxX < minX || maxY < minY) return null;
	
		let width = maxX - minX + 1;
		let height = maxY - minY + 1;
		
		const croppedCanvas = document.createElement("canvas");
		croppedCanvas.width = width;
		croppedCanvas.height = height;
		const croppedCtx = croppedCanvas.getContext("2d");
	
		croppedCtx.putImageData(ctx.getImageData(minX, minY, width, height), 0, 0);
		
		return croppedCanvas;
	}

	#onKeyUp(){
		this.#keys_pressed++;
	}

	#onMouseMove(){
		this.#mouse_activity = true;
	}
}