import React from 'react';
import { useAccount, useWalletClient } from 'wagmi';
import { useState } from 'react';
import { parseEther } from 'viem';
import { useNetworkAndVaultContext } from '../context/neworkAndVaultContext';
import { useVaultDetails } from '../hooks/useVaultDetails';
import { BurnForm } from './BurnForm';
import { useBurnMutation } from '../hooks/useBurnMutation';

export const BurnComponent = () => {
    const { address } = useAccount();
    const [amount, setAmount] = useState<bigint>(parseEther('0'));
    const { networkType, vaultForChain } = useNetworkAndVaultContext();

    const { data: vaultDetails } = useVaultDetails({
        network: networkType,
        vault: vaultForChain,
        address: address,
    });
    const { mutate: burn, isError, isLoading, isSuccess } = useBurnMutation();

    const { data: walletClient } = useWalletClient();

    const handleBurn = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!address || !vaultForChain) return;
        burn({
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
            <BurnForm
                onSubmit={(e) => handleBurn(e)}
                maxAmount={vaultDetails?.minted}
                setAmount={setAmount}
                isError={isError}
                isLoading={isLoading}
                isSuccess={isSuccess}
            />
        </>
    );
};
