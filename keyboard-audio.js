(() => {
  let context;
  let output;
  let sounds;

  // Short switch clicks plus a damped case resonance, generated locally.
  function makeClick(release, variation) {
    const duration = release ? 0.055 : 0.085;
    const buffer = context.createBuffer(1, Math.ceil(context.sampleRate * duration), context.sampleRate);
    const samples = buffer.getChannelData(0);
    const pitch = 0.94 + variation * 0.035;
    let softNoise = 0;
    for (let index = 0; index < samples.length; index++) {
      const time = index / context.sampleRate;
      const noise = Math.random() * 2 - 1;
      softNoise += 0.22 * (noise - softNoise);
      const attack = Math.min(1, time / 0.0004);
      const click = (noise - softNoise) * Math.exp(-time / 0.0032);
      const body = Math.sin(2 * Math.PI * (release ? 760 : 330) * pitch * time) * Math.exp(-time / 0.014);
      const switchRing = Math.sin(2 * Math.PI * 2350 * pitch * time) * Math.exp(-time / 0.0045);
      const bounceTime = time - 0.008;
      const bounce = bounceTime > 0 ? softNoise * Math.exp(-bounceTime / 0.006) : 0;
      samples[index] = attack * (click * 0.55 + body * 0.32 + switchRing * 0.1 + bounce * 0.18);
    }
    return buffer;
  }

  function initialize() {
    if (context) return true;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return false;
    context = new AudioContext();
    output = context.createGain();
    output.gain.value = 0.4;
    output.connect(context.destination);
    sounds = {
      press: Array.from({ length: 5 }, (_, index) => makeClick(false, index)),
      release: Array.from({ length: 5 }, (_, index) => makeClick(true, index)),
    };
    return true;
  }

  function play(kind, delay = 0) {
    try {
      // Create/resume audio inside a click gesture so the first key works too.
      if (!initialize() || context.state === "closed") return;
      const start = () => {
        if (context.state !== "running") return;
        const source = context.createBufferSource();
        const gain = context.createGain();
        const variants = sounds[kind];
        source.buffer = variants[Math.floor(Math.random() * variants.length)];
        source.playbackRate.value = 0.97 + Math.random() * 0.06;
        gain.gain.value = (kind === "release" ? 0.6 : 1) * (0.9 + Math.random() * 0.15);
        source.connect(gain);
        gain.connect(output);
        source.onended = () => {
          source.disconnect();
          gain.disconnect();
        };
        source.start(context.currentTime + delay);
      };
      if (context.state !== "running") context.resume().then(start).catch(() => {});
      else start();
    } catch {
      // Audio availability must not interrupt keyboard interaction.
    }
  }

  window.keyboardAudio = Object.freeze({
    press: () => play("press"),
    release: (delay = 0) => play("release", delay),
  });
})();
