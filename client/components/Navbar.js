'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close menu on route change
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  const links = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About Us' },
    { href: '/programs', label: 'Programs' },
    { href: '/gallery', label: 'Gallery' },
    { href: '/contact', label: 'Contact' },
  ];

  const isActive = (href) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''} ${menuOpen ? styles.menuOpen : ''}`}>
      <div className={`container ${styles.inner}`}>
        <Link href="/" className={styles.logo}>
          <div className={styles.logoIcon}>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="16" fill="url(#logoGrad)" />
              <path d="M16 7C16 7 10 11 10 16.5C10 19.5 12.7 22 16 22C19.3 22 22 19.5 22 16.5C22 11 16 7 16 7Z" fill="white" opacity="0.9"/>
              <path d="M16 12C16 12 13 14.5 13 17C13 18.7 14.3 20 16 20C17.7 20 19 18.7 19 17C19 14.5 16 12 16 12Z" fill="url(#logoGold)"/>
              <defs>
                <linearGradient id="logoGrad" x1="0" y1="0" x2="32" y2="32">
                  <stop offset="0%" stopColor="#1a3a6b"/>
                  <stop offset="100%" stopColor="#2563eb"/>
                </linearGradient>
                <linearGradient id="logoGold" x1="0" y1="0" x2="0" y2="20">
                  <stop offset="0%" stopColor="#e8c97a"/>
                  <stop offset="100%" stopColor="#c9a84c"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div>
            <div className={styles.logoName}>Angelina Care</div>
            <div className={styles.logoSub}>Foundation</div>
          </div>
        </Link>

        <ul className={`${styles.links} ${menuOpen ? styles.open : ''}`}>
          {links.map(l => (
            <li key={l.href}>
              <Link
                href={l.href}
                className={`${styles.link} ${isActive(l.href) ? styles.active : ''}`}
                onClick={() => setMenuOpen(false)}
              >
                {l.label}
                {isActive(l.href) && <span className={styles.activeDot} />}
              </Link>
            </li>
          ))}
          <li>
            <Link href="/donate" className={`btn btn-gold ${styles.donateBtn}`} onClick={() => setMenuOpen(false)}>
              Donate Now
            </Link>
          </li>
        </ul>

        <button
          className={`${styles.hamburger} ${menuOpen ? styles.hamburgerOpen : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className={styles.bar}></span>
          <span className={styles.bar}></span>
          <span className={styles.bar}></span>
        </button>
      </div>
    </nav>
  );
}
