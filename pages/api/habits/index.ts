import {NextApiRequest, NextApiResponse} from "next";
import dbConnect from "../../../lib/dbConnect";
import HabitModels from "../../../models/HabitModel";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    await dbConnect();
    const {
        query: {id},
        method,
    } = req;

    switch (method) {
        case "GET":
            try {
                const habits = await HabitModels.find(
                    {}
                ); /* find all the data in our database */
                res.status(200).json({success: true, data: habits});
            } catch (error) {
                res.status(400).json({success: false});
            }
            break;
        case "POST":
            try {
                const habit = await HabitModels.create(
                    req.body
                ); /* create a new model in the database */
                res.status(201).json({success: true, data: habit});
            } catch (error) {
                res.status(400).json({success: false});
            }
            break;

        default:
            res.status(400).json({success: false});
            break;
    }
}
