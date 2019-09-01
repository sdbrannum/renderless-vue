import Search from './Search';
import Worker from 'worker-loader!./Search.worker';
import debounce from 'lodash.debounce';

export default {
    render() {
        return this.$scopedSlots.default({
            results: this.results,
        });
    },
    props: {
        data: {
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
        keys: {
            type: Array,
            required: false,
            default: () => [],
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
            default: 'LCS',
        },
    },
    data() {
        return {
            worker: null,
            results: [],
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
        data() {},
        query() {},
    },
    created() {
        this.search = new Search(this.data, this.searchOptions);
        // set initial results to first page of data
        this.results = this.executeSearch();
        this.debouncedSearch = query =>
            debounce(() => {
                this.searh.execute(query);
            }, 200);
    },
    mounted() {},
    methods: {
        startWorker() {
            this.worker = new Worker();
            this.worker.onmessage = e => this.workerListener(e);
        },
        // workerMessenger(type, payload) {
        //     this.worker.postMessage(JSON.stringify({ type, payload }));
        // },
        // workerListener(e) {
        //     const msg = JSON.parse(e.data);
        //     this.results = msg.payload;
        // },
    },
};
