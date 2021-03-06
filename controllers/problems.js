const Problem = require('../models').Problem
const {gdrive} = require('../helpers')

const search = (req, res) => {
    const search_term = req.query.term
}

const view_sol = (req, res) => {
    const problem_id = req.params.problem_id
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