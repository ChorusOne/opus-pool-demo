import { useAccount } from 'wagmi';
import { useNetworkAndVaultContext } from '../context/neworkAndVaultContext';
import { ConnectButton } from './WebConnectButton';

export const Header = () => {
    const { vaultForChain } = useNetworkAndVaultContext();
    const { isConnected } = useAccount();
    return (
        <header>
            <h1>OPUS POOL</h1>
            {isConnected && vaultForChain ? <h3>Vault: {vaultForChain}</h3> : null}
            <ConnectButton />
        </header>
    );
};
