// Simple helper: show section
const sections = document.querySelectorAll('.mb-section');
const bottomNavButtons = document.querySelectorAll('.bottom-nav button');
const circleCards = document.querySelectorAll('.circle-card');

function showSection(id) {
  sections.forEach(sec => sec.classList.remove('active'));
  document.getElementById(id).classList.add('active');

  bottomNavButtons.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.target === id);
  });
}

// Bottom nav
bottomNavButtons.forEach(btn => {
  btn.addEventListener('click', () => showSection(btn.dataset.target));
});

// Circle cards on home
circleCards.forEach(card => {
  card.addEventListener('click', () => showSection(card.dataset.target));
});

// Greeting
const greetingText = document.getElementById('greetingText');
const hour = new Date().getHours();
if (hour < 12) greetingText.textContent = 'Good morning. Your daily reset.';
else if (hour < 18) greetingText.textContent = 'Good afternoon. Take a moment.';
else greetingText.textContent = 'Good evening. Time to unwind.';

// Today’s Reset suggestions
const resetSuggestions = [
  'Write down three tiny things that made today better.',
  'Take 5 slow breaths and notice how your body feels.',
  'Recall a joke or meme that made you smile.',
  'Step outside for 2 minutes and notice the sky.',
  'Send a kind message to someone you appreciate.'
];
document.getElementById('todayResetText').textContent =
  resetSuggestions[Math.floor(Math.random() * resetSuggestions.length)];


// JOURNAL – prompts
const journalPromptText = document.getElementById('journalPromptText');
const journalPromptSelect = document.getElementById('journalPromptSelect');
const newPromptBtn = document.getElementById('newPromptBtn');
const journalEntry = document.getElementById('journalEntry');
const saveJournalBtn = document.getElementById('saveJournalBtn');
const journalList = document.getElementById('journalList');

const prompts = {
  gratitude: [
    'Write down three small things you’re grateful for today.',
    'What tiny moment reminded you that life can be beautiful?',
    'What is something you usually overlook but appreciate today?',
    'Write about a person who made your day even 1% better.'
  ],
  micro: [
    'Write down a joke, meme, or silly moment from today.',
    'Describe a sound that made you feel calm.',
    'What color matches your mood right now, and why?',
    'What is one tiny win you had today?'
  ],
  mood: [
    'If your mood were a weather pattern, what would it be?',
    'What is one thing you wish someone understood about you today?',
    'What emotion is the loudest in you right now?',
    'What do you need more of this week?'
  ],
  free: [
    'Free write: let your thoughts spill without editing.',
    'Write whatever is on your mind right now.',
    'No rules. Just you and the page.'
  ]
};

function setRandomPrompt() {
  const type = journalPromptSelect.value;
  const list = prompts[type] || prompts.free;
  const prompt = list[Math.floor(Math.random() * list.length)];
  journalPromptText.textContent = prompt;
}

newPromptBtn.addEventListener('click', setRandomPrompt);
journalPromptSelect.addEventListener('change', setRandomPrompt);
setRandomPrompt();

// Simple in-memory journal history
const journalEntries = [];

saveJournalBtn.addEventListener('click', () => {
  const text = journalEntry.value.trim();
  if (!text) return;
  const entry = {
    text,
    date: new Date().toLocaleString()
  };
  journalEntries.unshift(entry);
  journalEntry.value = '';
  renderJournalList();
});

function renderJournalList() {
  journalList.innerHTML = '';
  journalEntries.slice(0, 5).forEach(e => {
    const li = document.createElement('li');
    li.textContent = `[${e.date}] ${e.text.slice(0, 80)}${e.text.length > 80 ? '…' : ''}`;
    journalList.appendChild(li);
  });
}


// SLEEP – DreamHaven
const sleepHoursInput = document.getElementById('sleepHours');
const sleepQualityInput = document.getElementById('sleepQuality');
const logSleepBtn = document.getElementById('logSleepBtn');
const sleepStatsText = document.getElementById('sleepStatsText');
const sleepRingInner = document.getElementById('sleepRingInner');

const companionSelect = document.getElementById('companionSelect');
const companionAvatar = document.getElementById('companionAvatar');
const companionStatusText = document.getElementById('companionStatusText');

let sleepLogs = [];

