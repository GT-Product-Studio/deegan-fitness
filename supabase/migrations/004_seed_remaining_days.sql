-- Migration 004: Seed Days 8–30 for Mark & Sommer, Days 8–21 for Couples AB
-- UUID scheme: 00000000-0000-0000-0000-0000000010NN = Mark day NN
--              00000000-0000-0000-0000-0000000020NN = Sommer day NN
--              00000000-0000-0000-0000-0000000030NN = Couples day NN

-- ============================================================
-- MARK ESTES — Days 8–30
-- ============================================================

INSERT INTO workouts (id, trainer, tier, day_number, title, description) VALUES
  ('00000000-0000-0000-0000-000000001008','mark','30', 8, 'Lower Body Power',          'Squat-focused power session to build explosive leg strength.'),
  ('00000000-0000-0000-0000-000000001009','mark','30', 9, 'Upper Body Hypertrophy',    'High-volume chest, back, and arms for maximum muscle stimulus.'),
  ('00000000-0000-0000-0000-000000001010','mark','30',10, 'Conditioning Circuit',      'Metabolic conditioning to build endurance and burn fat.'),
  ('00000000-0000-0000-0000-000000001011','mark','30',11, 'Chest & Back Superset',     'Push and pull supersets for balanced upper body development.'),
  ('00000000-0000-0000-0000-000000001012','mark','30',12, 'Arm & Shoulder Day',        'Dedicated arm and shoulder volume to add size and definition.'),
  ('00000000-0000-0000-0000-000000001013','mark','30',13, 'Full Body HIIT',            'High-intensity full body circuit — no rest for the committed.'),
  ('00000000-0000-0000-0000-000000001014','mark','30',14, 'Rest & Mobility',           'Active recovery, foam rolling, and mobility work.'),
  ('00000000-0000-0000-0000-000000001015','mark','30',15, 'Heavy Deadlift Day',        'The king of all exercises. Build posterior chain strength.'),
  ('00000000-0000-0000-0000-000000001016','mark','30',16, 'Incline Press & Row',       'Upper body strength with incline pressing and heavy rowing.'),
  ('00000000-0000-0000-0000-000000001017','mark','30',17, 'Leg Hypertrophy',           'Volume legs — high reps, multiple angles, maximum burn.'),
  ('00000000-0000-0000-0000-000000001018','mark','30',18, 'Shoulder Complex',          'All three shoulder heads — press, raise, and rear delt work.'),
  ('00000000-0000-0000-0000-000000001019','mark','30',19, 'Biceps & Triceps',          'Dedicated arm day — curls, extensions, and isolation work.'),
  ('00000000-0000-0000-0000-000000001020','mark','30',20, 'Strongman Conditioning',   'Sled pushes, carries, and loaded conditioning. Mental toughness.'),
  ('00000000-0000-0000-0000-000000001021','mark','30',21, 'Active Recovery',           'Light movement, breathing work, and full body stretch.'),
  ('00000000-0000-0000-0000-000000001022','mark','30',22, 'Lower Body Power II',      'Back to the squat rack — heavier, harder, more focused.'),
  ('00000000-0000-0000-0000-000000001023','mark','30',23, 'Upper Body Volume',        'High-rep pump session. Chase the burn. Own the mirror.'),
  ('00000000-0000-0000-0000-000000001024','mark','30',24, 'Cardio & Core',            'Steady-state cardio paired with a punishing core circuit.'),
  ('00000000-0000-0000-0000-000000001025','mark','30',25, 'Push Strength II',         'Max effort press day. Go heavier than Week 1. Prove it.'),
  ('00000000-0000-0000-0000-000000001026','mark','30',26, 'Pull Strength II',         'Heavy rows and pull-ups. Back thickness and width.'),
  ('00000000-0000-0000-0000-000000001027','mark','30',27, 'Full Body Finisher',       'Compound movements, minimal rest. Leave nothing in the tank.'),
  ('00000000-0000-0000-0000-000000001028','mark','30',28, 'Active Recovery II',       'You earned this rest. Stretch, breathe, and prepare for the final push.'),
  ('00000000-0000-0000-0000-000000001029','mark','30',29, 'Max Effort Day',           'One more time — your best sets on your best lifts.'),
  ('00000000-0000-0000-0000-000000001030','mark','30',30, 'Day 30 — Challenge Complete','The final workout. Give everything. You started this — finish it.')
ON CONFLICT DO NOTHING;

-- Day 8: Lower Body Power
INSERT INTO exercises (workout_id, name, sets, reps, notes, order_index, video_url) VALUES
  ('00000000-0000-0000-0000-000000001008','Barbell Back Squat',        5,'5',          'Go heavy. 3 min rest between sets.', 1, '/videos/mark-workout.mp4'),
  ('00000000-0000-0000-0000-000000001008','Leg Press',                 4,'10-12',      'Feet shoulder-width, full range of motion.', 2, '/videos/mark-workout.mp4'),
  ('00000000-0000-0000-0000-000000001008','Romanian Deadlift',         4,'10',         'Feel the hamstring stretch — slow negative.', 3, '/videos/mark-workout.mp4'),
  ('00000000-0000-0000-0000-000000001008','Box Jump',                  4,'8',          'Maximum height. Stick the landing.', 4, '/videos/mark-workout.mp4'),
  ('00000000-0000-0000-0000-000000001008','Seated Calf Raise',         4,'15-20',      'Full range of motion, pause at the top.', 5, '/videos/mark-workout.mp4')
ON CONFLICT DO NOTHING;

-- Day 9: Upper Body Hypertrophy
INSERT INTO exercises (workout_id, name, sets, reps, notes, order_index) VALUES
  ('00000000-0000-0000-0000-000000001009','Flat Dumbbell Press',       4,'10-12',      'Full stretch at bottom, controlled press.', 1),
  ('00000000-0000-0000-0000-000000001009','Cable Row',                 4,'12',         'Chest to pad, squeeze at contraction.', 2),
  ('00000000-0000-0000-0000-000000001009','Incline Dumbbell Flye',     3,'12-15',      'Light weight, huge stretch.', 3),
  ('00000000-0000-0000-0000-000000001009','EZ Bar Curl',               3,'12',         'Strict form, full range of motion.', 4),
  ('00000000-0000-0000-0000-000000001009','Rope Tricep Pushdown',      3,'15',         'Spread the rope at the bottom.', 5)
ON CONFLICT DO NOTHING;

-- Day 10: Conditioning Circuit
INSERT INTO exercises (workout_id, name, sets, reps, notes, order_index) VALUES
  ('00000000-0000-0000-0000-000000001010','400m Run',                  4,'1',          'Target: sub-90 seconds per lap.', 1),
  ('00000000-0000-0000-0000-000000001010','Pull-Ups',                  4,'10',         'Dead hang start. Chin over bar.', 2),
  ('00000000-0000-0000-0000-000000001010','Push-Ups',                  4,'20',         'Chest to floor every rep.', 3),
  ('00000000-0000-0000-0000-000000001010','Air Squat',                 4,'20',         'Below parallel. No rest between movements.', 4),
  ('00000000-0000-0000-0000-000000001010','Plank Hold',                4,'60 sec',     'Perfect position. Rest 90 sec between rounds.', 5)
ON CONFLICT DO NOTHING;

-- Day 11: Chest & Back Superset
INSERT INTO exercises (workout_id, name, sets, reps, notes, order_index) VALUES
  ('00000000-0000-0000-0000-000000001011','Barbell Bench Press / Barbell Row',  4,'8 each',   'Superset: bench then row, no rest between.', 1),
  ('00000000-0000-0000-0000-000000001011','Dumbbell Incline Press / Lat Pulldown', 3,'10 each','Superset: press then pulldown.', 2),
  ('00000000-0000-0000-0000-000000001011','Cable Flye / Face Pull',     3,'12 each',   'Superset: flye then face pull for rear delts.', 3),
  ('00000000-0000-0000-0000-000000001011','Push-Ups / Inverted Row',    3,'AMRAP each','Go to failure on both movements.', 4)
ON CONFLICT DO NOTHING;

