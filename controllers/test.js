exports.fetchRecord = (req, res, next) => {
    res.status(200).json({
        success : true,
        message: 'Record fetched successfuly!'
    });
}