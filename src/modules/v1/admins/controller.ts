import { Request, Response, NextFunction } from "express"
import AdminService from "./service";
import { catchError, success } from "../../common/utils";
import { hashPassword, matchPassword } from "../../common/hashings";

export const create = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const admin = await new AdminService().create({ ...req.body, password: hashPassword(req.body.password) })
        return res.status(201).json(success('Admin created successfully', admin))
    } catch (error) {
        next(error);
    }
}

export const login = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { email, password } = req.body;
    try {
        const admin = await new AdminService('', email).findOne(true);
        if (!admin) throw catchError('Invalid user', 400);

        const isMatch = matchPassword(password, admin.password as string);

        if (!isMatch) throw catchError("Incorrect passowrd", 400);

        const token = {}

        return res.status(200).json(
            success('Login successfully', { admin }, token)
        )

    } catch(error) {
        next(error);
    }
}
