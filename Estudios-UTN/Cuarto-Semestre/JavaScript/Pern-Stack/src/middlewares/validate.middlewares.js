import { Schema } from "zod/v3";

export const validateSchema = (Schema) => async (req, res, next) => {
    try {
        await Schema.parse(req.body)
        next()
    } catch (error) {
        console.log(error)
        if (Array.isArray(error.errors)) {
            return res.status(400).json(error.errors.map((error) => error.message))
        }
    }
}