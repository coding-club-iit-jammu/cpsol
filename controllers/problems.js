const Problem = require('../models').Problem
const {gdrive, antivirus} = require('../helpers')
const fs = require('fs')
const MarkdownIt = require('markdown-it')
const FileType = require('file-type');
const readChunk = require('read-chunk');

const valid_mime = ['video/mp4']

const search = (req, res) => {
    const search_term = req.query.search_term

    Problem.search({
            match: {
                title : {
                    query : search_term,
                    fuzziness: 'auto'
                }
        }

    }, {},
    (err, results) => {
        if (err){
            console.error(err)
        }
        console.log(results.hits)
        let search_results = []
        search_results = results.hits.hits.map((hit) => {
            let new_ele = hit._source
            //TODO do not index these at all
            delete new_ele.uploaded_by.uid
            delete new_ele.uploaded_by._id
            new_ele._id = hit._id
            return new_ele
        })
        return res.status(200).send(search_results)
    })    
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
    //if (!valid_mime.includes(video.mimetype)){
    //    return res.status(400).send('Invalid file type')
    //}

    (async () => {
        const buffer = readChunk.sync(video.tempFilePath, 0, 262);
        const videoType = await FileType.fromBuffer(buffer);

        if ( videoType === undefined ){
            return res.status(400).send('Problem with File/filetype not supported.')
        }
        else if (!valid_mime.includes(videoType['mime'])){
            return res.status(400).send('Only mp4 supported.')
        }
        else {
            //antivirus scan
    antivirus.then(clamscan => {
        clamscan.is_infected(video.tempFilePath, (err, file, is_infected) => {
            // If there's an error, log it
            if (err) {
                console.error(err);
                console.trace(err.stack);
                process.exit(1);
            }

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
                        console.error(err)
                        return res.status(500).send()
                    })
                })
            }
        });
    });
        }
    })();

}


module.exports = {
    search,
    view_sol,
    submit
}