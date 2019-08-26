const rankings = {
    CASE_SENSITIVE_EQUAL: 9,
    EQUAL: 8,
    STARTS_WITH: 7,
    WORD_STARTS_WITH: 6,
    STRING_CASE: 5,
    STRING_CASE_ACRONYM: 4,
    CONTAINS: 3,
    ACRONYM: 2,
    SUBSEQUENCE: 1,
    NO_MATCH: 0,
};

export default class Search {
    constructor() {}
    /**
     * Return sorted and matched results based on given query and data
     * @param {String} query
     * @param {Array} data
     * @remarks by reference
     */
    execute(query, data) {
        if (!query) {
            return data;
        }

        const results = [];
        const QUERY = query;
        const QUERY_UPPER = query.toUpperCase();

        for (let i = 0; i < data.length; i++) {
            if (results.length > 2500) break;
            const el = data[i];
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
                });
                continue;
            }

            // starts with
            if (EL_UPPER.indexOf(QUERY_UPPER) === 0) {
                results.push({
                    rank: rankings.STARTS_WITH,
                    rankedItem: el,
                });
                continue;
            }

            // any word except first starts with
            if (EL_UPPER.indexOf(` ${QUERY_UPPER}`) !== -1) {
                results.push({
                    rank: rankings.WORD_STARTS_WITH,
                    rankedItem: el,
                });
                continue;
            }

            // contains
            if (EL_UPPER.indexOf(QUERY_UPPER) !== -1) {
                results.push({
                    rank: rankings.CONTAINS,
                    rankedItem: el,
                });
            }

            // in order subsequence
            const x = this.minWinSeq(QUERY_UPPER, EL_UPPER);
            if (x.length > 0) {
                results.push({
                    rank: rankings.SUBSEQUENCE,
                    rankedItem: el,
                    distance: x.length - QUERY_UPPER.length,
                });
                continue;
            }
        }

        const sortRankedItems = (a, b) => {
            if (a.rank === b.rank) {
                if (a.rank === rankings.SUBSEQUENCE) {
                    if (a.distance === b.distance) {
                        return a.rankedItem
                            .toString()
                            .localeCompare(b.rankedItem.toString());
                    }
                    return a.distance - b.distance;
                }
                return a.rankedItem
                    .toString()
                    .localeCompare(b.rankedItem.toString());
            }
            return b.rank - a.rank;
        };

        results.sort(sortRankedItems);

        return results;
    }

    /**
     * Minimum window subsequence
     * @param {String} query
     * @param {String} strToRank
     * @returns {String} minimum subsequence window
     * @remarks https://www.youtube.com/watch?v=W2DvQcDPD9A
     */
    minWinSeq(query, strToRank) {
        if (query.length < 1 || strToRank.length < 1) {
            return '';
        }
        if (query.length > strToRank.length) {
            return '';
        }

        let minSequence = '',
            j = 0,
            end = 0,
            min = strToRank.length + 1;

        for (let i = 0; i < strToRank.length; i++) {
            if (strToRank[i] === query[j]) {
                j += 1;
                if (j >= query.length) {
                    end = i + 1;
                    j -= 1;
                    while (j >= 0) {
                        if (query[j] === strToRank[i]) {
                            j -= 1;
                        }
                        i -= 1;
                    }
                    i += 1;
                    j += 1;
                    if (end - i < min) {
                        min = end - i;
                        minSequence = strToRank.substring(end, i);
                    }
                }
            }
        }
        return minSequence;
    }
    /**
     * Remove accents/diacritics from a given string
     * @param {String} str
     * @remarks https://stackoverflow.com/questions/990904/remove-accents-diacritics-in-a-string-in-javascript
     */
    removeDiacritics(str) {
        return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    }
}
