import { useAccount } from 'wagmi';
import { formatEther } from 'viem';
import { useTransactionHistory } from '../hooks/useTransactions';
import { useNetworkAndVaultContext } from '../context/neworkAndVaultContext';
import { explorerUrlsMap } from '../utils/constants';
import { Networks, VaultTransaction } from '@chorus-one/opus-pool';

export const TransactionsComponent = () => {
    const { address } = useAccount();
    const { networkType, vaultForChain } = useNetworkAndVaultContext();
    const {
        data: transactions,
        isError,
        isLoading,
    } = useTransactionHistory({
        address,
        network: networkType,
        vaults: vaultForChain,
    });

    return (
        <div style={{ height: '700px', overflow: 'scroll' }}>
            <h2 style={{ marginBottom: 0 }}>Transactions</h2>
            <table style={{ width: '80%', margin: '0 auto' }}>
                <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                    <tr>
                        <th>Vault name</th>
                        <th>Vault address</th>
                        <th>Tx type</th>
                        <th>Tx hash</th>
                        <th>Amount</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody style={{ height: '310px', overflowY: 'scroll' }}>
                    {isLoading ? (
                        <tr>
                            <td colSpan={5}>Loading...</td>
                        </tr>
                    ) : null}
                    {transactions ? <Transactions transactions={transactions} networkType={networkType} /> : null}
                    {isError ? (
                        <tr>
                            <td colSpan={5}>Error getting transactions</td>
                        </tr>
                    ) : null}
                </tbody>
            </table>
        </div>
    );
};
const Transactions = ({ transactions, networkType }: { transactions: VaultTransaction[]; networkType: Networks }) => {
    return transactions.map((transaction, index) => {
        const vault = transaction.vault ? transaction.vault : null;
        const shortAddress = vault ? vault.slice(0, 6) + '...' + vault.slice(-4) : 'No address';
        const vaultName = vault;
        const type = transaction.type ? transaction.type : 'No type';
        const date = transaction.when ? transaction.when.toDateString() : 'No date';
        const hash = transaction.hash ? transaction.hash.split('-')[0] : '-';
        const link = explorerUrlsMap.get(networkType);
        return (
            <tr key={index}>
                <td>{vaultName}</td>
                <td>{shortAddress}</td>
                <td>{type}</td>
                <td
                    style={{
                        maxWidth: '100px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                    }}
                >
                    <a href={link + hash} target="_blank" rel="noreferrer">
                        {hash}
                    </a>
                </td>
                <td>{formatEther(transaction.amount, 'wei')} ETH</td>
                <td>{date}</td>
            </tr>
        );
    });
};
