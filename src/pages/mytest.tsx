import Head from 'next/head';
import React from 'react';
import { ApplicationPage } from '@application';
import { Button } from 'antd';

export default function MyTestPage() {
	const Click = () => {
		alert('Clicked');
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
