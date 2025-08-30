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

let audioContext = null;

export const playBeepSound = async () => {
  try {
    if (!audioContext) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      audioContext = new AudioCtx();
    }

    if (audioContext.state === "suspended") await audioContext.resume();

    const playBeep = (startTime) => {
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();

      osc.type = "square";
      osc.frequency.setValueAtTime(500, startTime);

      osc.connect(gain);
      gain.connect(audioContext.destination);

      gain.gain.setValueAtTime(1, startTime);
      gain.gain.setValueAtTime(0, startTime + 0.4);

      osc.start(startTime);
      osc.stop(startTime + 0.4);
    };

    const now = audioContext.currentTime;
    playBeep(now + 1);
    playBeep(now);
  } catch (e) {
    console.warn("Beep sound failed:", e);
  }
};

if (typeof window !== "undefined") {
  window.playBeepSound = playBeepSound;
}
