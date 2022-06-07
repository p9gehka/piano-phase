import { Piano } from './key3.5.js';
import { draw } from './visualisation.js';

const e = 3.16, f_ = 2.5, a = 1.640
const b = 1.17, c_ = 0.72, d = 0.515, e2 = 0.14;

let phrase1 = [e, f_, b, c_, d, f_, e, c_, b, f_, d, c_];
let phrase2 = [e, f_, b, c_, d, f_, b, c_];
let phrase3 = [e, e2, a, b, d, e2, a, b];
let phrase4 = [a, b, d, e2];
const phrases = [phrase1, phrase1, phrase2, phrase3, phrase4, phrase4];
const bang = document.getElementById('bang');
async function start() {
	bang.classList.add('hide')
	let type = 0;
	let microTickRate = 16;
	let microTick = 0;
	let intervalId;
	let microTickOffset = 0;
	let hold = 2;

	const ctx = new AudioContext({ sampleRate: 44100 });
	const piano1 = [new Piano(ctx, -0.5), new Piano(ctx, -0.5)];
	const piano2 = [new Piano(ctx, 0.5), new Piano(ctx, 0.5)];
	const comperessorNode = ctx.createDynamicsCompressor();
	await Promise.all([...piano1,...piano2].map(key => key.connect(comperessorNode)));
	comperessorNode.connect(ctx.destination);

	function playTick () {
		const phrase1 = phrases[type], phrase2 = phrases[type + 1];
		const length = phrase1.length;
		const microTick_ = microTick % microTickRate;
		const tick = Math.floor(microTick / microTickRate) % length;
		const microTickWithOffset = (microTick + microTickOffset) % microTickRate;
		const tickWithOffset = Math.floor((microTick + microTickOffset) / microTickRate) % length;
		const isLastTick = tick === length - 1;
		const isFirstMicrotick = microTick_ === 0;
		const isLastMicrotick = microTick_ === microTickRate - 1;
		const tickOffset = microTickOffset % (microTickRate * length);
		const lastTick = microTickRate * length - 1;

		if (microTick_ === 0) {
			piano1[0].play(phrase1[tick] / 1000, 0.25);
			piano1.push(piano1.shift());
		}

		if (microTickWithOffset === 0) {
			piano2[0].play(phrase2[tickWithOffset] / 1000, 0.25);
			piano2.push(piano2.shift());
		}

		if (isLastTick && isFirstMicrotick) {
			if (hold > 1) {
				hold--;
			} else {
				microTickOffset++;
				draw(type / 2, (microTickOffset / (microTickRate * length)) * 100);
			}

			if (microTickWithOffset === microTickRate - 1) {
				hold = 2;
			}

			if (tickOffset === lastTick) {
				type += 2;
				draw(type / 2, 0);
				microTickOffset = 0;
				if (type === phrases.length) {
					clearInterval(intervalId);
				}
			}
		}

		microTick++;
	}

	draw(0, 0);
	intervalId = setInterval(playTick, 160 / microTickRate);
}

bang.addEventListener('click', start);
