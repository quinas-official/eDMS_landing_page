<script lang="ts">
	import { onMount } from 'svelte';

	type RGB = [number, number, number];

	let {
		waveSpeed = 0.05,
		waveFrequency = 3,
		waveAmplitude = 0.3,
		waveColor = [0.5, 0.5, 0.5],
		backgroundColor = [0, 0, 0],
		colorNum = 4,
		pixelSize = 2,
		disableAnimation = false,
		enableMouseInteraction = true,
		mouseRadius = 1,
		class: className = ''
	}: {
		waveSpeed?: number;
		waveFrequency?: number;
		waveAmplitude?: number;
		waveColor?: RGB;
		backgroundColor?: RGB;
		colorNum?: number;
		pixelSize?: number;
		disableAnimation?: boolean;
		enableMouseInteraction?: boolean;
		mouseRadius?: number;
		class?: string;
	} = $props();

	const vertexShader = `
attribute vec2 position;
void main() { gl_Position = vec4(position, 0.0, 1.0); }
`;

	// Wave pattern and Bayer dither in one pass: the wave is sampled at the top-left of each
	// pixelSize block (the pixelation), then quantized to colorNum levels per channel.
	const fragmentShader = `
precision highp float;
uniform vec2 resolution;
uniform float time;
uniform float waveSpeed;
uniform float waveFrequency;
uniform float waveAmplitude;
uniform vec3 waveColor;
uniform vec3 backgroundColor;
uniform vec2 mousePos;
uniform int enableMouseInteraction;
uniform float mouseRadius;
uniform float colorNum;
uniform float pixelSize;

vec4 mod289(vec4 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
vec2 fade(vec2 t) { return t*t*t*(t*(t*6.0-15.0)+10.0); }

float cnoise(vec2 P) {
  vec4 Pi = floor(P.xyxy) + vec4(0.0,0.0,1.0,1.0);
  vec4 Pf = fract(P.xyxy) - vec4(0.0,0.0,1.0,1.0);
  Pi = mod289(Pi);
  vec4 ix = Pi.xzxz;
  vec4 iy = Pi.yyww;
  vec4 fx = Pf.xzxz;
  vec4 fy = Pf.yyww;
  vec4 i = permute(permute(ix) + iy);
  vec4 gx = fract(i * (1.0/41.0)) * 2.0 - 1.0;
  vec4 gy = abs(gx) - 0.5;
  vec4 tx = floor(gx + 0.5);
  gx = gx - tx;
  vec2 g00 = vec2(gx.x, gy.x);
  vec2 g10 = vec2(gx.y, gy.y);
  vec2 g01 = vec2(gx.z, gy.z);
  vec2 g11 = vec2(gx.w, gy.w);
  vec4 norm = taylorInvSqrt(vec4(dot(g00,g00), dot(g01,g01), dot(g10,g10), dot(g11,g11)));
  g00 *= norm.x; g01 *= norm.y; g10 *= norm.z; g11 *= norm.w;
  float n00 = dot(g00, vec2(fx.x, fy.x));
  float n10 = dot(g10, vec2(fx.y, fy.y));
  float n01 = dot(g01, vec2(fx.z, fy.z));
  float n11 = dot(g11, vec2(fx.w, fy.w));
  vec2 fade_xy = fade(Pf.xy);
  vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
  return 2.3 * mix(n_x.x, n_x.y, fade_xy.y);
}

float fbm(vec2 p) {
  float value = 0.0;
  float amp = 1.0;
  for (int i = 0; i < 4; i++) {
    value += amp * abs(cnoise(p));
    p *= waveFrequency;
    amp *= waveAmplitude;
  }
  return value;
}

float pattern(vec2 p) {
  vec2 p2 = p - time * waveSpeed;
  return fbm(p + fbm(p2));
}

// 8x8 ordered-dither threshold in [0, 1), built recursively from the 2x2 matrix.
float bayer2(vec2 a) { a = floor(a); return fract(dot(a, vec2(0.5, a.y * 0.75))); }
float bayer4(vec2 a) { return bayer2(0.5 * a) * 0.25 + bayer2(a); }
float bayer8(vec2 a) { return bayer4(0.5 * a) * 0.25 + bayer2(a); }

void main() {
  vec2 cell = floor(gl_FragCoord.xy / pixelSize);
  vec2 uv = (cell * pixelSize) / resolution;
  uv -= 0.5;
  uv.x *= resolution.x / resolution.y;
  float f = pattern(uv);
  if (enableMouseInteraction == 1) {
    vec2 mouseNDC = (mousePos / resolution - 0.5) * vec2(1.0, -1.0);
    mouseNDC.x *= resolution.x / resolution.y;
    float dist = length(uv - mouseNDC);
    f -= 0.5 * (1.0 - smoothstep(0.0, mouseRadius, dist));
  }
  vec3 color = mix(backgroundColor, waveColor, clamp(f, 0.0, 1.0));

  float threshold = bayer8(cell) - 0.25;
  float stepSize = 1.0 / (colorNum - 1.0);
  color += threshold * stepSize;
  float luminance = dot(color, vec3(0.2126, 0.7152, 0.0722));
  float bias = mix(0.2, 0.0, smoothstep(0.45, 0.8, luminance));
  color = clamp(color - bias, 0.0, 1.0);
  color = floor(color * (colorNum - 1.0) + 0.5) / (colorNum - 1.0);
  gl_FragColor = vec4(color, 1.0);
}
`;

	let canvas: HTMLCanvasElement;
	// Read by the render loop each frame so prop changes apply without restarting it.
	const current = $derived({
		waveSpeed,
		waveFrequency,
		waveAmplitude,
		waveColor,
		backgroundColor,
		colorNum,
		pixelSize,
		disableAnimation,
		enableMouseInteraction,
		mouseRadius
	});
	let requestDraw = () => {};
	$effect(() => {
		void current;
		requestDraw();
	});

	onMount(() => {
		const gl = canvas.getContext('webgl', { antialias: false, premultipliedAlpha: false });
		if (!gl) return;

		const compile = (type: number, source: string) => {
			const shader = gl.createShader(type)!;
			gl.shaderSource(shader, source);
			gl.compileShader(shader);
			if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
				console.error(gl.getShaderInfoLog(shader));
			}
			return shader;
		};
		const program = gl.createProgram()!;
		gl.attachShader(program, compile(gl.VERTEX_SHADER, vertexShader));
		gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragmentShader));
		gl.linkProgram(program);
		gl.useProgram(program);

		gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
		const position = gl.getAttribLocation(program, 'position');
		gl.enableVertexAttribArray(position);
		gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

		const loc = (name: string) => gl.getUniformLocation(program, name);
		const u = {
			resolution: loc('resolution'),
			time: loc('time'),
			waveSpeed: loc('waveSpeed'),
			waveFrequency: loc('waveFrequency'),
			waveAmplitude: loc('waveAmplitude'),
			waveColor: loc('waveColor'),
			backgroundColor: loc('backgroundColor'),
			mousePos: loc('mousePos'),
			enableMouseInteraction: loc('enableMouseInteraction'),
			mouseRadius: loc('mouseRadius'),
			colorNum: loc('colorNum'),
			pixelSize: loc('pixelSize')
		};

		const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
		const mouse = { x: -1e4, y: -1e4 };
		const start = performance.now();
		let frame = 0;
		let visible = true;

		const draw = (now: number) => {
			frame = 0;
			const p = current;
			gl.viewport(0, 0, canvas.width, canvas.height);
			gl.uniform2f(u.resolution, canvas.width, canvas.height);
			if (!p.disableAnimation && !reducedMotion) gl.uniform1f(u.time, (now - start) / 1000);
			gl.uniform1f(u.waveSpeed, p.waveSpeed);
			gl.uniform1f(u.waveFrequency, p.waveFrequency);
			gl.uniform1f(u.waveAmplitude, p.waveAmplitude);
			gl.uniform3fv(u.waveColor, p.waveColor);
			gl.uniform3fv(u.backgroundColor, p.backgroundColor);
			gl.uniform2f(u.mousePos, mouse.x, mouse.y);
			gl.uniform1i(u.enableMouseInteraction, p.enableMouseInteraction ? 1 : 0);
			gl.uniform1f(u.mouseRadius, p.mouseRadius);
			gl.uniform1f(u.colorNum, p.colorNum);
			gl.uniform1f(u.pixelSize, p.pixelSize);
			gl.drawArrays(gl.TRIANGLES, 0, 3);

			const animating = !p.disableAnimation && !reducedMotion;
			if (animating && visible) frame = requestAnimationFrame(draw);
		};
		requestDraw = () => {
			if (!frame && visible) frame = requestAnimationFrame(draw);
		};

		// Rendered at CSS-pixel resolution (dpr 1), like the original: the look is pixelated anyway.
		const resize = new ResizeObserver(([entry]) => {
			canvas.width = Math.max(1, Math.floor(entry.contentRect.width));
			canvas.height = Math.max(1, Math.floor(entry.contentRect.height));
			requestDraw();
		});
		resize.observe(canvas);

		// Stop rendering while scrolled out of view.
		const io = new IntersectionObserver(([entry]) => {
			visible = entry.isIntersecting;
			if (visible) requestDraw();
			else if (frame) {
				cancelAnimationFrame(frame);
				frame = 0;
			}
		});
		io.observe(canvas);

		// Listen on the window: the canvas sits behind the content, so it never gets pointer events.
		const onPointerMove = (e: PointerEvent) => {
			if (!current.enableMouseInteraction) return;
			const rect = canvas.getBoundingClientRect();
			mouse.x = e.clientX - rect.left;
			mouse.y = e.clientY - rect.top;
			requestDraw();
		};
		window.addEventListener('pointermove', onPointerMove, { passive: true });

		requestDraw();
		return () => {
			if (frame) cancelAnimationFrame(frame);
			resize.disconnect();
			io.disconnect();
			window.removeEventListener('pointermove', onPointerMove);
			requestDraw = () => {};
		};
	});
</script>

<canvas bind:this={canvas} class="block size-full {className}" aria-hidden="true"></canvas>