logSleepBtn.addEventListener('click', () => {
  const hours = parseFloat(sleepHoursInput.value || '0');
  const quality = parseInt(sleepQualityInput.value || '0', 10);
  if (!hours) return;

  sleepLogs.push({ hours, quality, date: new Date() });
  if (sleepLogs.length > 14) sleepLogs.shift();
  updateSleepStats();
});

function updateSleepStats() {
  if (sleepLogs.length === 0) {
    sleepStatsText.textContent = 'Log your sleep to see your streak.';
    return;
  }

  const avgHours = sleepLogs.reduce((s, l) => s + l.hours, 0) / sleepLogs.length;
  const avgQuality = sleepLogs.reduce((s, l) => s + l.quality, 0) / sleepLogs.length;

  const target = 8;
  const ratio = Math.min(avgHours / target, 1);
  const angle = 360 * ratio;

  sleepRingInner.style.background = `conic-gradient(var(--accent) 0deg, var(--accent-soft) ${angle}deg, transparent ${angle}deg)`;

  sleepStatsText.textContent =
    `Avg hours: ${avgHours.toFixed(1)} | Avg quality: ${avgQuality.toFixed(1)}`;

  // Companion mood
  if (avgHours >= 7.5) {
    companionStatusText.textContent = 'Your companion looks well-rested and proud of you.';
  } else if (avgHours >= 6) {
    companionStatusText.textContent = 'Your companion is a bit sleepy. Maybe an earlier night?';
  } else {
    companionStatusText.textContent = 'Your companion is very tired. They’re rooting for your rest.';
  }
}

// Companion visuals
function updateCompanionAvatar() {
  const type = companionSelect.value;
  let emoji = '🦊';
  if (type === 'owl') emoji = '🦉';
  if (type === 'cat') emoji = '🐱';
  if (type === 'dragon') emoji = '🐉';
  if (type === 'jellyfish') emoji = '🪼';

  companionAvatar.textContent = emoji;
}
companionSelect.addEventListener('change', updateCompanionAvatar);
updateCompanionAvatar();


// BREATHING – BreatheFlow
const breathingModeSelect = document.getElementById('breathingModeSelect');
const breathingTextCues = document.getElementById('breathingTextCues');
const startBreathingBtn = document.getElementById('startBreathingBtn');
const stopBreathingBtn = document.getElementById('stopBreathingBtn');
const breathingOrb = document.getElementById('breathingOrb');
const breathingCueText = document.getElementById('breathingCueText');

let breathingInterval = null;
let breathingStepIndex = 0;

const breathingPatterns = {
  box: [
    { label: 'Breathe in', seconds: 4, scale: 1.15 },
    { label: 'Hold', seconds: 4, scale: 1.15 },
    { label: 'Breathe out', seconds: 4, scale: 0.9 },
    { label: 'Rest', seconds: 4, scale: 1.0 }
  ],
  '478': [
    { label: 'Breathe in', seconds: 4, scale: 1.15 },
    { label: 'Hold', seconds: 7, scale: 1.15 },
    { label: 'Breathe out', seconds: 8, scale: 0.85 }
  ],
  simple: [
    { label: 'Breathe in', seconds: 4, scale: 1.15 },
    { label: 'Breathe out', seconds: 4, scale: 0.9 }
  ]
};

function startBreathing() {
  stopBreathing();
  const mode = breathingModeSelect.value;
  const pattern = breathingPatterns[mode] || breathingPatterns.simple;
  breathingStepIndex = 0;

  function runStep() {
    const step = pattern[breathingStepIndex];
    breathingOrb.style.transition = `transform ${step.seconds}s ease-in-out`;
    breathingOrb.style.transform = `scale(${step.scale})`;

    breathingCueText.textContent = breathingTextCues.checked ? step.label : '';

    breathingStepIndex = (breathingStepIndex + 1) % pattern.length;
  }

  runStep();
  breathingInterval = setInterval(runStep, pattern[breathingStepIndex].seconds * 1000);
}

function stopBreathing() {
  if (breathingInterval) {
    clearInterval(breathingInterval);
    breathingInterval = null;
  }
  breathingOrb.style.transform = 'scale(1)';
  breathingCueText.textContent = '';
}

startBreathingBtn.addEventListener('click', startBreathing);
stopBreathingBtn.addEventListener('click', stopBreathing);


// THEMES – Color Your Calm
const themeCards = document.querySelectorAll('.theme-card');

themeCards.forEach(card => {
  card.addEventListener('click', () => {
    const themeClass = card.dataset.theme;
    document.body.className = themeClass;
  });
});
