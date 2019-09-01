import Search from './Search';
import Worker from 'worker-loader!./Search.worker';
import debounce from 'lodash.debounce';

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
            default: 1,
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
            this.search.data = newData;
        },
        keys(newKeys) {
            this.search.keys = newKeys;
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
        this.search = new Search(this.data, this.keys, this.searchOptions);
        // set initial results to first page of data
        this.results = [
            { data: { question: 'test', answer: 'foo' } },
            { data: { question: 'foo', answer: 'test' } },
        ];
        const _self = this;
        this.debouncedSearch = debounce(query => {
            const searchResults = _self.search.execute(query);
            this.results = searchResults.results;
            this.totalResults = searchResults.totalResults;
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
