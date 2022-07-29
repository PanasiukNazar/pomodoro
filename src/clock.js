const $mainTheme = document.querySelector('#main');
const $mainFont = document.querySelector('#main-font');
const $colorList = document.querySelector('.color-list');
const $fontList = document.querySelector('.font-list');
const $logo = document.querySelector('.logo');
const $mode = document.querySelector('.mode');
const $clock = document.querySelector('.clock-time');
const $clockLine = document.querySelector('.clock-circle');
const $clockMode = document.querySelector('.clock-mode');
const $clockStart = document.querySelector('.clock-start');
const $clockPause = document.querySelector('.clock-pause');
const $clockRestart = document.querySelector('.clock-restart');
const $clockReset = document.querySelector('.clock-reset');
const $modal = document.querySelector('.modal');
const $closeModal = document.querySelector('.header-escape');
const $parentMode = document.querySelector('.mode-parent');
const $modalTiming = document.querySelector('.modal-timing');
const $settings = document.querySelector('.setting-gear');
const $applySettings = document.querySelector('.button-apply');
const $ovelay = document.querySelector('.overlay');

// Get Circle Radius

window.addEventListener('resize', () => {
   if (window.innerWidth <= 670) {
      $clockLine.setAttribute('r', 120);
      $clockLine.setAttribute('cy', 130);
      $clockLine.setAttribute('cx', 130);
   } else {
      $clockLine.setAttribute('r', 180);
      $clockLine.setAttribute('cy', 210);
      $clockLine.setAttribute('cx', 210);
   }
});

const radius = $clockLine.r.baseVal.value;

// Get circumfirence

let circumference = 2 * Math.PI * radius;

let stateCircumFerence = circumference;

$clockLine.style.strokeDasharray = circumference;
$clockLine.style.strokeDashoffset = circumference;

const MODES = {
   POMODORO: 'pomodoro',
   SHORT_BREAK: 'shortBreak',
   LONG_BREAK: 'longBreak',
};

const MODES_NAMES = {
   [MODES.POMODORO]: 'pomodoro',
   [MODES.SHORT_BREAK]: 'short break',
   [MODES.LONG_BREAK]: 'long break',
};

const AVAILABLE_FONTS = {
   KUMBH: 'font-kumbh',
   ROBOTO: 'font-roboro',
   SPACE: 'font-space',
};

const AVAILABLE_THEMES = {
   CORAL: 'theme-coral',
   SKY: 'theme-sky',
   PURPLE: 'theme-purple',
};

const AVAILABLE_CONTROLS = {
   START: 'start',
   PAUSE: 'pause',
   RESTART: 'restart',
   RESET: 'reset',
};

