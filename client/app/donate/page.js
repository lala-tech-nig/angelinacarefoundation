'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { settingsAPI } from '../../lib/api';
import styles from './donate.module.css';

const PRESET_AMOUNTS = ['2,000', '5,000', '10,000', '20,000', '50,000', '100,000'];

const IMPACT_ITEMS = [
  { amount: '₦2,000', icon: '📚', desc: 'Provides school materials for one child for a term' },
  { amount: '₦5,000', icon: '💊', desc: 'Covers basic healthcare for a vulnerable family for a month' },
  { amount: '₦10,000', icon: '🍱', desc: 'Feeds a family of four for two weeks through our welfare program' },
  { amount: '₦20,000', icon: '👩', desc: 'Sponsors a woman through our vocational skills training program' },
  { amount: '₦50,000', icon: '🎓', desc: 'Funds a term scholarship for one underprivileged student' },
  { amount: '₦100,000', icon: '🏥', desc: 'Supports an entire free medical outreach camp in a community' },
];

const PARTNER_TYPES = [
  { icon: '🏛️', title: 'Government Agencies', desc: 'Public sector partnerships for community-wide program reach.' },
  { icon: '🏢', title: 'Corporate Organizations', desc: 'CSR initiatives that create measurable community impact.' },
  { icon: '🌍', title: 'International Donors', desc: 'Global foundations and development agencies advancing our mission.' },
  { icon: '🏆', title: 'Philanthropists', desc: 'High-impact individual givers shaping generational change.' },
  { icon: '⛪', title: 'Religious Institutions', desc: 'Faith-based organizations extending compassion to the needy.' },
  { icon: '🤲', title: 'Volunteers & Partners', desc: 'Skilled advocates and community partners amplifying our reach.' },
];

