import re

import pandas as pd
import tensorflow as tf
from keras.layers import TextVectorization
from sklearn.model_selection import train_test_split
from tensorflow.python.keras.models import Sequential
from tensorflow.python.keras.layers import Dense, Flatten
from tensorflow.python.keras import Input
from tensorflow.python.keras import layers


def build_model(train_data):
    train_data = tf.data.Dataset.from_tensor_slices(train_data)
    model = Sequential()
    model.add(Input(shape=(1,), dtype="string"))
    max_tokens = 15000
    max_len = 50
    vectorize_layer = TextVectorization(
        max_tokens=max_tokens,
        output_mode="int",
        output_sequence_length=max_len,
    )

    vectorize_layer.adapt(train_data.batch(64))
    model.add(vectorize_layer)
    model.add(layers.Embedding(max_tokens + 1, output_dim=200))
    model.add(Flatten())
    model.add(Dense(8, activation="relu"))
    model.add(Dense(1, activation="sigmoid"))

    return model


train_df = pd.read_csv('ratings_train.txt', sep="\t")

print(train_df.head())
train_df = train_df[train_df['document'].notnull()]
train_df['document'] = train_df['document'].apply(lambda x: re.sub(r'[^ ㄱ-ㅣ가-힣]+', " ", x))

print(train_df.info())
print(train_df['label'].value_counts())
text = train_df['document']
score = train_df['label']

train_x, test_x, train_y, test_y = train_test_split(text, score, test_size=0.2, random_state=0)
print(len(train_x), len(train_y), len(test_x), len(test_y))

rnn_model = build_model(train_x)
rnn_model.compile(optimizer="adam", loss='binary_crossentropy', metrics=['accuracy'])

# model training
history = rnn_model.fit(train_x, train_y, epochs=20, batch_size=256, validation_data=(test_x, test_y))

rnn_model.predict(["이 영화 개꿀잼"])

# 모델 저장
rnn_model.save("rhya_model")