-- Day 12: Arm & Shoulder Day
INSERT INTO exercises (workout_id, name, sets, reps, notes, order_index) VALUES
  ('00000000-0000-0000-0000-000000001012','Overhead Press',            4,'8-10',       'Strict press. Bar from front rack.', 1),
  ('00000000-0000-0000-0000-000000001012','Lateral Raises',            4,'12-15',      'Slow tempo, feel the side delt.', 2),
  ('00000000-0000-0000-0000-000000001012','Barbell Curl',              3,'10',         'No swinging. Pure bicep.', 3),
  ('00000000-0000-0000-0000-000000001012','Close-Grip Bench Press',    3,'10',         'Elbows in, tricep focus.', 4),
  ('00000000-0000-0000-0000-000000001012','Arnold Press',              3,'12',         'Rotate as you press overhead.', 5)
ON CONFLICT DO NOTHING;

-- Day 13: Full Body HIIT
INSERT INTO exercises (workout_id, name, sets, reps, notes, order_index) VALUES
  ('00000000-0000-0000-0000-000000001013','Thrusters (DB)',            5,'10',         'Squat + press in one fluid movement.', 1),
  ('00000000-0000-0000-0000-000000001013','Burpees',                   5,'10',         'Chest to floor. Full extension at top.', 2),
  ('00000000-0000-0000-0000-000000001013','Kettlebell Swings',         5,'15',         'Hip hinge, not a squat. Hips forward at top.', 3),
  ('00000000-0000-0000-0000-000000001013','Mountain Climbers',         5,'30 sec',     'Hips low, fast feet.', 4),
  ('00000000-0000-0000-0000-000000001013','Jump Rope',                 5,'60 sec',     'Rest 60 sec between rounds.', 5)
ON CONFLICT DO NOTHING;

-- Day 14: Rest & Mobility
INSERT INTO exercises (workout_id, name, sets, reps, notes, order_index) VALUES
  ('00000000-0000-0000-0000-000000001014','Foam Rolling — Full Body',  1,'10 min',     'Quads, hamstrings, IT band, thoracic spine.', 1),
  ('00000000-0000-0000-0000-000000001014','Hip 90/90 Stretch',         2,'60 sec each','Both hips. Breathe into the stretch.', 2),
  ('00000000-0000-0000-0000-000000001014','Doorway Chest Stretch',     2,'45 sec',     'Arms at 90 degrees, lean into doorway.', 3),
  ('00000000-0000-0000-0000-000000001014','Couch Stretch',             2,'60 sec each','Hip flexor opener. Tight from squatting.', 4),
  ('00000000-0000-0000-0000-000000001014','Diaphragmatic Breathing',   1,'5 min',      'Box breathing — 4 in, 4 hold, 4 out, 4 hold.', 5)
ON CONFLICT DO NOTHING;

-- Day 15: Heavy Deadlift Day
INSERT INTO exercises (workout_id, name, sets, reps, notes, order_index) VALUES
  ('00000000-0000-0000-0000-000000001015','Conventional Deadlift',     5,'5',          'Build up to a heavy 5. Perfect form always.', 1),
  ('00000000-0000-0000-0000-000000001015','Rack Pull',                 3,'6',          'Bar at knee height. Heavy.', 2),
  ('00000000-0000-0000-0000-000000001015','Good Morning',              3,'10',         'Hinge at hips, bar on traps. Loads the posterior chain.', 3),
  ('00000000-0000-0000-0000-000000001015','Glute Ham Raise',           3,'8',          'Slow negative, powerful concentric.', 4),
  ('00000000-0000-0000-0000-000000001015','Hanging Knee Raises',       3,'15',         'Core finisher. Control the swing.', 5)
ON CONFLICT DO NOTHING;

-- Day 16: Incline Press & Row
INSERT INTO exercises (workout_id, name, sets, reps, notes, order_index) VALUES
  ('00000000-0000-0000-0000-000000001016','Incline Barbell Press',     5,'5',          'Go heavy. 3 min rest between sets.', 1),
  ('00000000-0000-0000-0000-000000001016','Pendlay Row',               4,'6',          'Bar dead on floor each rep. Explosive pull.', 2),
  ('00000000-0000-0000-0000-000000001016','Incline Dumbbell Press',    3,'10-12',      'Drop down from barbell weight. More volume.', 3),
  ('00000000-0000-0000-0000-000000001016','Seated Cable Row',          3,'12',         'Straight back, full stretch at extension.', 4),
  ('00000000-0000-0000-0000-000000001016','Chest Dip',                 3,'AMRAP',      'Lean forward to target chest.', 5)
ON CONFLICT DO NOTHING;

-- Day 17: Leg Hypertrophy
INSERT INTO exercises (workout_id, name, sets, reps, notes, order_index) VALUES
  ('00000000-0000-0000-0000-000000001017','Hack Squat',                4,'12',         'Full depth. Control the descent.', 1),
  ('00000000-0000-0000-0000-000000001017','Leg Extension',             4,'15',         'Squeeze quad hard at the top.', 2),
  ('00000000-0000-0000-0000-000000001017','Seated Leg Curl',           4,'12-15',      'Slow negative. Full range.', 3),
  ('00000000-0000-0000-0000-000000001017','Walking Lunge',             3,'20 steps',   'Long stride. Knee close to floor.', 4),
  ('00000000-0000-0000-0000-000000001017','Standing Calf Raise',       5,'20',         'Pause 2 sec at top. Don''t bounce at bottom.', 5)
ON CONFLICT DO NOTHING;

-- Day 18: Shoulder Complex
INSERT INTO exercises (workout_id, name, sets, reps, notes, order_index) VALUES
  ('00000000-0000-0000-0000-000000001018','Seated Dumbbell Press',     4,'10',         'No back arch. Strict pressing.', 1),
  ('00000000-0000-0000-0000-000000001018','Cable Lateral Raise',       4,'15',         'Cable keeps constant tension throughout.', 2),
  ('00000000-0000-0000-0000-000000001018','Bent-Over Rear Delt Raise', 4,'15',         'Slight bend in elbows. Squeeze shoulder blades.', 3),
  ('00000000-0000-0000-0000-000000001018','Upright Row',               3,'12',         'Bar to chin height, elbows lead.', 4),
  ('00000000-0000-0000-0000-000000001018','Plate Front Raise',         3,'12',         'Arms straight, controlled movement.', 5)
ON CONFLICT DO NOTHING;

-- Day 19: Biceps & Triceps
INSERT INTO exercises (workout_id, name, sets, reps, notes, order_index) VALUES
  ('00000000-0000-0000-0000-000000001019','Skull Crushers',            4,'10',         'Lower bar to forehead. Keep elbows stationary.', 1),
  ('00000000-0000-0000-0000-000000001019','Barbell Curl',              4,'10',         'No momentum. Squeeze at top.', 2),
  ('00000000-0000-0000-0000-000000001019','Overhead Tricep Extension', 3,'12',         'Both hands on dumbbell. Full stretch overhead.', 3),
  ('00000000-0000-0000-0000-000000001019','Incline Dumbbell Curl',     3,'12',         'Great stretch at the bottom.', 4),
  ('00000000-0000-0000-0000-000000001019','Cable Curl / Pushdown',     3,'15 each',    'Superset. Finish with the burn.', 5)
ON CONFLICT DO NOTHING;

-- Day 20: Strongman Conditioning
INSERT INTO exercises (workout_id, name, sets, reps, notes, order_index) VALUES
  ('00000000-0000-0000-0000-000000001020','Sled Push',                 6,'40m',        'Low drive angle. Max effort every length.', 1),
  ('00000000-0000-0000-0000-000000001020','Farmer''s Carry',           4,'40m',        'Heavy dumbbells or kettlebells. Chest up.', 2),
  ('00000000-0000-0000-0000-000000001020','Tire Flip',                 4,'8',          'Drive with legs, not back. Explode through.', 3),
  ('00000000-0000-0000-0000-000000001020','Sandbag Carry',             4,'40m',        'Bear hug carry. Keep tight.', 4),
  ('00000000-0000-0000-0000-000000001020','Battle Rope Finisher',      3,'45 sec',     'Max effort. Leave everything on the floor.', 5)
ON CONFLICT DO NOTHING;

