# Raptcha

A simple clientside captcha. You style your elements and you handle the form submission. This just provides the tools to make sure your user isn't an evil robot.

 - Uses a challenge image and an input.
 - Checks for mouse and input events.
 - Checks for brute force attempts (allows 10 tries).
 - Checks user agent for some keywords.

This won't stop a sophisticated bot, but it's free, easy to use, and doens't require a Google API key.

[Click here](https://pamblam.github.io/raptcha/) for the demo.

## Demo

```html
<div id="raptcha_div"></div>
<a href="#" id="refresh_btn">refresh</a><br>
<input id="raptcha_input" placeholder="Enter the code to prove you're human"/><br>
<button id="validate_btn">Validate</button>

<script src="Raptcha.js" type="module"></script>
<script type="module">
	import Raptcha from "./Raptcha.js";

	let raptcha_input = document.getElementById('raptcha_input');
	let raptcha_div = document.getElementById('raptcha_div');
	let validate_btn = document.getElementById('validate_btn');
	let refresh_btn = document.getElementById('refresh_btn');

	let raptcha = new Raptcha(raptcha_div, raptcha_input);

	validate_btn.addEventListener('click', function(){
		alert(raptcha.isHuman() ? 'human you may pass' : 'bot detected');
	});

	refresh_btn.addEventListener('click', function(e){
		e.preventDefault();
		raptcha.render();
	});
</script>
```