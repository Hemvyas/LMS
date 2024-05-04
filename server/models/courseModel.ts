import mongoose, { Document, Schema } from "mongoose";
interface IReview extends Document{
    user:object;
    rating:number;
    comment:string;
    commentReplies:IComment[];
}

interface IComment extends Document {
  user: object;
  comment: string;
  commentReplies?: IComment[];
}

interface ILink extends Document {
  title:string;
  url:string;
}

interface ICourseData extends Document {
  title: string;
  description: string;
  videoUrl: string;
  videoThumbnail: object;
  videoSection: string;
  videoLength: string;
  links: ILink[];
  suggestion: string;
  questions:IComment[];
}

interface ICourse extends Document {
  name:string;
  description?:string;
  price: number;
  estimatedPrice?:number;
  thumbnail:object;
  reviews:IReview[];
  ratings?:number;
  tags:string;
  level:string;
  demoUrl:string;
  courseData:ICourseData[];
  purchased?:number;
  benefits:{title:string}[];
  prerequisites:{title:string}[];
}

const reviewSchema=new Schema<IReview>({
    user:Object,
    rating:{
        type:Number,
        default:0
    },
    comment:String
});

const linkSchema=new Schema<ILink>({
    title:String,
    url: String
})

const commentSchema = new Schema<IComment>({
  user: Object,
  comment: String,
  commentReplies:[Object]
});

const courseDataSchema = new Schema<ICourseData>({
  title: String,
  description: String,
  videoUrl: String,
  videoThumbnail: Object,
  videoSection: String,
  videoLength: String,
  links: [linkSchema],
  suggestion: String,
  questions:[commentSchema],
});

const courseSchema=new Schema<ICourse>({
  name: String,
  description: String,
  price: Number,
  estimatedPrice: Number,
  thumbnail: {
    id: String,
    url:String
  },
  reviews: [reviewSchema],
  ratings: {
    type:Number,
    default:0
  },
  tags: String,
  level: String,
  demoUrl: String,
  courseData: [courseDataSchema],
  purchased: {
    type:Number,
    default:0
  },
  benefits: [{ title: String }],
  prerequisites: [{ title: String }],
})


const Course=mongoose.model<ICourse>("Course",courseSchema);
export default Course;