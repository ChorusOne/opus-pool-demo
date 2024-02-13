import { Networks } from '@chorus-one/opus-pool';
import React, { createContext, useContext } from 'react';
import { Hex } from 'viem';

type networkContextType = {
    networkType: Networks;
    setNetworkType: (value: Networks) => void;
    wrongNetwork: boolean;
    setWrongNetwork: (value: boolean) => void;
    vaultForChain: Hex | undefined;
    setVaultForChain: (value: Hex | undefined) => void;
};

type Props = {
    children: React.ReactNode;
};

const networkContexDefault: networkContextType = {
    networkType: Networks.Holesky,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    setNetworkType: () => {},
    wrongNetwork: false,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    setWrongNetwork: () => {},
    vaultForChain: undefined,
    setVaultForChain: () => [],
};

const NetworkContext = createContext<networkContextType>(networkContexDefault);

const useNetworkAndVaultContext = () => {
    return useContext(NetworkContext);
};

function NetworkProvider({ children }: Props) {
    const [networkType, setNetworkType] = React.useState<Networks>(Networks.Holesky);
    const [wrongNetwork, setWrongNetwork] = React.useState<boolean>(false);
    const [vaultForChain, setVaultForChain] = React.useState<Hex | undefined>(undefined);

    const value = {
        networkType,
        setNetworkType,
        wrongNetwork,
        setWrongNetwork,
        vaultForChain,
        setVaultForChain,
    };

    return <NetworkContext.Provider value={value}>{children}</NetworkContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export { useNetworkAndVaultContext, NetworkProvider, NetworkContext };
