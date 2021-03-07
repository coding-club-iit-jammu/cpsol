const Problem = require('../models').Problem
const {gdrive} = require('../helpers')

const search = (req, res) => {
    const search_term = req.query.search_term

    let problemProjection = { 
        __v: false,
        md : false,
        video_link : false,
        writeup_md  :false,
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
            return res.status(200).send(result)
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
    
    //TODO check for valid file (format + size)
    gdrive.uploadFile('test_name', video.tempFilePath, video.mimetype, (public_link) => {
        //insert db record
        const problem = new Problem({
            'title' : title,
            'link'  : link,
            'md'    : md,
            'video_link'    : public_link,
            'writeup_md'    : writeup_md          
        })
        problem.save()
        .then((result) => {
            return res.status(200).send()
        })
        .catch((err) => {
            return res.status(500).send()
        })
    })

}


module.exports = {
    search,
    view_sol,
    submit
}