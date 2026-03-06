-- Migration: Add Couples AB Challenge support

-- ─── Expand CHECK constraints ────────────────────────────────────────────────

-- profiles
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_trainer_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_trainer_check
  CHECK (trainer IN ('mark', 'sommer', 'couples'));

ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_tier_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_tier_check
  CHECK (tier IN ('30', '60', '90', 'ab'));

-- workouts
ALTER TABLE workouts DROP CONSTRAINT IF EXISTS workouts_trainer_check;
ALTER TABLE workouts ADD CONSTRAINT workouts_trainer_check
  CHECK (trainer IN ('mark', 'sommer', 'couples'));

ALTER TABLE workouts DROP CONSTRAINT IF EXISTS workouts_tier_check;
ALTER TABLE workouts ADD CONSTRAINT workouts_tier_check
  CHECK (tier IN ('30', '60', '90', 'ab'));

-- user_plans
ALTER TABLE user_plans DROP CONSTRAINT IF EXISTS user_plans_trainer_check;
ALTER TABLE user_plans ADD CONSTRAINT user_plans_trainer_check
  CHECK (trainer IN ('mark', 'sommer', 'couples'));

ALTER TABLE user_plans DROP CONSTRAINT IF EXISTS user_plans_tier_check;
ALTER TABLE user_plans ADD CONSTRAINT user_plans_tier_check
  CHECK (tier IN ('30', '60', '90', 'ab'));

-- ─── Couples AB Challenge — Workouts (Days 1–21) ─────────────────────────────

INSERT INTO workouts (id, trainer, tier, day_number, title, description) VALUES
  ('00000000-0000-0000-0000-000000000021', 'couples', 'ab', 1,  'Core Activation Together',     'Kick off your couples challenge — wake up the core with the fundamentals.'),
  ('00000000-0000-0000-0000-000000000022', 'couples', 'ab', 2,  'Plank Partner Challenge',      'Back-to-back and side-by-side plank variations to build deep core strength.'),
  ('00000000-0000-0000-0000-000000000023', 'couples', 'ab', 3,  'Core Cardio Burn',             'Elevate the heart rate and torch the core at the same time.'),
  ('00000000-0000-0000-0000-000000000024', 'couples', 'ab', 4,  'Lower Ab Focus',               'Targeted lower abdominal work — the toughest spot, done together.'),
  ('00000000-0000-0000-0000-000000000025', 'couples', 'ab', 5,  'Oblique & Side Core',          'Sculpt the sides. Oblique-focused circuit for defined waistlines.'),
  ('00000000-0000-0000-0000-000000000026', 'couples', 'ab', 6,  'Full Core Burnout',            'Every angle covered — front, sides, lower, and deep stability.'),
  ('00000000-0000-0000-0000-000000000027', 'couples', 'ab', 7,  'Active Recovery & Stretch',    'Breathe, stretch, and reset together. Your core will thank you.')
ON CONFLICT DO NOTHING;

-- ─── Exercises ───────────────────────────────────────────────────────────────

-- Day 1: Core Activation Together
INSERT INTO exercises (workout_id, name, sets, reps, notes, order_index, video_url) VALUES
  ('00000000-0000-0000-0000-000000000021', 'Dead Bug',              3, '10 each side',   'Press lower back into floor. Move opposite arm & leg.', 1, '/videos/workout3.mp4'),
  ('00000000-0000-0000-0000-000000000021', 'Hollow Body Hold',      3, '20-30 sec',       'Flatten lower back, arms overhead, legs slightly raised.', 2, '/videos/workout3.mp4'),
  ('00000000-0000-0000-0000-000000000021', 'Glute Bridge',          3, '15',              'Feet flat, drive hips up, squeeze at top for 2 sec.', 3, '/videos/workout3.mp4'),
  ('00000000-0000-0000-0000-000000000021', 'Plank Hold',            3, '30 sec',          'Elbows under shoulders, body in a straight line.', 4, '/videos/workout3.mp4'),
  ('00000000-0000-0000-0000-000000000021', 'Bird Dog',              3, '10 each side',   'On all fours — extend opposite arm & leg, pause 2 sec.', 5, '/videos/workout3.mp4')
ON CONFLICT DO NOTHING;

-- Day 2: Plank Partner Challenge
INSERT INTO exercises (workout_id, name, sets, reps, notes, order_index, video_url) VALUES
  ('00000000-0000-0000-0000-000000000022', 'Side Plank Hold',                3, '30 sec each side', 'Stack feet or stagger. Keep hips lifted.', 1, '/videos/workout3.mp4'),
  ('00000000-0000-0000-0000-000000000022', 'Plank Shoulder Taps',            3, '10 each side',     'Minimize hip rotation — slow and controlled.', 2, '/videos/workout3.mp4'),
  ('00000000-0000-0000-0000-000000000022', 'Plank Hip Dips',                 3, '12 each side',     'From forearm plank, rotate hips side to side.', 3, '/videos/workout3.mp4'),
  ('00000000-0000-0000-0000-000000000022', 'Plank to Downward Dog',          3, '10',               'Shift back into down dog, then forward to plank.', 4, '/videos/workout3.mp4'),
  ('00000000-0000-0000-0000-000000000022', 'Extended Plank Hold',            2, '30-45 sec',        'Arms fully extended. Push the ground away from you.', 5, '/videos/workout3.mp4')
ON CONFLICT DO NOTHING;

