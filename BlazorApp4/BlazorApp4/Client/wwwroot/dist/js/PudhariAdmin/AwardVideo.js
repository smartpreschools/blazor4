var Award = (function () {

    //#region Ready Function Start Point
    $(document).ready(function () {
        BindDropdown("#ddlAwardName", "Award", "", true);
        BindAwardVideoList();
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
    function BindAwardVideoList() {
        var ValiditySuccess = function (result) {
            if (result != "" || result.length >= 0) {
                $('#awardVideolist').DataTable({
                    data: result,
                    "bFilter": true,
                    "bLengthChange": true,
                    "bDestroy": true,
                    "lengthMenu": [[5, 10, 25, -1], [5, 10, 25, "All"]],
                    columns: [
                        { data: 'AwardId' },
                        { data: 'VideoCaption' },
                        { data: 'VideoUrl' },
                        { data: 'Status' },
                        {
                            "data": "VideoId",
                            "searchable": false,
                            "sortable": false,
                            "render": function (data, type, full, meta) {
                                return '<i class="fas fa-edit" id="editAwardVideo" data-value ="' + data + '"></i>|<i class="fas fa-trash-alt" id="deleteAwardVideo" data-value ="' + data + '" ></i>';
                            }
                        }
                    ]
                });
            }
        }

        var url = '/PudhariAdmin/Awards/GetAwardVideoList/';
        CommonUtility.RequestAjax('POST', url, "", ValiditySuccess, null, null, null);
    }
    //#endregion

    //#region Add New Category
    $('body').on('click', "#btnSubmit", function () {
        var awardName = CommonUtility.ScriptInjection($("#ddlAwardName").val()).replace(/</g, "").replace(/>/g, "");
        var videoCaption = CommonUtility.ScriptInjection($("#txtVideoCaption").val()).replace(/</g, "").replace(/>/g, "");
        var videoUrl = CommonUtility.ScriptInjection($("#txtVideoUrl").val()).replace(/</g, "").replace(/>/g, "");
        var desc = $("#txtDesc").summernote('code');
        var status = CommonUtility.ScriptInjection($("#ddlStatus").val()).replace(/</g, "").replace(/>/g, "");
        var awardVideoId = CommonUtility.ScriptInjection($("#hdnAwardVideoId").val()).replace(/</g, "").replace(/>/g, "");

        var awardNameCheck = CommonValidation.MandetoryControlValueCheck("DROPDOWN", "ddlAwardName");
        var videoUrlCheck = CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtVideoUrl");

        if (awardNameCheck && videoUrlCheck) {
            if (awardVideoId != "")
                UpdateAwardVideo(awardName, videoCaption, awardName, videoUrl, desc, status, awardVideoId)
            else
                AddAwardVideo(awardName, videoCaption, awardName, videoUrl, desc, status,);
        }
    });

    function AddAwardVideo(awardName, videoCaption, awardName, videoUrl, desc, status,) {
        var ValiditySuccess = function (result) {
            if (result != "" || result.length > 0) {
                Clear();
                BindAwardVideoList();
                if (result === 1)
                    CommonUtility.SucessMessagePopUp("Award video saved successfully.");
                if (result === -1)
                    CommonUtility.SucessMessagePopUp("Award video exists, could you try another name.");
            }
        }
        var data = {
            AwardId: awardName,
            VideoUrl: videoUrl,
            VideoCaption: videoCaption,
            Description: desc,
            Status: status,
        };
        var url = '/PudhariAdmin/Awards/AddAwardVideo/';
        CommonUtility.RequestAjax('POST', url, data, ValiditySuccess, null, null, null);
    }

    function UpdateAwardVideo(awardName, videoCaption, awardName, videoUrl, desc, status, awardVideoId) {
        var Success = function (result) {
            if (result != "" || result.length > 0) {
                Clear();
                CommonUtility.SucessMessagePopUp("Award video updated successfully.");
                BindAwardVideoList();
            }
        }
        var data = {
            VideoId: awardVideoId,
            AwardId: awardName,
            VideoUrl: videoUrl,
            VideoCaption: videoCaption,
            Description: desc,
            Status: status,
        };
        var url = '/PudhariAdmin/Awards/UpdateAwardVideo/';
        CommonUtility.RequestAjax('POST', url, data, Success, null, null, null);
    }
    //#endregion

    //#region Validation
    $('#ddlAwardName').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("DROPDOWN", "ddlAwardName");
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
        $("#ddlAwardName").val("0");
        $("#ddlStatus").val("True");
        $("#txtVideoCaption").val("");
        $("#txtVideoUrl").val("");
        $("#txtDesc").summernote("reset");
        $("#hdnAwardVideoId").val("");


        $("#errddlAwardName").html("").hide();
        $("#errtxtVideoUrl").html("").hide();
    }
    //#endregion

    //#region delete Category
    $('body').on('click', "#deleteAwardVideo", function () {
        var id = $(this).attr('data-value');
        CommonUtility.DeleteWarningMessagePopIp("Are you sure you want to delete award video", id);
    });
    $('body').on('click', "#finaldelete", function () {
        var id = $(this).attr('data-myval')
        DeleteAwardVideo(id);
    });
    function DeleteAwardVideo(awardVideoId) {
        var awardVideoId = CommonUtility.ScriptInjection(awardVideoId).replace(/</g, "").replace(/>/g, "");
        var Success = function (result) {
            if (result != "" || result.length > 0) {
                $("#modal-delete-danger").modal('hide');
                CommonUtility.SucessMessagePopUp("Award video deleted successfully.");
                BindAwardVideoList();
                Clear();
            }
        }
        var data = {
            awardVideoId: awardVideoId
        };
        var url = '/PudhariAdmin/Awards/DeleteAwardVideo/';
        CommonUtility.RequestAjax('POST', url, data, Success, null, null, null);
    }
    //#endregion

    //#region Edit Category
    $('body').on('click', "#editAwardVideo", function () {
        var awardVideoId = $(this).attr('data-value');
        var BindSuccess = function (result) {
            if (result != "" || result.length >= 0) {
                $("#ddlAwardName").val(result.AwardId);
                $("#ddlStatus").val(result.Status);
                $("#txtVideoCaption").val(result.VideoCaption)
                $("#txtVideoUrl").val(result.VideoUrl);
                $("#txtDesc").summernote("code", result.Description);
                $("#hdnAwardVideoId").val(result.VideoId);
            }
        }
        var data = {
            awardVideoId: awardVideoId
        };
        var url = '/PudhariAdmin/Awards/GetAwardVideoById/';
        CommonUtility.RequestAjax('GET', url, data, BindSuccess, null, null, null);
    });
    //#endregion

    //#region Function return
    return {
        BindAwardVideoList: BindAwardVideoList,
        AddAwardVideo: AddAwardVideo,
        Clear: Clear,
        DeleteAwardVideo: DeleteAwardVideo
    }
    //#endregion

})();



