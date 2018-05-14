//** Tooltip **//
$('[data-tooltip]').tooltip();

//** Height list **//
var header   = $(".header"),
    content  = $(".content"),
    box_item = $(".box-item"),
    multiple = (multiple ? multiple : false),
    tools    = (tools ? tools : true);

//** Set box item css **//
box_item.css("height", 'calc(100% - ' + header.innerHeight() + 'px)');
box_item.css("max-height", 'calc(100% - ' + header.innerHeight() + 'px)');
box_item.css("overflow-x", 'auto');
content.attr("data-toolbar", tools);

//** Set view **//
$(".set-view").on("click", function (e) {
    var set = $(this).data('view');
    box_item.attr('data-view', set);
    e.preventDefault();

});

//** Set box size **//
$(window).on("resize load", function () {

    var w = box_item.width();
    if (w >= 1920) {
        box_item.attr('data-columns', 10);
    } else if (w >= 1680 && w < 1920) {
        box_item.attr('data-columns', 9);
    } else if (w >= 1480 && w < 1680) {
        box_item.attr('data-columns', 8);
    } else if (w >= 1280 && w < 1460) {
        box_item.attr('data-columns', 7);
    } else if (w >= 1080 && w < 1280) {
        box_item.attr('data-columns', 6);
    } else if (w >= 880 && w < 1080) {
        box_item.attr('data-columns', 5);
    } else if (w >= 680 && w < 880) {
        box_item.attr('data-columns', 4);
    } else if (w >= 480 && w < 680) {
        box_item.attr('data-columns', 3);
    } else {
        box_item.attr('data-columns', 2);
    }

});

check_item();

//** Set single checkbox **//
function check_item () {

    $("body").on("change", ".check-item", function () {
        if (multiple == 'false') {
            $(".check-item").not(this).prop('checked', false).closest('.preview').removeClass('selected');
        }
        if ($(this).prop('checked') == true) {
            $(this).closest('.preview').addClass('selected');
        } else {
            $(this).closest('.preview').removeClass('selected');
        }

        count_check();

    });
}

//** Count checks **//
function count_check () {

    var count = $(".check-item:checked");
    var btn   = $("#insert-item");

    if (count.length != 0) {
        btn.prop("disabled", false);
    } else {
        btn.prop("disabled", true);
    }
}

//** Image orientation **//
function image_orientation () {

    var box_item = $(".box-item");

    console.log(box_item.find("img"));

    box_item.find("img").each(function () {

        var src = $(this).attr("src"),
            orientation,
            img = new Image();

        img.src = src;

        if (img.naturalWidth > img.naturalHeight) {
            orientation = 'landscape';
        } else if (img.naturalWidth < img.naturalHeight) {
            orientation = 'portrait';
        } else {
            orientation = 'even';
        }

        $(this).attr("data-orientation", orientation);
    });
}


