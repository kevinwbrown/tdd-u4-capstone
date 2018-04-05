const router = require('express').Router();
const Video = require('../models/video');

router.get('/', async (req, res, next) => {
  const videos = await Video.find({});
  res.render('videos/index', {videos});
});

router.post('/videos', async (req, res, next) => {
  const {title, description, url} = req.body;
  const video = Video({title, description, url});
  video.validateSync();
  if (video.errors) {
    res.status(400).render('videos/create', {video});
  } else {
    await video.save();
    res.status(302).render('videos/show', {video});
  }
});

router.get('/videos/create', async (req, res, next) => {
  res.render('videos/create');
});

router.get('/videos/:id', async (req, res, next) => {
  const id = req.params.id;
  const video = await Video.findById(id);
  res.render('videos/show', {video});
});

router.get('/videos/:id/edit', async (req, res, next) => {
  const id = req.params.id;
  const video = await Video.findById(id);
  res.render('videos/edit', {video});
});

router.post('/videos/:id/updates', async (req, res, next) => {
  const {title, description, url} = req.body;
  const id = req.params.id;
  const video = await Video.findById(id);
  video.title = title;
  video.description = description;
  video.url = url;
  video.validateSync();
  if (video.errors) {
    res.status(400).render('videos/edit', {video});
  } else {
    await video.save();
    res.status(302).render('videos/show', {video});
  }
});

router.post('/videos/:id/deletions', async (req, res, next) => {
  const id = req.params.id;
  const video = await Video.findById(id);
  await video.remove();
  const videos = await Video.find({});
  res.status(302).render('videos/index', {videos});
});

module.exports = router;
