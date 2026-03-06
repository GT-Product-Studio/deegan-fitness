-- His & Hers Fitness — Seed Data
-- Mark Estes 30-Day Program (Days 1-7)
-- Sommer Ray 30-Day Program (Days 1-7)

-- ============================================
-- MARK ESTES — 30 Day Challenge (Days 1-7)
-- ============================================

INSERT INTO workouts (id, trainer, tier, day_number, title, description) VALUES
  ('00000000-0000-0000-0000-000000000001', 'mark', '30', 1, 'Upper Body Power', 'Build explosive upper body strength with compound movements.'),
  ('00000000-0000-0000-0000-000000000002', 'mark', '30', 2, 'Leg Day Foundation', 'Establish a strong lower body base with squats and lunges.'),
  ('00000000-0000-0000-0000-000000000003', 'mark', '30', 3, 'Active Recovery & Core', 'Low-intensity movement and core stability work.'),
  ('00000000-0000-0000-0000-000000000004', 'mark', '30', 4, 'Push Day', 'Chest, shoulders, and triceps hypertrophy training.'),
  ('00000000-0000-0000-0000-000000000005', 'mark', '30', 5, 'Pull Day', 'Back and biceps focused pulling movements.'),
  ('00000000-0000-0000-0000-000000000006', 'mark', '30', 6, 'HIIT Cardio Blast', 'High-intensity intervals to torch calories and build endurance.'),
  ('00000000-0000-0000-0000-000000000007', 'mark', '30', 7, 'Rest & Stretch', 'Full body stretching and mobility for recovery.');

-- Day 1: Upper Body Power
-- video_url: placeholder MP4s until Mark & Sommer film exercise videos.
-- To swap in real videos: UPDATE exercises SET video_url = '<url>', thumbnail_url = '<thumb>' WHERE id = '...';
-- For Mux: store the full HLS URL → https://stream.mux.com/<PLAYBACK_ID>.m3u8
INSERT INTO exercises (workout_id, name, sets, reps, notes, order_index, video_url) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Barbell Bench Press', 4, '8-10', 'Control the eccentric, explode up.', 1, '/videos/mark-workout.mp4'),
  ('00000000-0000-0000-0000-000000000001', 'Dumbbell Shoulder Press', 3, '10-12', 'Seated or standing.', 2, '/videos/mark-workout.mp4'),
  ('00000000-0000-0000-0000-000000000001', 'Weighted Pull-Ups', 4, '6-8', 'Add weight via belt or dumbbell between feet.', 3, '/videos/mark-workout.mp4'),
  ('00000000-0000-0000-0000-000000000001', 'Dumbbell Lateral Raises', 3, '12-15', 'Slow and controlled, slight bend in elbows.', 4, '/videos/mark-workout.mp4'),
  ('00000000-0000-0000-0000-000000000001', 'Tricep Dips', 3, '10-12', 'Use parallel bars, lean slightly forward.', 5, '/videos/mark-workout.mp4');

-- Day 2: Leg Day Foundation
INSERT INTO exercises (workout_id, name, sets, reps, notes, order_index) VALUES
  ('00000000-0000-0000-0000-000000000002', 'Barbell Back Squat', 4, '8-10', 'Go below parallel if mobility allows.', 1),
  ('00000000-0000-0000-0000-000000000002', 'Romanian Deadlift', 4, '10-12', 'Feel the hamstring stretch at the bottom.', 2),
  ('00000000-0000-0000-0000-000000000002', 'Walking Lunges', 3, '12 each leg', 'Hold dumbbells at sides.', 3),
  ('00000000-0000-0000-0000-000000000002', 'Leg Press', 3, '12-15', 'Feet shoulder-width apart, full range of motion.', 4),
  ('00000000-0000-0000-0000-000000000002', 'Standing Calf Raises', 4, '15-20', 'Pause at the top for 2 seconds.', 5);

