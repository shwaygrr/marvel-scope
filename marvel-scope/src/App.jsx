import { useState, useEffect } from 'react'
import './App.css'

import { Box, TextField, createTheme, ThemeProvider, Select, MenuItem, FormControl, ButtonGroup, Button, Grid, Typography } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search';

import md5 from 'md5'
import debounce from 'lodash.debounce';

import CharacterCard from './components/CharacterCard';
import ComicCard from './components/ComicCard';

const private_key = import.meta.env.VITE_PRIVATE_API_KEY;
const public_key = import.meta.env.VITE_PUBLIC_API_KEY

const ts = new Date().getTime().toString(); 

const hash = md5(ts + private_key + public_key); 

const key = `ts=${ts}&apikey=${public_key}&hash=${hash}`

const theme = createTheme({
  palette: {
    primary: {
      main: '#EC1D24',
    },
    secondary: {
      main: '#000000',
    },
    text: {
      primary: '#ccc',
      secondary: 'black'
    }
  },
  typography: {
    fontFamily: [
      'Roboto',
      'Open Sans',
      'sans-serif',
    ].join(','),
  },
});

const alphabets = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));
const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

function App() {

  const [filter, setFilterForm] = useState({
    search: '',
    type: 'Characters'
  })
  
  const [characterList, setCharacterList] = useState(null)
  const [comicsList, setComicsList] = useState(null)

  const menuItemSX = { 
    backgroundColor: '#f7a1a4', 
    color: 'black', 
    textAlign: 'center' 
  }

  const fetchData = async (query) => {
    try {
      const response = await fetch(query)
      const json = await response.json()
      return json.data.results
    } catch (error) {
      console.log(error)
      return
    }
  }
  
  useEffect(() => {     
    async function setData() {
      const charactersQuery = `http://gateway.marvel.com/v1/public/characters?limit=100&${key}`;      
      fetchData(charactersQuery)
        .then(data => setCharacterList(data))
        .catch(err => console.log(err))

      const comicsQuery = `http://gateway.marvel.com/v1/public/comics?limit=100&${key}`
      fetchData(comicsQuery)
        .then(data => setComicsList(data))
        .catch(err => console.log(err))
    } 
    setData()
  }, [])

  const debouncedSearch = debounce(onSearch, 1000); // Adjust the delay time as needed
  useEffect(() => {
    debouncedSearch()
  }, [filter.search])

  function onSearch() {
    const searchCharacterQuery =`https://gateway.marvel.com:443/v1/public/characters?name=${filter.search}&limit=100&${key}`;
    filter.search.trim().length && fetchData(searchCharacterQuery)
      .then(results => setCharacterList(results))
      .catch(error => console.error(error));

    const searchComicQuery = `https://gateway.marvel.com:443/v1/public/comics?title=${filter.search}&limit=100&${key}`;
    filter.search.trim().length && fetchData(searchComicQuery)
      .then(results => setComicsList(results))
      .catch(error => console.error(error));
  }

  function handleStartsWith(symbol) {    
    const startsWithCharacterQuery = `https://gateway.marvel.com:443/v1/public/characters?nameStartsWith=${symbol}&limit=100&${key}`
    fetchData(startsWithCharacterQuery)
      .then(characters => setCharacterList(characters))
      .catch(err => crossOriginIsolated.log(err))
    
    const startsWithComicQuery = `https://gateway.marvel.com:443/v1/public/comics?titleStartsWith=${symbol}&limit=100&${key}`
    fetchData(startsWithComicQuery)
      .then(comics => setComicsList(comics))
      .catch(err => console.log(err))
  }
 
  function handleCharacterClick(character) {
    setFilterForm(prevFilterForm => ({search: character, type: 'Characters'}))
  }

  function handleComicClick(comic) {
    setFilterForm(prevFilterForm => ({search: comic, type: 'Comics'}))
    console.log(comic)
  }

  return (
    <ThemeProvider theme={theme}>
      <div className="app">
        <Box className="filters">
          <FormControl sx={{ display: 'flex',flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }} fullWidth>
            <Box sx={{ display: 'flex', width: 400, pr: '100px' }}>
              <SearchIcon sx = {{ pt: 0.5 }}/>
              <TextField
                hiddenLabel
                sx={{ flex: 1, display: 'flex', width: 400 }}
                placeholder={`Search ${filter.type == 'Characters' ? 'Characters' : 'Comics'}`}
                variant='standard'
                inputProps={{ 'aria-label': 'search' }}
                onChange={e => setFilterForm(prevFilterForm => ({...prevFilterForm, search: e.target.value}))}
              />
            </Box>
            <Select
                variant='standard'
                value={filter.type}
                sx={{ width: 150, textAlign: 'center', borderColor: 'secondary', p: 'auto 10px' }}
                onChange={e => setFilterForm(prevFilterForm => ({...prevFilterForm, type: e.target.value}))}
            >
              <MenuItem value={'Characters'} sx={menuItemSX}>Characters</MenuItem>
              <MenuItem value={'Comics'} sx={menuItemSX}>Comics</MenuItem>
            </Select>
          </FormControl>

          <ButtonGroup sx={{ display: 'flex', flexWrap: 'wrap', m: '5px', justifyContent: 'center', alignItems:'center'}}>
            {[...numbers, ...alphabets].map(symbol => (
              <Button key={symbol} variant='contained' sx={{ p: '10px', m: '4px' }} onClick={() => handleStartsWith(symbol)}>
                {symbol}
              </Button>
            ))}
          </ButtonGroup>              
        </Box>
        
        <br/>

        <Grid className="results" container  sx={{overflowY: 'scroll', '&::-webkit-scrollbar': { width: '0' } }}>          
          {filter.type === 'Characters' && characterList ? 
            characterList.map(character => <CharacterCard key={character.id} character={character} handleClick={handleComicClick}/>) :
            <Typography variant="h5" sx={{ width: '100%', textAlign:'center' }}>{filter.type != 'Comics' && "No Results"}</Typography>
          }
          {filter.type === 'Comics' && comicsList ?
            comicsList.map(comic => <ComicCard key={comic.id} comic={comic} handleClick={handleCharacterClick}/>) :
            <Typography variant="h5" sx={{ width: '100%', textAlign: 'center' }}>{filter.type != 'Characters' && "No Results"}</Typography>
          }
        </Grid>
      </div>
    </ThemeProvider>
  )
}

export default App