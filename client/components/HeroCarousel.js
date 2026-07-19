'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import styles from './HeroCarousel.module.css';

const FALLBACK_SLIDES = [
  {
    _id: '1',
    title: 'Compassion in Action',
    subtitle: 'Angelina Care Foundation',
    description: 'Empowering communities through education, healthcare, and sustainable development programs across Nigeria.',
    image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1600&q=80',
    ctaText: 'Our Programs',
    ctaLink: '/programs',
    ctaSecondaryText: 'Donate Now',
    ctaSecondaryLink: '/donate',
  },
  {
    _id: '2',
    title: 'Empowering Women & Youth',
    subtitle: 'Building Stronger Communities',
    description: 'Promoting women inclusion, leadership, entrepreneurship, and youth mentorship for a better tomorrow.',
    image: 'https://images.unsplash.com/photo-1531545514256-b1400bc00f31?w=1600&q=80',
    ctaText: 'Learn More',
    ctaLink: '/about',
    ctaSecondaryText: 'Partner With Us',
    ctaSecondaryLink: '/contact',
  },
  {
    _id: '3',
    title: 'Healthcare For All',
    subtitle: 'Community Wellness Programs',
    description: 'Organizing free medical checkups, health awareness campaigns, and maternal support for underserved communities.',
    image: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=1600&q=80',
    ctaText: 'Our Impact',
    ctaLink: '/about',
    ctaSecondaryText: 'Contact Us',
    ctaSecondaryLink: '/contact',
  },
];

export default function HeroCarousel({ slides: propSlides }) {
  const slides = propSlides?.length ? propSlides : FALLBACK_SLIDES;
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const goTo = useCallback((idx) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrent(idx);
    setTimeout(() => setIsAnimating(false), 800);
  }, [isAnimating]);

  const next = useCallback(() => goTo((current + 1) % slides.length), [current, slides.length, goTo]);
  const prev = useCallback(() => goTo((current - 1 + slides.length) % slides.length), [current, slides.length, goTo]);

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <section className={styles.hero} id="home">
      {slides.map((slide, i) => (
        <div
          key={slide._id}
          className={`${styles.slide} ${i === current ? styles.active : ''}`}
          style={{ backgroundImage: `url(${slide.image})` }}
        >
          <div className={styles.overlay} />
        </div>
      ))}

      <div className={styles.content}>
        <div className="container">
          <div className={styles.text}>
            <span className={styles.tag}>{slides[current].subtitle}</span>
            <h1 className={styles.title}>{slides[current].title}</h1>
            <div className={styles.divider} />
            <p className={styles.desc}>{slides[current].description}</p>
            <div className={styles.actions}>
              <Link href={slides[current].ctaLink} className="btn btn-gold btn-lg">
                {slides[current].ctaText}
              </Link>
              <Link href={slides[current].ctaSecondaryLink} className="btn btn-outline btn-lg">
                {slides[current].ctaSecondaryText}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Arrows */}
      <button className={`${styles.arrow} ${styles.arrowLeft}`} onClick={prev} aria-label="Previous">&#8249;</button>
      <button className={`${styles.arrow} ${styles.arrowRight}`} onClick={next} aria-label="Next">&#8250;</button>

      {/* Dots */}
      <div className={styles.dots}>
        {slides.map((_, i) => (
          <button key={i} className={`${styles.dot} ${i === current ? styles.dotActive : ''}`} onClick={() => goTo(i)} aria-label={`Slide ${i + 1}`} />
        ))}
      </div>

      {/* Scroll indicator */}
      <div className={styles.scrollIndicator}>
        <div className={styles.scrollLine} />
        <span>Scroll</span>
      </div>
    </section>
  );
}
