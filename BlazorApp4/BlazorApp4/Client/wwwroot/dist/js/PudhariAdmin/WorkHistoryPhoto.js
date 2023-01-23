var WorkHistory = (function () {

    //#region Ready Function Start Point
    $(document).ready(function () {
        BindDropdown("#ddlWorkName", "WorkHistory", "", true);
        BindWorkHistoryPhotoList();
    });
    //#endregion
    var optionSelect = "<option value='0' selected>Select value.. </option";
    //#region Bind DropDown  List
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

        var url = '/PudhariAdmin/Work/GetActiveWorkNames/';
        if (isAsync)
            CommonUtility.RequestAjax('GET', url, "", BindDropDownData, null, null, null);
        else
            CommonUtility.RequestAjaxAsync('GET', url, "", BindDropDownData, null, null, null);

    }
    //#region Bind Category List
    function BindWorkHistoryPhotoList() {
        var ValiditySuccess = function (result) {
            if (result != "" || result.length >= 0) {
                $('#workHistoryPhotolist').DataTable({
                    data: result,
                    "bFilter": true,
                    "bLengthChange": true,
                    "bDestroy": true,
                    "lengthMenu": [[5, 10, 25, -1], [5, 10, 25, "All"]],
                    columns: [
                        { data: 'WorkId' },
                        { data: 'PhotoCaption' },
                        { data: 'PhotoUrl' },
                        { data: 'Status' },
                        {
                            "data": "WorkHistoryPhotoId",
                            "searchable": false,
                            "sortable": false,
                            "render": function (data, type, full, meta) {
                                return '<i class="fas fa-edit" id="editWorkHistoryPhoto" data-value ="' + data + '"></i>|<i class="fas fa-trash-alt" id="deleteWorkHistoryPhoto" data-value ="' + data + '" ></i>';
                            }
                        }
                    ]
                });
            }
        }

        var url = '/PudhariAdmin/Work/GetWorkHistoryPhotoList/';
        CommonUtility.RequestAjax('POST', url, "", ValiditySuccess, null, null, null);
    }
    //#endregion

    //#region Add New Category
    $('body').on('click', "#btnSubmit", function () {
        var workName = CommonUtility.ScriptInjection($("#ddlWorkName").val()).replace(/</g, "").replace(/>/g, "");
        var PhotoCaption = CommonUtility.ScriptInjection($("#txtPhotoCaption").val()).replace(/</g, "").replace(/>/g, "");
        var PhotoUrl = CommonUtility.ScriptInjection($("#txtPhotoUrl").val()).replace(/</g, "").replace(/>/g, "");
        var desc = $("#txtDesc").summernote('code');
        var status = CommonUtility.ScriptInjection($("#ddlStatus").val()).replace(/</g, "").replace(/>/g, "");
        var workHistoryPhotoId = CommonUtility.ScriptInjection($("#hdnWorkHistoryPhotoId").val()).replace(/</g, "").replace(/>/g, "");

        var workNameCheck = CommonValidation.MandetoryControlValueCheck("DROPDOWN", "ddlWorkName");
        var PhotoUrlCheck = CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtPhotoUrl");

        if (workNameCheck && PhotoUrlCheck) {
            if (workHistoryPhotoId != "")
                UpdateWorkHistoryPhoto(workName, PhotoCaption, workName, PhotoUrl, desc, status, workHistoryPhotoId)
            else
                AddWorkHistoryPhoto(workName, PhotoCaption, workName, PhotoUrl, desc, status,);
        }
    });

    function AddWorkHistoryPhoto(workName, PhotoCaption, workName, PhotoUrl, desc, status,) {
        var ValiditySuccess = function (result) {
            if (result != "" || result.length > 0) {
                Clear();
                BindWorkHistoryPhotoList();
                if (result === 1)
                    CommonUtility.SucessMessagePopUp("Work history Photo saved successfully.");
                if (result === -1)
                    CommonUtility.SucessMessagePopUp("Work history Photo exists, could you try another name.");
            }
        }
        var data = {
            WorkId: workName,
            PhotoUrl: PhotoUrl,
            PhotoCaption: PhotoCaption,
            Description: desc,
            Status: status,
        };
        var url = '/PudhariAdmin/Work/AddWorkHistoryPhoto/';
        CommonUtility.RequestAjax('POST', url, data, ValiditySuccess, null, null, null);
    }

    function UpdateWorkHistoryPhoto(workName, PhotoCaption, workName, PhotoUrl, desc, status, workHistoryPhotoId) {
        var Success = function (result) {
            if (result != "" || result.length > 0) {
                Clear();
                CommonUtility.SucessMessagePopUp("Work history Photo updated successfully.");
                BindWorkHistoryPhotoList();
            }
        }
        var data = {
            WorkHistoryPhotoId: workHistoryPhotoId,
            WorkId: workName,
            PhotoUrl: PhotoUrl,
            PhotoCaption: PhotoCaption,
            Description: desc,
            Status: status,
        };
        var url = '/PudhariAdmin/Work/UpdateWorkHistoryPhoto/';
        CommonUtility.RequestAjax('POST', url, data, Success, null, null, null);
    }
    //#endregion

    //#region Validation
    $('#ddlWorkName').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("DROPDOWN", "ddlWorkName");
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
        $("#ddlWorkName").val("0");
        $("#ddlStatus").val("True");
        $("#txtPhotoCaption").val("");
        $("#txtPhotoUrl").val("");
        $("#txtDesc").summernote("reset");
        $("#hdnWorkHistoryPhotoId").val("");


        $("#errddlWorkName").html("").hide();
        $("#errtxtPhotoUrl").html("").hide();
    }
    //#endregion

    //#region delete Category
    $('body').on('click', "#deleteWorkHistoryPhoto", function () {
        var id = $(this).attr('data-value');
        CommonUtility.DeleteWarningMessagePopIp("Are you sure you want to delete Work history Photo", id);
    });
    $('body').on('click', "#finaldelete", function () {
        var id = $(this).attr('data-myval')
        DeleteWorkHistoryPhoto(id);
    });
    function DeleteWorkHistoryPhoto(workHistoryPhotoId) {
        var workHistoryPhotoId = CommonUtility.ScriptInjection(workHistoryPhotoId).replace(/</g, "").replace(/>/g, "");
        var Success = function (result) {
            if (result != "" || result.length > 0) {
                $("#modal-delete-danger").modal('hide');
                CommonUtility.SucessMessagePopUp("Work history Photo deleted successfully.");
                BindWorkHistoryPhotoList();
                Clear();
            }
        }
        var data = {
            WorkHistoryPhotoId: workHistoryPhotoId
        };
        var url = '/PudhariAdmin/Work/DeleteWorkHistoryPhoto/';
        CommonUtility.RequestAjax('POST', url, data, Success, null, null, null);
    }
    //#endregion

    //#region Edit Category
    $('body').on('click', "#editWorkHistoryPhoto", function () {
        var workHistoryPhotoId = $(this).attr('data-value');
        var BindSuccess = function (result) {
            if (result != "" || result.length >= 0) {
                $("#ddlWorkName").val(result.WorkId);
                $("#ddlStatus").val(result.Status);
                $("#txtPhotoCaption").val(result.PhotoCaption)
                $("#txtDesc").summernote("code", result.Description);
                $("#hdnWorkHistoryPhotoId").val(result.WorkHistoryPhotoId);
            }
        }
        var data = {
            WorkHistoryPhotoId: workHistoryPhotoId
        };
        var url = '/PudhariAdmin/Work/GetWorkHistoryPhotoById/';
        CommonUtility.RequestAjax('GET', url, data, BindSuccess, null, null, null);
    });
    //#endregion

    //#region Function return
    return {
        BindWorkHistoryPhotoList: BindWorkHistoryPhotoList,
        AddWorkHistoryPhoto: AddWorkHistoryPhoto,
        Clear: Clear,
        DeleteWorkHistoryPhoto: DeleteWorkHistoryPhoto
    }
    //#endregion

})();



