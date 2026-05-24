// 'use client';

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import Link from 'next/link';
// import { authApi } from '@/services/api';
// import { ArrowRight, Loader2, Shield, Sparkles } from 'lucide-react';
// import PublicShell from '@/components/PublicShell';

// export default function RegisterPage() {
//   const router = useRouter();
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError('');
//     setLoading(true);

//     try {
//       const response = await authApi.register(name, email, password);
//       localStorage.setItem('token', response.token);
//       localStorage.setItem('user', JSON.stringify(response.user));
//       router.push('/');
//     } catch (err: any) {
//       setError(err.response?.data?.message || 'Registration failed');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <PublicShell>
//       <section className="page-shell py-12 sm:py-16 lg:py-20">
//         <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
//           <div className="section-shell space-y-6">
//             <div className="chip w-fit text-sm text-slate-200">
//               <Sparkles className="h-4 w-4 text-[#27d7c4]" />
//               Create a private knowledge vault
//             </div>
//             <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
//               Build your Smriti account.
//             </h1>
//             <p className="max-w-xl text-sm leading-7 text-slate-400 sm:text-base sm:leading-8">
//               Create your account once, then keep all saved links, summaries, and context in one searchable place.
//             </p>
//           </div>

//           <div className="section-shell">
//             <div className="mb-6 flex items-start justify-between gap-4 border-b border-white/10 pb-6">
//               <div>
//                 <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Create account</p>
//                 <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">Join Smriti</h2>
//               </div>
//               <div className="rounded-2xl bg-gradient-to-br from-[#7c5cff] via-[#4d79ff] to-[#27d7c4] p-3 text-white shadow-[0_16px_35px_rgba(77,121,255,0.3)]">
//                 <Shield className="h-5 w-5" />
//               </div>
//             </div>

//             <form onSubmit={handleSubmit} className="space-y-5">
//               {error && <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-100">{error}</div>}

//               <div>
//                 <label htmlFor="name" className="mb-2 block text-sm font-medium text-slate-200">
//                   Name
//                 </label>
//                 <input
//                   id="name"
//                   type="text"
//                   value={name}
//                   onChange={(e) => setName(e.target.value)}
//                   placeholder="Your name"
//                   className="input-base"
//                   required
//                   disabled={loading}
//                 />
//               </div>

//               <div>
//                 <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-200">
//                   Email
//                 </label>
//                 <input
//                   id="email"
//                   type="email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   placeholder="you@example.com"
//                   className="input-base"
//                   required
//                   disabled={loading}
//                 />
//               </div>

//               <div>
//                 <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-200">
//                   Password
//                 </label>
//                 <input
//                   id="password"
//                   type="password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   placeholder="••••••••"
//                   className="input-base"
//                   required
//                   minLength={6}
//                   disabled={loading}
//                 />
//               </div>

//               <button
//                 type="submit"
//                 className="btn-primary w-full"
//                 disabled={loading}
//               >
//                 {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
//                 Continue
//               </button>
//             </form>

//             <div className="mt-6 border-t border-white/10 pt-5 text-center">
//               <p className="text-sm text-slate-400">Already have an account?</p>
//               <Link href="/login" className="btn-secondary mt-3 w-full">
//                 Sign in
//               </Link>
//             </div>
//           </div>
//         </div>
//       </section>
//     </PublicShell>
//   );
// }



import { redirect } from 'next/navigation';

export default function RegisterPage() {
  redirect('/login');
}


