import keras

new_model = keras.models.load_model("rhya_model")

print(new_model.predict(["이 영화 재미 있어요."]))
