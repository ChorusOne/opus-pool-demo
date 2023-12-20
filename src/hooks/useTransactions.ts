import { Networks, OpusPool, VaultTransaction, getDefaultVaults } from '@chorus-one/opus-pool';
import { useQuery } from '@tanstack/react-query';
import { Hex } from 'viem';

export const useTransactionHistory = ({
    network,
    vaults,
    address,
}: {
    network: Networks;
    vaults: Hex | undefined;
    address: Hex | undefined;
}) => {
    return useQuery({
        queryKey: ['transactions', vaults],
        queryFn: () => getTxHistory({ address, network, vaults }),
        enabled: !!address && !!network && !!vaults,
    });
};

const getTxHistory = async ({
    address,
    network,
    vaults,
}: {
    address: Hex | undefined;
    network: Networks;
    vaults: Hex | undefined;
}): Promise<VaultTransaction[]> => {
    if (!address || !network) {
        return [];
    }
    const pool = new OpusPool({
        address,
        network,
    });
    let requestedVaults: Hex[] = [];
    if (!vaults) {
        requestedVaults = getDefaultVaults(network);
    } else {
        requestedVaults = [vaults];
    }
    const txData: VaultTransaction[] = [];
    try {
        const res: VaultTransaction[] = await pool.getTransactionsHistory(requestedVaults);
        if (res.length > 0) {
            res.forEach((tx) => {
                txData.push(tx);
            });
        }
    } catch (error) {
        throw new Error(`Failed to get tx history: ${error}`);
    }

    return txData;
};
