const {assert} = require('chai');
const {buildVideoObject} = require('../test-utils');

// The course had me create this, but it wasn't clear to me
// where it wanted me to make use of it or why.
const generateRandomUrl = (domain) => {
  return `http://${domain}/${Math.random()}`;
};

describe('User visiting landing page', () => {
  describe('can navigate to', () => {
    it('add a video', () => {
      browser.url('/');
      browser.click('a[href="/videos/create"]');
      assert.include(browser.getText('body'), 'Save a video');
    });
  });

  describe('with no existing videos', () => {
    it('shows no videos', () => {
      browser.url('/');
      assert.equal(browser.getText('#videos-container'), '');
    });
  });

  describe('with an existing video', () => {
    it('renders it in the list', () => {
      const video = buildVideoObject();
      browser.url('/videos/create');
      browser.setValue('#title-input', video.title);
      browser.setValue('#url-input', video.url);
      browser.click('#submit-button');
      browser.url('/');
      assert.include(browser.getText('#videos-container'), video.title);
    });

    it('can navigate to a video', () => {
      const video = buildVideoObject();
      browser.url('/videos/create');
      browser.setValue('#title-input', video.title);
      browser.setValue('#url-input', video.url);
      browser.click('#submit-button');
      browser.url('/');
      browser.element('a*=' + video.title).click();
      assert.include(browser.getText('body'), 'Edit video');
      assert.include(browser.getText('body'), 'Delete video');
    });
  });
});
