export function postComment(boardId, commentObj, callback) {
    fetch(`/api/v1/free-boards/${boardId}/comments`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(commentObj)
    })
        .then(resp => {
            if (resp.ok && callback) {
                callback();
            }
        });
}

export function getCommentList(boardId, page, callback) {
    fetch(`/api/v1/free-boards/${boardId}/comments?page=${page}`)
        .then(resp => {
            if (resp.ok) {
                return resp.json();
            }
        })
        .then(data => {
            if (callback) {
                callback(data);
            }
        });
}

export function patchComment(commentId, commentObj, callback) {
    fetch(`/api/v1/free-comments/${commentId}`, {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(commentObj)
    })
        .then(resp => {
            if (resp.ok && callback) {
                callback();
            }
        });
}

export function deleteComment(commentId, callback) {
    fetch(`/api/v1/free-comments/${commentId}`, {
        method: 'DELETE',
    })
        .then(resp => {
            if (resp.ok && callback) {
                callback();
            }
        });
}
















