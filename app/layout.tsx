import './globals.css';

export const metadata = {
  title: 'Ben Balter',
  description: 'Technology leadership, collaboration, and open source',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
