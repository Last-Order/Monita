import Vuex from 'vuex';
import Vue from 'vue';
import Storage from '../services/Storage';
Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        settings: {
            layout: {
                rows: parseInt(Storage.getSetting('layout.rows', 2)),
                cols: parseInt(Storage.getSetting('layout.cols', 2))
            },
            background: Storage.getSetting('background')
        }
    },
    mutations: {
        updateLayoutRows(state, rows) {
            if (parseInt(rows) !== parseInt(rows)) {
                state.settings.layout.rows = 0;
                Storage.setSetting('layout.rows', 0);
            } else {
                state.settings.layout.rows = parseInt(rows);
                Storage.setSetting('layout.rows', parseInt(rows));
            }
        },
        updateLayoutCols(state, cols) {
            if (parseInt(cols) !== parseInt(cols)) {
                state.settings.layout.cols = 0;
                Storage.setSetting('layout.cols', 0);
            } else {
                state.settings.layout.cols = parseInt(cols);
                Storage.setSetting('layout.cols', parseInt(cols));
            }
        },
        updateBackground(state, background) {
            state.settings.background = background;
        }
    }
});

export default store;