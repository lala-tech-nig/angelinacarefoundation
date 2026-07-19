import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className={styles.footer}>
      {/* CTA Band */}
      <div className={styles.ctaBand}>
        <div className="container">
          <div className={styles.ctaInner}>
            <div>
              <h3 className={styles.ctaTitle}>Ready to Make a Difference?</h3>
              <p className={styles.ctaSub}>Join us in transforming lives and building stronger communities across Nigeria.</p>
            </div>
            <div className={styles.ctaActions}>
              <Link href="/donate" className="btn btn-gold">Donate Now</Link>
              <Link href="/contact" className="btn btn-outline">Partner With Us</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className={styles.main}>
        <div className="container">
          <div className={styles.grid}>
            {/* Brand */}
            <div className={styles.brand}>
              <div className={styles.logo}>
                <svg width="36" height="36" viewBox="0 0 32 32" fill="none">
                  <circle cx="16" cy="16" r="16" fill="url(#fLogoGrad)" />
                  <path d="M16 7C16 7 10 11 10 16.5C10 19.5 12.7 22 16 22C19.3 22 22 19.5 22 16.5C22 11 16 7 16 7Z" fill="white" opacity="0.9"/>
                  <path d="M16 12C16 12 13 14.5 13 17C13 18.7 14.3 20 16 20C17.7 20 19 18.7 19 17C19 14.5 16 12 16 12Z" fill="url(#fLogoGold)"/>
                  <defs>
                    <linearGradient id="fLogoGrad" x1="0" y1="0" x2="32" y2="32">
                      <stop offset="0%" stopColor="#1a3a6b"/>
                      <stop offset="100%" stopColor="#2563eb"/>
                    </linearGradient>
                    <linearGradient id="fLogoGold" x1="0" y1="0" x2="0" y2="20">
                      <stop offset="0%" stopColor="#e8c97a"/>
                      <stop offset="100%" stopColor="#c9a84c"/>
                    </linearGradient>
                  </defs>
                </svg>
                <div>
                  <div className={styles.logoName}>Angelina Care</div>
                  <div className={styles.logoSub}>Foundation</div>
                </div>
              </div>
              <p className={styles.tagline}>Compassion in Action.<br/>Impact for Generations.</p>
              <p className={styles.reg}>Non-Governmental Organization<br/>Community Development Foundation</p>
              <div className={styles.socials}>
                <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook" className={styles.social}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter/X" className={styles.social}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
                <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" className={styles.social}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className={styles.colTitle}>Quick Links</h4>
              <ul className={styles.list}>
                {[
                  { href: '/', label: 'Home' },
                  { href: '/about', label: 'About Us' },
                  { href: '/programs', label: 'Our Programs' },
                  { href: '/gallery', label: 'Gallery' },
                  { href: '/contact', label: 'Contact Us' },
                  { href: '/donate', label: 'Donate' },
                ].map(item => (
                  <li key={item.href}>
                    <Link href={item.href} className={styles.listLink}>
                      <span className={styles.arrow}>→</span> {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Programs */}
            <div>
              <h4 className={styles.colTitle}>Our Programs</h4>
              <ul className={styles.list}>
                {[
                  'Women Empowerment',
                  'Youth Development',
                  'Education Support',
                  'Healthcare Outreach',
                  'Community Welfare',
                  'Sustainable Development',
                ].map(p => (
                  <li key={p}>
                    <Link href="/programs" className={styles.listLink}>
                      <span className={styles.arrow}>→</span> {p}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className={styles.colTitle}>Contact Us</h4>
              <ul className={styles.contactList}>
                <li>
                  <span className={styles.contactIcon}>📍</span>
                  <span>6 Olukunle Street, Ilupeju Oloponda Estate</span>
                </li>
                <li>
                  <span className={styles.contactIcon}>📞</span>
                  <a href="tel:08136618814">08136618814</a>
                </li>
                <li>
                  <span className={styles.contactIcon}>📞</span>
                  <a href="tel:07018205027">07018205027</a>
                </li>
                <li>
                  <span className={styles.contactIcon}>✉️</span>
                  <a href="mailto:angelinacarefoundation@gmail.com">angelinacarefoundation@gmail.com</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className={styles.bottom}>
        <div className="container">
          <div className={styles.bottomInner}>
            <p>© {year} Angelina Care Foundation. All rights reserved. Reg. as NGO — Community Development Foundation.</p>
            <Link href="/admin/login" className={styles.adminLink}>Admin Portal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
