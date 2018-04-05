const {assert} = require('chai');
const {buildVideoObject} = require('../test-utils');

describe('User visiting new videos page', () => {
  describe('submit a new video', () => {
    it('is rendered', () => {
      const video = buildVideoObject();
      browser.url('/videos/create');
      browser.setValue('#title-input', video.title);
      browser.setValue('#url-input', video.url);
      browser.click('#submit-button');
      assert.include(browser.getText('body'), video.title);
    });
  });
});
