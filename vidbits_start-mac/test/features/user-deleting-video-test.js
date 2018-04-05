const {assert} = require('chai');
const {buildVideoObject} = require('../test-utils');

describe('User deleting video', () => {
  describe('removes the Video from the list', () => {
    it('is rendered', () => {
      const video = buildVideoObject();
      browser.url('/videos/create');
      browser.setValue('#title-input', video.title);
      browser.setValue('#url-input', video.url);
      browser.click('#submit-button');
      browser.click('#delete-button');
      assert.notInclude(browser.getText('#videos-container'), video.title);
    });
  });
});
