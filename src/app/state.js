import { MODES, AVAILABLE_FONTS, AVAILABLE_THEMES } from './constants.js';

export const createState = () => ({
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
});
