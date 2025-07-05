"use client";

import {
	createContext,
	useContext,
	useEffect,
	useState,
	useCallback,
	ReactNode,
} from "react";
import { createClient } from "@/utils/supabase/client";
import type { User } from "@supabase/supabase-js";
import { Profile } from "@/app/auth/interfaces/User";

type AuthContextType = {
	user: User | null;
	profile: Profile | null;
	loading: boolean;
	error: string | null;
	refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
	user: null,
	profile: null,
	loading: true,
	error: null,
	refreshUser: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [user, setUser] = useState<User | null>(null);
	const [profile, setProfile] = useState<Profile | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const supabase = createClient();

	const fetchProfile = useCallback(async (userId: string) => {
		try {
			const { data, error } = await supabase
				.from("profiles")
				.select("*")
				.eq("id", userId)
				.maybeSingle();
			if (error) throw error;
			return data;
		} catch (err: any) {
			setError("No se pudo cargar el perfil.");
			return null;
		}
	}, [supabase]);

	const refreshUser = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const { data, error } = await supabase.auth.getSession();
			if (error) throw error;
			if (data?.session?.user) {
				setUser(data.session.user);
				const profileData = await fetchProfile(data.session.user.id);
				setProfile(profileData);
			} else {
				setUser(null);
				setProfile(null);
			}
		} catch (err: any) {
			setUser(null);
			setProfile(null);
			setError("No se pudo cargar la sesión.");
		} finally {
			setLoading(false);
		}
	}, [supabase, fetchProfile]);

	useEffect(() => {
		refreshUser();
		const { data: authListener } = supabase.auth.onAuthStateChange(
			async (event, session) => {
				if (session?.user) {
					setUser(session.user);
					const profileData = await fetchProfile(session.user.id);
					setProfile(profileData);
				} else {
					setUser(null);
					setProfile(null);
				}
				setLoading(false);
			}
		);
		return () => {
			authListener?.subscription.unsubscribe();
		};
	}, [refreshUser, supabase.auth, fetchProfile]);

	return (
		<AuthContext.Provider value={{ user, profile, loading, error, refreshUser }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => useContext(AuthContext);