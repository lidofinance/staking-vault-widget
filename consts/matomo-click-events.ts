import { MatomoEventType } from '@lidofinance/analytics-matomo';

export const enum MATOMO_CLICK_EVENTS_TYPES {
  // Global
  walletConnected = 'walletConnected',
  walletAutoConnected = 'walletAutoConnected',
  walletReConnected = 'walletReConnected',
  disconnectWalletManually = 'disconnectWalletManually',
  clickCreateNewVault = 'clickCreateNewVault',
  clickContinueCreatingVault = 'clickContinueCreatingVault',
  initiatingCreatingVault = 'initiatingCreatingVault',
  finalisingCreatingVault = 'finalisingCreatingVault',
  clickPaginationButtonMyVaults = 'clickPaginationButtonMyVaults',
  clickPaginationButtonAllVaults = 'clickPaginationButtonAllVaults',

  // Overview
  clickOverviewTotalValuePopup = 'clickOverviewTotalValuePopup',
  clickOverviewNetStakingAPRPopup = 'clickOverviewNetStakingAPRPopup',
  clickOverviewHealthFactorPopup = 'clickOverviewHealthFactorPopup',
  clickOverviewStETHLiabilityPopup = 'clickOverviewStETHLiabilityPopup',
  clickOverviewUnstakedBalancePopup = 'clickOverviewUnstakedBalancePopup',
  clickOverviewWithdrawableETHPopup = 'clickOverviewWithdrawableETHPopup',
  clickOverviewNOFeePopup = 'clickOverviewNOFeePopup',
  clickOverviewLidoFeesPopup = 'clickOverviewLidoFeesPopup',

  // Settings
  clickSettingsMainSettingsTab = 'clickSettingsMainSettingsTab',
  clickSettingsSubmitMainSettingsTab = 'clickSettingsSubmitMainSettingsTab',
  clickSettingsPermissionsTab = 'clickSettingsPermissionsTab',
  clickSettingsSubmitPermissionsTab = 'clickSettingsSubmitPermissionsTab',
  clickSettingsTierTab = 'clickSettingsTierTab',
  clickSettingsSubmitTierTab = 'clickSettingsSubmitTierTab',

  // Navigation
  clickNaviMyVaults = 'clickNaviMyVaults',
  clickNaviAllVaults = 'clickNaviAllVaults',
  clickNaviOverview = 'clickNaviOverview',
  clickNaviSupplyWithdraw = 'clickNaviSupplyWithdraw',
  clickNaviMintRepayStETH = 'clickNaviMintRepayStETH',
  clickNaviValidators = 'clickNaviValidators',
  clickNaviNOFee = 'clickNaviNOFee',
  clickNaviRebalance = 'clickNaviRebalance',
  clickNaviSettings = 'clickNaviSettings',
}

export const MATOMO_CLICK_EVENTS: Record<
  MATOMO_CLICK_EVENTS_TYPES,
  MatomoEventType
