const L = 600;

class SmallNoise extends AudioWorkletProcessor {
	constructor() {
		super();
		this._counter = 0;
		this.port.onmessage = () => this._counter = L;
	}

	process(input, [[outputChannel]], props) {
		for (let i = 0; i < outputChannel.length; ++i) {
			if (this._counter > 0) {
				outputChannel[i] = 2 * (Math.random() - 0.5);
				this._counter--;
			} else {
				outputChannel[i] = 0;
			}
		}
		return true;
	}
}

registerProcessor('small-noise', SmallNoise);
