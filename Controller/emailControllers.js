import { Email } from "../Models/Email.js";
import { User } from "../Models/Users.js";
import {date} from "../Models/Email.js"

//Compose function
export const Compose = async (req, res)=>{
    try {
        const {to} = req.body;
        const CheckUser = await User.findOne({email: to});
        const sender= await User.findOne({email:req.user.email});
       
        if(CheckUser&&sender){
            await Email.findOneAndUpdate({user:CheckUser._id}
                ,{$push:{inbox:{...req.body,date:date,sender_name:CheckUser.name,from:CheckUser.email}}},
                { upsert: true, new: true });
       
                //storing mail in sender send box
            await Email.findOneAndUpdate({user:sender._id}
                   ,{$push:{sentMsg:{...req.body,date:date,receiver_name:CheckUser.name,from:CheckUser.email}}},
                   { upsert: true, new: true });
                  
                    res.status(201).json({meassage:"mail send"});
            }else{
             res.status(404).send("unable to find user")
            }
    } catch (error) {
        res.status(400).json({
            error: "Error Occured in Sending"
        })
    }
};

//Inbox function
export const Inbox = async (req, res)=>{
    try {
        const checkUser = await Email.findOne({user: req.user._id}).populate('inbox');
        if(checkUser){
            res.status(200).json({
                message: checkUser.inbox
            })
        }
    } catch (error) {
        res.status(400).json({
            error: "Error Occured"
        })
    }
};

//Getting Outbox message function
export const OutboxMsg = async (req, res)=>{
    try {
        const getMsg = await Email.findOne({user: req.user._id});
        if(getMsg){
            const out = getMsg.sentMsg
            res.status(200).json({
                message: out
            })
        }
    } catch (error) {
        res.status(400).json({
            error: "Error Occured"
        })
    }
};

//Starred Message function
export const MarkStarredMsg = async (req, res) => {
    try {
        const {msgId} = req.query;
        const getMsg = await Email.findOne({
            $or:[
                {inbox: {$elemMatch: {_id: msgId}}},
                {sentMsg: {$elemMatch: {_id: msgId}}},
                {draftMsg: {$elemMatch: {_id: msgId}}}
            ]
        });
        if(getMsg){
            const findInboxMsg = getMsg.inbox.find(msg => msg._id == msgId);
            const findSentMsg = getMsg.sentMsg.find(msg => msg._id == msgId);
            const findDraftMsg = getMsg.draftMsg.find(msg => msg._id == msgId);

        if(findInboxMsg){
            findInboxMsg.starred = !findInboxMsg.starred;
        } else if (findSentMsg){
            findSentMsg.starred = !findSentMsg.starred;
        }else if (findDraftMsg){
            findDraftMsg.starred = !findDraftMsg.starred;
        }    
        await getMsg.save();

        res.status(200).send("Marking Starred message");
        }else{
            res.status(404).send("No starred message available");
        }
    } catch (error) {
        res.status(400).json({
             error
    })
}
};

//Important message function
export const MarkImportantMsg = async (req, res) => {
    try {
        const {msgId} = req.query;
        const getMsg = await Email.findOne({
            $or:[
                {inbox: {$elemMatch: {_id: msgId}}},
                {sentMsg: {$elemMatch: {_id: msgId}}},
                {draftMsg: {$elemMatch: {_id: msgId}}}
            ]
        });
        if(getMsg){
            const findInboxMsg = getMsg.inbox.find(msg => msg._id == msgId);
            const findSentMsg = getMsg.sentMsg.find(msg => msg._id == msgId);
            const findDraftMsg = getMsg.draftMsg.find(msg => msg._id == msgId);

        if(findInboxMsg){
            findInboxMsg.important = !findInboxMsg.important;
        } else if (findSentMsg){
            findSentMsg.important = !findSentMsg.important;
        }else if (findDraftMsg){
            findDraftMsg.important = !findDraftMsg.important;
        }    

        await getMsg.save();
        res.status(200).send("Marked as Important message");
        }else{
            res.status(404).send("Error while marking Important message");
        }
    } catch (error) {
        res.status(400).json({
            error: "Error Occured"   
    })
}
};

