import Search from './Search';
import Worker from 'worker-loader!./Worker';
import debounce from 'lodash.debounce';
import { msg_type } from './Constants';

export default {
    render() {
        return this.$scopedSlots.default({
            results: this.results,
            totalResults: this.totalResults,
        });
    },
    props: {
        data: {
            type: Array,
            required: false,
            default: () => [],
        },
        keys: {
            type: Array,
            required: false,
            default: () => [],
        },
        query: {
            type: String,
            required: false,
            validator(val) {
                return typeof val === 'string' || !val;
            },
        },
        // TODO: test & fallback
        useWorker: {
            type: Boolean,
            required: false,
            default: false,
        },
        /**
         * Page the data
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
            validator(val) {
                return typeof val === 'number' && val > 0;
            },
        },
        pageSize: {
            type: Number,
            required: false,
            default: 50,
        },
        threshold: {
            type: [String, Number],
            required: false,
            default: 2,
        },
    },
    data() {
        return {
            worker: null,
            results: [],
            totalResults: this.data.length,
        };
    },
    computed: {
        searchOptions() {
            return {
                paged: this.paged,
                page: this.page,
                pageSize: this.pageSize,
                threshold: this.threshold,
            };
        },
    },
    watch: {
        data(newData) {
            if (this.worker) {
                this.workerMessenger(msg_type.DATA, newData);
            } else {
                this.search.data = newData;
            }
        },
        keys(newKeys) {
            if (this.worker) {
                this.workerMessenger(msg_type.KEYS, newKeys);
            } else {
                this.search.keys = newKeys;
            }
        },
        page(newPage) {
            this.search.page = newPage;
        },
        query(newQuery) {
            console.log('new query', newQuery);
            this.debouncedSearch(newQuery);
        },
    },
    created() {
        console.log('hel', this.useWorker && !!window.Worker);
        if (this.useWorker && !!window.Worker) {
            this.worker = new Worker();
            this.worker.onmessage = e => this.workerListener(e);
            this.workerMessenger(msg_type.CONFIG, this.searchOptions);
            this.debouncedSearch = debounce(query => {
                this.workerMessenger(msg_type.SEARCH, query);
            }, 200);
        } else {
            this.search = new Search(this.data, this.keys, this.searchOptions);
            this.debouncedSearch = debounce(query => {
                const searchResults = this.search.execute(query);
                this.results = searchResults.results;
                this.totalResults = searchResults.totalResults;
            }, 200);
        }
    },
    mounted() {},
    methods: {
        workerMessenger(type, payload) {
            console.log('sending msg', type, payload);
            this.worker.postMessage(JSON.stringify({ type, payload }));
        },
        workerListener(e) {
            const msg = JSON.parse(e.data);
            console.log('workerListener', msg);
            this.results = msg.payload.results;
            this.totalResults = msg.payload.totalResults;
        },
    },
};
