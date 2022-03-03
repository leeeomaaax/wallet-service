export interface PostDTO {
  slug: string
  title: string
  createdAt: string | Date
  numComments: number
  points: number
  text: string
  link: string
  wasUpvotedByMe: boolean
  wasDownvotedByMe: boolean
}
