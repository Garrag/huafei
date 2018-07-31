$(document).ready(function () {
    //注册导航鼠标悬停事件
    $('.dev-nav-item').hover(function (event) {
        $(this).find('.dev-nav-more').show()
    }, function (event) {
        $(this).find('.dev-nav-more').hide()
    });

    var swiper2 = new Swiper('#slider2', {
        // pagination: '.swiper-pagination',
        slidesPerView: 5,
        centeredSlides: true,
        paginationClickable: true,
        spaceBetween: 10,
        loop: true,
        autoplay: 1000,//可选选项，自动滑动
        autoplayDisableOnInteraction: false,
        preventLinksPropagation: false,
    });

})