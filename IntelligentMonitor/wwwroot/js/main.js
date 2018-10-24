window.onload = function () {
    var _menu = new mSlider({
        dom: ".menu",
        direction: "right",
        distance: "20%",
    });
    document.getElementById("btnMenu").addEventListener('click', function (e) {
        _menu.open();
    })
};