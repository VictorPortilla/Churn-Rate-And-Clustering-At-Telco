import { NextResponse } from "next/server";

    export async function sendEmail(body:string,file:any){
        const emails = ["misaelch.v16@gmail.com","exemptedrope03@hotmail.com","A01655080@tec.mx","A01659759@tec.mx"];
        //const emails = ["exemptedrope03@hotmail.com"];
        try {
          // Construye la URL de la API con los parámetros necesarios
          const to = emails.join(",");
          const subject = "Promocion";
          const text = body;
          let url;
          
          if (file !== undefined){
            const jsonData = { imagen: file };
          const responseUpIm = await fetch("/api/whats/upload", {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(jsonData)
            
          });
          const jsonResponseUPIM = await responseUpIm.json()
          console.log(`yei ${jsonResponseUPIM.urlF}`)
          const urlFImage = jsonResponseUPIM.urlF;

            url = `/api/email?to=${encodeURIComponent(to)}&subject=${encodeURIComponent(subject)}&text=${encodeURIComponent(text)}&attachments=${encodeURIComponent(urlFImage)}`;
          }else{
            url = `/api/email?to=${encodeURIComponent(to)}&subject=${encodeURIComponent(subject)}&text=${encodeURIComponent(text)}`;
          }
          
    
          // Realiza la solicitud a la API
          const response = await fetch(url, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          const data = await response.json();
          console.log(`response caall ${ data.message}`)
          
          if (data.message === 200){
            return 200;
          }else{
            return 400;
          }
        } catch (error) {
          return 400;
        }
    }



  export async function sendWhats(body:string, file:any){
    const numbers = ["5215548665974","5219994428499","5215516770224","5215561093820"]
    //const numbers = ["5215548665974"]
    try{
      const to = numbers.join(',')
      const text = body;
      let url;
      
      console.log(`file -> ${file}`)
      if (file !== undefined){
      const jsonData = { imagen: file };
      
      const responseUpIm = await fetch("/api/whats/upload", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jsonData)
        
      });
    
      const jsonResponseUPIM = await responseUpIm.json()
      console.log(`yei ${jsonResponseUPIM.urlF}`)
      const urlFImage = jsonResponseUPIM.urlF;
      url = `/api/whats?to=${encodeURIComponent(to)}&text=${encodeURIComponent(text)}&urlImage=${encodeURIComponent(urlFImage)}`

    }else{
      url = `/api/whats?to=${encodeURIComponent(to)}&text=${encodeURIComponent(text)}`

    }

      const responseSendT = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await responseSendT.json();
          console.log(`response caall ${data.message}`)
          
          if (data.message === "200"){
            return 200;
          }else{
            return 400;
          }
    } catch (error) {
      console.error('Error enviando el email:', error);
    }
    }
    




