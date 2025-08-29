export const createTimerState = (timer3, timer1, timer2, delay1) => ({
  global: { timeLeft: timer3 || 2700, active: false },
  timer1: {
    active: false,
    inDelay: false,
    shouldRestart: false,
    timeLeft: timer1 || 60,
    delayTimeLeft: delay1 || 30
  },
  timer2: {
    active: false,
    shouldRestart: false,
    timeLeft: timer2 || 60
  }
});

export const performVideoAction = (videoRefs, assignments, action) => {
  videoRefs.current.forEach((ref, index) => {
    if (ref && assignments[index] && ref[action]) {
      ref[action]();
    }
  });
};

export const createArrayUpdater = (setState) => (index, value) => {
  setState((prev) => {
    const updated = [...prev];
    updated[index] = value;
    return updated;
  });
};

export const formatTime = (seconds) => {
  const secs = seconds % 60;
  const mins = Math.floor(seconds / 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

export const playBeepSound = () => {
  try {
    const AudioCtx = window.AudioContext;
    const audioContext = new AudioCtx();

    const playBeep = (startTime) => {
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();

      osc.type = "square"; // classic alarm-style beep
      osc.frequency.setValueAtTime(400, startTime); // lower so it's not shrill

      osc.connect(gain);
      gain.connect(audioContext.destination);

      // Hard on/off envelope (no fade to keep it consistent)
      gain.gain.setValueAtTime(1, startTime);
      gain.gain.setValueAtTime(0, startTime + 0.25); // 250ms beep

      osc.start(startTime);
      osc.stop(startTime + 0.25);
    };

    const now = audioContext.currentTime;
    playBeep(now); // first beep
    playBeep(now + 0.4); // second beep, 400ms later

    // close cleanly after done
    setTimeout(() => audioContext.close(), 1000);
  } catch (e) {
    console.warn("Beep sound failed:", e);
  }
};

if (typeof window !== "undefined") {
  window.playBeepSound = playBeepSound;
}
