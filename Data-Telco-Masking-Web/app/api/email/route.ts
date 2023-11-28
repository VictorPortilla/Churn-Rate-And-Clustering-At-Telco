import { NextResponse } from "next/server"
import { sendEmail } from "@/app/lib/email";

export const GET = async (req:any,res:any) =>{
    try{   
        const { searchParams } = new URL(req.url)
        const to = searchParams.get('to')
        const subject = searchParams.get('subject')
        const text = searchParams.get('text')
        const attachments = searchParams.get('attachments')
       
    
        const list = to==undefined?"":Array.isArray(to) ? to : [to];
        
        if(attachments !==null){
            for (const i of list){
                await sendEmail({
                    to: i,
                    subject: subject==undefined?"":subject,
                    text:text==undefined?"":text,
                    attachments: [{filename:"AttachmentFile.png", href:attachments==undefined?"":attachments}]
                  });
            }
        }else{
            for (const i of list){
                await sendEmail({
                    to: i,
                    subject: subject==undefined?"":subject,
                    text:text==undefined?"":text,
                  });
            }
        }
        
    
        
    
        return NextResponse.json({ message: 200 });
    }catch (error){
        return NextResponse.json({ message: 400 });
    }
}