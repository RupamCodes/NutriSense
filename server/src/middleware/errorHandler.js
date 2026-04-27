const errorHandler = (err, req, res, next) => {
  console.error('[Error]', err.stack || err.message || err);
  if (err.code === 'P2002') {
    const fields = err.meta && err.meta.target ? err.meta.target.join(', ') : 'field';
    return res.status(409).json({ error: `A record with that ${fields} already exists.` });
  }
  res.status(err.status || 500).json({ 
    error: err.message || 'Internal Server Error' 
  });
};
const notFoundHandler = (req, res, next) => {
  res.status(404).json({ error: `Route not found: ${req.originalUrl}` });
};
module.exports = { errorHandler, notFoundHandler };
