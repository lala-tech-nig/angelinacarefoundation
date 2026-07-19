'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { settingsAPI, donationAPI } from '../../lib/api';
import toast from 'react-hot-toast';
import styles from './donate.module.css';

const PRESET_AMOUNTS = [
  { label: '₦2,000', value: 2000 },
  { label: '₦5,000', value: 5000 },
  { label: '₦10,000', value: 10000 },
  { label: '₦20,000', value: 20000 },
  { label: '₦50,000', value: 50000 },
  { label: '₦100,000', value: 100000 },
];

const IMPACT_ITEMS = [
  { amount: '₦2,000', value: 2000, icon: '📚', desc: 'Provides school materials for one child for a term' },
  { amount: '₦5,000', value: 5000, icon: '💊', desc: 'Covers basic healthcare for a vulnerable family for a month' },
  { amount: '₦10,000', value: 10000, icon: '🍱', desc: 'Feeds a family of four for two weeks through our welfare program' },
  { amount: '₦20,000', value: 20000, icon: '👩', desc: 'Sponsors a woman through our vocational skills training program' },
  { amount: '₦50,000', value: 50000, icon: '🎓', desc: 'Funds a term scholarship for one underprivileged student' },
  { amount: '₦100,000', value: 100000, icon: '🏥', desc: 'Supports an entire free medical outreach camp in a community' },
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
  const [selectedAmount, setSelectedAmount] = useState(null);   // numeric value
  const [customAmount, setCustomAmount] = useState('');          // string input
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [program, setProgram] = useState('');
  const [message, setMessage] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);
  const [paystackReady, setPaystackReady] = useState(false);
  const [success, setSuccess] = useState(null); // { reference, amount }
  const [settings, setSettings] = useState({});

  useEffect(() => {
    settingsAPI.getPublic().then(r => setSettings(r.data.settings || {})).catch(() => {});
  }, []);

  const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || settings.paystack_public_key || '';

  // Final amount in naira
  const finalAmount = selectedAmount || (customAmount ? parseInt(customAmount.replace(/,/g, ''), 10) : 0);

  const formatAmount = (n) => n ? `₦${Number(n).toLocaleString()}` : '';

  const handlePreset = (val) => {
    setSelectedAmount(val);
    setCustomAmount('');
  };

  const handleCustom = (e) => {
    const raw = e.target.value.replace(/[^0-9,]/g, '');
    setCustomAmount(raw);
    setSelectedAmount(null);
  };

  const handleDonate = useCallback(async () => {
    if (!finalAmount || finalAmount < 100) {
      toast.error('Please enter a donation amount of at least ₦100.');
      return;
    }
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      toast.error('Please enter a valid email address to receive your receipt.');
      return;
    }
    if (!paystackReady) {
      toast.error('Payment system is loading. Please wait a moment and try again.');
      return;
    }
    if (!publicKey || publicKey.includes('xxxxxxx')) {
      toast.error('Paystack is not configured yet. Please contact the admin.');
      return;
    }

    setLoading(true);

    try {
      // 1. Initialize payment record on our backend
      const initRes = await donationAPI.initialize({
        name: isAnonymous ? '' : name,
        email,
        amount: finalAmount,
        program: program || 'General Donation',
        message,
        isAnonymous,
      });

      const { reference } = initRes.data;
      if (!reference) throw new Error('No reference returned from server');

      // 2. Open Paystack Inline popup
      const handler = window.PaystackPop.setup({
        key: publicKey,
        email,
        amount: finalAmount * 100, // kobo
        currency: 'NGN',
        ref: reference,
        metadata: {
          donor_name: isAnonymous ? 'Anonymous' : (name || 'Anonymous'),
          program: program || 'General Donation',
          message,
          custom_fields: [
            { display_name: 'Donor Name', variable_name: 'donor_name', value: isAnonymous ? 'Anonymous' : (name || 'N/A') },
            { display_name: 'Program', variable_name: 'program', value: program || 'General Donation' },
          ],
        },
        // Paystack requires a plain (non-async) callback function
        callback: function(response) {
          // 3. Verify payment with our backend
          donationAPI.verify(response.reference)
            .then(function(verifyRes) {
              if (verifyRes.data.verified) {
                setSuccess({ reference: response.reference, amount: finalAmount });
                toast.success('🎉 Thank you! Your donation was received.');
              } else {
                toast.error('Payment could not be verified. Please contact us.');
              }
              setLoading(false);
            })
            .catch(function() {
              // Payment may still be valid — Paystack webhook will confirm it
              toast.success('💛 Thank you! Your payment was received. We will confirm shortly.');
              setSuccess({ reference: response.reference, amount: finalAmount });
              setLoading(false);
            });
        },
        onClose: function() {
          toast('Payment window closed. Your donation was not completed.', { icon: 'ℹ️' });
          setLoading(false);
        },
      });

      handler.openIframe();
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || 'Payment failed. Please try again.';
      toast.error(msg);
      setLoading(false);
    }
  }, [finalAmount, email, name, program, message, isAnonymous, paystackReady, publicKey]);

  // Reset after success
  const handleReset = () => {
    setSuccess(null);
    setSelectedAmount(null);
    setCustomAmount('');
    setName(''); setEmail(''); setProgram(''); setMessage('');
    setIsAnonymous(false);
    setLoading(false);
  };

  return (
    <main>
      <Navbar />

      {/* Load Paystack Inline JS */}
      <Script
        src="https://js.paystack.co/v1/inline.js"
        strategy="lazyOnload"
        onLoad={() => setPaystackReady(true)}
        onError={() => toast.error('Failed to load payment system. Please refresh the page.')}
      />

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

            {/* ── Left: Donation Widget ── */}
            <div className={styles.widgetCol}>

              {success ? (
                /* ── Success State ── */
                <div className={styles.successBox}>
                  <div className={styles.successIcon}>🎉</div>
                  <h2 className={styles.successTitle}>Thank You!</h2>
                  <p className={styles.successAmount}>Your donation of <strong>{formatAmount(success.amount)}</strong> has been received.</p>
                  <p className={styles.successText}>
                    A receipt has been sent to <strong>{email}</strong>. Your generosity is making a real difference in communities across Nigeria.
                  </p>
                  <div className={styles.successRef}>
                    Reference: <code>{success.reference}</code>
                  </div>
                  <button className="btn btn-primary" style={{width:'100%', justifyContent:'center', marginTop:16}} onClick={handleReset}>
                    Make Another Donation
                  </button>
                  <Link href="/programs" className="btn btn-outline-blue btn-sm" style={{width:'100%', justifyContent:'center', marginTop:10}}>
                    See What Your Gift Supports
                  </Link>
                </div>
              ) : (
                /* ── Donation Form ── */
                <div className={styles.widget}>
                  <div className={styles.widgetHeader}>
                    <span className={styles.widgetTag}>Secure Donation</span>
                    <h2 className={styles.widgetTitle}>Choose Your Gift</h2>
                    <p className={styles.widgetSub}>Every naira goes directly to our community programs. Payments powered by Paystack.</p>
                  </div>

                  {/* Amount Presets */}
                  <div className={styles.presets}>
                    {PRESET_AMOUNTS.map(a => (
                      <button
                        key={a.value}
                        className={`${styles.preset} ${selectedAmount === a.value ? styles.presetActive : ''}`}
                        onClick={() => handlePreset(a.value)}
                      >
                        {a.label}
                      </button>
                    ))}
                  </div>

                  {/* Custom Amount */}
                  <div className={styles.customRow}>
                    <label className={styles.customLabel}>Or enter a custom amount (₦)</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. 15000"
                      value={customAmount}
                      onChange={handleCustom}
                    />
                  </div>

                  {finalAmount > 0 && (
                    <div className={styles.amountPreview}>
                      Donating: <strong>{formatAmount(finalAmount)}</strong>
                    </div>
                  )}

                  {/* Program */}
                  <div className="form-group">
                    <label className="form-label">Designate to a Program (optional)</label>
                    <select className="form-control" value={program} onChange={e => setProgram(e.target.value)}>
                      <option value="">General Donation</option>
                      <option value="Women Empowerment">Women Empowerment & Advocacy</option>
                      <option value="Youth Development">Youth Development</option>
                      <option value="Education Support">Education Support</option>
                      <option value="Healthcare Outreach">Healthcare Outreach</option>
                      <option value="Community Welfare">Community Welfare</option>
                      <option value="Sustainable Development">Sustainable Development</option>
                    </select>
                  </div>

                  {/* Donor Fields */}
                  <div className={styles.donorFields}>
                    <label className={styles.anonRow}>
                      <input type="checkbox" checked={isAnonymous} onChange={e => setIsAnonymous(e.target.checked)} />
                      <span>Donate anonymously</span>
                    </label>
                    {!isAnonymous && (
                      <div className="form-group">
                        <label className="form-label">Your Name</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Full name"
                          value={name}
                          onChange={e => setName(e.target.value)}
                        />
                      </div>
                    )}
                    <div className="form-group">
                      <label className="form-label">Email Address *</label>
                      <input
                        type="email"
                        className="form-control"
                        placeholder="your@email.com — for receipt"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Message (optional)</label>
                      <textarea
                        className="form-control"
                        rows={3}
                        placeholder="Leave us a message of encouragement..."
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Donate Button */}
                  <button
                    className={`btn btn-gold ${styles.donateBtn}`}
                    onClick={handleDonate}
                    disabled={loading || !paystackReady}
                  >
                    {loading ? (
                      <><span className={styles.spinner} /> Processing...</>
                    ) : !paystackReady ? (
                      '⏳ Loading Payment System...'
                    ) : (
                      `💛 Donate ${finalAmount ? formatAmount(finalAmount) : 'Now'}`
                    )}
                  </button>

                  <div className={styles.secureNote}>
                    <span>🔒</span>
                    <span>256-bit SSL encryption. Secured by Paystack. Zero card details stored on our servers.</span>
                  </div>

                  {/* Bank Transfer Fallback */}
                  <div className={styles.bankTransfer}>
                    <div className={styles.bankLabel}>Prefer Bank Transfer?</div>
                    <div className={styles.bankDetails}>
                      <div>Contact us directly for our account details:</div>
                      <div>📧 <a href="mailto:angelinacarefoundation@gmail.com">angelinacarefoundation@gmail.com</a></div>
                      <div>📞 <a href="tel:08136618814">08136618814</a> | <a href="tel:07018205027">07018205027</a></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ── Right: Why Give ── */}
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
                    { icon: '🔒', text: 'Secured by Paystack — Nigeria\'s most trusted payment gateway' },
                    { icon: '🤝', text: 'Community-led — programs designed with and for communities' },
                  ].map((item, i) => (
                    <div key={i} className={styles.trustItem}>
                      <span className={styles.trustIcon}>{item.icon}</span>
                      <span>{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Paystack Badge */}
              <div className={styles.paystackBadge}>
                <span className={styles.paystackLogo}>
                  🏦 Payments powered by <strong>Paystack</strong>
                </span>
                <p>All transactions are secured with bank-grade SSL encryption. We never store your card information.</p>
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
                    handlePreset(item.value);
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

      {/* Quote */}
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
