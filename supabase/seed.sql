-- Deegan Fitness — 30-Day Workout Seed
-- Haiden's actual regiment: 50mi cycling, 2hr moto, 1.5hr gym on training days
-- Weekly pattern: Mon-Wed training, Thu-Fri travel/light, Sat race, Sun recovery

-- ============================================================
-- ADMIN CREDENTIALS
-- ============================================================
INSERT INTO admin_credentials (username, password_hash) VALUES (
  'hnh_admin',
  '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918'
) ON CONFLICT (username) DO NOTHING;

-- ============================================================
-- MARCH 2026 CHALLENGE
-- ============================================================
INSERT INTO challenges (month, year, title, description, benchmark_cycling_miles, benchmark_moto_hours, benchmark_gym_hours, starts_at, ends_at) VALUES (
  3, 2026,
  'March Madness',
  'First month. Set the bar. 30 days of Haiden''s regiment — can you keep up?',
  650, 26, 19.5,
  '2026-03-01T00:00:00Z',
  '2026-03-31T23:59:59Z'
) ON CONFLICT (month, year) DO NOTHING;

INSERT INTO challenges (month, year, title, description, benchmark_cycling_miles, benchmark_moto_hours, benchmark_gym_hours, starts_at, ends_at, active) VALUES (
  4, 2026,
  'Supercross Send It',
  'Deep into the SX season. Match Haiden''s race-week intensity.',
  650, 26, 19.5,
  '2026-04-01T00:00:00Z',
  '2026-04-30T23:59:59Z',
  false
) ON CONFLICT (month, year) DO NOTHING;

-- ============================================================
-- WEEK 1: FOUNDATION
-- ============================================================

-- Day 1 (Monday) — Full Send: Foundation
INSERT INTO workouts (day_number, title, description, day_type) VALUES
  (1, 'Foundation Monday', 'Week 1 opener. Build the base. Every rep counts.', 'training');

INSERT INTO exercises (workout_id, block, name, duration, sets, reps, notes, hr_zone, order_index) VALUES
  ((SELECT id FROM workouts WHERE day_number = 1), 'cycling', '50-Mile Endurance Ride', '2.5-3 hrs', NULL, NULL, 'Flat to rolling terrain. Stay in Z2 for 80% of the ride. Build your aerobic engine.', 'Z2', 1),
  ((SELECT id FROM workouts WHERE day_number = 1), 'cycling', 'Cadence Drills', '15 min', '3', '5 min each', 'High cadence (100+ RPM) intervals within the ride. Seated, smooth pedal stroke.', 'Z3', 2),
  ((SELECT id FROM workouts WHERE day_number = 1), 'moto', 'Track Familiarization', '45 min', NULL, NULL, 'Easy laps. Focus on line selection, not speed. Find the flow.', 'Z2-Z3', 3),
  ((SELECT id FROM workouts WHERE day_number = 1), 'moto', 'Start Practice', '30 min', '10', NULL, 'Gate drops. Explosive off the line, settle into rhythm by turn 1.', 'Z5', 4),
  ((SELECT id FROM workouts WHERE day_number = 1), 'moto', 'Moto Simulation', '45 min', '2', '15 min each', 'Full race-pace motos. Push the whole way. Track your lap times.', 'Z4-Z5', 5),
  ((SELECT id FROM workouts WHERE day_number = 1), 'gym', 'Barbell Back Squat', NULL, '4', '8', 'Full depth. Control the eccentric. MX demands leg endurance.', NULL, 6),
  ((SELECT id FROM workouts WHERE day_number = 1), 'gym', 'Romanian Deadlift', NULL, '3', '10', 'Hamstring and posterior chain. Slow on the way down.', NULL, 7),
  ((SELECT id FROM workouts WHERE day_number = 1), 'gym', 'Pull-Ups', NULL, '4', '8-12', 'Strict form. Arm pump prevention starts here.', NULL, 8),
  ((SELECT id FROM workouts WHERE day_number = 1), 'gym', 'Dumbbell Shoulder Press', NULL, '3', '10', 'Standing. Core engaged. Simulates bar input forces.', NULL, 9),
  ((SELECT id FROM workouts WHERE day_number = 1), 'gym', 'Hanging Leg Raises', NULL, '3', '15', 'Full range. Core strength keeps you centered on the bike.', NULL, 10),
  ((SELECT id FROM workouts WHERE day_number = 1), 'gym', 'Farmer''s Walks', NULL, '3', '40m', 'Heavy. Grip strength directly fights arm pump.', NULL, 11);

-- Day 2 (Tuesday) — Power & Intervals
INSERT INTO workouts (day_number, title, description, day_type) VALUES
  (2, 'Power Tuesday', 'Intervals on the bike. Explosive drills on the track. Upper body in the gym.', 'training');

INSERT INTO exercises (workout_id, block, name, duration, sets, reps, notes, hr_zone, order_index) VALUES
  ((SELECT id FROM workouts WHERE day_number = 2), 'cycling', '50-Mile Interval Ride', '2.5-3 hrs', NULL, NULL, 'Z2 base with 6×5min Z4 intervals. 3min recovery between. Simulate race-day heart rate demands.', 'Z2/Z4', 1),
  ((SELECT id FROM workouts WHERE day_number = 2), 'cycling', 'Sprint Finish Drills', '10 min', '4', '30 sec', 'All-out 30-sec sprints in last 10 miles. Seated then standing alternating.', 'Z5', 2),
  ((SELECT id FROM workouts WHERE day_number = 2), 'moto', 'Whoops Section Work', '45 min', NULL, NULL, 'Repetition through whoops. Skim technique, body position, throttle control.', 'Z3-Z4', 3),
  ((SELECT id FROM workouts WHERE day_number = 2), 'moto', 'Rhythm Lane Combos', '30 min', NULL, NULL, 'Triple-triple-double combos. Find the fastest line through rhythm sections.', 'Z3', 4),
  ((SELECT id FROM workouts WHERE day_number = 2), 'moto', 'Sprint Motos', '45 min', '3', '10 min each', '10-minute sprint motos. Max intensity. Recover between.', 'Z5', 5),
  ((SELECT id FROM workouts WHERE day_number = 2), 'gym', 'Bench Press', NULL, '4', '8', 'Controlled. Push through the chest. Upper body endurance for 30+ min motos.', NULL, 6),
  ((SELECT id FROM workouts WHERE day_number = 2), 'gym', 'Barbell Bent-Over Row', NULL, '4', '10', 'Strict form. Lat strength = better bike control.', NULL, 7),
  ((SELECT id FROM workouts WHERE day_number = 2), 'gym', 'Dumbbell Lateral Raises', NULL, '3', '15', 'Light weight, high reps. Shoulder endurance.', NULL, 8),
  ((SELECT id FROM workouts WHERE day_number = 2), 'gym', 'EZ Bar Curls', NULL, '3', '12', 'Forearm and bicep endurance. Fight arm pump.', NULL, 9),
  ((SELECT id FROM workouts WHERE day_number = 2), 'gym', 'Plank Hold', NULL, '3', '60 sec', 'Brace like you''re absorbing a landing. Squeeze everything.', NULL, 10),
  ((SELECT id FROM workouts WHERE day_number = 2), 'gym', 'Wrist Roller', NULL, '3', '3 each way', 'Forearm-specific. This is your arm pump insurance.', NULL, 11);

