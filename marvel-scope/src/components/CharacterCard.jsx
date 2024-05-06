import * as React from 'react';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

import { Link } from "react-router-dom";

export default function CharacterCard({ character }) {
  const [expanded, setExpanded] = React.useState(false);

  return (
    <Link
      to={`/character/${character.name}`}
      style={{ width: 300, margin: '10px auto'}}
    >
      <Card sx={{ backgroundColor: 'rgba(49,49,49,.87)' }}>
        <CardMedia
          component="img"
          image={character.thumbnail.path + '.' + character.thumbnail.extension}
          alt={character.name}
          sx={{ width: '100%', height: '45vh'}}
        />
        <CardContent>
          <Typography variant="h6" component="div">{character.name}</Typography>
        </CardContent>
      </Card>
    </Link>
  );
}
