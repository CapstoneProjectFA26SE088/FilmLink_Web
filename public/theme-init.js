try {
	if (localStorage.getItem("filmlink-theme") === "dark") {
		document.documentElement.classList.add("dark");
	}
} catch {
	// Keep the default light theme when storage is unavailable.
}
