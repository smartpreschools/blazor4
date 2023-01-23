var Competition = (function () {

    //#region Ready Function Start Point
    $(document).ready(function () {
        BindDropdown("#ddlCompetitionName", "Competition", "", true);
        BindCompetitionVideoList();
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
    function BindCompetitionVideoList() {
        var ValiditySuccess = function (result) {
            if (result != "" || result.length >= 0) {
                $('#competitionVideolist').DataTable({
                    data: result,
                    "bFilter": true,
                    "bLengthChange": true,
                    "bDestroy": true,
                    "lengthMenu": [[5, 10, 25, -1], [5, 10, 25, "All"]],
                    columns: [
                        { data: 'CompetitionId' },
                        { data: 'VideoCaption' },
                        { data: 'VideoUrl' },
                        { data: 'Status' },
                        {
                            "data": "VideoId",
                            "searchable": false,
                            "sortable": false,
                            "render": function (data, type, full, meta) {
                                return '<i class="fas fa-edit" id="editCompetitionVideo" data-value ="' + data + '"></i>|<i class="fas fa-trash-alt" id="deleteCompetitionVideo" data-value ="' + data + '" ></i>';
                            }
                        }
                    ]
                });
            }
        }

        var url = '/PudhariAdmin/Competition/GetCompetitionVideoList/';
        CommonUtility.RequestAjax('POST', url, "", ValiditySuccess, null, null, null);
    }
    //#endregion

    //#region Add New Category
    $('body').on('click', "#btnSubmit", function () {
        var competitionName = CommonUtility.ScriptInjection($("#ddlCompetitionName").val()).replace(/</g, "").replace(/>/g, "");
        var videoCaption = CommonUtility.ScriptInjection($("#txtVideoCaption").val()).replace(/</g, "").replace(/>/g, "");
        var videoUrl = CommonUtility.ScriptInjection($("#txtVideoUrl").val()).replace(/</g, "").replace(/>/g, "");
        var desc = $("#txtDesc").summernote('code');
        var status = CommonUtility.ScriptInjection($("#ddlStatus").val()).replace(/</g, "").replace(/>/g, "");
        var competitionVideoId = CommonUtility.ScriptInjection($("#hdnCompetitionVideoId").val()).replace(/</g, "").replace(/>/g, "");

        var competitionNameCheck = CommonValidation.MandetoryControlValueCheck("DROPDOWN", "ddlCompetitionName");
        var videoUrlCheck = CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtVideoUrl");

        if (competitionNameCheck && videoUrlCheck) {
            if (competitionVideoId != "")
                UpdateCompetitionVideo(competitionName, videoCaption, competitionName, videoUrl, desc, status, competitionVideoId)
            else
                AddCompetitionVideo(competitionName, videoCaption, competitionName, videoUrl, desc, status,);
        }
    });

    function AddCompetitionVideo(competitionName, videoCaption, competitionName, videoUrl, desc, status,) {
        var ValiditySuccess = function (result) {
            if (result != "" || result.length > 0) {
                Clear();
                BindCompetitionVideoList();
                if (result === 1)
                    CommonUtility.SucessMessagePopUp("Competition video saved successfully.");
                if (result === -1)
                    CommonUtility.SucessMessagePopUp("Competition video exists, could you try another name.");
            }
        }
        var data = {
            CompetitionId: competitionName,
            VideoUrl: videoUrl,
            VideoCaption: videoCaption,
            Description: desc,
            Status: status,
        };
        var url = '/PudhariAdmin/Competition/AddCompetitionVideo/';
        CommonUtility.RequestAjax('POST', url, data, ValiditySuccess, null, null, null);
    }

    function UpdateCompetitionVideo(competitionName, videoCaption, competitionName, videoUrl, desc, status, competitionVideoId) {
        var Success = function (result) {
            if (result != "" || result.length > 0) {
                Clear();
                CommonUtility.SucessMessagePopUp("Competition video updated successfully.");
                BindCompetitionVideoList();
            }
        }
        var data = {
            VideoId: competitionVideoId,
            CompetitionId: competitionName,
            VideoUrl: videoUrl,
            VideoCaption: videoCaption,
            Description: desc,
            Status: status,
        };
        var url = '/PudhariAdmin/Competition/UpdateCompetitionVideo/';
        CommonUtility.RequestAjax('POST', url, data, Success, null, null, null);
    }
    //#endregion

    //#region Validation
    $('#ddlCompetitionName').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("DROPDOWN", "ddlCompetitionName");
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
        $("#ddlCompetitionName").val("0");
        $("#ddlStatus").val("True");
        $("#txtVideoCaption").val("");
        $("#txtVideoUrl").val("");
        $("#txtDesc").summernote("reset");
        $("#hdnCompetitionVideoId").val("");


        $("#errddlCompetitionName").html("").hide();
        $("#errtxtVideoUrl").html("").hide();
    }
    //#endregion

    //#region delete Category
    $('body').on('click', "#deleteCompetitionVideo", function () {
        var id = $(this).attr('data-value');
        CommonUtility.DeleteWarningMessagePopIp("Are you sure you want to delete competition video", id);
    });
    $('body').on('click', "#finaldelete", function () {
        var id = $(this).attr('data-myval')
        DeleteCompetitionVideo(id);
    });
    function DeleteCompetitionVideo(competitionVideoId) {
        var competitionVideoId = CommonUtility.ScriptInjection(competitionVideoId).replace(/</g, "").replace(/>/g, "");
        var Success = function (result) {
            if (result != "" || result.length > 0) {
                $("#modal-delete-danger").modal('hide');
                CommonUtility.SucessMessagePopUp("Competition video deleted successfully.");
                BindCompetitionVideoList();
                Clear();
            }
        }
        var data = {
            CompetitionVideoId: competitionVideoId
        };
        var url = '/PudhariAdmin/Competition/DeleteCompetitionVideo/';
        CommonUtility.RequestAjax('POST', url, data, Success, null, null, null);
    }
    //#endregion

    //#region Edit Category
    $('body').on('click', "#editCompetitionVideo", function () {
        var competitionVideoId = $(this).attr('data-value');
        var BindSuccess = function (result) {
            if (result != "" || result.length >= 0) {
                $("#ddlCompetitionName").val(result.CompetitionId);
                $("#ddlStatus").val(result.Status);
                $("#txtVideoCaption").val(result.VideoCaption)
                $("#txtVideoUrl").val(result.VideoUrl);
                $("#txtDesc").summernote("code", result.Description);
                $("#hdnCompetitionVideoId").val(result.VideoId);
            }
        }
        var data = {
            CompetitionVideoId: competitionVideoId
        };
        var url = '/PudhariAdmin/Competition/GetCompetitionVideoById/';
        CommonUtility.RequestAjax('GET', url, data, BindSuccess, null, null, null);
    });
    //#endregion

    //#region Function return
    return {
        BindCompetitionVideoList: BindCompetitionVideoList,
        AddCompetitionVideo: AddCompetitionVideo,
        Clear: Clear,
        DeleteCompetitionVideo: DeleteCompetitionVideo
    }
    //#endregion

})();



