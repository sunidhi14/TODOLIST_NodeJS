var express = require('express');
var cors = require('cors');
var mongo = require('mongodb');
var bodyParser = require('body-parser');
var path = require('path');

var app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname,"public")));

app.set('views', path.join(__dirname, 'views'));

var list=[];
var url = "mongodb://localhost:127.0.0.1:27017/mydata";
var connectionOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}

mongo.MongoClient.connect(url, connectionOptions, (err, client) => {
    if (err) {
        console.log("cannot connect to mongodb server");
        return;
    }

    console.log("connected successfully to mongodb");

    var mydb = client.db("mydata");

var usern='';
var list=[];

app.get("/",(req,res)=>{
    
    res.status(200).sendFile(path.join(__dirname,"login.html"));
})

app.post("/Login",(req,res)=>{
 usern={
     username:req.body.username
 }
        
    
    mydb.collection("collection").find(req.body).count().then(result=>{
             if(result>0){
                 console.log(req.body.username);
                      res.status(200).send();
             }
             else{
                 res.status(500).send();
             }
        
        })
            
                
    
            .catch(error => {
                console.log(error);
                res.status(500).send();
            })


        })


app.post("/Add",(req,res)=>{
    
mydb.collection('todolist').insertOne(req.body, (err, result) => {
    if (err) {
        res.status(500).send();
        return;
    }
   
    console.log("inserted");
    res.status(200).send();
    
    
})
})



app.post("/Del",(req,res)=>{
    
mydb.collection('todolist').deleteOne(req.body, (err) => {
    if (err) {
        res.status(500).send();
        return;
    }
   
    console.log('deleted');
    res.status(200).send();
 
    

})
})

app.post("/Signup",(req,res)=>{
    if(req.body.username === undefined){
        res.status(401).send("Please enter username");
        return;
    }
    var usernameM={
        username:req.body.username
    }
    mydb.collection("collection").find(usernameM).count().then(result=>{
        if(result>0){
            res.status(201).send();
        }
        else{
            mydb.collection('collection').insertOne(req.body, (err, result) => {
               
               
                console.log("inserted");
                res.status(200).send("done");
            })
        }
    })
})
                

            





app.get("/to-do-list",(req,res)=>{
    res.status(200).sendFile(path.join(__dirname,"to-do-listClient.html"))
})



app.listen(8071);
})