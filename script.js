/* Rock Paper Scissors — Veda Technology Internship Day 24 */
(function () {
  'use strict';

  // ---- Available choices (stored in an array as required) ----
  const CHOICES = ['rock', 'paper', 'scissors'];

  // Emoji + readable name for each choice
  const CHOICE_EMOJI = {
    rock: '🪨',
    paper: '📄',
    scissors: '✂️'
  };

  const CHOICE_NAME = {
    rock: 'Rock',
    paper: 'Paper',
    scissors: 'Scissors'
  };

  // ---- Game state ----
  const state = {
    playerScore: 0,
    computerScore: 0,
    draws: 0,
    rounds: 0
  };

  // ---- DOM references ----
  const playerChoiceEl = document.getElementById('playerChoice');
  const computerChoiceEl = document.getElementById('computerChoice');
  const resultBanner = document.getElementById('resultBanner');
  const playerScoreEl = document.getElementById('playerScore');
  const computerScoreEl = document.getElementById('computerScore');
  const drawScoreEl = document.getElementById('drawScore');
  const roundCountEl = document.getElementById('roundCount');
  const choiceButtons = Array.from(document.querySelectorAll('.choice-btn'));
  const resetBtn = document.getElementById('resetBtn');

  // ---- Helpers ----
  function randomComputerChoice() {
    const index = Math.floor(Math.random() * CHOICES.length);
    return CHOICES[index];
  }

  // Reusable comparison function. Returns 'win' | 'lose' | 'draw'.
  function compareChoices(playerChoice, computerChoice) {
    if (playerChoice === computerChoice) {
      return 'draw';
    }
    // Rock beats Scissors, Scissors beats Paper, Paper beats Rock.
    const beats = {
      rock: 'scissors',
      scissors: 'paper',
      paper: 'rock'
    };
    return beats[playerChoice] === computerChoice ? 'win' : 'lose';
  }

  function popChoice(element) {
    element.classList.remove('is-pop');
    // Force reflow so the animation can restart on repeated plays.
    void element.offsetWidth;
    element.classList.add('is-pop');
  }

  function setResultBanner(outcome) {
    resultBanner.classList.remove('is-win', 'is-lose', 'is-draw');
    if (outcome === 'win') {
      resultBanner.textContent = 'You Win! 🎉';
      resultBanner.classList.add('is-win');
    } else if (outcome === 'lose') {
      resultBanner.textContent = 'Computer Wins! 🤖';
      resultBanner.classList.add('is-lose');
    } else {
      resultBanner.textContent = "It's a Draw! 🤝";
      resultBanner.classList.add('is-draw');
    }
  }

  function syncScoreboard() {
    playerScoreEl.textContent = state.playerScore;
    computerScoreEl.textContent = state.computerScore;
    drawScoreEl.textContent = state.draws;
    roundCountEl.textContent = state.rounds;
  }

  // ---- Core play flow ----
  function playRound(playerChoice) {
    if (!CHOICES.includes(playerChoice)) {
      return; // Guard against invalid input.
    }

    const computerChoice = randomComputerChoice();
    const outcome = compareChoices(playerChoice, computerChoice);

    // Update displayed choices.
    playerChoiceEl.textContent = CHOICE_EMOJI[playerChoice];
    playerChoiceEl.setAttribute('aria-label', 'Your choice: ' + CHOICE_NAME[playerChoice]);
    computerChoiceEl.textContent = CHOICE_EMOJI[computerChoice];
    computerChoiceEl.setAttribute('aria-label', "Computer's choice: " + CHOICE_NAME[computerChoice]);

    popChoice(playerChoiceEl);
    popChoice(computerChoiceEl);

    // Update score based on outcome. Draws award no win to either side.
    if (outcome === 'win') {
      state.playerScore += 1;
    } else if (outcome === 'lose') {
      state.computerScore += 1;
    } else {
      state.draws += 1;
    }
    state.rounds += 1;

    setResultBanner(outcome);
    syncScoreboard();
  }

  // ---- Reset ----
  function resetGame() {
    state.playerScore = 0;
    state.computerScore = 0;
    state.draws = 0;
    state.rounds = 0;

    playerChoiceEl.textContent = '❔';
    playerChoiceEl.setAttribute('aria-label', 'Your choice');
    computerChoiceEl.textContent = '❔';
    computerChoiceEl.setAttribute('aria-label', "Computer's choice");

    playerChoiceEl.classList.remove('is-pop');
    computerChoiceEl.classList.remove('is-pop');

    resultBanner.classList.remove('is-win', 'is-lose', 'is-draw');
    resultBanner.textContent = 'Make your move to start!';

    syncScoreboard();
  }

  // ---- Event listeners ----
  choiceButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      playRound(btn.dataset.choice);
    });
  });

  // Keyboard support: Enter/Space already trigger click on buttons.
  // Additional: allow number keys 1/2/3 to pick moves for power users.
  document.addEventListener('keydown', function (event) {
    // Ignore when typing in inputs (none here) but keep general.
    if (event.target && event.target.tagName === 'INPUT') return;
    if (event.key === '1') playRound('rock');
    else if (event.key === '2') playRound('paper');
    else if (event.key === '3') playRound('scissors');
    else if (event.key.toLowerCase() === 'r') resetGame();
  });

  resetBtn.addEventListener('click', resetGame);

  // ---- Initialization ----
  resetGame();

  // Expose for debugging / automated testing.
  window.__rpsGame = {
    CHOICES: CHOICES,
    compareChoices: compareChoices,
    randomComputerChoice: randomComputerChoice,
    playRound: playRound,
    resetGame: resetGame,
    getState: function () { return Object.assign({}, state); }
  };
})();
