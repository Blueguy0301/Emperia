printjson(
  db.users.find({ notifications: { $elemMatch: { created_at: '06/12/2022' } } })
)
