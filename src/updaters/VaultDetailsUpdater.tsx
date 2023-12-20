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
    const { networkType, setAllVaultsForChain, setNetworkType, setSelectedVaultDetails } = useNetworkAndVaultContext();
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
            setAllVaultsForChain(defaultVaults);
            setSelectedVaultDetails(defaultVaults[0]);
        }
    }, [chain, address, networkType, setAllVaultsForChain, setSelectedVaultDetails, setNetworkType]);

    return null;
}
