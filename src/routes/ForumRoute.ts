import {Router} from 'express';
import ForumController from "@/controller/ForumController";
import ForumValidation from "@/validation/ForumValidation";
import auth from "@/middleware/Auth";

class ForumRoute {
    private static router = Router();

    public static route(): Router {
        this.router.post('/', auth.authorize(), ForumValidation.postForum(), ForumController.postForum);
        this.router.post('/like', auth.authorize(), ForumValidation.likeForum(), ForumController.likeStory);
        this.router.post('/comment/', auth.authorize(), ForumValidation.commentForum(), ForumController.commentStory);
        this.router.post('/comment/', auth.authorize(), ForumValidation.likeCommentForum(), ForumController.likeComment);
        this.router.get('/', auth.authorize(), ForumController.getAllStories);
        this.router.get('/:id', auth.authorize(), ForumController.getStoryById);

        return this.router;
    }
}

export default ForumRoute;
