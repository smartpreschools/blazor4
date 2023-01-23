var SocialMedia = (function () {

    //#region Ready Function Start Point
    $(document).ready(function () {
        BindDropdown("#ddlCategory", "Category", "", true);
        // BindDropdown("#ddlValidity", "PlanValidity", "", true);
        BindSocialMediaList();
    });
    //#endregion
    var optionSelect = "<option value='0' selected>Select value.. </option";
    //#region Bind Country List
    function BindDropdown(contrlID, DrpName, inputValue, isAsync) {
        var BindDropDownData = function (result) {
            if (result != "" || result.length > 0) {
                $(contrlID + " option").remove();
                $.map(result, function (opt) {
                    var option = $('<option>' + opt.DataName + '</option>');
                    option.attr('value', opt.DataId);
                    $(contrlID).append(option);
                });
                $(contrlID + " option").remove("0");
                $(contrlID).prepend(optionSelect);
            }
        }
        var data = {
            dropName: DrpName,
            inputText: inputValue,
        };
        var url = '/ProductAdmin/Master/GetDropDownData/';
        if (isAsync)
            CommonUtility.RequestAjax('GET', url, data, BindDropDownData, null, null, null);
        else
            CommonUtility.RequestAjaxAsync('GET', url, data, BindDropDownData, null, null, null);

    }
    //#endregion
    //#region Bind State List
    function BindSocialMediaList() {
        var Success = function (result) {
            if (result != "" || result.length >= 0) {
                $('#socialMedialist').DataTable({
                    data: result,
                    "bFilter": true,
                    "bLengthChange": true,
                    "bDestroy": true,
                    "lengthMenu": [[5, 10, 25, -1], [5, 10, 25, "All"]],
                    columns: [
                        { data: 'Category' },
                        { data: 'Facebook' },
                        { data: 'Twitter' },
                        { data: 'Dribble' },
                        { data: 'Flicker' },
                        { data: 'LinkedIN' },
                        { data: 'Wekipedia' },
                        { data: 'Instagram' },
                        { data: 'Googlemap' },
                        { data: 'WhatsupNumber' },
                        { data: 'Youtube' },
                        {
                            data: "Status",
                            render: function (data, type, row) {
                                if (data === "True") { return "Active" }
                                else return "InActive"
                            }
                        },
                        {
                            "data": "SocialMediaID",
                            "searchable": false,
                            "sortable": false,
                            "render": function (data, type, full, meta) {
                                return '<i class="fas fa-edit" id="editSocialMedia" data-value ="' + data + '"></i>|<i class="fas fa-trash-alt" id="deleteSocialMedia" data-value ="' + data + '" ></i>';
                            }
                        }
                    ]
                });
            }
        }

        var url = '/ProductAdmin/WebAdmin/GetSocialMediaList/';
        CommonUtility.RequestAjax('POST', url, "", Success, null, null, null);
    }
    //#endregion

    //#region Add New State
    $('body').on('click', "#btnSubmit", function () {
        var category = CommonUtility.ScriptInjection($("#ddlCategory").val()).replace(/</g, "").replace(/>/g, "");
        var facebook = CommonUtility.ScriptInjection($("#txtFacebook").val()).replace(/</g, "").replace(/>/g, "");
        var twitter = CommonUtility.ScriptInjection($("#txtTwitter").val()).replace(/</g, "").replace(/>/g, "");
        var dribble = CommonUtility.ScriptInjection($("#txtDribble").val()).replace(/</g, "").replace(/>/g, "");
        var flicker = CommonUtility.ScriptInjection($("#txtFlicker").val()).replace(/</g, "").replace(/>/g, "");
        var linkedIN = CommonUtility.ScriptInjection($("#txtLinkedIN").val()).replace(/</g, "").replace(/>/g, "");
        var wekipedia = CommonUtility.ScriptInjection($("#txtWekipedia").val()).replace(/</g, "").replace(/>/g, "");
        var instagram = CommonUtility.ScriptInjection($("#txtInstagram").val()).replace(/</g, "").replace(/>/g, "");
        var googlemap = CommonUtility.ScriptInjection($("#txtGooglemap").val()).replace(/</g, "").replace(/>/g, "");
        var whatsupNumber = CommonUtility.ScriptInjection($("#txtWhatsupNumber").val()).replace(/</g, "").replace(/>/g, "");
        var youtube = CommonUtility.ScriptInjection($("#txtYoutube").val()).replace(/</g, "").replace(/>/g, "");

        var socialMediaStatus = CommonUtility.ScriptInjection($("#ddlStatus").val()).replace(/</g, "").replace(/>/g, "");
      //  var imagedesc = CommonUtility.ScriptInjection($("#txtImageDesc").val()).replace(/</g, "").replace(/>/g, "");
        var socialMediaID = CommonUtility.ScriptInjection($("#hdnSocialMediaID").val()).replace(/</g, "").replace(/>/g, "");

        var categoryStatus = CommonValidation.MandetoryControlValueCheck("DROPDOWN", "ddlCategory");
        var facebookStatus = CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtFacebook");
        var twitterStatus = CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtTwitter");
        var dribbleStatus = CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtDribble");
        var flickerStatus = CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtFlicker");
        var linkedINStatus = CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtLinkedIN");
        var wekipediaStatus = CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtWekipedia");
        var instagramStatus = CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtInstagram");
        var googlemapStatus = CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtGooglemap");
        var whatsupNumberStatus = CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtWhatsupNumber");
        var youtubeStatus = CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtYoutube");


        if (categoryStatus && facebookStatus && twitterStatus && dribbleStatus && flickerStatus && linkedINStatus && wekipediaStatus && instagramStatus && googlemapStatus && whatsupNumberStatus && youtubeStatus ) {
            if (socialMediaID != "")
                UpdateSocialMedia(socialMediaID, category, facebook, twitter, dribble, flicker, linkedIN, wekipedia, instagram, googlemap, whatsupNumber, youtube, socialMediaStatus)
            else
                AddSocialMedia(category, facebook, twitter, dribble, flicker, linkedIN, wekipedia, instagram, googlemap, whatsupNumber, youtube, socialMediaStatus);
        }
    });

    function AddSocialMedia(category, facebook, twitter, dribble, flicker, linkedIN, wekipedia, instagram, googlemap, whatsupNumber, youtube, socialMediaStatus) {

        var Success = function (result) {
            if (result != "" || result.length > 0) {
                Clear();
                BindSocialMediaList();
                if (result === 1)
                    CommonUtility.SucessMessagePopUp("Slider Image saved successfully.");
                if (result === -1)
                    CommonUtility.SucessMessagePopUp("image already exists, could you try another name.");
            }
        }
        var data = {
            Category: category,
            Facebook: facebook,
            Twitter: twitter,
            Dribble: dribble,
            Flicker: flicker,
            LinkedIN: linkedIN,
            Wekipedia: wekipedia,
            Instagram: instagram,
            Googlemap: googlemap,
            WhatsupNumber: whatsupNumber,
            Youtube: youtube,
            Status: socialMediaStatus,
            
        };
        var url = '/ProductAdmin/WebAdmin/AddSocialMedia/';
        CommonUtility.RequestAjax('POST', url, data, Success, null, null, null);
    }

    function UpdateSocialMedia(socialMediaID, category, facebook, twitter, dribble, flicker, linkedIN, wekipedia, instagram, googlemap, whatsupNumber, youtube, socialMediaStatus, imagedesc) {

        var Success = function (result) {
            if (result != "" || result.length > 0) {
                CommonUtility.SucessMessagePopUp("Slider updated successfully.");
                Clear();
                BindSocialMediaList();
            }
        }
        var data = {
            SocialMediaID: socialMediaID,
            Category: category,
            Facebook: facebook,
            Twitter: twitter,
            Dribble: dribble,
            Flicker: flicker,
            LinkedIN: linkedIN,
            Wekipedia: wekipedia,
            Instagram: instagram,
            Googlemap: googlemap,
            WhatsupNumber: whatsupNumber,
            Youtube: youtube,
            Status: socialMediaStatus,
            
        };
        var url = '/ProductAdmin/WebAdmin/UpdateSocialMedia/';
        CommonUtility.RequestAjax('POST', url, data, Success, null, null, null);
    }
    //#endregion

    //#region Validation
    $('#ddlCategory').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("DROPDOWN", "ddlCategory")
    });
    $('#txtFacebook').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtFacebook");
    });

    $('#txtTwitter').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtTwitter");
    });

    $('#txtDribble').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtDribble");
    });
    $('#txtFlicker').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtFlicker")
    });
    $('#txtLinkedIN').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtLinkedIN");
    });
    $('#txtWekipedia').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtWekipedia");
    });
    $('#txtInstagram').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtInstagram");
    });
    $('#txtGooglemap').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtGooglemap");
    });
    $('#txtWhatsupNumber').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtWhatsupNumber");
    });
    $('#txtYoutube').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtYoutube");
    });

    //#region Validation


    //#endregion

    //#region clear State controls
    $('body').on('click', "#btnClear", function () {
        Clear();
    });

    function Clear() {

        $("#ddlCategory").val("0");
        $("#txtFacebook").val("");
        $("#txtTwitter").val("");
        $("#txtDribble").val("");
        $("#txtFlicker").val("");
        $("#txtLinkedIN").val("");
        $("#txtWekipedia").val("");
        $("#txtInstagram").val("");
        $("#txtGooglemap").val("");
        $("#txtWhatsupNumber").val("");
        $("#txtYoutube").val("");
        $("#hdnSocialMediaID").val("");
      //  $("#txtImageDesc").val("");

        $("#errtxtFacebook").html("").hide();
        $("#errddlCategory").html("").hide();
        $("#errtxtTwitter").html("").hide();
        $("#errtxtDribble").html("").hide();
        $("#errtxtFlicker").html("").hide();
        $("#errtxtLinkedIN").html("").hide();
        $("#errtxtWekipedia").html("").hide();
        $("#errtxtInstagram").html("").hide();
        $("#errtxtGooglemap").html("").hide();
        $("#errtxtWhatsupNumber").html("").hide();
        $("#errtxtYoutube").html("").hide();
    }
    //#endregion

    //#region delete Category
    $('body').on('click', "#deleteSocialMedia", function () {
        var id = $(this).attr('data-value');
        CommonUtility.DeleteWarningMessagePopIp("Are you sure you want to delete Social Media Link", id);
    });
    $('body').on('click', "#finaldelete", function () {
        var id = $(this).attr('data-myval')
        DeleteSocialMedia(id);
    });
    function DeleteSocialMedia(SocialMediaID) {
        var socialMediaID = CommonUtility.ScriptInjection(SocialMediaID).replace(/</g, "").replace(/>/g, "");
        var Success = function (result) {
            if (result != "" || result.length > 0) {
                $("#modal-delete-danger").modal('hide');
                CommonUtility.SucessMessagePopUp("Link Deleted successfully.");
                BindSocialMediaList();
                Clear();
            }
        }
        var data = {
            SocialMediaID: socialMediaID
        };
        var url = '/ProductAdmin/WwbAdmin/DeleteSocialMedia/';
        CommonUtility.RequestAjax('POST', url, data, Success, null, null, null);
    }
    //#endregion

    //#region Edit Category
    $('body').on('click', "#editSocialMedia", function () {
        var socialMediaID = $(this).attr('data-value');
        var Sucess = function (result) {
            if (result != "" || result.length >= 0) {
                $("#ddlCategory").val(result.Category);
                $("#txtFacebook").val(result.Facebook);
                $("#txtTwitter").val(result.Twitter);
                $("#txtDribble").val(result.Dribble);
                $("#txtFlicker").val(result.Flicker);
                $("#txtLinkedIN").val(result.LinkedIN);
                $("#txtWekipedia").val(result.Wekipedia);
                $("#txtInstagram").val(result.Instagram);
                $("#txtGooglemap").val(result.Googlemap);
                $("#txtWhatsupNumber").val(result.WhatsupNumber);
                $("#txtYoutube").val(result.Youtube);
             //   $("#txtImageDesc").val(result.ImageDesc);
                $("#ddlStatus").val(result.Status);
                $("#hdnSocialMediaID").val(result.SocialMediaID);
            }
        }
        var data = {
            SocialMediaID: socialMediaID
        };
        var url = '/ProductAdmin/WebAdmin/GetSocialMediaByID/';
        CommonUtility.RequestAjax('GET', url, data, Sucess, null, null, null);
    });
    //#endregion

    //#region Function return
    return {
        BindSocialMediaList: BindSocialMediaList,
        AddSocialMedia: AddSocialMedia,
        Clear: Clear,
        DeleteData: DeleteData,
        DeleteSocialMedia: DeleteSocialMedia
    }
    //#endregion

})();