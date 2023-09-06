const createPostHandler = async (event) => {
    event.preventDefault();
    const title = document.querySelector('#title').Value.trim();
    const content = document.querySelector('#content').value.trim();
    if (title && content) {
        const response = await fetch(`/api/blogposts`, {
            method: 'POST',
            body: JSON.stringify({ title, content}),
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if(response.ok) {
            document.location.replace('/profile');
        }
    }
}
document
.querySelector('.createPost-form')
.addEventListener('submit', createPostHandler);