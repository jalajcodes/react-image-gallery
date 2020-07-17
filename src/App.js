/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import Loader from './Loader';
import './App.css';

export default function App() {
	const [images, setImages] = useState([]);
	const [page, setPage] = useState(1);
	const [query, setQuery] = useState('');

	async function fetchPhotos() {
		let api_url = `https://api.unsplash.com/photos?`;

		// if user has typed something then use this
		if (query) api_url = `https://api.unsplash.com/search/photos?query=${query}`;

		// necessary params for api
		api_url += `&page=${page}`;
		api_url += `&client_id=${process.env.REACT_APP_UNSPLASH_ACCESS_KEY}`;

		// fetching data
		let response = await fetch(api_url);
		let data = await response.json();

		const imagesFromApi = data.results ?? data;

		// if page === 1 then we need a whole new array of images
		if (page === 1) setImages(imagesFromApi);
		// if page > 1 then we are adding for infinite scroll
		setImages((prev) => [...prev, ...imagesFromApi]);
	}

	function searchPhotos(e) {
		e.preventDefault();
		setPage(1);
		fetchPhotos();
	}

	useEffect(() => {
		fetchPhotos();
	}, [page]);

	return (
		<div className="app">
			<h1>Infinite Image Gallery!</h1>

			<form onSubmit={searchPhotos}>
				<input
					type="text"
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					placeholder="Try searching for cats 😸 or dogs 🐶..."
				/>
				<button>Search</button>
			</form>
			<InfiniteScroll
				dataLength={images.length}
				next={() => setPage((page) => page + 1)}
				hasMore={true}
				loader={<Loader />}
			>
				<div className="image-grid">
					{images.map((image, index) => (
						<a
							href={image.links.html}
							target="_blank"
							rel="noopener noreferrer"
							className="image"
							key={index}
							title={`${image.alt_description} \nBy @${image.user.username}`}
						>
							<img src={image.urls.regular} alt={image.alt_description} />
						</a>
					))}
				</div>
			</InfiniteScroll>
		</div>
	);
}
