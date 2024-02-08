import { useState } from 'react';
import { StakeComponent } from './Stake';
import { RewardsComponent } from './Rewards';
import { TransactionsComponent } from './Transactions';
import { UnstakeComponent } from './Unstake';
import { VaultDetailsComponent } from './Vault';
import { MintComponent } from './Mint';

enum TabsEnum {
    Transactions = 'Transactions',
    Stake = 'Stake',
    Unstake = 'Unstake',
    Rewards = 'Rewards',
    Mint = 'Mint',
    Burn = 'Burn',
}

export const Tabs = () => {
    const [activeTab, setActiveTab] = useState<TabsEnum>(TabsEnum.Stake);
    return (
        <div className="tabs">
            <div className="tab-headers">
                <div
                    className={`tab-header ${activeTab === TabsEnum.Stake ? 'active' : ''}`}
                    onClick={() => setActiveTab(TabsEnum.Stake)}
                >
                    Stake
                </div>
                <div
                    className={`tab-header ${activeTab === TabsEnum.Mint ? 'active' : ''}`}
                    onClick={() => setActiveTab(TabsEnum.Mint)}
                >
                    Mint
                </div>
                <div
                    className={`tab-header ${activeTab === TabsEnum.Unstake ? 'active' : ''}`}
                    onClick={() => setActiveTab(TabsEnum.Unstake)}
                >
                    Unstake
                </div>
                <div
                    className={`tab-header ${activeTab === TabsEnum.Rewards ? 'active' : ''}`}
                    onClick={() => setActiveTab(TabsEnum.Rewards)}
                >
                    Rewards
                </div>
                <div
                    className={`tab-header ${activeTab === TabsEnum.Transactions ? 'active' : ''}`}
                    onClick={() => setActiveTab(TabsEnum.Transactions)}
                >
                    Transactions
                </div>
            </div>
            <div className="tab-content">
                {activeTab === TabsEnum.Stake && (
                    <>
                        <VaultDetailsComponent />
                        <StakeComponent />
                    </>
                )}
                {activeTab === TabsEnum.Rewards && <RewardsComponent />}
                {activeTab === TabsEnum.Transactions && <TransactionsComponent />}
                {activeTab === TabsEnum.Unstake && (
                    <>
                        <VaultDetailsComponent />
                        <UnstakeComponent />
                    </>
                )}
                {activeTab === TabsEnum.Mint && (
                    <>
                        <VaultDetailsComponent />
                        <MintComponent />
                    </>
                )}
            </div>
        </div>
    );
};
