function append (db, post, channel) {
  db.save({
    user: post.user,
    device: post.device,
    channel: channel,
    data: post.data
  })
}

exports.append = append;