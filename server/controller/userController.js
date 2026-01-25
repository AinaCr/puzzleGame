import con from '../config/db.js';





export const creatUser=(req,res)=>{
    console.log("requte recus")
    const {name,email} = req.body

    if(!name || !email){
        return res.status(400).json({message:"champ incomplete"})
    }

    const sql= "INSERT INTO Users(pseudo,email) VALUES(?, ?)"
    con.query(sql,[name,email],(err,result)=>{
        if(err){
            return res.status(500).json({message:err.message})
        }
        res.status(201).json({message:"utilisateur ajouter",id:result.insertId})
    })
}

export const updateUser=(req,res)=>{
    console.log("requete recus")
    const {oldName,newName} = req.body

    if(!oldName){
        return res.status(400).json({message:"nouveau nom incomplete"})
    }

    const sql="UPDATE Users SET pseudo = ? WHERE pseudo = ?"
    con.query(sql,[newName,oldName],(err,result)=>{
        if(err){
            return res.status(500).json({message:err.message})
        }
        res.status(201).json({message:"nom d'utilisateur modifier"})
    })
}

export const removePub=(req,res)=>{
    const {post}=req.body

    if(!post) return res.status(400).json({message:"champ incomplete"})
        
    const sql="DELETE FROM Post WHERE postID = ?"

    con.query(sql,[post],(err)=>{
        if(err) return res.status(500).json({message:err.message}) 
        
        console.log("supprimer")
        res.status(200).json({message:"pub supprimer"})
    })
    
    
}


export const searchMail=(req,res)=>{
    console.log("requte GET recus")
    const {email} = req.query
    console.log(`requte GET ${email}`)

    if(!email){
            return res.status(400).json({message:"champ incomplete"})
    }

    const sql = "SELECT * FROM Users WHERE email = ?"

    con.query(sql,[`${email}`],(err,result)=>{
        if(err){
            console.log('on est la')
            return res.status(500).json({message:err.message})   
        }

        if(result.length===0){
            console.log('on est dans lethg')
            return res.status(404).json({message:"utilisateur introuvable"})
        }
        res.status(200).json(result[0])
        console.log("applaudissement")
    })
}


export const getID=(req,res)=>{
    const {name} = req.query
    console.log("requete get recus:",name)
    const sql = "SELECT userID,admins FROM Users WHERE pseudo = ?"

    con.query(sql,[`${name}`],(err,result)=>{
        if(err)return res.status(500).json({message:"erreur ici sur sql"})
        
        if(result.length===0)return res.status(404).json({message:"utilisateur introuvable"})
        
        res.status(200).json(result[0])
        console.log("terminer")
    })
}


 export const addReact=(req,res)=>{
    const {post,users}=req.body
    console.log(`add    post= ${post} et user ==${users}`)

    const sql="UPDATE Post SET reactCount = reactCount + 1 WHERE PostID = ?"

    con.query(sql,[post],(err)=>{
        if(err){
        res.status(500).json({message:err.message})
        }

        const sqlReact ="UPDATE Reaction SET react = true WHERE postID = ? AND userID = ?"

        con.query(sqlReact,[post,users],(err)=>{
            if(err)return res.status(500).json({message:err.message})
        })

        res.status(201).json({message:"reaction mis a jour"})
    })
}

export const reduceReact=(req,res)=>{
    const {post,users}=req.body
    console.log(`red   post= ${post} et user ==${users}`)

    const sql="UPDATE Post SET reactCount = reactCount - 1 WHERE PostID = ?"

    con.query(sql,[post],(err)=>{
        if(err){
            return res.status(500).json({message:err.message})
        }

        const sqlReact ="UPDATE Reaction SET react = false WHERE postID = ? AND userID = ?"
        
        con.query(sqlReact,[post,users],(err)=>{
            if(err)return res.status(500).json({message:err.message})
        })
        res.status(201).json({message:"reaction mis a jour"})
    })
}


export const getReact=(req,res)=>{
    const {post}=req.query
    console.log(`getCount   pst = ${post}`)

    const sql = "SELECT reactCount FROM Post WHERE postID =?"

    con.query(sql,[post],(err,result)=>{
        if(err){
            return res.status(500).json({message:err.message})
        }

        if(result.length===0){
            console.log('on est dans lethg')
            return res.status(404).json({message:"utilisateur introuvable"})
        }

        res.status(200).json(result[0])
        console.log("reaction terminer")
    })
}

export const getLike=(req,res)=>{
    const {post,users}=req.query
    console.log(`getLike   pst = ${post} users=${users}`)

    const sql = "SELECT react FROM Reaction WHERE postID =? AND userID =?"

    con.query(sql,[post,users],(err,result)=>{
        if(err){
            return res.status(500).json({message:err.message})
        }

        if(result.length===0){
            console.log('on est dans lethg')
            return res.status(404).json({message:"utilisateur introuvable",react:0})
        }

        res.status(200).json(result[0])
        console.log("reaction terminer")
    })
}


