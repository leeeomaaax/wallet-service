import express from "express"
import { middleware } from "../../../../../shared/infra/http"
import { createPostController } from "../../../useCases/wallet/createWallet"
import { getRecentPostsController } from "../../../useCases/wallet/getRecentPosts"
import { getPostBySlugController } from "../../../useCases/wallet/getPostBySlug"
import { getPopularPostsController } from "../../../useCases/wallet/getPopularPosts"
import { upvotePostController } from "../../../useCases/wallet/upvotePost"
import { downvotePostController } from "../../../useCases/wallet/downvotePost"

const postRouter = express.Router()

postRouter.post("/", middleware.ensureAuthenticated(), (req, res) =>
  createPostController.execute(req, res)
)

postRouter.get(
  "/recent",
  middleware.includeDecodedTokenIfExists(),
  (req, res) => getRecentPostsController.execute(req, res)
)

postRouter.get(
  "/popular",
  middleware.includeDecodedTokenIfExists(),
  (req, res) => getPopularPostsController.execute(req, res)
)

postRouter.get("/", middleware.includeDecodedTokenIfExists(), (req, res) =>
  getPostBySlugController.execute(req, res)
)

postRouter.post("/upvote", middleware.ensureAuthenticated(), (req, res) =>
  upvotePostController.execute(req, res)
)

postRouter.post("/downvote", middleware.ensureAuthenticated(), (req, res) =>
  downvotePostController.execute(req, res)
)

export { postRouter }
