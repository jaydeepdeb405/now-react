export default class RecordWatcher {
    constructor() {
        if (process.env.NODE_ENV !== 'development' && window.__TECTONIC__$seismic_effect_amb
            && window.__TECTONIC__$seismic_effect_amb.createAmbSubscriptionEffect) {
            if (!window.g_ambClient) window.__TECTONIC__$seismic_effect_amb.createAmbSubscriptionEffect();
            this._channel = null;
            this._amb = window.g_ambClient;
        }
    }

    _getFilterString(filter) {
        filter = filter.
            replace(/\^EQ/g, '').
            replace(/\^ORDERBY(?:DESC)?[^^]*/g, '').
            replace(/^GOTO/, '');
        return btoa(filter).replace(/=/g, '-');
    }

    watch(table, filter, callback) {
        if (!this._amb) {
            console.log('Record Watcher not available');
            return;
        }
        if (!table) {
            console.log('Missing table name');
            return;
        }
        if (!callback) {
            console.log('Missing callback. Callback is required to receive messages');
            return;
        }
        filter = (!filter || (typeof filter === 'string' && filter.length === 0)) ? "sys_idISNOTEMPTY" : filter;
        if (table == 'sys_amb_message' || table.startsWith('sys_rw')) {
            console.log("Blocked from watching", table);
            return null;
        }
        console.log("Record Watcher initialized on " + table + " >>> " + filter);
        this._channel = this._amb.getChannel('/rw/default/' + table + '/' + this._getFilterString(filter));
        this._channel.subscribe(callback);
        this._amb.connect();
    }

}