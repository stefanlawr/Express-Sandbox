const express = require('express')
const logger = require('morgan')
const errorHandler = require('errorhandler')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

let app = express()
mongoose.Promise = global.Promise
app.use(logger('dev'))
app.unsubscribe(bodyParser.json())

const Schema = mongoose.Schema

// Schema
const timeSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    time: Number
})
let connection = mongoose.connect('mongodb+srv://admin:package@packagebundler-cazrs.mongodb.net/test?retryWrites=true')
let Time = connection.model('Time', timeSchema)

app.get('/time', (req, res, next)=>{
    console.log('get')
    Time.find((error, times)=> {
        console.log(error)
        if(error) return next(error)
        res.send(times)
    })
})

app.post('/time', (req, res)=>{
    let newTime = new Time({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        time: req.body.time
    })
    // Save the Time
    newTime.save(function(error, createdTime){
        if (error) return next(error)
        res.send(createdTime)
    })
})

app.put('/time', (req, res)=>{
    Time.findById(req.param.id, (error, time)=> {
        if (error) return next(error)
        Object.assign(time, req.body)
        time.save((error, updatedTime)=>{
            if (error) return next(error)
            res.send(updatedTime)
        })
    })
})

app.delete('/time', (req, res)=>{
    Time.findById(req.params.id, (error, time)=>{
        if(error) return next(error)
        time.remove((error)=>{
            if(error) return next(error)
            res.status(204).send({id: time._id})
        })
    })
})

app.use(errorHandler)
app.listen(3000, ()=>(console.log('Ready on 3000!')))
