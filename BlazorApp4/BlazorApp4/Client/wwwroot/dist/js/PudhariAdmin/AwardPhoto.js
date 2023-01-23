var Award = (function () {

    //#region Ready Function Start Point
    $(document).ready(function () {
        BindDropdown("#ddlAwardName", "Award", "", true);
        BindAwardPhotoList();
    });
    //#endregion
    var optionSelect = "<option value='0' selected>Select value.. </option";
    //#region Bind DropDown  List
    function BindDropdown(contrlID, DrpName, inputValue, isAsync) {
        var BindDropDownData = function (result) {
            if (result != "" || result.length > 0) {
                $(contrlID + " option").remove();
                $.map(result, function (opt) {
                    var option = $('<option>' + opt.Name + '</option>');
                    option.attr('value', opt.AwardId);
                    $(contrlID).append(option);
                });
                $(contrlID + " option").remove("0");
                $(contrlID).prepend(optionSelect);
            }
        }

        var url = '/PudhariAdmin/Awards/GetActiveAwardNames/';
        if (isAsync)
            CommonUtility.RequestAjax('GET', url, "", BindDropDownData, null, null, null);
        else
            CommonUtility.RequestAjaxAsync('GET', url, "", BindDropDownData, null, null, null);

    }
    //#region Bind Category List
    function BindAwardPhotoList() {
        var ValiditySuccess = function (result) {
            if (result != "" || result.length >= 0) {
                $('#awardPhotolist').DataTable({
                    data: result,
                    "bFilter": true,
                    "bLengthChange": true,
                    "bDestroy": true,
                    "lengthMenu": [[5, 10, 25, -1], [5, 10, 25, "All"]],
                    columns: [
                        { data: 'AwardId' },
                        { data: 'PhotoCaption' },
                        { data: 'PhotoUrl' },
                        { data: 'Status' },
                        {
                            "data": "PhotoId",
                            "searchable": false,
                            "sortable": false,
                            "render": function (data, type, full, meta) {
                                return '<i class="fas fa-edit" id="editAwardPhoto" data-value ="' + data + '"></i>|<i class="fas fa-trash-alt" id="deleteAwardPhoto" data-value ="' + data + '" ></i>';
                            }
                        }
                    ]
                });
            }
        }

        var url = '/PudhariAdmin/Awards/GetAwardPhotoList/';
        CommonUtility.RequestAjax('POST', url, "", ValiditySuccess, null, null, null);
    }
    //#endregion

    //#region Add New Category
    $('body').on('click', "#btnSubmit", function () {
        var awardName = CommonUtility.ScriptInjection($("#ddlAwardName").val()).replace(/</g, "").replace(/>/g, "");
        var photoCaption = CommonUtility.ScriptInjection($("#txtPhotoCaption").val()).replace(/</g, "").replace(/>/g, "");
        var photoUrl = CommonUtility.ScriptInjection($("#txtPhotoUrl").val()).replace(/</g, "").replace(/>/g, "");
        var desc = $("#txtDesc").summernote('code');
        var status = CommonUtility.ScriptInjection($("#ddlStatus").val()).replace(/</g, "").replace(/>/g, "");
        var photoId = CommonUtility.ScriptInjection($("#hdnAwardPhotoId").val()).replace(/</g, "").replace(/>/g, "");

        var awardNameCheck = CommonValidation.MandetoryControlValueCheck("DROPDOWN", "ddlAwardName");
        var photoUrlCheck = CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtPhotoUrl");

        if (awardNameCheck && photoUrlCheck) {
            if (photoId != "")
                UpdateAwardPhoto(awardName, photoCaption, awardName, photoUrl, desc, status, photoId)
            else
                AddAwardPhoto(awardName, photoCaption, awardName, photoUrl, desc, status,);
        }
    });

    function AddAwardPhoto(awardName, photoCaption, awardName, photoUrl, desc, status,) {
        var ValiditySuccess = function (result) {
            if (result != "" || result.length > 0) {
                Clear();
                BindAwardPhotoList();
                if (result === 1)
                    CommonUtility.SucessMessagePopUp("Award  photo saved successfully.");
                if (result === -1)
                    CommonUtility.SucessMessagePopUp("Award photo exists, could you try another name.");
            }
        }
        var data = {
            AwardId: awardName,
            PhotoUrl: photoUrl,
            PhotoCaption: photoCaption,
            Description: desc,
            Status: status,
        };
        var url = '/PudhariAdmin/Awards/AddAwardPhoto/';
        CommonUtility.RequestAjax('POST', url, data, ValiditySuccess, null, null, null);
    }

    function UpdateAwardPhoto(awardName, photoCaption, awardName, photoUrl, desc, status, photoId) {
        var Success = function (result) {
            if (result != "" || result.length > 0) {
                Clear();
                CommonUtility.SucessMessagePopUp("Award photo updated successfully.");
                BindAwardPhotoList();
            }
        }
        var data = {
            PhotoId: photoId,
            AwardId: awardName,
            PhotoUrl: photoUrl,
            PhotoCaption: photoCaption,
            Description: desc,
            Status: status,
        };
        var url = '/PudhariAdmin/Awards/UpdateAwardPhoto/';
        CommonUtility.RequestAjax('POST', url, data, Success, null, null, null);
    }
    //#endregion

    //#region Validation
    $('#ddlAwardName').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("DROPDOWN", "ddlAwardName");
    });

    $('#txtPhotoUrl').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtPhotoUrl");
    });

    //#endregion

    //#region clear PoliticalParty controls
    $('body').on('click', "#btnClear", function () {
        Clear();
    });

    function Clear() {
        $("#ddlAwardName").val("0");
        $("#ddlStatus").val("True");
        $("#txtPhotoCaption").val("");
        $("#txtPhotoUrl").val("");
        $("#txtDesc").summernote("reset");
        $("#hdnAwardPhotoId").val("");


        $("#errddlAwardName").html("").hide();
        $("#errtxtPhotoUrl").html("").hide();
    }
    //#endregion

    //#region delete Category
    $('body').on('click', "#deleteAwardPhoto", function () {
        var id = $(this).attr('data-value');
        CommonUtility.DeleteWarningMessagePopIp("Are you sure you want to delete award photo", id);
    });
    $('body').on('click', "#finaldelete", function () {
        var id = $(this).attr('data-myval')
        DeleteAwardPhoto(id);
    });
    function DeleteAwardPhoto(awardPhotoId) {
        var awardPhotoId = CommonUtility.ScriptInjection(awardPhotoId).replace(/</g, "").replace(/>/g, "");
        var Success = function (result) {
            if (result != "" || result.length > 0) {
                $("#modal-delete-danger").modal('hide');
                CommonUtility.SucessMessagePopUp("Award photo deleted successfully.");
                BindAwardPhotoList();
                Clear();
            }
        }
        var data = {
            awardPhotoId: awardPhotoId
        };
        var url = '/PudhariAdmin/Awards/DeleteAwardPhoto/';
        CommonUtility.RequestAjax('POST', url, data, Success, null, null, null);
    }
    //#endregion

    //#region Edit Category
    $('body').on('click', "#editAwardPhoto", function () {
        var awardPhotoId = $(this).attr('data-value');
        var BindSuccess = function (result) {
            if (result != "" || result.length >= 0) {
                $("#ddlAwardName").val(result.AwardId);
                $("#ddlStatus").val(result.Status);
                $("#txtPhotoCaption").val(result.PhotoCaption)
                $("#txtDesc").summernote("code", result.Description);
                $("#hdnAwardPhotoId").val(result.PhotoId);
            }
        }
        var data = {
            awardPhotoId: awardPhotoId
        };
        var url = '/PudhariAdmin/Awards/GetAwardPhotoById/';
        CommonUtility.RequestAjax('GET', url, data, BindSuccess, null, null, null);
    });
    //#endregion

    //#region Function return
    return {
        BindAwardPhotoList: BindAwardPhotoList,
        AddAwardPhoto: AddAwardPhoto,
        Clear: Clear,
        DeleteAwardPhoto: DeleteAwardPhoto
    }
    //#endregion

})();



