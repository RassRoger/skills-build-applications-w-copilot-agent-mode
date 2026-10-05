import { Router } from 'express';
import { Types } from 'mongoose';
import Activity from '../models/activity.js';
import Leaderboard from '../models/leaderboard.js';
import Team from '../models/team.js';
import User from '../models/user.js';
import Workout from '../models/workout.js';

const router = Router();

router.get('/api/users/', async (_request, response) => {
  response.json(await User.find().populate('team'));
});
router.post('/api/users/', async (request, response) => {
  response.status(201).json(await User.create(request.body));
});

router.get('/api/teams/', async (_request, response) => {
  response.json(await Team.find().populate('members'));
});
router.post('/api/teams/', async (request, response) => {
  response.status(201).json(await Team.create(request.body));
});

router.get('/api/activities/', async (request, response) => {
  const userId = request.query.user;
  if (typeof userId === 'string' && !Types.ObjectId.isValid(userId)) {
    response.status(400).json({ error: 'user must be a valid ID' });
    return;
  }

  const filter = typeof userId === 'string' ? { user: new Types.ObjectId(userId) } : {};
  response.json(await Activity.find(filter).populate('user'));
});
router.post('/api/activities/', async (request, response) => {
  response.status(201).json(await Activity.create(request.body));
});

router.get('/api/leaderboard/', async (_request, response) => {
  response.json(await Leaderboard.find().sort({ points: -1 }).populate('user team'));
});

router.get('/api/workouts/', async (request, response) => {
  const filter = typeof request.query.goal === 'string' ? { goal: request.query.goal } : {};
  response.json(await Workout.find(filter));
});

export default router;
