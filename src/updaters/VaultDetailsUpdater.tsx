import { useEffect } from 'react';
import { useNetwork, useAccount } from 'wagmi';
import { AvailableChains, isValidNetwork } from '../utils/constants';
import { useNetworkAndVaultContext } from '../context/neworkAndVaultContext';
import { Networks, getDefaultVaults } from '@chorus-one/opus-pool';
/**
 * @name ValidNetworkUpdater
 * @description This updater is responsible for updating the vault details for the selected network
 * @returns null
 */
export default function VaultDetailsUpdater() {
    const { networkType, setVaultForChain, setNetworkType } = useNetworkAndVaultContext();
    const { chain } = useNetwork();
    const { address } = useAccount();

    useEffect(() => {
        if (!address) {
            return;
        }

        const defaultVaults = getDefaultVaults(networkType);

        // Check if the current chain is valid and matches the network type
        const isChainMatch = chain?.id && AvailableChains.get(networkType)?.id === chain.id;
        const isChainNameValid = chain?.name && isValidNetwork(chain.name.toLowerCase());

        // Update network type if chain has changed and is valid
        if (!isChainMatch && isChainNameValid) {
            setNetworkType(chain.name.toLowerCase() as Networks);
        }

        // Set vault details if available
        if (defaultVaults) {
            setVaultForChain(defaultVaults[1]);
        }
    }, [chain, address, networkType, setVaultForChain, setNetworkType]);

    return null;
}
