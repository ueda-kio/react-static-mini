import React from 'react';

type PageMeta = {
	title?: string,
	url?: string
};

export const Head: React.FC<PageMeta> = ({title = 'title', url}) => {
	return (
		<>
			<meta charSet="utf-8" />
			<meta name="viewport" content="width=device-width, initial-scale=1.0" />
			<meta property="og:title" content="React Static" />
			<meta name="description" content="description text" />
			<link rel="canonical" href={url} />
			<title>{title}</title>
		</>
	);
}