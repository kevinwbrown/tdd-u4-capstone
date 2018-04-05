const {assert} = require('chai');
const request = require('supertest');
const app = require('../../app');
const {connectDatabase, disconnectDatabase} = require('../database-utilities');
const {buildVideoObject, seedItemToDatabase, parseTextFromHTML} = require('../test-utils');
const Video = require('../../models/video');

describe('Server path: /videos', () => {
  beforeEach(connectDatabase);
  afterEach(disconnectDatabase);

  describe('GET', () => {
    it('renders existing Videos', async () => {
      const video = await seedItemToDatabase();
      const response = await request(app)
        .get('/');
      assert.include(parseTextFromHTML(response.text, `.video-title`), video.title);
    });
  });

  describe('POST', () => {
    it('responds with a 302 status code', async () => {
      const video = buildVideoObject();
      const response = await request(app)
        .post('/videos')
        .type('form')
        .send(video);
      assert.equal(response.status, 302);
    });

    it('redirects to the new Video show page', async () => {
      const video = buildVideoObject();
      const response = await request(app)
        .post('/videos')
        .type('form')
        .send(video);
      assert.include(response.text, video.title);
    });

    it('saves a Video document', async () => {
      const video = buildVideoObject();
      const response = await request(app)
        .post('/videos')
        .type('form')
        .send(video);
      const foundVideo = await Video.findOne(video);
      assert.equal(foundVideo.title, video.title);
      assert.equal(foundVideo.description, video.description);
      assert.equal(foundVideo.url, video.url);
      assert.isOk(foundVideo, 'Video was not created in the database.');
    });

    describe('when the title is missing', () => {
      it('does not save the Video', async () => {
        const video = {'title' : ''};
        const response = await request(app)
          .post('/videos')
          .type('form')
          .send(video);
        const videos = await Video.find({});
        assert.equal(videos.length, 0);
      });

      it('responds with a 400', async () => {
        const video = {'title' : ''};
        const response = await request(app)
          .post('/videos')
          .type('form')
          .send(video)
          assert(response.status, 400);
      });

      it('renders the video form', async() => {
        const item = {'title' : ''};
        const response = await request(app)
          .post('/videos')
          .type('form')
          .send(item)
        assert.include(response.text, 'Save a video');
      });

      it('renders the validation error message', async() => {
        const video = {'title' : ''};
        const response = await request(app)
          .post('/videos')
          .type('form')
          .send(video)
        assert.include(parseTextFromHTML(response.text, 'form'), '`title` is required');
      });

      it('preserves the other fields', async () => {
        const description = 'Test Description';
        const url = 'http://www.testurl.com';
        const video = {title : '', description: description, url: url};
        const response = await request(app)
          .post('/videos')
          .type('form')
          .send(video)
        assert.include(parseTextFromHTML(response.text, '#description-input'), description);
        assert.include(response.text, url);
      });
    });

    describe('when the url is missing', () => {
      it('renders the validation error message', async() => {
        const video = {'title' : 'test', 'url' : ''};
        const response = await request(app)
          .post('/videos')
          .type('form')
          .send(video)
        assert.include(parseTextFromHTML(response.text, 'form'), '`url` is required');
      });

      it('preserves the other fields', async () => {
        const video = buildVideoObject();
        video.url = '';
        const response = await request(app)
          .post('/videos')
          .type('form')
          .send(video)
        assert.include(response.text, video.title);
        assert.include(parseTextFromHTML(response.text, '#description-input'), video.description);
      });
    });
  });
});

describe('Server path: /videos/:id', () => {
    beforeEach(connectDatabase);
    afterEach(disconnectDatabase);

    describe('GET', () => {
      it('renders the Video', async () => {
        const video = await seedItemToDatabase();
        const response = await request(app)
          .get('/videos/' + video._id);
        assert.include(response.text, video.title);
        assert.include(response.text, video.url);
      });
    });
});

describe('Server path: /videos/:id/edit', () => {
    beforeEach(connectDatabase);
    afterEach(disconnectDatabase);

    describe('GET', () => {
      it('renders a form for the Video', async () => {
        const video = await seedItemToDatabase();
        const response = await request(app)
          .get('/videos/' + video._id + '/edit');
        assert.include(response.text, video.title);
        assert.include(response.text, video.url);
      });
    });
});

describe('Server path: /videos/:id/updates', () => {
    beforeEach(connectDatabase);
    afterEach(disconnectDatabase);

    describe('POST', () => {
      it('updates the record', async () => {
        const video = await seedItemToDatabase();
        const newTitle = 'new title';
        const updatedVideo = {title: newTitle, description: video.description, url: video.url};
        const response = await request(app)
          .post('/videos/' + video._id + '/updates')
          .type('form')
          .send(updatedVideo);
        assert.include(response.text, newTitle);
      });

      it('redirects to the show page', async () => {
        const video = await seedItemToDatabase();
        const newTitle = 'new title';
        const updatedVideo = {title: newTitle, description: video.description, url: video.url};
        const response = await request(app)
          .post('/videos/' + video._id + '/updates')
          .type('form')
          .send(updatedVideo);
        assert.equal(response.status, 302);
        assert.include(response.text, 'Edit video');
      });

      describe('when the record is invalid', () => {
        it('does not save the record', async () => {
          const video = await seedItemToDatabase();
          const updatedVideo = {title: '', description: video.description, url: video.url};
          const response = await request(app)
            .post('/videos/' + video._id + '/updates')
            .type('form')
            .send(updatedVideo);
          assert.include(parseTextFromHTML(response.text, 'form'), '`title` is required');
        });

        it('responds with a 400', async () => {
          const video = await seedItemToDatabase();
          const updatedVideo = {title: '', description: video.description, url: video.url};
          const response = await request(app)
            .post('/videos/' + video._id + '/updates')
            .type('form')
            .send(updatedVideo);
            assert(response.status, 400);
        });

        it ('renders the Edit form', async () => {
          const video = await seedItemToDatabase();
          const updatedVideo = {title: '', description: video.description, url: video.url};
          const response = await request(app)
            .post('/videos/' + video._id + '/updates')
            .type('form')
            .send(updatedVideo);
          assert.include(response.text, 'Edit a video');
        });
      });
    });
});

describe('Server path: /videos/:id/deletions', () => {
    beforeEach(connectDatabase);
    afterEach(disconnectDatabase);

    describe('POST', () => {
      it('removes the record', async () => {
        const video = await seedItemToDatabase();
        const response = await request(app)
          .post('/videos/' + video._id + '/deletions')
          .type('form')
        const foundVideo = await Video.findById(video._id);
        assert.isNull(foundVideo);
      });

      it('redirects to the landing page', async () => {
        const video = await seedItemToDatabase();
        const response = await request(app)
          .post('/videos/' + video._id + '/deletions')
          .type('form')
        const foundVideo = await Video.findById(video._id);
        const videoContainer = parseTextFromHTML(response.text, '#videos-container');
        assert.equal(response.status, 302);
        assert.isNotNull(videoContainer);
      });
    });
});