-- Day 3: Active Recovery & Core
INSERT INTO exercises (workout_id, name, sets, reps, notes, order_index) VALUES
  ('00000000-0000-0000-0000-000000000003', 'Plank Hold', 3, '45-60 sec', 'Keep hips level, engage glutes.', 1),
  ('00000000-0000-0000-0000-000000000003', 'Dead Bugs', 3, '10 each side', 'Press lower back into floor throughout.', 2),
  ('00000000-0000-0000-0000-000000000003', 'Bird Dogs', 3, '10 each side', 'Extend opposite arm and leg, pause at top.', 3),
  ('00000000-0000-0000-0000-000000000003', 'Foam Rolling — Full Body', 1, '10 min', 'Spend extra time on tight areas.', 4);

-- Day 4: Push Day
INSERT INTO exercises (workout_id, name, sets, reps, notes, order_index) VALUES
  ('00000000-0000-0000-0000-000000000004', 'Incline Dumbbell Press', 4, '8-10', 'Set bench to 30-degree angle.', 1),
  ('00000000-0000-0000-0000-000000000004', 'Overhead Press', 4, '8-10', 'Strict form, no leg drive.', 2),
  ('00000000-0000-0000-0000-000000000004', 'Cable Flyes', 3, '12-15', 'Squeeze at the center for 1 second.', 3),
  ('00000000-0000-0000-0000-000000000004', 'Skull Crushers', 3, '10-12', 'Keep elbows tucked and stationary.', 4),
  ('00000000-0000-0000-0000-000000000004', 'Push-Ups to Failure', 2, 'AMRAP', 'Finish strong — go until form breaks.', 5);

-- Day 5: Pull Day
INSERT INTO exercises (workout_id, name, sets, reps, notes, order_index) VALUES
  ('00000000-0000-0000-0000-000000000005', 'Barbell Bent-Over Row', 4, '8-10', 'Hinge at hips, pull to lower chest.', 1),
  ('00000000-0000-0000-0000-000000000005', 'Lat Pulldown', 3, '10-12', 'Wide grip, squeeze lats at the bottom.', 2),
  ('00000000-0000-0000-0000-000000000005', 'Face Pulls', 3, '15-20', 'Great for rear delts and posture.', 3),
  ('00000000-0000-0000-0000-000000000005', 'Dumbbell Hammer Curls', 3, '10-12', 'Alternate arms, control the negative.', 4),
  ('00000000-0000-0000-0000-000000000005', 'Barbell Curl', 3, '10-12', 'No swinging — strict curls only.', 5);

-- Day 6: HIIT Cardio Blast
INSERT INTO exercises (workout_id, name, sets, reps, notes, order_index) VALUES
  ('00000000-0000-0000-0000-000000000006', 'Battle Ropes', 4, '30 sec on / 30 sec off', 'Alternating waves pattern.', 1),
  ('00000000-0000-0000-0000-000000000006', 'Box Jumps', 4, '10', 'Step down, don''t jump down.', 2),
  ('00000000-0000-0000-0000-000000000006', 'Kettlebell Swings', 4, '15', 'Drive hips forward, squeeze glutes at top.', 3),
  ('00000000-0000-0000-0000-000000000006', 'Burpees', 3, '12', 'Full extension at the top.', 4),
  ('00000000-0000-0000-0000-000000000006', 'Rowing Machine Sprint', 4, '250m', 'All-out effort each round.', 5);

-- Day 7: Rest & Stretch
INSERT INTO exercises (workout_id, name, sets, reps, notes, order_index) VALUES
  ('00000000-0000-0000-0000-000000000007', 'Hamstring Stretch', 2, '30 sec each side', 'Use a strap if needed.', 1),
  ('00000000-0000-0000-0000-000000000007', 'Hip Flexor Stretch', 2, '30 sec each side', 'Lunge position, push hips forward.', 2),
  ('00000000-0000-0000-0000-000000000007', 'Chest & Shoulder Doorway Stretch', 2, '30 sec', 'Arms at 90 degrees, lean forward.', 3),
  ('00000000-0000-0000-0000-000000000007', 'Yoga Flow — Sun Salutations', 3, '5 reps', 'Slow, controlled breathing.', 4);

