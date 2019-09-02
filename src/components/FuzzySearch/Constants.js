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

const msg_type = {
    CONFIG: 'CONFIG',
    DATA: 'DATA',
    KEYS: 'KEYS',
    SEARCH: 'SEARCH',
    RESULTS: 'RESULTS',
};

export { rankings, msg_type };
