import express from "express";
import database from "../database/connection.js";

const router = express.Router()





router.get("/quote", async (req, res) => {


    const api_url = "https://zenquotes.io/api/quotes/random";

    const api_url2 = "https://type.fit/api/quotes"

    let quoteArray = [];

    try {
        //     const response = await axios.get(api_url)
        //      response.data.forEach((element) => {
        //          console.log(`array ${element}`)
        //         const newQuote = new Quote({
        //             text: element.q,
        //             author: element.a
        //        })
        //         quoteArray.push(newQuote)

        let collection = await database.collection('quotes')
        // let result = await collection.insertMany(quoteArray)
        // console.log(result)
        const collections = await collection.find({}).toArray();



        res.json(collections);
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: 'Failed to fetch quotes' });
    }

});


export default router;