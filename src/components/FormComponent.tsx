import React, { useEffect } from 'react';
import { formatEther } from 'viem';
import { useNetworkAndVaultContext } from '../context/neworkAndVaultContext';
import { useAccount } from 'wagmi';
import toast, { LoaderIcon } from 'react-hot-toast';
import { AmountInput } from './AmountInput';

export const FormComponent = ({
    title,
    availableLabel,
    onSubmit,
    maxAmount,
    setAmount,
    isError,
    isLoading,
    isSuccess,
    btnLabel,
}: {
    title: string;
    availableLabel: string;
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
    maxAmount: bigint | undefined;
    setAmount: React.Dispatch<React.SetStateAction<bigint>>;
    isError: boolean;
    isLoading: boolean;
    isSuccess: boolean;
    btnLabel: string;
}) => {
    const { wrongNetwork } = useNetworkAndVaultContext();
    const { isConnected } = useAccount();

    useEffect(() => {
        if (isError) {
            toast.error('Something went wrong');
        }
    }, [isError]);

    return (
        <div style={{ padding: '1rem', border: '1px' }}>
            <h2>{title}</h2>
            <form
                onSubmit={(e) => {
                    onSubmit(e);
                }}
                style={{ width: '450px', margin: '1rem auto' }}
            >
                <AmountInput
                    setAmount={setAmount}
                    isSuccess={isSuccess}
                    disabled={!isConnected || isLoading || wrongNetwork}
                    title={!isConnected ? 'Connect wallet' : 'Enter the amount to stake'}
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
                    <div style={{ fontSize: '0.8rem', color: '#168F9C' }}>{availableLabel}:</div>
                    <div style={{ fontSize: '0.8rem', color: '#168F9C', fontWeight: 'bold' }}>
                        {maxAmount ? Number(formatEther(maxAmount)).toLocaleString('US-EN') : '0'} ETH
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
                            btnLabel
                        )
                    ) : (
                        'Connect wallet to stake'
                    )}
                </button>
            </form>
        </div>
    );
};
