import { findUsers } from "../services/userService.js";

export const getUsers = async (req, res) => {
    try {
        const users = await findUsers()
        res.status(200).send(users)
    } catch (error) {
        res.status(500).send(error)
    }
}