const state = {
   isSettingModalVisible: false,
   settings: {
      mode: {
         [MODES.POMODORO]: 1500,
         [MODES.SHORT_BREAK]: 300,
         [MODES.LONG_BREAK]: 900,
      },
   },

   current: {
      mode: MODES.POMODORO,
      font: AVAILABLE_FONTS.KUMBH,
      theme: AVAILABLE_THEMES.CORAL,
      elapsedTime: 0,
      timerId: null,
   },

   get selectedModeTime() {
      return this.settings.mode[this.current.mode];
   },

   settingsBackup: null,

   _listeners: [],

   setCurrentMode(mode) {
      this.current.mode = mode;
      this.changed();
   },

   incrementModeTime(mode) {
      this.settings.mode[mode] += 60;
      this.changed();
   },

   decrementModeTime(mode) {
      if (this.settings.mode[mode] <= 1) {
         return;
      }
      this.settings.mode[mode] -= 60;
      this.changed();
   },

   onChange(listener) {
      this._listeners.push(listener);
   },

   changed() {
      this._listeners.forEach((listener) => listener(this));
   },

   toggleSettingsModal(shouldUseBackUp = true) {
      this.isSettingModalVisible = !this.isSettingModalVisible;
      if (shouldUseBackUp) {
         if (this.isSettingModalVisible) {
            this.backupSettings();
         } else {
            this.applyBackup();
         }
      }
      this.changed();
   },

   backupSettings() {
      this.settingsBackup = structuredClone(this.settings);
   },

   applyBackup() {
      if (this.settingsBackup) {
         this.settings = this.settingsBackup;
         this.clearBackup();
         this.changed();
      }
   },

   applySettings() {
      this.clearBackup();
      this.toggleSettingsModal(false);
   },

   clearBackup() {
      this.settingsBackup = null;
   },

   setCurrentFont(mode) {
      this.current.font = mode;
      this.changed();
   },

   setCurrentTheme(mode) {
      this.current.theme = mode;
      this.changed();
   },

   startTimer() {
      this.updateTimer();
      this.current.timerId = setInterval(() => this.updateTimer(), 1000);
      this.changed();
   },

   updateTimer() {
      this.current.elapsedTime += 1;
      if (this.current.elapsedTime === this.settings.mode[this.current.mode]) {
         this.stopTimer();
      }
      this.changed();
   },

   stopTimer() {
      clearInterval(this.current.timerId);
      this.current.timerId = null;
      this.changed();
   },

   resetTimer() {
      this.current.elapsedTime = 0;
      this.stopTimer();
      this.changed();
   },
};

// State onChange
state.onChange(renderLogo);
state.onChange(renderModes);
state.onChange(renderTiming);
state.onChange(renderModal);
state.onChange(renderClock);
state.onChange(renderFonts);
state.onChange(renderTheme);
state.onChange(renderClockControls);

//

// Listeners
$applySettings.addEventListener('click', () => {
   state.applySettings();
   state.resetTimer();
});

$modalTiming.addEventListener('click', (event) => {
   const isTimeUp = event.target.classList.contains('time-up');
   const isTimeDown = event.target.classList.contains('time-down');

   if (!isTimeUp && !isTimeDown) {
      return;
   }
   const modeEl = event.target.closest('[data-mode]');
   const mode = modeEl.getAttribute('data-mode');
   if (isTimeUp) {
      state.incrementModeTime(mode);
   } else {
      state.decrementModeTime(mode);
   }
});

$parentMode.addEventListener('click', (event) => {
   if (event.target.hasAttribute('data-mode')) {
      state.setCurrentMode(event.target.getAttribute('data-mode'));
      state.resetTimer();
   }
});

$settings.addEventListener('click', () => {
   state.toggleSettingsModal();
});

$closeModal.addEventListener('click', () => {
   state.toggleSettingsModal();
});

$fontList.addEventListener('click', (event) => {
   if (event.target.hasAttribute('data-font')) {
      $mainFont.classList.remove(state.current.font);
      if (event.target.hasAttribute('data-font')) {
         state.setCurrentFont(event.target.getAttribute('data-font'));
         $mainFont.classList.add(state.current.font);
      }
   } else {
      return;
   }
});

$colorList.addEventListener('click', (event) => {
   if (event.target.hasAttribute('data-theme')) {
      $mainTheme.classList.remove(state.current.theme);
      if (event.target.hasAttribute('data-theme')) {
         state.setCurrentTheme(event.target.getAttribute('data-theme'));
         $mainTheme.classList.add(state.current.theme);
      }
   } else {
      return;
   }
});

$clockMode.addEventListener('click', (event) => {
   const control = event.target.getAttribute('data-control');
   if (control === AVAILABLE_CONTROLS.START) {
      state.startTimer();
   }
   if (control === AVAILABLE_CONTROLS.PAUSE) {
      state.stopTimer();
   }
   if (control === AVAILABLE_CONTROLS.RESTART) {
      state.startTimer();
   }
   if (control === AVAILABLE_CONTROLS.RESET) {
      state.resetTimer();
   }
});

//

// State Changed;
state.changed();
//

//Page Renders

