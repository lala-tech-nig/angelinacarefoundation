'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { programsAPI } from '../../lib/api';
import styles from './programs.module.css';

const PROGRAMS_DEFAULT = [
  {
    _id: '1',
    icon: '👩',
    title: 'Women Empowerment & Advocacy',
    shortDesc: 'Promoting women inclusion, leadership, entrepreneurship, and economic independence.',
    description: 'Our Women Empowerment program is designed to break down barriers that limit women\'s participation in economic, political, and social life. We provide skills acquisition training in fashion, catering, agriculture, and digital skills, helping women become financially independent and community leaders.',
    impact: 'Over 1,200 women trained in vocational and entrepreneurial skills, with more than 60% establishing their own small businesses.',
    activities: [
      'Skills acquisition training (fashion, catering, agriculture)',
      'Leadership and mentorship workshops',
      'Entrepreneurship boot camps and business support',
      'Women\'s rights advocacy and legal awareness',
      'Networking events and cooperative formation',
      'Microgrant and startup support programs',
    ],
    color: '#2563eb',
  },
  {
    _id: '2',
    icon: '🎓',
    title: 'Youth Development',
    shortDesc: 'Equipping young people through mentorship, leadership, vocational skills, and career guidance.',
    description: 'The future belongs to youth. Our Youth Development program creates pathways for young Nigerians to discover their potential, develop critical skills, and become responsible leaders in their communities. We combine mentorship, vocational training, and career guidance for a comprehensive approach.',
    impact: 'Over 800 young people have participated in youth programs, with significant improvements in career readiness and civic engagement.',
    activities: [
      'Leadership training and youth summits',
      'Vocational skills training (ICT, tailoring, plumbing, welding)',
      'Mentorship programs with industry professionals',
      'Career guidance and job placement support',
      'Anti-drug and anti-violence campaigns',
      'Youth entrepreneurship competitions and grants',
    ],
    color: '#c9a84c',
  },
  {
    _id: '3',
    icon: '📚',
    title: 'Education Support',
    shortDesc: 'Providing scholarships, school materials, learning support, and child development initiatives.',
    description: 'Education is the most powerful tool for transformation. Our Education Support program ensures that financial hardship never stands between a child and their potential. We provide scholarships, learning materials, tutoring, and school outreach programs to improve access and quality of education.',
    impact: 'More than 500 children supported with scholarships and educational materials, improving school attendance and academic performance.',
    activities: [
      'Scholarship programs for indigent students',
      'Distribution of school bags, books, and uniforms',
      'School renovation and classroom support',
      'After-school tutoring and mentorship',
      'Digital literacy and computer training',
      'Parent-teacher engagement and awareness programs',
    ],
    color: '#1a3a6b',
  },
  {
    _id: '4',
    icon: '🏥',
    title: 'Healthcare Outreach',
    shortDesc: 'Organizing free medical checkups, health awareness campaigns, and maternal support.',
    description: 'Access to healthcare is a fundamental right, not a privilege. Our Healthcare Outreach program brings quality medical services directly to underserved communities. From free medical camps to maternal health support, we work to reduce health inequalities and promote community wellness.',
    impact: 'Over 2,000 free medical consultations provided, with strong focus on maternal health and preventive care programs.',
    activities: [
      'Free medical checkup camps and clinics',
      'Maternal health support and antenatal education',
      'Health awareness campaigns (malaria, HIV/AIDS, hypertension)',
      'Child immunization and nutrition programs',
      'Mental health awareness and counselling services',
      'Distribution of essential medications and supplements',
    ],
    color: '#2563eb',
  },
  {
    _id: '5',
    icon: '🤝',
    title: 'Community Welfare',
    shortDesc: 'Supporting widows, elderly citizens, low-income families, and vulnerable individuals.',
    description: 'No one should face hardship alone. Our Community Welfare program provides practical support to the most vulnerable members of society — widows, orphans, elderly citizens, and low-income families. Through relief distributions, counselling, and care programs, we restore dignity and hope.',
    impact: 'Over 600 families and individuals received relief support, including food, clothing, household items, and emotional care.',
    activities: [
      'Food and relief material distributions',
      'Support for widows and female-headed households',
      'Elderly care programs and home visits',
      'Orphan support and sponsorship',
      'Psychosocial counselling and emotional support',
      'Referrals to government social protection programs',
    ],
    color: '#c9a84c',
  },
  {
    _id: '6',
    icon: '🌱',
    title: 'Sustainable Development',
    shortDesc: 'Improving sanitation, water access, environment, skills centers, and infrastructure support.',
    description: 'Lasting community transformation requires building physical and social infrastructure that communities can sustain. Our Sustainable Development program partners with communities on sanitation, clean water, environmental conservation, and infrastructure projects that improve quality of life for generations.',
    impact: 'Multiple community infrastructure projects completed, including sanitation improvements, borehole facilitation, and environmental clean-up exercises.',
    activities: [
      'Clean water access facilitation and borehole support',
      'Sanitation and hygiene promotion programs',
      'Environmental clean-up and tree planting campaigns',
      'Community skills centers development',
      'Waste management training and advocacy',
      'Partnership with government on rural infrastructure',
    ],
    color: '#1a3a6b',
  },
];

