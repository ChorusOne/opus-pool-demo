import React from 'react';
import { useAccount, useWalletClient } from 'wagmi';
import { useState } from 'react';
import { parseEther } from 'viem';
import { useNetworkAndVaultContext } from '../context/neworkAndVaultContext';
import { useVaultDetails } from '../hooks/useVaultDetails';
import { useHealthQuery } from '../hooks/useHealthQuery';
import { MintForm } from './MintForm';
import { useMintMutation } from '../hooks/useMintMutation';

export const MintComponent = () => {
    const { address } = useAccount();
    const [amount, setAmount] = useState<bigint>(parseEther('0'));
    const { networkType, vaultForChain } = useNetworkAndVaultContext();

    const { data: vaultDetails } = useVaultDetails({
        network: networkType,
        vault: vaultForChain,
        address: address,
    });
    const { mutate: mint, isError, isLoading, isSuccess } = useMintMutation();

    const { data: walletClient } = useWalletClient();

    const { data: healthForVault } = useHealthQuery({
        userAddress: address,
        vaultAddress: vaultForChain,
        amountToMint: amount,
        network: networkType,
        vaultData: vaultDetails,
    });

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
            <MintForm
                onSubmit={(e) => handleMint(e)}
                maxAmount={vaultDetails?.maxMint}
                setAmount={setAmount}
                isError={isError}
                isLoading={isLoading}
                isSuccess={isSuccess}
                healthForVault={healthForVault}
            />
        </>
    );
};
