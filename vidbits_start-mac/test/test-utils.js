const {jsdom} = require('jsdom');
const Video = require('../models/video');

// Create and return a sample Item object
const buildVideoObject = (options = {}) => {
  const title = options.title || 'My favorite item';
  const description = options.description || 'Just the best item';
  const url = options.url || 'http://placebear.com/g/200/300';
  return {title, description, url};
};

// Add a sample Video object to mongodb
const seedItemToDatabase = async (options = {}) => {
  const item = await Video.create(buildVideoObject(options));
  return item;
};

// extract text from an Element by selector.
const parseTextFromHTML = (htmlAsString, selector) => {
  const selectedElement = jsdom(htmlAsString).querySelector(selector);
  if (selectedElement !== null) {
    return selectedElement.textContent;
  } else {
    throw new Error(`No element with selector ${selector} found in HTML string`);
  }
};

module.exports = {
  buildVideoObject,
  parseTextFromHTML,
  seedItemToDatabase
};