-- ============================================
-- SOMMER RAY — 30 Day Challenge (Days 1-7)
-- ============================================

INSERT INTO workouts (id, trainer, tier, day_number, title, description) VALUES
  ('00000000-0000-0000-0000-000000000011', 'sommer', '30', 1, 'Glute Activation & Sculpt', 'Wake up those glutes with targeted activation and sculpting exercises.'),
  ('00000000-0000-0000-0000-000000000012', 'sommer', '30', 2, 'Full Body Tone', 'Total body toning session with light to moderate weights.'),
  ('00000000-0000-0000-0000-000000000013', 'sommer', '30', 3, 'Booty Band Burnout', 'Resistance band lower body workout for maximum glute engagement.'),
  ('00000000-0000-0000-0000-000000000014', 'sommer', '30', 4, 'Upper Body Sculpt', 'Tone arms, shoulders, and back with controlled movements.'),
  ('00000000-0000-0000-0000-000000000015', 'sommer', '30', 5, 'Cardio Dance & Abs', 'Fun cardio session followed by a targeted ab circuit.'),
  ('00000000-0000-0000-0000-000000000016', 'sommer', '30', 6, 'Lower Body Strength', 'Build strength in quads, hamstrings, and glutes.'),
  ('00000000-0000-0000-0000-000000000017', 'sommer', '30', 7, 'Yoga & Recovery', 'Gentle yoga flow and stretching for full recovery.');

-- Day 1: Glute Activation & Sculpt
INSERT INTO exercises (workout_id, name, sets, reps, notes, order_index, video_url) VALUES
  ('00000000-0000-0000-0000-000000000011', 'Banded Glute Bridge', 4, '15', 'Place band above knees, squeeze at top for 2 sec.', 1, '/videos/sommer-workout.mp4'),
  ('00000000-0000-0000-0000-000000000011', 'Sumo Squat', 3, '12-15', 'Wide stance, toes pointed out, squeeze glutes at top.', 2, '/videos/sommer-workout.mp4'),
  ('00000000-0000-0000-0000-000000000011', 'Cable Kickbacks', 3, '12 each leg', 'Slow and controlled, feel the squeeze.', 3, '/videos/sommer-workout.mp4'),
  ('00000000-0000-0000-0000-000000000011', 'Hip Thrusts', 4, '12', 'Back on bench, drive through heels.', 4, '/videos/sommer-workout.mp4'),
  ('00000000-0000-0000-0000-000000000011', 'Fire Hydrants', 3, '15 each side', 'Keep core tight, lift from the hip.', 5, '/videos/sommer-workout.mp4');

-- Day 2: Full Body Tone
INSERT INTO exercises (workout_id, name, sets, reps, notes, order_index) VALUES
  ('00000000-0000-0000-0000-000000000012', 'Goblet Squat', 3, '12', 'Hold dumbbell at chest, sit back into squat.', 1),
  ('00000000-0000-0000-0000-000000000012', 'Dumbbell Row', 3, '10 each arm', 'One arm at a time, brace on bench.', 2),
  ('00000000-0000-0000-0000-000000000012', 'Push-Ups (Knees or Full)', 3, '10-12', 'Keep core tight throughout.', 3),
  ('00000000-0000-0000-0000-000000000012', 'Reverse Lunges', 3, '10 each leg', 'Step back, lower knee to just above floor.', 4),
  ('00000000-0000-0000-0000-000000000012', 'Plank Hold', 3, '30-45 sec', 'Keep body in a straight line.', 5);

