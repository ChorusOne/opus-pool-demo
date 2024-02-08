import toast, { Toast } from 'react-hot-toast';
import { explorerUrlsMap } from '../utils/constants';
import { useNetworkAndVaultContext } from '../context/neworkAndVaultContext';
import { TransactionType } from '../utils/types';

export const SuccessToast = ({ type, hash, t }: { type: TransactionType; hash: string; t: Toast }) => {
    const { networkType } = useNetworkAndVaultContext();
    const txLink = explorerUrlsMap.get(networkType);
    return (
        <div className="success-toast">
            <div className="toast-content">
                <div>{type} transaction sent 🎉</div>
                <div>
                    {txLink ? (
                        <a href={txLink + hash} target="_blank" rel="noreferrer">
                            View on Etherscan
                        </a>
                    ) : (
                        <span>Tx: {hash}</span>
                    )}
                </div>
            </div>
            <button
                aria-hidden={!t.visible}
                type="button"
                onClick={() => {
                    toast.dismiss(t.id);
                }}
                title={'close'}
            >
                x
            </button>
        </div>
    );
};

export const showSuccessToast = (data: string, txType: TransactionType) => {
    toast.success(
        (t) => {
            return <SuccessToast hash={data} t={t} type={txType} />;
        },
        {
            duration: 10_000,
            position: 'bottom-right',
        },
    );
};
