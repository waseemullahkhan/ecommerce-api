import express from "express";
import bodyParser from "body-parser";

import productRoutes from './productRoutes.js';  // Importing product routes
import orderRoutes from './orderRoutes.js';      // Importing order routes
import shippingRoutes from './shippingRoutes.js'; // Importing shipping routes
import userRoutes from './userRoutes.js';  // Importing user routes
import categoryRoutes from './categoryRoutes.js';  // Importing category routes
import orderItemsRoutes from './orderItemsRoutes.js';
import productReviewsRoutes from './productReviewsRoutes.js';
import paymentRoutes from './paymentRoutes.js';

const app = express();
app.use(bodyParser.json());

app.use('/api', productRoutes);  // Product routes
app.use('/api', orderRoutes);    // Order routes
app.use('/api', shippingRoutes); // Shipping routes
app.use('/api', userRoutes);     // User routes
app.use('/api', categoryRoutes); // Category routes
app.use('/api', orderItemsRoutes);
app.use('/api', productReviewsRoutes);
app.use('/api', paymentRoutes);


const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});