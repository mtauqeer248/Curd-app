

const faunadb = require('faunadb'),
  q = faunadb.query;

exports.handler = async (event) => {
  try {

    if (event.httpMethod !== "POST") {
      return { statusCode: 405, body: "Method Not Allowed" };
    }

    let reqObj = JSON.parse(event.body);


    var adminClient = new faunadb.Client({ secret:'fnAD8SlBbQACBPjyfHKmxq7osBkK6PnHbHjdh469' });
    const result = await adminClient.query(
      q.Delete(q.Ref(q.Collection("crud"), reqObj.id))
    )

 

    return {
      statusCode: 200,
      body: JSON.stringify({ data: result.ref.data }),
    }
  } catch (err) {
    return { statusCode: 500, body: err.toString() }
  }
}