-- Day 3 (Wednesday) — Endurance Grind
INSERT INTO workouts (day_number, title, description, day_type) VALUES
  (3, 'Endurance Wednesday', 'Long steady ride. Full motos on the track. Legs and core in the gym.', 'training');

INSERT INTO exercises (workout_id, block, name, duration, sets, reps, notes, hr_zone, order_index) VALUES
  ((SELECT id FROM workouts WHERE day_number = 3), 'cycling', '50-Mile Tempo Ride', '2.5-3 hrs', NULL, NULL, 'Sustained Z3 effort with climbing if available. Build mental toughness for late-moto fatigue.', 'Z3', 1),
  ((SELECT id FROM workouts WHERE day_number = 3), 'cycling', 'Climbing Repeats', '20 min', '4', '5 min', 'Find a hill. 5-min seated climbs at Z4. Recover on descent.', 'Z4', 2),
  ((SELECT id FROM workouts WHERE day_number = 3), 'moto', 'Full Moto #1', '20 min', '1', NULL, 'Full 20-minute moto at race pace. Push from gate drop to checkered flag.', 'Z4-Z5', 3),
  ((SELECT id FROM workouts WHERE day_number = 3), 'moto', 'Full Moto #2', '20 min', '1', NULL, 'Second full moto. This is where you find out what you''re made of.', 'Z4-Z5', 4),
  ((SELECT id FROM workouts WHERE day_number = 3), 'moto', 'Cool-Down Laps', '20 min', NULL, NULL, 'Easy pace. Work on corner technique and body position while heart rate comes down.', 'Z2', 5),
  ((SELECT id FROM workouts WHERE day_number = 3), 'gym', 'Front Squat', NULL, '4', '6', 'Upright torso. Mimics the standing attack position on the bike.', NULL, 6),
  ((SELECT id FROM workouts WHERE day_number = 3), 'gym', 'Walking Lunges', NULL, '3', '20 total', 'Weighted. Single-leg stability is everything in ruts and off-cambers.', NULL, 7),
  ((SELECT id FROM workouts WHERE day_number = 3), 'gym', 'Leg Press', NULL, '3', '15', 'High rep. Endurance focus. Legs can''t quit in moto 2.', NULL, 8),
  ((SELECT id FROM workouts WHERE day_number = 3), 'gym', 'Cable Woodchops', NULL, '3', '12 each side', 'Rotational core strength. Essential for cornering G-forces.', NULL, 9),
  ((SELECT id FROM workouts WHERE day_number = 3), 'gym', 'Dead Hang', NULL, '3', '45-60 sec', 'Grip endurance. Decompress the spine after moto.', NULL, 10),
  ((SELECT id FROM workouts WHERE day_number = 3), 'gym', 'Ab Wheel Rollouts', NULL, '3', '10', 'Full extension if possible. Bulletproof core.', NULL, 11);

-- Day 4 (Thursday) — Travel / Light
INSERT INTO workouts (day_number, title, description, day_type) VALUES
  (4, 'Travel Thursday', 'Travel day. Stay loose. Visualize. Prepare.', 'travel');

INSERT INTO exercises (workout_id, block, name, duration, sets, reps, notes, hr_zone, order_index) VALUES
  ((SELECT id FROM workouts WHERE day_number = 4), 'recovery', 'Dynamic Stretching', '20 min', NULL, NULL, 'Hip circles, leg swings, arm circles, thoracic rotations. Open everything up.', NULL, 1),
  ((SELECT id FROM workouts WHERE day_number = 4), 'recovery', 'Foam Rolling', '20 min', NULL, NULL, 'Quads, hamstrings, IT band, lats, thoracic spine. 2 min per area.', NULL, 2),
  ((SELECT id FROM workouts WHERE day_number = 4), 'recovery', 'Race Visualization', '15 min', NULL, NULL, 'Close your eyes. Walk the track in your mind. Every jump, every corner, every line.', NULL, 3),
  ((SELECT id FROM workouts WHERE day_number = 4), 'recovery', 'Light Walk or Easy Spin', '30 min', NULL, NULL, 'Keep the blood moving. 30 min easy spin on a stationary bike or walk.', 'Z1', 4);

-- Day 5 (Friday) — Pre-Race
INSERT INTO workouts (day_number, title, description, day_type) VALUES
  (5, 'Pre-Race Friday', 'Race weekend starts. Track walk. Bike prep. Lock in mentally.', 'travel');

INSERT INTO exercises (workout_id, block, name, duration, sets, reps, notes, hr_zone, order_index) VALUES
  ((SELECT id FROM workouts WHERE day_number = 5), 'recovery', 'Track Walk', '30 min', NULL, NULL, 'Walk the full track. Identify key sections, rut locations, jump faces. Build your race plan.', NULL, 1),
  ((SELECT id FROM workouts WHERE day_number = 5), 'recovery', 'Bike Prep & Tech Inspection', '45 min', NULL, NULL, 'Suspension settings, tire pressure, controls. Everything dialed before tomorrow.', NULL, 2),
  ((SELECT id FROM workouts WHERE day_number = 5), 'recovery', 'Activation Stretching', '15 min', NULL, NULL, 'Light activation: glute bridges, band walks, core breathing. Prime the nervous system.', NULL, 3),
  ((SELECT id FROM workouts WHERE day_number = 5), 'recovery', 'Mental Prep', '15 min', NULL, NULL, 'Race plan review. Visualize starts, first-lap scenarios, passing zones. Stay calm, stay sharp.', NULL, 4);

-- Day 6 (Saturday) — Race Day
INSERT INTO workouts (day_number, title, description, day_type) VALUES
  (6, 'Race Day', 'This is what we train for. Execute.', 'race');

INSERT INTO exercises (workout_id, block, name, duration, sets, reps, notes, hr_zone, order_index) VALUES
  ((SELECT id FROM workouts WHERE day_number = 6), 'race', 'Pre-Race Warm-Up', '25 min', NULL, NULL, '10 min stationary bike (Z2→Z3), dynamic stretches, 5 min band activation (shoulders, hips, glutes).', 'Z2-Z3', 1),
  ((SELECT id FROM workouts WHERE day_number = 6), 'race', 'Practice/Qualifying', '15-20 min', NULL, NULL, 'Find your lines. Check track conditions since walk. Dial in suspension if needed.', 'Z3-Z4', 2),
  ((SELECT id FROM workouts WHERE day_number = 6), 'race', 'Moto 1', '20+ min', '1', NULL, 'Full send. Holeshot attempt. Execute your race plan. Ride smart, ride fast.', 'Z4-Z5', 3),
  ((SELECT id FROM workouts WHERE day_number = 6), 'race', 'Between-Moto Recovery', '30-45 min', NULL, NULL, 'Light spin, hydrate, refuel (simple carbs + electrolytes). Stay warm. Stay focused.', 'Z1', 4),
  ((SELECT id FROM workouts WHERE day_number = 6), 'race', 'Moto 2', '20+ min', '1', NULL, 'Leave it all on the track. Dig deeper than moto 1. This is what separates champions.', 'Z5', 5),
  ((SELECT id FROM workouts WHERE day_number = 6), 'race', 'Post-Race Cooldown', '15 min', NULL, NULL, 'Easy spin, full-body stretch, hydrate immediately. Recovery starts now.', 'Z1', 6);

