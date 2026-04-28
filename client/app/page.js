'use client';
import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import HeroCarousel from '../components/HeroCarousel';
import { heroAPI, programsAPI, statsAPI, teamAPI, galleryAPI, contactAPI, settingsAPI } from '../lib/api';
import toast from 'react-hot-toast';
import styles from './Home.module.css';

const PROGRAMS_DEFAULT = [
  { _id:'1', icon:'👩', title:'Women Empowerment & Advocacy', description:'Promoting women inclusion, leadership, entrepreneurship, skills acquisition, and economic independence.' },
  { _id:'2', icon:'🎓', title:'Youth Development', description:'Equipping young people through mentorship, leadership training, vocational skills, entrepreneurship, and career guidance.' },
  { _id:'3', icon:'📚', title:'Education Support', description:'Providing scholarships, school materials, learning support, school outreach programs, and child development initiatives.' },
  { _id:'4', icon:'🏥', title:'Healthcare Outreach', description:'Organizing free medical checkups, health awareness campaigns, maternal support, and wellness programs.' },
  { _id:'5', icon:'🤝', title:'Community Welfare', description:'Supporting widows, elderly citizens, low-income families, and vulnerable individuals with relief materials and care programs.' },
  { _id:'6', icon:'🌱', title:'Sustainable Development', description:'Partnering with communities to improve sanitation, water access, environment, skills centers, and infrastructure support.' },
];

