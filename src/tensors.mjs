import * as tf from "@tensorflow/tfjs-node";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const loadData = (filePath) => {
  const rawData = fs.readFileSync(path.resolve(__dirname, filePath));
  return JSON.parse(rawData);
};

export const mapProducts = (data) => {
  const productMap = {};
  const reverseProductMap = {};
  let productIndex = 0;

  data.forEach((order) => {
    order.items.forEach((item) => {
      if (productMap[item.product_id] === undefined) {
        productMap[item.product_id] = productIndex;
        reverseProductMap[productIndex] = {
          id: item.product_id,
          name: item.name,
          category: item.category,
        };
        productIndex++;
      }
    });
  });

  return { productMap, reverseProductMap, numProducts: productIndex };
};

export const prepareTrainingData = (data, productMap, numProducts) => {
  const xs = [];
  const ys = [];

  data.forEach((order) => {
    const productIds = order.items
      .map((item) => productMap[item.product_id])
      .filter((id) => id !== undefined);
    productIds.forEach((id) => {
      const inputArray = new Array(numProducts).fill(0);
      inputArray[id] = 1;
      productIds.forEach((otherId) => {
        if (id !== otherId) {
          const outputArray = new Array(numProducts).fill(0);
          outputArray[otherId] = 1;
          xs.push([...inputArray]);
          ys.push([...outputArray]);
        }
      });
    });
  });

  return { xs, ys };
};

export const verifyDataConsistency = (xs, ys, numProducts) => {
  const isXsConsistent = xs.every((arr) => arr.length === numProducts);
  const isYsConsistent = ys.every((arr) => arr.length === numProducts);

  if (!isXsConsistent || !isYsConsistent) {
    console.error("Inconsistency found in array sizes.");
    console.log(
      "Array sizes xs:",
      xs.map((arr) => arr.length)
    );
    console.log(
      "Array sizes ys:",
      ys.map((arr) => arr.length)
    );
    throw new Error("Inconsistency found in array sizes.");
  }
};

export const getTensors = (xs, ys, numProducts) => {
  const xsTensor = tf.tensor2d(xs, [xs.length, numProducts]);
  const ysTensor = tf.tensor2d(ys, [ys.length, numProducts]);

  if (xsTensor.shape[0] !== ysTensor.shape[0]) {
    throw new Error("The number of examples in xs and ys does not match");
  }

  return { xsTensor, ysTensor };
};

export const trainModel = async (xsTensor, ysTensor, numProducts) => {
  const model = tf.sequential();
  model.add(
    tf.layers.dense({
      inputShape: [numProducts],
      units: 32,
      activation: "relu",
    })
  );
  model.add(
    tf.layers.dense({
      units: numProducts,
      activation: "softmax",
    })
  );

  model.compile({
    optimizer: tf.train.adam(),
    loss: "categoricalCrossentropy",
    metrics: ["accuracy"],
  });

  await model.fit(xsTensor, ysTensor, {
    epochs: 100,
    callbacks: {
      onEpochEnd: (epoch, logs) => {
        console.log(`Epoch ${epoch + 1}: loss = ${logs.loss}`);
      },
    },
  });

  return model;
};

export const generateInputTensor = (productId, productMap, numProducts) => {
  const inputArray = new Array(numProducts).fill(0);
  inputArray[productMap[productId]] = 1;
  return tf.tensor2d([inputArray], [1, numProducts]);
};
