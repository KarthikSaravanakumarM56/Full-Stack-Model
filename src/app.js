const express = require("express");
const { MongoClient } = require("mongodb");

const app = express();

app.use(express.json());

const client = new MongoClient("mongodb+srv://mkarthiksaravanakumar_db_user:68jgyaF9nwFVOuux@cluster0.1scfwby.mongodb.net");

async function start() {

    try {
        await client.connect();

        console.log("MongoDB connected");

        const db = client.db("onlineShopping");
        const orders = db.collection("orders");

        app.get("/", (req, res) => {
            res.send("Online Shopping Order Management System");
        });

        app.get("/orders", async (req, res) => {

            const data = await orders.find().toArray();

            res.json(data);
        });

        app.post("/orders", async (req, res) => {

            const result = await orders.insertOne(req.body);

            res.json({
                message: "Order added successfully",
                orderId: result.insertedId
            });
        });

        app.put("/orders/:id", async (req, res) => {

            const id = req.params.id;

            const result = await orders.updateOne(
                { orderId: id },
                {
                    $set: {
                        orderStatus: req.body.orderStatus
                    }
                }
            );

            if (result.matchedCount === 0) {
                return res.status(404).send("Order not found");
            }

            res.send("Order status updated successfully");
        });
        
        // Add an order
app.post("/orders", async (req, res) => {

    const result = await orders.insertOne(req.body);

    res.json({
        message: "Order added successfully",
        orderId: result.insertedId
    });
});
        app.listen(3000, "0.0.0.0", () => {
            console.log("Server running on port 3000");
        });

    } catch (error) {
        console.log("Error:", error);
    }
}

start();