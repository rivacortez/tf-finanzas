"use client";

import {
	createContext,
	useContext,
	useEffect,
	useState,
	useCallback,
} from "react";
import { createClient } from "@/utils/supabase/client";
import type { User } from "@supabase/supabase-js";
import { Profile } from "@/app/auth/interfaces/User";

type AuthContextType = {
	user: User | null;
	profile: Profile | null;
	loading: boolean;
	refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
	user: null,
	profile: null,
	loading: true,
	refreshUser: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [user, setUser] = useState<User | null>(null);
	const [profile, setProfile] = useState<Profile | null>(null);
	const [loading, setLoading] = useState(true);
	const supabase = createClient();

	const fetchProfile = async (userId: string) => {
		try {
			console.log("Fetching profile for user:", userId);
			
			const { data: profileData, error: profileError } = await supabase
				.from('profiles')
				.select('*')
				.eq('id', userId)
				.maybeSingle();

			if (profileError) {
				console.error("Error getting profile:", {
					message: profileError.message,
					details: profileError.details,
					code: profileError.code,
					hint: profileError.hint
				});
				return null;
			}

			if (!profileData) {
				console.log("No profile found for user:", userId);
				return null;
			}

			console.log("Profile found:", profileData);
			return profileData;
		} catch (error) {
			console.error("Error fetching profile:", error);
			return null;
		}
	};

	const refreshUser = useCallback(async () => {
		try {
			const { data: sessionData, error: sessionError } =
				await supabase.auth.getSession();
			
			if (sessionError) {
				console.error("Error getting session:", sessionError);
				setUser(null);
				setProfile(null);
				return;
			}

			if (sessionData?.session?.user) {
				setUser(sessionData.session.user);
				
				// Fetch profile separately
				const profileData = await fetchProfile(sessionData.session.user.id);
				setProfile(profileData);
			} else {
				setUser(null);
				setProfile(null);
			}
		} catch (error) {
			console.error("Error refreshing user:", error);
			setUser(null);
			setProfile(null);
		} finally {
			setLoading(false);
		}
	}, [supabase, fetchProfile]);

	useEffect(() => {
		refreshUser();

		const { data: authListener } = supabase.auth.onAuthStateChange(
			async (event, session) => {
				console.log("Auth state changed:", event, session?.user?.email);

				if (session?.user) {
					setUser(session.user);
					
					// Fetch profile
					const profileData = await fetchProfile(session.user.id);
					setProfile(profileData);
				} else {
					setUser(null);
					setProfile(null);
				}

				setLoading(false);
			},
		);

		return () => {
			authListener?.subscription.unsubscribe();
		};
	}, [refreshUser, fetchProfile, supabase.auth]);

	return (
		<AuthContext.Provider value={{ user, profile, loading, refreshUser }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => useContext(AuthContext);