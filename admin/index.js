const express = require('express')
const session = require("express-session")
const app = express()
const port = 2000

// local imports 
require('./db/mongo')
const User = require('./models/user')
const Project = require('./models/project')
const IntrestLog = require('./models/intrest')
const Admin = require('./models/admin')
const Banner = require('./models/banner')

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: "Thisisecratekey"
}))

// let userLogin = null

const convertBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);

    fileReader.onload = () => {
      resolve(fileReader.result);
    };

    fileReader.onerror = (error) => {
      reject(error);
    };
  });
};


app.use(express.static("public"));
app.set('view engine', 'ejs')


app.get('/logout', (req, res) => {
  req.session.destroy()
  res.redirect('/login')
})

app.get('/login', (req, res) => {
  req.session.user == undefined ? res.render('login') : res.redirect('/');
})


app.post('/logindb', (req, res) => {
  Admin.findOne({ email: req.body.email, password: req.body.password }).then(async (data) => {
    if (data != null) {

      let userLogin = { id: data._id, email: data.email, password: data.password }

      req.session.user = userLogin;
      req.session.save();

      res.redirect('/')
    }
    else {
      res.redirect('/login?e=1')
    }
  })
})


// project route

app.get('/', async (req, res) => {
  
  let { page } = req.query
  page = parseInt(page)
  let size = 10

  if(!page){
    page = 1
  }

  const limit = parseInt(size)
  const skip  = (page - 1) * size
 
  console.log(req.query);
  const  count = await Project.count()
  const  data = await Project.find().sort({ "project_id": -1 }).limit(limit).skip(skip)

  let next = 2
  let prev = 1

  if(page && page>1){
     next =  page+1    
  }
  if(page && page > 2 ){
      prev = page - 1    
  }

  if(parseFloat(count/10).toFixed(1) < page  ){
      next = 1 
  }

  await req.session.user != undefined ?  res.render('projects',{data,count,next,prev}) : res.redirect('/login');

})

app.post('/getprojects/:id', async (req, res) => {

})


app.get('/promote/:action/:id', async (req, res) => {
  if (req.session.user != undefined) {
    if (req.params.action == "promote") {
      await Project.updateOne({ _id: req.params.id }, { promoted: "1" })
    }
    if (req.params.action == "unpromote") {
      await Project.updateOne({ _id: req.params.id }, { promoted: "0" })
    }
    res.redirect('/')
  } else {
    res.redirect('/login')
  }
})

app.get('/approve/:action/:id', async (req, res) => {
  if (req.session.user != undefined) {
    if (req.params.action == "approve") {
      await Project.updateOne({ _id: req.params.id }, { approved: "1" })
    }
    if (req.params.action == "reject") {
      await Project.updateOne({ _id: req.params.id }, { approved: "0" })
    }
    res.redirect('/')
  } else {
    res.redirect('/login')
  }
})

app.get('/delete/:id', async (req, res) => {
  if (req.session.user != undefined) {
    await Project.deleteOne({ _id: req.params.id })
    res.redirect('/?action=deleted')
  } else {
    res.redirect('/login')
  }
})


app.get('/addproject', (req, res) => {
  req.session.user != undefined ? res.render('addproject') : res.redirect('/login');
})


app.get('/editproject/:id', async (req, res) => {
  const data = await Project.findOne({ "project_id": req.params.id })
  console.log(data);
  req.session.user != undefined ? res.render('editproject', { data }) : res.redirect('/login');
})

// banner


app.get('/banner', async (req, res) => {
  const data = await Banner.find()
  req.session.user != undefined ? res.render('banner', { data }) : res.redirect('/login');
})


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})