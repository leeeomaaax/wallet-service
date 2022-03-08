import { ApolloServer, gql } from "apollo-server-express"
import { create } from "domain"
import { createWallet } from "../../../../modules/wallet/useCases/wallet/createWallet"
import { addFundsToWallet } from "../../../../modules/wallet/useCases/wallet/addFundsToWallet"
import { subtractFundsFromWallet } from "../../../../modules/wallet/useCases/wallet/subtractFundsFromWallet"
import { getWalletByOwnerId } from "../../../../modules/wallet/useCases/wallet/getWalletByOwnerId"
import { getTransactionsByOwnerId } from "../../../../modules/wallet/useCases/wallet/getTransactionsByOwnerId"

const typeDefs = gql`
  #   scalar DateTime

  #   enum PostFilterType {
  #     POPULAR
  #     NEW
  #   }

  type Transaction {
    type: String!
    value: Int!
    description: String!
  }

  type Wallet {
    ownerId: String!
    balance: Int!
    transactions: [Transaction!]!
  }

  type Query {
    healthcheck: Healthcheck
    wallet(ownerId: String): Wallet!
    #   postBySlug(slug: String): Post

    #   userGetCurrentUser: User
    #   userGetUserByUserName(username: String!): User
    # userLogout()
    # userRefreshAccessToken()
    # userCreateUser()
    # userDeleteUser()
  }

  #   type UserLoginSuccess {
  #     accessToken: String!
  #     refreshToken: String!
  #   }
  #   type UserLoginSuccess {
  #     accessToken: String!
  #     refreshToken: String!
  #   }

  type Generic {
    message: String!
  }

  type Success {
    message: String!
  }

  type Error {
    message: String!
  }

  #   union UserLoginResponse = UserLoginSuccess | Error

  union WalletCreateResponse = Success | Error

  type Mutation {
    createWallet(ownerId: String!): Generic
    addFundsToWallet(ownerId: String!, value: Int!): Generic
    subtractFundsFromWallet(ownerId: String!, value: Int!): Generic
    #     userLogin(username: String!, password: String!): UserLoginResponse!
    #     userCreate(
    #       email: String!
    #       username: String!
    #       password: String!
    #     ): UserCreateResponse!
  }

  #   type User {
  #     username: String!
  #     isEmailVerified: Boolean
  #     isAdminUser: Boolean
  #     isDeleted: Boolean
  #   }

  #   type Member {
  #     memberId: String
  #     reputation: Int
  #     user: User
  #   }

  #   enum PostType {
  #     text
  #     link
  #   }

  #   type Post {
  #     slug: String
  #     title: String
  #     createdAt: DateTime
  #     memberPostedBy: Member
  #     numComments: Int
  #     points: Int
  #     text: String
  #     link: String
  #     type: PostType
  #   }
  type Healthcheck {
    status: String
  }
`

const graphQLServer = new ApolloServer({
  //   context: ({ req }) => ({
  //     userClaims: middleware.getClaims(req.headers["authorization"]),
  //   }),
  typeDefs,
  resolvers: {
    // DateTime: GraphQLDateTime,
    Mutation: {
      //   userLogin: async (parent, args, context) => {
      //     const { username, password } = args
      //     try {
      //       const result = await loginUseCase.execute({ username, password })
      //       if (result.isLeft()) {
      //         return result.value.errorValue()
      //       } else {
      //         return result.value.getValue()
      //       }
      //     } catch (err) {
      //       return { message: err.toString() }
      //     }
      //   },
      createWallet: async (parent, args, context) => {
        const { ownerId } = args
        try {
          const result = await createWallet.execute({
            ownerId,
          })
          if (result.isLeft()) {
            return result.value.errorValue()
          } else {
            return {
              message: result.value.getValue(),
            }
          }
        } catch (err) {
          return { message: err.toString() }
        }
      },
      addFundsToWallet: async (parent, args, context) => {
        const { ownerId, value } = args
        try {
          const result = await addFundsToWallet.execute({
            ownerId,
            value,
          })
          if (result.isLeft()) {
            return result.value.errorValue()
          } else {
            return {
              message: result.value.getValue(),
            }
          }
        } catch (err) {
          return { message: err.toString() }
        }
      },
      subtractFundsFromWallet: async (parent, args, context) => {
        const { ownerId, value } = args
        try {
          const result = await subtractFundsFromWallet.execute({
            ownerId,
            value,
          })
          if (result.isLeft()) {
            return result.value.errorValue()
          } else {
            return {
              message: result.value.getValue(),
            }
          }
        } catch (err) {
          return { message: err.toString() }
        }
      },
    },
    Wallet: {
      transactions: async (wallet, args, context) => {
        const { ownerId } = wallet
        console.log("ereee")
        try {
          const result = await getTransactionsByOwnerId.execute({
            ownerId,
          })
          if (result.isLeft()) {
            return result.value.errorValue()
          } else {
            return result.value.getValue()
          }
        } catch (err) {
          return { message: err.toString() }
        }
      },
    },
    Query: {
      healthcheck: () => ({
        status: "ok",
      }),
      wallet: async (parent, args, context) => {
        const { ownerId } = args
        try {
          const result = await getWalletByOwnerId.execute({
            ownerId,
          })
          if (result.isLeft()) {
            return result.value.errorValue()
          } else {
            return result.value.getValue()
          }
        } catch (err) {
          return { message: err.toString() }
        }
      },
      //   userGetCurrentUser: async (parent, args, context) => {
      //     console.log(args)
      //     console.log(context.userClaims)
      //     return { username: "hi" }
      //   },
      //   posts: async (parent, args, context) => {
      //     let response
      //     const suppliedFilterType = args.hasOwnProperty("filterType")

      //     if (!suppliedFilterType) {
      //       throw new Error("Need to supply filter type")
      //     }

      //     switch (args.filterType) {
      //       case "POPULAR":
      //         response = await getPopularPosts.execute({})
      //         break
      //       case "NEW":
      //         response = await getRecentPosts.execute({})
      //         break
      //       default:
      //         throw new Error("Valid filtertypes are NEW and POPULAR.")
      //     }

      //     if (response.isRight()) {
      //       const postDetails = response.value.getValue()
      //       return postDetails.map(PostDetailsMap.toDTO)
      //     } else {
      //       throw response.value
      //     }
      //   },
    },
  },
})

export { graphQLServer }
