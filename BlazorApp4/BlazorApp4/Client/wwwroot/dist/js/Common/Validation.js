//Company : Navshar Software
//Project : Smart Pudhari
//Author  : Sourabh Raut
//Created On : 23-Feb-2021
//Version: 1.0
//Description : To common function 


var CommonValidation = (function CommonValidation() {
    'use strict';

    var MandetoryControlValueCheck = function MandetoryControlValueCheck(controlType, controlId) {
        if (controlType.toUpperCase() == "TEXTBOX") {
            var controlValue = CommonUtility.ScriptInjection($("#" + controlId).val()).replace(/</g, "").replace(/>/g, "");
            if (controlValue == "") {
                $("#err" + controlId).show();
                $("#err" + controlId).html('Please enter ' + $("#" + controlId).attr('msg-value') + '.');
                return false;
            }
            else {
                $("#err" + controlId).hide();
                return true;
            }
        }
        if (controlType.toUpperCase() == "DROPDOWN") {
            var controlValue = CommonUtility.ScriptInjection($("#" + controlId).val()).replace(/</g, "").replace(/>/g, "");
            if (controlValue == "0") {
                $("#err" + controlId).show();
                $("#err" + controlId).html('Please select ' + $("#" + controlId).attr('msg-value') + '.');
                return false;
            }
            else {
                $("#err" + controlId).hide();
                return true;
            }
        }
        if (controlType.toUpperCase() == "TEXTAREA") {
            var controlValue = $("#" + controlId).summernote('code');
            if (controlValue == "") {
                $("#err" + controlId).show();
                $("#err" + controlId).html('Please select ' + $("#" + controlId).attr('msg-value') + '.');
                return false;
            }
            else {
                $("#err" + controlId).hide();
                return true;
            }
        }
    };

    return {
        MandetoryControlValueCheck: MandetoryControlValueCheck
    }
})();
