import Search from './Search';

import { msg_type } from './Constants';

class Comms {
    constructor() {
        this.search = new Search();
        this.data = [];
        this.results = [];
    }

    sendMessage(type, payload) {
        postMessage(JSON.stringify({ type, payload }));
    }

    handleMessage(e) {
        const msg = JSON.parse(e.data);
        console.log('received msg', msg);
        switch (msg.type.toString()) {
            case msg_type.CONFIG:
                this.search.paged = msg.payload.paged;
                this.search.pageSize = msg.payload.pageSize;
                this.search.threshold = msg.payload.threshold;
                break;
            case msg_type.DATA:
                this.search.data = msg.payload;
                break;
            case msg_type.KEYS:
                this.search.keys = msg.payload;
                break;
            case msg_type.SEARCH:
                console.log('in worker, searching');
                this.results = this.search.execute(msg.payload);
                console.log(this.results);
                if (this.paged) {
                    const pageRangeLower = this.paged ? this.page * 5 - 5 : 0;
                    this.sendMessage(
                        'RESULTS',
                        this.results.slice(pageRangeLower, 5)
                    );
                } else {
                    this.sendMessage('RESULTS', this.results);
                }
                break;
            default:
                console.log('in default', msg.type.toString());
                break;
        }
    }
}

(function() {
    const comm = new Comms();
    onmessage = e => comm.handleMessage(e);
})();