//Delete message function
export const DeleteMsg = async (req, res) => {
    try {
        const {msgId} = req.query;
        const checkMsg = await Email.findOne({$or: [
            { inbox: { $elemMatch: { _id: msgId } } },
            { sentMsg: { $elemMatch: { _id: msgId } } },
            { draftMsg: { $elemMatch: { _id: msgId } } }
        ]});
    
         if(checkMsg) {
         let deletedMsg;
       
            if(checkMsg.inbox.some((msg)=>msg._id==msgId)){
            deletedMsg=checkMsg.inbox.find((msg)=>msg._id==msgId);
            checkMsg.inbox.pull(msgId);
            checkMsg.trashMsg.push(deletedMsg);
            checkMsg.save();
            return res.status(200).send("message deleted");
            }
            else if(checkMsg.sentMsg.some((msg)=>msg._id==msgId)){
            deletedMsg=checkMsg.sentMsg.find((msg)=>msg._id==msgId);
            checkMsg.sentMsg.pull(msgId);
            checkMsg.trashMsg.push(deletedMsg);
            checkMsg.save();
            return  res.status(200).json({
            message: "Message deleted Successfully"});
            }
            else if(checkMsg.draftMsg.some((msg)=>msg._id==msgId)){    
            deletedMsg=checkMsg.draftMsg.find((msg)=>msg._id==msgId);
            checkMsg.draftMsg.pull(msgId);
            checkMsg.trashMsg.push(deletedMsg);
            checkMsg.save();
            return res.status(200).send("message deleted");
             }
            else {
            res.status(404).json({ message: "Message not found" });
            }
        }
     } catch (error) {
        res.status(400).json({
        error: "Internal Error Occured"
       })
    }
};

// Saving Draft message function
export const SaveDraft = async (req, res) => {
    try {
        const {to,subject, content} = req.body;
            if(to || subject || content){
            const checkReciver=await Email.findOneAndUpdate({user:req.user._id}
            ,{$push:{draftMsg:{...req.body, date:date}}},
            { upsert: true, new: true });
        
            res.status(200).json({
            message: "Draft Saved successfully"})
            }else{
                res.status(400).json({
                message: "No Input"})
              }
    } catch (error) {
        res.status(400).json({
            error: "Internal Error Occured"})
       }
   };

//Getting Draft message function
export const GetDraft = async (req, res)=>{
    try {
        const checkUser = await Email.findOne({user: req.user._id}).populate('draftMsg');
            if(checkUser){
            res.status(200).json({
                message: checkUser.draftMsg
            })
        }
    } catch (error) {
        res.status(400).json({
            error: "Error Occured"
        })
    }
};

//Getting Trash message function
export const TrashBin = async (req, res) => {
    try {
        const checkUser = await Email.findOne({user: req.user._id});
        if(checkUser){
            res.status(200).json({
                message: checkUser.trashMsg
            })
        }
    } catch (error) {
        res.status(400).json({
            error: "Error Occured"
        })
    }
};

//Read a Starred Messages
export const GetStarredMsg = async (req, res) => {
    try {
        const CheckMsg = await Email.aggregate([
            {
            $match:{user:req.user._id}
             },
            {   
             $project: {
                checkMsg: {
                   $concatArrays: [
                     {
                        $filter: {
                            input: '$inbox',
                            as: 'email',
                            cond: {$eq: ['$$email.starred', true]},
                         },
                        },
                        {
                        $filter: {
                            input: '$sentMsg',
                            as: 'email',
                            cond: {$eq: ['$$email.starred', true]},
                         },
                        },
                        {
                        $filter: {
                            input: '$draftMsg',
                            as: 'email',
                            cond: {$eq: ['$$email.starred', true]},
                         },
                        },
                      ],
                    },
                },
            },
        ])
    const filteredStarredMsg = CheckMsg.filter(msg => msg.checkMsg.some(msg => msg.starred));
    res.status(200).json({filteredStarredMsg});

    } catch (error) {
        res.status(400).json({
            error: "Error Occured"
        })
    }
};

//Read a Important Messages
export const GetImportantMsg = async (req, res) => {
    try {
        const CheckMsg = await Email.aggregate([
            {
              $match:{user:req.user._id}
                },
            {
                $project: {
                    checkMsg: {
                        $concatArrays: [
                        {
                         $filter: {
                            input: '$inbox',
                            as: 'email',
                            cond: {$eq: ['$$email.important', true]},
                         },
                        },
                        {
                        $filter: {
                            input: '$sentMsg',
                            as: 'email',
                            cond: {$eq: ['$$email.important', true]},
                         },
                        },
                        {
                        $filter: {
                            input: '$draftMsg',
                            as: 'email',
                            cond: {$eq: ['$$email.important', true]},
                         },
                        },
                      ],
                    },
                },
            },
        ])
    const filteredImpMsg = CheckMsg.filter(msg => msg.checkMsg.some(msg => msg.important));
    res.status(200).json({filteredImpMsg});

    } catch (error) {
        res.status(400).json({
            error: "Error Occured"
        })
    }
};

//Clear TrashBin messages
export const DelateTrashMsg = async (req,res) => {
    try {
        const {msgId}=req.query;
        const checkTrash=await Email.findOne({user:req.user._id});
        
      if(checkTrash){
         const deletedMsg=checkTrash.trashMsg.some((message)=>message._id==msgId);
          if(deletedMsg){
           checkTrash.trashMsg.pull({_id:msgId});
            await checkTrash.save();
            return res.status(202).send("message deleted successfully");
          }else{
              return res.status(404).send("unable to find the message");
          }       
      }else{
     return res.status(404).send("unable to find user");     
  }
  } catch (error) {
    console.log(error);
    return res.status(500).send("internal error");   
  }
  }