const fs = require('fs');

//Funkcja generująca losowy ciąg znaków (uuidv4)
function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

//Funkcja załadowująca wszystkich użytkowników
function loadUsers(callback){
  var result={};
  var loadFolder=`${__dirname}/userdb/`;
  fs.readdir(loadFolder, (err, files) => {
    var filesToLoad=[]
    files.forEach(file => {
      filesToLoad.push(file)
    });
    if(filesToLoad.length==0){
      callback({})
      return
    }
    var loadedFiles=0;
    for(var i=0;i<filesToLoad.length;i++){
      var file=filesToLoad[i];
      var uuid=file.split(".")[0]
      var filePath=loadFolder+file;
      ((filePath,uuid)=>{
        fs.readFile(filePath,'utf8',function (err,data){
          result[uuid]=JSON.parse(data);
          loadedFiles++;
          if(loadedFiles==filesToLoad.length){
            callback(result)
          }
        });
      })(filePath,uuid)
    }
  });
}

//Funkcja szukająca użytkownika
function findUser(email,callback){
  var war=true;
  loadUsers((users)=>{
    Object.keys(users).forEach((uuid)=>{
      var user=users[uuid];
      if(user.email==email && war){
        callback(users[uuid])
        war=false
      }
    })
    if(war){
      callback(null)
    }
  })
}

function getUser(email,password,callback){
  findUser(email,(user)=>{
    if(user==null || user.password!=password){
      callback(null)
    }else{
      callback(user)
    }
  })
}

function setUser(user){
  fs.writeFileSync(`${__dirname}/userdb/${user.uuid}.json`,JSON.stringify(user,null,4));
}

//Rejestracja nowego użytkownika
function registerNewUser(email,password,callback){
  findUser(email,(user)=>{
    if(user!=null){
      callback("EXIST")
    }else{
      var data={
        dataRegistered:false,
        email,
        password,
        uuid:uuidv4(),
        userInfo:{
          name:"",
          surname:"",
          age:0,
          type:""
        }
      }
      setUser(data)
      callback("OK")
    }
  })
}

module.exports={
  registerNewUser,
  getUser,
  setUser
}
