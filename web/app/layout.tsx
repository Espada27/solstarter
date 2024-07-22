import './global.css';
import { UiLayout } from '@/components/ui/ui-layout';
import { ClusterProvider } from '@/components/cluster/cluster-data-access';
import { SolanaProvider } from '@/components/solana/solana-provider';
import { ReactQueryProvider } from './react-query-provider';

export const metadata = {
  title: 'Solstarter',
  description: 'The best decentralized crowdfunding app',
};

const links: { label: string; path: string }[] = [
  { label: 'Projets', path: '/projects' },
  { label: 'Marché de récompenses', path: '/rewardsmarket' },
  { label: 'Mon profil', path: '/myprofile' }
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
    <link rel="icon" href="/favicons/favicon.ico" sizes="any" />
      <body>
        <ReactQueryProvider>
          <ClusterProvider>
            <SolanaProvider>
              <UiLayout links={links}>{children}</UiLayout>
            </SolanaProvider>
          </ClusterProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
