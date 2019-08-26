import Search from '@/components/FuzzySearch/Search';

let search = null;
beforeEach(() => {
    search = new Search();
});

const data = [
    'test', // single word
    'abc test abc', // multiple words
    'test test', // multiple occurrences
    'test abc test abc', // multiple occurrences with other words
    'abc', // no match
    'abc abc abc', // no match multiple words
    'txexsxt', // mixed
    'txexsxt txxexxsxxt', // multiple occurences mixed
    'txxexxsxxt txexsxt', // multiple occurences mixed
];

test('the search results contain correct results', () => {
    const results = search.execute('test', data).map(res => res.rankedItem);
    expect(results).toContain('test');
    expect(results).toContain('abc test abc');
    expect(results).toContain('test test');
    expect(results).toContain('txexsxt');
    expect(results).toContain('txexsxt txxexxsxxt');
    expect(results).toContain('txxexxsxxt txexsxt');
});

test('the search results are sorted correctly', () => {
    const results = search.execute('test', data).map(res => res.rankedItem);
    expect(results).toEqual([
        'test', // equals
        'test abc test abc', // starts with
        'test test', // starts with
        'abc test abc', // word starts with
        'txexsxt', // contains
        'txexsxt txxexxsxxt', // contains
        'txxexxsxxt txexsxt', // contains
    ]);
});
