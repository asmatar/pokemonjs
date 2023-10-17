const pokemontype = [...document.querySelectorAll(".types")];
/* const pokemonCard = [...document.querySelectorAll(".pokemon")]; */
const wrapper = document.querySelector(".wrapper");
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const searchForm = document.querySelector(".search-bar");
const inputSearch = document.querySelector(".search-pokemon");
const BASE_URL = "https://pokeapi.co/api/v2/pokemon/";
let IsCategorized = false
let allPokemon = []
let limit = 18
let offset = 0
const fetchPokemon = async (nbPoke) => {
    console.log(nbPoke)
    const response = await fetch(`${BASE_URL}?limit=${limit}&offset=${Number(nbPoke)}.`);
    const dataPoke = await response.json();
    const getAllPokemon = await Promise.all(dataPoke.results.map(async (pokemon) => {
        const response = await fetch(pokemon.url);
        const data = await response.json();
        return data
    }))
    allPokemon.push(getAllPokemon) 
    displayUI(allPokemon.flat())
}
const displayUI = (allPokemon) => {
    const displaypokemon = allPokemon.flatMap((pokemon)=>{
        console.log(pokemon)
        return  `
            <div class="pokemon ${pokemon.types[0].type.name}" id="${pokemon.id}">
                <p id="${pokemon.id}">${pokemon.name}</p>
                <div id="img-container">
                <img id="imgPoke" src="${pokemon.sprites.front_default}" />
                </div>
            </div> 
        `
    })
    wrapper.innerHTML = displaypokemon
    const pokemonDiv = [...document.querySelectorAll(".pokemon")];
    
    pokemonDiv.forEach((pokemon) => {
        pokemon.addEventListener("click", (e) => {
            let matchPokemon = allPokemon.find((poke) => {
                return poke.id === Number(pokemon.id)
            })
        showModal(matchPokemon) 
        })
    })
    const pokeCard = document.querySelector(".pokemon:last-child");
    let options = {
        threshold: 1,
        rootMargin: '-150px'
    }
    const observer = new IntersectionObserver(entries=>{
        console.log(entries)
        const lastCard = entries[0]
        if(!lastCard.isIntersecting || IsCategorized) return
        fetchPokemon(pokeCard.id)
    }, options)
    observer.observe(pokeCard)
}
const fetchPokemonByType = async (type, pokeCard) => {
    const response = await fetch(`https://pokeapi.co/api/v2/type/${type}`);
    const dataPoke = await response.json(); 
    const getAllPokemon = await Promise.all(dataPoke.pokemon.map(async (pokemon) => {
        const response = await fetch(pokemon.pokemon.url);
        const data = await response.json();
        return data 
    }))
    IsCategorized = true
    displayUI(getAllPokemon)
}
pokemontype.forEach((typeIcon) => {
    typeIcon.addEventListener("click", (e) => {
        const typePokemon = typeIcon.getAttribute("data-type")
        fetchPokemonByType(typePokemon)
    })
})
const showModal = (pokemon) => {
    console.log("os",pokemon.types[0].type.name)
    console.log(pokemon)
    console.log(pokemon.types[1])
    overlay.style.display = "block"
    modal.innerHTML =  `
     <div class="fiche fade-in ${pokemon.types[0].type.name}">
     <div id="close-card"><i class="fa-solid fa-circle-xmark"></i></div>
     <div class="header">
         <p id="name-fiche">${pokemon.id}# ${pokemon.name}</p>
         <div class="block-element">
             <div class="block-img-element"><img src="./images-en/${pokemon.types[0].type.name}.png" class="img-element">${ pokemon.types[1] !== undefined ? `<img src="./images-en/${pokemon.types[1].type.name}.png" class="img-element">` : ""}</div>
             <div class="block-type"><p class="element">${pokemon.types[0].type.name} </p>${pokemon.types[1] !== undefined ? `<p class="element">${pokemon.types[1].type.name} </p>` : ""}</div>
         </div>
     </div>
     <div class="img-container"><img id="img-poke-fiche" src="https://raw.githubusercontent.com/Yarkis01/PokeAPI/images/sprites/${pokemon.id}/regular.png"></div>
     <div id="stats">
         <div class="stat">
             <p class="stat-desc stat-desc-atk">Atk: ${pokemon.stats[1].base_stat}</p>
             <p class="stat-desc stat-desc-def">Def: ${pokemon.stats[2].base_stat}</p>
             <p class="stat-desc stat-desc-hp">Hp: ${pokemon.stats[0].base_stat}</p>
             <p class="stat-desc stat-desc-spe-atk">Spe-atk: ${pokemon.stats[3].base_stat}</p>
             <p class="stat-desc stat-desc-spe-def">Spe-def: ${pokemon.stats[4].base_stat}</p>
             <p class="stat-desc stat-desc-vit">Vit: ${pokemon.stats[5].base_stat}</p>
         </div>
         <div class="block-range">
             <div class="container-range">
                 <div class="range-container"><span class="range range-atk" style="width: 80%;"></span></div>
             </div>
             <div class="stat">
                 <div class="container-range">
                     <div class="range-container"><span class="range range-def" style="width: 50%;"></span></div>
                 </div>
             </div>
             <div class="stat">
                 <div class="container-range">
                     <div class="range-container"><span class="range range-hp" style="width: 45%;"></span></div>
                 </div>
             </div>
             <div class="stat">
                 <div class="container-range">
                     <div class="range-container"><span class="range range-spe-atk" style="width: 75%;"></span></div>
                 </div>
             </div>
             <div class="stat">
                 <div class="container-range">
                     <div class="range-container"><span class="range range-spe-def" style="width: 60%;"></span></div>
                 </div>
             </div>
             <div class="stat">
                 <div class="container-range">
                     <div class="range-container"><span class="range range-vit" style="width: 120%;"></span></div>
                 </div>
             </div>
         </div>
     </div>
 </div>
    `
    const btnClose = document.querySelector("#close-card");
    btnClose.addEventListener("click", () => {
        overlay.style.display = "none"
        modal.innerHTML = ""
    })
}
const fetchByNameId = async (query) => {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${query}`);
    const dataPoke = await response.json(); 
    showModal(dataPoke)
}
searchForm.addEventListener("submit", (e) => {
    e.preventDefault()
    const query = inputSearch.value
    fetchByNameId(query)
    inputSearch.value = ""
})
overlay.addEventListener("click", () => {
    overlay.style.display = "none"
    modal.innerHTML = ""
})
fetchPokemon(0)





