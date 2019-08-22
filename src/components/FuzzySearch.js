import Worker from 'worker-loader!./FuzzySearch.worker';
export default {
    render() {
        return this.$scopedSlots.default({
            results: this.results,
            nextPage: this.nextPage,
            previousPage: this.previousPage,
            currentPage: this.currentPage,
            sendMessage: this.sendMessage,
        });
    },
    props: {
        data: {
            type: Array,
            required: false,
            default: () => [],
        },
        query: {
            type: [String, Array],
            required: false,
            validator(val) {
                if (typeof val === 'string' || !val) return true;
                return val.every(query => typeof query === 'string');
            },
        },
        keys: {
            type: Array,
            required: false,
            default: () => [],
        },
        /**
         * Page the datq
         */
        paged: {
            type: Boolean,
            required: false,
            default: false,
        },
        page: {
            type: Number,
            required: false,
            default: 1,
        },
        pageSize: {
            type: Number,
            required: false,
            default: -1,
        },
        threshold: {
            type: String,
            required: false,
            default: 'LCS',
        },
        /**
         * LCS: Max spread
         */
        maxSpread: {
            type: Number,
            required: false,
            default: 3,
        },
    },
    data() {
        return {
            worker: null,
            results: [],
        };
    },
    mounted() {
        console.log(typeof this.data[0]);
        this.startWorker();
    },
    computed: {
        currentPage() {
            return -1;
        },
    },
    watch: {
        data() {
            this.sendData();
        },
        query() {
            this.sendQuery();
        },
    },
    methods: {
        previousPage() {},
        nextPage() {},
        removeAccents(str) {
            return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        },
        sortRankedItems() {},
        getAcronym() {},
        startWorker() {
            this.worker = new Worker();
            this.worker.onmessage = e => this.workerListener(e);
            this.configureWorker();
        },
        configureWorker() {
            this.worker.postMessage(
                JSON.stringify({ type: 'CONFIG', payload: { paged: true } })
            );
        },
        sendData() {
            this.worker.postMessage(
                JSON.stringify({ type: 'DATA', payload: this.data })
            );
        },
        sendQuery() {
            this.worker.postMessage(
                JSON.stringify({ type: 'SEARCH', payload: this.query })
            );
        },
        workerListener(e) {
            const msg = JSON.parse(e.data);
            console.log(msg);
            this.results = msg.payload;
            console.log(this.results);
        },
    },
};
