import tensorflow as tf
from tensorflow.keras.models import load_model

print("TensorFlow version:", tf.__version__)
print("Keras version:", tf.keras.__version__)

try:
    model = load_model('generator_model.h5', compile=False)
    print("Successfully loaded the model!")
except Exception as e:
    print("Error loading model:", str(e)) 