export default function DonatePage() {
  const [amount, setAmount] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [settings, setSettings] = useState({});

  useEffect(() => {
    settingsAPI.getPublic().then(r => setSettings(r.data.settings || {})).catch(() => {});
  }, []);

  const paystackLink = settings.paystack_link || 'https://paystack.com/pay/angelina-care';
  const rawAmount = amount.replace(/,/g, '');

  return (
    <main>
      <Navbar />

      {/* Page Hero */}
      <div className="page-hero">
        <div className="container">
          <div className="page-hero-inner">
            <span className="page-hero-tag">Support Us</span>
            <h1 className="page-hero-title">Make a Difference Today</h1>
            <p className="page-hero-sub">
              Your generosity fuels our mission — empowering communities, educating children, and transforming lives across Nigeria.
            </p>
            <div className="breadcrumb">
              <Link href="/">Home</Link>
              <span>›</span>
              <span>Donate</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Donate Section */}
      <section className="section">
        <div className="container">
          <div className={styles.donateGrid}>

            {/* Left: Donation Widget */}
            <div className={styles.widgetCol}>
              <div className={styles.widget}>
                <div className={styles.widgetHeader}>
                  <span className={styles.widgetTag}>Quick Donation</span>
                  <h2 className={styles.widgetTitle}>Choose Your Gift</h2>
                  <p className={styles.widgetSub}>Every naira you give goes directly to our community programs.</p>
                </div>

                <div className={styles.presets}>
                  {PRESET_AMOUNTS.map(a => (
                    <button
                      key={a}
                      className={`${styles.preset} ${amount === a ? styles.presetActive : ''}`}
                      onClick={() => setAmount(a)}
                    >
                      ₦{a}
                    </button>
                  ))}
                </div>

                <div className={styles.customRow}>
                  <label className={styles.customLabel}>Or enter a custom amount (₦)</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. 15,000"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                  />
                </div>

                <div className={styles.donorFields}>
                  <div className="form-group">
                    <label className="form-label">Your Name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Full name (optional)"
                      value={name}
                      onChange={e => setName(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="your@email.com (for receipt)"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <a
                  href={`${paystackLink}?amount=${rawAmount}&email=${email}&name=${name}`}
                  target="_blank"
                  rel="noreferrer"
                  className={`btn btn-gold ${styles.donateBtn}`}
                >
                  💛 Donate {amount ? `₦${amount}` : 'Now'} via Paystack
                </a>

                <div className={styles.secureNote}>
                  <span>🔒</span>
                  <span>Secured by Paystack. Your data is safe and your donation is fully protected.</span>
                </div>

                <div className={styles.bankTransfer}>
                  <div className={styles.bankLabel}>Prefer Bank Transfer?</div>
                  <div className={styles.bankDetails}>
                    <div><strong>Bank:</strong> Contact us for account details</div>
                    <div><strong>Email:</strong> angelinacarefoundation@gmail.com</div>
                    <div><strong>Phone:</strong> 08136618814 | 07018205027</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Why Give */}
            <div className={styles.infoCol}>
              <div className={styles.whyGive}>
                <span className="section-tag">Why Your Gift Matters</span>
                <h2 className={styles.whyTitle}>Your Donation Creates Real Change</h2>
                <div className="divider divider-left" />
                <p className={styles.whyText}>
                  At Angelina Care Foundation, every donation is an investment in people — their dignity, their potential, and their future. We operate with full financial transparency, and 100% of program donations go directly to community interventions.
                </p>
                <p className={styles.whyText}>
                  When you give to Angelina Care Foundation, you are not just making a transaction. You are partnering with a community of changemakers who believe that compassion, when activated, can break cycles of poverty and vulnerability.
                </p>
                <div className={styles.trustItems}>
                  {[
                    { icon: '✅', text: 'Registered NGO — full legal and financial compliance' },
                    { icon: '📊', text: 'Transparent reporting — quarterly impact updates for donors' },
                    { icon: '🏆', text: 'Proven impact — over 5,000 lives changed since inception' },
                    { icon: '🤝', text: 'Community-led — programs designed with and for communities' },
                  ].map((item, i) => (
                    <div key={i} className={styles.trustItem}>
                      <span className={styles.trustIcon}>{item.icon}</span>
                      <span>{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Your Gift Impact */}
      <section className={`section ${styles.impactSection}`}>
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Gift Impact</span>
            <h2 className="section-title">See What Your Gift Achieves</h2>
            <div className="divider" />
            <p className="section-subtitle">Here's exactly what your donation amount can accomplish in our communities.</p>
          </div>
          <div className="grid-3">
            {IMPACT_ITEMS.map((item, i) => (
              <div key={i} className={styles.impactCard}>
                <div className={styles.impactIcon}>{item.icon}</div>
                <div className={styles.impactAmount}>{item.amount}</div>
                <p className={styles.impactDesc}>{item.desc}</p>
                <button
                  className={`btn btn-outline-blue btn-sm ${styles.giveBtn}`}
                  onClick={() => {
                    const val = item.amount.replace('₦', '').replace(',', '');
                    setAmount(item.amount.replace('₦', ''));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  Give This Amount
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partner Types */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Partnerships</span>
            <h2 className="section-title">Partner With Us</h2>
            <div className="divider" />
            <p className="section-subtitle">Angelina Care Foundation welcomes strategic partnerships from all sectors. Let's multiply our impact together.</p>
          </div>
          <div className="grid-3">
            {PARTNER_TYPES.map((p, i) => (
              <div key={i} className={`card ${styles.partnerCard}`}>
                <div className={styles.partnerIcon}>{p.icon}</div>
                <h4 className={styles.partnerTitle}>{p.title}</h4>
                <p className={styles.partnerDesc}>{p.desc}</p>
              </div>
            ))}
          </div>
          <div style={{textAlign:'center', marginTop:48}}>
            <Link href="/contact" className="btn btn-primary btn-lg">Discuss a Partnership</Link>
          </div>
        </div>
      </section>

      {/* CTA Quote */}
      <section className={styles.quoteSection}>
        <div className="container">
          <div className={styles.quoteBox}>
            <div className={styles.quoteText}>"Compassion in Action. Impact for Generations."</div>
            <p className={styles.quoteSub}>— Angelina Care Foundation</p>
            <Link href="/contact" className="btn btn-outline btn-lg" style={{marginTop:28}}>Get In Touch</Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
