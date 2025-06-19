
// Mock authentication hook since Supabase auth was removed
export const useAuth = () => {
  // Mock user data - everyone is considered "logged in"
  const mockUser = {
    id: "mock-user",
    name: "Mock User",
    email: "user@castlinker.com",
    role: "user"
  };

  return {
    user: mockUser,
    isLoading: false,
    login: async (email: string, password: string) => {
      // Mock login - always succeeds
      return Promise.resolve();
    },
    logout: async () => {
      // Mock logout
      return Promise.resolve();
    },
    signup: async (email: string, password: string, userData: any) => {
      // Mock signup - always succeeds
      return Promise.resolve();
    }
  };
};
