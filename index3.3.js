import { Key } from './key3.5.js';
import { draw } from './visualisation.js';
const notes = {
	'0.00316': 'e',
	'0.0025': 'f_',
	'0.00164': 'a',
	'0.00117': 'b',
	'0.000515': 'd',
	'0.00014': 'e2',
	'0.00072': 'c_',
}
const e = 0.003160, f_ = 0.002500, a = 0.001640;
const b = 0.001170, c_ = 0.000720, d = 0.000515, e2 = 0.000140;

let composition = [e, f_, b, c_, d, f_, e, c_, b, f_, d, c_];
let composition2 = [e, f_, b, c_, d, f_, b, c_];
let composition3 = [e, e2, a, b, d, e2, a, b];
let composition4 = [a, b, d, e2];



let line1 = [...composition]
let line2 = [...composition]
let line2_ = [...line2]
//line2.unshift(line2.pop())
let intervalId;

let microTickRate = 16;

let tickMicro = 0;
let tick = 0;
let offsetTick = 0;
let tickForHold = 0;
let offset = 0;
let hold = (line2.length) * 6;
let holdTgl = false;
let lineShiftTgl = false;
let type = 0
let fin = (line1.length * microTickRate * 6);
let countedOffsets = 0
document.getElementById('bang').addEventListener('click',
	() => {
		const ctx = new AudioContext();
		const keys1 = [new Key(ctx, -0.5), new Key(ctx, -0.5), new Key(ctx, -0.5)];
		const keys2 = [ new Key(ctx, 0.5), new Key(ctx, 0.5), new Key(ctx, 0.5)];
		const comperessorNode = ctx.createDynamicsCompressor();
		[...keys1,...keys2].forEach(key => key.connect(comperessorNode));
		comperessorNode.connect(ctx.destination)
		draw(type, 0)
		intervalId = setInterval(
			() => {
				if (lineShiftTgl && line2.join() === line2_.join()) {
					countedOffsets += fin
					lineShiftTgl = false;
					

					if (type === 0) {
						line1 = [...composition2]
						line2 = [...composition3]
					}
					if (type === 1) {
						line1 = [...composition4]
						line2 = [...composition4]
						fin = 512
					}
					if (type === 2) {
						clearInterval(intervalId)
						fin = 128
					}
					type++;
					line2_ = [...line2]

				}
				
				tickMicro++;
				let length = line1.length;
				let nOfNote = tick % length;
				offset = Math.floor(offsetTick / length) % microTickRate;


				if (tickMicro === microTickRate) {
					keys1[0].play(line1[nOfNote], 0.25);

					keys1.push(keys1.shift())
				}
				1920
				let accel = hold === 0;
				if (offset === 0 && nOfNote === 0 && tickMicro === 1) {
					if (tick !== 0 && accel) {
						keys2[0].play(line2[0], 0.25);
					}
					if (accel) {
						keys2.push(keys2.shift())
						line2.push(line2.shift());
						lineShiftTgl = true;
						if (holdTgl) {
							hold = length * 4;
						}
						holdTgl = !holdTgl;
					}
				}

				if (tickMicro === microTickRate - accel * offset) {
					keys2[0].play(line2[nOfNote], 0.25);
					keys2.push(keys2.shift())
				}

				if (tickMicro === microTickRate) {
					tickMicro = 0;
					tick++;
					offsetTick = hold === 0 ? offsetTick + 1 : offsetTick;
					hold = hold === 0 ? 0 : hold - 1;
					console.log(offsetTick)
					draw(type, ((offsetTick - countedOffsets) / fin) * 100 )
				}
			},
			160 / microTickRate,
		)
	}
)