document.getElementById('connexion').addEventListener('click', () => {
    
    const username = document.getElementById('username').value.trim();

    if (username !== '') {
        window.location.href = './matchList.html';
    }else {
        window.location.href = './singin.html'
    }
});

