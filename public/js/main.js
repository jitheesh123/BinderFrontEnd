$(document).ready(function () {
    $('[data-toggle="tooltip"]').tooltip();
});

$(window).scroll(function () {
    var sticky = $("nav, aside"),
        scroll = $(window).scrollTop();
    if (scroll >= 0.1) sticky.addClass("fixed");
    else sticky.removeClass("fixed");
});