export default function ProgramsPage() {
  const [programs, setPrograms] = useState(PROGRAMS_DEFAULT);
  const [active, setActive] = useState(null);

  useEffect(() => {
    programsAPI.getPrograms()
      .then(r => { if (r.data.programs?.length) setPrograms(r.data.programs); })
      .catch(() => {});
  }, []);

  return (
    <main>
      <Navbar />

      {/* Page Hero */}
      <div className="page-hero">
        <div className="container">
          <div className="page-hero-inner">
            <span className="page-hero-tag">What We Do</span>
            <h1 className="page-hero-title">Our Core Programs</h1>
            <p className="page-hero-sub">
              Six interconnected programs designed to create holistic, lasting impact across communities in Nigeria.
            </p>
            <div className="breadcrumb">
              <Link href="/">Home</Link>
              <span>›</span>
              <span>Programs</span>
            </div>
          </div>
        </div>
      </div>

      {/* Intro */}
      <section className={styles.intro}>
        <div className="container">
          <div className={styles.introInner}>
            <div className={styles.introText}>
              <h2>Transformative Programs That Create Real Change</h2>
              <p>At Angelina Care Foundation, we believe that lasting community transformation requires addressing multiple, interconnected challenges simultaneously. Our six core programs are designed to work together, creating a comprehensive safety net and empowerment ecosystem that lifts communities out of poverty and vulnerability.</p>
              <p>Each program is community-driven, evidence-based, and designed with sustainability in mind — ensuring our impact continues long after our direct involvement.</p>
            </div>
            <div className={styles.introStats}>
              <div className={styles.introStat}>
                <div className={styles.introStatNum}>6</div>
                <div className={styles.introStatLabel}>Core Programs</div>
              </div>
              <div className={styles.introStat}>
                <div className={styles.introStatNum}>5K+</div>
                <div className={styles.introStatLabel}>Beneficiaries</div>
              </div>
              <div className={styles.introStat}>
                <div className={styles.introStatNum}>12+</div>
                <div className={styles.introStatLabel}>Communities</div>
              </div>
              <div className={styles.introStat}>
                <div className={styles.introStatNum}>7+</div>
                <div className={styles.introStatLabel}>Years Active</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Programs List */}
      <section className="section">
        <div className="container">
          {PROGRAMS_DEFAULT.map((p, i) => (
            <div key={p._id} className={`${styles.programRow} ${i % 2 === 1 ? styles.programRowReverse : ''}`}>
              <div className={styles.programVisual} style={{ background: `linear-gradient(135deg, ${p.color}15 0%, ${p.color}05 100%)`, borderColor: `${p.color}20` }}>
                <div className={styles.programEmoji}>{p.icon}</div>
                <div className={styles.programActivities}>
                  <h4>Key Activities</h4>
                  <ul>
                    {p.activities.map((a, ai) => (
                      <li key={ai}><span style={{ color: p.color }}>✓</span> {a}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className={styles.programDetail}>
                <span className={styles.programNumber}>0{i + 1}</span>
                <h2 className={styles.programName} style={{ color: p.color }}>{p.title}</h2>
                <div className={styles.programDivider} style={{ background: p.color }} />
                <p className={styles.programDesc}>{p.description}</p>
                <div className={styles.impactBox} style={{ borderColor: p.color, background: `${p.color}08` }}>
                  <span className={styles.impactLabel}>📊 Impact</span>
                  <p className={styles.impactText}>{p.impact}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className={`section ${styles.ctaSection}`}>
        <div className="container" style={{ textAlign: 'center' }}>
          <span className="section-tag-gold">Get Involved</span>
          <h2 className={styles.ctaTitle}>Support Our Programs</h2>
          <div className="divider" />
          <p className={styles.ctaSub}>Your support — whether through donations, volunteering, or partnerships — directly funds these life-changing programs.</p>
          <div className={styles.ctaActions}>
            <Link href="/donate" className="btn btn-gold btn-lg">Donate Now</Link>
            <Link href="/contact" className="btn btn-primary btn-lg">Partner With Us</Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
