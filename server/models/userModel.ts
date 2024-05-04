import mongoose, { Document, Model, Schema } from "mongoose";

const emailRegex:RegExp= /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
interface IUser extends Document{
    name: string;
    email:string;
    password:string;
    avatar:{
        url:string;
        id:string;
    }
    role:string;
    isVerified:boolean;
    courses:Array<{courseId:string}>;
    comparePassword:(password:string)=>Promise<boolean>
}

const userSchema:Schema<IUser>=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type: String,
        unique: true,
        validate:{
            validator:function(value:string){
                return emailRegex.test(value);
            }
        }
    },
    password:{
        type:String,
        required:true,
        minlength:6,
        select:false
    },
    avatar:{
        url:String,
        id:String
    },
    role:{
        type:String,
        default:"user"
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    courses:[
        {
             courseId:String
        }
    ]
},{timestamps:true})

const User=mongoose.model<IUser>("User",userSchema);
export default User;