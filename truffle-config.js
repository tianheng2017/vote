const path = require('path')

module.exports = {
	contracts_build_directory: path.join(__dirname, "dapp/src/contracts"),
    networks: {
        // ganache本地部署
        development: {
            host: "127.0.0.1",
            port: 7545,
            network_id: 1337,
        },
    },
    compilers: {
        solc: {
            version: "0.4.24",
        }
    },
};
