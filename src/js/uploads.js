(function ($) {
    $.fn.uploads = function (options) {

        var settings = $.extend({
                                    complete: function () {
                                    },
                                    url: "upload.php",
                                    headers: {},
                                    data: {},
                                    method: 'post',
                                    uploadMultiple: true,
                                    maxFiles: 500,
                                    maxFilesize: 10000,
                                    timeout: 9999999999999999,
                                    parallelUploads: 500,
                                    name: 'file',
                                    acceptedFiles: '',
                                    previewTemplate: '<div class="preview"></div>',
                                    dictFileTooBig: 'O arquivo é muito grande ({{filesize}} Mb). Tamanho máximo do arquivo: {{maxFilesize}} Mb.',
                                }, options);


        var config = Dropzone.options.myAwesomeDropzone = {
            url: settings.url,
            headers: settings.headers,
            method: settings.method,
            uploadMultiple: settings.uploadMultiple,
            maxFiles: settings.maxFiles,
            maxFilesize: settings.maxFilesize,
            timeout: settings.timeout,
            name: settings.name,
            acceptedFiles: settings.acceptedFiles,
            parallelUploads: settings.parallelUploads,
            previewTemplate: settings.previewTemplate,
            dictFileTooBig: settings.dictFileTooBig,

            init: function (data) {
                var upload       = this,
                    countFiles   = 0,
                    btn_upload   = $(".btn-upload"),
                    uploading    = $(".uploading"),
                    progress_bar = $(".progress-bar");

                upload.on("sendingmultiple", function (files, xhr, formData) {
                    var total = 0;
                    $.each(files, function (index, data) {
                        countFiles += 1;
                        total += data.size;
                    });

                    if(settings.data){
                        $.each(settings.data, function(index, value) {
                            formData.append(index, value);
                        });
                    }

                    btn_upload.addClass('d-none');
                    uploading.removeClass('d-none');
                    uploading.find('.infos .total').text(sizeExt(total));
                    uploading.find('.infos .size').text('0 mb');

                    window.onbeforeunload = function (e) {
                        return 'É possível que as alterações feitas não sejam salvas.';
                    };

                });

                upload.on("uploadprogress", function (file, totalBytes, totalBytesSent) {
                    progress_bar.css("width", Math.round(totalBytes) + "%");
                    uploading.find('.infos .size').text(sizeExt(totalBytesSent));
                });

                upload.on("queuecomplete", function (file, totalBytes, totalBytesSent) {
                    btn_upload.removeClass('d-none');
                    uploading.addClass('d-none');

                    uploading.find('.infos .size').text('0 mb');
                    progress_bar.css("width", "0%");
                });

                upload.on("successmultiple", function (file, data) {

                    window.onbeforeunload = null;

                    if ($.isFunction(settings.complete)) {
                        settings.complete.call(upload, data);
                    }
                });

            }
        }

        new Dropzone(".btn-upload", config);

        function sizeExt (file) {
            var extSize = ['Bytes', 'KB', 'MB', 'GB'];
            i           = 0;
            while (file > 900) {
                file /= 1024;
                i++;
            }
            var size = (Math.round(file * 100) / 100) + ' ' + extSize[i];

            return size;
        }


    };
})(jQuery);