import React, { ChangeEvent, useEffect, useState } from 'react';
import { formatEther, parseEther } from 'viem';
import { useNetworkAndVaultContext } from '../context/neworkAndVaultContext';
import { number } from 'yup';
import { useAccount } from 'wagmi';
import toast, { LoaderIcon } from 'react-hot-toast';

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
    const [inputValue, setInputValue] = useState<string>('');
    const { wrongNetwork } = useNetworkAndVaultContext();
    const { isConnected } = useAccount();

    console.log('amount', maxAmount);

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

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        const regex = /^\d*(\.\d{0,18})?$/; // only allow 18 digits after the decimal
        const stringValue = e.target.value.replaceAll('+', '').replaceAll('-', '');
        let isValid = false;
        let validValue: bigint | undefined;
        if (stringValue !== '' && !regex.test(stringValue)) {
            return;
        }
        try {
            if (stringValue === '') {
                validValue = undefined;
            } else {
                number().validateSync(stringValue);
                validValue = parseEther(stringValue);
                setAmount(validValue);
            }
            isValid = true;
        } catch (_error) {
            // Swallow parsing errors, just don't update the value
        }
        if (!isValid) return;
        setInputValue(stringValue);
    };

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
                        onChange={onChange}
                        value={inputValue}
                        disabled={!isConnected || isLoading || wrongNetwork}
                        title={!isConnected ? 'Connect wallet' : 'Enter the amount to stake'}
                    />
                    <span>ETH</span>
                </div>
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
                <button disabled={!isConnected || isLoading || !inputValue || wrongNetwork} type="submit">
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
