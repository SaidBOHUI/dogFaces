from flask import Flask, request, jsonify
import tensorflow as tf
import numpy as np
from PIL import Image
import io

# Charger ton modèle TensorFlow
model = tf.keras.models.load_model('models/model.h5')

# Charger la liste des classes de races
with open('models/labels.txt', 'r') as f:
    breeds = f.read().splitlines()

# Initialiser Flask
app = Flask(__name__)

# Définir une route pour l'API de prédiction
@app.route('/predict', methods=['POST'])
def predict():
    # Vérifier si un fichier a été uploadé
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']

    # Vérifier si le fichier est une image
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    try:
        # Ouvrir l'image et la prétraiter
        image = Image.open(io.BytesIO(file.read()))
        image = image.resize((300, 300))
        image = np.array(image) / 255.0
        image = np.expand_dims(image, axis=0)

        # Faire la prédiction
        predictions = model.predict(image)
        top_breeds = np.argsort(predictions[0])[-3:][::-1]  # Obtenir les 3 meilleurs résultats

        # Mapper les résultats avec les noms de races
        top_breed_names = [breeds[i] for i in top_breeds]

        return jsonify({
            "breed_1": top_breed_names[0],
            "breed_2": top_breed_names[1],
            "breed_3": top_breed_names[2]
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Lancer l'application Flask
if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port=5000)
