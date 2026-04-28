'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { authAPI } from '../../lib/api';
import styles from './admin.module.css';

const NAV = [
  { href: '/admin/dashboard', icon: '📊', label: 'Dashboard' },
  { href: '/admin/hero', icon: '🖼️', label: 'Hero Slides' },
  { href: '/admin/programs', icon: '📋', label: 'Programs' },
  { href: '/admin/gallery', icon: '🗃️', label: 'Gallery' },
  { href: '/admin/team', icon: '👥', label: 'Team' },
  { href: '/admin/news', icon: '📰', label: 'News' },
  { href: '/admin/contacts', icon: '💬', label: 'Messages' },
  { href: '/admin/donations', icon: '💳', label: 'Donations' },
  { href: '/admin/settings', icon: '⚙️', label: 'Settings' },
];

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [admin, setAdmin] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (pathname === '/admin/login') return;
    const token = localStorage.getItem('acf_token');
    if (!token) { router.push('/admin/login'); return; }
    authAPI.getMe().then(r => setAdmin(r.data.admin)).catch(() => {
      localStorage.removeItem('acf_token');
      router.push('/admin/login');
    });
  }, [pathname]);

  const logout = () => {
    localStorage.removeItem('acf_token');
    localStorage.removeItem('acf_admin');
    router.push('/admin/login');
  };

  if (pathname === '/admin/login') return <>{children}</>;
  if (!admin) return <div className={styles.loading}><div className={styles.spinner} />Loading...</div>;

  return (
    <div className={styles.shell}>
      {/* Mobile overlay */}
      {sidebarOpen && <div className={styles.overlay} onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.sidebarHeader}>
          <div className={styles.sidebarLogo}>🌿</div>
          <div>
            <div className={styles.sidebarName}>Angelina Care</div>
            <div className={styles.sidebarSub}>Admin Portal</div>
          </div>
        </div>
        <nav className={styles.nav}>
          {NAV.map(item => (
            <Link key={item.href} href={item.href} className={`${styles.navItem} ${pathname === item.href ? styles.navActive : ''}`} onClick={() => setSidebarOpen(false)}>
              <span className={styles.navIcon}>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className={styles.sidebarFooter}>
          <div className={styles.adminInfo}>
            <div className={styles.adminAvatar}>{admin.name?.[0] || 'A'}</div>
            <div>
              <div className={styles.adminName}>{admin.name}</div>
              <div className={styles.adminRole}>{admin.role}</div>
            </div>
          </div>
          <button className={styles.logoutBtn} onClick={logout}>↪ Logout</button>
        </div>
      </aside>

      {/* Main */}
      <div className={styles.main}>
        <header className={styles.topbar}>
          <button className={styles.menuBtn} onClick={() => setSidebarOpen(true)}>☰</button>
          <div className={styles.topbarRight}>
            <Link href="/" target="_blank" className={styles.viewSite}>↗ View Site</Link>
            <span className={styles.adminBadge}>{admin.role}</span>
          </div>
        </header>
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
}
