import { Prisma } from "../../generated/prisma";
import { ApiError } from "../../utils/api-error";
import { PaginationQueryParams } from "../pagination/dto/pagination.dto";
import { PrismaService } from "../prisma/prisma.service";
import { GetBlogsDTO } from "./dto/get-blogs.dto";

export class BlogService {
  private prisma: PrismaService;
  constructor() {
    this.prisma = new PrismaService();
  }

  getBlogs = async (query: GetBlogsDTO) => {
    const { take, page, sortBy, sortOrder, search } = query;

    const whereCluse: Prisma.BlogWhereInput = {};

    if (search) {
      whereCluse.title = { contains: search, mode: "insensitive" };
    }

    const blogs = await this.prisma.blog.findMany({
      where: whereCluse,
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * take,
      take: take,
      include: { user: { omit: { password: true } } }, // join ke table user
    });

    const total = await this.prisma.blog.count({ where: whereCluse });

    return {
      data: blogs,
      meta: { page, take, total },
    };
  };

  getBlogBySlug = async (slug: string) => {
    const blog = await this.prisma.blog.findFirst({
      where: { slug },
    });

    if (!blog) {
      throw new ApiError("blog not found", 404);
    }
    return blog;
  };
}