export default function HomePage() {
  const [slides, setSlides] = useState([]);
  const [programs, setPrograms] = useState(PROGRAMS_DEFAULT);
  const [stats, setStats] = useState({ beneficiaries: 5000, programs: 6, communities: 12, yearsActive: 7 });
  const [team, setTeam] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [settings, setSettings] = useState({});
  const [contactForm, setContactForm] = useState({ name:'', email:'', phone:'', subject:'', message:'', type:'general' });
  const [sending, setSending] = useState(false);
  const [activeGalleryTab, setActiveGalleryTab] = useState('all');
  const [donationAmount, setDonationAmount] = useState('');
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');

  useEffect(() => {
    heroAPI.getSlides().then(r => setSlides(r.data.slides)).catch(()=>{});
    programsAPI.getPrograms().then(r => { if(r.data.programs?.length) setPrograms(r.data.programs); }).catch(()=>{});
    statsAPI.getPublic().then(r => setStats(r.data.stats)).catch(()=>{});
    teamAPI.getTeam().then(r => setTeam(r.data.team)).catch(()=>{});
    galleryAPI.getGallery().then(r => setGallery(r.data.items)).catch(()=>{});
    settingsAPI.getPublic().then(r => setSettings(r.data.settings)).catch(()=>{});
  }, []);

  const handleContact = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await contactAPI.submit(contactForm);
      toast.success('Message sent! We\'ll get back to you soon.');
      setContactForm({ name:'', email:'', phone:'', subject:'', message:'', type:'general' });
    } catch { toast.error('Failed to send. Please try again.'); }
    setSending(false);
  };

  const filteredGallery = activeGalleryTab === 'all' ? gallery : gallery.filter(g => g.category === activeGalleryTab);
  const galleryCategories = ['all', ...new Set(gallery.map(g => g.category).filter(Boolean))];
  const paystackLink = settings.paystack_link || 'https://paystack.com/pay/angelina-care';

  return (
    <main>
      <Navbar />
      <HeroCarousel slides={slides} />

      {/* Stats Bar */}
      <section className={styles.statsBar}>
        <div className="container">
          <div className={styles.statsGrid}>
            {[
              { value: stats.beneficiaries?.toLocaleString() || '5,000+', label: 'Beneficiaries' },
              { value: stats.programs || '6', label: 'Active Programs' },
              { value: stats.communities || '12', label: 'Communities' },
              { value: `${stats.yearsActive || '7'}+`, label: 'Years of Impact' },
            ].map((s, i) => (
              <div key={i} className={styles.statItem}>
                <div className={styles.statValue}>{s.value}</div>
                <div className={styles.statLabel}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section className="section" id="about">
        <div className="container">
          <div className={styles.aboutGrid}>
            <div className={styles.aboutImage}>
              <img src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=700&q=80" alt="About Angelina Care Foundation" />
              <div className={styles.aboutBadge}>
                <span className={styles.badgeYear}>Est. 2018</span>
                <span className={styles.badgeText}>Community Driven</span>
              </div>
            </div>
            <div className={styles.aboutContent}>
              <span className="section-tag">About Us</span>
              <h2 className="section-title" style={{textAlign:'left', marginBottom:16}}>
                Transforming Lives Through Compassionate Action
              </h2>
              <div className="divider" style={{margin:'0 0 24px'}} />
              <p className={styles.aboutText}>
                {settings.about_text || 'Angelina Care Foundation is a purpose-driven non-governmental organization committed to improving lives and transforming communities through impactful social interventions. We believe that sustainable development begins when people are empowered with the right tools, education, support systems, and opportunities to thrive.'}
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
              <a href="#programs" className="btn btn-primary">Explore Our Programs</a>
            </div>
          </div>
        </div>
      </section>

      {/* Programs */}
      <section className={`section ${styles.programsSection}`} id="programs">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">What We Do</span>
            <h2 className="section-title">Our Core Focus Areas</h2>
            <div className="divider" />
            <p className="section-subtitle">We run six interconnected programs designed to create holistic, lasting impact in communities.</p>
          </div>
          <div className="grid-3">
            {programs.map((p, i) => (
              <div key={p._id} className={`card ${styles.programCard}`} style={{ animationDelay: `${i * 0.1}s` }}>
                {p.image ? (
                  <img src={p.image} alt={p.title} className={styles.programImg} />
                ) : (
                  <div className={styles.programIconWrap}><span className={styles.programIcon}>{p.icon || '🌟'}</span></div>
                )}
                <div className={styles.programBody}>
                  <h3 className={styles.programTitle}>{p.title}</h3>
                  <p className={styles.programDesc}>{p.description}</p>
                </div>
                <div className={styles.programFooter}>
                  {p.beneficiaries > 0 && <span className="badge badge-green">{p.beneficiaries.toLocaleString()} Served</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CEO Profile */}
      <section className={`section ${styles.ceoSection}`} id="ceo">
        <div className="container">
          <div className={styles.ceoGrid}>
            <div className={styles.ceoImageWrap}>
              <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&q=80" alt="Bamidele Esther Iweriebor" className={styles.ceoImage} />
              <div className={styles.ceoQuote}>"Compassion is not just a feeling — it is a call to action."</div>
            </div>
            <div className={styles.ceoContent}>
              <span className="section-tag">Our Leader</span>
              <h2 className="section-title" style={{textAlign:'left'}}>Bamidele Esther Iweriebor</h2>
              <p className={styles.ceoRole}>CEO & Founder | Educationist | Entrepreneur | Faith & Community Builder</p>
              <div className="divider" style={{margin:'16px 0 24px'}} />
              <p className={styles.ceoBio}>A dynamic leader, compassionate counselor, and accomplished entrepreneur whose life's work spans education, business, faith development, and humanitarian service. As the Chief Executive Officer of Angelina Care Foundation, she champions initiatives that promote social welfare, youth empowerment, women support, and community transformation.</p>
              <div className={styles.ceoAchievements}>
                {['Early Childhood Education — UNILAG','Guidance & Counselling — UNILAG','Founded Jaffa Branch, Abundant Life Church (2004)','Founded Nursery, Primary & Secondary School','Fashion Design | Agriculture | Building Contracting'].map((a, i) => (
                  <div key={i} className={styles.achievement}>
                    <span className={styles.checkIcon}>✓</span>
                    <span>{a}</span>
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
            </div>
            <div className="grid-4">
              {team.map(m => (
                <div key={m._id} className={`card ${styles.teamCard}`}>
                  <img src={m.image || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400'} alt={m.name} className={styles.teamImg} />
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

      {/* Donate */}
      <section className={`section ${styles.donateSection}`} id="donate">
        <div className="container">
          <div className={styles.donateGrid}>
            <div className={styles.donateContent}>
              <span className="section-tag" style={{background:'rgba(201,168,76,0.2)',color:'#e8c97a'}}>Support Our Cause</span>
              <h2 className="section-title" style={{color:'#fff',textAlign:'left'}}>Make a Difference Today</h2>
              <div className="divider" style={{margin:'16px 0 20px'}} />
              <p style={{color:'rgba(255,255,255,0.8)',marginBottom:24,lineHeight:1.7}}>
                Your generous donation helps us reach more communities, empower more women, educate more children, and transform more lives. Every contribution counts.
              </p>
              <div className={styles.partnerList}>
                {['Government Agencies','Corporate Organizations','International Donors','Religious Institutions','Philanthropists','Volunteers'].map(p => (
                  <div key={p} className={styles.partnerItem}><span>✓</span> {p}</div>
                ))}
              </div>
            </div>
            <div className={styles.donateCard}>
              <h3 className={styles.donateCardTitle}>Quick Donation</h3>
              <p className={styles.donateCardSub}>Choose an amount or enter your own</p>
              <div className={styles.amountGrid}>
                {['2,000','5,000','10,000','20,000','50,000','100,000'].map(a => (
                  <button key={a} className={`${styles.amountBtn} ${donationAmount === a ? styles.amountActive : ''}`} onClick={() => setDonationAmount(a)}>₦{a}</button>
                ))}
              </div>
              <input type="text" placeholder="Or enter custom amount (₦)" className="form-control" style={{marginBottom:16}} value={donationAmount} onChange={e => setDonationAmount(e.target.value)} />
              <input type="text" placeholder="Your Name" className="form-control" style={{marginBottom:12}} value={donorName} onChange={e => setDonorName(e.target.value)} />
              <input type="email" placeholder="Your Email" className="form-control" style={{marginBottom:20}} value={donorEmail} onChange={e => setDonorEmail(e.target.value)} />
              <a href={`${paystackLink}?amount=${donationAmount}&email=${donorEmail}`} target="_blank" rel="noreferrer" className={`btn btn-gold ${styles.donateFullBtn}`}>
                💳 Donate with Paystack
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      {gallery.length > 0 && (
        <section className="section" id="gallery">
          <div className="container">
            <div className="section-header">
              <span className="section-tag">Gallery</span>
              <h2 className="section-title">Our Impact in Pictures</h2>
              <div className="divider" />
            </div>
            <div className={styles.galleryTabs}>
              {galleryCategories.map(cat => (
                <button key={cat} className={`${styles.galleryTab} ${activeGalleryTab === cat ? styles.galleryTabActive : ''}`} onClick={() => setActiveGalleryTab(cat)}>{cat.charAt(0).toUpperCase()+cat.slice(1)}</button>
              ))}
            </div>
            <div className={styles.galleryGrid}>
              {filteredGallery.slice(0,9).map(img => (
                <div key={img._id} className={styles.galleryItem}>
                  <img src={img.image} alt={img.title} />
                  <div className={styles.galleryOverlay}><p>{img.title}</p></div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

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
            {[
              { icon:'🤝', title:'Community-Centered', desc:'We identify real needs by working directly with communities, ensuring every initiative addresses genuine challenges.' },
              { icon:'📊', title:'Measurable Impact', desc:'We track, measure, and report our outcomes transparently, ensuring accountability to our partners and donors.' },
              { icon:'🌍', title:'Wide Reach', desc:'Our programs span multiple communities across Nigeria, giving your partnership maximum visibility and impact.' },
              { icon:'🏆', title:'Proven Track Record', desc:'Years of experience delivering results across education, healthcare, welfare, and women empowerment programs.' },
              { icon:'🔗', title:'Strong Networks', desc:'We connect partners with government agencies, religious institutions, and community leaders for amplified results.' },
              { icon:'💡', title:'Innovation-Driven', desc:'We continuously adapt our programs to meet evolving community needs with creative, sustainable solutions.' },
            ].map((item, i) => (
              <div key={i} className={`card ${styles.whyCard}`}>
                <div className={styles.whyIcon}>{item.icon}</div>
                <h4 className={styles.whyTitle}>{item.title}</h4>
                <p className={styles.whyDesc}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className={`section ${styles.contactSection}`} id="contact">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Get In Touch</span>
            <h2 className="section-title">Contact Us</h2>
            <div className="divider" />
          </div>
          <div className={styles.contactGrid}>
            <div className={styles.contactInfo}>
              <h3 className={styles.contactInfoTitle}>Let's Connect</h3>
              <p className={styles.contactInfoText}>We'd love to hear from you. Whether you want to volunteer, partner, donate, or simply learn more about our work.</p>
              <div className={styles.contactItems}>
                <div className={styles.contactItem}><span className={styles.contactIcon}>📍</span><div><strong>Address</strong><p>6 Olukunle Street, Ilupeju Oloponda Estate</p></div></div>
                <div className={styles.contactItem}><span className={styles.contactIcon}>📞</span><div><strong>Phone</strong><p>08136618814 | 07018205027</p></div></div>
                <div className={styles.contactItem}><span className={styles.contactIcon}>✉️</span><div><strong>Email</strong><p>angelinacarefoundation@gmail.com</p></div></div>
              </div>
            </div>
            <form className={styles.contactForm} onSubmit={handleContact}>
              <div className="grid-2" style={{gap:16}}>
                <div className="form-group"><label className="form-label">Name *</label><input className="form-control" value={contactForm.name} onChange={e=>setContactForm({...contactForm,name:e.target.value})} required /></div>
                <div className="form-group"><label className="form-label">Email *</label><input type="email" className="form-control" value={contactForm.email} onChange={e=>setContactForm({...contactForm,email:e.target.value})} required /></div>
              </div>
              <div className="grid-2" style={{gap:16}}>
                <div className="form-group"><label className="form-label">Phone</label><input className="form-control" value={contactForm.phone} onChange={e=>setContactForm({...contactForm,phone:e.target.value})} /></div>
                <div className="form-group"><label className="form-label">Type</label>
                  <select className="form-control" value={contactForm.type} onChange={e=>setContactForm({...contactForm,type:e.target.value})}>
                    <option value="general">General Inquiry</option>
                    <option value="partnership">Partnership</option>
                    <option value="volunteer">Volunteer</option>
                    <option value="donation">Donation</option>
                  </select>
                </div>
              </div>
              <div className="form-group"><label className="form-label">Subject *</label><input className="form-control" value={contactForm.subject} onChange={e=>setContactForm({...contactForm,subject:e.target.value})} required /></div>
              <div className="form-group"><label className="form-label">Message *</label><textarea className="form-control" rows={5} value={contactForm.message} onChange={e=>setContactForm({...contactForm,message:e.target.value})} required /></div>
              <button type="submit" className="btn btn-primary" disabled={sending} style={{width:'100%',justifyContent:'center'}}>
                {sending ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
