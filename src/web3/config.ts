import { createWeb3Modal } from '@web3modal/wagmi/react';
import { mainnet, holesky } from 'viem/chains';
import { configureChains, createConfig } from 'wagmi';

import { walletConnectProvider, EIP6963Connector } from '@web3modal/wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';

const projectId = import.meta.env.VITE_WC_PROJECT_ID;

const chains = [mainnet, holesky];

const metadata = {
    name: 'Opus Pool',
    description: 'Opus Pool',
    url: '',
    icons: [''],
};

const { publicClient } = configureChains(chains, [walletConnectProvider({ projectId }), publicProvider()]);

export const config = createConfig({
    autoConnect: true,
    connectors: [
        new WalletConnectConnector({
            chains,
            options: { projectId, showQrModal: false, metadata },
        }),
        new EIP6963Connector({ chains }),
        new InjectedConnector({ chains, options: { shimDisconnect: true } }),
    ],
    publicClient,
});

createWeb3Modal({ wagmiConfig: config, projectId, chains });
