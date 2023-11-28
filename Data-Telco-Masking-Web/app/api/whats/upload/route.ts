import { NextResponse } from "next/server"
import fs from 'fs'
import FormData from 'form-data'
import axios from 'axios'

import twilio from 'twilio';
import { NextApiRequest } from "next";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const apiKey = process.env.TWILIO_API_KEY;
const apiSecret = process.env.TWILIO_API_SECRET;
const serviceSid = 'ZS1a31703d813c3d3a149751c0316a7c34';
let assetSid = 'ZHaaa40c0eab3b098fa5a5d8ed1f3a8fef';
let versionAssetSid=""
let buildSid = "";
let urlF="";

const client = twilio(accountSid, authToken);

export async function POST(req:any,res:any){
    
    try{
        const test = await req.json()

        

// Obtener la imagen en formato base64 desde el objeto JSON
        const imagenDeJson = test.imagen;
        console.log(` prueba ${imagenDeJson}`)
        const parts = imagenDeJson.split(",");
        const contentType = parts[0].split(":")[1].split(";")[0]; // Obtiene el tipo de contenido
        const base64Data = parts[1];

        const buffer = Buffer.from(base64Data, 'base64');

    // Crear un nombre de archivo único (puedes personalizar esto según tus necesidades)
    const fileName = `imagen${Date.now()}.${contentType.split('/')[1]}`;
        
        await fs.writeFileSync(`./public/${fileName}`, buffer);

    // Escribir el archivo en el sistema de archivos del servidor
    

    


        await client.serverless.v1.services(serviceSid)
        .assets
        .create({friendlyName: 'putImage'})
        .then(asset => assetSid=asset.sid);
        console.log(`asset ${assetSid}`)

        const serviceUrl = `https://serverless-upload.twilio.com/v1/Services/${serviceSid}`;
        const uploadUrl = `${serviceUrl}/Assets/${assetSid}/Versions`;
        const form = new FormData();
        form.append('Path', `public/${fileName}`);
        form.append('Visibility', 'public');
        await form.append('Content', fs.createReadStream(`public/${fileName}`), {
        contentType: 'image/png',
        });
        await axios
        .post(uploadUrl, form, {
            auth: {
            username: apiKey==undefined?"":apiKey,
            password: apiSecret==undefined?"":apiSecret,
            },
            headers: form.getHeaders(),
        })
        .then((response) => {
            const newVersionSid = response.data.sid;
            console.log(newVersionSid);
            versionAssetSid = newVersionSid;
            urlF = response.data.url;
            console.log(newVersionSid);
            console.log(` urlF ${urlF}`)
        });

        

        await client.serverless.v1.services(serviceSid)
        .builds
        .create({
            assetVersions: [versionAssetSid]
            })
        .then(build => buildSid=build.sid);
        console.log(`build 0 ${buildSid}`)

        

        await client.serverless.v1.services(serviceSid)
        .builds(buildSid)
        .buildStatus()
        .fetch()
        .then(build_status => console.log(build_status.status));
        
        await new Promise(resolve => setTimeout(resolve, 20000));

        await client.serverless.v1.services(serviceSid)
        .builds(buildSid)
        .buildStatus()
        .fetch()
        .then(build_status => console.log(build_status.status));
        
        const error = await client.serverless.v1.services(serviceSid)
                    .environments("ZE98f276d3153a162d21b3d2534a1ccc3b")
                    .deployments
                    .create({buildSid: buildSid})
                    .then(deployment => console.log(deployment.sid));
                    
            
            
        return NextResponse.json({urlF:`https://imagestelco-8705-stage.twil.io/public/${fileName}`})
        


    }catch(error){
        return NextResponse.json({message:error},{status:400})
    }

}