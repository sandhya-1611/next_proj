import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Listen for console events
  page.on('console', msg => console.log('BROWSER:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));

  try {
    await page.goto('http://localhost:5173');
    
    // Wait a bit for JavaScript to execute
    await page.waitForTimeout(3000);
    
    // Check the contents of the root div
    const rootContent = await page.evaluate(() => {
      const root = document.getElementById('root');
      return {
        innerHTML: root ? root.innerHTML : 'Root element not found',
        hasContent: root ? root.children.length > 0 : false
      };
    });
    
    console.log('Root content:', rootContent);
    
  } catch (error) {
    console.log('Error loading page:', error);
  } finally {
    await browser.close();
  }
})();