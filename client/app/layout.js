import './globals.css';
import { Toaster } from 'react-hot-toast';

export const metadata = {
  title: {
    default: 'Angelina Care Foundation | Compassion in Action',
    template: '%s | Angelina Care Foundation',
  },
  description: 'Angelina Care Foundation is a purpose-driven Nigerian NGO committed to improving lives through women empowerment, education, healthcare outreach, youth development, and sustainable community development programs.',
  keywords: 'NGO Nigeria, community development, women empowerment, youth development, education support, healthcare outreach, Ilupeju, Lagos NGO, Angelina Care Foundation',
  openGraph: {
    title: 'Angelina Care Foundation',
    description: 'Compassion in Action. Impact for Generations. Empowering communities across Nigeria.',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#1a3a6b" />
      </head>
      <body>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              fontFamily: 'Inter, sans-serif',
              borderRadius: '12px',
              boxShadow: '0 8px 32px rgba(26,58,107,0.15)',
            },
            success: {
              iconTheme: { primary: '#2563eb', secondary: '#fff' },
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}
