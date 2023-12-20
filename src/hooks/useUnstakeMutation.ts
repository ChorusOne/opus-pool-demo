import { useMutation } from '@tanstack/react-query';
import { Hex } from 'viem';
import { useWalletClient } from 'wagmi';
import { showSuccessToast } from '../components/SuccessToast';
import toast from 'react-hot-toast';
import { Networks, OpusPool, StakingTypeEnum } from '@chorus-one/opus-pool';

export const useUnstakeMutation = () => {
    return useMutation({
        mutationKey: ['unstake'],
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
        }) => unstake({ userAddress, network, vault, amount, walletClient }),
        onSuccess: (data: Hex) => showSuccessToast(data, StakingTypeEnum.Unstake),
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

const unstake = async ({
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
    const pool = new OpusPool({ network, address: userAddress });
    const stakeRes = await pool.buildUnstakeTransaction({
        vault,
        amount,
    });
    const { transaction, gasEstimation, maxPriorityFeePerGas, maxFeePerGas } = stakeRes;

    if (!walletClient) throw new Error('Wallet client not found');

    const hash = await walletClient.sendTransaction({
        account: userAddress,
        to: vault,
        data: transaction,
        type: 'eip1559',
        gas: gasEstimation,
        maxPriorityFeePerGas,
        maxFeePerGas,
    });
    await pool.connector.eth
        .waitForTransactionReceipt({ hash })
        .then((receipt) => {
            if (receipt.status === 'reverted') {
                throw new Error(`Tx reverted`);
            }
        })
        .catch((error) => {
            throw new Error(error);
        });
    return hash;
};
