import { useAccount } from 'wagmi';
import { useNetworkAndVaultContext } from '../context/neworkAndVaultContext';
import { ConnectButton } from './WebConnectButton';
import { Hex } from 'viem';

export const Header = () => {
    const { allVaultsForChain, setSelectedVaultDetails } = useNetworkAndVaultContext();
    const { isConnected } = useAccount();
    return (
        <header>
            <h1>OPUS POOL</h1>
            {isConnected && allVaultsForChain ? renderVaultSelector(allVaultsForChain, setSelectedVaultDetails) : null}
            <ConnectButton />
        </header>
    );
};

const renderVaultSelector = (vaults: Hex[], setVaultDetails: (value: Hex) => void) => {
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                outline: 'none',
                gap: '1rem',
            }}
        >
            <h3>Select a vault:</h3>
            <div
                style={{
                    border: '1px solid #168F9C',
                    padding: '.5rem 1rem',
                    borderRadius: '0.5rem',
                }}
            >
                <select
                    style={{
                        width: 'fit-content',
                        padding: '0.5rem',
                        border: 'none',
                        outline: 'none',
                    }}
                    onChange={(e) => {
                        const selectedVault = vaults.find((vault) => vault === e.target.value);
                        if (selectedVault) {
                            setVaultDetails(selectedVault);
                        }
                    }}
                >
                    {vaults.map((vault: Hex) => {
                        return (
                            <option key={vault} value={vault}>
                                {vault}
                            </option>
                        );
                    })}
                </select>
            </div>
        </div>
    );
};
