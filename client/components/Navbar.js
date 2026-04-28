'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { href: '#about', label: 'About' },
    { href: '#programs', label: 'Programs' },
    { href: '#team', label: 'Team' },
    { href: '#gallery', label: 'Gallery' },
    { href: '#news', label: 'News' },
    { href: '#contact', label: 'Contact' },
  ];

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
      <div className={`container ${styles.inner}`}>
        <Link href="/" className={styles.logo}>
          <div className={styles.logoIcon}>🌿</div>
          <div>
            <div className={styles.logoName}>Angelina Care</div>
            <div className={styles.logoSub}>Foundation</div>
          </div>
        </Link>

        <ul className={`${styles.links} ${menuOpen ? styles.open : ''}`}>
          {links.map(l => (
            <li key={l.href}>
              <a href={l.href} className={styles.link} onClick={() => setMenuOpen(false)}>{l.label}</a>
            </li>
          ))}
          <li>
            <a href="#donate" className={`btn btn-gold ${styles.donateBtn}`} onClick={() => setMenuOpen(false)}>
              Donate Now
            </a>
          </li>
        </ul>

        <button className={styles.hamburger} onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          <span className={menuOpen ? styles.bar1Open : styles.bar}></span>
          <span className={menuOpen ? styles.bar2Open : styles.bar}></span>
          <span className={menuOpen ? styles.bar3Open : styles.bar}></span>
        </button>
      </div>
    </nav>
  );
}
