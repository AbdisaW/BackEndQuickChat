// General utility functions
module.exports = {
  log: (message) => {
    console.log(`[LOG] ${new Date().toISOString()} - ${message}`);
  },

  sleep: (ms) => new Promise((resolve) => setTimeout(resolve, ms)),

  formatDate: (date) => new Date(date).toISOString(),
};
