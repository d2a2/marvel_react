import { useHttp } from "../components/hooks/http.hook";

const useMarvelService = ()=> {
const {loading, error, request, clearError} = useHttp();
    const _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    const _apiKey = 'apikey=ed901cfed4671e663526aca8d3b1cd71';
    const _baseOffset = 210;

    const getCharacterByName = async (name) => {
		const res = await request(`${_apiBase}characters?name=${name}&${_apiKey}`);
		return res.data.results.map(_transformCharacter);
	};

    const getAllCharacters = async(offset=_baseOffset) =>{
        const res = await request(`${_apiBase}characters?limit=9&offset=${offset}&${_apiKey}`);
        return res.data.results.map(_transformCharacter);
    }

    const getCharacter = async(id) =>{
        const res = await request(`${_apiBase}characters/${id}?${_apiKey}`);
        return _transformCharacter(res.data.results[0]);
    }

    const getAllComics = async(offset=0) =>{
        const res = await request(`${_apiBase}comics?limit=8&offset=${offset}&${_apiKey}`);
        return res.data.results.map(_transformComics);
    }
    
    const getComic = async (id) =>{
        const res = await request(`${_apiBase}comics/${id}?${_apiKey}`);
        return _transformComics(res.data.results[0]);
    }

    const _transformCharacter = (char)=>{
       
        return {
                id: char.id,
                name: char.name,
                description: char.description ? `${char.description.slice(0, 210)}...` : 'There is no description for this character',
                thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
                homepage: char.urls[0].url,
                wiki: char.urls[1].url,
                comics: char.comics.items
        }
    }

    const _transformComics = (comics) =>{

        return {
            id: comics.id,
			title: comics.title,
			description: comics.description || "There is no description",
			pageCount: comics.pageCount
				? `${comics.pageCount} p.`
				: "No information about the number of pages",
			thumbnail: comics.thumbnail.path + "." + comics.thumbnail.extension,
			language: comics.textObjects[0]?.language || "en-us",
			// optional chaining operator
			price: comics.prices[0].price
				? `${comics.prices[0].price}$`
				: "not available"
        }
    }
    return {loading, error, getAllCharacters, getCharacter, clearError, getAllComics, getComic, getCharacterByName}
}
export default useMarvelService;