-- Day 21: Active Recovery
INSERT INTO exercises (workout_id, name, sets, reps, notes, order_index) VALUES
  ('00000000-0000-0000-0000-000000001021','30-min Easy Walk or Bike',  1,'30 min',     'Conversational pace. Just move.', 1),
  ('00000000-0000-0000-0000-000000001021','Foam Rolling',              1,'10 min',     'Full body. Spend time on problem areas.', 2),
  ('00000000-0000-0000-0000-000000001021','Yoga — Sun Salutation Flow',3,'5 reps',     'Slow and deliberate. Breathe through it.', 3),
  ('00000000-0000-0000-0000-000000001021','Meditation / Breathwork',   1,'10 min',     'Three weeks in. Reflect. Recommit.', 4)
ON CONFLICT DO NOTHING;

-- Day 22: Lower Body Power II
INSERT INTO exercises (workout_id, name, sets, reps, notes, order_index) VALUES
  ('00000000-0000-0000-0000-000000001022','Barbell Back Squat',        5,'3',          'Heavier than Day 8. This is Week 4.', 1),
  ('00000000-0000-0000-0000-000000001022','Bulgarian Split Squat',     4,'8 each',     'Add weight. Don''t let it be easy.', 2),
  ('00000000-0000-0000-0000-000000001022','Trap Bar Deadlift',         4,'6',          'Neutral grip, explosive pull.', 3),
  ('00000000-0000-0000-0000-000000001022','Prowler Sprint',            6,'20m',        'All out. Recover fully between sets.', 4),
  ('00000000-0000-0000-0000-000000001022','Seated Calf Raise',         4,'20',         'Slow and controlled.', 5)
ON CONFLICT DO NOTHING;

-- Day 23: Upper Body Volume
INSERT INTO exercises (workout_id, name, sets, reps, notes, order_index) VALUES
  ('00000000-0000-0000-0000-000000001023','Flat Barbell Bench',        4,'12',         'Moderate weight. Chase the pump.', 1),
  ('00000000-0000-0000-0000-000000001023','Wide-Grip Pull-Up',         4,'12',         'Add weight if bodyweight is easy.', 2),
  ('00000000-0000-0000-0000-000000001023','Incline Dumbbell Press',    3,'15',         'High reps, controlled tempo.', 3),
  ('00000000-0000-0000-0000-000000001023','Cable Row',                 3,'15',         'Squeeze hard at contraction.', 4),
  ('00000000-0000-0000-0000-000000001023','Dumbbell Curl & Press',     3,'12',         'Curl then press. One combined movement.', 5)
ON CONFLICT DO NOTHING;

-- Day 24: Cardio & Core
INSERT INTO exercises (workout_id, name, sets, reps, notes, order_index) VALUES
  ('00000000-0000-0000-0000-000000001024','Rowing Machine',            1,'20 min',     'Steady effort. Target 2:10/500m pace.', 1),
  ('00000000-0000-0000-0000-000000001024','Ab Wheel Rollout',          4,'10',         'Keep core braced. Don''t let hips drop.', 2),
  ('00000000-0000-0000-0000-000000001024','Hanging Leg Raise',         4,'12',         'Controlled. No swinging.', 3),
  ('00000000-0000-0000-0000-000000001024','Dragon Flag',               3,'5-8',        'Elite core movement. Earn it.', 4),
  ('00000000-0000-0000-0000-000000001024','Plank Hold — Max Effort',   2,'Max',        'Hold until form breaks.', 5)
ON CONFLICT DO NOTHING;

-- Day 25: Push Strength II
INSERT INTO exercises (workout_id, name, sets, reps, notes, order_index) VALUES
  ('00000000-0000-0000-0000-000000001025','Barbell Bench Press',       5,'5',          'Heavier than week 1. Test yourself.', 1),
  ('00000000-0000-0000-0000-000000001025','Overhead Press',            4,'6',          'Strict. No leg drive.', 2),
  ('00000000-0000-0000-0000-000000001025','Weighted Dip',              4,'8',          'Add weight via belt.', 3),
  ('00000000-0000-0000-0000-000000001025','Incline DB Press',          3,'10',         'Angle hits upper chest. Control the descent.', 4),
  ('00000000-0000-0000-0000-000000001025','Cable Flye',                3,'15',         'Constant tension finisher.', 5)
ON CONFLICT DO NOTHING;

-- Day 26: Pull Strength II
INSERT INTO exercises (workout_id, name, sets, reps, notes, order_index) VALUES
  ('00000000-0000-0000-0000-000000001026','Weighted Pull-Up',          5,'5',          'Add weight. More than week 1.', 1),
  ('00000000-0000-0000-0000-000000001026','Barbell Bent-Over Row',     4,'6',          'Heavy. Bar to lower chest.', 2),
  ('00000000-0000-0000-0000-000000001026','T-Bar Row',                 4,'8',          'Chest on pad. Full range.', 3),
  ('00000000-0000-0000-0000-000000001026','Straight Arm Pulldown',     3,'12',         'Isolates lats. Arms stay straight.', 4),
  ('00000000-0000-0000-0000-000000001026','Dumbbell Shrug',            3,'15',         'Hold at top for 2 sec.', 5)
ON CONFLICT DO NOTHING;

-- Day 27: Full Body Finisher
INSERT INTO exercises (workout_id, name, sets, reps, notes, order_index) VALUES
  ('00000000-0000-0000-0000-000000001027','Deadlift',                  3,'5',          'Heavy. Best sets of the challenge.', 1),
  ('00000000-0000-0000-0000-000000001027','Bench Press',               3,'5',          'Heavy. No excuses.', 2),
  ('00000000-0000-0000-0000-000000001027','Squat',                     3,'5',          'Heavy. Back straight, chest up.', 3),
  ('00000000-0000-0000-0000-000000001027','Pull-Up',                   3,'AMRAP',      'Everything you have left.', 4),
  ('00000000-0000-0000-0000-000000001027','100 Burpee Challenge',      1,'100',        'For time. This is the grind.', 5)
ON CONFLICT DO NOTHING;

-- Day 28: Active Recovery II
INSERT INTO exercises (workout_id, name, sets, reps, notes, order_index) VALUES
  ('00000000-0000-0000-0000-000000001028','Easy Walk',                 1,'30 min',     'Last rest before the final push.', 1),
  ('00000000-0000-0000-0000-000000001028','Full Body Foam Roll',       1,'15 min',     'Every muscle group. Prepare the body.', 2),
  ('00000000-0000-0000-0000-000000001028','Static Stretching',         1,'15 min',     'Hold each stretch 45–60 seconds.', 3),
  ('00000000-0000-0000-0000-000000001028','Visualization',             1,'10 min',     'See the final two days. Own them mentally.', 4)
ON CONFLICT DO NOTHING;

-- Day 29: Max Effort Day
INSERT INTO exercises (workout_id, name, sets, reps, notes, order_index) VALUES
  ('00000000-0000-0000-0000-000000001029','Deadlift — 1 Rep Max',      3,'1',          'Build up. Hit the heaviest weight of the challenge.', 1),
  ('00000000-0000-0000-0000-000000001029','Bench Press — 1 Rep Max',   3,'1',          'Same. Go for your PR.', 2),
  ('00000000-0000-0000-0000-000000001029','Back Squat — 3 Rep Max',    3,'3',          'Heavy triple. Great effort.', 3),
  ('00000000-0000-0000-0000-000000001029','Max Pull-Ups',              3,'Max',        'How many can you do? Compare to Week 1.', 4),
  ('00000000-0000-0000-0000-000000001029','400m Sprint',               2,'1',          'All out. Faster than Day 10?', 5)
ON CONFLICT DO NOTHING;

-- Day 30: Challenge Complete
INSERT INTO exercises (workout_id, name, sets, reps, notes, order_index) VALUES
  ('00000000-0000-0000-0000-000000001030','Special Forces Circuit',    1,'5 rounds',   '10 pull-ups, 20 push-ups, 30 air squats, 400m run. Honor the grind.', 1),
  ('00000000-0000-0000-0000-000000001030','Dumbbell Complex',          3,'5 each',     'Curl, press, row, squat. Back-to-back with no rest.', 2),
  ('00000000-0000-0000-0000-000000001030','Core Finisher',             1,'10 min',     'Planks, hollow holds, leg raises. Make it count.', 3),
  ('00000000-0000-0000-0000-000000001030','Cool Down & Reflect',       1,'10 min',     '30 days. You showed up every single day. Mark it done.', 4)
