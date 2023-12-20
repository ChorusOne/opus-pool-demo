import { Networks } from '@chorus-one/opus-pool';
import { Chain, holesky, mainnet } from 'viem/chains';

export const AvailableChains: Map<Networks, Chain> = new Map([
    [Networks.Ethereum, mainnet as Chain],
    [Networks.Holesky, holesky as Chain],
]);

export const isValidNetwork = (network: string): network is Networks => {
    return Object.values(Networks).includes(network as Networks);
};

export const explorerUrlsMap: Map<Networks, string> = new Map([
    [Networks.Ethereum, 'https://etherscan.io/tx/'],
    [Networks.Holesky, 'https://holesky.etherscan.io/tx/'],
]);
