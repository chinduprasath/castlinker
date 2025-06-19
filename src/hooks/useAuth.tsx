
// This file now simply re-exports the useAuth hook from the AuthContext
// This ensures we have a single source of truth for authentication

import { useAuth } from '@/contexts/AuthContext';

export default useAuth;
