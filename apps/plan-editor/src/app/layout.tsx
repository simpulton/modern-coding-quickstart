import './global.css';
import type { ReactNode } from 'react';
import { TrpcProvider } from '../trpc/provider';
import { NavBar } from '../components/nav-bar';

export const metadata = {
  title: 'Plan Editor — modern-coding-quickstart',
  description: 'Reference app for the constitution workshop',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <TrpcProvider>
          <NavBar />
          <main className="container">{children}</main>
        </TrpcProvider>
      </body>
    </html>
  );
}
