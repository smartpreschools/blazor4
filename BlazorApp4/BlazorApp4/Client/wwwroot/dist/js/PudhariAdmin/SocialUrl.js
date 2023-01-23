var SocialUrl = (function () {
    //#region Ready Function Start Point
    $(document).ready(function () {
        BindSocialUrlList();
    });
    //#endregion

    //#region Bind Category List
    function BindSocialUrlList() {
        var ValiditySuccess = function (result) {
            if (result != "" || result.length >= 0) {
                $('#socialUrlList').DataTable({
                    data: result,
                    "bFilter": true,
                    "bLengthChange": true,
                    "bDestroy": true,
                    "lengthMenu": [[5, 10, 25, -1], [5, 10, 25, "All"]],
                    columns: [
                        { data: 'FaceBook' },
                        { data: 'Youtube' },
                        { data: 'Twitter' },
                        { data: 'Whatsup' },
                        { data: 'Status' },
                        {
                            "data": "Id",
                            "searchable": false,
                            "sortable": false,
                            "render": function (data, type, full, meta) {
                                return '<i class="fas fa-edit" id="editSocialUrl" data-value ="' + data + '"></i>|<i class="fas fa-trash-alt" id="deleteSocialUrl" data-value ="' + data + '" ></i>';
                            }
                        }
                    ]
                });
            }
        }

        var url = '/PudhariAdmin/SocialMedia/GetSocialUrlList/';
        CommonUtility.RequestAjax('POST', url, "", ValiditySuccess, null, null, null);
    }
    //#endregion

    //#region Add New Category
    $('body').on('click', "#btnSubmit", function () {
        var facebook = $("#txtFacebook").val();
        var twitter = $("#txtTwitter").val();
        var dribble = $("#txtDribble").val();
        var flicker = $("#txtFlicker").val();
        var linkedin = $("#txtLinkedIn").val();
        var wekipedia = $("#txtWekipedia").val();
        var instagram = $("#txtInstagram").val();
        var googlemap = $("#txtGooglemap").val();
        var whatsup = $("#txtWhatsup").val();
        var youtube = $("#txtYoutube").val();
        var status = $("#ddlStatus").val();

        var Id = CommonUtility.ScriptInjection($("#hdnSocialUrlId").val()).replace(/</g, "").replace(/>/g, "");

        var whatsupStatus = CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtWhatsup");

        if (whatsupStatus) {
            if (Id != "")
                UpdateSocialUrl(facebook, twitter, dribble, flicker, linkedin, wekipedia, instagram, googlemap, whatsup, youtube, status, Id);
            else
                AddSocialUrl(facebook, twitter, dribble, flicker, linkedin, wekipedia, instagram, googlemap, whatsup, youtube, status);
        }
    });

    function AddSocialUrl(facebook, twitter, dribble, flicker, linkedin, wekipedia, instagram, googlemap, whatsup, youtube, status) {
        var ValiditySuccess = function (result) {
            if (result != "" || result.length > 0) {
                Clear();
                BindSocialUrlList();
                if (result === 1)
                    CommonUtility.SucessMessagePopUp("Social Url details saved successfully.");
                if (result === -1)
                    CommonUtility.SucessMessagePopUp("Social Url details exists, could you try another name.");
            }
        }
        var data = {
            FaceBook: facebook,
            Twitter: twitter,
            Dribble: dribble,
            Flicker: flicker,
            LinkedIn: linkedin,
            WekiPedia: wekipedia,
            Instagram: instagram,
            GoogleMap: googlemap,
            Whatsup: whatsup,
            Youtube: youtube,
            Status: status
        };
        var url = '/PudhariAdmin/SocialMedia/SocialUrl/';
        CommonUtility.RequestAjax('POST', url, data, ValiditySuccess, null, null, null);
    }

    function UpdateSocialUrl(facebook, twitter, dribble, flicker, linkedin, wekipedia, instagram, googlemap, whatsup, youtube, status, id) {
        var ValiditySuccess = function (result) {
            if (result != "" || result.length > 0) {
                Clear();
                CommonUtility.SucessMessagePopUp("Social Url details updated successfully.");
                BindSocialUrlList();
            }
        }
        var data = {
            Id: id,
            FaceBook: facebook,
            Twitter: twitter,
            Dribble: dribble,
            Flicker: flicker,
            LinkedIn: linkedin,
            WekiPedia: wekipedia,
            Instagram: instagram,
            GoogleMap: googlemap,
            Whatsup: whatsup,
            Youtube: youtube,
            Status: status
        };
        var url = '/PudhariAdmin/SocialMedia/UpdateSocialUrl/';
        CommonUtility.RequestAjax('POST', url, data, ValiditySuccess, null, null, null);
    }
    //#endregion

    //#region Validation
    $('#txtWhatsup').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtWhatsup");
    });

    //#endregion

    //#region clear PoliticalParty controls
    $('body').on('click', "#btnClear", function () {
        Clear();
    });

    function Clear() {
        $("#txtFacebook").val('');
        $("#txtTwitter").val('');
        $("#txtDribble").val('');
        $("#txtFlicker").val('');
        $("#txtLinkedIn").val('');
        $("#txtWekipedia").val('');
        $("#txtInstagram").val('');
        $("#txtGooglemap").val('');
        $("#txtWhatsup").val('');
        $("#txtYoutube").val('');
        $("#ddlStatus").val('True');

        $("#errtxtWhatsup").html("").hide();
    }
    //#endregion

    //#region delete Category
    $('body').on('click', "#deleteSocialUrl", function () {
        var id = $(this).attr('data-value');
        CommonUtility.DeleteWarningMessagePopIp("Are you sure you want to delete SocialUrl details", id);
    });
    $('body').on('click', "#finaldelete", function () {
        var id = $(this).attr('data-myval')
        DeleteSocialUrl(id);
    });
    function DeleteSocialUrl(id) {
        var id = CommonUtility.ScriptInjection(id).replace(/</g, "").replace(/>/g, "");
        var Success = function (result) {
            if (result != "" || result.length > 0) {
                $("#modal-delete-danger").modal('hide');
                CommonUtility.SucessMessagePopUp("Social Url details Deleted successfully.");
                BindSocialUrlList();
                Clear();
            }
        }
        var data = {
            id: id
        };
        var url = '/PudhariAdmin/SocialMedia/DeleteSocialUrl/';
        CommonUtility.RequestAjax('POST', url, data, Success, null, null, null);
    }
    //#endregion

    //#region Edit Category
    $('body').on('click', "#editSocialUrl", function () {
        var id = $(this).attr('data-value');
        var BindSuccess = function (result) {
            if (result != "" || result.length >= 0) {
                $("#txtFacebook").val(result.FaceBook);
                $("#txtTwitter").val(result.Twitter);
                $("#txtDribble").val(result.Dribble);
                $("#txtFlicker").val(result.Flicker);
                $("#txtLinkedIn").val(result.LinkedIn);
                $("#txtWekipedia").val(result.WekiPedia);
                $("#txtInstagram").val(result.Instagram);
                $("#txtGooglemap").val(result.GoogleMap);
                $("#txtWhatsup").val(result.Whatsup);
                $("#txtYoutube").val(result.Youtube);
                $("#ddlStatus").val(result.Status);
                $("#hdnSocialUrlId").val(result.Id);
            }
        }
        var data = {
            id: id
        };
        var url = '/PudhariAdmin/SocialMedia/GetSocialUrlById/';
        CommonUtility.RequestAjax('GET', url, data, BindSuccess, null, null, null);
    });
    //#endregion

    //#region Function return
    return {
        BindSocialUrlList: BindSocialUrlList,
        AddSocialUrl: AddSocialUrl,
        Clear: Clear,
        DeleteSocialUrl: DeleteSocialUrl
    }
    //#endregion

})();
