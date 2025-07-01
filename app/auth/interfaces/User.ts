import { Bono } from "@/app/core/interfaces";

export interface Profile {
  id: string;
  username: string;
  first_name: string | null;
  last_name: string | null;
  phone_number: string | null;
  address: string | null;
  created_at: string;
}

export interface Role {
  id: string;
  role: string;
}

export interface UserRole {
  user_id: string;
  role_id: string;
  updated_at: string;
}

export interface User {
  id: string;
  username: string;
  first_name: string | null;
  last_name: string | null;
  created_at: string;
  users_roles: {
    roles: {
      role: string;
    };
  }[];
  bonos?: Bono[];
}
  
