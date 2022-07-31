require("@nomiclabs/hardhat-waffle")
require("@nomiclabs/hardhat-etherscan")
require("hardhat-deploy")
require("solidity-coverage")
require("hardhat-gas-reporter")
require("hardhat-contract-sizer")
// require("@nomicfoundation/hardhat-toolbox")
require("dotenv").config()

const Rinkeby_RPC_URL = process.env.Rinkeby_RPC_URL
const PRIVATE_KEY = process.env.PRIVATE_KEY
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    defaultNetwork: "hardhat",
    networks: {
        hardhat: {
            chainId: 31337,
            blockConfirmations: 1,
        },
        rinkeby: {
            chainId: 4,
            blockConfirmations: 6,
            url: Rinkeby_RPC_URL,
            accounts: [PRIVATE_KEY],
        },
    },
    etherscan: {
        apiKey: {
            rinkeby: ETHERSCAN_API_KEY,
        },
    },
    gasReporter: {
        enabled: false,
        currency: "USD",
        outputFile: "gas-report.txt",
        noColors: true,
        coinmarketcap: process.env.COINMARKETCAP_API_KEY,
    },
    solidity: "0.8.9",
    namedAccounts: {
        deployer: {
            default: 0,
        },
        player: {
            default: 1,
        },
    },
    mocha: {
        // timeout: 300000, // 300 seconds
        timeout: 1000000, // 300 seconds
    },
}

// export const defaultNetwork = "hardhat"
// export const networks = {
//     hardhat: {
//         chainId: 31337,
//         blockConfirmations: 1,
//     },
//     rinkeby: {
//         chainId: 4,
//         blockConfirmations: 6,
//         url: Rinkeby_RPC_URL,
//         accounts: [PRIVATE_KEY],
//     },
// }
// export const solidity = "0.8.9"
// export const namedAccounts = {
//     deplyer: {
//         default: 0,
//     },
//     player: {
//         default: 1,
//     },
// }
