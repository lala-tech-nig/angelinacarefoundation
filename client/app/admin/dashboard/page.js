'use client';
import { useEffect, useState } from 'react';
import { statsAPI } from '../../../lib/api';
import styles from './dashboard.module.css';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    statsAPI.getDashboard().then(r => { setData(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className={styles.loading}>Loading dashboard...</div>;

  const { stats, recentDonations = [], recentContacts = [], monthlyDonations = [] } = data || {};

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Dashboard</h1>
        <p className={styles.pageSubtitle}>Welcome back! Here's what's happening at Angelina Care Foundation.</p>
      </div>

      {/* Stat Cards */}
      <div className={styles.statsGrid}>
        {[
          { label: 'Total Raised', value: `₦${(stats?.donations?.totalRaised || 0).toLocaleString()}`, icon: '💰', color: '#1a6b3c', sub: `${stats?.donations?.successful || 0} successful donations` },
          { label: 'Messages', value: stats?.contacts?.total || 0, icon: '💬', color: '#2563eb', sub: `${stats?.contacts?.newMessages || 0} unread` },
          { label: 'Gallery Items', value: stats?.content?.gallery || 0, icon: '🖼️', color: '#7c3aed', sub: 'Published images' },
          { label: 'Programs', value: stats?.content?.programs || 0, icon: '📋', color: '#c9a84c', sub: `${stats?.content?.team || 0} team members` },
        ].map((s, i) => (
          <div key={i} className={styles.statCard} style={{ '--accent': s.color }}>
            <div className={styles.statIcon} style={{ background: `${s.color}18`, color: s.color }}>{s.icon}</div>
            <div className={styles.statInfo}>
              <div className={styles.statValue}>{s.value}</div>
              <div className={styles.statLabel}>{s.label}</div>
              <div className={styles.statSub}>{s.sub}</div>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.twoCol}>
        {/* Recent Donations */}
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <h3 className={styles.panelTitle}>Recent Donations</h3>
          </div>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead><tr><th>Donor</th><th>Amount</th><th>Status</th><th>Date</th></tr></thead>
              <tbody>
                {recentDonations.length === 0 && <tr><td colSpan={4} className={styles.empty}>No donations yet</td></tr>}
                {recentDonations.map(d => (
                  <tr key={d._id}>
                    <td>{d.isAnonymous ? 'Anonymous' : d.name}</td>
                    <td className={styles.amount}>₦{d.amount?.toLocaleString()}</td>
                    <td><span className={`${styles.badge} ${styles[d.status]}`}>{d.status}</span></td>
                    <td className={styles.date}>{new Date(d.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Messages */}
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <h3 className={styles.panelTitle}>Recent Messages</h3>
          </div>
          <div className={styles.messageList}>
            {recentContacts.length === 0 && <div className={styles.empty}>No messages yet</div>}
            {recentContacts.map(c => (
              <div key={c._id} className={styles.messageItem}>
                <div className={styles.msgAvatar}>{c.name?.[0] || '?'}</div>
                <div className={styles.msgBody}>
                  <div className={styles.msgName}>{c.name} <span className={styles.msgType}>{c.type}</span></div>
                  <div className={styles.msgSubject}>{c.subject}</div>
                  <div className={styles.msgDate}>{new Date(c.createdAt).toLocaleDateString()}</div>
                </div>
                {c.status === 'new' && <div className={styles.newDot} />}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className={styles.quickLinks}>
        <h3 className={styles.panelTitle} style={{marginBottom:16}}>Quick Actions</h3>
        <div className={styles.quickGrid}>
          {[
            { href:'/admin/hero', icon:'🖼️', label:'Add Hero Slide' },
            { href:'/admin/programs', icon:'📋', label:'Manage Programs' },
            { href:'/admin/gallery', icon:'🗃️', label:'Upload Gallery' },
            { href:'/admin/news', icon:'📰', label:'Write Article' },
            { href:'/admin/contacts', icon:'💬', label:'View Messages' },
            { href:'/admin/settings', icon:'⚙️', label:'Site Settings' },
          ].map(q => (
            <a key={q.href} href={q.href} className={styles.quickCard}>
              <span className={styles.quickIcon}>{q.icon}</span>
              <span className={styles.quickLabel}>{q.label}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
