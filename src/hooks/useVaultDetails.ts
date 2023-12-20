import { Networks, OpusPool, VaultDetails } from '@chorus-one/opus-pool';
import { useQuery } from '@tanstack/react-query';
import { Hex } from 'viem';

export const useVaultDetails = ({
    network,
    vault,
    address,
}: {
    network: Networks;
    vault: Hex | undefined;
    address: Hex | undefined;
}) => {
    return useQuery({
        queryKey: ['vaultDetails', vault],
        queryFn: () => getVaultDetails({ address, network, vaults: vault && [vault] }),
        enabled: !!address && !!network && !!vault,
    });
};

const getVaultDetails = async ({
    address,
    network,
    vaults,
}: {
    address: Hex | undefined;
    network: Networks;
    vaults: Hex[] | undefined;
}): Promise<VaultDetails[]> => {
    if (!address || !network || !vaults) {
        return [];
    }
    const pool = new OpusPool({
        address,
        network,
    });
    const res = await pool.getVaultDetails(vaults);

    return res;
};
