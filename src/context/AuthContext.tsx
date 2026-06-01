import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../firebase/config';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
} from 'firebase/auth';
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  
} from 'firebase/firestore';
import type { User } from 'firebase/auth';

type UserRole = 'analyst' | 'viewer';

type UserProfile = {
  uid: string;
  displayName?: string;
  email?: string;
  role: UserRole;
  createdAt: string | null;
  lastSeen: string | null;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  role: UserRole | null;
  register: (data: { email: string; password: string; displayName?: string; role?: UserRole }) => Promise<void>;
  login: (email: string, password: string) => Promise<UserRole>;
  loginWithGoogle: () => Promise<UserRole>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const googleProvider = new GoogleAuthProvider();

type AuthProviderProps = { children: React.ReactNode };

const normalizeTimestamp = (value: any) => {
  if (!value) return null;
  if (value.toDate) return value.toDate().toISOString();
  if (value instanceof Date) return value.toISOString();
  return String(value);
};

const defaultRoleForEmail = (email: string | null): UserRole => {
  if (!email) return 'viewer';
  return 'analyst';
};

const createProfileRecord = async (user: User, role: UserRole) => {
  const profileRef = doc(db, 'users', user.uid);
  await setDoc(profileRef, {
    uid: user.uid,
    displayName: user.displayName || null,
    email: user.email || null,
    role,
    createdAt: serverTimestamp(),
    lastSeen: serverTimestamp(),
  });
};

const updateLastSeen = async (uid: string) => {
  const profileRef = doc(db, 'users', uid);
  await updateDoc(profileRef, { lastSeen: serverTimestamp() });
};

const loadUserProfile = async (user: User): Promise<UserRole> => {
  const profileRef = doc(db, 'users', user.uid);
  const snapshot = await getDoc(profileRef);
  if (!snapshot.exists()) {
    const role = defaultRoleForEmail(user.email);
    await createProfileRecord(user, role);
    return role;
  }
  const profileData = snapshot.data();
  const role = (profileData.role || 'viewer') as UserRole;
  await updateLastSeen(user.uid);
  return role;
};

const logActivity = async (message: string, user: User | null) => {
  try {
    await addDoc(collection(db, 'activityLogs'), {
      message,
      userId: user?.uid || null,
      userEmail: user?.email || null,
      createdAt: serverTimestamp(),
    });
  } catch {
    // ignore logging failure
  }
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<UserRole | null>(null);
  

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setLoading(true);
      if (!u) {
        setUser(null);
        setRole(null);
        setLoading(false);
        return;
      }

      try {
        setUser(u);
        const loadedRole = await loadUserProfile(u);
        setRole(loadedRole);
        await logActivity('User signed in', u);
      } catch (error) {
        console.error('Failed to load authenticated user profile:', error);
        setUser(u);
        setRole(defaultRoleForEmail(u.email));
      } finally {
        setLoading(false);
      }
    });
    return () => unsub();
  }, []);

  const register = async ({ email, password, displayName, role: requestedRole = 'viewer' }: { email: string; password: string; displayName?: string; role?: UserRole }) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName) {
      await updateProfile(cred.user, { displayName });
    }
    // Normalize requested role: unsupported roles fall back to analyst
    const roleToStore = requestedRole === 'viewer' ? 'viewer' : 'analyst';
    await createProfileRecord(cred.user, roleToStore);
    setUser(cred.user);
    setRole(roleToStore);
    await logActivity(`User registered as ${roleToStore}`, cred.user);
  };

  const login = async (email: string, password: string) => {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const loadedRole = await loadUserProfile(cred.user);
    setUser(cred.user);
    setRole(loadedRole);
    await logActivity('User signed in with email/password', cred.user);
    return loadedRole;
  };

  const loginWithGoogle = async () => {
    const cred = await signInWithPopup(auth, googleProvider);
    const loadedRole = await loadUserProfile(cred.user);
    setUser(cred.user);
    setRole(loadedRole);
    await logActivity('User signed in with Google', cred.user);
    return loadedRole;
  };

  const logout = async () => {
    const currentUser = user;
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Failed to sign out:', error);
    } finally {
      setUser(null);
      setRole(null);
      logActivity('User signed out', currentUser).catch(() => {});
    }
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  

  return (
    <AuthContext.Provider value={{ user, loading, role, register, login, loginWithGoogle, logout, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
