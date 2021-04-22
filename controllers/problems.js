const Problem = require('../models').Problem
const {gdrive, antivirus} = require('../helpers')
const fs = require('fs')
const MarkdownIt = require('markdown-it')

const valid_mime = ['video/mp4']
const search = (req, res) => {
    const search_term = req.query.search_term

    let problemProjection = { 
        __v: false,
        md : false,
        video_link : false,
        writeup_md  : false,
        uploaded_by : {
            //TODO returns different id for each call
            '_id' : false,
            uid : false
        },
        score : { $meta: "textScore" }
    }
    Problem.find(
        { $text : { $search : search_term} },
        problemProjection
    )
    .sort({ score : { $meta : 'textScore' } })
    .exec((err, results) => {
        if (err){
            console.log(err)
        }
        if (results){
            return res.status(200).send(results)
        }
    });
    
}

const view_sol = (req, res) => {
    const problem_id = req.params.problem_id
    //TODO decrypt problem_id
    Problem.findById(problem_id, (err, result) => {
        if (err){
            console.log(err)
        }
        if (result){
            md = new MarkdownIt();
            result.preview_link = result.video_link.substring(0, result.video_link.indexOf('/view')) + '/preview'
            result.writeup_html = md.render(result.writeup_md)
            result.problem_html = md.render(result.md)  
            res.status(200)
            return res.render('solution', {sol : result})
        }
        else{
            return res.status(404).send('problem not found')
        }
    })
}

const submit = (req, res) => {
    const video = req.files.sol_video
    const {title, link, md, writeup_md} = req.body
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
      }
    
    //check valid type
    if (!valid_mime.includes(video.mimetype)){
        return res.status(400).send('Invalid file type')
    }

    //antivirus scan
    antivirus.then(clamscan => {
        clamscan.is_infected(video.tempFilePath, (err, file, is_infected) => {
            // If there's an error, log it
            if (err) {
                console.error("ERROR: " + err);
                console.trace(err.stack);
                process.exit(1);
            }

            // If `is_infected` is TRUE, file is a virus!
            if (is_infected === true) {
                return res.status(400).send('Malicious File')
            } else if (is_infected === null) {
                return res.status(400).send('Antivirus Failed')
            } else if (is_infected === false) {
                //TODO check size
                gdrive.uploadFile('test_name', video.tempFilePath, video.mimetype, (public_link) => {
                    fs.unlink(video.tempFilePath, (err) => {
                        if (err){
                            console.log(err)
                        }
                    })

                    //insert db record
                    const problem = new Problem({
                        'title' : title,
                        'link'  : link,
                        'md'    : md,
                        'video_link'    : public_link,
                        'writeup_md'    : writeup_md,
                        'uploaded_by'   : req.uploaded_by       
                    })
                    problem.save()
                    .then((result) => {
                        return res.status(200).send('File Uploaded')
                    })
                    .catch((err) => {
                        return res.status(500).send()
                    })
                })
            }
        });
    });


    

}


module.exports = {
    search,
    view_sol,
    submit
}