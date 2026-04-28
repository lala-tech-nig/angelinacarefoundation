import './globals.css';
import { Toaster } from 'react-hot-toast';

export const metadata = {
  title: 'Angelina Care Foundation | Compassion in Action',
  description: 'Angelina Care Foundation is a purpose-driven NGO committed to improving lives through empowerment, education, healthcare, and sustainable development programs.',
  keywords: 'NGO Nigeria, community development, women empowerment, youth development, education support, healthcare outreach',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <Toaster position="top-right" toastOptions={{ duration: 4000, style: { fontFamily: 'Inter, sans-serif', borderRadius: '12px' } }} />
        {children}
      </body>
    </html>
  );
}
