function getProdExternals() {
    return {
        vue: 'Vue',
    };
}

module.exports = {
    configureWebpack: {
        externals:
            process.env.NODE_ENV === 'production' ? getProdExternals() : {},
    },
};
