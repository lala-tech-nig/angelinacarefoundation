'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { teamAPI, settingsAPI } from '../../lib/api';
import styles from './about.module.css';

const VALUES = [
  { icon: '💛', title: 'Compassion', desc: 'We approach every situation with genuine care, empathy, and a heartfelt desire to make a positive difference in peoples lives.' },
  { icon: '🎯', title: 'Integrity', desc: 'We operate with complete transparency, honesty, and accountability in all our programs, partnerships, and financial dealings.' },
  { icon: '🤝', title: 'Collaboration', desc: 'We believe in the power of partnerships — working hand-in-hand with communities, donors, and stakeholders to multiply impact.' },
  { icon: '🌱', title: 'Sustainability', desc: 'Our programs are designed for lasting impact, building local capacity and systems that continue to thrive long after we intervene.' },
  { icon: '⚖️', title: 'Equity', desc: 'We are committed to fairness and inclusion, ensuring that marginalized groups receive the attention and resources they deserve.' },
  { icon: '🚀', title: 'Excellence', desc: 'We consistently strive for the highest standard in program delivery, community engagement, and organizational management.' },
];

const ACHIEVEMENTS = [
  { number: '5,000+', label: 'Beneficiaries Reached' },
  { number: '6', label: 'Active Programs' },
  { number: '12+', label: 'Communities Served' },
  { number: '7+', label: 'Years of Service' },
];

