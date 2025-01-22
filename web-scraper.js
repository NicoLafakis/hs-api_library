const puppeteer = require('puppeteer');
const fs = require('fs');

const urls = [
'https://developers.hubspot.com/docs/reference/api/overview',
'https://developers.hubspot.com/docs/reference/api/analytics-and-events/custom-events/custom-event-completions',
'https://developers.hubspot.com/docs/reference/api/analytics-and-events/custom-events/custom-event-definitions',
'https://developers.hubspot.com/docs/reference/api/analytics-and-events/email-analytics',
'https://developers.hubspot.com/docs/reference/api/analytics-and-events/event-analytics',
'https://developers.hubspot.com/docs/reference/api/analytics-and-events/reporting',
'https://developers.hubspot.com/docs/reference/api/analytics-and-events/cookie-banner/cookie-banner-api',
'https://developers.hubspot.com/docs/reference/api/analytics-and-events/cookie-banner/google-consent-mode',
'https://developers.hubspot.com/docs/reference/api/analytics-and-events/tracking-code',
'https://developers.hubspot.com/docs/reference/api/app-management/feature-flags',
'https://developers.hubspot.com/docs/reference/api/app-management/oauth',
'https://developers.hubspot.com/docs/reference/api/app-management/webhooks',
'https://developers.hubspot.com/docs/reference/api/automation/create-manage-workflows',
'https://developers.hubspot.com/docs/reference/api/automation/custom-workflow-actions',
'https://developers.hubspot.com/docs/reference/api/automation/custom-code-actions',
'https://developers.hubspot.com/docs/reference/api/automation/sequences',
'https://developers.hubspot.com/docs/reference/api/cms/blogs/blog-details',
'https://developers.hubspot.com/docs/reference/api/cms/blogs/blog-authors',
'https://developers.hubspot.com/docs/reference/api/cms/blogs/blog-posts',
'https://developers.hubspot.com/docs/reference/api/cms/blogs/blog-tags',
'https://developers.hubspot.com/docs/reference/api/cms/blogs/blog-topics',
'https://developers.hubspot.com/docs/reference/api/cms/blogs/blog-comments',
'https://developers.hubspot.com/docs/reference/api/cms/content-audit',
'https://developers.hubspot.com/docs/reference/api/cms/domains',
'https://developers.hubspot.com/docs/reference/api/cms/hubdb',
'https://developers.hubspot.com/docs/reference/api/cms/layouts',
'https://developers.hubspot.com/docs/reference/api/cms/media-bridge',
'https://developers.hubspot.com/docs/reference/api/cms/modules',
'https://developers.hubspot.com/docs/reference/api/cms/pages',
'https://developers.hubspot.com/docs/reference/api/cms/site-search',
'https://developers.hubspot.com/docs/reference/api/cms/source-code',
'https://developers.hubspot.com/docs/reference/api/cms/templates',
'https://developers.hubspot.com/docs/reference/api/cms/url-redirects',
'https://developers.hubspot.com/docs/reference/api/conversations/chat-widget-sdk',
'https://developers.hubspot.com/docs/reference/api/conversations/create-custom-channels',
'https://developers.hubspot.com/docs/reference/api/conversations/inbox-and-messages',
'https://developers.hubspot.com/docs/reference/api/conversations/visitor-identification',
'https://developers.hubspot.com/docs/reference/api/crm/associations/association-details',
'https://developers.hubspot.com/docs/reference/api/crm/associations/associations-schema',
'https://developers.hubspot.com/docs/reference/api/crm/commerce/carts',
'https://developers.hubspot.com/docs/reference/api/crm/commerce/discounts',
'https://developers.hubspot.com/docs/reference/api/crm/commerce/fees',
'https://developers.hubspot.com/docs/reference/api/crm/commerce/invoices',
'https://developers.hubspot.com/docs/reference/api/crm/commerce/orders',
'https://developers.hubspot.com/docs/reference/api/crm/commerce/payments',
'https://developers.hubspot.com/docs/reference/api/crm/commerce/quotes',
'https://developers.hubspot.com/docs/reference/api/crm/commerce/subscriptions',
'https://developers.hubspot.com/docs/reference/api/crm/commerce/taxes',
'https://developers.hubspot.com/docs/reference/api/crm/engagements/engagement-details',
'https://developers.hubspot.com/docs/reference/api/crm/engagements/calls',
'https://developers.hubspot.com/docs/reference/api/crm/engagements/communications',
'https://developers.hubspot.com/docs/reference/api/crm/engagements/email',
'https://developers.hubspot.com/docs/reference/api/crm/engagements/meetings',
'https://developers.hubspot.com/docs/reference/api/crm/engagements/notes',
'https://developers.hubspot.com/docs/reference/api/crm/engagements/postal-mail',
'https://developers.hubspot.com/docs/reference/api/crm/engagements/tasks',
'https://developers.hubspot.com/docs/reference/api/crm/extensions/calling-sdk',
'https://developers.hubspot.com/docs/reference/api/crm/extensions/crm-cards',
'https://developers.hubspot.com/docs/reference/api/crm/extensions/extension-details',
'https://developers.hubspot.com/docs/reference/api/crm/extensions/timeline',
'https://developers.hubspot.com/docs/reference/api/crm/extensions/video-conferencing',
'https://developers.hubspot.com/docs/reference/api/crm/contacts-timeline-embed',
'https://developers.hubspot.com/docs/reference/api/crm/exports',
'https://developers.hubspot.com/docs/reference/api/crm/imports',
'https://developers.hubspot.com/docs/reference/api/crm/lists',
'https://developers.hubspot.com/docs/reference/api/crm/owners',
'https://developers.hubspot.com/docs/reference/api/crm/pipelines',
'https://developers.hubspot.com/docs/reference/api/crm/properties',
'https://developers.hubspot.com/docs/reference/api/crm/sensitive-data',
'https://developers.hubspot.com/docs/reference/api/crm/limits-tracking',
'https://developers.hubspot.com/docs/reference/api/library/files',
'https://developers.hubspot.com/docs/reference/api/library/meetings',
'https://developers.hubspot.com/docs/reference/api/marketing/calls-to-action-sdk',
'https://developers.hubspot.com/docs/reference/api/marketing/campaigns',
'https://developers.hubspot.com/docs/reference/api/marketing/emails/marketing-emails',
'https://developers.hubspot.com/docs/reference/api/marketing/emails/single-send-api',
'https://developers.hubspot.com/docs/reference/api/marketing/emails/transactional-emails',
'https://developers.hubspot.com/docs/reference/api/marketing/forms',
'https://developers.hubspot.com/docs/reference/api/marketing/marketing-events',
'https://developers.hubspot.com/docs/reference/api/marketing/subscriptions',
'https://developers.hubspot.com/docs/reference/api/marketing/subscriptions-preferences',
'https://developers.hubspot.com/docs/reference/api/settings/account-activity-api',
'https://developers.hubspot.com/docs/reference/api/settings/account-information-api',
'https://developers.hubspot.com/docs/reference/api/settings/business-units-api',
'https://developers.hubspot.com/docs/reference/api/settings/currencies',
'https://developers.hubspot.com/docs/reference/api/other-resources/error-handling',
'https://developers.hubspot.com/docs/getting-started',
'https://developers.hubspot.com/docs/getting-started/overview',
'https://developers.hubspot.com/docs/getting-started/what-to-build',
'https://developers.hubspot.com/docs/getting-started/tools-to-help-you-build',
'https://developers.hubspot.com/docs/getting-started/account-types',
'https://developers.hubspot.com/docs/getting-started/slack/developer-slack',
'https://developers.hubspot.com/docs/guides',
'https://developers.hubspot.com/docs/guides/api',
'https://developers.hubspot.com/docs/guides/apps',
'https://developers.hubspot.com/docs/guides/cms',
'https://developers.hubspot.com/docs/guides/crm',
'https://developers.hubspot.com/docs/reference'
];

