const _ = require('lodash');

const dummy = (blogs) => {
    return 1;
}

const totalLikes = (blogs) => {

    const totalAmount = blogs.reduce((sum, blog) => {
        return sum + blog.likes
    }, 0)

    return totalAmount
}

const favoriteBlog = (blogs) => {

    const favorite = blogs.reduce((prev, cur) => {
        if (prev.likes > cur.likes) {
            return prev
        } 
        return cur
    })

    const favoriteSchema = {
        "author" : favorite.author,
        "likes" : favorite.likes,
        "title" : favorite.title
    }

    return favoriteSchema
}

const mostBlogs = (blogs) => {

    const bloggers = _.countBy(blogs, value => value.author)

    const obj= []

    for(var blogger in bloggers) {
        var value = bloggers[blogger]
         

        obj.push({"author" : blogger,
        "blogs" : value
    })
    }

    const mostPopular = _.maxBy(obj, function(o) {
        return o.blogs
    })

    return mostPopular
}

const mostLikes = (blogs) => { //Looks horrible, I know :)
    const obj = []

    for (var blogger in blogs) {
        if (obj.filter(e => e.author === blogs[blogger].author).length <= 0) {
            obj.push({
                "author" : blogs[blogger].author,
                "likes" : blogs[blogger].likes
            })
        } else {
            obj.filter(e => e.author === blogs[blogger].author)[0].likes = _.add(obj.filter(e => e.author === blogs[blogger].author)[0].likes, blogs[blogger].likes)
        } 
    }

    const mostPopular = _.maxBy(obj, function(o) {
        return o.likes
    })

    return mostPopular
}

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes }