import './globals.css';
import Sidebar from '@/components/Sidebar';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Pousada Finance',
  description: 'Sistema Financeiro para Pousada',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className}>
        <div style={{ display: 'flex' }}>
          <Sidebar />
          <main style={{
            flex: 1,
            marginLeft: '260px',
            padding: '2rem',
            maxWidth: '1200px',
            marginRight: 'auto'
          }}>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
