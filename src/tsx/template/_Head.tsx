import React from 'react';

type PageMeta = {
	title?: string,
	url?: string
	description?: string
};

export const Head: React.FC<PageMeta> = ({ title = 'title', url, description }) => {
	return (
		<>
			<meta charSet="utf-8" />
			<meta name="viewport" content="width=device-width, initial-scale=1.0" />
			<meta name="description" content={description} />
			<link rel="canonical" href={url} />
			<title>{title}</title>
		</>
	);
}