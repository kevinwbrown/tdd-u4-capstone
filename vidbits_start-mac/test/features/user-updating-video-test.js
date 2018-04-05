const {assert} = require('chai');
const {buildVideoObject} = require('../test-utils');

describe('User updating video', () => {
  describe('changes the values', () => {
    it('is rendered', () => {
      const video = buildVideoObject();
      browser.url('/videos/create');
      browser.setValue('#title-input', video.title);
      browser.setValue('#description-input', video.description);
      browser.setValue('#url-input', video.url);
      browser.click('#submit-button');
      browser.click('#edit-button');
      browser.setValue('#title-input', 'new title');
      browser.click('#submit-button');
      assert.include(browser.getText('body'), 'new title');
    });

    it('does not create an additional video', () => {
      const video = buildVideoObject();
      browser.url('/videos/create');
      browser.setValue('#title-input', video.title);
      browser.setValue('#description-input', video.description);
      browser.setValue('#url-input', video.url);
      browser.click('#submit-button');
      browser.click('#edit-button');
      browser.setValue('#title-input', 'new title');
      browser.click('#submit-button');
      browser.url('/');
      assert.notInclude(browser.getText('body'), video.title);
    });
  });
});
