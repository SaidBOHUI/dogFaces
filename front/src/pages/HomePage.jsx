// import React, { useState, useEffect } from 'react';
// import { Box, Button, TextField, Typography, CircularProgress } from '@mui/material';
// import Banner from '../assets/backgroundDogs.webp';
// import * as tf from '@tensorflow/tfjs';

// const HomePage = () => {
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [imageUrl, setImageUrl] = useState(null);
//   const [dogBreeds, setDogBreeds] = useState({ breed1: '', breed2: '', breed3: '' });
//   const [model, setModel] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);

//   useEffect(() => {
//     loadModel();
//   }, []);

//   const loadModel = async () => {
//     try {
//       const loadedModel = await tf.loadLayersModel('/models/model.json');
//       console.log(loadedModel.summary());
//       setModel(loadedModel);
//     } catch (error) {
//       console.error('Failed to load model:', error);
//     }
//   };

//   const handleFileChange = (event) => {
//     const file = event.target.files[0];
//     if (file && file.type.startsWith('image/')) {
//       setSelectedFile(file);
//       setImageUrl(URL.createObjectURL(file));
//     } else {
//       alert('Please upload a valid image file.');
//     }
//   };

//   const handleUpload = async () => {
//     if (!selectedFile) {
//       alert('Veuillez sélectionner une image.');
//       return;
//     }
//     if (!model) {
//       alert('Le modèle n\'est pas encore chargé. Veuillez réessayer.');
//       return;
//     }

//     setIsLoading(true);
//     const imgElement = document.createElement('img');
//     imgElement.src = imageUrl;
//     imgElement.onload = async () => {
//       try {
//         const top3Breeds = await predictDogBreeds(imgElement);
//         setDogBreeds({
//           breed1: top3Breeds[0],
//           breed2: top3Breeds[1],
//           breed3: top3Breeds[2]
//         });
//       } catch (error) {
//         console.error('Prediction failed:', error);
//         alert('La prédiction a échoué. Veuillez réessayer.');
//       } finally {
//         setIsLoading(false);
//       }
//     };
//   };

//   const preprocessImage = (image) => {
//     return tf.tidy(() => {
//       const img = tf.browser.fromPixels(image)
//         .resizeNearestNeighbor([300, 300])
//         .toFloat()
//         .expandDims();
//       return img.div(255);
//     });
//   };

//   const predictDogBreeds = async (image) => {
//     if (!model) {
//       throw new Error("Model not loaded yet");
//     }
//     const preprocessedImage = preprocessImage(image);
//     const predictions = await model.predict(preprocessedImage).data();
//     preprocessedImage.dispose();
//     return getTopPredictions(predictions);
//   };

//   const getTopPredictions = (predictions) => {
//     const breedNames = ['Golden Retriever', 'Labrador Retriever', 'Poodle'];
//     return Array.from(predictions)
//       .map((p, index) => ({ probability: p, breed: breedNames[index] }))
//       .sort((a, b) => b.probability - a.probability)
//       .slice(0, 3)
//       .map(p => p.breed);
//   };

//   return (
//     <Box
//       variant="container"
//       sx={{
//         minHeight: "100vh",
//         paddingTop: "56px",
//         background: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${Banner})`,
//         backgroundRepeat: "no-repeat",
//         backgroundPosition: "center",
//         backgroundSize: "cover",
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//         justifyContent: "center",
//       }}
//     >
//       <Typography variant="h4" color="white" gutterBottom>
//         Uploadez l'image d'un chien pour connaître sa race
//       </Typography>
      
//       <input type="file" accept="image/*" onChange={handleFileChange} />

//       {imageUrl && (
//         <Box mt={4}>
//           <img src={imageUrl} alt="Uploaded Dog" style={{ maxHeight: "300px", borderRadius: "8px" }} />
//         </Box>
//       )}

//       <Button 
//         variant="contained" 
//         sx={{ mt: 2 }} 
//         onClick={handleUpload}
//         disabled={isLoading || !model}
//       >
//         {isLoading ? <CircularProgress size={24} /> : 'Reconnaître'}
//       </Button>

//       {dogBreeds.breed1 && (
//         <Box mt={4}>
//           <TextField label="Breed 1" value={dogBreeds.breed1} sx={{ mb: 2 }} fullWidth />
//           <TextField label="Breed 2" value={dogBreeds.breed2} sx={{ mb: 2 }} fullWidth />
//           <TextField label="Breed 3" value={dogBreeds.breed3} sx={{ mb: 2 }} fullWidth />
//         </Box>
//       )}
//     </Box>
//   );
// };

// export default HomePage;


import React, { useState } from 'react'

const HomePage = () => {
  const [selectedFile, setSelectedFile] = useState(null)
  const [predictions, setPredictions] = useState(null)

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0])
  }

  const handleUpload = async () => {
    const formData = new FormData()
    formData.append('file', selectedFile)

    const response = await fetch('http://localhost:5000/predict', {
      method: 'POST',
      body: formData
    })

    const result = await response.json()
    setPredictions(result)
  }

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Reconnaissance de Race de Chien</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Uploader</button>

      {predictions && (
        <div>
          <h2>Prédictions :</h2>
          <p>Race 1 : {predictions.breed_1}</p>
          <p>Race 2 : {predictions.breed_2}</p>
          <p>Race 3 : {predictions.breed_3}</p>
        </div>
      )}
    </div>
  )
}

export default HomePage
