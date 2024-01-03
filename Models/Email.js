import mongoose from "mongoose";

const updatedDate = new Date().toLocaleDateString();
const updatedTime = new Date().toLocaleTimeString();
const date = updatedDate +" "+ updatedTime;
  

const EmailSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId, ref: "User",
    },
    inbox:[{
        from: String,
        sender_name: String,
        subject: String,
        date: String,
        content: String,
        starred: {type: Boolean, default: false},
        important: {type: Boolean, default: false},
        attachments: String,
    }],

    sentMsg: [{
        to: String,
        receiver_name: String,
        subject: String,
        date: String,
        content: String,
        starred: {type: Boolean, default: false},
        important: {type: Boolean, default: false},
        attachments: String,
    }],

    draftMsg: [{
        to: String,
        subject: String,
        date: String,
        content: String,
        starred: {type: Boolean, default: false},
        important: {type: Boolean, default: false},
        attachments: String,
    }],

    trashMsg:[{
        from: String,
        sender_name:String,
        receiver_name:String,
        to: String,
        subject: String,
        content: String,
        date: String,
        attachment: String,
        starred:{
            type:Boolean,
            default:false
        },
        important:{
            type:Boolean,
            default:false
        },
        timestamp: {
            type: Date,
            default: Date.now
        }
    }]
});
const Email = new mongoose.model("Email", EmailSchema);
export {Email}
export {date}