const tagsToExtract = ['h1', 'h2', 'h3', 'h4', 'h5', 'p'];

async function scrapeUrl(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  try {
    await page.goto(url, { waitUntil: 'networkidle2' });
    
    const extractedContent = await page.evaluate((tags) => {
      // Get all elements matching our tags and extract their text content
      const elements = document.querySelectorAll(tags.join(','));
      
      // Convert elements to array and map to just their text content
      const textContent = Array.from(elements)
        .map(element => element.textContent.trim())
        .filter(text => text.length > 0) // Remove empty strings
        .join('\n\n'); // Join with double newlines for readability
        
      return textContent;
    }, tagsToExtract);

    await browser.close();
    return extractedContent;
  } catch (error) {
    console.error(`Error scraping ${url}: ${error.message}`);
    await browser.close();
    return null;
  }
}

async function scrapeAllUrls() {
  const results = [];
  for (const url of urls) {
    const content = await scrapeUrl(url);
    if (content) {
      results.push({
        url,
        content
      });
    }
  }
  return results;
}

scrapeAllUrls().then((results) => {
  const jsonOutput = JSON.stringify(results, null, 2);
  fs.writeFile('CONTENT_DUMP.json', jsonOutput, 'utf8', (err) => {
    if (err) {
      console.error('Error writing to file:', err);
    } else {
      console.log('Scraped content has been saved to CONTENT_DUMP.json');
    }
  });
}).catch((error) => {
  console.error('An error occurred:', error);
});