ON CONFLICT DO NOTHING;


-- ============================================================
-- SOMMER RAY — Days 8–30
-- ============================================================

INSERT INTO workouts (id, trainer, tier, day_number, title, description) VALUES
  ('00000000-0000-0000-0000-000000002008','sommer','30', 8, 'Glute & Hamstring Focus',   'Target the back of the legs for a fuller, rounder look.'),
  ('00000000-0000-0000-0000-000000002009','sommer','30', 9, 'Arms & Shoulders Sculpt',  'Tone and define the upper body with controlled sculpting work.'),
  ('00000000-0000-0000-0000-000000002010','sommer','30',10, 'Cardio & Core Burn',       'Elevate heart rate and torch the midsection — double benefit.'),
  ('00000000-0000-0000-0000-000000002011','sommer','30',11, 'Booty Band Circuit II',    'Resistance band lower body circuit for maximum glute engagement.'),
  ('00000000-0000-0000-0000-000000002012','sommer','30',12, 'Full Body Tone II',        'Total body toning — hit every muscle group with intention.'),
  ('00000000-0000-0000-0000-000000002013','sommer','30',13, 'Lower Body Strength II',  'Build real strength in glutes, quads, and hamstrings.'),
  ('00000000-0000-0000-0000-000000002014','sommer','30',14, 'Rest & Restore',           'Gentle movement and stretching. Let the body rebuild.'),
  ('00000000-0000-0000-0000-000000002015','sommer','30',15, 'Hip Thrust Day',           'One movement. One focus. The ultimate glute builder.'),
  ('00000000-0000-0000-0000-000000002016','sommer','30',16, 'Upper Body Sculpt II',    'Shoulders, arms, and back — lean and defined.'),
  ('00000000-0000-0000-0000-000000002017','sommer','30',17, 'HIIT & Abs',              'Burn fat and build a defined core in one high-energy session.'),
  ('00000000-0000-0000-0000-000000002018','sommer','30',18, 'Glute & Quad Superset',   'Superset pairings that hit quads and glutes from all angles.'),
  ('00000000-0000-0000-0000-000000002019','sommer','30',19, 'Arms & Back Tone',        'Pull and curl to sculpt the upper back and arms.'),
  ('00000000-0000-0000-0000-000000002020','sommer','30',20, 'Full Body Burnout',       'Every muscle, maximum effort. This is Week 3''s finale.'),
  ('00000000-0000-0000-0000-000000002021','sommer','30',21, 'Yoga & Recovery II',      'Restore, stretch, and breathe. Three weeks done — incredible.'),
  ('00000000-0000-0000-0000-000000002022','sommer','30',22, 'Lower Body Strength III', 'Heaviest lower body session yet. Feel the Week 4 difference.'),
  ('00000000-0000-0000-0000-000000002023','sommer','30',23, 'Upper Body Sculpt III',   'More volume, more definition. The look is almost there.'),
  ('00000000-0000-0000-0000-000000002024','sommer','30',24, 'Dance Cardio & Core',     'Fun, effective, and sweaty. This is why you started.'),
  ('00000000-0000-0000-0000-000000002025','sommer','30',25, 'Glute Peak Day',          'Maximum glute activation. Every fiber. Every inch.'),
  ('00000000-0000-0000-0000-000000002026','sommer','30',26, 'Arms & Shoulders III',    'Final push for upper body definition. Make it lean and mean.'),
  ('00000000-0000-0000-0000-000000002027','sommer','30',27, 'Total Body Circuit',      'Compound movements, high reps, minimal rest. The final test.'),
  ('00000000-0000-0000-0000-000000002028','sommer','30',28, 'Active Recovery III',     'You''re almost there. Rest smart. Prepare for the final push.'),
  ('00000000-0000-0000-0000-000000002029','sommer','30',29, 'Sculpt Challenge Final',  'Last big session. Every exercise at your best.'),
  ('00000000-0000-0000-0000-000000002030','sommer','30',30, 'Day 30 — Challenge Complete','The last workout. Give everything. You came this far — finish strong.')
ON CONFLICT DO NOTHING;

-- Day 8: Glute & Hamstring Focus
INSERT INTO exercises (workout_id, name, sets, reps, notes, order_index, video_url) VALUES
  ('00000000-0000-0000-0000-000000002008','Romanian Deadlift',         4,'10-12',      'Slow negative — feel the full hamstring stretch.', 1, '/videos/sommer-workout.mp4'),
  ('00000000-0000-0000-0000-000000002008','Barbell Hip Thrust',        4,'12',         'Back on bench, drive through heels, squeeze at top.', 2, '/videos/sommer-workout.mp4'),
  ('00000000-0000-0000-0000-000000002008','Cable Pull-Through',        3,'15',         'Hinge at hips, squeeze glutes hard at extension.', 3, '/videos/sommer-workout.mp4'),
  ('00000000-0000-0000-0000-000000002008','Seated Leg Curl',           3,'12-15',      'Full range of motion, slow negative.', 4, '/videos/sommer-workout.mp4'),
  ('00000000-0000-0000-0000-000000002008','Banded Glute Bridge Pulse', 3,'20',         'Keep hips elevated. Small pulses — feel the burn.', 5, '/videos/sommer-workout.mp4')
ON CONFLICT DO NOTHING;

-- Day 9: Arms & Shoulders Sculpt
INSERT INTO exercises (workout_id, name, sets, reps, notes, order_index) VALUES
  ('00000000-0000-0000-0000-000000002009','Dumbbell Shoulder Press',   3,'12',         'Seated, controlled. No arching.', 1),
  ('00000000-0000-0000-0000-000000002009','Lateral Raise',             4,'15',         'Light weight, slow tempo. Feel the side delt.', 2),
  ('00000000-0000-0000-0000-000000002009','Bicep Curl',                3,'12',         'Alternate arms. Squeeze at the top.', 3),
  ('00000000-0000-0000-0000-000000002009','Tricep Overhead Extension', 3,'12',         'Both hands on dumbbell. Full range.', 4),
  ('00000000-0000-0000-0000-000000002009','Front Raise',               3,'12',         'Arms straight. Controlled lift to shoulder height.', 5)
ON CONFLICT DO NOTHING;

-- Day 10: Cardio & Core Burn
INSERT INTO exercises (workout_id, name, sets, reps, notes, order_index) VALUES
  ('00000000-0000-0000-0000-000000002010','Jump Rope',                 4,'60 sec',     'Moderate pace. Stay on your toes.', 1),
  ('00000000-0000-0000-0000-000000002010','Bicycle Crunches',          4,'15 each',    'Slow tempo. Touch elbow to opposite knee.', 2),
  ('00000000-0000-0000-0000-000000002010','Mountain Climbers',         4,'30 sec',     'Hips level. Drive knees in fast.', 3),
  ('00000000-0000-0000-0000-000000002010','Flutter Kicks',             4,'30 sec',     'Lower back pressed into floor.', 4),
  ('00000000-0000-0000-0000-000000002010','Plank with Hip Dip',        3,'12 each',    'From forearm plank. Controlled rotation.', 5)
ON CONFLICT DO NOTHING;

-- Day 11: Booty Band Circuit II
INSERT INTO exercises (workout_id, name, sets, reps, notes, order_index) VALUES
  ('00000000-0000-0000-0000-000000002011','Banded Hip Thrust',         4,'15',         'Band above knees. Squeeze for 2 seconds at top.', 1),
  ('00000000-0000-0000-0000-000000002011','Banded Squat to Kick Back', 3,'12 each',    'Squat down, extend leg on the way up.', 2),
  ('00000000-0000-0000-0000-000000002011','Banded Clamshells',         3,'15 each',    'Lie on side, keep feet together.', 3),
  ('00000000-0000-0000-0000-000000002011','Banded Monster Walk',       3,'20 steps each','Wide stance, stay low. Walk forward and back.', 4),
  ('00000000-0000-0000-0000-000000002011','Banded Donkey Kick Pulse',  3,'20 each',    'Small pulses at the top of the kick.', 5)
ON CONFLICT DO NOTHING;

