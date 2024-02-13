import { QueryKey, useQuery } from '@tanstack/react-query';
import { Hex } from 'viem';
import { Networks, OpusPool, OsTokenPositionHealth } from '@chorus-one/opus-pool';
import { VaultData } from './useVaultDetails';

export type HealthData = {
    initialHealth: OsTokenPositionHealth;
    updatedHealth: OsTokenPositionHealth;
};

export const useHealthQuery = ({
    userAddress,
    vaultAddress,
    amountToMint,
    vaultData,
    network,
}: {
    userAddress: Hex | undefined;
    vaultAddress: Hex | undefined;
    amountToMint?: bigint;
    vaultData: VaultData | undefined;
    network: Networks;
}) => {
    const enabled = !!vaultData && !!amountToMint;
    return useQuery<HealthData, unknown, HealthData, QueryKey>({
        // @ts-expect-error: a known issue with queryKey typing
        queryKey: ['health', userAddress, vaultAddress, amountToMint?.toString()],
        queryFn: () => getHealth({ amountToMint: amountToMint!, vaultData, userAddress, vaultAddress, network }),
        enabled,
        refetchOnWindowFocus: false,
    });
};

const getHealth = async ({
    userAddress,
    vaultAddress,
    amountToMint,
    vaultData,
    network,
}: {
    userAddress: Hex | undefined;
    vaultAddress: Hex | undefined;
    amountToMint: bigint;
    vaultData: VaultData | undefined;
    network: Networks;
}) => {
    if (!userAddress || !vaultAddress || !vaultData) {
        return undefined;
    }
    const pool = new OpusPool({
        address: userAddress,
        network: network,
    });
    const { stake } = vaultData;
    const { minted, health } = await pool.getOsTokenPositionForVault(vaultAddress);

    const newMintShares = minted.shares + amountToMint;
    const newHealth = await pool.getHealthFactorForUser(newMintShares, stake.assets);

    return {
        initialHealth: health,
        updatedHealth: newHealth,
    };
};
