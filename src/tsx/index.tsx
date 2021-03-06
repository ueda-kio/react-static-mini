import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Head } from './template/_Head';
import Test from './components/_Test';
import { Child } from './components/_Child';

const pageMeta = {
	name: 'home',
	title: 'React Static - index',
	description: 'index page',
	url: 'https://example.com/'
};

const Content: React.FC = () => {
	const test = [{ title: 'title01', text: 'text text02' }, { title: 'title02', text: 'text text02' }];

	return (
		<>
			<main>
				<h1>{pageMeta.description}</h1>
				<span className='test'>hoge</span>
				<ul className="list">
					{test.map((data) => (
						<li className="list__item">
							<Test title={data.title} text={data.text} />
						</li>
					))}
				</ul>
				<Child text='dummy text'>
					<div className="child">children</div>
				</Child>
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