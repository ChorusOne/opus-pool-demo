import { ChangeEvent, useEffect, useState } from 'react';
import { parseEther } from 'viem';
import { number } from 'yup';

export const AmountInput = ({
    setAmount,
    isSuccess,
    disabled,
    title,
}: {
    setAmount: React.Dispatch<React.SetStateAction<bigint>>;
    isSuccess: boolean;
    disabled: boolean;
    title: string;
}) => {
    const [inputValue, setInputValue] = useState<string>('');
    useEffect(() => {
        if (isSuccess) {
            setInputValue('');
        }
    }, [isSuccess]);

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        const regex = /^\d*(\.\d{0,18})?$/; // only allow 18 digits after the decimal
        const stringValue = e.target.value.replaceAll('+', '').replaceAll('-', '');
        let isValid = false;
        let validValue: bigint | undefined;
        if (stringValue !== '' && !regex.test(stringValue)) {
            return;
        }
        try {
            if (stringValue === '') {
                validValue = undefined;
            } else {
                number().validateSync(stringValue);
                validValue = parseEther(stringValue);
                setAmount(validValue);
            }
            isValid = true;
        } catch (_error) {
            // Swallow parsing errors, just don't update the value
        }
        if (!isValid) return;
        setInputValue(stringValue);
    };
    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                border: '1px solid #168F9C',
                borderRadius: '0.5rem',
                padding: '0.5rem',
            }}
        >
            <input
                style={{
                    border: 'none',
                    width: '100%',
                    outline: 'none',
                }}
                type="text"
                placeholder="ETH amount"
                onChange={onChange}
                value={inputValue}
                disabled={disabled}
                title={title}
            />
            <span>ETH</span>
        </div>
    );
};
