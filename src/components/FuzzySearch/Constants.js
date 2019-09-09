const rankings = {
    CASE_SENSITIVE_EQUAL: 7,
    EQUAL: 6,
    STARTS_WITH: 5,
    WORD_STARTS_WITH: 4,
    CONTAINS: 3,
    SUBSEQUENCE: 2,
    SUBSTRING: 1,
    NO_MATCH: 0,
};

const msg_type = {
    CONFIG: 'CONFIG',
    PAGE: 'PAGE',
    DATA: 'DATA',
    KEYS: 'KEYS',
    SEARCH: 'SEARCH',
    RESULTS: 'RESULTS',
};

export { rankings, msg_type };
