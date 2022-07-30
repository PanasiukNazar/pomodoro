import './main.css';
import './modal.css';
import './theme.css';

import { createState } from './state.js';

import { bindDom } from './dom.js';

const state = createState();

bindDom(state);

state.changed();
