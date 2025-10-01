// app/pokemon/[id]/page.tsx

interface PokemonPageProps {
	params: {
		id: string; // Die ID oder der Name des Pokémons aus der URL
	};
}

// Funktion zum Abrufen der Pokémon-Daten von der PokeAPI
async function getPokemonData(id: string) {
	// Die PokeAPI-URL für ein einzelnes Pokémon
	const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);

	if (!res.ok) {
		// Hier kannst du eine benutzerdefinierte Fehlerseite anzeigen (z.B. durch eine error.tsx im selben Segment)
		throw new Error("Fehler beim Abrufen der Pokémon-Daten");
	}

	// Die Daten als JSON zurückgeben
	return res.json();
}

// Next.js Server Component
export default async function PokemonPage({ params }: PokemonPageProps) {
	const pokemonId = params.id.toLowerCase(); // Wichtig: PokeAPI verwendet Kleinbuchstaben

	let pokemonData;
	try {
		pokemonData = await getPokemonData(pokemonId);
	} catch (error) {
		// Behandlung des Fehlerfalls
		return (
			<div style={{ padding: "20px", textAlign: "center" }}>
				<h1>Pokémon nicht gefunden!</h1>
				<p>Die ID oder der Name "{pokemonId}" ist ungültig.</p>
			</div>
		);
	}

	// Extrahiere einige wichtige Informationen zur Anzeige
	const name =
		pokemonData.name.charAt(0).toUpperCase() + pokemonData.name.slice(1); // Erster Buchstabe groß
	const imageSrc = pokemonData.sprites.front_default; // Standard-Front-Sprite
	const types = pokemonData.types
		.map(
			(t: any) =>
				t.type.name.charAt(0).toUpperCase() + t.type.name.slice(1)
		)
		.join(", ");
	const height = pokemonData.height / 10; // Dezimeter in Meter
	const weight = pokemonData.weight / 10; // Hektogramm in Kilogramm

	return (
		<div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
			<h1>
				{name} (#{pokemonData.id})
			</h1>

			<div
				style={{
					display: "flex",
					gap: "20px",
					alignItems: "center",
					border: "1px solid #ccc",
					padding: "15px",
					borderRadius: "8px",
				}}
			>
				{imageSrc && (
					// Verwenden des Next.js Image-Komponenten für Optimierung
					// Da dieses Beispiel nur ein Snippet ist, verwenden wir ein einfaches <img>-Tag
					<img
						src={imageSrc}
						alt={name}
						width={150}
						height={150}
						style={{ imageRendering: "pixelated" }}
					/>
				)}

				<div>
					<p>
						<strong>Typen:</strong> {types}
					</p>
					<p>
						<strong>Größe:</strong> {height} m
					</p>
					<p>
						<strong>Gewicht:</strong> {weight} kg
					</p>
					{/* Zeige die Basis-Status an */}
					<h2>Basis-Status</h2>
					<ul>
						{pokemonData.stats.map((stat: any) => (
							<li key={stat.stat.name}>
								<strong>{stat.stat.name.toUpperCase()}:</strong>{" "}
								{stat.base_stat}
							</li>
						))}
					</ul>
				</div>
			</div>
		</div>
	);
}
