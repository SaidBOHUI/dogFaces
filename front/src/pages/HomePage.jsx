// import { Box } from "@mui/material";
// import React from "react";
// import Banner from "../assets/backgroundDogs.webp";

// const HomePage = () => {
// 	return (
// 		<Box
// 			variant="container"
// 			sx={{
// 				minHeight: "100vh",
// 				paddingTop: "56px", // Hauteur du AppBar
// 				background: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${Banner})`,
// 				backgroundRepeat: "no-repeat",
// 				backgroundPosition: "center",
// 				backgroundSize: "cover",
// 			}}
// 		>
// 			{/* <DessinCanvas /> */}
// 		</Box>
// 	);
// };

// export default HomePage;



import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import Banner from '../assets/backgroundDogs.webp';
import * as tf from '@tensorflow/tfjs';

const HomePage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [dogBreeds, setDogBreeds] = useState({ breed1: '', breed2: '', breed3: '' });

  // Fonction appelée lors de la sélection du fichier
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setImageUrl(URL.createObjectURL(file));  // Afficher l'image localement
    } else {
      alert('Please upload a valid image file.');
    }
  }

  // Fonction appelée lors du clic sur "Upload"
  const handleUpload = async () => {
    if (selectedFile) {
      const imgElement = document.createElement('img');
      imgElement.src = imageUrl;

      // Attendre que l'image soit chargée
      imgElement.onload = async () => {
        // Prétraiter l'image et faire une prédiction
        const top3Breeds = await predictDogBreeds(imgElement);
        setDogBreeds({
          breed1: top3Breeds[0],
          breed2: top3Breeds[1],
          breed3: top3Breeds[2]
        });
      };
    } else {
      alert('Veuillez sélectionner une image.');
    }
  }

  // Charger et prétraiter l'image pour la prédiction
  const preprocessImage = async (image) => {
    const img = tf.browser.fromPixels(image)
      .resizeNearestNeighbor([224, 224])  // Adapter la taille selon ton modèle
      .toFloat()
      .expandDims();

    // Normaliser l'image (si ton modèle le demande)
    const normalized = img.div(255);

    return normalized;
  }

  // Charger le modèle et faire la prédiction
  const predictDogBreeds = async (image) => {
    const model = await tf.loadLayersModel('/path/to/your/model/model.json');
    const preprocessedImage = await preprocessImage(image);

    // Faire une prédiction
    const predictions = await model.predict(preprocessedImage).data();
    const top3Predictions = getTopPredictions(predictions);
    return top3Predictions;
  }

  // Obtenir les trois meilleures prédictions
  const getTopPredictions = (predictions) => {
    const sortedPredictions = Array.from(predictions)
      .map((p, index) => ({ probability: p, index }))
      .sort((a, b) => b.probability - a.probability)
      .slice(0, 3);

    const breedNames = ['Golden Retriever', 'Labrador Retriever', 'Poodle'];  // Remplace par les vrais noms
    return sortedPredictions.map(p => breedNames[p.index]);
  }

  return (
    <Box
      variant="container"
      sx={{
        minHeight: "100vh",
        paddingTop: "56px",
        background: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${Banner})`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundSize: "cover",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Typography variant="h4" color="white" gutterBottom>
        Uploadez l'image d'un chien pour connaître sa race
      </Typography>
      
      <input type="file" accept="image/*" onChange={handleFileChange} />

      <Button variant="contained" sx={{ mt: 2 }} onClick={handleUpload}>
        Upload and Recognize
      </Button>

      {imageUrl && (
        <Box mt={4}>
          <img src={imageUrl} alt="Uploaded Dog" style={{ maxHeight: "300px", borderRadius: "8px" }} />
        </Box>
      )}

      {dogBreeds.breed1 && (
        <Box mt={4}>
          <TextField label="Breed 1" value={dogBreeds.breed1} sx={{ mb: 2 }} fullWidth />
          <TextField label="Breed 2" value={dogBreeds.breed2} sx={{ mb: 2 }} fullWidth />
          <TextField label="Breed 3" value={dogBreeds.breed3} sx={{ mb: 2 }} fullWidth />
        </Box>
      )}
    </Box>
  )
}

export default HomePage;
