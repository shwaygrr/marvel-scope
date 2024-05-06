import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';

import { Link } from 'react-router-dom'

export default function ComicCard({ comic }) {
    
    //need to fix function for better comic query
    function readUntilNonAlphanumeric(str) {
        const match = str.match(/^[\w\s]+/); // Match alphanumeric characters and spaces at the beginning of the string
        return match ? match[0] : ''; // Return the matched alphanumeric sequence or an empty string if no match
    }

    return (
    < Link
        to={`/comic/${readUntilNonAlphanumeric(comic.title)}`}
        style={{ width: 300, margin: '10px auto' }}>
    <Card sx={{ backgroundColor: 'rgba(49,49,49,.87)', height: '400px' }}>
        <CardMedia
        component="img"
        image={comic.thumbnail.path + '.' + comic.thumbnail.extension}
        alt={comic.title}
        sx={{ width: '100%', height: '36vh' }}
        />
        <CardContent sx={{ flex: 1 }}>
            <Typography gutterBottom variant="h6">
                {comic.title}
            </Typography>
        </CardContent>
    </Card>
    </Link>
    );
}