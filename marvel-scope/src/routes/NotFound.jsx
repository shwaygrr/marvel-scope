import { Link } from 'react-router-dom';
import { Typography } from '@mui/material';

export default function NotFound() {
    return (
        <main className="details" style={{ padding: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <h1>Ooops, nothing here!</h1>
            <Typography variant="body2" sx={{zIndex: '1'}}>
              <Link to="/" style={{ color: 'white' }}>
                <h2><u>Back to Home</u></h2>
              </Link>
            </Typography>
        </main>
    )
}