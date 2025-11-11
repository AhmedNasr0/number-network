import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import { config } from 'dotenv';
config();
import { createClient } from '@supabase/supabase-js';
import postRoutes from './routes/postRoutes';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
export const supabase = createClient(
  process.env.SUPABASE_URL as string ,
  process.env.SUPABASE_ANON_KEY as string 
);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});