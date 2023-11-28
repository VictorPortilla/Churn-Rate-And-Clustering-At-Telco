import { NextResponse } from "next/server"
import { sendEmail } from "@/app/lib/email";
import BecodeLogo from '/public/BecodeLogo.png'
import twilio from 'twilio';



const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);


// Función para enviar un mensaje de WhatsApp
export async function GET(req:any,res:any){
    try{

        const { searchParams } = new URL(req.url)
        const to = searchParams.get('to')
        const text = searchParams.get('text')
        const urlImage = searchParams.get('urlImage')

        if (!to) {
            return res.status(400).json({ message: 'No numbers provided' });
        }
      
          const arrayNumeros = to.split(',').map(numero => numero.trim());
      
          if (arrayNumeros.length === 0) {
            return res.status(400).json({ message: 'No valid numbers provided' });
        }
            
        

        
        const promises = arrayNumeros.map(async (numero) => {
          if(urlImage !== null){
            const result = await client.messages.create({
              mediaUrl: [`${urlImage}`],
              body: text || 'Promos increibles',
              from: 'whatsapp:+14155238886',
              to: `whatsapp:+${numero}`
            });
            console.log(`Mensaje enviado a ${numero}: ${result.sid}`);
            return `Mensaje enviado a ${numero}: ${result.sid}`;
          }else{
            const result = await client.messages.create({
              
              body: text || 'Promos increibles',
              from: 'whatsapp:+14155238886',
              to: `whatsapp:+${numero}`
            });
            console.log(`Mensaje enviado a ${numero}: ${result.sid}`);
            return `Mensaje enviado a ${numero}: ${result.sid}`;
          }
            
      
            
          });
      
          // Espera a que se completen todas las promesas antes de responder
          await Promise.all(promises);
      
          return NextResponse.json({message:`200`})
          
            
        }catch (error) {
            return NextResponse.json({message:'Error sending message'},{status:400})
         }
    
    
    
    
    
    
    
    
    
};


