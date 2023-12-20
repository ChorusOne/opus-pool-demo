import { useQuery } from '@tanstack/react-query';
import { Hex, formatGwei } from 'viem';
import { ChartDataPoint } from '../components/Rewards';
import { Networks, OpusPool, RewardsDataPoint } from '@chorus-one/opus-pool';

export const useRewards = ({
    network,
    vault,
    address,
    from,
    to,
}: {
    network: Networks | undefined;
    vault: Hex;
    address: Hex | undefined;
    from: Date;
    to: Date;
}) => {
    // enable if address and netwrok are defined
    return useQuery({
        queryKey: ['rewards'],
        queryFn: () => getRewards({ address, network, vault, from, to }),
        enabled: !!address && !!vault && !!network,
    });
};

const getRewards = async ({
    address,
    network,
    vault,
    from,
    to,
}: {
    address: Hex | undefined;
    network: Networks | undefined;
    vault: Hex;
    from: Date;
    to: Date;
}): Promise<ChartDataPoint[]> => {
    if (!address || !network || !vault) {
        return [];
    }
    const pool = new OpusPool({
        address,
        network,
    });
    const rewardsRequest = {
        from,
        to,
        vault,
    };

    let chartData: ChartDataPoint[] = [];
    try {
        const res: RewardsDataPoint[] = await pool.getRewardsHistory(rewardsRequest);
        if (!res || res.length === 0) throw new Error('There are no rewards for this vault');
        chartData = res.map((point) => {
            return {
                date: point.when.toDateString(),
                amount: Number(formatGwei(point.amount)),
            };
        });
    } catch (error) {
        throw new Error(`Failed to get rewards: ${error}`);
    }

    return chartData;
};
