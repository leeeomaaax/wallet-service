import { IWalletRepo } from "../walletRepo"
import { Wallet } from "../../domain/wallet"
import { Transaction } from "../../domain/transaction"
import { WalletMap } from "../../mappers/walletMap"
import { TransactionMap } from "../../mappers/transactionMap"
import { Result } from "../../../../shared/core/Result"
import { UniqueEntityID } from "../../../../shared/domain/UniqueEntityID"

import { PrismaClient, Prisma } from "@prisma/client"

const prisma = new PrismaClient()

export class WalletRepo implements IWalletRepo {
  private prisma: PrismaClient

  constructor(prisma: PrismaClient) {
    this.prisma = prisma
  }

  public async save(wallet: Wallet): Promise<Result<void>> {
    try {
      await this.prisma.wallet.create({ data: WalletMap.toPersistence(wallet) })
      return Result.ok<void>()
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        // The .code property can be accessed in a type-safe manner
        return Result.fail<void>(`Prisma client error: ${e.code}`)
      } else {
        return Result.fail<void>(`Prisma error`)
      }
    }
  }

  public async getWalletByOwnerId(
    ownerId: UniqueEntityID
  ): Promise<Result<Wallet>> {
    try {
      const raw = await prisma.wallet.findUnique({
        where: { ownerId: ownerId.toString() },
      })
      return Result.ok<Wallet>(WalletMap.toDomain(raw).getValue()) //TODO do not assume toDomain will work
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        return Result.fail<Wallet>(`Prisma client error: ${e.code}`)
      } else {
        return Result.fail<Wallet>(`Prisma error`)
      }
    }
  }

  public async getWalletTransactions(
    walletId: UniqueEntityID
  ): Promise<Result<Transaction[]>> {
    try {
      const raw = await prisma.transaction.findMany({
        where: { ownerId: walletId.toString() },
      })
      return Result.ok<Transaction[]>(
        raw.map((t) => TransactionMap.toDomain(t).getValue())
      ) //TODO do not assume toDomain will work
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        return Result.fail<Transaction[]>(`Prisma client error: ${e.code}`)
      } else {
        return Result.fail<Transaction[]>(`Prisma error`)
      }
    }
  }

  // getWalletByOwnerId(ownerId: UniqueEntityID): Promise<Wallet>
  // getWalletTransactions(walletId: UniqueEntityID): Promise<Transaction[]>

  // private createBaseQuery(): any {
  //   const models = this.models
  //   return {
  //     where: {},
  //     include: [],
  //   }
  // }

  // private createBaseDetailsQuery(): any {
  //   const models = this.models
  //   return {
  //     where: {},
  //     include: [
  //       {
  //         model: models.Member,
  //         as: "Member",
  //         include: [{ model: models.BaseUser, as: "BaseUser" }],
  //       },
  //     ],
  //     limit: 15,
  //     offset: 0,
  //   }
  // }

  // public async getPostByPostId(postId: PostId | string): Promise<Post> {
  //   postId = postId instanceof PostId ? (<PostId>postId).id.toString() : postId
  //   const PostModel = this.models.Post
  //   const detailsQuery = this.createBaseQuery()
  //   detailsQuery.where["post_id"] = postId
  //   const post = await PostModel.findOne(detailsQuery)
  //   const found = !!post === true
  //   if (!found) throw new Error("Post not found")
  //   return PostMap.toDomain(post)
  // }

  // public async getNumberOfCommentsByPostId(
  //   postId: PostId | string
  // ): Promise<number> {
  //   postId = postId instanceof PostId ? (<PostId>postId).id.toString() : postId

  //   const result = await this.models.sequelize.query(
  //     `SELECT COUNT(*) FROM comment WHERE post_id = "${postId}";`
  //   )
  //   const count = result[0][0]["COUNT(*)"]
  //   return count
  // }

  // public async getPostDetailsBySlug(
  //   slug: string,
  //   offset?: number
  // ): Promise<PostDetails> {
  //   const PostModel = this.models.Post
  //   const detailsQuery = this.createBaseDetailsQuery()
  //   detailsQuery.where["slug"] = slug
  //   const post = await PostModel.findOne(detailsQuery)
  //   const found = !!post === true
  //   if (!found) throw new Error("Post not found")
  //   return PostDetailsMap.toDomain(post)
  // }

  // public async getRecentPosts(
  //   memberId?: MemberId,
  //   offset?: number
  // ): Promise<PostDetails[]> {
  //   const PostModel = this.models.Post
  //   const detailsQuery = this.createBaseDetailsQuery()
  //   detailsQuery.offset = offset ? offset : detailsQuery.offset

  //   if (!!memberId === true) {
  //     detailsQuery.include.push({
  //       model: this.models.PostVote,
  //       as: "Votes",
  //       where: { member_id: memberId.id.toString() },
  //       required: false,
  //     })
  //   }

  //   const posts = await PostModel.findAll(detailsQuery)
  //   return posts.map((p) => PostDetailsMap.toDomain(p))
  // }

  // public async getPopularPosts(
  //   memberId?: MemberId,
  //   offset?: number
  // ): Promise<PostDetails[]> {
  //   const PostModel = this.models.Post
  //   const detailsQuery = this.createBaseDetailsQuery()
  //   detailsQuery.offset = offset ? offset : detailsQuery.offset
  //   detailsQuery["order"] = [["points", "DESC"]]

  //   if (!!memberId === true) {
  //     detailsQuery.include.push({
  //       model: this.models.PostVote,
  //       as: "Votes",
  //       where: { member_id: memberId.id.toString() },
  //       required: false,
  //     })
  //   }

  //   const posts = await PostModel.findAll(detailsQuery)
  //   return posts.map((p) => PostDetailsMap.toDomain(p))
  // }

  // public async getPostBySlug(slug: string): Promise<Post> {
  //   const PostModel = this.models.Post
  //   const detailsQuery = this.createBaseQuery()
  //   detailsQuery.where["slug"] = slug
  //   const post = await PostModel.findOne(detailsQuery)
  //   const found = !!post === true
  //   if (!found) throw new Error("Post not found")
  //   return PostMap.toDomain(post)
  // }

  // public async exists(postId: PostId): Promise<boolean> {
  //   const PostModel = this.models.Post
  //   const baseQuery = this.createBaseQuery()
  //   baseQuery.where["post_id"] = postId.id.toString()
  //   const post = await PostModel.findOne(baseQuery)
  //   const found = !!post === true
  //   return found
  // }

  // public delete(postId: PostId): Promise<void> {
  //   const PostModel = this.models.Post
  //   return PostModel.destroy({ where: { post_id: postId.id.toString() } })
  // }

  // private saveComments(comments: Comments) {
  //   return this.commentRepo.saveBulk(comments.getItems())
  // }

  // private savePostVotes(postVotes: PostVotes) {
  //   return this.postVotesRepo.saveBulk(postVotes)
  // }

  // public async save(post: Post): Promise<void> {
  //   const PostModel = this.models.Post
  //   const exists = await this.exists(post.postId)
  //   const isNewPost = !exists
  //   const rawSequelizePost = await PostMap.toPersistence(post)

  //   if (isNewPost) {
  //     try {
  //       await PostModel.create(rawSequelizePost)
  //       await this.saveComments(post.comments)
  //       await this.savePostVotes(post.getVotes())
  //     } catch (err) {
  //       await this.delete(post.postId)
  //       throw new Error(err.toString())
  //     }
  //   } else {
  //     // Save non-aggregate tables before saving the aggregate
  //     // so that any domain events on the aggregate get dispatched
  //     await this.saveComments(post.comments)
  //     await this.savePostVotes(post.getVotes())

  //     await PostModel.update(rawSequelizePost, {
  //       // To make sure your hooks always run, make sure to include this in
  //       // the query
  //       individualHooks: true,
  //       hooks: true,
  //       where: { post_id: post.postId.id.toString() },
  //     })
  //   }
  // }
}
