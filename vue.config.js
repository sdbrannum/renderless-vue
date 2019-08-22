// {
//     module: {
//         rules: [
//             {
//                 test: /\.worker\.js$/,
//                 use: { loader: 'worker-loader' }
//             }
//         ];
//     }
// }

// vue.config.js
// module.exports = {
//     chainWebpack: config => {
//         // GraphQL Loader
//         config.module
//             .rule('webworker')
//             .test(/\.worker\.js$/)
//             .use('worker-loader')
//             .loader('worker-loader')
//             .end();
//     }
// };
