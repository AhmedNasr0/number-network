import { config } from 'dotenv';
config();

import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import { createClient } from '@supabase/supabase-js';
import postRoutes from './routes/postRoutes';
import commentRoutes from './routes/commentRoutes';

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
app.use('/api/comments', commentRoutes);
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});