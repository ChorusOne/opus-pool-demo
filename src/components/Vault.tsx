import { useAccount } from 'wagmi';
import { formatEther } from 'viem';
import { VaultData, useVaultDetails } from '../hooks/useVaultDetails';
import { useNetworkAndVaultContext } from '../context/neworkAndVaultContext';
import { HealthData, useHealthQuery } from '../hooks/useHealthQuery';
import { OsTokenPositionHealth } from '@chorus-one/opus-pool';

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
    const { data: healthData } = useHealthQuery({
        userAddress: address,
        vaultAddress: vaultForChain,
        amountToMint: vaultData?.maxMint,
        network: networkType,
        vaultData,
    });

    return (
        <div
            style={{
                paddingTop: '1rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'start',
            }}
        >
            {isLoading ? <div>Loading...</div> : null}
            <div style={{ display: 'flex', flexDirection: 'row', gap: '3rem' }}>
                {vaultData ? <Vault vault={vaultData} /> : null}
                {vaultData ? <UserData vault={vaultData} healthData={healthData} /> : null}
            </div>
            {isError ? <div>We couldn't get vault details</div> : null}
        </div>
    );
};

const Vault = ({ vault }: { vault: VaultData }) => {
    return (
        <div
            style={{
                fontFamily: 'sans-serif',
                display: 'grid',
                gridTemplateColumns: 'auto 1fr',
                justifyItems: 'start',
                gap: '1rem',
                border: '1px solid lightGrey',
                borderRadius: '10px',
                padding: '1rem',
            }}
        >
            <strong>Vault name</strong>
            <div>{vault.name}</div>
            <strong>Address</strong>
            <div>{vault.address}</div>
            <strong>Description</strong>
            <div>{vault.description}</div>
            <strong>APY</strong>
            <div>{Number(vault.apr).toLocaleString('US-EN')} %</div>

            <strong>TVL</strong>
            <div>{Number(vault.tvl).toLocaleString()} ETH</div>

            <strong>Current balance</strong>
            <div>{Number(formatEther(vault.stake.assets)).toLocaleString()} ETH</div>
        </div>
    );
};

const UserData = ({ vault, healthData }: { vault: VaultData; healthData: HealthData | undefined }) => {
    return (
        <div
            style={{
                fontFamily: 'sans-serif',
                display: 'grid',
                gridTemplateColumns: 'auto 1fr',
                justifyItems: 'start',
                gap: '1rem',
                border: '1px solid lightGrey',
                borderRadius: '10px',
                padding: '1rem',
            }}
        >
            <strong>Total staked</strong>
            <div>{Number(formatEther(vault.stake.assets)).toLocaleString('US-EN')} ETH</div>
            <strong>Minted</strong>
            <div>{Number(formatEther(vault.minted)).toLocaleString('US-EN')} osETH</div>
            <strong>Vault health</strong>
            <div>{healthData ? OsTokenPositionHealth[healthData.initialHealth] : '-'}</div>
            <strong>Max unstake amount</strong>
            <div>{Number(formatEther(vault.maxWithdraw)).toLocaleString('US-EN')} osETH</div>
        </div>
    );
};
