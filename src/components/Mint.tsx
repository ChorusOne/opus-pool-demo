import React from 'react';
import { useAccount, useWalletClient } from 'wagmi';
import { FormComponent } from './FormComponent';
import { useStakeMutation } from '../hooks/useStakeMutation';
import { useState } from 'react';
import { parseEther } from 'viem';
import { useNetworkAndVaultContext } from '../context/neworkAndVaultContext';
import { useVaultDetails } from '../hooks/useVaultDetails';

export const MintComponent = () => {
    const { address } = useAccount();
    const [amount, setAmount] = useState<bigint>(parseEther('0'));
    const { networkType, vaultForChain } = useNetworkAndVaultContext();

    const { data: vaultDetails } = useVaultDetails({
        network: networkType,
        vault: vaultForChain,
        address: address,
    });
    const { mutate: mint, isError, isLoading, isSuccess } = useStakeMutation();

    const { data: walletClient } = useWalletClient();

    const handleMint = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!address || !vaultForChain) return;
        mint({
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
                title="Mint"
                availableLabel="Available to mint"
                onSubmit={(e) => handleMint(e)}
                maxAmount={vaultDetails?.maxMint}
                setAmount={setAmount}
                isError={isError}
                isLoading={isLoading}
                isSuccess={isSuccess}
                btnLabel="Mint osETH"
            />
        </>
    );
};
