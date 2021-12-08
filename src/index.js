// write your code here
const imageContainer = document.querySelector('.image-container')

const state = {
    images:[]
}

function getImages() {
    return fetch("http://localhost:3000/images")
    .then((resp) => resp.json())
}

function createComentOnServer(imageId, content){
    return fetch('http://localhost:3000/comments', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            imageId: imageId,
            content: content
        })
    }).then(resp => resp.json())
}

function getComments() {
    return fetch("http://localhost:3000/comments")
    .then(function(resp) {
        return resp.json()
    })
}

function addLike(image) {
    return fetch(`http://localhost:3000/images/${image.id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body:JSON.stringify({
            likes: image.likes + 1
        })
    })
}

function createCommentOnServer(id, comment) {
        return fetch(`http://localhost:3000/comments`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body:JSON.stringify({
                content: comment,
                imageId: id
            })
        }).then(function (resp) {
            return resp.json()
        })
}

function deleteImage(id) {
    fetch(`http://localhost:3000/images/${id}`, {
    method: 'DELETE'
})
}

function deleteComments(id) {
    fetch(`http://localhost:3000/comments/${id}`, {
    method: 'DELETE'
})
}

function renderImages() {
    imageContainer.innerHTML = ''

    for(const image of state.images) {
        const articleEl = document.createElement('article')
        articleEl.setAttribute('class', 'image-card')

        const deleteImgEl = document.createElement('button')
        deleteImgEl.setAttribute('class', 'delete-button-card')
        deleteImgEl.textContent = 'Delete'

        deleteImgEl.addEventListener('click', function () {
            console.log("Deleted")
            deleteImage(image.id)
        })

        const titleEl = document.createElement('h2')
        titleEl.setAttribute('class', 'title')
        titleEl.textContent = image.title

        const imageEl = document.createElement('img')
        imageEl.setAttribute('class', 'image')
        imageEl.setAttribute('src',`${image.image}`)

        const likesDivEl = document.createElement('div')
        likesDivEl.setAttribute('class', 'likes-section')

        const likesSpanEl = document.createElement('span')
        likesSpanEl.setAttribute('class', 'likes')
        likesSpanEl.textContent = `${image.likes} likes`

        const likeBtnEl = document.createElement('button')
        likeBtnEl.setAttribute('class', 'like-button')
        likeBtnEl.textContent = `♥`
        likeBtnEl.addEventListener('click', function(e) {
            e.preventDefault()
            addLike(image)
            image.likes += 1
        })


        const comentsUlEl = document.createElement('ul')
        comentsUlEl.setAttribute('class', 'comments')

        
        for (const comment of image.comments) {
            const comentsLiEl = document.createElement('li')
            comentsLiEl.textContent = `${comment.content}`

            const deleteComent = document.createElement('button')
            deleteComent.setAttribute('class', 'delet-coment-btn')
            deleteComent.textContent = `x`
            deleteComent.addEventListener('click',function () {
                deleteComments(comment.imageId)
                render()
            })
             
            comentsLiEl.append(deleteComent)
            comentsUlEl.append(comentsLiEl)
        }

        const commentForm =  document.createElement('form')
        commentForm.setAttribute('class', 'comment-form')

        const commentInput =  document.createElement('input')
        commentInput.setAttribute('class', 'comment-input')
        commentInput.setAttribute('type', 'text')
        commentInput.setAttribute('name', 'comment')
        commentInput.setAttribute('placeholder', 'Add a comment...')

        const commentBtnEl = document.createElement('button')
        commentBtnEl.setAttribute('class', 'comment-button')
        commentBtnEl.setAttribute('type', 'submit')
        commentBtnEl.textContent = 'Post'

        commentForm.addEventListener('submit', function(e) {
            e.preventDefault()

            const comment = commentForm.comment.value

            createComentOnServer(image.id, comment)
            .then(function (commentFromServer) {
                image.comments.push(commentFromServer)
                render()
                commentForm.reset()
            })


        })
         
        commentForm.append(commentInput, commentBtnEl)
        titleEl.append(deleteImgEl)
        likesDivEl.append(likesSpanEl, likeBtnEl)
        articleEl.append(titleEl, imageEl, likesDivEl, comentsUlEl, commentForm)
        imageContainer.append(articleEl)
    }
}

function render(){
    renderImages()
}

getImages().then(function (imagesFromServer) {
    state.images = imagesFromServer
    render()
})

render()
console.log(state)