-- Day 12: Full Body Tone II
INSERT INTO exercises (workout_id, name, sets, reps, notes, order_index) VALUES
  ('00000000-0000-0000-0000-000000002012','Dumbbell Squat',            3,'15',         'Hold at chest. Sit back, chest up.', 1),
  ('00000000-0000-0000-0000-000000002012','Single Arm Row',            3,'12 each',    'Brace on bench. Full range of motion.', 2),
  ('00000000-0000-0000-0000-000000002012','Dumbbell Deadlift',         3,'12',         'Hinge at hips, bar close to legs.', 3),
  ('00000000-0000-0000-0000-000000002012','Push-Up to T Rotation',     3,'10 each',    'Push-up then rotate arm to ceiling.', 4),
  ('00000000-0000-0000-0000-000000002012','Reverse Lunge with Twist',  3,'10 each',    'Step back, rotate torso over front knee.', 5)
ON CONFLICT DO NOTHING;

-- Day 13: Lower Body Strength II
INSERT INTO exercises (workout_id, name, sets, reps, notes, order_index) VALUES
  ('00000000-0000-0000-0000-000000002013','Barbell Back Squat',        4,'10',         'Build on Week 1. Add a little weight.', 1),
  ('00000000-0000-0000-0000-000000002013','Sumo Deadlift',             4,'8',          'Wide stance, toes out. Targets glutes and inner thighs.', 2),
  ('00000000-0000-0000-0000-000000002013','Walking Lunge',             3,'12 each',    'Long stride. Hold dumbbells.', 3),
  ('00000000-0000-0000-0000-000000002013','Step-Up',                   3,'12 each',    'Drive through heel. Control the descent.', 4),
  ('00000000-0000-0000-0000-000000002013','Wall Sit',                  3,'45 sec',     'Thighs parallel. Hold strong.', 5)
ON CONFLICT DO NOTHING;

-- Day 14: Rest & Restore
INSERT INTO exercises (workout_id, name, sets, reps, notes, order_index) VALUES
  ('00000000-0000-0000-0000-000000002014','Foam Rolling — Lower Body', 1,'10 min',     'Glutes, hamstrings, quads, calves.', 1),
  ('00000000-0000-0000-0000-000000002014','Pigeon Pose',               2,'60 sec each','Deep hip opener. Breathe through the discomfort.', 2),
  ('00000000-0000-0000-0000-000000002014','Seated Forward Fold',       2,'60 sec',     'Reach for feet. Feel hamstrings lengthen.', 3),
  ('00000000-0000-0000-0000-000000002014','Lying Spinal Twist',        2,'45 sec each','Knees stacked, arms open.', 4),
  ('00000000-0000-0000-0000-000000002014','Child''s Pose',             1,'2 min',      'Rest your whole body. You earned it.', 5)
ON CONFLICT DO NOTHING;

-- Day 15: Hip Thrust Day
INSERT INTO exercises (workout_id, name, sets, reps, notes, order_index) VALUES
  ('00000000-0000-0000-0000-000000002015','Barbell Hip Thrust',        5,'10',         'Heavy. Pad the bar. Drive through heels every rep.', 1),
  ('00000000-0000-0000-0000-000000002015','Single-Leg Hip Thrust',     3,'12 each',    'Bodyweight or dumbbell. Feel the imbalance.', 2),
  ('00000000-0000-0000-0000-000000002015','Hip Thrust Pulse',          3,'20',         'At the top of the movement. Burns so good.', 3),
  ('00000000-0000-0000-0000-000000002015','Banded Hip Thrust',         3,'15',         'Band above knees for extra glute activation.', 4),
  ('00000000-0000-0000-0000-000000002015','Glute Bridge Hold',         3,'30 sec',     'Hold at the top. Don''t let it drop.', 5)
ON CONFLICT DO NOTHING;

-- Day 16: Upper Body Sculpt II
INSERT INTO exercises (workout_id, name, sets, reps, notes, order_index) VALUES
  ('00000000-0000-0000-0000-000000002016','Dumbbell Lateral Raise',    4,'15',         'Slow, controlled. Slight bend in elbows.', 1),
  ('00000000-0000-0000-0000-000000002016','Bent-Over Reverse Fly',     4,'15',         'Squeeze shoulder blades. Rear delt focus.', 2),
  ('00000000-0000-0000-0000-000000002016','Hammer Curl',               3,'12',         'Neutral grip. Control the negative.', 3),
  ('00000000-0000-0000-0000-000000002016','Tricep Dip (Bench)',        3,'15',         'Fingers forward. Full range of motion.', 4),
  ('00000000-0000-0000-0000-000000002016','Arnold Press',              3,'12',         'Rotate and press. Hits all three heads.', 5)
ON CONFLICT DO NOTHING;

-- Day 17: HIIT & Abs
INSERT INTO exercises (workout_id, name, sets, reps, notes, order_index) VALUES
  ('00000000-0000-0000-0000-000000002017','Squat Jump',                4,'15',         'Explode up. Land soft. Repeat.', 1),
  ('00000000-0000-0000-0000-000000002017','Burpee',                    4,'10',         'Chest to floor every rep.', 2),
  ('00000000-0000-0000-0000-000000002017','V-Up',                      4,'12',         'Reach hands to feet at the top.', 3),
  ('00000000-0000-0000-0000-000000002017','Plank to Downward Dog',     3,'12',         'Core engaged throughout.', 4),
  ('00000000-0000-0000-0000-000000002017','Russian Twist',             3,'15 each',    'Slow and deliberate. Lean back 45 degrees.', 5)
ON CONFLICT DO NOTHING;

-- Day 18: Glute & Quad Superset
INSERT INTO exercises (workout_id, name, sets, reps, notes, order_index) VALUES
  ('00000000-0000-0000-0000-000000002018','Hip Thrust / Leg Extension', 4,'12 each',   'Superset: no rest between.', 1),
  ('00000000-0000-0000-0000-000000002018','Bulgarian Split Squat / Glute Kickback', 3,'10 each', 'Superset. Great contrast.', 2),
  ('00000000-0000-0000-0000-000000002018','Sumo Squat / Cable Pull-Through', 3,'12 each', 'Superset.', 3),
  ('00000000-0000-0000-0000-000000002018','Banded Squat Walk',         3,'20 steps each','Stay low. Band above knees.', 4),
  ('00000000-0000-0000-0000-000000002018','Pulse Squat Finisher',      2,'30',         'At the bottom of the squat. Burn it out.', 5)
ON CONFLICT DO NOTHING;

-- Day 19: Arms & Back Tone
INSERT INTO exercises (workout_id, name, sets, reps, notes, order_index) VALUES
  ('00000000-0000-0000-0000-000000002019','Lat Pulldown',              4,'12',         'Wide grip. Squeeze lats at the bottom.', 1),
  ('00000000-0000-0000-0000-000000002019','Seated Cable Row',          3,'12',         'Chest to pad. Full stretch at extension.', 2),
  ('00000000-0000-0000-0000-000000002019','Concentration Curl',        3,'12 each',    'Elbow on inner thigh. Squeeze at peak.', 3),
  ('00000000-0000-0000-0000-000000002019','Tricep Kickback',           3,'15',         'Upper arm parallel to floor. Full extension.', 4),
  ('00000000-0000-0000-0000-000000002019','Face Pull',                 3,'15',         'Great for posture and rear delts.', 5)
ON CONFLICT DO NOTHING;

-- Day 20: Full Body Burnout
INSERT INTO exercises (workout_id, name, sets, reps, notes, order_index) VALUES
  ('00000000-0000-0000-0000-000000002020','Dumbbell Complex',          4,'8 each',     'Squat, curl, press — no rest between moves.', 1),
  ('00000000-0000-0000-0000-000000002020','Hip Thrust',                4,'15',         'Heavy. Best of Week 3.', 2),
  ('00000000-0000-0000-0000-000000002020','Push-Up',                   4,'15',         'Chest to floor. Keep it controlled.', 3),
  ('00000000-0000-0000-0000-000000002020','Jump Squat',                4,'15',         'Explosive. Land softly.', 4),
  ('00000000-0000-0000-0000-000000002020','Plank Hold',                3,'60 sec',     'Finish strong. No quitting.', 5)
