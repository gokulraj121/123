/*
  # Initial Schema Setup

  1. Users
    - `users` table for user profiles
    - `user_relationships` table for couple connections
    - `user_friends` table for single user connections
  
  2. Games
    - `games` table for game definitions
    - `game_sessions` table for tracking game plays
    - `game_scores` table for points and leaderboard
  
  3. Chat
    - `chat_rooms` table for conversations
    - `chat_messages` table for messages
    - `chat_participants` table for room members

  4. Security
    - Enable RLS on all tables
    - Add policies for data access
*/

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  avatar_url text,
  user_type text NOT NULL CHECK (user_type IN ('single', 'relationship')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- User relationships (for couples)
CREATE TABLE IF NOT EXISTS user_relationships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  partner_id uuid REFERENCES users(id) ON DELETE CASCADE,
  status text NOT NULL CHECK (status IN ('pending', 'active', 'ended')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, partner_id)
);

-- User friends (for single users)
CREATE TABLE IF NOT EXISTS user_friends (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  friend_id uuid REFERENCES users(id) ON DELETE CASCADE,
  status text NOT NULL CHECK (status IN ('pending', 'active', 'blocked')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, friend_id)
);

-- Games table
CREATE TABLE IF NOT EXISTS games (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  game_type text NOT NULL CHECK (game_type IN ('single', 'couple', 'coop')),
  min_players int NOT NULL,
  max_players int NOT NULL,
  points_per_completion int NOT NULL DEFAULT 10,
  bonus_points int NOT NULL DEFAULT 5,
  created_at timestamptz DEFAULT now()
);

-- Game sessions
CREATE TABLE IF NOT EXISTS game_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id uuid REFERENCES games(id) ON DELETE CASCADE,
  created_by uuid REFERENCES users(id) ON DELETE CASCADE,
  status text NOT NULL CHECK (status IN ('active', 'completed', 'abandoned')),
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

-- Game session participants
CREATE TABLE IF NOT EXISTS game_session_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES game_sessions(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  score int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(session_id, user_id)
);

-- Chat rooms
CREATE TABLE IF NOT EXISTS chat_rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text,
  room_type text NOT NULL CHECK (room_type IN ('direct', 'group')),
  created_at timestamptz DEFAULT now()
);

-- Chat participants
CREATE TABLE IF NOT EXISTS chat_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid REFERENCES chat_rooms(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(room_id, user_id)
);

-- Chat messages
CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid REFERENCES chat_rooms(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_friends ENABLE ROW LEVEL SECURITY;
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_session_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Users can read their own data
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Users can update their own data
CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Relationship policies
CREATE POLICY "Users can read their relationships"
  ON user_relationships
  FOR SELECT
  TO authenticated
  USING (auth.uid() IN (user_id, partner_id));

CREATE POLICY "Users can manage their relationships"
  ON user_relationships
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Friend policies
CREATE POLICY "Users can read their friendships"
  ON user_friends
  FOR SELECT
  TO authenticated
  USING (auth.uid() IN (user_id, friend_id));

CREATE POLICY "Users can manage their friendships"
  ON user_friends
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Games are readable by all authenticated users
CREATE POLICY "Games are readable by all users"
  ON games
  FOR SELECT
  TO authenticated
  USING (true);

-- Game session policies
CREATE POLICY "Users can read their game sessions"
  ON game_sessions
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() IN (
      SELECT user_id 
      FROM game_session_participants 
      WHERE session_id = id
    )
  );

CREATE POLICY "Users can create game sessions"
  ON game_sessions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

-- Chat room policies
CREATE POLICY "Users can read their chat rooms"
  ON chat_rooms
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() IN (
      SELECT user_id 
      FROM chat_participants 
      WHERE room_id = id
    )
  );

-- Chat message policies
CREATE POLICY "Users can read messages in their rooms"
  ON chat_messages
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() IN (
      SELECT user_id 
      FROM chat_participants 
      WHERE room_id = chat_messages.room_id
    )
  );

CREATE POLICY "Users can send messages to their rooms"
  ON chat_messages
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() IN (
      SELECT user_id 
      FROM chat_participants 
      WHERE room_id = chat_messages.room_id
    )
  );