> = {
  [MATOMO_CLICK_EVENTS_TYPES.walletConnected]: [
    'stVaults_Widget',
    'Wallet is connected',
    'stvaults_widget_wallet_connected',
  ],
  [MATOMO_CLICK_EVENTS_TYPES.walletAutoConnected]: [
    'stVaults_Widget',
    'Wallet is auto-connected',
    'stvaults_widget_wallet_autoconnected',
  ],
  [MATOMO_CLICK_EVENTS_TYPES.walletReConnected]: [
    'stVaults_Widget',
    'Wallet is re-connected',
    'stvaults_widget_wallet_reconnected',
  ],
  [MATOMO_CLICK_EVENTS_TYPES.disconnectWalletManually]: [
    'stVaults_Widget',
    'Disconnect wallet manually',
    'stvaults_widget_disconnect_wallet',
  ],
  [MATOMO_CLICK_EVENTS_TYPES.clickCreateNewVault]: [
    'stVaults_Widget',
    'Push "Create New Vault"',
    'stvaults_widget_create_new_vault',
  ],
  [MATOMO_CLICK_EVENTS_TYPES.clickContinueCreatingVault]: [
    'stVaults_Widget',
    'Push "Continue" on creating vault',
    'stvaults_widget_continue_creating_vault',
  ],
  [MATOMO_CLICK_EVENTS_TYPES.initiatingCreatingVault]: [
    'stVaults_Widget',
    'Initiating creating vault with "Create and supply 1 ETH" button',
    'stvaults_widget_initiating_creating_vault',
  ],
  [MATOMO_CLICK_EVENTS_TYPES.finalisingCreatingVault]: [
    'stVaults_Widget',
    'Finalising creating vault with "Create and supply 1 ETH" button',
    'stvaults_widget_finalising_creating_vault',
  ],

  // Vaults table
  [MATOMO_CLICK_EVENTS_TYPES.clickPaginationButtonMyVaults]: [
    'stVaults_Widget',
    'Push any pagination button on My vaults',
    'stvaults_widget_pagination_buttons_my vaults',
  ],
  [MATOMO_CLICK_EVENTS_TYPES.clickPaginationButtonAllVaults]: [
    'stVaults_Widget',
    'Push any pagination button on All vaults',
    'stvaults_widget_pagination_buttons_all_vaults',
  ],

  // Overview
  [MATOMO_CLICK_EVENTS_TYPES.clickOverviewTotalValuePopup]: [
    'stVaults_Widget_Overview',
    'Push "TotalValue popup"',
    'stvaults_widget_overview_totalvalue_popup',
  ],
  [MATOMO_CLICK_EVENTS_TYPES.clickOverviewNetStakingAPRPopup]: [
    'stVaults_Widget_Overview',
    'Push "Net Staking APR" popup',
    'stvaults_widget_overview_net_staking_apr_popup',
  ],
  [MATOMO_CLICK_EVENTS_TYPES.clickOverviewHealthFactorPopup]: [
    'stVaults_Widget_Overview',
    'Push" Health Factor" popup',
    'stvaults_widget_overview_health_factor_popup',
  ],
  [MATOMO_CLICK_EVENTS_TYPES.clickOverviewStETHLiabilityPopup]: [
    'stVaults_Widget_Overview',
    'Push "stETH Liability" popup',
    'stvaults_widget_overview_steth_liability_popup',
  ],
  [MATOMO_CLICK_EVENTS_TYPES.clickOverviewUnstakedBalancePopup]: [
    'stVaults_Widget_Overview',
    'Push "Unstaked Balance" popup',
    'stvaults_widget_overview_unstaked_balance_popup',
  ],
  [MATOMO_CLICK_EVENTS_TYPES.clickOverviewWithdrawableETHPopup]: [
    'stVaults_Widget_Overview',
    'Push "Withdrawable ETH" popup',
    'stvaults_widget_overview_withdrawable_eth_popup',
  ],
  [MATOMO_CLICK_EVENTS_TYPES.clickOverviewNOFeePopup]: [
    'stVaults_Widget_Overview',
    'Push "NO fee" popup',
    'stvaults_widget_overview_no_fee_popup',
  ],
  [MATOMO_CLICK_EVENTS_TYPES.clickOverviewLidoFeesPopup]: [
    'stVaults_Widget_Overview',
    'Push "Lido fees" popup',
    'stvaults_widget_overview_lido_fees_popup',
  ],

  // Settings
  [MATOMO_CLICK_EVENTS_TYPES.clickSettingsMainSettingsTab]: [
    'stVaults_Widget_Settings',
    'Push "Main Settings" tab',
    'stvaults_widget_settings_main_settings_tab',
  ],
  [MATOMO_CLICK_EVENTS_TYPES.clickSettingsSubmitMainSettingsTab]: [
    'stVaults_Widget_Settings',
    'Push "Submit" in main settings tab',
    'stvaults_widget_settings_submit_main_settings_tab',
  ],
  [MATOMO_CLICK_EVENTS_TYPES.clickSettingsPermissionsTab]: [
    'stVaults_Widget_Settings',
    'Push "Permissions" tab',
    'stvaults_widget_settings_permissions_tab',
  ],
  [MATOMO_CLICK_EVENTS_TYPES.clickSettingsSubmitPermissionsTab]: [
    'stVaults_Widget_Settings',
    'Push "Submit" in permissions tab',
    'stvaults_widget_settings_submit_permissions_tab',
  ],
  [MATOMO_CLICK_EVENTS_TYPES.clickSettingsTierTab]: [
    'stVaults_Widget_Settings',
    'Push "Tier" tab',
    'stvaults_widget_settings_tier_tab',
  ],
  [MATOMO_CLICK_EVENTS_TYPES.clickSettingsSubmitTierTab]: [
    'stVaults_Widget_Settings',
    'Push "Submit" in tier tab',
    'stvaults_widget_settings_submit_tier_tab',
  ],

  // Navigation
  [MATOMO_CLICK_EVENTS_TYPES.clickNaviMyVaults]: [
    'stVaults_Widget_Navi',
    'Push "My Vaults"',
    'stvaults_widget_navi_my_vaults',
  ],
  [MATOMO_CLICK_EVENTS_TYPES.clickNaviAllVaults]: [
    'stVaults_Widget_Navi',
    'Push "All Vaults"',
    'stvaults_widget_navi_all_vaults',
  ],
  [MATOMO_CLICK_EVENTS_TYPES.clickNaviOverview]: [
    'stVaults_Widget_Navi',
    'Push "Overview"',
    'stvaults_widget_navi_overview',
  ],
  [MATOMO_CLICK_EVENTS_TYPES.clickNaviSupplyWithdraw]: [
    'stVaults_Widget_Navi',
    'Push "Supply/Withdraw"',
    'stvaults_widget_navi_supply_withdraw',
  ],
  [MATOMO_CLICK_EVENTS_TYPES.clickNaviMintRepayStETH]: [
    'stVaults_Widget_Navi',
    'Push "Mint/Repay stETH"',
    'stvaults_widget_navi_mint_repay_steth',
  ],
  [MATOMO_CLICK_EVENTS_TYPES.clickNaviValidators]: [
    'stVaults_Widget_Navi',
    'Push "Validators"',
    'stvaults_widget_navi_validators',
  ],
  [MATOMO_CLICK_EVENTS_TYPES.clickNaviNOFee]: [
    'stVaults_Widget_Navi',
    'Push "NO fee"',
    'stvaults_widget_navi_no_fee',
  ],
  [MATOMO_CLICK_EVENTS_TYPES.clickNaviRebalance]: [
    'stVaults_Widget_Navi',
    'Push "Rebalance"',
    'stvaults_widget_navi_rebalance',
  ],
  [MATOMO_CLICK_EVENTS_TYPES.clickNaviSettings]: [
    'stVaults_Widget_Navi',
    'Push "Settings"',
    'stvaults_widget_navi_settings',
  ],
};
