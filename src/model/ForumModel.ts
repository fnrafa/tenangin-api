import {Comment, CommentLike, Story, StoryLike} from '@prisma/client';
import Model from "@/model/Model";

class StoryModel extends Model {
    public static async createStory(data: {
        text: string,
        anonymous: boolean,
        userId: string,
        medias: string[]
    }): Promise<Story> {
        try {
            const story = await this.prisma.story.create({
                data: {
                    text: data.text,
                    anonymous: data.anonymous,
                    userId: data.userId,
                },
            });

            if (data.medias.length > 0) {
                await this.prisma.storyMedia.createMany({
                    data: data.medias.map((url) => ({
                        storyId: story["id"],
                        url: url,
                        alt: '',
                    })),
                });
            }
            return story;
        } catch (error) {
            this.handleError(error);
            throw error;
        }
    }

    public static async likeStory(userId: string, storyId: string): Promise<StoryLike> {
        try {
            return await this.prisma.storyLike.create({
                data: {
                    userId,
                    storyId,
                },
            });
        } catch (error) {
            this.handleError(error);
            throw error;
        }
    }

    public static async commentOnStory(userId: string, storyId: string, text: string): Promise<Comment> {
        try {
            return await this.prisma.comment.create({
                data: {
                    userId,
                    storyId,
                    text,
                },
            });
        } catch (error) {
            this.handleError(error);
            throw error;
        }
    }

    public static async likeComment(userId: string, commentId: string): Promise<CommentLike> {
        try {
            return await this.prisma.commentLike.create({
                data: {
                    userId,
                    commentId,
                },
            });
        } catch (error) {
            this.handleError(error);
            throw error;
        }
    }

    public static async getAllStories(): Promise<Story[]> {
        try {
            return await this.prisma.story.findMany({
                where: {
                    deletedAt: null,
                },
                include: {
                    user: true,
                    medias: true,
                    likes: true,
                    comments: true,
                },
            });
        } catch (error) {
            this.handleError(error);
            throw error;
        }
    }

    public static async getStoryById(id: string): Promise<Story> {
        try {
            return await this.prisma.story.findUniqueOrThrow({
                where: {
                    id,
                },
                include: {
                    user: true,
                    medias: true,
                    likes: true,
                    comments: true,
                },
            });
        } catch (error) {
            this.handleError(error);
            throw error;
        }
    }

    public static async checkStoryLike(userId: string, storyId: string): Promise<StoryLike | null> {
        return this.prisma.storyLike.findUnique({
            where: {
                userId_storyId: {
                    userId,
                    storyId,
                },
            },
        });
    }

    public static async checkCommentLike(userId: string, commentId: string): Promise<CommentLike | null> {
        return this.prisma.commentLike.findUnique({
            where: {
                userId_commentId: {
                    userId,
                    commentId,
                },
            },
        });
    }

    public static async getCommentById(commentId: string): Promise<Comment> {
        return this.prisma.comment.findUniqueOrThrow({
            where: {id: commentId},
        });
    }
}

export default StoryModel;
