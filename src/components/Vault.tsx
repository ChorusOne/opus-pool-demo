import { useAccount } from 'wagmi';
import { formatEther } from 'viem';
import { useVaultDetails } from '../hooks/useVaultDetails';
import { useNetworkAndVaultContext } from '../context/neworkAndVaultContext';
import { VaultDetails } from '@chorus-one/opus-pool';

export const VaultDetailsComponent = () => {
    const { address } = useAccount();
    const { vaultForChain, networkType } = useNetworkAndVaultContext();

    const {
        data: vaultData,
        isError,
        isLoading,
    } = useVaultDetails({
        address,
        vault: vaultForChain,
        network: networkType,
    });

    return (
        <div
            style={{
                padding: '1rem',
            }}
        >
            <h2>Vault details</h2>
            {isLoading ? <div>Loading...</div> : null}
            {vaultData ? <Vault vaultData={vaultData} /> : null}
            {isError ? <div>We couldn't get vault details</div> : null}
        </div>
    );
};

const Vault = ({ vaultData }: { vaultData: VaultDetails[] }) => {
    return (
        <table
            style={{
                fontFamily: 'sans-serif',
                width: '100%',
            }}
        >
            <thead>
                <tr>
                    <th style={{ width: '15%' }}>Vault name</th>
                    <th style={{ width: '40%' }}>Description</th>
                    <th style={{ width: '10%' }}>APY</th>
                    <th style={{ width: '15%' }}>TVL</th>
                    <th style={{ width: '15%' }}>Current balance</th>
                </tr>
            </thead>
            <tbody>
                {vaultData.map((vault: VaultDetails) => (
                    <tr key={vault.name}>
                        <td style={{ width: '15%' }}>{vault.name}</td>
                        <td style={{ width: '40%' }}>{vault.description}</td>
                        <td style={{ width: '10%' }}>{vault.apy * 100} %</td>
                        <td style={{ width: '15%' }}>{Number(formatEther(vault.tvl)).toLocaleString()} ETH</td>
                        <td style={{ width: '15%' }}>{Number(formatEther(vault.balance)).toLocaleString()} ETH</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};
