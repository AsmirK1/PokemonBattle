import PokemonCard from "./PokemonCard";

// LAyout Component for Pokemon
// reuse in Pokedex, roaster(?), as loading Page (with placeholders)
const PokemonList = () => {
	// Placeholder for Data
	const myPokemon = ["Charmander", "Bisasam", "Mew"];
	return (
		<section>
			<h1>Pokemon List</h1>
			{myPokemon.map((pokemon) => (
				<PokemonCard pokemon={pokemon} />
			))}
		</section>
	);
};
export default PokemonList;
