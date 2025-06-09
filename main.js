document.addEventListener('DOMContentLoaded', function(){
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item =>{
        const header = item.querySelector('.faq-header');

        header.addEventListener('click', function(){
            faqItems.forEach(otherItem =>{
                if (otherItem !== item && otherItem.classList.contains('active')){
                    otherItem.classList.remove('active');
                }
            });

            item.classList.toggle('active');
        });
    });

});
