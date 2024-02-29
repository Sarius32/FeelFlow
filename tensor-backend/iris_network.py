import keras
import numpy as np
import tensorflow as tf
import pandas as pd


def train(train_data: pd.DataFrame):
    train_data = train_data.sample(frac=1)  # shuffle train data

    target = tf.convert_to_tensor(pd.get_dummies(train_data.pop("eval")))  # extract one hot encoded target
    inputs = tf.convert_to_tensor(train_data)  # convert to train tensor

    iris_x = keras.layers.Input((6,))
    dense1 = keras.layers.Dense(10, use_bias=True, name='Dense1', activation='sigmoid')(iris_x)
    dense2 = keras.layers.Dense(3, use_bias=True, name='Dense2', activation='softmax')(dense1)
    model = keras.models.Model(inputs=[iris_x], outputs=[dense2])
    model.compile(loss='categorical_crossentropy', optimizer='adam')

    model.fit(inputs, target, batch_size=8, epochs=1000)

    return model


def predict(trained_model: keras.Model, input: pd.DataFrame):
    input_tensor = tf.convert_to_tensor(input[["sleep", "steps", "mood10", "mood12", "mood14", "mood16"]])

    prediction_vector = trained_model.predict(input_tensor)
    return np.argmax(prediction_vector)
