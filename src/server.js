const express = require('express')
const app = express()
var db=require("./db.js")

const port = 3000

//Przyjmowanie requestów logowania
app.get('/login/', (req, res) => {
  console.log(`Użytkownik ${req.query.email} loguje się`)
  db.getUser(req.query.email,req.query.password,(user)=>{
    if(user==null){
      res.json({resp:"err"})
    }else if(user.dataRegistered){
      res.json({resp:"ok"})
    }else{
      res.json({resp:"ok_data"})
    }
  })
})

//Przyjmowanie requestów rejestracji
app.get('/register/', (req, res) => {
  console.log(`Użytkownik ${req.query.email} rejestruje się`)
  db.registerNewUser(req.query.email,req.query.password,(resp)=>{
    if(resp=="OK"){
      res.json({resp:"ok"})
    }else{
      res.json({resp:"exist"})
    }
  })
})

//Załadowywanie danych o użytkowniku
app.get("/get_data/",(req,res)=>{
  db.getUser(req.query.email,req.query.password,(user)=>{
    if(user==null){
      res.json({resp:"err"})
    }else{
      res.json({resp:user})
    }
  })
})

//Klient może zapisywać dane
app.get("/set_data/",(req,res)=>{
  var user=JSON.parse(req.query.user)
  db.setUser(user,(resp)=>{
    res.json({resp})
  })
})

//Nasłuchiwanie
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