-- Day 7 (Sunday) — Recovery
INSERT INTO workouts (day_number, title, description, day_type) VALUES
  (7, 'Recovery Sunday', 'Earn tomorrow''s work by recovering today. Active rest, not couch rest.', 'recovery');

INSERT INTO exercises (workout_id, block, name, duration, sets, reps, notes, hr_zone, order_index) VALUES
  ((SELECT id FROM workouts WHERE day_number = 7), 'recovery', 'Easy Recovery Ride', '45-60 min', NULL, NULL, 'Flat terrain, conversational pace. Z1 only. Flush the legs.', 'Z1', 1),
  ((SELECT id FROM workouts WHERE day_number = 7), 'recovery', 'Full-Body Stretch Routine', '20 min', NULL, NULL, 'Hamstrings, quads, hip flexors, shoulders, thoracic spine. Hold each stretch 30+ sec.', NULL, 2),
  ((SELECT id FROM workouts WHERE day_number = 7), 'recovery', 'Foam Roll & Lacrosse Ball', '20 min', NULL, NULL, 'Deep tissue work. IT band, glutes, lats, forearms. Find the knots and work them out.', NULL, 3),
  ((SELECT id FROM workouts WHERE day_number = 7), 'recovery', 'Cold Plunge or Contrast Therapy', '10-15 min', NULL, NULL, '3 min cold / 3 min hot, repeat 2-3 times. Reduce inflammation, speed recovery.', NULL, 4),
  ((SELECT id FROM workouts WHERE day_number = 7), 'recovery', 'Nutrition & Hydration Focus', NULL, NULL, NULL, 'High protein meals. Extra water. Replenish glycogen stores. Sleep 8+ hours tonight.', NULL, 5);

-- ============================================================
-- WEEK 2: BUILD
-- ============================================================

-- Day 8 (Monday) — Strength Focus
INSERT INTO workouts (day_number, title, description, day_type) VALUES
  (8, 'Strength Monday', 'Week 2. Add weight. Add intensity. The base is set — now build on it.', 'training');

INSERT INTO exercises (workout_id, block, name, duration, sets, reps, notes, hr_zone, order_index) VALUES
  ((SELECT id FROM workouts WHERE day_number = 8), 'cycling', '50-Mile Z2 Ride w/ Surges', '2.5-3 hrs', NULL, NULL, 'Steady Z2 with 8×2min Z4 surges. Simulate race-pace accelerations within endurance ride.', 'Z2/Z4', 1),
  ((SELECT id FROM workouts WHERE day_number = 8), 'moto', 'Start Practice + Lap 1 Drill', '40 min', '12', NULL, 'Gate drop → nail turn 1 → settle into pace by turn 3. First lap wins races.', 'Z5', 2),
  ((SELECT id FROM workouts WHERE day_number = 8), 'moto', 'Race-Pace Motos', '50 min', '2', '20 min each', 'Full 20-min motos. Track lap times. Beat your Week 1 times.', 'Z4-Z5', 3),
  ((SELECT id FROM workouts WHERE day_number = 8), 'moto', 'Technical Section Focus', '30 min', NULL, NULL, 'Pick your weakest section — whoops, sand, off-cambers — and drill it.', 'Z3', 4),
  ((SELECT id FROM workouts WHERE day_number = 8), 'gym', 'Trap Bar Deadlift', NULL, '5', '5', 'Heavy. Build raw power. Full hip extension at the top.', NULL, 5),
  ((SELECT id FROM workouts WHERE day_number = 8), 'gym', 'Bulgarian Split Squats', NULL, '3', '10 each', 'Weighted. Single-leg strength for corner stability.', NULL, 6),
  ((SELECT id FROM workouts WHERE day_number = 8), 'gym', 'Weighted Pull-Ups', NULL, '4', '6', 'Add weight. Lat strength fights arm pump and controls the bike.', NULL, 7),
  ((SELECT id FROM workouts WHERE day_number = 8), 'gym', 'Landmine Press', NULL, '3', '10 each', 'Single-arm. Core anti-rotation + shoulder pressing in one.', NULL, 8),
  ((SELECT id FROM workouts WHERE day_number = 8), 'gym', 'Pallof Press', NULL, '3', '12 each side', 'Anti-rotation core. Resist the pull. Stay centered.', NULL, 9),
  ((SELECT id FROM workouts WHERE day_number = 8), 'gym', 'Grip Crushers', NULL, '3', '20', 'Heavy grip work. Your forearms are the connection to the bike.', NULL, 10);

-- Day 9 (Tuesday) — Speed & Power
INSERT INTO workouts (day_number, title, description, day_type) VALUES
  (9, 'Speed Tuesday', 'Short, hard efforts. Explosive movement. Race-day nervous system prep.', 'training');

INSERT INTO exercises (workout_id, block, name, duration, sets, reps, notes, hr_zone, order_index) VALUES
  ((SELECT id FROM workouts WHERE day_number = 9), 'cycling', '50-Mile VO2max Ride', '2.5-3 hrs', NULL, NULL, 'Z2 base with 5×4min Z5 intervals. Full recovery between. Push your ceiling.', 'Z2/Z5', 1),
  ((SELECT id FROM workouts WHERE day_number = 9), 'moto', 'Sprint Laps', '40 min', '8', '2 laps each', 'Max effort for 2 laps, full recovery. Fastest lap wins.', 'Z5', 2),
  ((SELECT id FROM workouts WHERE day_number = 9), 'moto', 'Scrub & Jump Technique', '40 min', NULL, NULL, 'Work on scrubbing jumps to save time in the air. Low, fast, efficient.', 'Z3', 3),
  ((SELECT id FROM workouts WHERE day_number = 9), 'moto', 'Race Simulation', '40 min', '2', '15 min each', 'Back-to-back motos with 10 min rest. Simulate double-header fatigue.', 'Z4-Z5', 4),
  ((SELECT id FROM workouts WHERE day_number = 9), 'gym', 'Box Jumps', NULL, '4', '5', 'Explosive. Step down. Reset. Quality over quantity.', NULL, 5),
  ((SELECT id FROM workouts WHERE day_number = 9), 'gym', 'Incline Dumbbell Press', NULL, '4', '8', 'Upper chest and shoulder endurance. Stabilizers work hard here.', NULL, 6),
  ((SELECT id FROM workouts WHERE day_number = 9), 'gym', 'Cable Face Pulls', NULL, '3', '15', 'Rear delt and rotator cuff health. Prevent shoulder injuries.', NULL, 7),
  ((SELECT id FROM workouts WHERE day_number = 9), 'gym', 'Barbell Curl + Tricep Pushdown', NULL, '3', '12 each', 'Superset. Arm endurance for gripping the bars 30+ minutes.', NULL, 8),
  ((SELECT id FROM workouts WHERE day_number = 9), 'gym', 'Russian Twists', NULL, '3', '20 total', 'Weighted. Rotational power for cornering.', NULL, 9),
  ((SELECT id FROM workouts WHERE day_number = 9), 'gym', 'Reverse Wrist Curls', NULL, '3', '20', 'Extensor balance. Prevents forearm imbalance from gripping.', NULL, 10);

