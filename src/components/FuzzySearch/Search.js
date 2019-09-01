const rankings = {
    CASE_SENSITIVE_EQUAL: 10,
    EQUAL: 9,
    STARTS_WITH: 8,
    WORD_STARTS_WITH: 7,
    STRING_CASE: 6,
    STRING_CASE_ACRONYM: 5,
    CONTAINS: 4,
    ACRONYM: 3,
    SUBSEQUENCE: 2,
    SUBSTRING: 1,
    NO_MATCH: 0,
};

export default class Search {
    constructor(data = [], options = {}) {
        this.data = data;
        this.paged = options.paged || false;
        this.page = options.page || 1;
        this.pageSize = options.pageSize || data.length;
        this.threshold = options.threshold || rankings.SUBSTRING;
    }
    /**
     * Return sorted and matched results based on given query and data
     * @param {String} query
     * @param {Array} data
     * @remarks by reference
     */
    execute(query) {
        if (!query) {
            if (this.paged) {
                return this.data.slice(0, this.pageSize);
            }
            return this.data;
        }

        const results = [];
        const QUERY = query;
        const QUERY_UPPER = query.toUpperCase();

        for (let i = 0; i < this.data.length; i++) {
            if (results.length > 2500) break;
            const el = this.data[i];
            let beginPosition = 0;
            // case sensitive equals
            if (el === QUERY) {
                results.push({
                    rank: rankings.CASE_SENSITIVE_EQUAL,
                    rankedItem: el,
                });
                continue;
            }

            // upper casing before further comparison
            const EL_UPPER = el.toUpperCase();

            // case insensitive equals
            if (EL_UPPER === QUERY_UPPER) {
                results.push({
                    rank: rankings.EQUAL,
                    rankedItem: el,
                    positions: [...this.range(beginPosition, query.length)],
                });
                continue;
            }

            // starts with
            beginPosition = EL_UPPER.indexOf(QUERY_UPPER);
            if (beginPosition === 0) {
                results.push({
                    rank: rankings.STARTS_WITH,
                    rankedItem: el,
                    positions: [...this.range(beginPosition, query.length)],
                });
                continue;
            }

            // any word except first starts with
            beginPosition = EL_UPPER.indexOf(` ${QUERY_UPPER}`);
            if (beginPosition !== -1) {
                results.push({
                    rank: rankings.WORD_STARTS_WITH,
                    rankedItem: el,
                    positions: [...this.range(beginPosition, query.length)],
                });
                continue;
            }

            // contains
            beginPosition = EL_UPPER.indexOf(QUERY_UPPER);
            if (beginPosition !== -1) {
                results.push({
                    rank: rankings.CONTAINS,
                    rankedItem: el,
                    positions: [...this.range(beginPosition, query.length)],
                });
                continue;
            }

            // in order subsequence
            let minWin = this.minWinSeq(QUERY_UPPER, EL_UPPER);
            if (minWin.minSequence && minWin.minSequence.length > 0) {
                results.push({
                    rank: rankings.SUBSEQUENCE,
                    rankedItem: el,
                    distance: minWin.minSequence.length - query.length,
                    positions: minWin.positions,
                });
                continue;
            }

            minWin = this.minWinSub(QUERY_UPPER, EL_UPPER);
            if (minWin.minSequence && minWin.minSequence.length > 0) {
                results.push({
                    rank: rankings.SUBSTRING,
                    rankedItem: el,
                    distance: minWin.minSequence.length - query.length,
                    positions: minWin.positions,
                });
                continue;
            }
        }

        const sortRankedItems = (a, b) => {
            if (a.rank === b.rank) {
                if (a.distance && a.distance !== b.distance) {
                    return a.distance - b.distance;
                }
                return a.rankedItem.localeCompare(b.rankedItem);
            }
            return b.rank - a.rank;
        };

        results.sort(sortRankedItems);

        const totalResults = results.length;
        return { results, totalResults };
    }

