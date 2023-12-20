import { useAccount } from 'wagmi';
import { LineChart, Line, XAxis, YAxis } from 'recharts';
import { useRewards } from '../hooks/useRewards';
import { useNetworkAndVaultContext } from '../context/neworkAndVaultContext';

export type ChartDataPoint = {
    amount: number;
    date: string;
};

export const RewardsComponent = () => {
    const { address } = useAccount();
    const { selectedVaultDetails, networkType } = useNetworkAndVaultContext();

    const from = new Date();
    from.setMonth(from.getMonth() - 1);
    const to = new Date();

    const {
        data: chartData,
        isError,
        isLoading,
    } = useRewards({
        address,
        network: networkType,
        vault: selectedVaultDetails!,
        from,
        to, // today
    });

    return (
        <div
            style={{
                border: '1px solid #168F9C',
            }}
        >
            <h2>Rewards</h2>
            {isLoading ? <div>Loading...</div> : null}
            {chartData ? <RewardsChart data={chartData} /> : null}
            {isError ? <div>Error getting rewards</div> : null}
        </div>
    );
};

const RewardsChart = ({ data }: { data: ChartDataPoint[] }) => {
    return (
        <LineChart
            width={700}
            height={300}
            data={data}
            margin={{
                top: 5,
                bottom: 5,
            }}
        >
            <XAxis dataKey="date" />
            <YAxis />
            <Line type="monotone" dataKey="amount" stroke="#8884d8" />
        </LineChart>
    );
};
