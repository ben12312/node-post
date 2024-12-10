import { Request, Response } from "express";
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient(); // MODEL
import { EventDTO } from "../dto/event.dto";
import { plainToClass } from 'class-transformer';

export default class EventController {
    static async getEvents(req: Request, res: Response) {
        const { id, limit, page } = req.query;
        let posts: any = [];
        let take: any = 20;
        let skip: any = 0;
        let temp: any = page;
        if (limit && limit !== "undefined") take = limit;
        if (page && page !== "undefined") skip = (+take * +temp);

        if (id) {
            posts = await prisma.post.findUnique({ where: { id: +id }});
        } else {
            posts = await prisma.post.findMany({
                include: { user: true }, take: +take, skip: +skip
            });
        }
        const postResponseDTO = plainToClass(EventDTO, posts, { excludeExtraneousValues: true });
        res.status(200).json({ message: "Get posts success", data: postResponseDTO });
    }

    static async insertEvents(req: Request, res: Response) {
        const { title, content, published, userId } = req.body;
        
        try {
            let newPost = { title, content, published: +published ? true : false, userId: +userId };
            await prisma.post.create({ data: newPost });
            res.status(200).json({ message: "Success Create Post" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    static async updateEvents(req: Request, res: Response) {
        const { id, title, content, published, userId } = req.body;
        
        try {
            let updatePost: any = {};
            if (title) updatePost.title = title;
            if (content) updatePost.content = content;
            if (published) updatePost.published = +published ? true : false;
            if (userId) updatePost.userId = +userId;
            await prisma.post.update({ where: {
                id: +id
            }, data: updatePost });
            res.status(200).json({ message: "Success Update Post" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    static async deleteEvents(req: Request, res: Response) {
        const { id } = req.body;
        try {
            await prisma.post.delete({ where: { id: +id }});
            res.status(200).json({ message: "Success Delete Post" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
}