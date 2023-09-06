const addCommentHandler = async (event) => {
    event.preventDefault();

    const message = document.querySelector('#content').Value.trim();

    const id = event.target.getAttribute('data-id');

    if (event.target.hasAttribute('data-id')) {
        if (message) {
            const response = await fetch(`/api/comments/${id}`, {
                method: 'POST',
                body: JSON.stringify({ message }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                document.location.replace(`/blogpost/${id}`);
            }
        }
    }
}
document
.querySelector('.addComment-form')
.addEventListener('submit', addCommentHandler);