import { useState, useEffect } from 'react';
import {Link} from 'react-router-dom';
import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Skeleton from '../skeleton/Skeleton';

import './charInfo.scss';


const CharInfo = (props) => {

    const {loading, error, getCharacter, clearError} = useMarvelService();
    const[char, setChar] = useState(null);
  
    
    useEffect(()=>{
        updateChar();
    },[props.charId])

    
    const updateChar=()=>{
        const {charId} = props;
        if (!charId) {
            return;
        }
        clearError();
        getCharacter(charId)
        .then(onCharLoaded)
    }

    
    const onCharLoaded = (char)=>{
        setChar(char);
    }


        const skeleton = loading || error || char ? null : <Skeleton/>;
        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading ? <Spinner/> : null;
        const content = !(loading || error || !char) ? <View char = {char}/> : null;

        return (
            <div className="char__info">
                {errorMessage}
                {spinner}
                {content}
                {skeleton}
                
            </div>
        )
    }

    

const View = ({char}) =>{
    const {name, description, thumbnail, homepage, wiki, comics} = char;
    return(
        <>
        <div className="char__basics">
                <img src={thumbnail} alt={name}/>
                <div>
                    <div className="char__info-name"
                    >{name}</div>
                    <div className="char__btns">
                        <a href={homepage} className="button button__main">
                            <div className="inner">homepage</div>
                        </a>
                        <a href={wiki} className="button button__secondary">
                            <div className="inner">wiki</div>
                        </a>
                    </div>
                </div>
            </div>
            <div className="char__descr">
               {description}
            </div>
            <div className="char__comics">Comics:</div>
            <ul className="char__comics-list">

                {comics.length>0 ? null : 'There is no comics with this character'}
                    {comics.map((item,i)=>{
                        if (i>9) return null; 
                        return (
                <li className="char__comics-item"
                    key={i}>
                    <Link to={`/comics/${item.resourceURI.substring(43)}`}>
                    {item.name} 
                    </Link>
                </li>
                )
            })
        }
            </ul>
</>
    )
}

export default CharInfo;