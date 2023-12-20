import { useMutation } from '@tanstack/react-query';
import { useWalletClient } from 'wagmi';
import toast from 'react-hot-toast';
import { Hex } from 'viem';
import { showSuccessToast } from '../components/SuccessToast';
import { Networks, OpusPool, StakingTypeEnum } from '@chorus-one/opus-pool';

export const useStakeMutation = () => {
    return useMutation({
        mutationKey: ['stake'],
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
        }) => stake({ userAddress, network, vault, amount, walletClient }),
        onSuccess: (data) => showSuccessToast(data, StakingTypeEnum.Stake),
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

const stake = async ({
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
    const stakingReq = {
        vault,
        amount,
    };
    const stakeRes = await pool.buildStakeTransaction(stakingReq);
    const { transaction, gasEstimation, maxPriorityFeePerGas, maxFeePerGas } = stakeRes;

    if (!walletClient) throw new Error('Wallet client not found');

    const hash = await walletClient.sendTransaction({
        account: userAddress,
        to: vault,
        data: transaction,
        value: amount,
        type: 'eip1559',
        gas: gasEstimation,
        maxPriorityFeePerGas,
        maxFeePerGas,
    });
    const receipt = await pool.connector.eth.waitForTransactionReceipt({ hash });
    if (receipt.status === 'reverted') {
        throw new Error('Transaction reverted');
    }
    return hash;
};
