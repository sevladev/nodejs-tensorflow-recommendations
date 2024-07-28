Key Features

- Model Training: Uses historical order data to train a recommendation model using neural networks.
- Real-time Prediction: Generates real-time product recommendations based on the provided product ID.
- REST API: Offers a RESTful API for easy integration with web and mobile applications.
- High Accuracy: Utilizes advanced deep learning algorithms to ensure the accuracy of recommendations.
- Scalability: Built with Node.js and TensorFlow.js, ensuring performance and scalability to handle large volumes of data and requests.

Technologies Used

- Node.js: For server construction and route management.
- Express: Framework to create the RESTful API.
- TensorFlow.js: Machine learning library for model training and prediction.
- JavaScript (ES6+): Programming language used to develop the project.

How to Use

Setup

1. Clone the repository:

```
git clone https://github.com/sevladev/nodejs-tensorflow-recommendations.git
cd nodejs-tensorflow-recommendations
```

2. Install dependencies:

```
pnpm install
```

3. Prepare your data:
   - Ensure you have a data.json file with your historical order data in the project directory.

Model Training

4. Train the model:
   - The model will be trained when the server is started. Ensure your data is correctly formatted in data.json.

Execution

5. Start the server:

```
pnpm start
```

- The server will run on http://localhost:3000.

Usage Example

6. Get product recommendations:
   - Make a GET request to the following endpoint to get the top 5 product
     recommendations for the provided productId:

```sh
curl http://localhost:3000/recommend/{productId}
```

- Example response:

```json
{
  "recommendations": [
    { "id": 1, "name": "Product 1", "category": "Category A", "score": 0.5 },
    { "id": 2, "name": "Product 2", "category": "Category B", "score": 1 }
  ]
}
```

Example Data Format

Ensure your data.json is structured as follows:

```json
[
  {
    "user_id": "12345",
    "items": [
      { "product_id": 1, "name": "Product 1", "category": "Category A" },
      { "product_id": 2, "name": "Product 2", "category": "Category B" }
    ]
  },
  {
    "user_id": "12346",
    "items": [
      { "product_id": 2, "name": "Product 2", "category": "Category B" },
      { "product_id": 3, "name": "Product 3", "category": "Category C" }
    ]
  }
]
```
