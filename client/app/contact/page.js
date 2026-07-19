'use client';
import { useState } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { contactAPI } from '../../lib/api';
import toast from 'react-hot-toast';
import styles from './contact.module.css';

const PARTNER_TYPES = [
  { icon: '🏛️', name: 'Government Agencies', desc: 'Collaborating with local and federal government bodies on community programs.' },
  { icon: '🏢', name: 'Corporate Organizations', desc: 'CSR partnerships with companies looking to make meaningful community impact.' },
  { icon: '🌍', name: 'International Donors', desc: 'Working with global NGOs, foundations, and international development agencies.' },
  { icon: '⛪', name: 'Religious Institutions', desc: 'Partnering with churches, mosques, and faith-based organizations.' },
  { icon: '💰', name: 'Philanthropists', desc: 'Connecting with individual donors who share our passion for community transformation.' },
  { icon: '🤲', name: 'Volunteers & Partners', desc: 'Welcoming skilled volunteers, development partners, and community advocates.' },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name:'', email:'', phone:'', subject:'', message:'', type:'general' });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await contactAPI.submit(form);
      toast.success("Message sent! We'll get back to you soon.");
      setForm({ name:'', email:'', phone:'', subject:'', message:'', type:'general' });
    } catch {
      toast.error('Failed to send. Please try again.');
    }
    setSending(false);
  };

  return (
    <main>
      <Navbar />

      {/* Page Hero */}
      <div className="page-hero">
        <div className="container">
          <div className="page-hero-inner">
            <span className="page-hero-tag">Get In Touch</span>
            <h1 className="page-hero-title">Contact Angelina Care Foundation</h1>
            <p className="page-hero-sub">
              Whether you want to volunteer, partner, donate, or learn more — we'd love to hear from you.
            </p>
            <div className="breadcrumb">
              <Link href="/">Home</Link>
              <span>›</span>
              <span>Contact</span>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Info Cards */}
      <section className={styles.infoSection}>
        <div className="container">
          <div className={styles.infoGrid}>
            {[
              { icon: '📍', label: 'Visit Us', value: '6 Olukunle Street, Ilupeju Oloponda Estate', sub: 'Lagos, Nigeria' },
              { icon: '📞', label: 'Call Us', value: '08136618814', sub: '07018205027' },
              { icon: '✉️', label: 'Email Us', value: 'angelinacarefoundation@gmail.com', sub: 'We reply within 24 hours' },
              { icon: '🕐', label: 'Office Hours', value: 'Mon – Fri: 8am – 5pm', sub: 'Sat: 9am – 2pm' },
            ].map((item, i) => (
              <div key={i} className={styles.infoCard}>
                <div className={styles.infoIcon}>{item.icon}</div>
                <div className={styles.infoLabel}>{item.label}</div>
                <div className={styles.infoValue}>{item.value}</div>
                <div className={styles.infoSub}>{item.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form + Map */}
      <section className="section">
        <div className="container">
          <div className={styles.contactGrid}>
            {/* Form */}
            <div className={styles.formCol}>
              <div className={styles.formHeader}>
                <span className="section-tag">Send a Message</span>
                <h2 className={styles.formTitle}>How Can We Help You?</h2>
                <div className="divider divider-left" />
                <p className={styles.formSub}>Fill out the form and a member of our team will respond within 24 hours.</p>
              </div>
              <form onSubmit={handleSubmit} className={styles.form}>
                <div className="grid-2" style={{gap:16, marginBottom:0}}>
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input className="form-control" placeholder="Your full name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email Address *</label>
                    <input type="email" className="form-control" placeholder="your@email.com" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required />
                  </div>
                </div>
                <div className="grid-2" style={{gap:16, marginBottom:0}}>
                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input className="form-control" placeholder="+234 xxx xxxx xxxx" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Inquiry Type</label>
                    <select className="form-control" value={form.type} onChange={e=>setForm({...form,type:e.target.value})}>
                      <option value="general">General Inquiry</option>
                      <option value="partnership">Partnership</option>
                      <option value="volunteer">Volunteer</option>
                      <option value="donation">Donation</option>
                      <option value="media">Media / Press</option>
                      <option value="program">Program Inquiry</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Subject *</label>
                  <input className="form-control" placeholder="Brief subject of your message" value={form.subject} onChange={e=>setForm({...form,subject:e.target.value})} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Message *</label>
                  <textarea className="form-control" rows={6} placeholder="Tell us more about your inquiry, how you'd like to get involved, or how we can help you..." value={form.message} onChange={e=>setForm({...form,message:e.target.value})} required />
                </div>
                <button type="submit" className="btn btn-primary" disabled={sending} style={{width:'100%', justifyContent:'center', fontSize:'1rem'}}>
                  {sending ? (
                    <><span className={styles.spinner} /> Sending...</>
                  ) : (
                    '📤 Send Message'
                  )}
                </button>
              </form>
            </div>

            {/* Side Info */}
            <div className={styles.sideCol}>
              <div className={styles.sideCard}>
                <h3>Why Reach Out?</h3>
                <p>We welcome conversations with anyone who shares our vision of stronger, healthier communities. Here's how we can work together:</p>
                <ul className={styles.whyList}>
                  {[
                    '🤝 Explore partnership opportunities',
                    '💛 Discuss donation and funding',
                    '🙋 Sign up as a volunteer',
                    '📋 Learn about our programs',
                    '📰 Media and press inquiries',
                    '🎓 Request a speaker or presentation',
                    '🏢 Corporate CSR collaboration',
                  ].map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className={styles.socialCard}>
                <h4>Follow Our Work</h4>
                <p>Stay updated on our programs and community impact through our social channels.</p>
                <div className={styles.socialLinks}>
                  <a href="https://facebook.com" target="_blank" rel="noreferrer" className={styles.socialLink}>
                    <span>f</span> Facebook
                  </a>
                  <a href="https://twitter.com" target="_blank" rel="noreferrer" className={styles.socialLink}>
                    <span>𝕏</span> Twitter/X
                  </a>
                  <a href="https://instagram.com" target="_blank" rel="noreferrer" className={styles.socialLink}>
                    <span>📷</span> Instagram
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partner Types */}
      <section className={`section ${styles.partnerSection}`}>
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Partnerships</span>
            <h2 className="section-title">Who We Partner With</h2>
            <div className="divider" />
            <p className="section-subtitle">Angelina Care Foundation welcomes partnerships from across sectors. We believe collaboration multiplies impact.</p>
          </div>
          <div className="grid-3">
            {PARTNER_TYPES.map((p, i) => (
              <div key={i} className={`card ${styles.partnerCard}`}>
                <div className={styles.partnerIcon}>{p.icon}</div>
                <h4 className={styles.partnerName}>{p.name}</h4>
                <p className={styles.partnerDesc}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
