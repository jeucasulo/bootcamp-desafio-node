const express = require("express");
const cors = require("cors");
const {uuid,isUuid} = require('uuidv4'); //8.4K(gziped: 3.4k)

// const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];
const likes = [];

app.get("/", (request, response) => {  
  return response.json({msg:"Server Online"});
});

app.get("/repositories", (request, response) => {  
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const {title,url,techs} = request.body;
  const likes = 0;
  const rep = {
    id : uuid(),title,url,techs,likes  
  }
  repositories.push(rep);
  return response.json(rep);
});

app.put("/repositories/:id", (request, response) => {
  const {id} = request.params;
  if(!isUuid(id)){
    response.status(400).json({"Error":"Id not found"});
  }
  const {title,url,techs} = request.body;    
  const repIndex = repositories.findIndex(rep=>rep.id===request.params.id)
  if(repIndex < 0){
    return response.status(400).json({"Error":"Not Found"})
  }
  const likes =  repositories[repIndex].likes;
  rep = {
    id,title,url,techs,likes
  }
  repositories[repIndex] = rep;
  return response.json(rep);
});

app.delete("/repositories/:id", (req, res) => {
  const {id} = req.params;
  if(!isUuid(id)){
    res.status(400).json({"Error":"Id does not exist"});
  }
  const repIndex = repositories.findIndex(rep=>rep.id===id)
  if(repIndex < 0){
    res.status(400).json({"Msg":"Not found"})
  }
  repositories.splice(repIndex,1); 
  // return res.json({"Msg":"Removed"})
  return res.status(204).json()
});

app.post("/repositories/:id/like", (request, response) => {
  const {id} = request.params;
  const {user_id} = request.body;
  const date = Date.now();
  if(!isUuid(id)){
    return response.status(400).json({"Error":"Rep do not exists"});
  }
  const repIndex = repositories.findIndex(rep => rep.id === id)
  if(repIndex < 0){
    return response.status(400).json({"Error":"Rep not found"});
  }

  const like = {
    user_id,date
  }

  // if(!Array.isArray(repositories[repIndex].likes)){    
  //     repositories[repIndex].likes = [];
  // }
 
  // repositories[repIndex].likes.push(like);
  likes.push(like);
  repositories[repIndex].likes++;
  // console.log(repositories[repIndex].likes);
  
  // return response.json({"likes":repositories[repIndex].length})
  return response.json({"likes":repositories[repIndex].likes})
});

module.exports = app;
