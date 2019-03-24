import Vuex from 'vuex';
import Vue from 'vue';
import Storage from '../services/Storage';
import VideoParser from '../services/VideoParser';
Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        settings: {
            layout: {
                rows: parseInt(Storage.getSetting('layout.rows', 2)),
                cols: parseInt(Storage.getSetting('layout.cols', 2))
            },
            general: {
                watchInterval: parseInt(Storage.getSetting('general.watchInterval', 30000))
            },
            background: Storage.getSetting('background')
        },
        favorites: JSON.parse(Storage.getSetting('favorites', `[{
            "channelName": "有栖マナOfficial",
            "pageUrl": "https://live.bilibili.com/3822389",
            "status": "unknown"
        }]`)),
        favoritesTimers: new Map()
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
        updateWatchInterval(state, interval) {
            if (parseInt(interval) !== parseInt(interval)) {
                state.settings.general.watchInterval = 30000;
                Storage.setSetting('general.watchInterval', 30000);
            } else {
                state.settings.general.watchInterval = parseInt(interval);
                Storage.setSetting('general.watchInterval', parseInt(interval));
            }
        },
        updateBackground(state, background) {
            state.settings.background = background;
        },
        deleteFavorite(state, item) {
            const index = state.favorites.findIndex(i => i === item);
            state.favorites = [
                ...state.favorites.slice(0, index),
                ...state.favorites.slice(index + 1)
            ];
        },
        addFavorite(state, item) {
            state.favorites.push(item);
        },
        setFavoriteStatus(state, { pageUrl, status }) {
            for (const fav of state.favorites) {
                if (fav.pageUrl === pageUrl) {
                    fav.status = status;
                }
            }
        },
        addFavoriteTimer(state, pageUrl, timer) {
            state.favoritesTimers.set(pageUrl, timer);
        },
        removeFavoriteTimer(state, pageUrl) {
            clearInterval(state.favoritesTimers.get(pageUrl));
            state.favoritesTimers.delete(pageUrl);
        }
    },
    actions: {
        initFavoritesTimers({ commit, state }) {
            for (const fav of state.favorites) {
                const task = async () => {
                    const status = await VideoParser.getStatus(fav.pageUrl);
                    commit('setFavoriteStatus', { pageUrl: fav.pageUrl, status });
                }
                task(); // Execute once immediately
                const timer = setInterval(task, state.settings.general.watchInterval);
                commit('addFavoriteTimer', fav.pageUrl, timer);
            }
        },
        addFavorite({ commit, state }, item) {
            const timer = setInterval(async () => {
                const status = await VideoParser.getStatus(item.pageUrl);
                commit('setFavoriteStatus', { pageUrl: item.pageUrl, status });
            }, state.settings.general.watchInterval);
            commit('addFavorite', item);
            commit('addFavoriteTimer', item.pageUrl, timer);
            Storage.setSetting('favorites', JSON.stringify(state.favorites));
        },
        deleteFavorite({ commit, state }, item) {
            commit('deleteFavorite', item);
            commit('removeFavoriteTimer', item.pageUrl);
            Storage.setSetting('favorites', JSON.stringify(state.favorites));
        }
    }
});

export default store;