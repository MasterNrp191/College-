import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, getDoc, setDoc, getDocFromServer } from 'firebase/firestore';
import { auth, db } from '@/firebase';
import { Student } from '@/types';

interface AuthContextType {
  user: Student | null;
  loading: boolean;
  isAdmin: boolean;
  isEditor: boolean;
  login: (identifier: string, pass: string) => Promise<void>;
  register: (regNumber: string, pass: string, name: string, program: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  // Connection test
  useEffect(() => {
    async function testConnection() {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error) {
        if (error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration.");
        }
      }
    }
    testConnection();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            setUser(userDoc.data() as Student);
          } else {
            // This might happen if registration failed halfway
            setUser(null);
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (identifier: string, pass: string) => {
    let email = identifier;
    if (!identifier.includes('@')) {
      // Assume registration number NS0108/0021/2024 -> NS0108_0021_2024@kcotc.ac.tz
      email = `${identifier.replace(/\//g, '_')}@kcotc.ac.tz`;
    }

    const { user: firebaseUser } = await signInWithEmailAndPassword(auth, email, pass);
    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
    
    if (userDoc.exists()) {
      const userData = userDoc.data() as Student;
      if (!userData.approved && userData.role !== 'admin') {
        await signOut(auth);
        throw new Error('Your account is pending approval by the administrator.');
      }
      setUser(userData);
    } else {
      await signOut(auth);
      throw new Error('User profile not found.');
    }
  };

  const register = async (regNumber: string, pass: string, name: string, program: string) => {
    const isAdminEmail = regNumber === 'charlesmkonyi87@gmail.com';
    let email = '';

    if (isAdminEmail) {
      email = regNumber;
    } else {
      // Validate registration number format: NS0108/0021/2024
      const regRegex = /^[A-Z]{2}\d{4}\/\d{4}\/\d{4}$/;
      if (!regRegex.test(regNumber)) {
        throw new Error('Invalid registration number format. Expected: NS0108/0021/2024');
      }
      email = `${regNumber.replace(/\//g, '_')}@kcotc.ac.tz`;
    }

    const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, pass);
    
    const role = email === 'charlesmkonyi87@gmail.com' ? 'admin' : 'student';

    const studentData: Student = {
      uid: firebaseUser.uid,
      name,
      email: email,
      registrationNumber: regNumber,
      program: program as any,
      role: role as any,
      approved: role === 'admin', // Admin is auto-approved
      createdAt: Date.now()
    };

    await setDoc(doc(db, 'users', firebaseUser.uid), studentData);
    
    if (role !== 'admin') {
      await signOut(auth);
      throw new Error('Registration successful! Please wait for admin approval before logging in.');
    }
    setUser(studentData);
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      isAdmin: user?.role === 'admin',
      isEditor: user?.role === 'editor',
      login, 
      register, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
