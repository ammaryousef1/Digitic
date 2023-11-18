const errorhandler = (statusCode , massage) => {
  const error = new Error()
  error.massage = massage
  error.statusCode = statusCode 
  return error
}

module.exports = {errorhandler}