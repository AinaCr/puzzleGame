import express from 'express';
import multer from 'multer'  
import { getID,getLike,getReact,post,removePub,clash,creatUser,updateUser,uploads,searchMail,sendReact, addReact,reduceReact,createReact,easyClash,normalClash,hardClash} from '../controller/userController.js';

const router = express.Router();

const storage= multer.diskStorage({
  destination:(req,file,cb)=>{
    cb(null,"uploads/")
  },
  filename:(req,file,cb)=>{
    const nameFile=Date.now() + "-" + file.originalname;
    cb(null,nameFile)
  }
})
const upload=multer({storage})

router.delete("/removePub",removePub)
router.post("/",creatUser)
router.patch("/changeNameUsers",updateUser)
router.get("/search",searchMail)
router.get("/getId",getID)
router.patch("/addReact",addReact)
router.patch("/reduceReact",reduceReact)
router.get("/getReactCount",getReact)
router.get("/getLike",getLike)
router.post("/createReact",createReact)
router.post("/sendReact",sendReact)
router.post("/clash",clash)
router.get("/easyClash",easyClash)
router.get("/normalClash",normalClash)
router.get("/hardClash",hardClash)
router.get("/post",post)
router.post("/uploads",upload.single("file"),uploads)


export default router;