-- Day 10 (Wednesday) — Grind Day
INSERT INTO workouts (day_number, title, description, day_type) VALUES
  (10, 'Grind Wednesday', 'Volume day. Long ride. Long motos. Full gym session. Embrace the suck.', 'training');

INSERT INTO exercises (workout_id, block, name, duration, sets, reps, notes, hr_zone, order_index) VALUES
  ((SELECT id FROM workouts WHERE day_number = 10), 'cycling', '50-Mile Sustained Tempo', '2.5-3 hrs', NULL, NULL, 'Hold Z3 for the majority. Simulate the sustained effort of a 30-minute moto.', 'Z3', 1),
  ((SELECT id FROM workouts WHERE day_number = 10), 'moto', 'Endurance Moto', '25 min', '1', NULL, '25-minute moto. Longer than any race. Build the engine.', 'Z4', 2),
  ((SELECT id FROM workouts WHERE day_number = 10), 'moto', 'Cornering Clinic', '35 min', NULL, NULL, 'Inside ruts, outside berms, flat turns. Perfect every type of corner.', 'Z3', 3),
  ((SELECT id FROM workouts WHERE day_number = 10), 'moto', 'Gate-to-Flag Full Moto', '20 min', '1', NULL, 'Full race simulation. Pretend the points count.', 'Z4-Z5', 4),
  ((SELECT id FROM workouts WHERE day_number = 10), 'gym', 'Sumo Deadlift', NULL, '4', '8', 'Wide stance, targets inner thigh and glutes. Standing bike position strength.', NULL, 5),
  ((SELECT id FROM workouts WHERE day_number = 10), 'gym', 'Step-Ups', NULL, '3', '12 each', 'Weighted. High box. Drive through the heel.', NULL, 6),
  ((SELECT id FROM workouts WHERE day_number = 10), 'gym', 'Dumbbell Row', NULL, '4', '10 each', 'Heavy. Back strength keeps you from getting pushed around on the bike.', NULL, 7),
  ((SELECT id FROM workouts WHERE day_number = 10), 'gym', 'TRX Body Saw', NULL, '3', '12', 'Feet in straps, plank position, saw back and forth. Anti-extension core.', NULL, 8),
  ((SELECT id FROM workouts WHERE day_number = 10), 'gym', 'Battle Ropes', NULL, '3', '30 sec', 'All-out effort. Shoulder and grip endurance under fatigue.', NULL, 9),
  ((SELECT id FROM workouts WHERE day_number = 10), 'gym', 'Dead Hang + Knee Raises', NULL, '3', '10', 'Hang for grip, raise knees for core. Two-for-one.', NULL, 10);

-- Day 11 (Thursday) — Travel/Light
INSERT INTO workouts (day_number, title, description, day_type) VALUES
  (11, 'Travel Thursday', 'Travel day. Keep moving, stay loose, review your Week 2 progress.', 'travel');

INSERT INTO exercises (workout_id, block, name, duration, sets, reps, notes, hr_zone, order_index) VALUES
  ((SELECT id FROM workouts WHERE day_number = 11), 'recovery', 'Mobility Flow', '25 min', NULL, NULL, 'Yoga-inspired flow: downward dog, pigeon pose, warrior series, spinal twists.', NULL, 1),
  ((SELECT id FROM workouts WHERE day_number = 11), 'recovery', 'Foam Roll Session', '20 min', NULL, NULL, 'Full body. Extra time on quads and IT band — they took a beating this week.', NULL, 2),
  ((SELECT id FROM workouts WHERE day_number = 11), 'recovery', 'Race Video Review', '20 min', NULL, NULL, 'Watch your own footage or Haiden''s races. Study lines, body position, technique.', NULL, 3),
  ((SELECT id FROM workouts WHERE day_number = 11), 'recovery', 'Light Stationary Spin', '25 min', NULL, NULL, 'Easy spin. Just moving blood. Keep cadence smooth and effort minimal.', 'Z1', 4);

-- Day 12 (Friday) — Pre-Race
INSERT INTO workouts (day_number, title, description, day_type) VALUES
  (12, 'Pre-Race Friday', 'Track walk. Final prep. You know the drill — stay sharp, stay calm.', 'travel');

INSERT INTO exercises (workout_id, block, name, duration, sets, reps, notes, hr_zone, order_index) VALUES
  ((SELECT id FROM workouts WHERE day_number = 12), 'recovery', 'Track Walk & Analysis', '30 min', NULL, NULL, 'Walk every inch. Note changes from last week. Identify new rut formations and passing zones.', NULL, 1),
  ((SELECT id FROM workouts WHERE day_number = 12), 'recovery', 'Suspension Check', '30 min', NULL, NULL, 'Sag, clickers, air pressure — everything adjusted for this track''s conditions.', NULL, 2),
  ((SELECT id FROM workouts WHERE day_number = 12), 'recovery', 'Band Activation Circuit', '15 min', NULL, NULL, 'Glute bridges, monster walks, shoulder external rotations. Wake up the stabilizers.', NULL, 3),
  ((SELECT id FROM workouts WHERE day_number = 12), 'recovery', 'Visualization & Breathwork', '15 min', NULL, NULL, 'Box breathing (4-4-4-4). Visualize start, first lap, passing scenarios, last-lap charge.', NULL, 4);

-- Day 13 (Saturday) — Race Day
INSERT INTO workouts (day_number, title, description, day_type) VALUES
  (13, 'Race Day', 'Week 2 race. Take what you learned. Execute better than last week.', 'race');

INSERT INTO exercises (workout_id, block, name, duration, sets, reps, notes, hr_zone, order_index) VALUES
  ((SELECT id FROM workouts WHERE day_number = 13), 'race', 'Pre-Race Warm-Up', '25 min', NULL, NULL, 'Stationary bike → dynamic stretches → band activation. Same routine every race.', 'Z2-Z3', 1),
  ((SELECT id FROM workouts WHERE day_number = 13), 'race', 'Practice/Qualifying', '15-20 min', NULL, NULL, 'Refine your lines. Check conditions since walk. Qualify strong.', 'Z3-Z4', 2),
  ((SELECT id FROM workouts WHERE day_number = 13), 'race', 'Moto 1', '20+ min', '1', NULL, 'Execute. Holeshot, hit your marks, manage the race. Ride smart.', 'Z4-Z5', 3),
  ((SELECT id FROM workouts WHERE day_number = 13), 'race', 'Recovery Between Motos', '30-45 min', NULL, NULL, 'Spin, hydrate, refuel. Review moto 1 — what worked, what to adjust.', 'Z1', 4),
  ((SELECT id FROM workouts WHERE day_number = 13), 'race', 'Moto 2', '20+ min', '1', NULL, 'Deeper. Harder. This is where champions are made. Empty the tank.', 'Z5', 5),
  ((SELECT id FROM workouts WHERE day_number = 13), 'race', 'Post-Race Recovery', '15 min', NULL, NULL, 'Cooldown spin, stretch, hydrate, eat within 30 min of finish.', 'Z1', 6);

