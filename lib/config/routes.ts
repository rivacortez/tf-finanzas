export const routesConfig = {
    public: {
      home: {
        path: '/simulator/bono-frances'
      },
      signIn: {
        path: '/sign-in'
      },
      signUp: {
        path: '/sign-up'
      },
      forgotPassword: {
        path: '/forgot-password'
      },
      authCallback: {
        path: '/auth/callback'
      }
    },
    private: {
      dashboard: {
        path: '/simulator/bono-frances',
        roles: ['admin']
      },
      profile: {
        path: '/profile',
        roles: ['user', 'admin']
      },
      admin: {
        path: '/admin',
        roles: ['admin']
      },
      resetPassword: {
        path: '/reset-password',
        roles: ['user', 'admin']
      }
    }
  } as const;
  
  export type PrivateRouteKey = keyof typeof routesConfig.private;
  export type PublicRouteKey = keyof typeof routesConfig.public;
  
  export type UserRole = 'user' | 'admin';
  
  export type RouteConfig = {
    path: string;
    roles?: UserRole[];
  };