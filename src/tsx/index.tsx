import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Head } from './template/_Head';

const pageMeta = {
	name: 'home',
	title: 'React Static',
	description: 'React Staticのトップページです',
	ogpImage: 'assets/img/ogp.jpg',
	type: 'website',
	url: 'https://example.com/'
};

const Content: React.FC = () => {
	return (
		<>
			<main>
				<h1>トップページのコンテンツ</h1>
				<div id="app"></div>
				<span className='test'>hogehoge</span>
			</main>
		</>
	)
};

export default () => `
<!DOCTYPE html>
<html lang="ja">
<head>
${renderToStaticMarkup(<Head title={pageMeta.title} />)}
</head>
<body>
${renderToStaticMarkup(<Content />)}
</body>
</html>
`;