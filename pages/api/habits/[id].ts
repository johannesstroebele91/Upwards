import {NextApiRequest, NextApiResponse} from "next";
import dbConnect from "../../../lib/dbConnect";
import HabitModels from "../../../models/HabitModel";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const {
        query: {id},
        method,
    } = req;

    await dbConnect();

    switch (method) {
        case "GET" /* Get a model by its ID */
        :
            try {
                const habit = await HabitModels.findById(id);
                if (!habit) {
                    return res.status(400).json({success: false});
                }
                res.status(200).json({success: true, data: habit});
            } catch (error) {
                res.status(400).json({success: false});
            }
            break;

        case "PUT" /* Edit a model by its ID */
        :
            try {
                const habit = await HabitModels.findByIdAndUpdate(id, req.body, {
                    new: true,
                    runValidators: true,
                });
                if (!habit) {
                    return res.status(400).json({success: false});
                }
                res.status(200).json({success: true, data: habit});
            } catch (error) {
                res.status(400).json({success: false});
            }
            break;

        case "DELETE" /* Delete a model by its ID */
        :
            try {
                const deletedHabit = await HabitModels.deleteOne({_id: id});
                if (!deletedHabit) {
                    return res.status(400).json({success: false});
                }
                res.status(200).json({success: true, data: {}});
            } catch (error) {
                res.status(400).json({success: false});
            }
            break;

        default:
            res.status(400).json({success: false});
            break;
    }
}
