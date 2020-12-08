

const faunadb = require('faunadb'),
q = faunadb.query;

exports.handler = async () => {
try {



  var adminClient = new faunadb.Client({ secret: 'fnAD8SlBbQACBPjyfHKmxq7osBkK6PnHbHjdh469' });
  const result = await adminClient.query(
    q.Map(
      q.Paginate(q.Match(q.Index('data'))),
      q.Lambda(x => q.Get(x))
    )
  )

  return {
    statusCode: 200,
    body: JSON.stringify(result.data),
  }

} catch (err) {
  return { statusCode: 500, body: err.toString() }
}
}