ON CONFLICT DO NOTHING;

-- Day 21: Yoga & Recovery II
INSERT INTO exercises (workout_id, name, sets, reps, notes, order_index) VALUES
  ('00000000-0000-0000-0000-000000002021','Cat-Cow Flow',              2,'10 reps',    'Move with your breath. Let the spine breathe.', 1),
  ('00000000-0000-0000-0000-000000002021','Downward Dog Hold',         3,'30 sec',     'Pedal heels alternately. Open the calves.', 2),
  ('00000000-0000-0000-0000-000000002021','Pigeon Pose',               2,'60 sec each','Hip opener. Three weeks of hard work sitting here.', 3),
  ('00000000-0000-0000-0000-000000002021','Seated Twist',              2,'45 sec each','Lengthen spine on every inhale.', 4),
  ('00000000-0000-0000-0000-000000002021','Savasana',                  1,'5 min',      'Lie still. Breathe. You''ve earned this.', 5)
ON CONFLICT DO NOTHING;

-- Day 22: Lower Body Strength III
INSERT INTO exercises (workout_id, name, sets, reps, notes, order_index) VALUES
  ('00000000-0000-0000-0000-000000002022','Barbell Back Squat',        4,'8',          'Week 4 — more weight than ever.', 1),
  ('00000000-0000-0000-0000-000000002022','Barbell Hip Thrust',        4,'10',         'Load it up. Best hip thrust of the program.', 2),
  ('00000000-0000-0000-0000-000000002022','Romanian Deadlift',         4,'10',         'Heavy. Full hamstring stretch.', 3),
  ('00000000-0000-0000-0000-000000002022','Leg Press',                 3,'15',         'High rep. Feet high on platform for glute bias.', 4),
  ('00000000-0000-0000-0000-000000002022','Calf Raise',                4,'20',         'Pause at the top.', 5)
ON CONFLICT DO NOTHING;

-- Day 23: Upper Body Sculpt III
INSERT INTO exercises (workout_id, name, sets, reps, notes, order_index) VALUES
  ('00000000-0000-0000-0000-000000002023','Overhead Press',            4,'10',         'Press it overhead. Strict and strong.', 1),
  ('00000000-0000-0000-0000-000000002023','Lateral Raise',             4,'15',         'Control every inch. No swinging.', 2),
  ('00000000-0000-0000-0000-000000002023','Cable Bicep Curl',          3,'15',         'Constant tension. Squeeze at top.', 3),
  ('00000000-0000-0000-0000-000000002023','Rope Pushdown',             3,'15',         'Spread the rope. Squeeze triceps.', 4),
  ('00000000-0000-0000-0000-000000002023','Rear Delt Fly',             3,'15',         'Bent over. Squeeze shoulder blades.', 5)
ON CONFLICT DO NOTHING;

-- Day 24: Dance Cardio & Core
INSERT INTO exercises (workout_id, name, sets, reps, notes, order_index) VALUES
  ('00000000-0000-0000-0000-000000002024','Dance Cardio',              1,'15 min',     'Turn on your favorite playlist. Move freely.', 1),
  ('00000000-0000-0000-0000-000000002024','Hollow Body Hold',          4,'30 sec',     'Lower back flat. Arms and legs extended.', 2),
  ('00000000-0000-0000-0000-000000002024','Bicycle Crunch',            4,'15 each',    'Slow twist. Touch elbow to knee.', 3),
  ('00000000-0000-0000-0000-000000002024','Side Plank',                3,'30 sec each','Stack feet or stagger. Hold strong.', 4),
  ('00000000-0000-0000-0000-000000002024','Leg Raise',                 3,'12',         'Lower back on floor. Slow negative.', 5)
ON CONFLICT DO NOTHING;

-- Day 25: Glute Peak Day
INSERT INTO exercises (workout_id, name, sets, reps, notes, order_index) VALUES
  ('00000000-0000-0000-0000-000000002025','Barbell Hip Thrust',        5,'10',         'Heaviest session of the challenge. Every rep counts.', 1),
  ('00000000-0000-0000-0000-000000002025','Cable Kickback',            4,'15 each',    'Full extension. Squeeze and hold for 1 second.', 2),
  ('00000000-0000-0000-0000-000000002025','Bulgarian Split Squat',     4,'10 each',    'Rear foot elevated. Drive through front heel.', 3),
  ('00000000-0000-0000-0000-000000002025','Sumo Squat with Pulse',     3,'12 + 20 pulses','Full squat then pulse. Glute destroyer.', 4),
  ('00000000-0000-0000-0000-000000002025','Banded Glute Squeeze',      3,'30',         'Lying face down. Band around thighs. Squeeze.', 5)
ON CONFLICT DO NOTHING;

-- Day 26: Arms & Shoulders III
INSERT INTO exercises (workout_id, name, sets, reps, notes, order_index) VALUES
  ('00000000-0000-0000-0000-000000002026','Dumbbell Shoulder Press',   4,'10',         'Best effort of the program.', 1),
  ('00000000-0000-0000-0000-000000002026','Lateral Raise Drop Set',    3,'12+12+12',   'Three weights, no rest between. Burn it out.', 2),
  ('00000000-0000-0000-0000-000000002026','Barbell Curl',              3,'10',         'Strict. No swinging.', 3),
  ('00000000-0000-0000-0000-000000002026','Dip',                       3,'AMRAP',      'Bodyweight. Full range.', 4),
  ('00000000-0000-0000-0000-000000002026','Face Pull',                 3,'20',         'Posture and rear delt finisher.', 5)
ON CONFLICT DO NOTHING;

-- Day 27: Total Body Circuit
INSERT INTO exercises (workout_id, name, sets, reps, notes, order_index) VALUES
  ('00000000-0000-0000-0000-000000002027','Hip Thrust',                4,'12',         'Heavy. Best reps of the challenge.', 1),
  ('00000000-0000-0000-0000-000000002027','Push-Up',                   4,'15',         'Chest down every rep.', 2),
  ('00000000-0000-0000-0000-000000002027','Dumbbell Romanian Deadlift',4,'12',         'Slow and deliberate.', 3),
  ('00000000-0000-0000-0000-000000002027','Lateral Raise',             4,'15',         'Controlled. Feel the burn.', 4),
  ('00000000-0000-0000-0000-000000002027','Jump Squat',                3,'15',         'Explosive finisher. Everything you have.', 5)
ON CONFLICT DO NOTHING;

-- Day 28: Active Recovery III
INSERT INTO exercises (workout_id, name, sets, reps, notes, order_index) VALUES
  ('00000000-0000-0000-0000-000000002028','Easy Walk',                 1,'30 min',     'Last rest day. Breathe. Be proud.', 1),
  ('00000000-0000-0000-0000-000000002028','Foam Rolling',              1,'15 min',     'Every inch. Prepare for the final push.', 2),
  ('00000000-0000-0000-0000-000000002028','Full Body Stretch',         1,'15 min',     'Long holds. Everything loose and ready.', 3),
  ('00000000-0000-0000-0000-000000002028','Journaling / Reflection',   1,'10 min',     'Write down what changed. It''s more than just physical.', 4)
ON CONFLICT DO NOTHING;

-- Day 29: Sculpt Challenge Final
INSERT INTO exercises (workout_id, name, sets, reps, notes, order_index) VALUES
  ('00000000-0000-0000-0000-000000002029','Hip Thrust — Heavy Triple', 5,'3',          'Heaviest of the challenge. Leave it all here.', 1),
  ('00000000-0000-0000-0000-000000002029','Full Squat',                5,'5',          'Best weight of the program. Prove the growth.', 2),
  ('00000000-0000-0000-0000-000000002029','Overhead Press',            4,'6',          'Go heavy. You are stronger than Day 1.', 3),
  ('00000000-0000-0000-0000-000000002029','Max Push-Ups',              3,'Max',        'How far have you come from Day 1?', 4),
  ('00000000-0000-0000-0000-000000002029','Final 1-Mile Run',          1,'1 mile',     'For time. Compare to your starting pace.', 5)
ON CONFLICT DO NOTHING;

