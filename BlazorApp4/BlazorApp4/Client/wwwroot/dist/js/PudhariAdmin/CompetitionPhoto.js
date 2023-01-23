var Competition = (function () {

    //#region Ready Function Start Point
    $(document).ready(function () {
        BindDropdown("#ddlCompetitionName", "Competition", "", true);
        BindCompetitionPhotoList();
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

        var url = '/PudhariAdmin/Competition/GetActiveCompetitionNames/';
        if (isAsync)
            CommonUtility.RequestAjax('GET', url, "", BindDropDownData, null, null, null);
        else
            CommonUtility.RequestAjaxAsync('GET', url, "", BindDropDownData, null, null, null);

    }
    //#region Bind Category List
    function BindCompetitionPhotoList() {
        var ValiditySuccess = function (result) {
            if (result != "" || result.length >= 0) {
                $('#competitionPhotolist').DataTable({
                    data: result,
                    "bFilter": true,
                    "bLengthChange": true,
                    "bDestroy": true,
                    "lengthMenu": [[5, 10, 25, -1], [5, 10, 25, "All"]],
                    columns: [
                        { data: 'CompetitionId' },
                        { data: 'PhotoCaption' },
                        { data: 'PhotoUrl' },
                        { data: 'Status' },
                        {
                            "data": "PhotoId",
                            "searchable": false,
                            "sortable": false,
                            "render": function (data, type, full, meta) {
                                return '<i class="fas fa-edit" id="editCompetitionPhoto" data-value ="' + data + '"></i>|<i class="fas fa-trash-alt" id="deleteCompetitionPhoto" data-value ="' + data + '" ></i>';
                            }
                        }
                    ]
                });
            }
        }

        var url = '/PudhariAdmin/Competition/GetCompetitionPhotoList/';
        CommonUtility.RequestAjax('POST', url, "", ValiditySuccess, null, null, null);
    }
    //#endregion

    //#region Add New Category
    $('body').on('click', "#btnSubmit", function () {
        var competitionName = CommonUtility.ScriptInjection($("#ddlCompetitionName").val()).replace(/</g, "").replace(/>/g, "");
        var photoCaption = CommonUtility.ScriptInjection($("#txtPhotoCaption").val()).replace(/</g, "").replace(/>/g, "");
        var photoUrl = CommonUtility.ScriptInjection($("#txtPhotoUrl").val()).replace(/</g, "").replace(/>/g, "");
        var desc = $("#txtDesc").summernote('code');
        var status = CommonUtility.ScriptInjection($("#ddlStatus").val()).replace(/</g, "").replace(/>/g, "");
        var photoId = CommonUtility.ScriptInjection($("#hdnCompetitionPhotoId").val()).replace(/</g, "").replace(/>/g, "");

        var competitionNameCheck = CommonValidation.MandetoryControlValueCheck("DROPDOWN", "ddlCompetitionName");
        var photoUrlCheck = CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtPhotoUrl");

        if (competitionNameCheck && photoUrlCheck) {
            if (photoId != "")
                UpdateCompetitionPhoto(competitionName, photoCaption, competitionName, photoUrl, desc, status, photoId)
            else
                AddCompetitionPhoto(competitionName, photoCaption, competitionName, photoUrl, desc, status,);
        }
    });

    function AddCompetitionPhoto(competitionName, photoCaption, competitionName, photoUrl, desc, status,) {
        var ValiditySuccess = function (result) {
            if (result != "" || result.length > 0) {
                Clear();
                BindCompetitionPhotoList();
                if (result === 1)
                    CommonUtility.SucessMessagePopUp("Competition  photo saved successfully.");
                if (result === -1)
                    CommonUtility.SucessMessagePopUp("Competition photo exists, could you try another name.");
            }
        }
        var data = {
            CompetitionId: competitionName,
            PhotoUrl: photoUrl,
            PhotoCaption: photoCaption,
            Description: desc,
            Status: status,
        };
        var url = '/PudhariAdmin/Competition/AddCompetitionPhoto/';
        CommonUtility.RequestAjax('POST', url, data, ValiditySuccess, null, null, null);
    }

    function UpdateCompetitionPhoto(competitionName, photoCaption, competitionName, photoUrl, desc, status, photoId) {
        var Success = function (result) {
            if (result != "" || result.length > 0) {
                Clear();
                CommonUtility.SucessMessagePopUp("Competition photo updated successfully.");
                BindCompetitionPhotoList();
            }
        }
        var data = {
            PhotoId: photoId,
            CompetitionId: competitionName,
            PhotoUrl: photoUrl,
            PhotoCaption: photoCaption,
            Description: desc,
            Status: status,
        };
        var url = '/PudhariAdmin/Competition/UpdateCompetitionPhoto/';
        CommonUtility.RequestAjax('POST', url, data, Success, null, null, null);
    }
    //#endregion

    //#region Validation
    $('#ddlCompetitionName').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("DROPDOWN", "ddlCompetitionName");
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
        $("#ddlCompetitionName").val("0");
        $("#ddlStatus").val("True");
        $("#txtPhotoCaption").val("");
        $("#txtPhotoUrl").val("");
        $("#txtDesc").summernote("reset");
        $("#hdnCompetitionPhotoId").val("");


        $("#errddlCompetitionName").html("").hide();
        $("#errtxtPhotoUrl").html("").hide();
    }
    //#endregion

    //#region delete Category
    $('body').on('click', "#deleteCompetitionPhoto", function () {
        var id = $(this).attr('data-value');
        CommonUtility.DeleteWarningMessagePopIp("Are you sure you want to delete competition photo", id);
    });
    $('body').on('click', "#finaldelete", function () {
        var id = $(this).attr('data-myval')
        DeleteCompetitionPhoto(id);
    });
    function DeleteCompetitionPhoto(competitionHistoryPhotoId) {
        var competitionHistoryPhotoId = CommonUtility.ScriptInjection(competitionHistoryPhotoId).replace(/</g, "").replace(/>/g, "");
        var Success = function (result) {
            if (result != "" || result.length > 0) {
                $("#modal-delete-danger").modal('hide');
                CommonUtility.SucessMessagePopUp("Competition photo deleted successfully.");
                BindCompetitionPhotoList();
                Clear();
            }
        }
        var data = {
            CompetitionPhotoId: competitionHistoryPhotoId
        };
        var url = '/PudhariAdmin/Competition/DeleteCompetitionPhoto/';
        CommonUtility.RequestAjax('POST', url, data, Success, null, null, null);
    }
    //#endregion

    //#region Edit Category
    $('body').on('click', "#editCompetitionPhoto", function () {
        var competitionPhotoId = $(this).attr('data-value');
        var BindSuccess = function (result) {
            if (result != "" || result.length >= 0) {
                $("#ddlCompetitionName").val(result.CompetitionId);
                $("#ddlStatus").val(result.Status);
                $("#txtPhotoCaption").val(result.PhotoCaption)
                $("#txtDesc").summernote("code", result.Description);
                $("#hdnCompetitionPhotoId").val(result.PhotoId);
            }
        }
        var data = {
            CompetitionPhotoId: competitionPhotoId
        };
        var url = '/PudhariAdmin/Competition/GetCompetitionPhotoById/';
        CommonUtility.RequestAjax('GET', url, data, BindSuccess, null, null, null);
    });
    //#endregion

    //#region Function return
    return {
        BindCompetitionPhotoList: BindCompetitionPhotoList,
        AddCompetitionPhoto: AddCompetitionPhoto,
        Clear: Clear,
        DeleteCompetitionPhoto: DeleteCompetitionPhoto
    }
    //#endregion

})();



