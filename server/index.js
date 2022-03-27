const express = require("express");
const jwt = require('jsonwebtoken')
const cors = require("cors")
const fs = require("fs")

// local imports 
require('./db/mongo')
const User = require('./models/user')
const Project = require('./models/project')
const IntrestLog = require('./models/intrest')
const Banner = require('./models/banner');
const { response } = require("express");

// app configurations 
const app = express()

app.use(cors({ origin: "*", methods: ["POST", "GET"] }))
app.use(express.json({ limit: '50mb' }));
app.use('/public', express.static(__dirname + "/public"))


// register route

// app.get('/',async(req,res)  =>{
//     let re = await Project.find()
//     res.setHeader('Content-Type', 'application/json');
//     await res.send("<code>"+re+"</code>")
// })

app.post('/register', (req, res) => {
    const { name, email, password } = req.body
    const user = new User({
        name,
        email,
        password
    });
    user.save().then(async (data) => {
        const token = await jwt.sign({ _user: req.body.email }, "thisisupcomingnftsecreatekeyitshouldlong")
        let email = data.email
        const data_with_token = { email, token, code: 200 }
        res.status(200).send(data_with_token)
    }).catch((e) => {
        res.send(e)
    })
})

// login route

app.post('/login', async (req, res) => {
    await User.findOne({ email: req.body.email }).then(async (data) => {
        if (data != null) {
            if (data.password == req.body.password) {
                const token = await jwt.sign({ _user: req.body.email }, "thisisupcomingnftsecreatekeyitshouldlong")
                let email = data.email
                data_with_token = { email, token, code: 200 }
                res.status(200).send(data_with_token)
            } else {
                res.send({ code: 400, message: "Wrong password" })
            }
        }
        else {
            res.send({ code: 400, message: "Email Not Exist" })
        }
    }).catch(() => {
        res.status(400).send("Invalid Email")
    })

})


// add prject route

app.post('/project', async (req, res) => {
    let p_id =await Project.count();

    let fileRandoName = Date.now()
    const { project_name, logo, logo2, logo3, cost, supply, type, release_date, release_time, description, discord, twitter, website, more_information } = req.body
    let token = req.body.token
    let created_by = req.body.created_by

    try {
        let tokenVerification = jwt.verify(token, "thisisupcomingnftsecreatekeyitshouldlong")
        const project = new Project({
            project_name,
            project_id:p_id,
            logo: fileRandoName + 1 + ".webp",
            logo2: fileRandoName + 2 + ".webp",
            logo3: fileRandoName + 3 + ".webp",
            cost,
            supply,
            release_date,
            release_time,
            release_date_time: release_date + " " + release_time,
            type,
            description,
            discord,
            twitter,
            website,
            more_information,
            created_by
        });

        project.save().then(async (data) => {

            try {
                res.status(200).send({ code: 100, message: "Project Added succesfully" })
                // image upload

                let img = logo
                let imgData = img.replace(/^data:image\/\w+;base64,/, "");
                await fs.writeFile(`public/${fileRandoName + 1}.webp`, imgData, { encoding: 'base64' }, function (err) {
                    console.log('File created');
                });
                img = logo2
                imgData = img.replace(/^data:image\/\w+;base64,/, "");
                await fs.writeFile(`public/${fileRandoName + 2}.webp`, imgData, { encoding: 'base64' }, function (err) {
                    console.log('File created');
                });
                img = logo3
                imgData = img.replace(/^data:image\/\w+;base64,/, "");
                await fs.writeFile(`public/${fileRandoName + 3}.webp`, imgData, { encoding: 'base64' }, function (err) {
                    console.log('File created');
                });
                // image upload
            }
            catch (e) {
                res.send({ code: 0, message: "Failed to add project", e })
            }

        }).catch((e) => {
            res.status(200).send(e)
        })
    }
    catch (e) {
        res.send({ code: 0, message: "User not login", e })
    }
})

// to Add any column to any exsiting collection

// app.get('/abc', async (req,res) => {
//    await Project.updateMany(
//         {},
//         { $set: { 
//             "twitter_count": "0" ,
//             "discord_count": "0" 
//         }},
//         {
//             upsert: false,
//             multi: true
//         }
//     ).then(()=>{
//         res.send("Suucess")
//     })
// })

// app.get('/abc', async (req, res) => {
//     await Project.find().then((data) => {

//         for (let i = 1; i < data.length; i++) {
//             Project.updateOne({ project_name: data[i].project_name }, { project_id: i })
//                 .then((res) => {
//                     console.log(res);
//                 }).catch((e) => {
//                     console.log(e);
//                 })
//         }
//     })

//     await res.send("perfect")
// })