    /**
     * Minimum window subsequence
     * @param {String} query
     * @param {String} searchString
     * @returns {String} minimum subsequence window
     * @remarks https://www.youtube.com/watch?v=W2DvQcDPD9A
     */
    minWinSeq(query, searchString) {
        let minSequence = null;

        if (!query || !searchString) {
            return { minSequence: minSequence, positions: [] };
        }
        if (query.length > searchString.length) {
            return { minSequence: minSequence, positions: [] };
        }

        let end = 0,
            maxWinLength = searchString.length + 1,
            positions = [];

        for (let i = 0, j = 0; i < searchString.length; i++) {
            if (searchString[i] === query[j]) {
                j += 1;
                if (j >= query.length) {
                    positions = [];
                    end = i + 1;
                    j -= 1;
                    while (j >= 0) {
                        if (query[j] === searchString[i]) {
                            positions.unshift(i);
                            j -= 1;
                        }
                        i -= 1;
                    }
                    i += 1;
                    j += 1;
                    if (end - i < maxWinLength) {
                        maxWinLength = end - i;
                        minSequence = searchString.substring(end, i);
                    }
                }
            }
        }
        return { minSequence, positions };
    }
    /**
     * Minimum window substring
     * @param {String} query
     * @param {String} searchString
     */
    minWinSub(query, searchString) {
        let minSequence = null;
        let positions = [];
        if (!query || !searchString) {
            return { minSequence, positions };
        }
        if (query.length > searchString.length) {
            return { minSequence, positions };
        }

        // build map containing letters and counts of those letters for our query
        const queryCharMap = new Map();
        [...query].forEach(letter => {
            let letterVal = queryCharMap.get(letter);
            if (letterVal) {
                queryCharMap.set(letter, letterVal + 1);
            } else {
                queryCharMap.set(letter, 1);
            }
        });

        const incrementMapKeyVal = (map, key, val) => {
            let currVal = map.get(key);
            if (currVal) {
                map.set(key, currVal + val);
            } else {
                map.set(key, 1);
            }
        };

        /*
            Loop over search string.  Move the right index until we satisfy.
            Compare against the current best.  Squeeze and compare until we
            no longer satsify and then start moving the right again
        */
        let left = 0,
            right = 0,
            frequenciesThatMatch = 0;

        const windowCharMap = new Map(),
            totalFrequenciesToMatch = queryCharMap.size;

        while (right < searchString.length) {
            let rightLetter = searchString[right];

            incrementMapKeyVal(windowCharMap, rightLetter, 1);

            if (queryCharMap.has(rightLetter)) {
                // do the frequencies of this letter in window and query match?
                if (
                    queryCharMap.get(rightLetter) ===
                    windowCharMap.get(rightLetter)
                ) {
                    frequenciesThatMatch += 1;
                }
            }

            while (
                frequenciesThatMatch === totalFrequenciesToMatch &&
                left <= right
            ) {
                minSequence = searchString; // necessary to be here so we don't return the whole string if no match
                let leftLetter = searchString[left],
                    windowSize = right - left + 1;

                if (windowSize < minSequence.length) {
                    minSequence = searchString.substring(left, right + 1);

                    positions = [...minSequence].reduce((acc, curr, idx) => {
                        if (queryCharMap.has(curr)) {
                            acc.push(left + idx);
                        }
                        return acc;
                    }, []);
                }

                // left will increase so decrement val for letter at that position in windowCharMap
                incrementMapKeyVal(windowCharMap, leftLetter, -1);

                // is left character a requirement
                if (queryCharMap.has(leftLetter)) {
                    // does the letter frequency fail to meet the standard now>
                    if (
                        windowCharMap.get(leftLetter) <
                        queryCharMap.get(leftLetter)
                    ) {
                        frequenciesThatMatch -= 1;
                    }
                }

                left += 1;
            }
            right += 1;
        }

        return { minSequence, positions };
    }

    /**
     * Remove accents/diacritics from a given string
     * @param {String} str
     * @remarks https://stackoverflow.com/questions/990904/remove-accents-diacritics-in-a-string-in-javascript
     */
    removeDiacritics(str) {
        return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    }

    /*
     * Generate an array filled from start..stop
     */
    range(start, stop) {
        return Array(Math.ceil((stop - start) / 1))
            .fill(start)
            .map((x, y) => x + y * 1);
    }
}
