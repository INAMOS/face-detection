const express=require("express");
const router=express.Router();
const imageController=require("../controllers/imageController");
const faceapi=require("face-api.js");
const multer=require("multer");
const path=require("path")
const fs=require("fs");
require("@tensorflow/tfjs-node")
const canvas=require("canvas")
const { Canvas, Image, ImageData } = canvas;

faceapi.env.monkeyPatch({ Canvas, Image, ImageData })

const storage=multer.diskStorage({
    destination:path.join(__dirname,'../public/images'),
    filename:(req,file,cb)=>{
        cb(null,file.originalname)
    }
})

const upload=multer({
    storage,
    dest:path.join(__dirname,'../public/images')
}).single("image")



router.get("/",function(req,res,next){

    res.render("index");

})

router.get("/image",function(req,res,next){
     
    res.render("image")
  
 
 })
 
router.post("/uploadImage",upload,async function(req,res,next){
    
    let name=req.file.filename;

    //Ruta para los modelos 
    let modelRoute=path.join(__dirname,'../public/models');

    //Se cargan asincronamente los algoritmos para detectar los rostros
    await faceapi.nets.ssdMobilenetv1.loadFromDisk(modelRoute)
    await faceapi.nets.faceRecognitionNet.loadFromDisk(modelRoute)
    await faceapi.nets.faceLandmark68Net.loadFromDisk(modelRoute)
    
    //cargamos la imagen con una canvas 
    const img = await canvas.loadImage(path.join(__dirname,`../public/images/${name}`))
    const detections = await faceapi.detectAllFaces(img).withFaceLandmarks()
  
    const out = faceapi.createCanvasFromMedia(img)
    faceapi.draw.drawDetections(out, detections)
    faceapi.draw.drawFaceLandmarks(out, detections.map(res => res.landmarks))
    

    
    try{
        
        //Guardamos la ruta donde vamos a guardar la imagen procesada
        let imgFace=__dirname+'/../public/images/faceDetection.jpg';
        fs.writeFileSync(imgFace, out.toBuffer('image/jpeg'))

        //Enviamos la imagen procesada con el reconocimiento facial
        res.sendFile('faceDetection.jpg',{ root:__dirname+'/../public/images'});
        
        console.log('done, saved results to out/faceDetection.jpg')

    }catch(err){

        console.log(err)

    }
  
 
    

})


module.exports=router;