import './App.css';
import { WagmiConfig } from 'wagmi';
import { config } from './web3/config';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NetworkProvider } from './context/neworkAndVaultContext';
import VaultDetailsUpdater from './updaters/VaultDetailsUpdater';
import { Header } from './components/Header';
import { Tabs } from './components/Tabs';
import { Toaster } from 'react-hot-toast';

function App() {
    const queryClient = new QueryClient();
    return (
        <>
            <QueryClientProvider client={queryClient}>
                <NetworkProvider>
                    <WagmiConfig config={config}>
                        <Header />
                        <Tabs />
                        <VaultDetailsUpdater />
                        <Toaster />
                    </WagmiConfig>
                </NetworkProvider>
            </QueryClientProvider>
        </>
    );
}

export default App;
