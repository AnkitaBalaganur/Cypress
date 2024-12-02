const { defineConfig } = require("cypress");
const { addMatchImageSnapshotPlugin } = require('@simonsmith/cypress-image-snapshot/plugin');

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // Add image snapshot plugin for visual testing
      addMatchImageSnapshotPlugin(on, config, {
        imagesFolder: 'cypress/reports/mochawesome/assets',  // Save snapshots to mochawesome assets folder
        thresholdPercentage: 0.03,  // Set threshold for visual differences (3%)
        imageNameTemplate: '[testName]_[name]_[width]x[height]',  // Filename pattern for snapshots
      });
      
      // Add Mochawesome reporter plugin
      require('cypress-mochawesome-reporter/plugin')(on);

       // Get environment from command line args or default to 'prod'
       config.env.testEnv = config.env.testEnv || 'prod';
      
       return config;
    },
    specPattern: 'cypress/e2e/**/*.js',
    defaultCommandTimeout: 20000,
    pageLoadTimeout: 60000,
    responseTimeout: 30000,
    requestTimeout: 20000,
    viewportWidth: 1000,
    viewportHeight: 660,
    chromeWebSecurity: false,
    env: {
      updateSnapshots: false,
      testEnv: 'prod', // Default environment
      environments: ['prod', 'staging'], // Available environments
    },

    // Mochawesome reporter configuration
    reporter: 'cypress-mochawesome-reporter',
    reporterOptions: {
      reportDir: 'cypress/reports/mochawesome',   // Output directory for the reports
      overwrite: false,                           // Avoid overwriting reports in the same folder
      html: true,                                 // Generate HTML report
      json: true,                                 // Generate JSON report
      embeddedScreenshots: true,                  // Include screenshots directly in the report
      assetsDir: 'assets',                        // Directory for report assets
      timestamp: 'mmddyyyy'                       // Timestamp format for unique filenames
    },

    screenshotOnRunFailure: true,                 // Capture screenshots on test failures
    screenshotsFolder: 'cypress/reports/mochawesome/assets',  // Folder for storing screenshots
    video: false                                  // Disable video recording
  },
});