-- Day 14 (Sunday) — Recovery
INSERT INTO workouts (day_number, title, description, day_type) VALUES
  (14, 'Recovery Sunday', '2 weeks down. Your body is adapting. Let it.', 'recovery');

INSERT INTO exercises (workout_id, block, name, duration, sets, reps, notes, hr_zone, order_index) VALUES
  ((SELECT id FROM workouts WHERE day_number = 14), 'recovery', 'Easy Recovery Ride', '45 min', NULL, NULL, 'Conversational pace. Z1 only. Enjoy the ride — no power meter, no targets.', 'Z1', 1),
  ((SELECT id FROM workouts WHERE day_number = 14), 'recovery', 'Yoga / Deep Stretch', '30 min', NULL, NULL, 'Full yoga flow or deep static stretching. Focus on hips, shoulders, and thoracic spine.', NULL, 2),
  ((SELECT id FROM workouts WHERE day_number = 14), 'recovery', 'Ice Bath or Cold Plunge', '10 min', NULL, NULL, '50-55°F water. 10 minutes. Breathe through it. Reduce inflammation.', NULL, 3),
  ((SELECT id FROM workouts WHERE day_number = 14), 'recovery', 'Weekly Review', '15 min', NULL, NULL, 'Log your Week 2 numbers. Compare to Week 1. Where did you improve? Where do you need work?', NULL, 4);

-- ============================================================
-- WEEK 3: INTENSITY
-- ============================================================

-- Day 15 (Monday) — Threshold Builder
INSERT INTO workouts (day_number, title, description, day_type) VALUES
  (15, 'Threshold Monday', 'Week 3. Time to push the ceiling. Higher intensity across the board.', 'training');

INSERT INTO exercises (workout_id, block, name, duration, sets, reps, notes, hr_zone, order_index) VALUES
  ((SELECT id FROM workouts WHERE day_number = 15), 'cycling', '50-Mile Threshold Ride', '2.5-3 hrs', NULL, NULL, 'Extended Z3-Z4 effort. 2×20min at threshold with 5min Z2 recovery between.', 'Z3-Z4', 1),
  ((SELECT id FROM workouts WHERE day_number = 15), 'moto', 'Qualifying Simulation', '30 min', '6', '2 laps each', 'Hot laps. Fastest 2 laps you can put together. Gate to checkered flag mentality.', 'Z5', 2),
  ((SELECT id FROM workouts WHERE day_number = 15), 'moto', 'Race Simulation with Passes', '45 min', '2', '20 min each', 'Start mid-pack intentionally. Practice passing under pressure.', 'Z4-Z5', 3),
  ((SELECT id FROM workouts WHERE day_number = 15), 'moto', 'Sand / Soft Terrain Drill', '30 min', NULL, NULL, 'If available. Standing technique, throttle management in deep sand/loam.', 'Z3-Z4', 4),
  ((SELECT id FROM workouts WHERE day_number = 15), 'gym', 'Back Squat (Heavy)', NULL, '5', '3', 'Heavy triples. Build peak strength. Full depth, controlled.', NULL, 5),
  ((SELECT id FROM workouts WHERE day_number = 15), 'gym', 'Glute-Ham Raise', NULL, '3', '8', 'Hamstring and posterior chain. Brutal but essential.', NULL, 6),
  ((SELECT id FROM workouts WHERE day_number = 15), 'gym', 'Weighted Chin-Ups', NULL, '4', '5', 'Supinated grip. Bicep-heavy pull. Fights arm fatigue on the bike.', NULL, 7),
  ((SELECT id FROM workouts WHERE day_number = 15), 'gym', 'Arnold Press', NULL, '3', '10', 'Rotation at the top. Full shoulder ROM under load.', NULL, 8),
  ((SELECT id FROM workouts WHERE day_number = 15), 'gym', 'Ab Wheel + Side Plank', NULL, '3', '8 + 30s each', 'Superset. Front and lateral core stability.', NULL, 9),
  ((SELECT id FROM workouts WHERE day_number = 15), 'gym', 'Towel Grip Rows', NULL, '3', '10', 'Hang a towel over a bar. Row it. Grip-specific work.', NULL, 10);

-- Day 16 (Tuesday) — Race Fitness
INSERT INTO workouts (day_number, title, description, day_type) VALUES
  (16, 'Race Fitness Tuesday', 'Train at race intensity. Your body needs to know what''s coming.', 'training');

INSERT INTO exercises (workout_id, block, name, duration, sets, reps, notes, hr_zone, order_index) VALUES
  ((SELECT id FROM workouts WHERE day_number = 16), 'cycling', '50-Mile Race-Effort Ride', '2.5 hrs', NULL, NULL, 'First 30 miles Z2-Z3, last 20 miles sustained Z4. Finish strong when legs want to quit.', 'Z2-Z4', 1),
  ((SELECT id FROM workouts WHERE day_number = 16), 'moto', 'Back-to-Back Motos', '50 min', '3', '15 min each', 'Three 15-min motos with only 5 min rest between. Build race-day endurance.', 'Z4-Z5', 2),
  ((SELECT id FROM workouts WHERE day_number = 16), 'moto', 'Late-Moto Charge Drill', '30 min', NULL, NULL, 'After you''re tired from motos, do 5 all-out sprint laps. Dig deep when you have nothing left.', 'Z5', 3),
  ((SELECT id FROM workouts WHERE day_number = 16), 'gym', 'Dumbbell Complex', NULL, '4', '8 each', 'Clean → press → squat → row. No rest between movements. 90 sec rest between sets.', NULL, 4),
  ((SELECT id FROM workouts WHERE day_number = 16), 'gym', 'Nordic Hamstring Curls', NULL, '3', '6', 'Eccentric focus. Slow on the way down. Injury prevention essential.', NULL, 5),
  ((SELECT id FROM workouts WHERE day_number = 16), 'gym', 'Push-Up Variations', NULL, '3', '15', 'Wide, narrow, staggered. Each set different grip. Shoulder stabilization.', NULL, 6),
  ((SELECT id FROM workouts WHERE day_number = 16), 'gym', 'Hanging Windshield Wipers', NULL, '3', '8 each side', 'Advanced core. Control the rotation. No swinging.', NULL, 7),
  ((SELECT id FROM workouts WHERE day_number = 16), 'gym', 'Forearm Burnout Circuit', NULL, '2', '3 min', 'Wrist curls → reverse curls → grip squeeze → dead hang. No rest. Burn it out.', NULL, 8);