export default function AboutPage() {
  const [team, setTeam] = useState([]);
  const [settings, setSettings] = useState({});

  useEffect(() => {
    teamAPI.getTeam().then(r => setTeam(r.data.team || [])).catch(() => {});
    settingsAPI.getPublic().then(r => setSettings(r.data.settings || {})).catch(() => {});
  }, []);

  return (
    <main>
      <Navbar />

      {/* Page Hero */}
      <div className="page-hero">
        <div className="container">
          <div className="page-hero-inner">
            <span className="page-hero-tag">Our Story</span>
            <h1 className="page-hero-title">About Angelina Care Foundation</h1>
            <p className="page-hero-sub">
              A purpose-driven NGO committed to improving lives and transforming communities through impactful social interventions.
            </p>
            <div className="breadcrumb">
              <Link href="/">Home</Link>
              <span>›</span>
              <span>About Us</span>
            </div>
          </div>
        </div>
      </div>

      {/* Who We Are */}
      <section className="section">
        <div className="container">
          <div className={styles.whoGrid}>
            <div className={styles.whoContent}>
              <span className="section-tag">Who We Are</span>
              <h2 className="section-title" style={{textAlign:'left', marginBottom:16}}>
                Built on Purpose, Driven by Compassion
              </h2>
              <div className="divider divider-left" />
              <p className={styles.bodyText}>
                {settings.about_text || 'Angelina Care Foundation is a purpose-driven non-governmental organization committed to improving lives and transforming communities through impactful social interventions.'} The foundation was established to provide support, hope, and opportunities for vulnerable individuals, families, women, youth, and underserved communities.
              </p>
              <p className={styles.bodyText}>
                We believe that sustainable development begins when people are empowered with the right tools, education, support systems, and opportunities to thrive. Our approach is holistic — addressing immediate needs while building long-term capacity for self-reliance.
              </p>
              <p className={styles.bodyText}>
                Registered as a Non-Governmental Organization and Community Development Foundation, Angelina Care Foundation works at the intersection of humanitarian service and community development, collaborating with government agencies, corporate organizations, religious institutions, and international donors to maximize our reach and impact.
              </p>
              <div className={styles.contactInfo}>
                <div className={styles.contactInfoItem}>
                  <span>📍</span>
                  <span>6 Olukunle Street, Ilupeju Oloponda Estate</span>
                </div>
                <div className={styles.contactInfoItem}>
                  <span>📞</span>
                  <span>08136618814 | 07018205027</span>
                </div>
                <div className={styles.contactInfoItem}>
                  <span>✉️</span>
                  <span>angelinacarefoundation@gmail.com</span>
                </div>
              </div>
            </div>
            <div className={styles.whoImage}>
              <img
                src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=700&q=80"
                alt="Angelina Care Foundation community work"
              />
              <div className={styles.whoStats}>
                {ACHIEVEMENTS.map((a, i) => (
                  <div key={i} className={styles.whoStat}>
                    <div className={styles.whoStatNum}>{a.number}</div>
                    <div className={styles.whoStatLabel}>{a.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className={`section ${styles.mvSection}`}>
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Our Direction</span>
            <h2 className="section-title">Mission & Vision</h2>
            <div className="divider" />
          </div>
          <div className={styles.mvGrid}>
            <div className={styles.mvCard}>
              <div className={styles.mvIconLarge}>🎯</div>
              <h3>Our Mission</h3>
              <div className={styles.mvDivider} />
              <p>{settings.mission || 'To support communities through empowerment, education, healthcare, welfare, and sustainable development programs that create lasting positive change.'}</p>
              <ul className={styles.mvList}>
                <li>Empower women and youth through skills and opportunities</li>
                <li>Provide educational access to underserved communities</li>
                <li>Deliver healthcare outreach and wellness programs</li>
                <li>Support vulnerable individuals with welfare services</li>
              </ul>
            </div>
            <div className={styles.mvCard}>
              <div className={styles.mvIconLarge}>👁️</div>
              <h3>Our Vision</h3>
              <div className={styles.mvDivider} />
              <p>{settings.vision || 'To build stronger, healthier, educated, and economically empowered communities where every individual has the opportunity to succeed.'}</p>
              <ul className={styles.mvList}>
                <li>A Nigeria where no community is left behind</li>
                <li>Women and youth as drivers of economic growth</li>
                <li>Universal access to quality education and healthcare</li>
                <li>Self-sufficient communities with strong foundations</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">What Guides Us</span>
            <h2 className="section-title">Our Core Values</h2>
            <div className="divider" />
            <p className="section-subtitle">These principles form the foundation of everything we do — from program design to community engagement.</p>
          </div>
          <div className="grid-3">
            {VALUES.map((v, i) => (
              <div key={i} className={`card ${styles.valueCard}`}>
                <div className={styles.valueIcon}>{v.icon}</div>
                <h4 className={styles.valueTitle}>{v.title}</h4>
                <p className={styles.valueDesc}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CEO Profile */}
      <section className={`section ${styles.ceoSection}`} id="ceo">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Our Leader</span>
            <h2 className="section-title">Meet Our Founder & CEO</h2>
            <div className="divider" />
          </div>
          <div className={styles.ceoGrid}>
            <div className={styles.ceoImageCol}>
              <div className={styles.ceoImgWrap}>
                <img
                  src="/esther.png"
                  alt="Bamidele Esther Iweriebor"
                />
              </div>
              <blockquote className={styles.ceoQuote}>
                "Compassion is not just a feeling — it is a call to action. Every life we touch is a testimony to what love in action can accomplish."
              </blockquote>
            </div>
            <div className={styles.ceoInfo}>
              <h3 className={styles.ceoName}>Bamidele Esther Iweriebor</h3>
              <p className={styles.ceoTitle}>CEO & Founder | Educationist | Entrepreneur | Faith & Community Builder</p>
              <div className="divider divider-left" style={{margin:'16px 0 24px'}} />

              <p className={styles.bioPara}>
                A dynamic leader, compassionate counselor, and accomplished entrepreneur whose life's work spans education, business, faith development, and humanitarian service. Bamidele Esther Iweriebor is the driving force behind Angelina Care Foundation.
              </p>
              <p className={styles.bioPara}>
                As the Chief Executive Officer, she champions initiatives that promote social welfare, youth empowerment, women support, and community transformation. Her leadership is marked by a rare combination of vision, empathy, and practical action — qualities that have established the foundation as a credible force for good in Nigerian communities.
              </p>
              <p className={styles.bioPara}>
                Her academic background in Early Childhood Education and Guidance & Counselling from the University of Lagos, combined with her entrepreneurial ventures and faith-based community leadership, uniquely positions her to lead an organization dedicated to holistic community development.
              </p>

              <h4 className={styles.achievementsTitle}>Key Achievements & Background</h4>
              <div className={styles.achievementsList}>
                {[
                  { icon: '🎓', text: 'B.Sc. Early Childhood Education — University of Lagos (UNILAG)' },
                  { icon: '🧠', text: 'Certificate in Guidance & Counselling — UNILAG' },
                  { icon: '⛪', text: 'Founded Jaffa Branch, Abundant Life Church (2004) — Faith Community Leader' },
                  { icon: '🏫', text: 'Founded and manages a Nursery, Primary & Secondary School' },
                  { icon: '✂️', text: 'Fashion Designer | Agricultural Entrepreneur | Building Contractor' },
                  { icon: '🌍', text: 'Community Development Advocate serving across multiple LGAs' },
                ].map((a, i) => (
                  <div key={i} className={styles.achievementItem}>
                    <span className={styles.achieveIcon}>{a.icon}</span>
                    <span>{a.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      {team.length > 0 && (
        <section className="section" id="team">
          <div className="container">
            <div className="section-header">
              <span className="section-tag">Our People</span>
              <h2 className="section-title">Meet the Team</h2>
              <div className="divider" />
              <p className="section-subtitle">A dedicated group of professionals, volunteers, and advocates united by a common purpose.</p>
            </div>
            <div className="grid-4">
              {team.map(m => (
                <div key={m._id} className={`card ${styles.teamCard}`}>
                  <img
                    src={m.image || '/esther.png'}
                    alt={m.name}
                    className={styles.teamImg}
                  />
                  <div className={styles.teamBody}>
                    <h4 className={styles.teamName}>{m.name}</h4>
                    <p className={styles.teamTitle}>{m.title}</p>
                    {m.bio && <p className={styles.teamBio}>{m.bio}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className={`section ${styles.ctaSection}`}>
        <div className="container">
          <div className={styles.ctaBox}>
            <h2 className={styles.ctaTitle}>Join Us in Creating Change</h2>
            <p className={styles.ctaSub}>Whether you want to volunteer, donate, partner, or simply learn more — we'd love to have you as part of our community.</p>
            <div className={styles.ctaActions}>
              <Link href="/contact" className="btn btn-gold btn-lg">Get In Touch</Link>
              <Link href="/donate" className="btn btn-outline btn-lg">Make a Donation</Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
