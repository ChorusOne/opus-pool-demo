// import { useAccount } from 'wagmi';
import { useState } from 'react';
import { FormComponent } from './FormComponent';
import { formatEther, parseEther } from 'viem/utils';
import { useNetworkAndVaultContext } from '../context/neworkAndVaultContext';
import { useAccount, useWalletClient } from 'wagmi';
import { useVaultDetails } from '../hooks/useVaultDetails';
import { useUnstakeMutation } from '../hooks/useUnstakeMutation';

export const UnstakeComponent = () => {
    const [amount, setAmount] = useState<bigint>(parseEther('0'));
    const { address } = useAccount();
    const { selectedVaultDetails, networkType } = useNetworkAndVaultContext();
    const { data: vaultData } = useVaultDetails({
        address,
        vault: selectedVaultDetails,
        network: networkType,
    });

    const { mutate: unstake, isError, isLoading, isSuccess } = useUnstakeMutation();
    const { data: walletClient } = useWalletClient();

    const handleUnstake = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!address || !selectedVaultDetails || vaultData?.length === 0) return;
        unstake({
            userAddress: address,
            network: networkType,
            vault: selectedVaultDetails,
            amount,
            walletClient,
        });
        setAmount(parseEther('0'));
    };

    return (
        <FormComponent
            title="Unstake"
            availableLabel="Available to unstake"
            onSubmit={handleUnstake}
            balance={vaultData ? formatEther(vaultData[0].balance, 'wei') : '0'}
            setAmount={setAmount}
            isError={isError}
            isLoading={isLoading}
            isSuccess={isSuccess}
            btnLabel="Unstake"
        />
    );
};
