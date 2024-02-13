import { useMutation } from '@tanstack/react-query';
import { useWalletClient } from 'wagmi';
import toast from 'react-hot-toast';
import { Hex } from 'viem';
import { showSuccessToast } from '../components/SuccessToast';
import { Networks, OpusPool } from '@chorus-one/opus-pool';

export const useMintMutation = () => {
    return useMutation({
        mutationKey: ['mint'],
        mutationFn: ({
            userAddress,
            network,
            vault,
            amount,
            walletClient,
        }: {
            userAddress: Hex;
            network: Networks;
            vault: Hex;
            amount: bigint;
            walletClient: ReturnType<typeof useWalletClient>['data'];
        }) => mint({ userAddress, network, vault, amount, walletClient }),
        onSuccess: (data) => showSuccessToast(data, 'Mint'),
        onError: (error: unknown) => {
            let errorMessage: string;
            if (error instanceof Error) {
                errorMessage = error.message;
            } else {
                errorMessage = 'Something went wrong';
            }
            toast.error(errorMessage, {
                duration: 5000,
                position: 'bottom-right',
            });
        },
    });
};
const mint = async ({
    userAddress,
    walletClient,
    network,
    vault,
    amount,
}: {
    userAddress: Hex;
    walletClient: ReturnType<typeof useWalletClient>['data'];
    network: Networks;
    vault: Hex;
    amount: bigint;
}): Promise<Hex> => {
    const pool = new OpusPool({
        network: network,
        address: userAddress,
    });
    if (!walletClient) throw new Error('Wallet client not found');
    const mintTx = await pool.buildMintTransaction({
        shares: amount,
        vault,
        referrer: vault,
    });
    const hash = await walletClient.sendTransaction({
        account: userAddress,
        to: vault,
        data: mintTx.transaction,
        type: 'eip1559',
        gas: mintTx.gasEstimation,
        maxPriorityFeePerGas: mintTx.maxPriorityFeePerGas,
        maxFeePerGas: mintTx.maxFeePerGas,
    });

    if (!hash) {
        throw new Error('Something went wrong with the tx');
    }
    const receipt = await pool.connector.eth.waitForTransactionReceipt({ hash });
    if (receipt.status === 'reverted') {
        throw new Error('The transaction got reverted');
    }
    return hash;
};