export const createReact=(req,res)=>{
    const {idUser,post}=req.body
    if(!idUser || !post) return res.status(400).json({message:"id et post non recuperer"})

    const sql=`INSERT INTO Reaction(userID,postID) VALUE (?, ?)`

    con.query(sql,[idUser,post],(err)=>{
        if(err) {
            return res.status(500).json({message:err.message})
        }

        res.status(201).json({message:"nouveau reaction ajouter"})
        console.log("create react fini")
    })
}


export const sendReact=(req,res)=>{
    const {idUser}=req.body
    if(!idUser) return res.status(400).json({message:"id non recuperer"})

    const sql=`INSERT INTO Reaction(userID,postID) SELECT userID,postID FROM Post WHERE userID = ${idUser} ORDER BY postID DESC LIMIT 1`

    con.query(sql,[idUser],(err,result)=>{
        if(err) {
            return res.status(500).json({message:err.message})
        }

        res.status(201).json({message:"reaction ajouter"})
    })
}

export const clash=(req,res)=>{
    const {id,score,chalenge}=req.body
    console.log(`id=${id} ||| score=${score} ||| chalenge=${chalenge}`)

    const sql="INSERT INTO Partie(userID, score,difficulte) VALUES(?, ?, ?)"

    con.query(sql,[id,score,chalenge],(err,result)=>{
        if(err)return  res.status(500).json({message:"erreur du requete sql"})

        res.status(200).json({message:"operation avec succer"})
    })
}


export const easyClash=(req,res)=>{
    const sql="SELECT u.pseudo,p.gameID, p.score, p.difficulte FROM Partie p JOIN Users u ON p.userID= u.userID WHERE p.difficulte='easy' AND  p.gameID=(SELECT min(gameID) FROM Partie WHERE userID = p.userID AND difficulte = 'easy'AND score=(SELECT MIN(score) FROM Partie WHERE userID = p.userID AND difficulte = 'easy'))"
    
    con.query(sql,(err,result)=>{
        if(err)return  res.status(500).json({message:"erreur de recupration des donnesur sql",err})

        if(result.length===0)return res.status(404).json({message:"classement introuvable"})

        res.status(200).json(result)
        console.log("clash terminer")
    })
}


export const normalClash=(req,res)=>{
    const sql="SELECT u.pseudo,p.gameID, p.score, p.difficulte FROM Partie p JOIN Users u ON p.userID= u.userID WHERE p.difficulte='normal' AND  p.gameID=(SELECT min(gameID) FROM Partie WHERE userID = p.userID AND difficulte = 'normal'AND score=(SELECT MIN(score) FROM Partie WHERE userID = p.userID AND difficulte = 'normal'))"
    
    con.query(sql,(err,result)=>{
        if(err)return  res.status(500).json({message:"erreur de recupration des donnesur sql",err})

        if(result.length===0)return res.status(404).json({message:"classement introuvable"})

        res.status(200).json(result)
        console.log("clash terminer")
    })
}


export const hardClash=(req,res)=>{
    const sql="SELECT u.pseudo,p.gameID, p.score, p.difficulte FROM Partie p JOIN Users u ON p.userID= u.userID WHERE p.difficulte='hard' AND  p.gameID=(SELECT min(gameID) FROM Partie WHERE userID = p.userID AND difficulte = 'hard'AND score=(SELECT MIN(score) FROM Partie WHERE userID = p.userID AND difficulte = 'hard'))"
    
    con.query(sql,(err,result)=>{
        if(err)return  res.status(500).json({message:"erreur de recupration des donnesur sql",err})

        if(result.length===0)return res.status(404).json({message:"classement introuvable"})

        res.status(200).json(result)
        console.log("clash terminer")
    })
}

export const post=(req,res)=>{
    const sql= `SELECT Users.pseudo, Post.image, Post.postID,Post.userID FROM Users INNER JOIN Post ON Users.userID = Post.userID ORDER BY RAND()`

      con.query(sql,(err,result)=>{
        if(err)return res.status(500).json({message:"erreur ici sur sql"})

        if(result.length===0)return res.status(404).json({message:"utilisateur introuvable"})

        res.status(200).json(result)
        console.log("post envoyer")
      })
}


export const uploads=(req,res)=>{
  try{
    const meta=JSON.parse(req.body.meta);
    const id =meta.id
    const fileName=req.file.filename
    console.log('id=',id)
    console.log('fileNmae=',fileName)

    const sql="INSERT INTO Post(userID,image) VALUES(?,?)"

    con.query(sql,[id,fileName],(err,result)=>{
      if(err){
        console.log("erreur dans l'injection des donner")
        return res.status(500).json({message:`erreur:${err.message}`})
      }

      console.log("image ajouter")

      return res.status(201).json({
        message:"image ajouter a la base de dooner",
        nameFile:fileName
      })
    })
  }catch(err){
    return res.status(500).json({message:err.message})
  }
}