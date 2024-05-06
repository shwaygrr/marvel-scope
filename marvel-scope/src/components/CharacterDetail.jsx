import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import md5 from 'md5';

import { Box, Typography, Button } from '@mui/material';
import AppearanceChart from "./AppearanceChart";

import { Link } from 'react-router-dom'
//prepare api key
const private_key = import.meta.env.VITE_PRIVATE_API_KEY;
const public_key = import.meta.env.VITE_PUBLIC_API_KEY;

const ts = new Date().getTime().toString(); 
const hash = md5(ts + private_key + public_key); 
const key = `ts=${ts}&apikey=${public_key}&hash=${hash}`;

export default function CharacterDetail() {
  let params = useParams();

  const [character, setCharacter] = useState(null);
  const [onChart, setOnChart] = useState(false)
  //get character info
  useEffect(() => {
    async function getCharacterData() {
      const characterQuery = `https://gateway.marvel.com:443/v1/public/characters?name=${params.character}&limit=1&${key}`;

      try {
        const response = await fetch(characterQuery);
        const characterJson = await response.json();
        setCharacter(characterJson.data.results[0]);
        console.log(character);
      } catch(error) {
        console.log(error);
        return;
      }
    }
    getCharacterData();
  }, []);

  function readUntilNonAlphanumeric(str) {
    const match = str.match(/^[\w\s]+/); // Match alphanumeric characters and spaces at the beginning of the string
    return match ? match[0] : ''; // Return the matched alphanumeric sequence or an empty string if no match
  }

  const containerStyles = { 
    p: '20px', 
    m: '20px', 
    minWidth: '100%',
    fontSize: '18px', 
    backgroundColor: 'rgba(49,49,49,.87)', 
    borderRadius: '15px',
    boxShadow: '0 0px 40px #ED1D24',
    maxHeight: '70vh',
    overflow: 'auto',
    zIndex: '1',
    '&::-webkit-scrollbar': { width: '0' }
  };

  return (
    character && <Box className='details'>
      {!onChart ? 
      <React.Fragment>
        <Typography 
          variant='h2'
          color='#00000' 
          sx={{ fontWeight: 'bold', textShadow: '0 0 5px #ED1D24, 0 0 5px #ED1D24, 0 0 5px #ED1D24', color: '#ccc' }}
        >
          {character.name}
        </Typography>

        <Box sx={ containerStyles }>
          <img 
            src={character.thumbnail.path + '.' + character.thumbnail.extension}  
            alt={character.name}
            className='character-image'
          />
          
          <Typography 
            variant='body2' 
            color='#00000'
            sx={{ textAlign: character && character.description === "" ? "center" : "justify" }}
          >
            {character.description === "" ? "Description Unavailable" : character.description}
          </Typography>
          
          <br/>

          <Box sx={{ mb: '20px', textAlign: 'center'}}>
            <Typography variant='h6' color='#00000' sx={{ width: '20%', m: 'auto', borderBottom: '2px solid #ED1D24' }}>Comic Features</Typography>
          </Box>
            
          <Box className="comics">
            {character.comics.items.map(comic => (
              <Link to={`/comic/${readUntilNonAlphanumeric(comic.name)}`} key={comic.name}>
                <Typography
                  variant='body1'
                  color='primary'
                  sx={{ '&:hover': { textDecoration: 'underline', cursor: 'pointer' } }}
                >
                  {comic.name}
                </Typography>
              </Link>
            ))}
          </Box>
        </Box>
      </React.Fragment> 
      :
      (<AppearanceChart character={character}/>)
      }
      <Button
        onClick={() => {
            setOnChart(prevOnChart => !prevOnChart)
            console.log(onChart)
        }}
        sx={{
            bottom: '10px',
            position: 'fixed',
            zIndex: 1,
            // borderColor: '#', // Background color
            backgroundColor: 'rgba(49,49,49,.87)',
            color: 'white', // Text color
            '&:hover': {
              backgroundColor: '#EC1D24', // Background color on hover
          },
        }}
      >
        See {onChart ? 'Chart' : 'Details'}
      </Button>

    </Box>
  );
}
