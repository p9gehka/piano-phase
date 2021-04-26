import { Key } from './key3.5.js';
import { draw } from './visualisation.js';

const e = 3.16, f_ = 2.5, a = 1.640
const b = 1.17, c_ = 0.72, d = 0.515, e2 = 0.14;

let phrase1 = [e, f_, b, c_, d, f_, e, c_, b, f_, d, c_];
let phrase2 = [e, f_, b, c_, d, f_, b, c_];
let phrase3 = [e, e2, a, b, d, e2, a, b];
let phrase4 = [a, b, d, e2];
const phrases = [phrase1, phrase1, phrase2, phrase3, phrase4, phrase4];

function start() {
	let type = 0;
	let microTickRate = 16;
	let microTick = 0;
	let intervalId;
	let offset = 0;
	let hold = 2;

	const ctx = new AudioContext();
	const keys1 = [new Key(ctx, -0.5), new Key(ctx, -0.5)];
	const keys2 = [new Key(ctx, 0.5), new Key(ctx, 0.5)];
	const comperessorNode = ctx.createDynamicsCompressor();
	[...keys1,...keys2].forEach(key => key.connect(comperessorNode));
	comperessorNode.connect(ctx.destination)
	draw(0, 0);
	intervalId = setInterval(
		() => {
			const phrase1 = phrases[type], phrase2 = phrases[type + 1];
			const length = phrase1.length;
			const microTick_ = microTick % microTickRate;
			const tick = Math.floor(microTick / microTickRate) % length;
			const microTickOffset_ = (microTick + offset) % microTickRate;
			const tickOffset = Math.floor((microTick + offset) / microTickRate) % length;
			const lastTick = tick === length - 1;
			const firstMicrotick = microTick_ === 0;
			const lastMicrotick = microTick_ === microTickRate - 1;
			const currentOffset = offset % (microTickRate * length);
			const lastOffset = microTickRate * length - 1;

			if (microTick_ === 0) {
				keys1[0].play(phrase1[tick] / 1000, 0.25);
				keys1.push(keys1.shift());
			}

			if (microTickOffset_ === 0) {
				keys2[0].play(phrase2[tickOffset] / 1000, 0.25);
				keys2.push(keys2.shift());
			}

			if (lastTick && firstMicrotick) {
				if (hold > 1) {
					hold--;
				} else {
					offset++;
					draw(type / 2, (offset / (microTickRate * length)) * 100);
				}
				if(microTickOffset_ === microTickRate - 1) {
					hold = 2;
				}
			}
			if (lastTick && lastMicrotick && currentOffset === lastOffset) {
				type += 2;
				offset = 0;
				draw(type / 2, (offset / (microTickRate * length)) * 100);
				if (type >= phrases.length) {
					clearInterval(intervalId);
				}
			}
			microTick++;
		},
		160 / microTickRate
	);
}

document.getElementById('bang').addEventListener('click', start);