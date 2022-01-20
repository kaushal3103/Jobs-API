    const express = require('express');
    const router = express.Router();

    const {
        createjob,getjob,deletejob,updatejob,getalljob
    } = require('../controllers/jobs');

    router.route('/').post(createjob).get(getalljob);
    router.route('/:id').get(getjob).delete(deletejob).patch(updatejob);

    module.exports = router ;