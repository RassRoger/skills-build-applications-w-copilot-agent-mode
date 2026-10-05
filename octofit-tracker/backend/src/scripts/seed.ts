import mongoose from 'mongoose';
import { connectDatabase } from '../config/database.js';
import Activity from '../models/activity.js';
import Leaderboard from '../models/leaderboard.js';
import Team from '../models/team.js';
import User from '../models/user.js';
import Workout from '../models/workout.js';

/**
 * Seed the octofit_db database with test data
 */
async function seedDatabase(): Promise<void> {
  await connectDatabase();

  try {
    const userSeeds = [
      { name: 'Avery Chen', email: 'avery.chen@example.com', age: 29, fitnessGoal: 'Build endurance' },
      { name: 'Jordan Patel', email: 'jordan.patel@example.com', age: 34, fitnessGoal: 'Improve strength' },
      { name: 'Morgan Rivera', email: 'morgan.rivera@example.com', age: 26, fitnessGoal: 'Build endurance' },
      { name: 'Casey Thompson', email: 'casey.thompson@example.com', age: 31, fitnessGoal: 'Stay active' },
    ];
    const users = await Promise.all(
      userSeeds.map(async (seed) => {
        const existingUser = await User.findOne({ email: seed.email });
        if (existingUser) {
          existingUser.set(seed);
          return existingUser.save();
        }
        return User.create(seed);
      }),
    );

    const teamSeeds = [
      { name: 'Trailblazers', description: 'Building endurance one mile at a time.' },
      { name: 'Power Pioneers', description: 'Getting stronger through consistent training.' },
    ];
    const teams = await Promise.all(
      teamSeeds.map(async (seed) => {
        const existingTeam = await Team.findOne({ name: seed.name });
        if (existingTeam) {
          existingTeam.set(seed);
          return existingTeam.save();
        }
        return Team.create(seed);
      }),
    );

    const userTeams = new Map([
      [userSeeds[0].email, teams[0]],
      [userSeeds[1].email, teams[1]],
      [userSeeds[2].email, teams[0]],
      [userSeeds[3].email, teams[1]],
    ]);

    await Promise.all(
      users.map(async (user) => {
        const team = userTeams.get(user.email);
        if (!team) {
          throw new Error(`No seed team configured for ${user.email}`);
        }
        user.team = team._id;
        await user.save();
      }),
    );

    await Promise.all(
      teams.map((team) => {
        const members = users
          .filter((user) => userTeams.get(user.email)?._id.equals(team._id))
          .map((user) => user._id);
        team.members = members;
        return team.save();
      }),
    );

    const activitySeeds = [
      { user: users[0]._id, type: 'Running', durationMinutes: 35, calories: 310, date: new Date('2026-10-01T07:00:00.000Z') },
      { user: users[1]._id, type: 'Strength training', durationMinutes: 45, calories: 280, date: new Date('2026-10-01T17:30:00.000Z') },
      { user: users[2]._id, type: 'Cycling', durationMinutes: 50, calories: 420, date: new Date('2026-10-02T08:15:00.000Z') },
      { user: users[3]._id, type: 'Yoga', durationMinutes: 30, calories: 130, date: new Date('2026-10-02T18:00:00.000Z') },
    ];
    await Promise.all(
      activitySeeds.map(async (seed) => {
        const existingActivity = await Activity.findOne({ user: seed.user, type: seed.type, date: seed.date });
        if (existingActivity) {
          existingActivity.set(seed);
          return existingActivity.save();
        }
        return Activity.create(seed);
      }),
    );

    const leaderboardSeeds = [
      { user: users[0]._id, team: teams[0]._id, points: 420 },
      { user: users[1]._id, team: teams[1]._id, points: 360 },
      { user: users[2]._id, team: teams[0]._id, points: 510 },
      { user: users[3]._id, team: teams[1]._id, points: 290 },
    ];
    await Promise.all(
      leaderboardSeeds.map(async (seed) => {
        const existingEntry = await Leaderboard.findOne({ user: seed.user });
        if (existingEntry) {
          existingEntry.set(seed);
          return existingEntry.save();
        }
        return Leaderboard.create(seed);
      }),
    );

    const workoutSeeds = [
      {
        title: 'Steady-State Run',
        description: 'A comfortable paced run to build aerobic endurance.',
        goal: 'Build endurance',
        difficulty: 'beginner' as const,
        durationMinutes: 30,
      },
      {
        title: 'Full-Body Strength',
        description: 'A balanced strength session covering major muscle groups.',
        goal: 'Improve strength',
        difficulty: 'intermediate' as const,
        durationMinutes: 45,
      },
      {
        title: 'Daily Mobility Flow',
        description: 'A gentle sequence of mobility and flexibility exercises.',
        goal: 'Stay active',
        difficulty: 'beginner' as const,
        durationMinutes: 20,
      },
    ];
    await Promise.all(
      workoutSeeds.map(async (seed) => {
        const existingWorkout = await Workout.findOne({ title: seed.title });
        if (existingWorkout) {
          existingWorkout.set(seed);
          return existingWorkout.save();
        }
        return Workout.create(seed);
      }),
    );

    console.log('Seeded 4 users, 2 teams, 4 activities, 4 leaderboard entries, and 3 workouts.');
  } finally {
    await mongoose.disconnect();
  }
}

seedDatabase().catch((error: unknown) => {
  console.error('Error seeding database:', error);
  process.exitCode = 1;
});
