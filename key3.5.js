export class Key {
	constructor(context, pan) {
		this.context = context;
		this.gainNode = context.createGain();
		this.gainNode.gain.setValueAtTime(0, context.currentTime);
		this.delayNode = context.createDelay();
		this.panNode = this.context.createStereoPanner();
		this.panNode.pan.setValueAtTime(pan, context.currentTime)
	}

	async connect(dest) {
		await this.context.audioWorklet.addModule('small-noise.js');
		this.noiseGenerator = new AudioWorkletNode(this.context, 'small-noise');
		const splitterNode = this.context.createChannelSplitter();
		const mergerNode = this.context.createChannelMerger();
		const filter1 = this.context.createBiquadFilter();
		const filter2 = this.context.createBiquadFilter();
		const filter3 = this.context.createBiquadFilter();
		const filter4 = this.context.createBiquadFilter();

		filter1.frequency.setValueAtTime(300, this.context.currentTime);
		filter1.Q.setValueAtTime(4, this.context.currentTime);
		filter2.frequency.setValueAtTime(2100, this.context.currentTime);
		filter2.Q.setValueAtTime(2, this.context.currentTime);
		filter3.frequency.setValueAtTime(2100, this.context.currentTime);
		filter3.Q.setValueAtTime(2, this.context.currentTime);
		filter4.frequency.setValueAtTime(2100, this.context.currentTime);
		filter4.Q.setValueAtTime(2, this.context.currentTime);


		this.noiseGenerator.connect(filter1);
		filter1.connect(filter2)
		filter2.connect(filter3)
		filter3.connect(filter4)
		filter4.connect(mergerNode)
		mergerNode.connect(this.delayNode);
		this.delayNode.connect(splitterNode);
		splitterNode.connect(this.gainNode);
		this.gainNode.connect(mergerNode);
		splitterNode.connect(this.panNode);
		this.panNode.connect(dest)
	}

	play(pitch, duration) {
		const { currentTime } = this.context;
		const { gain } = this.gainNode;
		gain.setValueAtTime(0.991, currentTime);
		gain.setTargetAtTime(0, currentTime + duration - 0.01, 0.05);
		this.delayNode.delayTime.setValueAtTime(pitch, currentTime);
		this.noiseGenerator?.port.postMessage({});
	}
}