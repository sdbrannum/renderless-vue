import Search from './Search';

const MSG_TYPES = {
    config: 'CONFIG',
    data: 'DATA',
    search: 'SEARCH',
};

class Comms {
    constructor(options) {
        this.search = new Search();
        console.log('search >>', this.search);
        this.data = [];
        this.results = [];
        if (options && options.paged) this.paged = options.paged;
        this.page = 1;
    }

    sendMessage(type, payload) {
        postMessage(JSON.stringify({ type, payload }));
    }

    handleMessage(e) {
        console.log('handling message');
        const msg = JSON.parse(e.data);

        switch (msg.type.toString()) {
            case MSG_TYPES.config:
                this.paged = msg.payload.paged;
                break;
            case MSG_TYPES.data:
                console.log('hit data case');
                this.data = msg.payload;
                break;
            case MSG_TYPES.search:
                console.log('hit search case', this.search);
                console.log(msg.payload);
                console.log(this.data.length);
                this.results = this.search.execute(msg.payload, this.data);
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
                break;
        }
    }
}

(function() {
    const comm = new Comms();
    onmessage = e => comm.handleMessage(e);
})();
