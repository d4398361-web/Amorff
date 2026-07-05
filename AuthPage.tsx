import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { db, doc, setDoc, addDoc, collection, serverTimestamp } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { motion } from 'motion/react';
import { Mail, Lock, User, ArrowRight, Server, AlertCircle, CheckCircle2, Sparkles } from 'lucide-react';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    try {
      if (isLogin) {
        // تسجيل الدخول
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        navigate('/dashboard');
      } else {
        // إنشاء حساب جديد
        // التحقق من صحة البيانات
        if (!username.trim()) {
          setError('يرجى إدخال اسم المستخدم.');
          setLoading(false);
          return;
        }

        if (password.length < 8) {
          setError('كلمة المرور يجب أن تكون 8 أحرف على الأقل.');
          setLoading(false);
          return;
        }

        // إنشاء الحساب
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        
        // تحديث الملف الشخصي باسم المستخدم
        await updateProfile(userCredential.user, {
          displayName: username,
        });

        // إنشاء سجل الحساب في Firestore
        const newUserProfile = {
          uid: userCredential.user.uid,
          email: email,
          displayName: username,
          photoURL: '',
          plan: 'free',
          serverCount: 0,
          balance: 0,
          role: 'user',
          createdAt: serverTimestamp(),
        };
        await setDoc(doc(db, 'users', userCredential.user.uid), newUserProfile);

        // تسجيل نشاط إنشاء الحساب في سجل الأنشطة
        await addDoc(collection(db, 'activities'), {
          uid: userCredential.user.uid,
          type: 'account_created',
          description: `تم إنشاء حساب جديد باسم: ${username} (البريد: ${email})`,
          createdAt: serverTimestamp(),
        });

        // عرض رسالة النجاح
        setSuccessMessage('تم إنشاء حسابك بنجاح! جاري تحويلك إلى صفحة تسجيل الدخول...');
        
        // إعادة التوجيه بعد ثانيتين
        setTimeout(() => {
          setSuccessMessage('');
          setIsLogin(true);
          setEmail('');
          setPassword('');
          setUsername('');
        }, 2000);
      }
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        setError('هذا البريد الإلكتروني مستخدم بالفعل.');
      } else if (err.code === 'auth/weak-password') {
        setError('كلمة المرور ضعيفة جداً. يجب أن تكون 8 أحرف على الأقل.');
      } else if (err.code === 'auth/invalid-email') {
        setError('البريد الإلكتروني غير صالح.');
      } else if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('البريد الإلكتروني أو كلمة المرور غير صحيحة.');
      } else {
        setError(err.message || 'حدث خطأ ما. يرجى المحاولة مرة أخرى.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (successMessage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020617] px-4" dir="rtl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full p-8 bg-white/[0.02] border border-white/10 rounded-[2.5rem] text-center space-y-6 backdrop-blur-3xl"
        >
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-3xl font-black tracking-tighter text-white">تم بنجاح!</h2>
          <p className="text-gray-400 leading-relaxed">
            {successMessage}
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#020617] overflow-hidden" dir="rtl">
      {/* Left Side - Visual/Marketing */}
      <div className="hidden lg:flex flex-1 relative items-center justify-center p-12 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(37,99,235,0.1),transparent_70%)]"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
        
        <div className="relative z-10 max-w-xl text-right">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600/10 border border-blue-600/20 rounded-full mb-8">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400">منصة استضافة احترافية</span>
            </div>
            <h1 className="text-7xl font-black tracking-tighter text-white leading-[0.9] mb-6">
              قوة <br /> <span className="text-blue-500">التحكم</span> <br /> في مشروعك.
            </h1>
            <p className="text-xl text-gray-400 leading-relaxed">
              انضم إلى OMAR HOST واستمتع بأفضل تجربة استضافة VPS مع لوحة تحكم متكاملة ودعم فني على مدار الساعة.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8 lg:p-12 relative">
        <div className="lg:hidden absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-blue-600/10 blur-[80px] rounded-full -z-10"></div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full space-y-8 p-6 sm:p-12 bg-white/[0.02] border border-white/10 rounded-[2.5rem] backdrop-blur-3xl shadow-2xl relative overflow-hidden"
        >
          {/* Decorative elements */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-600/10 blur-3xl rounded-full"></div>
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-600/10 blur-3xl rounded-full"></div>

          <div className="text-center relative">
            <div className="mx-auto h-16 w-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl flex items-center justify-center mb-8 shadow-2xl shadow-blue-600/40 rotate-3">
              <Server className="h-9 w-9 text-white" />
            </div>
            <h2 className="text-3xl font-black tracking-tighter text-white mb-2">
              {isLogin ? 'مرحباً بعودتك' : 'انضم إلينا اليوم'}
            </h2>
            <p className="text-gray-400 text-sm">
              {isLogin ? "ليس لديك حساب؟" : "لديك حساب بالفعل؟"}
              <button
                onClick={() => { setIsLogin(!isLogin); setError(''); }}
                className="mr-2 font-bold text-blue-500 hover:text-blue-400 transition-colors underline underline-offset-4"
              >
                {isLogin ? 'سجل الآن' : 'تسجيل الدخول'}
              </button>
            </p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl flex items-center gap-3 text-red-400 text-xs font-medium"
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </motion.div>
          )}

          <form className="space-y-5 relative" onSubmit={handleEmailAuth}>
            <div className="space-y-3">
              {!isLogin && (
                <div className="relative group">
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-blue-500 transition-colors">
                    <User className="h-5 w-5" />
                  </div>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="block w-full pr-12 pl-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white/[0.08] transition-all text-right text-sm"
                    placeholder="اسم المستخدم"
                  />
                </div>
              )}
              <div className="relative group">
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-blue-500 transition-colors">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pr-12 pl-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white/[0.08] transition-all text-right text-sm"
                  placeholder="البريد الإلكتروني"
                />
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-blue-500 transition-colors">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pr-12 pl-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white/[0.08] transition-all text-right text-sm"
                  placeholder={isLogin ? "كلمة المرور" : "كلمة المرور (8 أحرف على الأقل)"}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center items-center py-4 px-4 border border-transparent text-sm font-bold rounded-2xl text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all shadow-xl shadow-blue-600/30 disabled:opacity-50"
            >
              {loading ? 'جاري المعالجة...' : isLogin ? 'تسجيل الدخول' : 'إنشاء الحساب'}
              <ArrowRight className="mr-2 h-5 w-5 group-hover:-translate-x-1 transition-transform rotate-180" />
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