-- Day 30: Challenge Complete
INSERT INTO exercises (workout_id, name, sets, reps, notes, order_index) VALUES
  ('00000000-0000-0000-0000-000000002030','Sommer Sculpt Circuit',     1,'5 rounds',   '10 hip thrusts, 15 squats, 10 push-ups, 20 banded walks. All out.', 1),
  ('00000000-0000-0000-0000-000000002030','Glute Burnout',             2,'30 each',    'Donkey kicks, kickbacks, bridges. Every glute fiber.', 2),
  ('00000000-0000-0000-0000-000000002030','Core Finisher',             1,'10 min',     'Planks, V-ups, hollow holds. Make the abs cry one more time.', 3),
  ('00000000-0000-0000-0000-000000002030','Cool Down & Celebrate',     1,'10 min',     '30 days of showing up. You look different. You feel different. You are different.', 4)
ON CONFLICT DO NOTHING;


-- ============================================================
-- COUPLES AB — Days 8–21
-- ============================================================

INSERT INTO workouts (id, trainer, tier, day_number, title, description) VALUES
  ('00000000-0000-0000-0000-000000003008','couples','ab', 8, 'Stability & Balance Core', 'Single-leg and balance challenges that demand deep core strength.'),
  ('00000000-0000-0000-0000-000000003009','couples','ab', 9, 'Core Power Day',           'Explosive core work — power through every rep together.'),
  ('00000000-0000-0000-0000-000000003010','couples','ab',10, 'Ab Superset Circuit',      'Back-to-back ab pairs. No rest. Maximum stimulus.'),
  ('00000000-0000-0000-0000-000000003011','couples','ab',11, 'Isometric Core',           'Hold it. Long isometric holds that build real deep core strength.'),
  ('00000000-0000-0000-0000-000000003012','couples','ab',12, 'Core Cardio Blast II',     'Heart rate up, core engaged. Double the benefit.'),
  ('00000000-0000-0000-0000-000000003013','couples','ab',13, 'Lower Ab & Hip Work',      'The most requested area — targeted lower ab and hip flexor work.'),
  ('00000000-0000-0000-0000-000000003014','couples','ab',14, 'Rest & Deep Stretch',      'Two weeks done. Stretch it all out together.'),
  ('00000000-0000-0000-0000-000000003015','couples','ab',15, 'Core Strength Test',       'Heavier, harder, longer. Test how far you''ve come.'),
  ('00000000-0000-0000-0000-000000003016','couples','ab',16, 'Oblique Power',            'Side core dominance. Sculpt the waistline together.'),
  ('00000000-0000-0000-0000-000000003017','couples','ab',17, 'Full Core Circuit',        'Every plane of motion — front, sides, deep, and rotational.'),
  ('00000000-0000-0000-0000-000000003018','couples','ab',18, 'Anti-Rotation Core',       'Resist the twist. Build the most functional core strength.'),
  ('00000000-0000-0000-0000-000000003019','couples','ab',19, 'Core Endurance',           'High reps, low rest. Build the stamina to hold it for life.'),
  ('00000000-0000-0000-0000-000000003020','couples','ab',20, 'Peak AB Challenge',        'The hardest session. Pull from everything you''ve built.'),
  ('00000000-0000-0000-0000-000000003021','couples','ab',21, 'Day 21 — Challenge Complete','The final day. Every exercise, max effort, done together.')
ON CONFLICT DO NOTHING;

-- Day 8: Stability & Balance Core
INSERT INTO exercises (workout_id, name, sets, reps, notes, order_index, video_url) VALUES
  ('00000000-0000-0000-0000-000000003008','Single-Leg Glute Bridge',   3,'12 each',    'Hips level. Squeeze at the top. Core keeps you stable.', 1, '/videos/workout3.mp4'),
  ('00000000-0000-0000-0000-000000003008','Bird Dog (weighted)',        3,'10 each',    'Hold a light dumbbell. Makes the core work harder.', 2, '/videos/workout3.mp4'),
  ('00000000-0000-0000-0000-000000003008','Single-Leg Dead Bug',       3,'10 each',    'Lower one leg at a time. Spine stays neutral.', 3, '/videos/workout3.mp4'),
  ('00000000-0000-0000-0000-000000003008','Balance Plank (feet close)', 3,'30 sec',    'Narrow your base. Make the core stabilize.', 4, '/videos/workout3.mp4'),
  ('00000000-0000-0000-0000-000000003008','Pallof Press Hold',         3,'20 sec each','If you have a band. Anti-rotation at its finest.', 5, '/videos/workout3.mp4')
ON CONFLICT DO NOTHING;

-- Day 9: Core Power Day
INSERT INTO exercises (workout_id, name, sets, reps, notes, order_index) VALUES
  ('00000000-0000-0000-0000-000000003009','Medicine Ball Slam',        4,'12',         'Drive overhead then slam down. Explosive.', 1),
  ('00000000-0000-0000-0000-000000003009','V-Up',                      4,'12',         'Full extension. Meet hands and feet at the top.', 2),
  ('00000000-0000-0000-0000-000000003009','Tuck Jump',                 4,'10',         'Drive knees to chest. Land soft.', 3),
  ('00000000-0000-0000-0000-000000003009','Plank Up-Down',             3,'10 each',    'From forearm plank to straight arm and back.', 4),
  ('00000000-0000-0000-0000-000000003009','Hollow Rock',               3,'20',         'Rock forward and back while holding hollow position.', 5)
ON CONFLICT DO NOTHING;

-- Day 10: Ab Superset Circuit
INSERT INTO exercises (workout_id, name, sets, reps, notes, order_index) VALUES
  ('00000000-0000-0000-0000-000000003010','Crunch / Reverse Crunch',   4,'15 each',    'Superset. Upper then lower ab. No rest.', 1),
  ('00000000-0000-0000-0000-000000003010','Bicycle / Flutter Kick',    4,'15 each / 30 sec','Superset. Obliques then lower core.', 2),
  ('00000000-0000-0000-0000-000000003010','V-Up / Leg Raise',          4,'10 each',    'Superset. Full ab then lower ab.', 3),
  ('00000000-0000-0000-0000-000000003010','Side Plank / Plank',        3,'30 sec each','Superset. Hold each position.', 4),
  ('00000000-0000-0000-0000-000000003010','Hollow Body Hold',          3,'30 sec',     'Final hold. Everything braced.', 5)
ON CONFLICT DO NOTHING;

-- Day 11: Isometric Core
INSERT INTO exercises (workout_id, name, sets, reps, notes, order_index) VALUES
  ('00000000-0000-0000-0000-000000003011','Plank Hold',                4,'60 sec',     'Perfect position. No sagging hips.', 1),
  ('00000000-0000-0000-0000-000000003011','Side Plank Hold',           4,'45 sec each','Stack feet. Hips up. Hold.', 2),
  ('00000000-0000-0000-0000-000000003011','Hollow Body Hold',          4,'30 sec',     'Arms overhead. Legs straight. Lower back flat.', 3),
  ('00000000-0000-0000-0000-000000003011','Superman Hold',             4,'30 sec',     'Face down. Arms and legs off floor. Hold.', 4),
  ('00000000-0000-0000-0000-000000003011','Wall Sit with Core Brace',  3,'45 sec',     'Thighs parallel. Brace the abs. Double duty.', 5)
ON CONFLICT DO NOTHING;

-- Day 12: Core Cardio Blast II
INSERT INTO exercises (workout_id, name, sets, reps, notes, order_index) VALUES
  ('00000000-0000-0000-0000-000000003012','High Knees',                4,'45 sec',     'Drive knees up. Arms pump. Core tight.', 1),
  ('00000000-0000-0000-0000-000000003012','Burpee to Tuck Jump',       4,'8',          'Full burpee — explode into tuck at top.', 2),
  ('00000000-0000-0000-0000-000000003012','Mountain Climber',          4,'30 sec',     'Fast and controlled. Hips level.', 3),
  ('00000000-0000-0000-0000-000000003012','Bicycle Crunch',            4,'20 each',    'Slow tempo. Max range of motion.', 4),
  ('00000000-0000-0000-0000-000000003012','Plank to Pike Jump',        3,'10',         'From plank, jump feet toward hands.', 5)
ON CONFLICT DO NOTHING;