-- Day 3: Booty Band Burnout
INSERT INTO exercises (workout_id, name, sets, reps, notes, order_index) VALUES
  ('00000000-0000-0000-0000-000000000013', 'Banded Squat Walks', 3, '12 each direction', 'Stay low in squat position throughout.', 1),
  ('00000000-0000-0000-0000-000000000013', 'Banded Donkey Kicks', 3, '15 each leg', 'Keep foot flexed, push through heel.', 2),
  ('00000000-0000-0000-0000-000000000013', 'Banded Clamshells', 3, '15 each side', 'Lie on side, keep feet together.', 3),
  ('00000000-0000-0000-0000-000000000013', 'Banded Jump Squats', 3, '10', 'Explode up, land softly.', 4),
  ('00000000-0000-0000-0000-000000000013', 'Banded Glute Bridge Pulse', 3, '20', 'Pulse at the top, don''t drop hips.', 5);

-- Day 4: Upper Body Sculpt
INSERT INTO exercises (workout_id, name, sets, reps, notes, order_index) VALUES
  ('00000000-0000-0000-0000-000000000014', 'Dumbbell Shoulder Press', 3, '10-12', 'Seated, press overhead with control.', 1),
  ('00000000-0000-0000-0000-000000000014', 'Bicep Curls', 3, '12', 'Alternate arms, squeeze at the top.', 2),
  ('00000000-0000-0000-0000-000000000014', 'Tricep Kickbacks', 3, '12', 'Hinge forward, extend arms fully.', 3),
  ('00000000-0000-0000-0000-000000000014', 'Lateral Raises', 3, '12-15', 'Light weight, slow tempo.', 4),
  ('00000000-0000-0000-0000-000000000014', 'Bent Over Reverse Fly', 3, '12', 'Squeeze shoulder blades together.', 5);

-- Day 5: Cardio Dance & Abs
INSERT INTO exercises (workout_id, name, sets, reps, notes, order_index) VALUES
  ('00000000-0000-0000-0000-000000000015', 'Dance Cardio Warm-Up', 1, '5 min', 'Freestyle movement to get heart rate up.', 1),
  ('00000000-0000-0000-0000-000000000015', 'Mountain Climbers', 3, '20 each side', 'Fast pace, keep hips low.', 2),
  ('00000000-0000-0000-0000-000000000015', 'Bicycle Crunches', 3, '15 each side', 'Touch elbow to opposite knee.', 3),
  ('00000000-0000-0000-0000-000000000015', 'Leg Raises', 3, '12', 'Keep lower back pressed into floor.', 4),
  ('00000000-0000-0000-0000-000000000015', 'Russian Twists', 3, '15 each side', 'Hold dumbbell or medicine ball.', 5);

-- Day 6: Lower Body Strength
INSERT INTO exercises (workout_id, name, sets, reps, notes, order_index) VALUES
  ('00000000-0000-0000-0000-000000000016', 'Barbell Hip Thrust', 4, '10-12', 'Pad the bar, drive through heels.', 1),
  ('00000000-0000-0000-0000-000000000016', 'Bulgarian Split Squat', 3, '10 each leg', 'Rear foot on bench, stay upright.', 2),
  ('00000000-0000-0000-0000-000000000016', 'Leg Curl Machine', 3, '12-15', 'Slow negative, squeeze hamstrings.', 3),
  ('00000000-0000-0000-0000-000000000016', 'Step-Ups', 3, '10 each leg', 'Use a bench or box, drive through heel.', 4),
  ('00000000-0000-0000-0000-000000000016', 'Wall Sit Hold', 3, '30-45 sec', 'Thighs parallel to floor.', 5);

-- Day 7: Yoga & Recovery
INSERT INTO exercises (workout_id, name, sets, reps, notes, order_index) VALUES
  ('00000000-0000-0000-0000-000000000017', 'Cat-Cow Stretch', 2, '10 reps', 'Flow between positions with your breath.', 1),
  ('00000000-0000-0000-0000-000000000017', 'Downward Dog to Cobra Flow', 3, '5 reps', 'Move slowly, hold each position 5 sec.', 2),
  ('00000000-0000-0000-0000-000000000017', 'Pigeon Pose', 2, '45 sec each side', 'Deep hip opener — breathe into the stretch.', 3),
  ('00000000-0000-0000-0000-000000000017', 'Child''s Pose', 2, '60 sec', 'Arms extended, melt into the floor.', 4);
