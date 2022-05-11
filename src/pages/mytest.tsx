import Head from 'next/head';
import React from 'react';
import { ApplicationPage } from '@application';
import { Button } from 'antd';
import { useWallet } from '@rentfuse-labs/neo-wallet-adapter-react';

export default function MyTestPage() {
	const { address, connected, invoke, invokeMulti } = useWallet();

	const Click = async () => {
		console.log(address);
		console.log(connected);
	};

	return (
		<>
			<Head>
				<title>Neonova | MyTest</title>
			</Head>

			<ApplicationPage>
				<div>
					<Button type="primary" onClick={Click}>
						Click Me
					</Button>
				</div>
			</ApplicationPage>
		</>
	);
}
