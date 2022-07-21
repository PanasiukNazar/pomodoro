const $logo = document.querySelector('.logo');
const $clock = document.querySelector('.clock-time');
const $clockLine = document.querySelector('.clock-circle');
const $clockPause = document.querySelector('.clock-pause');
const $clockStart = document.querySelector('.clock-start');
//
const $settings = document.querySelector('.setting-gear').firstElementChild;
const $modal = document.querySelector('.modal');
const $closeModal = document.querySelector('.header-escape');
const $ovelay = document.querySelector('.overlay');
const $pomodoroTime = document.querySelector('.pomodoro-time');
//
//Modes
const $mode = document.querySelector('.mode');

// Get Circle Radius

const radius = $clockLine.r.baseVal.value;

// Get circumfirence

let circumference = 2 * Math.PI * radius;

$clockLine.style.strokeDasharray = circumference;
$clockLine.style.strokeDashoffset = circumference;

const AVILABLE_FONTS = ['Kumbh Sans', 'Roboto Slab', 'Space Mono'];
const AVILABLE_COLORS = ['#f87070', '#70f3f8', '#d881f8'];

const state = {
   settings: {
      mode: {
         promodoro: 25,
         shortBreak: 5,
         longBreak: 15,
      },

      current: {
         type: 'pomodoro',
         time: 25 + ':00',
         isActive: false,
      },

      font: AVILABLE_FONTS[0],
      color: AVILABLE_COLORS[0],
   },

   _listeners: [],

   progressBar(mode) {
      let currentTime = mode * 60;
      let speed = ((currentTime * 100) / circumference) * 10;
      const progress = setInterval(() => {
         $clockLine.style.strokeDashoffset = --circumference;

         if ($clockLine.style.strokeDashoffset <= 0) {
            $clockLine.style.strokeDashoffset = 0;
            clearInterval(progress);
            return;
         }
      }, speed);

      $clockPause.addEventListener('click', () => {
         clearInterval(progress);
      });
   },

   setTimer(mode) {
      let currentTime = mode * 60;
      const timeNow = setInterval(() => {
         $clock.textContent = `${currentTime}:00`;
         let minutes = Math.floor(currentTime / 60);
         let seconds = currentTime % 60;
         seconds = seconds < 10 ? `0${seconds}` : seconds;
         $clock.textContent = `${minutes}:${seconds}`;
         --currentTime;

         if (currentTime < 0) {
            clearInterval(timeNow);
         }
         return ($clock.textContent = `${minutes}:${seconds}`);
      }, 1000);
   },

   setMode(event) {
      if (!event.path[0].classList.contains('active')) {
         let node = $mode.children;
         for (let el of node) {
            el.classList.remove('active');
         }
         event.path[0].classList.add('active');
      }
      let activeEl = event.path[0].textContent;
      this.settings.current.type = activeEl;
      console.log(event.srcElement);
   },

   currentMode() {
      $logo.textContent = this.settings.current.type;
      $clock.textContent = this.settings.current.time;
   },

   onChange(listener) {
      this._listeners.push(listener);
   },

   changed() {
      this._listeners.forEach((listener) => listener(this));
   },
};

// State onChange
state.onChange(state.setMode);
state.onChange(state.currentMode);
//

// Listeners
state.currentMode();
$clockStart.addEventListener(
   'click',
   () => state.setTimer(state.settings.mode.promodoro),
   {
      once: true,
   },
);
$clockStart.addEventListener(
   'click',
   () => state.progressBar(state.settings.mode.promodoro),
   {
      once: true,
   },
);
$mode.addEventListener('click', () => state.setMode(event));
$settings.addEventListener('click', () => {
   $modal.classList.add('show');
   $ovelay.classList.add('show');
});
$closeModal.addEventListener('click', () => {
   $modal.classList.remove('show');
   $ovelay.classList.remove('show');
});
//

// State Changed;
state.changed();
//

//
//
//
//

// Put circumference in strokeDasharray and strokeDashoffset
// Find Persent
// function setProgres(persent) {
//    const offset = circumference - (persent / 100) * circumference;
//    $clockLine.style.strokeDashoffset = offset;
// }

//
//
//

// $timeValue.addEventListener('input', () => {
//    state.settings.timer = $timeValue.value * 60;
// });
// $btnSetVlaue.addEventListener('click', () => state.setTimer(), { once: true });
// $btnSetVlaue.addEventListener('click', () => state.progressBar(), {
// once: true,
// });

//
//
//

// function setMode(event) {
//    if (!event.path[0].classList.contains('active')) {
//       let node = $mode.children;
//       for (let el of node) {
//          el.classList.remove('active');
//       }
//       event.path[0].classList.add('active');
//    }
//    let activeEl = event.path[0].textContent;
//    $logo.textContent = activeEl;
// }