function renderModes(state) {
   $parentMode.innerHTML = ` 
         <div class='mode'>
         <p class='mode-pomodoro ${
            state.current.mode === MODES.POMODORO ? 'active' : ''
         }' data-mode="${MODES.POMODORO}">${MODES_NAMES[MODES.POMODORO]}</p>
         <p class='mode-short ${
            state.current.mode === MODES.SHORT_BREAK ? 'active' : ''
         }' data-mode="${MODES.SHORT_BREAK}">${
      MODES_NAMES[MODES.SHORT_BREAK]
   }</p>
         <p class='mode-long ${
            state.current.mode === MODES.LONG_BREAK ? 'active' : ''
         }' data-mode="${MODES.LONG_BREAK}">${MODES_NAMES[MODES.LONG_BREAK]}</p>
         </div>
         `;
}

function renderLogo(state) {
   $logo.textContent = MODES_NAMES[state.current.mode];
}

function renderTiming(state) {
   $modalTiming.innerHTML = `
            <div class="timing-modes">


               <p>${MODES_NAMES[MODES.POMODORO]}</p>
               <p>${MODES_NAMES[MODES.SHORT_BREAK]}</p>
               <p>${MODES_NAMES[MODES.LONG_BREAK]}</p>


            </div>

            <div class="timing-inputs">

                  <div data-mode="${MODES.POMODORO}">
                  <input type="number" value="${
                     state.settings.mode[MODES.POMODORO] / 60
                  }" disabled />
                  
                  <div class="timing-button">
                     <img class="time-up" src="img/up.png" alt="" />
                     <img class="time-down" src="img/down.png" alt="" />
                  </div>
                  </div>

               <div data-mode="${MODES.SHORT_BREAK}">
                  <input type="number" value="${
                     state.settings.mode[MODES.SHORT_BREAK] / 60
                  }" disabled />
                     
                  <div class="timing-button" >
                     <img class="time-up" src="img/up.png" alt="" />
                     <img class="time-down" src="img/down.png" alt="" />
                  </div> 
               </div>    

               <div data-mode="${MODES.LONG_BREAK}">
                  <input type="number" value="${
                     state.settings.mode[MODES.LONG_BREAK] / 60
                  }" disabled />
                  
                  <div class="timing-button" >
                     <img class="time-up" src="img/up.png" alt="" />
                     <img class="time-down" src="img/down.png" alt="" />
                  </div> 
               </div>

            </div>
             `;
}

function renderModal(state) {
   $modal.classList.toggle('show', state.isSettingModalVisible);
   $ovelay.classList.toggle('show', state.isSettingModalVisible);
}

function renderClock(state) {
   const timeLeft = state.selectedModeTime - state.current.elapsedTime;
   $clock.textContent = `${timeLeft}:00`;
   let minutes = Math.floor(timeLeft / 60);
   let seconds = timeLeft % 60;
   seconds = seconds < 10 ? `0${seconds}` : seconds;
   $clock.textContent = `${minutes}:${seconds}`;
   //
   const elapsedTimePercent =
      state.current.elapsedTime / state.selectedModeTime;
   $clockLine.style.strokeDashoffset = circumference * elapsedTimePercent;
}

function renderProgressSmoothly(from, to) {
   if (from <= to) {
      return;
   }
   requestAnimationFrame(() => {
      renderProgressSmoothly(
         from - (state.selectedModeTime / circumference) * 100,
         to,
      );
   });
}

function renderClockControls(state) {
   $clockMode.innerHTML = `
   ${
      state.current.elapsedTime === 0
         ? `<div class="clock-start" data-control="${AVAILABLE_CONTROLS.START}">START</div>`
         : ''
   }
   ${
      state.current.timerId
         ? `<div class="clock-pause" data-control="${AVAILABLE_CONTROLS.PAUSE}">PAUSE</div>`
         : ''
   }
   ${
      state.current.elapsedTime !== 0 &&
      !state.current.timerId &&
      state.current.elapsedTime !== state.settings.mode[state.current.mode]
         ? `<div class="clock-restart" data-control="${AVAILABLE_CONTROLS.RESTART}">RESTART</div>`
         : ''
   }
   ${
      state.current.elapsedTime === state.settings.mode[state.current.mode]
         ? `<div class="clock-reset" data-control="${AVAILABLE_CONTROLS.RESET}">RESET</div>`
         : ''
   }
   `;
}