-- Day 17 (Wednesday) — Peak Day
INSERT INTO workouts (day_number, title, description, day_type) VALUES
  (17, 'Peak Wednesday', 'Highest intensity training day of the program. Prove what you''re capable of.', 'training');

INSERT INTO exercises (workout_id, block, name, duration, sets, reps, notes, hr_zone, order_index) VALUES
  ((SELECT id FROM workouts WHERE day_number = 17), 'cycling', '50-Mile Hill Repeat Special', '2.5-3 hrs', NULL, NULL, 'Find a climb. 6×3min Z5 hill repeats within your 50 miles. Recover on the flats.', 'Z2/Z5', 1),
  ((SELECT id FROM workouts WHERE day_number = 17), 'moto', 'Time Attack', '40 min', NULL, NULL, 'Set a benchmark lap time. Then try to beat it every lap. Log your best.', 'Z5', 2),
  ((SELECT id FROM workouts WHERE day_number = 17), 'moto', 'Full Race Simulation', '20 min', '1', NULL, 'Full 20-min moto. This one counts. Push harder than you think you can.', 'Z5', 3),
  ((SELECT id FROM workouts WHERE day_number = 17), 'moto', 'Technical Work (tired)', '20 min', NULL, NULL, 'After the moto, work on technique while fatigued. This is where real learning happens.', 'Z3', 4),
  ((SELECT id FROM workouts WHERE day_number = 17), 'gym', 'Squat + Box Jump Superset', NULL, '4', '5+3', 'Heavy squat × 5 immediately into 3 box jumps. Power conversion.', NULL, 5),
  ((SELECT id FROM workouts WHERE day_number = 17), 'gym', 'Weighted Dips', NULL, '4', '8', 'Chest and tricep pressing power. Translate to bike control.', NULL, 6),
  ((SELECT id FROM workouts WHERE day_number = 17), 'gym', 'Pendlay Row', NULL, '4', '6', 'Explosive from the floor. Dead stop each rep. Back power.', NULL, 7),
  ((SELECT id FROM workouts WHERE day_number = 17), 'gym', 'Turkish Get-Up', NULL, '3', '3 each', 'Full-body stability. Slow, controlled, heavy. Ultimate functional movement.', NULL, 8),
  ((SELECT id FROM workouts WHERE day_number = 17), 'gym', 'Sled Push', NULL, '4', '40m', 'Heavy. Drive through the legs. Full-body finish to the week.', NULL, 9);

-- Day 18 (Thursday) — Travel/Light
INSERT INTO workouts (day_number, title, description, day_type) VALUES
  (18, 'Travel Thursday', 'Recover from peak day. Light movement and mental prep.', 'travel');

INSERT INTO exercises (workout_id, block, name, duration, sets, reps, notes, hr_zone, order_index) VALUES
  ((SELECT id FROM workouts WHERE day_number = 18), 'recovery', 'Easy Walk + Stretching', '30 min', NULL, NULL, 'Walk outside. Fresh air. Stretch what''s tight. Nothing intense.', NULL, 1),
  ((SELECT id FROM workouts WHERE day_number = 18), 'recovery', 'Foam Roll & Recovery', '20 min', NULL, NULL, 'Deep tissue. Hit everything. You earned it after yesterday.', NULL, 2),
  ((SELECT id FROM workouts WHERE day_number = 18), 'recovery', 'Visualization', '15 min', NULL, NULL, 'Close your eyes. Race the track in your mind. Win in your head before you win on the track.', NULL, 3);

-- Day 19 (Friday) — Pre-Race
INSERT INTO workouts (day_number, title, description, day_type) VALUES
  (19, 'Pre-Race Friday', 'Same routine. Same focus. Consistency breeds confidence.', 'travel');

INSERT INTO exercises (workout_id, block, name, duration, sets, reps, notes, hr_zone, order_index) VALUES
  ((SELECT id FROM workouts WHERE day_number = 19), 'recovery', 'Track Walk', '30 min', NULL, NULL, 'Know this track like the back of your hand. Every bump, every kicker, every braking zone.', NULL, 1),
  ((SELECT id FROM workouts WHERE day_number = 19), 'recovery', 'Bike Final Prep', '30 min', NULL, NULL, 'Everything perfect. Check chain, sprockets, air filter, controls. No excuses tomorrow.', NULL, 2),
  ((SELECT id FROM workouts WHERE day_number = 19), 'recovery', 'Activation + Mental Prep', '20 min', NULL, NULL, 'Light activation, breathwork, race plan review. Ready.', NULL, 3);

-- Day 20 (Saturday) — Race Day
INSERT INTO workouts (day_number, title, description, day_type) VALUES
  (20, 'Race Day', 'Week 3 race. You''re stronger. You''re faster. Show it.', 'race');

INSERT INTO exercises (workout_id, block, name, duration, sets, reps, notes, hr_zone, order_index) VALUES
  ((SELECT id FROM workouts WHERE day_number = 20), 'race', 'Pre-Race Warm-Up', '25 min', NULL, NULL, 'Same protocol. Consistency. Bike → stretch → bands → ready.', 'Z2-Z3', 1),
  ((SELECT id FROM workouts WHERE day_number = 20), 'race', 'Qualifying', '15-20 min', NULL, NULL, 'Push for a qualifying time. Gate pick matters. Earn the inside.', 'Z4-Z5', 2),
  ((SELECT id FROM workouts WHERE day_number = 20), 'race', 'Moto 1', '20+ min', '1', NULL, 'Execute. You''ve done more motos this week than anyone. Trust the work.', 'Z4-Z5', 3),
  ((SELECT id FROM workouts WHERE day_number = 20), 'race', 'Recovery Between', '30-45 min', NULL, NULL, 'You know the drill. Spin, hydrate, eat, focus.', 'Z1', 4),
  ((SELECT id FROM workouts WHERE day_number = 20), 'race', 'Moto 2', '20+ min', '1', NULL, 'This is the moto that matters. When everyone else is fading, you''re just getting started.', 'Z5', 5),
  ((SELECT id FROM workouts WHERE day_number = 20), 'race', 'Post-Race Cooldown', '15 min', NULL, NULL, 'Spin, stretch, hydrate, eat. Three weeks of hard work in the body. Recovery tonight.', 'Z1', 6);

-- Day 21 (Sunday) — Recovery
INSERT INTO workouts (day_number, title, description, day_type) VALUES
  (21, 'Recovery Sunday', '3 weeks in. Your fitness has changed. Respect the recovery.', 'recovery');

