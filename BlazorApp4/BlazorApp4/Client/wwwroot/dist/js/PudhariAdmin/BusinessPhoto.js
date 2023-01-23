var Business = (function () {

    //#region Ready Function Start Point
    $(document).ready(function () {
        BindDropdown("#ddlBusinessName", "Business", "", true);
        BindBusinessPhotoList();
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
                    option.attr('value', opt.Id);
                    $(contrlID).append(option);
                });
                $(contrlID + " option").remove("0");
                $(contrlID).prepend(optionSelect);
            }
        }

        var url = '/PudhariAdmin/Business/GetActiveBusinessNames/';
        if (isAsync)
            CommonUtility.RequestAjax('GET', url, "", BindDropDownData, null, null, null);
        else
            CommonUtility.RequestAjaxAsync('GET', url, "", BindDropDownData, null, null, null);

    }
    //#region Bind Category List
    function BindBusinessPhotoList() {
        var ValiditySuccess = function (result) {
            if (result != "" || result.length >= 0) {
                $('#businessPhotolist').DataTable({
                    data: result,
                    "bFilter": true,
                    "bLengthChange": true,
                    "bDestroy": true,
                    "lengthMenu": [[5, 10, 25, -1], [5, 10, 25, "All"]],
                    columns: [
                        { data: 'Business' },
                        { data: 'PhotoCaption' },
                        { data: 'PhotoUrl' },
                        { data: 'Status' },
                        {
                            "data": "PhotoId",
                            "searchable": false,
                            "sortable": false,
                            "render": function (data, type, full, meta) {
                                return '<i class="fas fa-edit" id="editBusinessPhoto" data-value ="' + data + '"></i>|<i class="fas fa-trash-alt" id="deleteBusinessPhoto" data-value ="' + data + '" ></i>';
                            }
                        }
                    ]
                });
            }
        }

        var url = '/PudhariAdmin/Business/GetBusinessPhotoList/';
        CommonUtility.RequestAjax('POST', url, "", ValiditySuccess, null, null, null);
    }
    //#endregion

    //#region Add New Category
    $('body').on('click', "#btnSubmit", function () {
        var businessName = CommonUtility.ScriptInjection($("#ddlBusinessName").val()).replace(/</g, "").replace(/>/g, "");
        var photoCaption = CommonUtility.ScriptInjection($("#txtPhotoCaption").val()).replace(/</g, "").replace(/>/g, "");
        var photoUrl = CommonUtility.ScriptInjection($("#txtPhotoUrl").val()).replace(/</g, "").replace(/>/g, "");
        var desc = $("#txtDesc").summernote('code');
        var status = CommonUtility.ScriptInjection($("#ddlStatus").val()).replace(/</g, "").replace(/>/g, "");
        var photoId = CommonUtility.ScriptInjection($("#hdnBusinessPhotoId").val()).replace(/</g, "").replace(/>/g, "");

        var businessNameCheck = CommonValidation.MandetoryControlValueCheck("DROPDOWN", "ddlBusinessName");
        var photoUrlCheck = CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtPhotoUrl");

        if (businessNameCheck && photoUrlCheck) {
            if (photoId != "")
                UpdateBusinessPhoto(businessName, photoCaption, businessName, photoUrl, desc, status, photoId)
            else
                AddBusinessPhoto(businessName, photoCaption, businessName, photoUrl, desc, status,);
        }
    });

    function AddBusinessPhoto(businessName, photoCaption, businessName, photoUrl, desc, status,) {
        var ValiditySuccess = function (result) {
            if (result != "" || result.length > 0) {
                Clear();
                BindBusinessPhotoList();
                if (result === 1)
                    CommonUtility.SucessMessagePopUp("Business  photo saved successfully.");
                if (result === -1)
                    CommonUtility.SucessMessagePopUp("Business photo exists, could you try another name.");
            }
        }
        var data = {
            Business: businessName,
            PhotoUrl: photoUrl,
            PhotoCaption: photoCaption,
            Description: desc,
            Status: status,
        };
        var url = '/PudhariAdmin/Business/AddBusinessPhoto/';
        CommonUtility.RequestAjax('POST', url, data, ValiditySuccess, null, null, null);
    }

    function UpdateBusinessPhoto(businessName, photoCaption, businessName, photoUrl, desc, status, photoId) {
        var Success = function (result) {
            if (result != "" || result.length > 0) {
                Clear();
                CommonUtility.SucessMessagePopUp("Business photo updated successfully.");
                BindBusinessPhotoList();
            }
        }
        var data = {
            PhotoId: photoId,
            Business: businessName,
            PhotoUrl: photoUrl,
            PhotoCaption: photoCaption,
            Description: desc,
            Status: status,
        };
        var url = '/PudhariAdmin/Business/UpdateBusinessPhoto/';
        CommonUtility.RequestAjax('POST', url, data, Success, null, null, null);
    }
    //#endregion

    //#region Validation
    $('#ddlBusinessName').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("DROPDOWN", "ddlBusinessName");
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
        $("#ddlBusinessName").val("0");
        $("#ddlStatus").val("True");
        $("#txtPhotoCaption").val("");
        $("#txtPhotoUrl").val("");
        $("#txtDesc").summernote("reset");
        $("#hdnBusinessPhotoId").val("");


        $("#errddlBusinessName").html("").hide();
        $("#errtxtPhotoUrl").html("").hide();
    }
    //#endregion

    //#region delete Category
    $('body').on('click', "#deleteBusinessPhoto", function () {
        var id = $(this).attr('data-value');
        CommonUtility.DeleteWarningMessagePopIp("Are you sure you want to delete business photo", id);
    });
    $('body').on('click', "#finaldelete", function () {
        var id = $(this).attr('data-myval')
        DeleteBusinessPhoto(id);
    });
    function DeleteBusinessPhoto(businessHistoryPhotoId) {
        var businessHistoryPhotoId = CommonUtility.ScriptInjection(businessHistoryPhotoId).replace(/</g, "").replace(/>/g, "");
        var Success = function (result) {
            if (result != "" || result.length > 0) {
                $("#modal-delete-danger").modal('hide');
                CommonUtility.SucessMessagePopUp("Business photo deleted successfully.");
                BindBusinessPhotoList();
                Clear();
            }
        }
        var data = {
            BusinessPhotoId: businessHistoryPhotoId
        };
        var url = '/PudhariAdmin/Business/DeleteBusinessPhoto/';
        CommonUtility.RequestAjax('POST', url, data, Success, null, null, null);
    }
    //#endregion

    //#region Edit Category
    $('body').on('click', "#editBusinessPhoto", function () {
        var businessPhotoId = $(this).attr('data-value');
        var BindSuccess = function (result) {
            if (result != "" || result.length >= 0) {
                $("#ddlBusinessName").val(result.Business);
                $("#ddlStatus").val(result.Status);
                $("#txtPhotoCaption").val(result.PhotoCaption)
                $("#txtDesc").summernote("code", result.Description);
                $("#hdnBusinessPhotoId").val(result.PhotoId);
            }
        }
        var data = {
            BusinessPhotoId: businessPhotoId
        };
        var url = '/PudhariAdmin/Business/GetBusinessPhotoById/';
        CommonUtility.RequestAjax('GET', url, data, BindSuccess, null, null, null);
    });
    //#endregion

    //#region Function return
    return {
        BindBusinessPhotoList: BindBusinessPhotoList,
        AddBusinessPhoto: AddBusinessPhoto,
        Clear: Clear,
        DeleteBusinessPhoto: DeleteBusinessPhoto
    }
    //#endregion

})();



