'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { galleryAPI } from '../../lib/api';
import styles from './gallery.module.css';

const PLACEHOLDER_GALLERY = [
  { _id:'1', image:'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&q=80', title:'Community Outreach Program', category:'community' },
  { _id:'2', image:'https://images.unsplash.com/photo-1531545514256-b1400bc00f31?w=600&q=80', title:'Women Empowerment Workshop', category:'women' },
  { _id:'3', image:'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=600&q=80', title:'Free Medical Checkup Camp', category:'healthcare' },
  { _id:'4', image:'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&q=80', title:'Education Support Drive', category:'education' },
  { _id:'5', image:'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=600&q=80', title:'Youth Leadership Summit', category:'youth' },
  { _id:'6', image:'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=600&q=80', title:'Relief Material Distribution', category:'welfare' },
  { _id:'7', image:'https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=600&q=80', title:'Skills Training Session', category:'women' },
  { _id:'8', image:'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80', title:'Health Awareness Campaign', category:'healthcare' },
  { _id:'9', image:'https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?w=600&q=80', title:'Community Clean-Up Exercise', category:'community' },
];

export default function GalleryPage() {
  const [gallery, setGallery] = useState(PLACEHOLDER_GALLERY);
  const [activeTab, setActiveTab] = useState('all');
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    galleryAPI.getGallery()
      .then(r => { if (r.data.items?.length) setGallery(r.data.items); })
      .catch(() => {});
  }, []);

  const categories = ['all', ...new Set(gallery.map(g => g.category).filter(Boolean))];
  const filtered = activeTab === 'all' ? gallery : gallery.filter(g => g.category === activeTab);

  return (
    <main>
      <Navbar />

      {/* Page Hero */}
      <div className="page-hero">
        <div className="container">
          <div className="page-hero-inner">
            <span className="page-hero-tag">Gallery</span>
            <h1 className="page-hero-title">Our Impact in Pictures</h1>
            <p className="page-hero-sub">
              A visual record of the lives we've touched, the communities we've served, and the change we continue to create together.
            </p>
            <div className="breadcrumb">
              <Link href="/">Home</Link>
              <span>›</span>
              <span>Gallery</span>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery */}
      <section className="section">
        <div className="container">
          {/* Tabs */}
          <div className={styles.tabs}>
            {categories.map(cat => (
              <button
                key={cat}
                className={`${styles.tab} ${activeTab === cat ? styles.tabActive : ''}`}
                onClick={() => setActiveTab(cat)}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className={styles.grid}>
            {filtered.map((img, i) => (
              <div
                key={img._id}
                className={styles.item}
                onClick={() => setLightbox(img)}
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <img src={img.image} alt={img.title} loading="lazy" />
                <div className={styles.overlay}>
                  <div className={styles.overlayIcon}>🔍</div>
                  <p className={styles.overlayTitle}>{img.title}</p>
                  {img.category && <span className={styles.overlayTag}>{img.category}</span>}
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className={styles.empty}>
              <span>📷</span>
              <p>No images in this category yet. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {lightbox && (
        <div className={styles.lightbox} onClick={() => setLightbox(null)}>
          <div className={styles.lightboxContent} onClick={e => e.stopPropagation()}>
            <button className={styles.lightboxClose} onClick={() => setLightbox(null)}>✕</button>
            <img src={lightbox.image} alt={lightbox.title} />
            <div className={styles.lightboxCaption}>
              <strong>{lightbox.title}</strong>
              {lightbox.category && <span className={styles.lightboxTag}>{lightbox.category}</span>}
            </div>
          </div>
        </div>
      )}

      {/* CTA */}
      <section className={`section ${styles.ctaSection}`}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 className={styles.ctaTitle}>Want to Be Part of Our Story?</h2>
          <p className={styles.ctaSub}>Join us as a volunteer, donor, or partner and help create more moments of impact worth capturing.</p>
          <div className={styles.ctaActions}>
            <Link href="/contact" className="btn btn-gold btn-lg">Get Involved</Link>
            <Link href="/donate" className="btn btn-outline btn-lg">Support Us</Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