app.post('/updateproject', async (req, res) => {
    let fileRandoName = Date.now()
    let { project_name, logo, logo2, logo3, cost, supply, type, release_date, release_time, description, discord, twitter,twitter_count,discord_count, website, more_information, intrested, logoname, logoname2, logoname3 ,promote,approve, project_name_for_id } = req.body
    let token = req.body.token
    let created_by = req.body.created_by

    if (project_name_for_id.indexOf("&#39;") > -1) {
        project_name_for_id = project_name_for_id.replace("&#39;", "'")
    }

    try {
        let tokenVerification = jwt.verify(token, "thisisupcomingnftsecreatekeyitshouldlong")
        await Project.updateOne({ _id: project_name_for_id }, {
            project_name,
            logo: logoname == '' ? fileRandoName + 1 + ".webp" : logoname,
            logo2: logoname2 == '' ? fileRandoName + 2 + ".webp" : logoname2,
            logo3: logoname3 == '' ? fileRandoName + 3 + ".webp" : logoname3,
            cost,
            supply,
            release_date,
            release_time,
            release_date_time: release_date + " " + release_time,
            type,
            description,
            discord,
            twitter,
            twitter_count,
            discord_count,
            website,
            more_information,
            promoted:promote,
            approved:approve,
            intrested,
            created_by
        }).then(async (data) => {

            try {
                res.status(200).send({ code: 100, message: "Project Added succesfully" })
                // image upload
                if (logo != '') {
                    let img = logo
                    let imgData = img.replace(/^data:image\/\w+;base64,/, "");
                    await fs.writeFile(`public/${fileRandoName + 1}.webp`, imgData, { encoding: 'base64' }, function (err) {
                        console.log('File created');
                    });
                }
                if (logo2 != '') {
                    let img = logo2
                    let imgData = img.replace(/^data:image\/\w+;base64,/, "");
                    await fs.writeFile(`public/${fileRandoName + 2}.webp`, imgData, { encoding: 'base64' }, function (err) {
                        console.log('File created');
                    });
                }
                if (logo3 != '') {
                    img = logo3
                    imgData = img.replace(/^data:image\/\w+;base64,/, "");
                    await fs.writeFile(`public/${fileRandoName + 3}.webp`, imgData, { encoding: 'base64' }, function (err) {
                        console.log('File created');
                    });
                }
                // image upload
            }
            catch (e) {
                res.send({ code: 0, message: "Failed to add project", e })
            }

        }).catch((e) => {
            res.status(200).send(e)
        })
    }
    catch (e) {
        res.send({ code: 0, message: "User not login", e })
    }
    console.log(req.body);
})




app.post('/fetchproject', async (req, res) => {

    let tdate = await new Date()
    // let ttime = await new Date()

    let tdm = await tdate.getUTCMonth() + 1
    if (tdm < 10) {
        tdm = "0" + tdm
    }

    let tdd =  await tdate.getUTCDate()
    if(tdd < 10){
        tdd = "0"+tdd
    }

    let tdh =  await tdate.getUTCHours() 
    if(tdh < 10){
        tdh = "0"+tdh
    }

    let tdmin =  await tdate.getUTCMinutes()
    if(tdmin < 10){
        tdmin = "0"+tdmin
    }

    tdate = await tdate.getUTCFullYear() + "-" + tdm + "-" + tdd + " " +tdh + ":" + tdmin;


    // ttime = await ttime.getUTCHours() + ":" + ttime.getUTCMinutes();
    // ttime.toString()
    tdate = tdate.toString()

    console.log(tdate);

    await Project.find({ type: req.body.type, approved: "1", release_date_time: { $gt: tdate } }).sort({ "release_date_time": 1, "promoted": "1" }).skip(req.body.skip).limit(5).then(async (data) => {
        if (data != null) {
            res.status(200).send(data)
        }
        else {
            res.send({ code: 400, message: "Result Not Found" })
        }
    }).catch(() => {
        res.status(400).send("Invalid request")
    })
})

app.post('/fetchprojectpromoted', async (req, res) => {

    let tdate = await new Date()
    // let ttime = await new Date()

    let tdm = await tdate.getUTCMonth() + 1
    if (tdm < 10) {
        tdm = "0" + tdm
    }
    tdate = await tdate.getUTCFullYear() + "-" + tdm + "-" + tdate.getUTCDate() + " " + tdate.getUTCHours() + ":" + tdate.getUTCMinutes();

    // ttime = await ttime.getUTCHours() + ":" + ttime.getUTCMinutes();
    // ttime.toString()
    tdate = tdate.toString()


    await Project.find({  approved: "1", promoted: "1" }).sort({ "release_date_time": 1, "promoted": "1" }).then(async (data) => {
        if (data != null) {
            res.status(200).send(data)
        }
        else {
            res.send({ code: 400, message: "Result Not Found" })
        }
    }).catch(() => {
        res.status(400).send("Invalid request")
    })
})


