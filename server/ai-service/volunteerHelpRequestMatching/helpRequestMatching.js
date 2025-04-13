const tf = require('@tensorflow/tfjs-node');
const fs = require('fs');
const path = require('path');

const rawData = fs.readFileSync('helpRequestTrainingData.json');
const trainingData = JSON.parse(rawData)
// input structure [matching location, matching interest]
const inputs = trainingData.map(item => item.input);
const outputs = trainingData.map(item => item.output);

const inputTensor = tf.tensor2d(inputs);
const outputTensor = tf.tensor2d(outputs);

const model = tf.sequential();

model.add(tf.layers.dense({
    units: 8,
    activation: 'relu',
    inputShape: [2]
}));

model.add(tf.layers.dense({
    units: 4,
    activation: 'relu'
}));

model.add(tf.layers.dense({
    units: 1,
    activation: 'sigmoid'
}));

model.compile({
    optimizer: tf.train.adam(0.01),
    loss: 'binaryCrossentropy',
    metrics: ['accuracy']
});

const trainModel = async () => {
    await model.fit(inputTensor, outputTensor, {
        epochs: 100,
        batchSize: 4,
        shuffle: true,
        callbacks: tf.callbacks.earlyStopping({ patience: 10})
    });

    console.log("Help request model trained");
    const modelDir = path.join(__dirname, 'helpRequestMatchModel');
    if (!fs.existsSync(modelDir)) {
        fs.mkdirSync(modelDir);
    }

    await model.save(`file://${modelDir}`);
    console.log("Help request model saved");
}

trainModel()
    .then(() => {
        const testData = tf.tensor2d([
            [1, 1],
            [1, 0],
            [0, 1],
            [0, 0]
        ]);
        const predictions = model.predict(testData);
        predictions.print();
    })