INSERT INTO exercises (workout_id, block, name, duration, sets, reps, notes, hr_zone, order_index) VALUES
  ((SELECT id FROM workouts WHERE day_number = 21), 'recovery', 'Recovery Ride', '45 min', NULL, NULL, 'Z1 cruise. Enjoy it. You''ve earned this easy day.', 'Z1', 1),
  ((SELECT id FROM workouts WHERE day_number = 21), 'recovery', 'Deep Stretch Session', '25 min', NULL, NULL, 'Full body. Hold each position 45-60 seconds. Breathe into the stretch.', NULL, 2),
  ((SELECT id FROM workouts WHERE day_number = 21), 'recovery', 'Cold/Contrast Therapy', '12 min', NULL, NULL, 'Cold plunge or contrast showers. Reset the nervous system.', NULL, 3),
  ((SELECT id FROM workouts WHERE day_number = 21), 'recovery', 'Progress Check', '15 min', NULL, NULL, 'Log Week 3 stats. Cycling times, moto lap times, gym numbers. You should see gains.', NULL, 4);

-- ============================================================
-- WEEK 4: RACE WEEK / PEAK & TAPER
-- ============================================================

-- Day 22 (Monday) — Controlled Intensity
INSERT INTO workouts (day_number, title, description, day_type) VALUES
  (22, 'Sharp Monday', 'Final training week. Stay sharp, don''t overtrain. Quality over volume.', 'training');

INSERT INTO exercises (workout_id, block, name, duration, sets, reps, notes, hr_zone, order_index) VALUES
  ((SELECT id FROM workouts WHERE day_number = 22), 'cycling', '50-Mile Sharpening Ride', '2.5 hrs', NULL, NULL, 'Z2 with 4×3min Z4 race-pace efforts. Shorter intervals than last week. Stay fresh.', 'Z2/Z4', 1),
  ((SELECT id FROM workouts WHERE day_number = 22), 'moto', 'Quality Laps', '40 min', NULL, NULL, 'Smooth, fast, controlled laps. Focus on consistency — every lap within 1 second.', 'Z3-Z4', 2),
  ((SELECT id FROM workouts WHERE day_number = 22), 'moto', 'Start Practice', '20 min', '8', NULL, 'Gate drops. Lock in your reaction. This is muscle memory for race day.', 'Z5', 3),
  ((SELECT id FROM workouts WHERE day_number = 22), 'moto', 'Light Technical', '20 min', NULL, NULL, 'Easy pace through technical sections. Refine, don''t strain.', 'Z2-Z3', 4),
  ((SELECT id FROM workouts WHERE day_number = 22), 'gym', 'Back Squat (Moderate)', NULL, '3', '5', 'Moderate weight. Stay strong but not fatigued. 80% of Week 3 loads.', NULL, 5),
  ((SELECT id FROM workouts WHERE day_number = 22), 'gym', 'Pull-Ups', NULL, '3', '8', 'Bodyweight. Crisp form. Maintain back strength.', NULL, 6),
  ((SELECT id FROM workouts WHERE day_number = 22), 'gym', 'Dumbbell Press', NULL, '3', '8', 'Moderate. Stay fresh for racing this weekend.', NULL, 7),
  ((SELECT id FROM workouts WHERE day_number = 22), 'gym', 'Core Circuit', NULL, '2', '3 min', 'Plank → side plank L → side plank R → dead bugs. 45 sec each, 2 rounds.', NULL, 8),
  ((SELECT id FROM workouts WHERE day_number = 22), 'gym', 'Grip Work', NULL, '2', '60 sec', 'Dead hangs and grip crushers. Keep the forearms primed.', NULL, 9);

-- Day 23 (Tuesday) — Speed & Confidence
INSERT INTO workouts (day_number, title, description, day_type) VALUES
  (23, 'Confidence Tuesday', 'Short and sharp. Build confidence. Remind yourself how fast you are.', 'training');

INSERT INTO exercises (workout_id, block, name, duration, sets, reps, notes, hr_zone, order_index) VALUES
  ((SELECT id FROM workouts WHERE day_number = 23), 'cycling', '50-Mile Confidence Ride', '2.5 hrs', NULL, NULL, 'Z2 cruise with 3×2min hard efforts. Feel fast, don''t drain. Enjoy the legs.', 'Z2/Z4', 1),
  ((SELECT id FROM workouts WHERE day_number = 23), 'moto', 'Hot Laps', '30 min', '5', '2 laps each', 'Short, fast bursts. Feel the speed. Don''t overdo it.', 'Z5', 2),
  ((SELECT id FROM workouts WHERE day_number = 23), 'moto', 'Flow Laps', '30 min', NULL, NULL, 'Smooth, rhythmic riding. Find the flow state. This is where you ride your best.', 'Z3', 3),
  ((SELECT id FROM workouts WHERE day_number = 23), 'gym', 'Explosive Circuit', NULL, '3', '3 rounds', 'Box jump × 3 → med ball slam × 5 → kettlebell swing × 8. Explosive, not exhausting.', NULL, 4),
  ((SELECT id FROM workouts WHERE day_number = 23), 'gym', 'Band Work', NULL, '2', '15 each', 'Pull-aparts, external rotations, monster walks. Activation, not fatigue.', NULL, 5),
  ((SELECT id FROM workouts WHERE day_number = 23), 'gym', 'Stretching & Core', NULL, '1', '15 min', 'Light core work + full stretch. Leave feeling loose and ready.', NULL, 6);

-- Day 24 (Wednesday) — Last Hard Day
INSERT INTO workouts (day_number, title, description, day_type) VALUES
  (24, 'Final Push Wednesday', 'Last real training day of the month. Give it everything. Then rest.', 'training');

INSERT INTO exercises (workout_id, block, name, duration, sets, reps, notes, hr_zone, order_index) VALUES
  ((SELECT id FROM workouts WHERE day_number = 24), 'cycling', '50-Mile Everything Ride', '2.5-3 hrs', NULL, NULL, 'Z2 → Z3 → Z4 progressive ride. Last 10 miles at sustained threshold. Finish strong.', 'Z2-Z4', 1),
  ((SELECT id FROM workouts WHERE day_number = 24), 'moto', 'Full Race Simulation', '20 min', '1', NULL, 'Full moto. Give it everything. This is your final test.', 'Z5', 2),
  ((SELECT id FROM workouts WHERE day_number = 24), 'moto', 'Cool Down + Technique', '30 min', NULL, NULL, 'Easy laps. Focus on form. End the training block clean.', 'Z2', 3),
  ((SELECT id FROM workouts WHERE day_number = 24), 'gym', 'Full Body Circuit', NULL, '3', '3 rounds', 'Squat × 8 → row × 8 → press × 8 → deadlift × 8. Moderate weight. Solid effort.', NULL, 4),
  ((SELECT id FROM workouts WHERE day_number = 24), 'gym', 'Farmer''s Walk Finisher', NULL, '3', '60m', 'Heavy. This is the last gym session of the month. Earn it.', NULL, 5),
  ((SELECT id FROM workouts WHERE day_number = 24), 'gym', 'Ab Wheel + Stretch', NULL, '3', '8 + 10 min', 'Core work then deep stretch. Close out the training block right.', NULL, 6);

-- Day 25 (Thursday) — Taper
INSERT INTO workouts (day_number, title, description, day_type) VALUES
  (25, 'Taper Thursday', 'The hard work is done. Now let it absorb. Light movement only.', 'travel');

