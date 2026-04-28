'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI } from '../../../lib/api';
import toast from 'react-hot-toast';
import styles from './login.module.css';

export default function AdminLogin() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authAPI.login(form);
      localStorage.setItem('acf_token', res.data.token);
      localStorage.setItem('acf_admin', JSON.stringify(res.data.admin));
      toast.success('Welcome back!');
      router.push('/admin/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials');
    }
    setLoading(false);
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logo}>🌿</div>
        <h1 className={styles.title}>Angelina Care Foundation</h1>
        <p className={styles.subtitle}>Admin Portal</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input type="email" className="form-control" placeholder="admin@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input type="password" className="form-control" placeholder="••••••••" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
          </div>
          <button type="submit" className={`btn btn-primary ${styles.loginBtn}`} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <a href="/" className={styles.backLink}>← Back to Website</a>
      </div>
    </div>
  );
}
