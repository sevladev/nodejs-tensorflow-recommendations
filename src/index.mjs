import express from "express";
import {
  loadData,
  mapProducts,
  prepareTrainingData,
  verifyDataConsistency,
  getTensors,
  trainModel,
  generateInputTensor,
} from "./tensors.mjs";

const PORT = 3000;

const setupApp = async () => {
  try {
    const app = express();

    const data = loadData("data.json");

    const { productMap, reverseProductMap, numProducts } = mapProducts(data);

    const { xs, ys } = prepareTrainingData(data, productMap, numProducts);

    verifyDataConsistency(xs, ys, numProducts);

    const { xsTensor, ysTensor } = getTensors(xs, ys, numProducts);

    const model = await trainModel(xsTensor, ysTensor, numProducts);

    app.get("/recommend/:productId", async (req, res) => {
      try {
        const productId = parseInt(req.params.productId, 10);

        if (!productMap.hasOwnProperty(productId)) {
          return res.status(400).json({ error: "Product not found" });
        }

        const inputTensor = generateInputTensor(
          productId,
          productMap,
          numProducts
        );

        const prediction = model.predict(inputTensor);

        const predictedData = await prediction.data();

        const recommendedProducts = Array.from(predictedData)
          .map((value, index) => ({ index, value }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 5)
          .map((item) => reverseProductMap[item.index]);

        res.json({ recommendations: recommendedProducts });
      } catch (error) {
        console.error("Error generating recommendations:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    });

    return app;
  } catch (error) {
    console.error("Error setting up the application:", error);
    throw error;
  }
};

setupApp()
  .then((app) => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error starting the server:", error);
  });
