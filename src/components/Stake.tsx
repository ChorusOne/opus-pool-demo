import React from 'react';
import { useAccount, useBalance, useWalletClient } from 'wagmi';
import { FormComponent } from './FormComponent';
import { useStakeMutation } from '../hooks/useStakeMutation';
import { useState } from 'react';
import { parseEther } from 'viem';
import { useNetworkAndVaultContext } from '../context/neworkAndVaultContext';

export const StakeComponent = () => {
    const { address } = useAccount();
    const { data: balance } = useBalance({
        address,
    });
    const [amount, setAmount] = useState<bigint>(parseEther('0'));
    const { networkType, vaultForChain } = useNetworkAndVaultContext();

    const { mutate: stake, isError, isLoading, isSuccess } = useStakeMutation();

    const { data: walletClient } = useWalletClient();

    const handleStake = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!address || !vaultForChain) return;
        stake({
            userAddress: address,
            network: networkType,
            vault: vaultForChain,
            amount,
            walletClient,
        });
        setAmount(parseEther('0'));
    };

    return (
        <>
            <FormComponent
                title="Stake"
                availableLabel="Available to stake"
                onSubmit={(e) => handleStake(e)}
                maxAmount={balance?.value}
                setAmount={setAmount}
                isError={isError}
                isLoading={isLoading}
                isSuccess={isSuccess}
                btnLabel="Stake"
            />
        </>
    );
};
