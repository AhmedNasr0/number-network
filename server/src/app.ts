import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import { config } from 'dotenv';
config();
import { createClient } from '@supabase/supabase-js';

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

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});