import { Networks, OpusPool } from '@chorus-one/opus-pool';
import { useQuery } from '@tanstack/react-query';
import { Hex, formatEther } from 'viem';

export interface VaultData {
    stake: {
        assets: bigint;
        shares: bigint;
    };
    minted: bigint;
    maxMint: bigint;
    maxWithdraw: bigint;
    apr: number;
    tvl: string;
    address: Hex;
    name: string;
    description: string;
}

export const useVaultDetails = ({
    network,
    vault,
    address,
}: {
    network: Networks;
    vault: Hex | undefined;
    address: Hex | undefined;
}) => {
    const enabled = !!address && !!network && !!vault;
    return useQuery({
        queryKey: ['vaultDetails', vault],
        queryFn: () => getVaultDetails({ address: address!, network, vault: vault! }),
        enabled,
    });
};

const getVaultDetails = async ({ address, network, vault }: { address: Hex; network: Networks; vault: Hex }) => {
    const pool = new OpusPool({
        address,
        network,
    });
    const [{ minted }, maxMint, maxWithdraw, stake, [vaultDetails]] = await Promise.all([
        pool.getOsTokenPositionForVault(vault),
        pool.getMaxMintForVault(vault),
        pool.getMaxUnstakeForUserForVault(vault),
        pool.getStakeBalanceForUser(vault),
        pool.getVaultDetails([vault]),
    ]);

    const result: VaultData = {
        stake,
        minted: minted.shares - minted.fee,
        maxMint,
        maxWithdraw,
        apr: Number(vaultDetails.apy),
        tvl: formatEther(vaultDetails.tvl),
        address: vault,
        name: vaultDetails.name,
        description: vaultDetails.description,
    };

    return result;
};
