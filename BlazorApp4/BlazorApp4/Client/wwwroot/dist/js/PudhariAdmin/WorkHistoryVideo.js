var WorkHistory = (function () {

    //#region Ready Function Start Point
    $(document).ready(function () {
        BindDropdown("#ddlWorkName", "WorkHistory", "", true);
        BindWorkHistoryVideoList();
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
    function BindWorkHistoryVideoList() {
        var ValiditySuccess = function (result) {
            if (result != "" || result.length >= 0) {
                $('#workHistoryVideolist').DataTable({
                    data: result,
                    "bFilter": true,
                    "bLengthChange": true,
                    "bDestroy": true,
                    "lengthMenu": [[5, 10, 25, -1], [5, 10, 25, "All"]],
                    columns: [
                        { data: 'WorkId' },
                        { data: 'VideoCaption' },
                        { data: 'VideoUrl' },
                        { data: 'Status' },
                        {
                            "data": "WorkHistoryVideoId",
                            "searchable": false,
                            "sortable": false,
                            "render": function (data, type, full, meta) {
                                return '<i class="fas fa-edit" id="editWorkHistoryVideo" data-value ="' + data + '"></i>|<i class="fas fa-trash-alt" id="deleteWorkHistoryVideo" data-value ="' + data + '" ></i>';
                            }
                        }
                    ]
                });
            }
        }

        var url = '/PudhariAdmin/Work/GetWorkHistoryVideoList/';
        CommonUtility.RequestAjax('POST', url, "", ValiditySuccess, null, null, null);
    }
    //#endregion

    //#region Add New Category
    $('body').on('click', "#btnSubmit", function () {
        var workName = CommonUtility.ScriptInjection($("#ddlWorkName").val()).replace(/</g, "").replace(/>/g, "");
        var videoCaption = CommonUtility.ScriptInjection($("#txtVideoCaption").val()).replace(/</g, "").replace(/>/g, "");
        var videoUrl = CommonUtility.ScriptInjection($("#txtVideoUrl").val()).replace(/</g, "").replace(/>/g, "");
        var desc = $("#txtDesc").summernote('code');
        var status = CommonUtility.ScriptInjection($("#ddlStatus").val()).replace(/</g, "").replace(/>/g, "");
        var workHistoryVideoId = CommonUtility.ScriptInjection($("#hdnWorkHistoryVideoId").val()).replace(/</g, "").replace(/>/g, "");

        var workNameCheck = CommonValidation.MandetoryControlValueCheck("DROPDOWN", "ddlWorkName");
        var videoUrlCheck = CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtVideoUrl");

        if (workNameCheck && videoUrlCheck ) {
            if (workHistoryVideoId != "")
                UpdateWorkHistoryVideo(workName, videoCaption, workName, videoUrl, desc, status, workHistoryVideoId)
            else
                AddWorkHistoryVideo(workName, videoCaption, workName, videoUrl, desc, status,);
        }
    });

    function AddWorkHistoryVideo(workName, videoCaption, workName, videoUrl, desc, status,) {
        var ValiditySuccess = function (result) {
            if (result != "" || result.length > 0) {
                Clear();
                BindWorkHistoryVideoList();
                if (result === 1)
                    CommonUtility.SucessMessagePopUp("Work history video saved successfully.");
                if (result === -1)
                    CommonUtility.SucessMessagePopUp("Work history video exists, could you try another name.");
            }
        }
        var data = {
            WorkId: workName,
            VideoUrl: videoUrl,
            VideoCaption: videoCaption,
            Description: desc,
            Status: status,
        };
        var url = '/PudhariAdmin/Work/AddWorkHistoryVideo/';
        CommonUtility.RequestAjax('POST', url, data, ValiditySuccess, null, null, null);
    }

    function UpdateWorkHistoryVideo(workName, videoCaption, workName, videoUrl, desc, status, workHistoryVideoId) {
        var Success = function (result) {
            if (result != "" || result.length > 0) {
                Clear();
                CommonUtility.SucessMessagePopUp("Work history Video updated successfully.");
                BindWorkHistoryVideoList();
            }
        }
        var data = {
            WorkHistoryVideoId: workHistoryVideoId,
            WorkId: workName,
            VideoUrl: videoUrl,
            VideoCaption: videoCaption,
            Description: desc,
            Status: status,
        };
        var url = '/PudhariAdmin/Work/UpdateWorkHistoryVideo/';
        CommonUtility.RequestAjax('POST', url, data, Success, null, null, null);
    }
    //#endregion

    //#region Validation
    $('#ddlWorkName').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("DROPDOWN", "ddlWorkName");
    });
   
    $('#txtVideoUrl').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtVideoUrl");
    });

    //#endregion

    //#region clear PoliticalParty controls
    $('body').on('click', "#btnClear", function () {
        Clear();
    });

    function Clear() {
        $("#ddlWorkName").val("0");
        $("#ddlStatus").val("True");
        $("#txtVideoCaption").val("");
        $("#txtVideoUrl").val("");
        $("#txtDesc").summernote("reset");
        $("#hdnWorkHistoryVideoId").val("");


        $("#errddlWorkName").html("").hide();
        $("#errtxtVideoUrl").html("").hide();
    }
    //#endregion

    //#region delete Category
    $('body').on('click', "#deleteWorkHistoryVideo", function () {
        var id = $(this).attr('data-value');
        CommonUtility.DeleteWarningMessagePopIp("Are you sure you want to delete Work history video", id);
    });
    $('body').on('click', "#finaldelete", function () {
        var id = $(this).attr('data-myval')
        DeleteWorkHistoryVideo(id);
    });
    function DeleteWorkHistoryVideo(workHistoryVideoId) {
        var workHistoryVideoId = CommonUtility.ScriptInjection(workHistoryVideoId).replace(/</g, "").replace(/>/g, "");
        var Success = function (result) {
            if (result != "" || result.length > 0) {
                $("#modal-delete-danger").modal('hide');
                CommonUtility.SucessMessagePopUp("Work history video deleted successfully.");
                BindWorkHistoryVideoList();
                Clear();
            }
        }
        var data = {
            WorkHistoryVideoId: workHistoryVideoId
        };
        var url = '/PudhariAdmin/Work/DeleteWorkHistoryVideo/';
        CommonUtility.RequestAjax('POST', url, data, Success, null, null, null);
    }
    //#endregion

    //#region Edit Category
    $('body').on('click', "#editWorkHistoryVideo", function () {
        var workHistoryVideoId = $(this).attr('data-value');
        var BindSuccess = function (result) {
            if (result != "" || result.length >= 0) {
                $("#ddlWorkName").val(result.WorkId);
                $("#ddlStatus").val(result.Status);
                $("#txtVideoCaption").val(result.VideoCaption)
                $("#txtVideoUrl").val(result.VideoUrl);
                $("#txtDesc").summernote("code", result.Description);
                $("#hdnWorkHistoryVideoId").val(result.WorkHistoryVideoId);
            }
        }
        var data = {
            WorkHistoryVideoId: workHistoryVideoId
        };
        var url = '/PudhariAdmin/Work/GetWorkHistoryVideoById/';
        CommonUtility.RequestAjax('GET', url, data, BindSuccess, null, null, null);
    });
    //#endregion

    //#region Function return
    return {
        BindWorkHistoryVideoList: BindWorkHistoryVideoList,
        AddWorkHistoryVideo: AddWorkHistoryVideo,
        Clear: Clear,
        DeleteWorkHistoryVideo: DeleteWorkHistoryVideo
    }
    //#endregion

})();



