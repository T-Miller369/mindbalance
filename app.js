document.addEventListener("DOMContentLoaded", () => {
  /* =====================
     Mood slider
  ===================== */

  const moodSlider = document.getElementById("mood-slider");
  const moodEmoji = document.getElementById("mood-emoji");
  const moodLabel = document.getElementById("mood-label");
  const moodVisual = document.getElementById("mood-visual");

  const moodStates = {
    1: { emoji: "😞", label: "Drained or heavy", gradient: "linear-gradient(135deg,#c2c8d1,#7c89a0)" },
    2: { emoji: "😕", label: "Off or unsettled", gradient: "linear-gradient(135deg,#b6d0e2,#7ca0c4)" },
    3: { emoji: "😐", label: "Neutral or mixed", gradient: "linear-gradient(135deg,#a7e8e1,#4fb0ae)" },
    4: { emoji: "🙂", label: "Steady and okay", gradient: "linear-gradient(135deg,#a7e8c7,#5fb07b)" },
    5: { emoji: "😄", label: "Light, hopeful, or energized", gradient: "linear-gradient(135deg,#ffe3b3,#ffb8a1)" }
  };

  function updateMoodUI(value) {
    const state = moodStates[value];
    if (!state) return;
    if (moodEmoji) moodEmoji.textContent = state.emoji;
    if (moodLabel) moodLabel.textContent = state.label;
    if (moodVisual) moodVisual.style.background = state.gradient;
  }

  if (moodSlider) {
    updateMoodUI(moodSlider.value);
    moodSlider.addEventListener("input", (e) => {
      updateMoodUI(e.target.value);
    });
  }

  /* =====================
     Breathing tool
  ===================== */

  const breathCircle = document.getElementById("breath-circle");
  const breathToggle = document.getElementById("breath-toggle");
  const breathText = document.getElementById("breath-text");

  let breathingActive = false;
  let breathPhaseIndex = 0;
  const breathPhases = ["Breathe in", "Hold", "Breathe out", "Hold"];

  function cycleBreathText() {
    if (!breathingActive || !breathText) return;
    breathText.textContent = breathPhases[breathPhaseIndex];
    breathPhaseIndex = (breathPhaseIndex + 1) % breathPhases.length;
  }

  if (breathToggle && breathCircle) {
    breathToggle.addEventListener("click", () => {
      breathingActive = !breathingActive;
      if (breathingActive) {
        breathCircle.classList.add("breathing");
        breathToggle.textContent = "Pause";
        cycleBreathText();
      } else {
        breathCircle.classList.remove("breathing");
        breathToggle.textContent = "Start";
        if (breathText) breathText.textContent = "Tap Start to begin";
      }
    });

    setInterval(() => {
      cycleBreathText();
    }, 4000);
  }

  /* =====================
     Journaling prompt
  ===================== */

  const journalPrompts = [
    "Name one thing that feels heavy, and one thing that feels hopeful.",
    "What is something small that went right today?",
    "If your mood could speak, what would it say in one sentence?",
    "Where in your body are you holding tension right now?",
    "What is one boundary your future self will be proud you protected?",
    "What do you need more of this week: rest, support, or clarity?",
    "Finish this sentence: I feel most like myself when..."
  ];

  const promptBtn = document.getElementById("new-prompt-btn");
  const promptText = document.getElementById("journal-prompt");

  if (promptBtn && promptText) {
    promptBtn.addEventListener("click", () => {
      const randomIndex = Math.floor(Math.random() * journalPrompts.length);
      promptText.textContent = journalPrompts[randomIndex];
    });

    // set an initial prompt
    const initialIndex = Math.floor(Math.random() * journalPrompts.length);
    promptText.textContent = journalPrompts[initialIndex];
  }

  /* =====================
     Grounding tool
  ===================== */

  const groundingSteps = [
    "Notice 5 things you can see around you.",
    "Notice 4 things you can touch and how they feel.",
    "Notice 3 things you can hear, near or far.",
    "Notice 2 things you can smell or remember the scent of.",
    "Notice 1 thing you can taste, or imagine a favorite taste."
  ];

  const groundingBtn = document.getElementById("grounding-next-btn");
  const groundingText = document.getElementById("grounding-step");
  let groundingIndex = 0;

  if (groundingBtn && groundingText) {
    groundingText.textContent =
      groundingSteps[groundingIndex] || "Tap Next to begin the grounding sequence.";
    groundingBtn.addEventListener("click", () => {
      groundingIndex = (groundingIndex + 1) % groundingSteps.length;
      groundingText.textContent = groundingSteps[groundingIndex];
    });
  }

  /* =====================
     Sleep timer
  ===================== */

  const sleepMinutesInput = document.getElementById("sleep-minutes");
  const sleepStartBtn = document.getElementById("start-sleep-timer");
  const sleepCountdown = document.getElementById("sleep-countdown");

  let sleepInterval = null;
  let remainingSeconds = 0;

  function formatTime(sec) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }

  function clearSleepInterval() {
    if (sleepInterval) {
      clearInterval(sleepInterval);
      sleepInterval = null;
    }
  }

  if (sleepStartBtn && sleepMinutesInput && sleepCountdown) {
    sleepStartBtn.addEventListener("click", () => {
      const minutes = parseInt(sleepMinutesInput.value, 10);
      if (Number.isNaN(minutes) || minutes <= 0) {
        sleepCountdown.textContent = "Set a time in minutes to start.";
        return;
      }

      clearSleepInterval();
      remainingSeconds = minutes * 60;
      sleepCountdown.textContent = `Timer: ${formatTime(remainingSeconds)}`;

      sleepInterval = setInterval(() => {
        remainingSeconds -= 1;
        if (remainingSeconds <= 0) {
          clearSleepInterval();
          sleepCountdown.textContent = "Timer complete. You can gently close this exercise.";
        } else {
          sleepCountdown.textContent = `Timer: ${formatTime(remainingSeconds)}`;
        }
      }, 1000);
    });
  }
});
