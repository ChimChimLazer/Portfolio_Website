document.addEventListener('DOMContentLoaded', () => {
    const projectLinks = document.querySelectorAll('footer a[href^="#project"], footer a[href^="#model"]');

    projectLinks.forEach(link => {
        link.addEventListener('click', function(e){
            const targetId = this.getAttribute('href') 
            const targetArticle = document.querySelector(targetId);

            if (targetArticle) {
                targetArticle.classList.add('highlight')
                
                setTimeout(() => {
                    targetArticle.classList.remove('highlight')
                }, 2000);
            }
        });
    });

    document.getElementById('closeContact').addEventListener('click', function() {
        document.getElementById('contactPopUp').classList.add('offPageRight');
        document.documentElement.classList.remove('scroll_lock');
    });

    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('openContacts')) {

            document.getElementById('contactPopUp').classList.remove('offPageRight');
            document.documentElement.classList.add('scroll_lock');

            event.preventDefault(); 
        }
    });
});