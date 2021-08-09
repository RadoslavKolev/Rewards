module.exports = {

  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      from: "0x79888C68271935F01C2F000F091EcE68A9F9a1b3",
      network_id: "*" // Match any network id
    },
    develop: {
      port: 8545
    }
  },

  // Set default mocha options here, use special reporters etc.
  mocha: {
    // timeout: 100000
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "^0.4.2"
    }
  },

  // Truffle DB is currently disabled by default; to enable it, change enabled: false to enabled: true
  //
  // Note: if you migrated your contracts prior to enabling this field in your Truffle project and want
  // those previously migrated contracts available in the .db directory, you will need to run the following:
  // $ truffle migrate --reset --compile-all

  db: {
    enabled: false
  }
};
