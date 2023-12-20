import React, { useEffect, useState } from 'react';
import { formatUnits, parseEther } from 'viem';
import { useNetworkAndVaultContext } from '../context/neworkAndVaultContext';
import { ValidationError, number } from 'yup';
import { useAccount } from 'wagmi';
import toast, { LoaderIcon } from 'react-hot-toast';

export const FormComponent = ({
    title,
    availableLabel,
    onSubmit,
    balance,
    setAmount,
    isError,
    isLoading,
    isSuccess,
    btnLabel,
}: {
    title: string;
    availableLabel: string;
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
    balance: string | undefined;
    setAmount: React.Dispatch<React.SetStateAction<bigint>>;
    isError: boolean;
    isLoading: boolean;
    isSuccess: boolean;
    btnLabel: string;
}) => {
    const [error, setError] = useState<string | null>(null);
    const [inputValue, setInputValue] = useState<string>('');
    const { wrongNetwork } = useNetworkAndVaultContext();
    const { isConnected } = useAccount();

    const numberSchema = number()
        .required()
        .positive('Amount must be greater than 0')
        .min(parseFloat(formatUnits(1n, 9)), 'Amount must be greater than 1 Gwei')
        .max(parseFloat(balance || '0'), `Amount must be less than ${balance} ETH`)
        .transform((value) => (isNaN(value) || value === null || value === undefined ? 0 : value));

    useEffect(() => {
        if (isError) {
            toast.error('Something went wrong');
        }
    }, [isError]);
    useEffect(() => {
        if (isSuccess) {
            setInputValue('');
        }
    }, [isSuccess]);
    return (
        <div style={{ padding: '1rem', border: '1px' }}>
            <h2>{title}</h2>
            <form
                onSubmit={(e) => {
                    onSubmit(e);
                }}
                style={{ width: '450px', margin: '1rem auto' }}
            >
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        border: '1px solid #168F9C',
                        borderRadius: '0.5rem',
                        padding: '0.5rem',
                    }}
                >
                    <input
                        style={{
                            border: 'none',
                            width: '100%',
                            outline: 'none',
                        }}
                        type="text"
                        placeholder="ETH amount"
                        onChange={(e) => {
                            const value = e.target.value;
                            setInputValue(value);
                            try {
                                numberSchema.validateSync(value);
                                setError(null);
                                if (value) {
                                    const amount = parseEther(value);
                                    setAmount(amount);
                                }
                            } catch (error) {
                                if (error instanceof ValidationError) {
                                    setError(error.message);
                                }
                            }
                        }}
                        value={inputValue}
                        disabled={!isConnected || isLoading || wrongNetwork}
                        title={!isConnected ? 'Connect wallet' : 'Enter the amount to stake'}
                    />
                    <span>ETH</span>
                </div>
                {error ? (
                    <div
                        className="error"
                        style={{
                            display: 'flex',
                            justifyContent: 'flex-start',
                        }}
                    >
                        {error}
                    </div>
                ) : null}
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
                    <div style={{ fontSize: '0.8rem', color: '#168F9C' }}>{balance ? balance : '0'} ETH</div>
                </div>
                <button disabled={!isConnected || isLoading || !!error || !inputValue || wrongNetwork} type="submit">
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
