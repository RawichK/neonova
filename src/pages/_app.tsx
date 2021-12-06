import { AuditOutlined, CodeOutlined } from '@ant-design/icons';
import { Application } from '@application';
import { WalletModalProvider } from '@rentfuse-labs/neo-wallet-adapter-ant-design';
import { WalletProvider } from '@rentfuse-labs/neo-wallet-adapter-react';
import { getNeoLineWallet, getO3Wallet, getWalletConnectWallet } from '@rentfuse-labs/neo-wallet-adapter-wallets';
import { createRootStore, persist, RootStoreProvider } from '@stores';
import { AppProps } from 'next/app';
import Head from 'next/head';
import React, { useEffect, useMemo } from 'react';
import { LocalWalletProvider } from 'src/wallet';

// Use require instead of import, and order matters
require('@styles/global.css');
require('@rentfuse-labs/neo-wallet-adapter-ant-design/styles.css');

export default function _App({ Component, pageProps }: AppProps) {
	// The pages of the application to handle routing and title displaying
	const pages = useMemo(() => {
		return [
			{ url: '/', title: 'Invocations', icon: <CodeOutlined /> },
			{ url: '/contract', title: 'Contracts', icon: <AuditOutlined /> },
		];
	}, []);

	// The Neo N3 wallets i can connect to
	const wallets = useMemo(() => {
		return [
			getNeoLineWallet(),
			getO3Wallet(),
			getWalletConnectWallet({
				options: {
					chainId: 'neo3:testnet',
					methods: ['invokefunction'],
					appMetadata: {
						name: 'Neonova',
						description: 'Like Postman but for NEO N3.',
						url: 'https://github.com/rentfuse-labs',
						icons: [
							'https://raw.githubusercontent.com/rentfuse-labs/neo-wallet-adapter/main/neo-wallet-adapter_icon.png',
						],
					},
				},
				logger: 'debug',
				relayProvider: 'wss://connect.coz.io',
			}),
		];
	}, []);

	// Create the store in this way to apply persistence
	const store = useMemo(() => {
		return createRootStore();
	}, []);
	// Apply persistence to the store
	useEffect(() => {
		if (typeof window !== 'undefined') {
			persist({
				store,
				onGetData: () => {
					const data = localStorage.getItem('@rentfuse-labs/neonova');
					if (data) {
						// To remove loading indicator if it was present when saved snapshot
						const dataJson = JSON.parse(data);
						return {...dataJson, viewStore: {...dataJson.viewStore, loadingVisible: false}};
					}
					return null;
				},
				onSaveData: (data) => {
					localStorage.setItem('@rentfuse-labs/neonova', JSON.stringify(data));
				},
			});
		}
	}, [store]);

	// Note that we don't recommend ever replacing the value of a Provider with a different one
	// Using MobX, there should be no need for that, since the observable that is shared can be updated itself
	return (
		<RootStoreProvider value={store}>
			<WalletProvider wallets={wallets} autoConnect={false}>
				<WalletModalProvider centered={false}>
					<LocalWalletProvider>
						<Application pages={pages}>
							<Head>
								<link rel="shortcut icon" href="favicon/favicon.ico" />
								<title>Neonova</title>
								<meta name="description" content="Like Postman but for NEO N3." />
							</Head>

							<Component {...pageProps} />
						</Application>
					</LocalWalletProvider>
				</WalletModalProvider>
			</WalletProvider>
		</RootStoreProvider>
	);
}
