import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import md5 from 'md5'

import { Box, Typography, Link } from '@mui/material';

import { Link as LinkRoute} from 'react-router-dom'
//setup api key
const private_key = import.meta.env.VITE_PRIVATE_API_KEY;
const public_key = import.meta.env.VITE_PUBLIC_API_KEY

const ts = new Date().getTime().toString(); 

const hash = md5(ts + private_key + public_key); 

const key = `ts=${ts}&apikey=${public_key}&hash=${hash}`

export default function ComicDetail() {
  let params = useParams();
  
  const [comic, setComic] = useState(null)

  //get comic data
  useEffect(() => {
    async function getComicData() {
      const comicQuery = `https://gateway.marvel.com:443/v1/public/comics?title=${params.comic}&limit=1&${key}`;

      try {
        const response = await fetch(comicQuery)
        const comicJson = await response.json()
        setComic(comicJson.data.results[0]);
        console.log(comic)
      } catch(error) {
        console.log(error)
        return
      }
    }

    getComicData()
  }, [])
  const containerStyles = { 
    p: '20px', 
    m: '5px', 
    minWidth: '100%',
    backgroundColor: 'rgba(49,49,49,.87)', 
    borderRadius: '15px',
    boxShadow: '0 0px 40px #ED1D24', // Add a subtle shadow
    textAlign: comic && comic.description == "#N/A" ? "center" : "left",
    maxHeight: '65vh',
    overflow: 'auto',
    zIndex: '1',
    '&::-webkit-scrollbar': { width: '0' }
  }

  return (
    comic && 
    <Box className='details' sx={{ fontWeight: 'bold' }}>
      <Typography gutterBottom variant="h2" sx={{ fontSize: 40, textAlign: 'center'}}>{comic.title}</Typography>
    
      <Box sx={ containerStyles }>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          {comic.variantDescription && <Typography variant="body2">
            <b>Variant</b>: {comic.variantDescription}
          </Typography>}

          <Typography variant="body2">
            <b>Issue Number</b>: {comic.issueNumber}
          </Typography>

          <Typography variant="body2">
            <b>Page Count:</b> {comic.pageCount}
          </Typography>

          <Typography variant="body2">
            <b>Print Price:</b> ${comic.prices[0].price}
          </Typography>

          <Typography variant="body2">
            <Link href={comic.urls[0].url} target="_blank" rel="noopener">More Info</Link>
          </Typography>
        </Box>

        {comic.creators.available !== '0' && <Box sx={{ display: 'flex', m: '5px auto'}}>
          <Typography variant="body2"><b>Creators:&nbsp;</b></Typography>
          <Typography variant="body2">
            {comic.creators.items.map(creator => (creator.name)).join(', ')}
          </Typography>
        </Box>}

        {comic.characters.available !== '0' && <Box sx={{ display: 'flex' }}>
          <Typography variant='body2'><b>Characters:&nbsp;</b></Typography>
            <Box>
              {comic.characters.items.map((character, index) => (
                <LinkRoute to={`/character/${character.name}`} key={character.name}>
                  <Typography
                    variant='body2'
                    color='primary'
                    sx={{
                      '&:hover': { textDecoration: 'underline', cursor: 'pointer' },
                      display: 'inline' // To display characters inline
                    }}
                  >
                    {index === comic.characters.items.length - 1 ? character.name : character.name + ', '                                }
                  </Typography>
                </LinkRoute>))}
            </Box>
        </Box>}

        <img 
          src={comic.images.length > 1 ? (comic.images[1].path + '.' + comic.images[1].extension) : (comic.thumbnail.path + '.' + comic.thumbnail.extension)}  
          alt={comic.name}
          className="comic-image"
        />

        <Typography 
          variant="body2" 
          sx={{ textAlign: (comic.description == "#N/A" || comic.description == "") ? "center" : "justify" }}
        >
          {(comic.description == "#N/A" || comic.description == "") ? "Description Unavailable" : comic.description}
        </Typography>
      </Box>
    </Box>
  )
}