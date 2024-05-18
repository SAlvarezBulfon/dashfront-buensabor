import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';

interface Content {
  url: string;
  title: string;
  content: string;
}

const InicioCard: React.FC<{ content: Content; sucursalId: string }> = ({ content, sucursalId }) => {
  const { url, title, content: cardContent } = content;
  return (
    <Card sx={{ maxWidth: 345, my: 2  }}>
      <CardMedia
        sx={{ height: 140 }}
        image={url}
        title={title}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {cardContent}
        </Typography>
      </CardContent>
      <CardActions>
      <Link to={`/${title}/${sucursalId}`} style={{ textDecoration: 'none', color: 'inherit' }} >
         <Button sx={{color: '#FB6376'}} size="small">Ver más</Button>
      </Link>
      </CardActions>
    </Card>
  );
}

export default InicioCard;