import { Box, Typography, Fade } from '@mui/material';

function About() {
  return (
    <Fade in = {true} timeout={{ enter: 1500 }}>
      <Box sx = {{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          margin: "auto",
          width: {md: 800, sm: 500, xs: 330},
          px: 2,
          pb: 16
      }}>
          <Typography component="h2" sx={{
              fontWeight: 800,
              fontSize: { xs: "1.9rem", md: "2.4rem" },
              letterSpacing: "-0.02em",
              mb: 1,
              background: "linear-gradient(92deg, #39FF14, #FFE600)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text"
          }}>
              How it works
          </Typography>
          <Typography variant = "body1" sx = {{textIndent: 32, lineHeight: 1.8, color: "text.primary"}}>
              LitBeats takes in an input of a book and returns you a spotify playlist!
              We collected 16k books and 400k songs. Then, the book descriptions and song lyrics
              turn into numbers using Natural Language Processing (NLP) vectorization techniques. 
              With these numbers, we can compute cosine similarity scores. We then stored the top 
              15 most similar songs of every genre for every book in json files.
          </Typography>
          <Typography variant = "body1" sx = {{textIndent: 32}}>
              Many web services rely on recommender systems to
              help users discover personalized content from their
              ever-increasing large databases. Great performance can be achieved through 
              simple techniques such as matrix factorization (MF) of user-item
              matrices. MF belongs to a class of algorithms known
              as collaborative filtering and leverages preference data
              from a large collection of users to inform the suggestions provided 
              to any specific individual. While these
              techniques have been applied successfully to recommend 
              personalized content in a single domain, recommending content across 
              domains is less explored. As a result, we are interested in designing a collaborative
              filtering system to recommend cross-domain content.
              In particular, we designed an automated music playlist
              recommendation system for books based on their descriptions. 
              In doing so, we hope to create a unique, immersive reading experience.
          </Typography>

          <Typography variant = "body1" sx = {{textIndent: 32}}>
              We connect book and song domains by using modern
              advances in NLP. Siamese provided an efficient method for
              computing sentence similarity embeddings
              transformer models. We train our model using recent advances in fast
              MF algorithms. Finally, we apply weighted regularization
              to encourage small norms in the latent factors so that
              the learned factorization will be stable. 
          </Typography>
      </Box>
    </Fade>
  );
}

export default About;