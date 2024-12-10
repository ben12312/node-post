import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient(); // MODEL
import { UserDTO } from '../dto/user.dto';
import { plainToClass } from 'class-transformer';

export default class UserController {
    static async getUsers(req: Request, res: Response) {
        const { id,limit,page } = req.query;
        let users: any = [];
        let take: any = 20;
        let skip: any = 0;
        let temp: any = page;
        if (limit && limit !== "undefined") take = limit;
        if (page && page !== "undefined") skip = (+take * +temp);

        if (id) {
            users = await prisma.user.findUnique({ where: { id: +id }});
        } else {
            users = await prisma.user.findMany({ take: +take, skip: +skip });
        }
        const userResponseDTO = plainToClass(UserDTO, users, { excludeExtraneousValues: true });
        res.status(200).json({ message: "Get user success", data: userResponseDTO });
    }

    static async register(req: Request, res: Response) {
        const { email, name, password } = req.body;
        
        try {
            let user = await prisma.user.findUnique({ where: { email }});
            
            if (!user) {
                let newUser = { email, name, password: await bcrypt.hash(password, 10) };
                const userDTO = plainToClass(UserDTO, newUser, { excludeExtraneousValues: true });
                await prisma.user.create({ data: userDTO });
                res.status(200).json({ message: "Success Register" });
            } else res.status(400).json({ message: "Email already used" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    static async login(req: Request, res: Response) {
        const { email, password } = req.body;
        try {
            const user = await prisma.user.findUnique({ where: { email } });
            if (!user) res.status(404).json({ message: "User not found" });
            else {
                if (user.password) {
                    const passwordMatch = await bcrypt.compare(password, user.password);
                    if (!passwordMatch) res.status(401).json({ message: "Invalid password" })
                    else {
                        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!);
                        res.json({ message: "Success Login", data: token });
                    }
                } else res.status(400).json({ message: "Password needed" });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

}
