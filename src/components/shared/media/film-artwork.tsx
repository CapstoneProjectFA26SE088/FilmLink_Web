export function FilmArtwork() {
	return (
		<div className="film-art" aria-hidden="true">
			<div className="film-art__orbit film-art__orbit--one" />
			<div className="film-art__orbit film-art__orbit--two" />
			<div className="film-art__reel">
				<span />
				<span />
				<span />
				<span />
				<i />
			</div>
			<div className="film-art__frame">
				<div className="film-art__sun" />
				<div className="film-art__mountain film-art__mountain--back" />
				<div className="film-art__mountain film-art__mountain--front" />
			</div>
			<div className="film-art__caption">36 frames, vô vàn câu chuyện</div>
		</div>
	);
}
