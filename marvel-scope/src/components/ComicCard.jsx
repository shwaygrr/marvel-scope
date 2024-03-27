import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';

export default function ComicCard({ comic, handleClick }) {
  
    return (
    <Card sx={{ display: 'flex', width: 300, margin: '10px auto', backgroundColor: 'rgba(49,49,49,.87)', height: '350px', overflow: 'auto', '&::-webkit-scrollbar': { width: '0' } }}>
        <CardMedia
        component="img"
        image={comic.thumbnail.path + '.' + comic.thumbnail.extension}
        alt={comic.title}
        sx={{ width: 140, height: 200 }}
        />
        <CardContent sx={{ flex: 1 }}>
            <Typography gutterBottom variant="h6" component="div">
                {comic.title}
            </Typography>
            {comic.variantDescription != "" && 
            <Typography variant="body2">
                <b>Variant</b>: {comic.variantDescription}
            </Typography>}
            <Typography variant="body2" >
                <b>Issue Number</b>: {comic.issueNumber}
            </Typography>
            <Typography variant="body2" >
                <b>Page Count:</b> {comic.pageCount}
            </Typography>
            <Typography variant="body2" >
                <b>Print Price:</b> ${comic.prices[0].price}
            </Typography>
            <Typography variant="body2" >
                <Link href={comic.urls[0].url} target="_blank" rel="noopener">More Info</Link>
            </Typography>
            <br/>
            {comic.creators.available != '0' && (
                <React.Fragment>
                    <Typography variant="body2"><b>Creators:</b></Typography>
                    {comic.creators.items.map(creator => (
                        <Typography key={creator.name} variant="body2">{creator.name}</Typography>
                    ))}
                </React.Fragment>
            )}
            {comic.characters.available != '0' && (
                <React.Fragment>
                    <Typography variant='body2'><b>Characters</b></Typography>
                    {comic.characters.items.map(character => (
                        <Typography onClick={() => handleClick(character.name)} variant='body2' key={character.name} color='primary' sx={{ '&:hover': { textDecoration: 'underline', cursor: 'pointer' } }}>
                        {character.name}
                    </Typography>
                    ))}
                </React.Fragment>
            )}
        </CardContent>
    </Card>
    );
}