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
  isBursar: boolean;
  login: (identifier: string, pass: string) => Promise<void>;
  register: (identifier: string, pass: string, name: string, program: string, isStaff?: boolean, staffRole?: string) => Promise<void>;
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
      if (!userData.approved) {
        await signOut(auth);
        throw new Error('Your account is pending approval by the administrator.');
      }
      
      // Update last login
      const updatedData = { ...userData, lastLogin: Date.now() };
      await setDoc(doc(db, 'users', firebaseUser.uid), updatedData);
      setUser(updatedData);
    } else {
      // Recovery for admin account if auth exists but firestore doc failed to create previously
      if (email === 'charlesmkonyi87@gmail.com') {
        const adminData: Student = {
          uid: firebaseUser.uid,
          name: 'System Admin',
          email: email,
          registrationNumber: 'STAFF',
          program: 'Staff',
          role: 'admin',
          approved: true,
          createdAt: Date.now(),
          lastLogin: Date.now()
        };
        await setDoc(doc(db, 'users', firebaseUser.uid), adminData);
        setUser(adminData);
        return;
      }
      await signOut(auth);
      throw new Error('User profile not found. Please register again or contact support.');
    }
  };

  const register = async (identifier: string, pass: string, name: string, program: string, isStaff: boolean = false, staffRole: string = 'editor') => {
    let email = identifier;
    let regNumber = identifier;

    if (!isStaff) {
      // Validate registration number format: NS0108/0021/2024 or KCOTC/2024/009
      const regRegex = /^([A-Z]{2}\d{4}\/\d{4}\/\d{4}|KCOTC\/\d{4}\/\d{3})$/;
      if (!regRegex.test(identifier)) {
        throw new Error('Invalid registration number format. Expected: NS0108/0021/2024 or KCOTC/2024/009');
      }
      email = `${identifier.replace(/\//g, '_')}@kcotc.ac.tz`;
    } else {
      // Staff registration uses email
      if (!identifier.includes('@')) {
        throw new Error('Please enter a valid email address for staff registration.');
      }
    }

    const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, pass);
    
    // Default admin email
    const isAdminEmail = email === 'charlesmkonyi87@gmail.com';
    const role = isAdminEmail ? 'admin' : (isStaff ? staffRole : 'student');

    const studentData: Student = {
      uid: firebaseUser.uid,
      name,
      email: email,
      registrationNumber: isStaff ? 'STAFF' : regNumber,
      program: isStaff ? 'Staff' : program as any,
      role: role as any,
      approved: isAdminEmail, // Admin is auto-approved, others wait for approval
      createdAt: Date.now()
    };

    await setDoc(doc(db, 'users', firebaseUser.uid), studentData);
    
    if (!isAdminEmail) {
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
      isBursar: user?.role === 'bursar',
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
