//Company : Navshar Software
//Project : Smart Pudhari
//Author  : Sourabh Raut
//Created On : 23-Feb-2021
//Version: 1.0
//Description : To common function 


var CommonUtility = (function CommonUtility() {
    'use strict';

    var RequestAjax = function RequestAjax(type, url, data, success, cache, complete, error) {
        $("#overlay").show();
        success === undefined || success === null ? function (response) {
            $("#overlay").hide();
        } : success;

        var beforeSend = function beforeSend() {
            $("#overlay").show();
        };

        var failure = function failure() {
            $("#overlay").hide();
        };

        complete = function complete() {
            $("#overlay").hide();
        };

        return $.ajax({
            type: type,
            url: url,
            ContentType: Constant.contentType,
            data: data,
            beforeSend: beforeSend,
            failure: failure,
            success: success,
            complete: complete,
            cache: cache,
            error: error,
        });

    };

    var RequestAjaxAsync = function RequestAjaxAsync(type, url, data, success, cache, complete, error) {

        $("#overlay").show();
        success === undefined || success === null ? function (response) {
            $("#overlay").hide();
        } : success;

        var beforeSend = function beforeSend() {
            $("#overlay").show();
        };

        var failure = function failure() {
            $("#overlay").hide();
        };

        complete = function complete() {
            $("#overlay").hide();
        };

        $.ajax({
            type: type,
            url: url,
            ContentType: Constant.contentType,
            data: data,
            beforeSend: beforeSend,
            failure: failure,
            success: success,
            complete: complete,
            cache: cache,
            error: error,
            async: false
        });

    };

    var SucessMessagePopUp = function (msg) {
        $("#modal-success").modal('show');
        $("#popupmsg").html(msg);
    }
    var ErrorMessagePopUp = function (msg) {
        $("#modal-danger").modal('show');
        $("#popupmsg").html(msg);
    }

    var InfoMessagePopUp = function (msg) {
        $("#modal-info").modal('show');
        $("#popupmsg").html(msg);
    }
    var WarningMessagePopUp = function (msg) {
        $("#modal-warning").modal('show');
        $("#popupmsg").html(msg);
    }

    var DeleteWarningMessagePopIp = function (msg,id) {
        $("#modal-delete-danger").modal('show');
        $("#deletemsg").html(msg);
        $('#finaldelete').attr("data-myval", id) 
        
    }
    var ScriptInjection = function (html) {
        return $($.parseHTML(html)).text();
    }
    return {
        RequestAjaxAsync: RequestAjaxAsync,
        RequestAjax: RequestAjax,
        SucessMessagePopUp: SucessMessagePopUp,
        ErrorMessagePopUp: ErrorMessagePopUp,
        InfoMessagePopUp: InfoMessagePopUp,
        WarningMessagePopUp: WarningMessagePopUp,
        ScriptInjection: ScriptInjection,
        DeleteWarningMessagePopIp: DeleteWarningMessagePopIp
    }
})();
