describe('Try On Feature Automation with Additional Test Cases', () => {
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
    const compareSnapshot = (name) => {
      try {
        cy.matchImageSnapshot(name);
      } catch (error) {
        cy.log(`Snapshot mismatch for "${name}": ${error.message}`);
      }
    };
  
    const numberOfProductsToTest = 5;
    const productsToTest = Array.from({ length: numberOfProductsToTest }, (_, i) => ({ index: i }));
  
    it('should perform try-on test for a dynamic product page', () => {
      // Visit the product page
      cy.visit('https://www.youtube.com/');// Need to add the relevant URL.
      cy.wait(2000);
  
      // Step 2: Click on the Try On button
      cy.get('.gap-\\[20px\\] > :nth-child(1)', { timeout: 10000 })
        .should('exist')
        .and('be.visible')
        .click();
  
      cy.wait(10000);
      compareSnapshot('Tooltip_Appears');
  
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
          compareSnapshot('After_Tooltip');
  
          // Step 6: Deselect and reselect the first product
          cy.wrap(iframeBody)
            .find('div.pt-\\[1rem\\].bg-white.flex.flex-col.rounded-lg')
            .should('be.visible')
            .click();
          compareSnapshot('SKU_Deselected');
  
          cy.wrap(iframeBody)
            .find('div.pt-\\[1rem\\].bg-white.flex.flex-col.rounded-lg')
            .should('be.visible')
            .click();
          compareSnapshot('SKU_Selected');
  
          // Step 7: Handle Product Details
          cy.wrap(iframeBody)
            .contains('button', 'Product details')
            .should('be.visible')
            .click();
          compareSnapshot('Product_Details_Open');
  
          cy.wrap(iframeBody)
            .contains('button', 'Stay here')
            .should('be.visible')
            .click();
          compareSnapshot('Product_Details_Popup');
  
          // Step 8: Add to Cart
          cy.wrap(iframeBody)
            .contains('button', 'Add to cart')
            .should('be.visible')
            .click();
          compareSnapshot('Add_To_Cart');
  
          // Step 9: Show Similar Products
          cy.wrap(iframeBody)
            .contains('button', 'Show Similar Products')
            .should('be.visible')
            .click();
          compareSnapshot('Similar_Products');
  
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
                compareSnapshot(`Product_${idx + 1}_Selected_Default`);
              });
          });
  
          // Step 11: Select Rings category
          cy.wrap(iframeBody)
            .find('div.capitalize')
            .first()
            .should('be.visible')
            .click();
          compareSnapshot('Category_Dropdown');
  
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
                compareSnapshot(`Product_${idx + 1}_Selected_Rings`);
              });
          });
        });
    });
  });
  