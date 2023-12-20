import { useEffect, useState } from 'react';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { useAccount, useNetwork } from 'wagmi';
import { useNetworkAndVaultContext } from '../context/neworkAndVaultContext';
import { Networks } from '@chorus-one/opus-pool';

export const ConnectButton = () => {
    const { open } = useWeb3Modal();
    const { address } = useAccount();
    const { chain } = useNetwork();
    const [networkError, setNetworkError] = useState<string | null>(null);
    const { setWrongNetwork } = useNetworkAndVaultContext();
    useEffect(() => {
        if (!Object.keys(Networks).includes(chain?.name as string)) {
            setWrongNetwork(true);
            setNetworkError(`Please connect to ${Object.keys(Networks).join(', ')}`);
        } else {
            setWrongNetwork(false);
            setNetworkError(null);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chain]);

    return (
        <>
            <div className="button-container">
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: '1rem',
                    }}
                >
                    <button onClick={() => open()}>
                        {address ? address.slice(0, 6) + '...' + address.slice(-4) : 'Connect'}
                    </button>
                    {chain && (
                        <div
                            style={{
                                fontSize: '0.8rem',
                                color: networkError ? '#fc655b' : '#168F9C',
                                maxWidth: '10rem',
                            }}
                        >
                            {networkError ? networkError : `Connected to ${chain.name}`}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};
