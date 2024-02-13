import React, { useEffect } from 'react';
import { formatEther } from 'viem';
import { useNetworkAndVaultContext } from '../context/neworkAndVaultContext';
import { useAccount } from 'wagmi';
import toast, { LoaderIcon } from 'react-hot-toast';
import { AmountInput } from './AmountInput';

export const BurnForm = ({
    onSubmit,
    maxAmount,
    setAmount,
    isError,
    isLoading,
    isSuccess,
}: {
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
    maxAmount: bigint | undefined;
    setAmount: React.Dispatch<React.SetStateAction<bigint>>;
    isError: boolean;
    isLoading: boolean;
    isSuccess: boolean;
}) => {
    const { wrongNetwork } = useNetworkAndVaultContext();
    const { isConnected } = useAccount();

    useEffect(() => {
        if (isError) {
            toast.error('Something went wrong');
        }
    }, [isError]);

    return (
        <div style={{ padding: '1rem', border: '1px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h2>Burn osETH</h2>
            <form
                onSubmit={(e) => {
                    onSubmit(e);
                }}
                style={{ width: '450px', margin: '1rem auto' }}
            >
                <AmountInput
                    disabled={!isConnected || isLoading || wrongNetwork}
                    title={!isConnected ? 'Connect wallet' : 'Enter the amount to stake'}
                    isSuccess={isSuccess}
                    setAmount={setAmount}
                />
                <div
                    style={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        gap: '0.5rem',
                        marginBottom: '0.5rem',
                    }}
                >
                    <div style={{ fontSize: '0.8rem', color: '#168F9C' }}>Available to burn:</div>
                    <div style={{ fontSize: '0.8rem', color: '#168F9C', fontWeight: 'bold' }}>
                        {maxAmount ? formatEther(maxAmount) : '0'} ETH
                    </div>
                </div>
                <button disabled={!isConnected || isLoading || wrongNetwork} type="submit">
                    {isConnected ? (
                        isLoading ? (
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                }}
                            >
                                <LoaderIcon />
                                <span>Waiting for confirmation</span>
                            </div>
                        ) : (
                            'Burn osETH'
                        )
                    ) : (
                        'Connect wallet to burn osETH'
                    )}
                </button>
            </form>
        </div>
    );
};
