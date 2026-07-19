'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import HeroCarousel from '../components/HeroCarousel';
import { heroAPI, programsAPI, statsAPI, teamAPI, settingsAPI } from '../lib/api';
import styles from './Home.module.css';

const PROGRAMS_DEFAULT = [
  { _id:'1', icon:'👩', title:'Women Empowerment & Advocacy', description:'Promoting women inclusion, leadership, entrepreneurship, skills acquisition, and economic independence.' },
  { _id:'2', icon:'🎓', title:'Youth Development', description:'Equipping young people through mentorship, leadership training, vocational skills, entrepreneurship, and career guidance.' },
  { _id:'3', icon:'📚', title:'Education Support', description:'Providing scholarships, school materials, learning support, school outreach programs, and child development initiatives.' },
  { _id:'4', icon:'🏥', title:'Healthcare Outreach', description:'Organizing free medical checkups, health awareness campaigns, maternal support, and wellness programs.' },
  { _id:'5', icon:'🤝', title:'Community Welfare', description:'Supporting widows, elderly citizens, low-income families, and vulnerable individuals with relief materials and care programs.' },
  { _id:'6', icon:'🌱', title:'Sustainable Development', description:'Partnering with communities to improve sanitation, water access, environment, skills centers, and infrastructure support.' },
];

const WHY_US = [
  { icon:'🤝', title:'Community-Centered', desc:'We identify real needs by working directly with communities, ensuring every initiative addresses genuine challenges.' },
  { icon:'📊', title:'Measurable Impact', desc:'We track, measure, and report outcomes transparently, ensuring accountability to all partners and donors.' },
  { icon:'🌍', title:'Wide Reach', desc:'Our programs span multiple communities across Nigeria, giving your partnership maximum visibility and impact.' },
  { icon:'🏆', title:'Proven Track Record', desc:'Years of experience delivering results across education, healthcare, welfare, and women empowerment programs.' },
  { icon:'🔗', title:'Strong Networks', desc:'We connect partners with government agencies, religious institutions, and community leaders for amplified results.' },
  { icon:'💡', title:'Innovation-Driven', desc:'We continuously adapt our programs to meet evolving community needs with creative, sustainable solutions.' },
];

