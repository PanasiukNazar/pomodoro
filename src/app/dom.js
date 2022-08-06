import {
   MODES,
   MODES_NAMES,
   AVAILABLE_FONTS,
   AVAILABLE_THEMES,
   AVAILABLE_CONTROLS,
} from './constants.js';

export const bindDom = (state) => {
   setupListeners(state);
   setupRenderers(state);
   resizeClock();
};

const $mainTheme = document.querySelector('#main');
const $mainFont = document.querySelector('#main-font');
const $colorList = document.querySelector('.color-list');
const $fontList = document.querySelector('.font-list');
const $logo = document.querySelector('.logo');
const $mode = document.querySelector('.mode');
const $clock = document.querySelector('.clock-time');
const $clockLine = document.querySelector('.clock-circle');
const $clockMode = document.querySelector('.clock-mode');
const $modal = document.querySelector('.modal');
const $closeModal = document.querySelector('.header-escape');
const $parentMode = document.querySelector('.mode-parent');
const $modalTiming = document.querySelector('.modal-timing');
const $settings = document.querySelector('.setting-gear');
const $applySettings = document.querySelector('.button-apply');
const $ovelay = document.querySelector('.overlay');

const setupListeners = (state) => {
   window.addEventListener('resize', resizeClock);

   $applySettings.addEventListener('click', () => {
      confirmSettings(state);
   });

   $modalTiming.addEventListener('click', (event) => {
      setTimings(state, event);
   });

   $parentMode.addEventListener('click', (event) => {
      setMode(state, event);
   });

   $settings.addEventListener('click', () => {
      showSettings(state);
   });

   $closeModal.addEventListener('click', () => {
      closeSettings(state);
   });

   $fontList.addEventListener('click', (event) => {
      setFont(state, event);
   });

   $colorList.addEventListener('click', (event) => {
      setColor(state, event);
   });

   $clockMode.addEventListener('click', (event) => {
      setClockMode(state, event);
   });
};

const setupRenderers = (state) => {
   state.onChange(renderLogo);
   state.onChange(renderModes);
   state.onChange(renderTiming);
   state.onChange(renderModal);
   state.onChange(renderClock);
   state.onChange(renderFonts);
   state.onChange(renderTheme);
   state.onChange(renderClockControls);
};

const confirmSettings = (state) => {
   state.applySettings();
   state.resetTimer();
};

const setTimings = (state, event) => {
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
};

const setMode = (state, event) => {
   if (event.target.hasAttribute('data-mode')) {
      state.setCurrentMode(event.target.getAttribute('data-mode'));
      state.resetTimer();
   }
};

const showSettings = (state) => {
   state.toggleSettingsModal();
};

const closeSettings = (state) => {
   state.toggleSettingsModal();
};

const setFont = (state, event) => {
   if (event.target.hasAttribute('data-font')) {
      $mainFont.classList.remove(state.current.font);
      if (event.target.hasAttribute('data-font')) {
         state.setCurrentFont(event.target.getAttribute('data-font'));
         $mainFont.classList.add(state.current.font);
      }
   } else {
      return;
   }
};

const setColor = (state, event) => {
   if (event.target.hasAttribute('data-theme')) {
      $mainTheme.classList.remove(state.current.theme);
      if (event.target.hasAttribute('data-theme')) {
         state.setCurrentTheme(event.target.getAttribute('data-theme'));
         $mainTheme.classList.add(state.current.theme);
      }
   } else {
      return;
   }
};

const setClockMode = (state, event) => {
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
};

const resizeClock = () => {
   if (window.innerWidth <= 670) {
      $clockLine.setAttribute('r', 120);
      $clockLine.setAttribute('cy', 130);
      $clockLine.setAttribute('cx', 130);
   } else {
      $clockLine.setAttribute('r', 180);
      $clockLine.setAttribute('cy', 210);
      $clockLine.setAttribute('cx', 210);
   }

   const circumference = calculateCircumference();

   $clockLine.style.strokeDasharray = circumference;
   $clockLine.style.strokeDashoffset = circumference;
};

const calculateCircumference = () => {
   const radius = $clockLine.r.baseVal.value;

   return 2 * Math.PI * radius;
};

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
          }' data-mode="${MODES.LONG_BREAK}">${
      MODES_NAMES[MODES.LONG_BREAK]
   }</p>
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
   const circumference = calculateCircumference();
   const elapsedTimePercent =
      state.current.elapsedTime / state.selectedModeTime;
   $clockLine.style.strokeDashoffset = circumference * elapsedTimePercent;
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
