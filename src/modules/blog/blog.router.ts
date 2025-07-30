import { Router } from "express";
import { BlogController } from "./blog.controller";
import { UploaderMiddleware } from "../../middlewares/uploader.middleware";
import { CreateBlogDTO } from "./dto/create-blog.dto";
import { validateBody } from "../../middlewares/validate.middleware";
import { JwtMiddleware } from "../../middlewares/jwt.middleware";

export class BlogRouter {
  private router: Router;
  private blogController: BlogController;
  private jwtMiddleware: JwtMiddleware;
  private uploaderMiddleware: UploaderMiddleware;
  constructor() {
    this.router = Router();
    this.blogController = new BlogController();
    this.jwtMiddleware = new JwtMiddleware();
    this.uploaderMiddleware = new UploaderMiddleware();
    this.initializedRoutes();
  }

  private initializedRoutes = () => {
    this.router.get("/", this.blogController.getBlogs);
    this.router.get("/:slug", this.blogController.getBlogBySlug);
    this.router.post(
      "/",
      this.jwtMiddleware.verifyToken(process.env.JWT_SECRET!),
      this.uploaderMiddleware
        .upload()
        .fields([{ name: "thumbnail", maxCount: 1 }]),
      validateBody(CreateBlogDTO),
      this.blogController.createBlog
    );
  };

  getRouter = () => {
    return this.router;
  };
}
