import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.grid}>
          <div className={styles.brand}>
            <div className={styles.logo}>🌿 Angelina Care Foundation</div>
            <p className={styles.tagline}>Compassion in Action. Impact for Generations.</p>
            <p className={styles.reg}>Non-Governmental Organization | Community Development Foundation</p>
            <div className={styles.socials}>
              <a href="#" aria-label="Facebook" className={styles.social}>f</a>
              <a href="#" aria-label="Twitter" className={styles.social}>t</a>
              <a href="#" aria-label="Instagram" className={styles.social}>in</a>
            </div>
          </div>

          <div>
            <h4 className={styles.colTitle}>Quick Links</h4>
            <ul className={styles.list}>
              {['About Us','Our Programs','Our Team','Gallery','News','Contact'].map(item => (
                <li key={item}><a href={`#${item.toLowerCase().replace(' ','')}`} className={styles.listLink}>{item}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className={styles.colTitle}>Programs</h4>
            <ul className={styles.list}>
              {['Women Empowerment','Youth Development','Education Support','Healthcare Outreach','Community Welfare','Sustainable Development'].map(p => (
                <li key={p}><span className={styles.listLink}>→ {p}</span></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className={styles.colTitle}>Contact Us</h4>
            <ul className={styles.contactList}>
              <li>📍 6 Olukunle Street, Ilupeju Oloponda Estate</li>
              <li>📞 08136618814</li>
              <li>📞 07018205027</li>
              <li>✉️ angelinacarefoundation@gmail.com</li>
            </ul>
            <a href="#donate" className={`btn btn-gold ${styles.donateBtn}`}>Donate Now</a>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>© {year} Angelina Care Foundation. All rights reserved.</p>
          <Link href="/admin/login" className={styles.adminLink}>Admin Portal</Link>
        </div>
      </div>
    </footer>
  );
}
