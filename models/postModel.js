module.exports = (_db) => {
  db = _db;
  return PostModel;
};

class PostModel {
  /*------------ POST ------------*/
  static getAllPosts() {
    let sql = 'SELECT * FROM "post"';
    return db
      .query(sql)
      .then((res) => res.rows)
      .catch((err) => err);
  }

  static getOnePost(id) {
    let sql = 'SELECT * FROM "post" WHERE id = $1';
    return db
      .query(sql, [id])
      .then((res) => res.rows)
      .catch((err) => err);
  }

  static addPost(req) {
    let sql =
      'INSERT INTO "post" ("title", "nationality", "contents", "picture", "portrait", "author_id", "categry_id") VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *';
    return db
      .query(sql, [
        req.body.title,
        req.body.nationality,
        req.body.contents,
        req.body.picture,
        req.body.portrait,
        req.session.user.id,
        req.body.categry_id,
      ])
      .then((res) => res.rows)
      .catch((err) => err);
  }

  static editPost(req, id) {
    let sql =
      'UPDATE "post" SET "title"=$1, "nationality"=$2, "contents"=$3, "picture"=$4, "categry_id"=$5, "portrait"=$6 WHERE id=$7 RETURNING *';
    return db
      .query(sql, [
        req.body.title,
        req.body.nationality,
        req.body.contents,
        req.body.picture,
        req.body.categry_id,
        req.body.portrait,
        id,
      ])
      .then((res) => res.rows)
      .catch((err) => err);
  }

  static deletePost(id) {
    let sql = 'DELETE FROM "post" WHERE id=$1';
    return db
      .query(sql, [id])
      .then((res) => res.rows)
      .catch((err) => err);
  }

  /*------------ COMMENTS ------------*/
  static addComment(req, postId) {
    let sql =
      'INSERT INTO "comment" ("nickname", "contents", "creationtimestamp", "post_id") VALUES ($1, $2, NOW(), $3) RETURNING *';
    return db
      .query(sql, [req.body.nickname, req.body.contents, postId])
      .then((res) => res.rows)
      .catch((err) => err);
  }

  static deleteComments(postId) {
    let sql = 'DELETE FROM "comment" WHERE "post_id"=$1';
    return db
      .query(sql, [postId])
      .then((res) => res.rows)
      .catch((err) => err);
  }

  static showComments(postId) {
    let sql = 'SELECT * FROM "comment" WHERE "post_id"=$1';
    return db
      .query(sql, [postId])
      .then((res) => res.rows)
      .catch((err) => err);
  }
}