INSERT INTO exercises (workout_id, block, name, duration, sets, reps, notes, hr_zone, order_index) VALUES
  ((SELECT id FROM workouts WHERE day_number = 25), 'recovery', 'Easy Spin', '30 min', NULL, NULL, 'Z1 only. Legs should feel springy by the end.', 'Z1', 1),
  ((SELECT id FROM workouts WHERE day_number = 25), 'recovery', 'Full-Body Mobility', '25 min', NULL, NULL, 'Hip, shoulder, ankle, thoracic. Open everything up. Move freely.', NULL, 2),
  ((SELECT id FROM workouts WHERE day_number = 25), 'recovery', 'Foam Roll', '15 min', NULL, NULL, 'Quick pass over everything. Nothing too aggressive.', NULL, 3);

-- Day 26 (Friday) — Pre-Race
INSERT INTO workouts (day_number, title, description, day_type) VALUES
  (26, 'Pre-Race Friday', 'Month-end race. You''re peaking. Trust the process.', 'travel');

INSERT INTO exercises (workout_id, block, name, duration, sets, reps, notes, hr_zone, order_index) VALUES
  ((SELECT id FROM workouts WHERE day_number = 26), 'recovery', 'Track Walk', '30 min', NULL, NULL, 'Final track walk of the month. You know your lines. Confirm them.', NULL, 1),
  ((SELECT id FROM workouts WHERE day_number = 26), 'recovery', 'Bike Check', '30 min', NULL, NULL, 'Everything dialed. This is your weapon. Make sure it''s perfect.', NULL, 2),
  ((SELECT id FROM workouts WHERE day_number = 26), 'recovery', 'Activation + Visualization', '20 min', NULL, NULL, 'Light activation. Deep visualization. You''ve done the work. Now execute.', NULL, 3);

-- Day 27 (Saturday) — Race Day (Month Finale)
INSERT INTO workouts (day_number, title, description, day_type) VALUES
  (27, 'Race Day — Month Finale', 'Last race of the 30-day block. This is your exam. Show what you built.', 'race');

INSERT INTO exercises (workout_id, block, name, duration, sets, reps, notes, hr_zone, order_index) VALUES
  ((SELECT id FROM workouts WHERE day_number = 27), 'race', 'Pre-Race Warm-Up', '25 min', NULL, NULL, 'Same routine. Lock in. This is your best race of the month.', 'Z2-Z3', 1),
  ((SELECT id FROM workouts WHERE day_number = 27), 'race', 'Qualifying', '15-20 min', NULL, NULL, 'Best qualifying effort of the month. Earn the gate pick.', 'Z4-Z5', 2),
  ((SELECT id FROM workouts WHERE day_number = 27), 'race', 'Moto 1', '20+ min', '1', NULL, 'Everything you''ve built — cycling fitness, moto skills, gym strength — it all shows up now.', 'Z4-Z5', 3),
  ((SELECT id FROM workouts WHERE day_number = 27), 'race', 'Recovery Between', '30-45 min', NULL, NULL, 'Same protocol. Spin, hydrate, eat, focus. You know the drill.', 'Z1', 4),
  ((SELECT id FROM workouts WHERE day_number = 27), 'race', 'Moto 2', '20+ min', '1', NULL, '30 days of work. Leave it all out there. Last-lap charge. No regrets.', 'Z5', 5),
  ((SELECT id FROM workouts WHERE day_number = 27), 'race', 'Post-Race', '20 min', NULL, NULL, 'Cooldown. Stretch. Hydrate. You just finished The Regiment. Celebrate.', 'Z1', 6);

-- Day 28 (Sunday) — Recovery
INSERT INTO workouts (day_number, title, description, day_type) VALUES
  (28, 'Recovery Sunday', 'Month wind-down. Full recovery. Reflect on what you accomplished.', 'recovery');

INSERT INTO exercises (workout_id, block, name, duration, sets, reps, notes, hr_zone, order_index) VALUES
  ((SELECT id FROM workouts WHERE day_number = 28), 'recovery', 'Easy Cruise', '40 min', NULL, NULL, 'Flat, easy, Z1. Reward yourself with a scenic route.', 'Z1', 1),
  ((SELECT id FROM workouts WHERE day_number = 28), 'recovery', 'Full Recovery Protocol', '30 min', NULL, NULL, 'Stretch, foam roll, cold plunge. The full treatment.', NULL, 2),
  ((SELECT id FROM workouts WHERE day_number = 28), 'recovery', 'Month Review', '20 min', NULL, NULL, 'Look at your 30-day stats. Total miles. Total moto hours. Total gym sessions. How do you stack up against Haiden?', NULL, 3);

-- Day 29 (Monday) — Active Recovery / Reset
INSERT INTO workouts (day_number, title, description, day_type) VALUES
  (29, 'Reset Monday', 'Bridge day. Light work to stay active before next month''s challenge begins.', 'recovery');

INSERT INTO exercises (workout_id, block, name, duration, sets, reps, notes, hr_zone, order_index) VALUES
  ((SELECT id FROM workouts WHERE day_number = 29), 'recovery', 'Light Ride', '30-45 min', NULL, NULL, 'Z1 spin. Enjoy the ride. No pressure, no targets.', 'Z1', 1),
  ((SELECT id FROM workouts WHERE day_number = 29), 'recovery', 'Bodyweight Movement', '20 min', NULL, NULL, 'Light bodyweight: air squats, push-ups, pull-ups, lunges. Nothing heavy. Just moving.', NULL, 2),
  ((SELECT id FROM workouts WHERE day_number = 29), 'recovery', 'Mobility & Flexibility', '20 min', NULL, NULL, 'Focus on any areas that feel tight or restricted. Open them up for next month.', NULL, 3);

-- Day 30 (Tuesday) — The Challenge Ends
INSERT INTO workouts (day_number, title, description, day_type) VALUES
  (30, 'Day 30 — Challenge Complete', 'You made it. 30 days of Haiden''s Regiment. Check the leaderboard. Next month starts fresh.', 'recovery');

INSERT INTO exercises (workout_id, block, name, duration, sets, reps, notes, hr_zone, order_index) VALUES
  ((SELECT id FROM workouts WHERE day_number = 30), 'recovery', 'Victory Ride', '30 min', NULL, NULL, 'Easy spin. Celebrate. You just completed The Regiment.', 'Z1', 1),
  ((SELECT id FROM workouts WHERE day_number = 30), 'recovery', 'Final Stretch', '20 min', NULL, NULL, 'Full-body stretch. Close out the month feeling good.', NULL, 2),
  ((SELECT id FROM workouts WHERE day_number = 30), 'recovery', 'Log Final Stats', NULL, NULL, NULL, 'Submit your final activity logs. Check where you landed on the leaderboard. How close did you get to Haiden''s numbers?', NULL, 3),
  ((SELECT id FROM workouts WHERE day_number = 30), 'recovery', 'Next Month Preview', NULL, NULL, NULL, 'New month. New challenge. Fresh leaderboard. Are you ready to go again?', NULL, 4);