app.post('/fetchprojectpast', async (req, res) => {

    let tdate = await new Date()
    // let ttime = await new Date()

    let tdm = await tdate.getUTCMonth() + 1
    if (tdm < 10) {
        tdm = "0" + tdm
    }

    let tdd =  await tdate.getUTCDate()
    if(tdd < 10){
        tdd = "0"+tdd
    }

    let tdh =  await tdate.getUTCHours() 
    if(tdh < 10){
        tdh = "0"+tdh
    }

    let tdmin =  await tdate.getUTCMinutes()
    if(tdmin < 10){
        tdmin = "0"+tdmin
    }

    tdate = await tdate.getUTCFullYear() + "-" + tdm + "-" + tdd + " " +tdh + ":" + tdmin;

    // ttime = await ttime.getUTCHours() + ":" + ttime.getUTCMinutes();
    // ttime.toString()
    tdate = tdate.toString()
    console.log(tdate);


    await Project.find({ type: req.body.type, approved: "1", release_date_time: { $lt: tdate } }).sort({ "release_date_time": 1, "promoted": "1" }).skip(req.body.skip).limit(5).then(async (data) => {
        if (data != null) {
            res.status(200).send(data)
        }
        else {
            res.send({ code: 400, message: "Result Not Found" })
        }
    }).catch(() => {
        res.status(400).send("Invalid request")
    })
})




app.post('/fetchprojectDetail', async (req, res) => {
    let p_id = await req.body.id
    await Project.findOne({ project_id: p_id }).then(async (data) => {
        if (data != null) {
            res.status(200).send(data)
        }
        else {
            res.send({ code: 400, message: "Result Not Found" })
        }

       
    }).catch((e) => {
        res.status(400).send("Invalid request" + e)
    })
})


app.post('/fetchintrest', async (req, res) => {
    await Project.findOne({ _id: req.body.id }).then(async (data) => {
        if (data != null) {
            res.status(200).send(data)
        }
        else {
            res.send({ code: 400, message: "Result Not Found" })
        }
    }).catch(() => {
        res.status(400).send("Invalid request")
    })
})


app.post('/addintrest', async (req, res) => {

    let isIntrested = await IntrestLog.findOne({ project_id: req.body.id, user_email: req.body.email }).count()

    if (isIntrested == 0) {
        const intrestQuery = new IntrestLog({
            user_email: req.body.email,
            project_id: req.body.id
        });

        intrestQuery.save().then(async () => {
            await Project.updateOne({ _id: req.body.id }, { $inc: { intrested: +1 }, $push: { intrestedUser: req.body.email } }).then(async (data) => {
                if (data != null) {
                    res.status(200).send(data)
                }
                else {
                    res.send({ code: 400, message: "Result Not Found" })
                }
            }).catch(() => {
                res.status(400).send("Invalid request")
            })
        })
    }
    else {

        await IntrestLog.deleteMany({ project_id: req.body.id, user_email: req.body.email }).then(async () => {
            await Project.updateOne({ _id: req.body.id }, { $inc: { intrested: -1 }, $pull: { intrestedUser: req.body.email } }).then(async (data) => {
                if (data != null) {
                    res.status(200).send(data)
                }
                else {
                    res.send({ code: 400, message: "Result Not Found" })
                }
            }).catch(() => {
                res.status(400).send("Invalid request")
            })
        })
    }


})

// banner

app.post('/addbanner', async (req, res) => {
    let fileRandoName = Date.now()
    const banner = new Banner({
        image: fileRandoName + ".gif",
        link: req.body.link
    })
    banner.save().then(async () => {
        let img = req.body.image
        let imgData = img.replace(/^data:image\/\w+;base64,/, "");
        await fs.writeFile(`public/banner/${fileRandoName}.gif`, imgData, { encoding: 'base64' }, function (err) {
            console.log('File created');
            res.send({ code: 200 })
        });
    })
})
app.post('/deletebanner', async (req, res) => {
    Banner.deleteOne({ _id: req.body.id }).then(() => {
        res.send({ code: 200 })
    })
})

app.post('/fetchbanner', async (req, res) => {
    Banner.find().then(async (data) => {
        res.send(data)
    })
})


app.post('/search', async (req, res) => {
    let  {text} = req.body
    var regex =  new RegExp(text,'i')
    Project.find({project_name:regex}).limit(10).then((result)=>{
        res.status(200).send(result)
    }).catch((e)=>{
        res.status(200).send(e)
    })
})



app.listen(8000)