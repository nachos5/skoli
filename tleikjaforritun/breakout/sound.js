// =====
// AUDIO USING WEB AUDIO API
// just very basic stuff using simple oscillators
// =====
// constructor that creates an web audio object
function webAudio() {
  this.audioCtx = new (window.AudioContext || window.webkitAutioContext)();
}

// lets a create a new object
let sound = new webAudio();

/* a beep (or doesn't have to be if the duration is long)! The first parameter is the type of waveform
  we want, the second is our base frequency, the third the random frequency value, fourth the duration,
  and finally the gain.... and attack... */
webAudio.prototype.beep = function(wave, baseFreq, randomFreq, dur, gain, attack) {
  if (attack == undefined) attack = 0.01;
  // create our oscillator
  const oscillator = this.audioCtx.createOscillator(),
        gainNode = this.audioCtx.createGain();
  oscillator.connect(gainNode);
  //gainNode.gain.value = gain;
  const now = this.audioCtx.currentTime;
  // envelopes so we don't get a click at the end of the sound
  gainNode.gain.setValueAtTime(0, now);
  // attack
  gainNode.gain.linearRampToValueAtTime(gain, now + attack);
  // decay
  gainNode.gain.linearRampToValueAtTime(0, now + dur);

  gainNode.connect(this.audioCtx.destination);
  oscillator.type = wave;
  oscillator.frequency.value = baseFreq + Math.random() * randomFreq;
  oscillator.start(now);
  oscillator.stop(now + dur)
}

// C-major chord when we won!
webAudio.prototype.weWon = function() {
  this.beep('sine', 261.6256, 0, 4, 0.02, 0.5); // c4
  this.beep('sine', 523.2511, 0, 4, 0.02, 0.5); // c5
  this.beep('sine', 659.2551, 0, 4, 0.02, 0.5); // e5
  this.beep('sine', 783.9909, 0, 4, 0.02, 0.5); // g5
  this.beep('sine', 1046.502, 0, 4, 0.02, 0.5); // c6
}

// spooky stuff when we lose
webAudio.prototype.weLost = function() {
  for (let i=0; i<10; i++) {
    const rFreq = Math.random() * 1000 * i;
    this.beep('square', 100, rFreq, 4, 0.02, 0.5);
  }
}
