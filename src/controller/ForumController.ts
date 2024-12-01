import { Request, Response as EResponse } from 'express';
import Response from '@/config/Response';
import StoryModel from '@/model/ForumModel';
import Multer from '@/config/Multer';

class ForumController {
    public static async postForum(req: Request, res: EResponse): Promise<void> {
        const user = res.locals.user;
        const { text, anonymous } = req.body;

        const allowedFormats = [".jpg", ".jpeg", ".png", ".svg"];
        const mediaUrls = await Multer.storeFile(req, res, allowedFormats);

        const storyData: any = {
            text,
            anonymous: anonymous || false,
            userId: user.id,
            medias: mediaUrls ? mediaUrls : [],
        };

        const story = await StoryModel.createStory(storyData);
        Response.Success(res, "Story created successfully", story);
    }

    public static async likeStory(req: Request, res: EResponse): Promise<void> {
        const user = res.locals.user;
        const { storyId } = req.body;

        const story = await StoryModel.getStoryById(storyId);
        const existingLike = await StoryModel.checkStoryLike(user.id, story.id);
        if (existingLike) {
            throw new Error("You already liked this story.");
        }

        const like = await StoryModel.likeStory(user.id, story.id);
        Response.Success(res, "Story liked successfully", like);
    }

    public static async commentStory(req: Request, res: EResponse): Promise<void> {
        const user = res.locals.user;
        const { storyId, text } = req.body;

        const story = await StoryModel.getStoryById(storyId);
        const comment = await StoryModel.commentOnStory(user.id, story.id, text);
        Response.Success(res, "Comment added successfully", comment);
    }

    public static async likeComment(req: Request, res: EResponse): Promise<void> {
        const user = res.locals.user;
        const { commentId } = req.body;

        const comment = await StoryModel.getCommentById(commentId);
        const existingLike = await StoryModel.checkCommentLike(user.id, comment.id);
        if (existingLike) {
            throw new Error("You already liked this comment.");
        }

        const like = await StoryModel.likeComment(user.id, comment.id);
        Response.Success(res, "Comment liked successfully", like);
    }

    public static async getAllStories(req: Request, res: EResponse): Promise<void> {
        const stories = await StoryModel.getAllStories();
        Response.Success(res, "All stories fetched successfully", stories);
    }

    public static async getStoryById(req: Request, res: EResponse): Promise<void> {
        const { id } = req.params;
        const story = await StoryModel.getStoryById(id);
        Response.Success(res, "Story fetched successfully", story);
    }
}

export default ForumController;
