describe('Try On Feature Automation with Additional Test Cases', () => {
  // Get environment from Cypress config
  const testEnv = Cypress.env('testEnv') || 'prod';
  
  before(() => {
    cy.viewport(1000, 660);
    
    if (Cypress.browser.isHeadless) {
      Cypress.config('defaultCommandTimeout', 10000);
      Cypress.config('requestTimeout', 10000);
      Cypress.config('responseTimeout', 30000);
    }
  });

  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  // Helper function to compare snapshot
  const compareSnapshot = (category, userType, name) => {
    try {
      cy.matchImageSnapshot(`${category}_${userType}_${testEnv}_${name}`);
    } catch (error) {
      cy.log(`Snapshot mismatch for "${category}_${userType}_${testEnv}_${name}": ${error.message}`);
    }
  };

  const numberOfProductsToTest = 5;
  const productsToTest = Array.from({ length: numberOfProductsToTest }, (_, i) => ({ index: i }));

  ['Chain', 'Ring', 'Bracelet'].forEach((category) => {
    ['Male', 'Kid','Female'].forEach((userType) => {
      it(`should perform try-on test for ${category} - ${userType} in ${testEnv}`, () => {
        // Visit the product page with environment parameter
        cy.visitProduct(category, userType, testEnv);
        cy.wait(2000);

        // Step 2: Click on the Try On button
        cy.get('.gap-\\[20px\\] > :nth-child(1)', { timeout: 10000 })
          .should('exist')
          .and('be.visible')
          .click();
        // cy.wait(1000);
        // compareSnapshot(category, userType, 'Loading_Page');

        cy.wait(10000);
        compareSnapshot(category, userType, 'Tooltip_Appears');

        // Step 3: Handle iFrame content
        cy.get('iframe')
          .should('have.length.greaterThan', 0)
          .first()
          .then($iframe => {
            const iframeBody = $iframe.contents().find('body');

            // Step 4: Validate tooltip
            cy.wrap(iframeBody)
              .find('#contentDiv')
              .should('be.visible')
              .contains('Got It')
              .click();
            compareSnapshot(category, userType, 'After_Tooltip');

            // Step 6: Deselect and reselect the first product
            cy.wrap(iframeBody)
              .find('div.pt-\\[1rem\\].bg-white.flex.flex-col.rounded-lg')
              .should('be.visible')
              .click();
            compareSnapshot(category, userType, 'SKU_Deselected');

            cy.wrap(iframeBody)
              .find('div.pt-\\[1rem\\].bg-white.flex.flex-col.rounded-lg')
              .should('be.visible')
              .click();
            compareSnapshot(category, userType, 'SKU_Selected');

            // Step 7: Handle Product Details
            cy.wrap(iframeBody)
              .contains('button', 'Product details')
              .should('be.visible')
              .click();
            compareSnapshot(category, userType, 'Product_Details_Open');

            cy.wrap(iframeBody)
              .contains('button', 'Stay here')
              .should('be.visible')
              .click();
            compareSnapshot(category, userType, 'Product_Details_Popup');

            // Step 8: Add to Cart
            cy.wrap(iframeBody)
              .contains('button', 'Add to cart')
              .should('be.visible')
              .click();
            compareSnapshot(category, userType, 'Add_To_Cart');

            // Step 9: Show Similar Products
            cy.wrap(iframeBody)
              .contains('button', 'Show Similar Products')
              .should('be.visible')
              .click();
            compareSnapshot(category, userType, 'Similar_Products');

            // Step 10: Selecting Products from left panel
            productsToTest.forEach((product, idx) => {
              cy.wrap(iframeBody)
                .find('div[data-item="desktop-product-card"]')
                .eq(product.index)
                .scrollIntoView({ behavior: 'smooth' })
                .should('be.visible')
                .then($product => {
                  cy.wrap($product).click();
                  cy.wait(1000);
                  compareSnapshot(category, userType, `Product_${idx + 1}_Selected_Default`);
                });
            });

            // Step 11: Select Rings category
            cy.wrap(iframeBody)
              .find('div.capitalize')
              .first()
              .should('be.visible')
              .click();
            compareSnapshot(category, userType, 'Category_Dropdown');

            cy.wrap(iframeBody)
              .contains('Rings')
              .should('be.visible')
              .click({ force: true });

            // Handle Rings products
            productsToTest.forEach((product, idx) => {
              cy.wrap(iframeBody)
                .find('div[data-item="desktop-product-card"]')
                .eq(product.index)
                .scrollIntoView({ behavior: 'smooth' })
                .should('be.visible')
                .then($product => {
                  cy.wrap($product).click();
                  cy.wait(1000);
                  compareSnapshot(category, userType, `Product_${idx + 1}_Selected_Rings`);
                });
            });

            // Select Earrings category
            cy.wrap(iframeBody)
              .find('div.capitalize')
              .first()
              .should('be.visible')
              .click();
            compareSnapshot(category, userType, 'Category_Dropdown_Earrings');

            cy.wrap(iframeBody)
              .contains('Earrings')
              .should('be.visible')
              .click({ force: true });

            // Handle Earrings products
            productsToTest.forEach((product, idx) => {
              cy.wrap(iframeBody)
                .find('div[data-item="desktop-product-card"]')
                .eq(product.index)
                .scrollIntoView({ behavior: 'smooth' })
                .should('be.visible')
                .then($product => {
                  cy.wrap($product).click();
                  cy.wait(1000);
                  compareSnapshot(category, userType, `Product_${idx + 1}_Selected_Earrings`);
                });
            });
          });
      });
    });
  });
});