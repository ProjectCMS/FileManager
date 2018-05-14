//** Set view **//
var boxOrientation = Cookies.get('box-orientation');

if (!boxOrientation) {
    Cookies.set('box-orientation', 'list', {expires: 365});
    boxOrientation = 'list';
}

$(".set-view").on("click", function (e) {
    var set = $(this).data('view');
    Cookies.set('box-orientation', set, {expires: 365});
    boxOrientation = set;
});

box_item.attr("data-view", boxOrientation);
