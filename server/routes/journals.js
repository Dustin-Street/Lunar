import mongoose from "mongoose";
import Journal from '../schema/journal.js';
import express from 'express';
import database from "../database/connection.js";
import User from '../schema/user.js'
import Error from '../schema/error.js'
import axios from 'axios'

const router = express.Router();

//Journal
router.get('/journalEntry', async (req, res, next) => {
    try {
        const { page = 1, limit = 100 } = req.query;
        const options = {
            page: parseInt(page, 10),
            limit: parseInt(limit, 10),
            sort: { createdAt: -1 }
        };
        const result = await Journal.paginate({}, options);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
});

router.post('/createJournal', async (req, res, next) => {
    try {
        const { title, userID } = req.body;
        console.log('Creating journal for userID:', userID, 'with title:', title);

        const newJournal = new Journal({ title: title, userID: userID });

        const savedJournal = await newJournal.save();

        // Add the new journal to the user's journals array
        await User.findByIdAndUpdate(userID, { $push: { journals: savedJournal._id } });

        res.status(201).json(savedJournal);

    } catch (error) {
        next(error);
    }
});
//get journals //http://localhost:5050/journals/user/${userID}
router.get('/user/:userId', async (req, res, next) => {
    try {
        const { userId } = req.params;
        console.log('Fetching journals for userID:', userId);

        const user = await User.findById(userId).populate("journals");
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ docs: user.journals, journalTitle: user.journals.title });
    } catch (error) {
        next(error)
    }
})
//edit
router.put('/:id', async (req, res, next) => {
    const { id } = req.params;
    const { title } = req.body;
    console.log(`hit route - ID :${id} with title of ${title}`)
    try {

        const updatedJournal = await Journal.findByIdAndUpdate(
            id,
            {title : title},
            { new: true }
        )
        console.log(`${updatedJournal} -> being sent to client`)

        if (!updatedJournal) {
            return res.status(404).json({ message: "Journal not found" });
        }

        res.status(200).json(updatedJournal);


    } catch (error) {
        next(error)
    }
})


//`http://localhost:5050/journals/journals/${journalId}`
router.delete('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const deletedJournal = await Journal.findByIdAndDelete(id);
        await User.updateMany({ journals: id }, { $pull: { journals: id } });
        if (!deletedJournal) {
            return res.status(404).json({ error: 'Journal not found', success: false });
        }
        res.status(200).json({ message: 'Journal deleted successfully', success: true });
    } catch (error) {
        next(error);
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const journal = await Journal.findById(id);
        if (!journal) {
            return res.status(404).json({ message: 'No journals found' });
        }
        res.status(200).json(journal);
    } catch (error) {
        next(error);
    }
});





export default router;