-- Day 13: Lower Ab & Hip Work
INSERT INTO exercises (workout_id, name, sets, reps, notes, order_index) VALUES
  ('00000000-0000-0000-0000-000000003013','Lying Leg Raise',           4,'15',         'Back flat. Lower legs slowly — feel it.', 1),
  ('00000000-0000-0000-0000-000000003013','Reverse Crunch',            4,'15',         'Tilt pelvis up at top. Don''t swing.', 2),
  ('00000000-0000-0000-0000-000000003013','Scissor Kicks',             4,'30 sec',     'Legs straight. Alternate opposing directions.', 3),
  ('00000000-0000-0000-0000-000000003013','Hip Flexor March',          3,'15 each',    'Standing. Drive knee up to hip height. Controlled.', 4),
  ('00000000-0000-0000-0000-000000003013','Dead Bug Slow',             3,'8 each',     '3-second lower on each rep. Maximum control.', 5)
ON CONFLICT DO NOTHING;

-- Day 14: Rest & Deep Stretch
INSERT INTO exercises (workout_id, name, sets, reps, notes, order_index) VALUES
  ('00000000-0000-0000-0000-000000003014','Full Body Foam Roll',       1,'10 min',     'Every muscle group. Thoracic spine focus.', 1),
  ('00000000-0000-0000-0000-000000003014','Lying Spinal Twist',        2,'60 sec each','Long, luxurious hold. Let it open.', 2),
  ('00000000-0000-0000-0000-000000003014','Hip Flexor Lunge Stretch',  2,'60 sec each','Two weeks of core work — open those hips.', 3),
  ('00000000-0000-0000-0000-000000003014','Child''s Pose',             2,'90 sec',     'Arms extended. Sink hips to heels. Breathe.', 4),
  ('00000000-0000-0000-0000-000000003014','Partner Breathing',         1,'5 min',      'Sit back to back. Match each other''s breath. Decompress.', 5)
ON CONFLICT DO NOTHING;

-- Day 15: Core Strength Test
INSERT INTO exercises (workout_id, name, sets, reps, notes, order_index) VALUES
  ('00000000-0000-0000-0000-000000003015','Weighted Sit-Up',           4,'15',         'Hold a plate at chest. Slow and strong.', 1),
  ('00000000-0000-0000-0000-000000003015','Plank Hold — Max Effort',   3,'Max',        'Hold until form breaks. Better than Day 1?', 2),
  ('00000000-0000-0000-0000-000000003015','Dragon Flag Negative',      4,'5',          'Lower as slowly as possible. Elite move.', 3),
  ('00000000-0000-0000-0000-000000003015','L-Sit Hold',                3,'15 sec',     'Hands on floor. Legs parallel. Hold.', 4),
  ('00000000-0000-0000-0000-000000003015','Ab Wheel Rollout',          4,'10',         'Arms straight. Brace hard. Don''t collapse.', 5)
ON CONFLICT DO NOTHING;

-- Day 16: Oblique Power
INSERT INTO exercises (workout_id, name, sets, reps, notes, order_index) VALUES
  ('00000000-0000-0000-0000-000000003016','Weighted Russian Twist',    4,'15 each',    'Feet raised, lean back. Full rotation.', 1),
  ('00000000-0000-0000-0000-000000003016','Side Plank Hip Dip',        4,'15 each',    'From side plank — dip and rise. Controlled.', 2),
  ('00000000-0000-0000-0000-000000003016','Oblique Crunch',            4,'15 each',    'Hands behind head. Elbow to knee.', 3),
  ('00000000-0000-0000-0000-000000003016','Woodchopper',               3,'12 each',    'Rotate fully. Use a dumbbell or band.', 4),
  ('00000000-0000-0000-0000-000000003016','Side Plank Hold',           3,'45 sec each','Fatigue the obliques at the end.', 5)
ON CONFLICT DO NOTHING;

-- Day 17: Full Core Circuit
INSERT INTO exercises (workout_id, name, sets, reps, notes, order_index) VALUES
  ('00000000-0000-0000-0000-000000003017','Plank Shoulder Tap',        4,'10 each',    'Minimize hip sway. Fight the rotation.', 1),
  ('00000000-0000-0000-0000-000000003017','V-Up',                      4,'12',         'Full extension every rep.', 2),
  ('00000000-0000-0000-0000-000000003017','Russian Twist',             4,'15 each',    'Slow and deliberate.', 3),
  ('00000000-0000-0000-0000-000000003017','Reverse Crunch',            4,'15',         'Peel the hips off the floor.', 4),
  ('00000000-0000-0000-0000-000000003017','Hollow Body Hold',          3,'45 sec',     'Hardest hold yet. Fight for every second.', 5)
ON CONFLICT DO NOTHING;

-- Day 18: Anti-Rotation Core
INSERT INTO exercises (workout_id, name, sets, reps, notes, order_index) VALUES
  ('00000000-0000-0000-0000-000000003018','Pallof Press',              4,'12 each',    'Band or cable. Press out and resist the pull.', 1),
  ('00000000-0000-0000-0000-000000003018','Plank Drag',                4,'10 each',    'Drag a weight across under the body. Don''t rotate.', 2),
  ('00000000-0000-0000-0000-000000003018','Renegade Row',              4,'8 each',     'From push-up position. Row one dumbbell. Resist rotation.', 3),
  ('00000000-0000-0000-0000-000000003018','Bird Dog Hold',             3,'10 each',    '3-second pause at extension. Do not rotate.', 4),
  ('00000000-0000-0000-0000-000000003018','Side Plank with Rotation',  3,'10 each',    'Rotate top arm under body then reach to ceiling.', 5)
ON CONFLICT DO NOTHING;

-- Day 19: Core Endurance
INSERT INTO exercises (workout_id, name, sets, reps, notes, order_index) VALUES
  ('00000000-0000-0000-0000-000000003019','Plank Hold',                5,'60 sec',     'Five sets. No excuses. Hold the line.', 1),
  ('00000000-0000-0000-0000-000000003019','Flutter Kicks',             5,'45 sec',     'Lower back pressed down the whole time.', 2),
  ('00000000-0000-0000-0000-000000003019','Bicycle Crunch',            5,'20 each',    'Slow tempo. All 5 sets. Stay tight.', 3),
  ('00000000-0000-0000-0000-000000003019','Hollow Rock',               4,'30 sec',     'Rock it. Maintain the shape.', 4),
  ('00000000-0000-0000-0000-000000003019','Side Plank',                4,'45 sec each','Both sides. Don''t drop.', 5)
ON CONFLICT DO NOTHING;

-- Day 20: Peak AB Challenge
INSERT INTO exercises (workout_id, name, sets, reps, notes, order_index) VALUES
  ('00000000-0000-0000-0000-000000003020','100 Crunches',              1,'100',        'For time. Go. Rest when you need to.', 1),
  ('00000000-0000-0000-0000-000000003020','50 Reverse Crunches',       1,'50',         'For time. Hips off the floor every rep.', 2),
  ('00000000-0000-0000-0000-000000003020','Max Plank Hold',            1,'Max',        'Hold until failure. This is your test.', 3),
  ('00000000-0000-0000-0000-000000003020','50 Bicycle Crunches each',  1,'50 each',    'Alternating. 100 total. Keep going.', 4),
  ('00000000-0000-0000-0000-000000003020','100 Flutter Kicks',         1,'100',        'Final test. All out. Leave nothing.', 5)
ON CONFLICT DO NOTHING;

-- Day 21: Challenge Complete
INSERT INTO exercises (workout_id, name, sets, reps, notes, order_index) VALUES
  ('00000000-0000-0000-0000-000000003021','Couples Core Circuit',      1,'5 rounds',   '10 V-ups, 20 bicycle crunches, 30 flutter kicks, 60-sec plank. Do it together.', 1),
  ('00000000-0000-0000-0000-000000003021','Partner Sit-Up High Five',  3,'20',         'Sit-up in sync. High five at the top. 21 days made this possible.', 2),
  ('00000000-0000-0000-0000-000000003021','Final Plank Hold',          2,'Max',        'Both of you. Go until one of you drops. Push each other.', 3),
  ('00000000-0000-0000-0000-000000003021','Cool Down Together',        1,'10 min',     '21 days. You both showed up. You both changed. Now go get those 30-day programs.', 4)
ON CONFLICT DO NOTHING;
