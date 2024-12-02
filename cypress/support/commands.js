// Import the image snapshot command
import { addMatchImageSnapshotCommand } from '@simonsmith/cypress-image-snapshot/command';

// Initialize image snapshot command
addMatchImageSnapshotCommand({
  failureThreshold: 0.00,
  failureThresholdType: 'percent',
  customDiffConfig: {
    threshold: 0.1,
    createDiffImage: true,
  },
});

// Command: Compare snapshot with baseline
Cypress.Commands.add('compareSnapshot', (name) => {
  // Set viewport for consistent screenshots
  cy.viewport(1920, 1080);

  // Wait for page animations to complete
  cy.wait(1000);

  // Disable animations and transitions for stable visuals
  cy.document().then((doc) => {
    const style = doc.createElement('style');
    style.innerHTML = `
      *, *::before, *::after {
        animation: none !important;
        transition: none !important;
      }
    `;
    doc.head.appendChild(style);
  });

  // Take snapshot and compare with baseline
  cy.matchImageSnapshot(name, {
    failureThreshold: 0.03,
    failureThresholdType: 'percent',
    capture: 'viewport',
    disableTimersAndAnimations: true,
  }).then(() => {
    cy.log(`Snapshot comparison completed for: ${name}`);
  });
});

// Command: Wait for page to stabilize
Cypress.Commands.add('waitForPageStable', () => {
  // Set consistent viewport
  cy.viewport(1920, 1080);

  // Wait for page to stabilize (adjust the time based on your app's loading time)
  cy.wait(2000);

  // Disable animations and transitions
  cy.document().then((doc) => {
    const style = doc.createElement('style');
    style.innerHTML = `
      *, *::before, *::after {
        animation: none !important;
        transition: none !important;
      }
    `;
    doc.head.appendChild(style);
  });
});

// Command: Take a stable snapshot
Cypress.Commands.add('takeStableSnapshot', (name) => {
  // Ensure page is stable before taking a snapshot
  cy.waitForPageStable();
  cy.compareSnapshot(name);
});

// Command: Visit a product URL (optional, if needed in your tests)
Cypress.Commands.add('visitProduct', (category, userType, env = 'prod') => {
  cy.fixture('urls.json').then((urls) => {
    const baseUrl = urls.baseUrls[env];
    const productPath = urls.products[category]?.[userType];
    if (!baseUrl || !productPath) {
      throw new Error(`Invalid category (${category}), userType (${userType}), or environment (${env})`);
    }
    cy.visit(`${baseUrl}${productPath}`);
  });
});