function renderFonts(state) {
   $fontList.innerHTML = `
    <span class="font-kumbh-sans ${
       state.current.font === AVAILABLE_FONTS.KUMBH ? 'active-font' : ''
    }" data-font="${AVAILABLE_FONTS.KUMBH}">Aa</span>
   <span class="font-roboto-slab ${
      state.current.font === AVAILABLE_FONTS.ROBOTO ? 'active-font' : ''
   }
   " data-font="${AVAILABLE_FONTS.ROBOTO}">Aa</span>
   <span class="font-space-mono
   ${state.current.font === AVAILABLE_FONTS.SPACE ? 'active-font' : ''}
   " data-font="${AVAILABLE_FONTS.SPACE}">Aa</span>
   `;
}

function renderTheme(state) {
   $colorList.innerHTML = ` 
   <div class="color-coral">
   <img
      class="color-imagen-first ${
         state.current.theme === AVAILABLE_THEMES.CORAL ? 'active-theme' : ''
      }"
      data-theme="${AVAILABLE_THEMES.CORAL}"
      src="img/applyColor.png"
      alt=""
   />
</div>
<div class="color-sky">
   <img
      class="color-imagen-second
      ${state.current.theme === AVAILABLE_THEMES.SKY ? 'active-theme' : ''}"
      data-theme="${AVAILABLE_THEMES.SKY}"
      src="img/applyColor.png"
      alt=""
   />
</div>
<div class="color-purple">
   <img
      class="color-imagen-third ${
         state.current.theme === AVAILABLE_THEMES.PURPLE ? 'active-theme' : ''
      }"
      data-theme="${AVAILABLE_THEMES.PURPLE}"
      src="img/applyColor.png"
      alt=""
   />
</div>
   `;
}

// function setTimer() {
//    function updateTimer() {
//       --state.current.presentTime;
//       $clock.textContent = `${state.current.presentTime}:00`;
//       let minutes = Math.floor(state.current.presentTime / 60);
//       let seconds = state.current.presentTime % 60;
//       seconds = seconds < 10 ? `0${seconds}` : seconds;
//       $clock.textContent = `${minutes}:${seconds}`;

//       $clockPause.addEventListener('click', () => {
//          clearInterval(timeNow);
//       });

//       if (state.current.presentTime <= 0) {
//          clearInterval(timeNow);
//          $clockPause.classList.remove('show');
//          $clockReset.classList.add('show');
//       }
//    }
//    const timeNow = setInterval(updateTimer, 1000);
//    updateTimer();
// }

// $clockMode.addEventListener('click', (event) => {
//    if (event.target.classList.contains('clock-start')) {
//       event.target.classList.add('hide');
//       $clockPause.classList.add('show');
//       state.setPresentTime(state.settings.mode[state.current.mode]);
//       setTimer();
//       progressBar();
//    }

//    if (event.target.classList.contains('clock-pause')) {
//       event.target.classList.remove('show');
//       $clockRestart.classList.add('show');
//    }

//    if (event.target.classList.contains('clock-restart')) {
//       event.target.classList.remove('show');
//       $clockPause.classList.add('show');
//       setTimer();
//       progressBar();
//    }

//    if (event.target.classList.contains('clock-reset')) {
//       event.target.classList.remove('show');
//       $clockStart.classList.remove('hide');
//       state.current.presentTime = state.settings.mode[state.current.mode];
//       circumference = stateCircumFerence;
//       $clockLine.style.strokeDashoffset = stateCircumFerence;
//       state.changed();
//    }
// });
