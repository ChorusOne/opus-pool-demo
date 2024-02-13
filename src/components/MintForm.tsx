import React, { useEffect } from 'react';
import { formatEther } from 'viem';
import { useNetworkAndVaultContext } from '../context/neworkAndVaultContext';
import { useAccount } from 'wagmi';
import toast, { LoaderIcon } from 'react-hot-toast';
import { OsTokenPositionHealth } from '@chorus-one/opus-pool';
import { AmountInput } from './AmountInput';

export const MintForm = ({
    onSubmit,
    maxAmount,
    setAmount,
    isError,
    isLoading,
    isSuccess,
    healthForVault,
}: {
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
    maxAmount: bigint | undefined;
    setAmount: React.Dispatch<React.SetStateAction<bigint>>;
    isError: boolean;
    isLoading: boolean;
    isSuccess: boolean;
    healthForVault:
        | {
              initialHealth: OsTokenPositionHealth;
              updatedHealth: OsTokenPositionHealth;
          }
        | undefined;
}) => {
    const { wrongNetwork } = useNetworkAndVaultContext();
    const { isConnected } = useAccount();

    useEffect(() => {
        if (isError) {
            toast.error('Something went wrong');
        }
    }, [isError]);

    return (
        <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h2>Mint osETH</h2>
            <h3>Position health:</h3>
            <div
                style={{
                    fontWeight: 'bold',
                    display: 'flex',
                    gap: '20px',
                    border: '1px solid lightGrey',
                    borderRadius: '10px',
                    padding: '10px',
                }}
            >
                <span>{healthForVault ? healthForVault?.initialHealth : '-'}</span>
                <span className="mx-2">&rarr;</span>
                <span>{healthForVault ? healthForVault?.updatedHealth : '-'}</span>
            </div>
            <form
                onSubmit={(e) => {
                    onSubmit(e);
                }}
                style={{ width: '450px', margin: '1rem auto' }}
            >
                <AmountInput
                    isSuccess={isSuccess}
                    disabled={!isConnected || isLoading || wrongNetwork}
                    title={!isConnected ? 'Connect wallet' : 'Enter the amount to stake'}
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
                    <div style={{ fontSize: '0.8rem', color: '#168F9C' }}>Available to mint:</div>
                    <div style={{ fontSize: '0.8rem', color: '#168F9C', fontWeight: 'bold' }}>
                        {maxAmount ? Number(formatEther(maxAmount)).toLocaleString('US-EN') : '0'} ETH
                    </div>
                </div>
                <button
                    disabled={
                        !isConnected ||
                        isLoading ||
                        wrongNetwork ||
                        healthForVault?.initialHealth !== OsTokenPositionHealth.Healthy ||
                        healthForVault?.updatedHealth !== OsTokenPositionHealth.Healthy
                    }
                    type="submit"
                >
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
                            'Mint osETH'
                        )
                    ) : (
                        'Connect wallet to stake'
                    )}
                </button>
            </form>
        </div>
    );
};