export default function HomePage() {
  const [slides, setSlides] = useState([]);
  const [programs, setPrograms] = useState(PROGRAMS_DEFAULT);
  const [stats, setStats] = useState({ beneficiaries: 5000, programs: 6, communities: 12, yearsActive: 7 });
  const [settings, setSettings] = useState({});

  useEffect(() => {
    heroAPI.getSlides().then(r => setSlides(r.data.slides)).catch(()=>{});
    programsAPI.getPrograms().then(r => { if(r.data.programs?.length) setPrograms(r.data.programs); }).catch(()=>{});
    statsAPI.getPublic().then(r => setStats(r.data.stats)).catch(()=>{});
    settingsAPI.getPublic().then(r => setSettings(r.data.settings)).catch(()=>{});
  }, []);

  return (
    <main>
      <Navbar />
      <HeroCarousel slides={slides} />

      {/* Stats Bar */}
      <section className={styles.statsBar}>
        <div className="container">
          <div className={styles.statsGrid}>
            {[
              { value: stats.beneficiaries?.toLocaleString() || '5,000+', label: 'Lives Impacted', icon: '❤️' },
              { value: stats.programs || '6', label: 'Active Programs', icon: '📋' },
              { value: stats.communities || '12', label: 'Communities Served', icon: '🏘️' },
              { value: `${stats.yearsActive || '7'}+`, label: 'Years of Impact', icon: '⭐' },
            ].map((s, i) => (
              <div key={i} className={styles.statItem}>
                <div className={styles.statIcon}>{s.icon}</div>
                <div className={styles.statValue}>{s.value}</div>
                <div className={styles.statLabel}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Preview */}
      <section className="section" id="about">
        <div className="container">
          <div className={styles.aboutGrid}>
            <div className={styles.aboutImage}>
              <img src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=700&q=80" alt="About Angelina Care Foundation" />
              <div className={styles.aboutBadge}>
                <div className={styles.badgeInner}>
                  <span className={styles.badgeYear}>Est. 2018</span>
                  <span className={styles.badgeText}>NGO Certified</span>
                </div>
              </div>
              <div className={styles.aboutImageAccent} />
            </div>
            <div className={styles.aboutContent}>
              <span className="section-tag">About Us</span>
              <h2 className="section-title" style={{textAlign:'left', marginBottom:16}}>
                Transforming Lives Through Compassionate Action
              </h2>
              <div className="divider divider-left" />
              <p className={styles.aboutText}>
                {settings.about_text || 'Angelina Care Foundation is a purpose-driven non-governmental organization committed to improving lives and transforming communities through impactful social interventions. The foundation was established to provide support, hope, and opportunities for vulnerable individuals, families, women, youth, and underserved communities.'}
              </p>
              <p className={styles.aboutText} style={{marginTop:16}}>
                We believe that sustainable development begins when people are empowered with the right tools, education, support systems, and opportunities to thrive.
              </p>
              <div className={styles.mvGrid}>
                <div className={styles.mvCard}>
                  <div className={styles.mvIcon}>🎯</div>
                  <h4>Our Mission</h4>
                  <p>{settings.mission || 'To support communities through empowerment, education, healthcare, welfare, and sustainable development programs.'}</p>
                </div>
                <div className={styles.mvCard}>
                  <div className={styles.mvIcon}>👁️</div>
                  <h4>Our Vision</h4>
                  <p>{settings.vision || 'To build stronger, healthier, educated, and economically empowered communities where every individual has the opportunity to succeed.'}</p>
                </div>
              </div>
              <Link href="/about" className="btn btn-primary">
                Discover Our Full Story →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Programs Preview */}
      <section className={`section ${styles.programsSection}`} id="programs">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">What We Do</span>
            <h2 className="section-title">Our Core Focus Areas</h2>
            <div className="divider" />
            <p className="section-subtitle">We run six interconnected programs designed to create holistic, lasting impact in communities across Nigeria.</p>
          </div>
          <div className="grid-3">
            {programs.map((p, i) => (
              <div key={p._id} className={`card ${styles.programCard}`} style={{ animationDelay: `${i * 0.1}s` }}>
                {p.image ? (
                  <img src={p.image} alt={p.title} className={styles.programImg} />
                ) : (
                  <div className={styles.programIconWrap}>
                    <span className={styles.programIcon}>{p.icon || '🌟'}</span>
                  </div>
                )}
                <div className={styles.programBody}>
                  <h3 className={styles.programTitle}>{p.title}</h3>
                  <p className={styles.programDesc}>{p.description}</p>
                </div>
                <div className={styles.programFooter}>
                  {p.beneficiaries > 0 && <span className="badge badge-blue">{p.beneficiaries.toLocaleString()} Served</span>}
                  <Link href="/programs" className={styles.programLink}>Learn More →</Link>
                </div>
              </div>
            ))}
          </div>
          <div style={{textAlign:'center', marginTop:48}}>
            <Link href="/programs" className="btn btn-primary btn-lg">View All Programs</Link>
          </div>
        </div>
      </section>

      {/* CEO Profile Teaser */}
      <section className={`section ${styles.ceoSection}`}>
        <div className="container">
          <div className={styles.ceoGrid}>
            <div className={styles.ceoImageWrap}>
              <img
                src="/esther.png"
                alt="Bamidele Esther Iweriebor"
                className={styles.ceoImage}
              />
              <div className={styles.ceoQuote}>"Compassion is not just a feeling — it is a call to action."</div>
            </div>
            <div className={styles.ceoContent}>
              <span className="section-tag">Our Leader</span>
              <h2 className="section-title" style={{textAlign:'left'}}>Bamidele Esther Iweriebor</h2>
              <p className={styles.ceoRole}>CEO & Founder | Educationist | Entrepreneur | Faith & Community Builder</p>
              <div className="divider divider-left" style={{margin:'16px 0 24px'}} />
              <p className={styles.ceoBio}>A dynamic leader, compassionate counselor, and accomplished entrepreneur whose life's work spans education, business, faith development, and humanitarian service. As CEO of Angelina Care Foundation, she champions initiatives that promote social welfare, youth empowerment, women support, and community transformation.</p>
              <div className={styles.ceoAchievements}>
                {[
                  'Early Childhood Education — University of Lagos (UNILAG)',
                  'Guidance & Counselling — UNILAG',
                  'Founded Jaffa Branch, Abundant Life Church (2004)',
                  'Founded Nursery, Primary & Secondary School',
                  'Fashion Design | Agriculture | Building Contracting',
                ].map((a, i) => (
                  <div key={i} className={styles.achievement}>
                    <span className={styles.checkIcon}>✓</span>
                    <span>{a}</span>
                  </div>
                ))}
              </div>
              <Link href="/about#team" className="btn btn-primary" style={{marginTop:8}}>Meet The Full Team →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Partner */}
      <section className={`section ${styles.partnerSection}`}>
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Partnerships</span>
            <h2 className="section-title">Why Partner With Us</h2>
            <div className="divider" />
            <p className="section-subtitle">Angelina Care Foundation combines compassion with action. We work closely with communities to deliver practical solutions that create lasting impact.</p>
          </div>
          <div className="grid-3">
            {WHY_US.map((item, i) => (
              <div key={i} className={`card ${styles.whyCard}`}>
                <div className={styles.whyIcon}>{item.icon}</div>
                <h4 className={styles.whyTitle}>{item.title}</h4>
                <p className={styles.whyDesc}>{item.desc}</p>
              </div>
            ))}
          </div>
          <div style={{textAlign:'center', marginTop:48}}>
            <Link href="/contact" className="btn btn-primary btn-lg">Become a Partner</Link>
          </div>
        </div>
      </section>

      {/* Donate CTA */}
      <section className={`section ${styles.donateCTA}`}>
        <div className="container">
          <div className={styles.donateCTAInner}>
            <div className={styles.donateCTAContent}>
              <span className="section-tag-gold">Support Our Cause</span>
              <h2 className={styles.donateCTATitle}>Make a Difference Today</h2>
              <p className={styles.donateCTASub}>
                Your generous donation helps us reach more communities, empower more women, educate more children, and transform more lives. Every contribution counts — no amount is too small.
              </p>
              <div className={styles.donatePartners}>
                {['Government Agencies', 'Corporate Organizations', 'International Donors', 'Religious Institutions', 'Philanthropists', 'Volunteers'].map(p => (
                  <span key={p} className={styles.partnerChip}>✓ {p}</span>
                ))}
              </div>
            </div>
            <div className={styles.donateCTAActions}>
              <Link href="/donate" className="btn btn-gold btn-lg" style={{width:'100%', justifyContent:'center'}}>
                💛 Donate Now
              </Link>
              <Link href="/contact" className="btn btn-outline btn-lg" style={{width:'100%', justifyContent:'center', marginTop:12}}>
                Partner With Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