-- Day 3: Core Cardio Burn
INSERT INTO exercises (workout_id, name, sets, reps, notes, order_index, video_url) VALUES
  ('00000000-0000-0000-0000-000000000023', 'Mountain Climbers',        4, '30 sec',          'Fast pace. Drive knees to chest alternating.', 1, '/videos/workout3.mp4'),
  ('00000000-0000-0000-0000-000000000023', 'Burpee to Tuck Jump',      3, '8',               'Full burpee, then explode up into tuck jump.', 2, '/videos/workout3.mp4'),
  ('00000000-0000-0000-0000-000000000023', 'V-Ups',                    3, '12',              'Legs and torso meet at the top. Controlled descent.', 3, '/videos/workout3.mp4'),
  ('00000000-0000-0000-0000-000000000023', 'Flutter Kicks',            3, '30 sec',          'Small fast kicks just off the floor. Lower back stays down.', 4, '/videos/workout3.mp4'),
  ('00000000-0000-0000-0000-000000000023', 'High Knees',               3, '30 sec',          'Drive knees to hip height. Pump arms.', 5, '/videos/workout3.mp4')
ON CONFLICT DO NOTHING;

-- Day 4: Lower Ab Focus
INSERT INTO exercises (workout_id, name, sets, reps, notes, order_index, video_url) VALUES
  ('00000000-0000-0000-0000-000000000024', 'Lying Leg Raises',         4, '12',              'Keep lower back pressed down. Lower legs slowly.', 1, '/videos/workout3.mp4'),
  ('00000000-0000-0000-0000-000000000024', 'Reverse Crunch',           3, '15',              'Drive knees toward chest, tilt pelvis up.', 2, '/videos/workout3.mp4'),
  ('00000000-0000-0000-0000-000000000024', 'Dead Bug (weighted)',       3, '8 each side',    'Hold a light dumbbell overhead for extra challenge.', 3, '/videos/workout3.mp4'),
  ('00000000-0000-0000-0000-000000000024', 'Dragon Flag Negatives',    3, '5',               'Slowly lower your body from vertical to horizontal.', 4, '/videos/workout3.mp4'),
  ('00000000-0000-0000-0000-000000000024', 'Scissor Kicks',            3, '20 total',        'Alternate legs in opposing directions, keep core braced.', 5, '/videos/workout3.mp4')
ON CONFLICT DO NOTHING;

-- Day 5: Oblique & Side Core
INSERT INTO exercises (workout_id, name, sets, reps, notes, order_index, video_url) VALUES
  ('00000000-0000-0000-0000-000000000025', 'Russian Twists',           4, '15 each side',   'Lean back 45°, feet raised, twist with control.', 1, '/videos/workout3.mp4'),
  ('00000000-0000-0000-0000-000000000025', 'Side Plank Hip Dips',      3, '12 each side',   'From side plank, dip hip toward floor and return.', 2, '/videos/workout3.mp4'),
  ('00000000-0000-0000-0000-000000000025', 'Bicycle Crunches',         3, '15 each side',   'Slow tempo — touch elbow to opposite knee.', 3, '/videos/workout3.mp4'),
  ('00000000-0000-0000-0000-000000000025', 'Standing Oblique Crunches',3, '12 each side',   'Hands behind head, knee to same elbow.', 4, '/videos/workout3.mp4'),
  ('00000000-0000-0000-0000-000000000025', 'Woodchoppers (DB)',         3, '10 each side',   'Dumbbell sweeps diagonally from hip to opposite shoulder.', 5, '/videos/workout3.mp4')
ON CONFLICT DO NOTHING;

-- Day 6: Full Core Burnout
INSERT INTO exercises (workout_id, name, sets, reps, notes, order_index, video_url) VALUES
  ('00000000-0000-0000-0000-000000000026', 'Ab Circuit — Crunches',        3, '20',              'Classic crunch. Quality over speed.', 1, '/videos/workout3.mp4'),
  ('00000000-0000-0000-0000-000000000026', 'Ab Circuit — Reverse Crunch',  3, '15',              'Hip tilt crunch — lower abs.', 2, '/videos/workout3.mp4'),
  ('00000000-0000-0000-0000-000000000026', 'Ab Circuit — Bicycle',         3, '15 each side',   'Obliques. Slow and deliberate.', 3, '/videos/workout3.mp4'),
  ('00000000-0000-0000-0000-000000000026', 'Ab Circuit — Leg Raises',      3, '12',              'Lower ab finisher.', 4, '/videos/workout3.mp4'),
  ('00000000-0000-0000-0000-000000000026', 'Plank Hold — Max Effort',       2, 'Max',             'Hold until form breaks. Push your limit.', 5, '/videos/workout3.mp4')
ON CONFLICT DO NOTHING;

-- Day 7: Active Recovery & Stretch
INSERT INTO exercises (workout_id, name, sets, reps, notes, order_index, video_url) VALUES
  ('00000000-0000-0000-0000-000000000027', 'Child''s Pose',                2, '60 sec',          'Arms extended, sink hips back. Breathe deeply.', 1, '/videos/workout3.mp4'),
  ('00000000-0000-0000-0000-000000000027', 'Cat-Cow Stretch',              2, '10 reps',         'Slow and rhythmic with your breathing.', 2, '/videos/workout3.mp4'),
  ('00000000-0000-0000-0000-000000000027', 'Lying Spinal Twist',           2, '45 sec each side','Knees stacked, rotate toward floor.', 3, '/videos/workout3.mp4'),
  ('00000000-0000-0000-0000-000000000027', 'Hip Flexor Stretch',           2, '30 sec each side','Lunge position, push hips forward.', 4, '/videos/workout3.mp4'),
  ('00000000-0000-0000-0000-000000000027', 'Diaphragmatic Breathing',      1, '5 min',           'Lie flat, hand on belly. Deep slow breaths. You earned it.', 5, '/videos/workout3.mp4')
ON CONFLICT DO NOTHING;
