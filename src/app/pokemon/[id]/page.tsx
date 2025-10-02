// app/pokemon/[id]/page.tsx

// ... (getPokemonData Funktion bleibt gleich)
async function getPokemonData(id: string) {
	const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);

	if (!res.ok) {
		throw new Error("Das Pokémon wurde nicht gefunden.");
	}

	return res.json();
}

// Die Hauptkomponente mit der Korrektur
export default async function PokemonPage({
	params,
}: {
	params: { id: string };
}) {
	// 💥 KORREKTUR: Awaiten Sie das gesamte params-Objekt
	// Obwohl es in den meisten Fällen sofort aufgelöst wird, ist es die korrekte Vorgehensweise in Next.js,
	// um diesen "sync-dynamic-apis"-Fehler zu vermeiden.
	const awaitedParams = await params;

	// Jetzt greifen wir auf die ID über das awaitedParams-Objekt zu
	const pokemonIdentifier = awaitedParams.id.toLowerCase();

	let pokemonData;
	// ... (Der Rest deines Codes bleibt gleich)

	try {
		pokemonData = await getPokemonData(pokemonIdentifier);
	} catch (error) {
		return (
			<div style={{ padding: "20px", textAlign: "center" }}>
				<h1>Pokémon nicht gefunden 😢</h1>
				<p>
					Konnte kein Pokémon mit der ID/dem Namen **"
					{awaitedParams.id}"** laden. Überprüfe die Eingabe!
				</p>
			</div>
		);
	}

	// ... (Restliche Datenextraktion und Darstellung)
	const name =
		pokemonData.name.charAt(0).toUpperCase() + pokemonData.name.slice(1);
	const imageSrc =
		pokemonData.sprites.other["official-artwork"].front_default ||
		pokemonData.sprites.front_default;
	const types = pokemonData.types
		.map(
			(t: any) =>
				t.type.name.charAt(0).toUpperCase() + t.type.name.slice(1)
		)
		.join(", ");
	const height = pokemonData.height / 10;
	const weight = pokemonData.weight / 10;

	return (
		<div
			style={{
				padding: "40px",
				fontFamily: "sans-serif",
				maxWidth: "800px",
				margin: "0 auto",
				background: "#f8f8f8",
				borderRadius: "12px",
			}}
		>
			<h1 style={{ textAlign: "center", color: "#333" }}>
				{name}{" "}
				<span style={{ color: "#888", fontSize: "0.8em" }}>
					#{pokemonData.id}
				</span>
			</h1>

			<div
				style={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					gap: "30px",
					marginTop: "30px",
				}}
			>
				{imageSrc && (
					<img
						src={imageSrc}
						alt={name}
						width={250}
						height={250}
						style={{
							border: "5px solid #ccc",
							borderRadius: "50%",
							objectFit: "cover",
						}}
					/>
				)}

				<div
					style={{
						width: "100%",
						padding: "20px",
						background: "white",
						borderRadius: "8px",
						boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
					}}
				>
					<p>
						<strong>Typen:</strong> {types}
					</p>
					<p>
						<strong>Größe:</strong> {height} m
					</p>
					<p>
						<strong>Gewicht:</strong> {weight} kg
					</p>
				</div>

				<div
					style={{
						width: "100%",
						padding: "20px",
						background: "white",
						borderRadius: "8px",
						boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
					}}
				>
					<h2>Basis-Status</h2>
					<ul style={{ listStyleType: "none", padding: 0 }}>
						{pokemonData.stats.map((stat: any) => (
							<li
								key={stat.stat.name}
								style={{ marginBottom: "5px" }}
							>
								<strong
									style={{
										display: "inline-block",
										width: "150px",
									}}
								>
									{stat.stat.name
										.replace("-", " ")
										.toUpperCase()}
									:
								</strong>
								{stat.base_stat}
								<div
									style={{
										height: "5px",
										background: "#eee",
										borderRadius: "3px",
										marginTop: "3px",
									}}
								>
									<div
										style={{
											width: `${
												Math.min(stat.base_stat, 150) /
												1.5
											}%`,
											height: "100%",
											background: "#4CAF50",
											borderRadius: "3px",
										}}
									></div>
								</div>
							</li>
						))}
					</ul>
				</div>
			</div>
		</div>
	);
}
