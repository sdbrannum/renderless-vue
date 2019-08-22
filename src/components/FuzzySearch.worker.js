const MSG_TYPES = {
    config: 'CONFIG',
    data: 'DATA',
    search: 'SEARCH',
};

const rankings = {
    CASE_SENSITIVE_EQUAL: 9,
    EQUAL: 8,
    STARTS_WITH: 7,
    WORD_STARTS_WITH: 6,
    STRING_CASE: 5,
    STRING_CASE_ACRONYM: 4,
    CONTAINS: 3,
    ACRONYM: 2,
    LCS: 1,
    NO_MATCH: 0,
};

// https://gist.github.com/nmsdvid/8807205
// const debounce = (callback, time = 250, interval) => (...args) => {
//     clearTimeout(interval);
//     interval = setTimeout(() => {
//         interval = null;
//         callback(...args);
//     }, time);
// };

class Search {
    /**
     *
     * @param {Object} options
     * @param {Boolean} paged
     * @param {Number} page
     */
    constructor(options) {
        this.page = 1;
        this.data = [];
        this.results = [];
        if (options && options.paged) this.paged = options.paged;
    }
    previousPage() {}
    nextPage() {}
    execute(query) {
        this.results = [];
        // TODO: rank so we can sort
        console.log('hit search >', query);
        if (!query) {
            return this.data;
        }

        const QUERY = query;
        const QUERY_UPPER = query.toUpperCase();

        for (let i = 0; i < this.data.length; i++) {
            if (this.results.length > 2500) break;
            const el = this.data[i];
            // case sensitive equals
            if (el.question === QUERY) {
                this.results.push({
                    rank: rankings.CASE_SENSITIVE_EQUAL,
                    rankedItem: el.question,
                });
                continue;
            }
            // upper casing before further comparison
            const EL_UPPER = el.question.toUpperCase();
            console.log('EL_UPPER >>', EL_UPPER);
            console.log('QUERY_UPPER >>', QUERY_UPPER);

            // case insensitive equals
            if (EL_UPPER === QUERY_UPPER) {
                this.results.push({
                    rank: rankings.EQUAL,
                    rankedItem: el.question,
                });
                continue;
            }

            // starts with
            if (EL_UPPER.indexOf(QUERY_UPPER) === 0) {
                this.results.push({
                    rank: rankings.STARTS_WITH,
                    rankedItem: el.question,
                });
                continue;
            }

            // any word starts with
            // TODO: not correct
            if (EL_UPPER.indexOf(QUERY_UPPER) !== -1) {
                this.results.push({
                    rank: rankings.WORD_STARTS_WITH,
                    rankedItem: el.question,
                });
                continue;
            }

            // in order subsequence
            const lcs = longestCommonSubsequence(EL_UPPER, QUERY_UPPER);
            if (lcs.length > 0 && lcs[0] !== '') {
                this.results.push({
                    rank: rankings.LCS,
                    rankedItem: el.question,
                });
                continue;
            }
        }

        console.log('Total results length: ', this.results.length);
        this.sortRankedItems();
        if (this.paged) {
            const pageRangeLower = this.paged ? this.page * 5 - 5 : 0;
            sendMessage('RESULTS', this.results.slice(pageRangeLower, 5));
        } else {
            sendMessage('RESULTS', this.results);
        }
    }
    removeAccents(str) {
        return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    }
    sortRankedItems() {
        // todo: sort same ranked items alphabetially
        this.results.sort((a, b) => b.rank - a.rank);
    }
}

class Communicator {
    constructor() {
        this.search = new Search();
    }

    sendResults() {
        self.postMessage('results');
    }
    handleMessage(e) {
        console.log('handling message');
        const msg = JSON.parse(e.data);

        switch (msg.type.toString()) {
            case MSG_TYPES.config:
                this.search.paged = msg.payload.paged;
                break;
            case MSG_TYPES.data:
                console.log('hit data case');
                this.search.data = msg.payload;
                break;
            case MSG_TYPES.search:
                console.log('hit search case');
                this.search.execute(msg.payload);
                break;
            default:
                break;
        }
    }
}

/**
 * @param {String} set1
 * @param {String} set2
 * @return {String}
 * @remarks https://github.com/trekhleb/javascript-algorithms/
 */
// todo: save searches
function longestCommonSubsequence(set1, set2) {
    // Init LCS matrix.
    const lcsMatrix = Array(set2.length + 1)
        .fill(null)
        .map(() => Array(set1.length + 1).fill(null));

    // Fill first row with zeros.
    for (let columnIndex = 0; columnIndex <= set1.length; columnIndex += 1) {
        lcsMatrix[0][columnIndex] = 0;
    }

    // Fill first column with zeros.
    for (let rowIndex = 0; rowIndex <= set2.length; rowIndex += 1) {
        lcsMatrix[rowIndex][0] = 0;
    }

    // Fill rest of the column that correspond to each of two strings.
    for (let rowIndex = 1; rowIndex <= set2.length; rowIndex += 1) {
        for (
            let columnIndex = 1;
            columnIndex <= set1.length;
            columnIndex += 1
        ) {
            if (set1[columnIndex - 1] === set2[rowIndex - 1]) {
                lcsMatrix[rowIndex][columnIndex] =
                    lcsMatrix[rowIndex - 1][columnIndex - 1] + 1;
            } else {
                lcsMatrix[rowIndex][columnIndex] = Math.max(
                    lcsMatrix[rowIndex - 1][columnIndex],
                    lcsMatrix[rowIndex][columnIndex - 1]
                );
            }
        }
    }

    // Calculate LCS based on LCS matrix.
    if (!lcsMatrix[set2.length][set1.length]) {
        // If the length of largest common string is zero then return empty string.
        return [''];
    }

    const longestSequence = [];
    let columnIndex = set1.length;
    let rowIndex = set2.length;

    while (columnIndex > 0 || rowIndex > 0) {
        if (set1[columnIndex - 1] === set2[rowIndex - 1]) {
            // Move by diagonal left-top.
            longestSequence.unshift(set1[columnIndex - 1]);
            columnIndex -= 1;
            rowIndex -= 1;
        } else if (
            lcsMatrix[rowIndex][columnIndex] ===
            lcsMatrix[rowIndex][columnIndex - 1]
        ) {
            // Move left.
            columnIndex -= 1;
        } else {
            // Move up.
            rowIndex -= 1;
        }
    }

    return longestSequence;
}

// Communicator.prototype.handleMessage = function(msg) {
//     console.log('got message');
// };

(function() {
    const comm = new Communicator();

    onmessage = e => comm.handleMessage(e);
})();

function sendMessage(type, payload) {
    postMessage(JSON.stringify({ type, payload }));
}

// const x = new Communicator();
// onmessage = function(e) {
//     console.log('Message received from main script');
// };
