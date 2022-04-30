import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Head } from './template/_Head';

const pageMeta = {
	name: 'home',
	title: 'React Static - about',
	description: 'about page',
	url: 'https://example.com/'
};

const Content: React.FC = () => {
	return (
		<>
			<main>
				<h1>{pageMeta.description}</h1>
				<span className='test'>hoge</span>
			</main>
		</>
	)
};

export default () => `
<!DOCTYPE html>
<html lang="ja">
<head>
${renderToStaticMarkup(<Head url={pageMeta.url} title={pageMeta.title} description={pageMeta.description} />)}
</head>
<body>
${renderToStaticMarkup(<Content />)}
</body>
</html>
`;