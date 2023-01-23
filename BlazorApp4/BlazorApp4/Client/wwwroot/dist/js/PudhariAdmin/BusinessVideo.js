var Business = (function () {

    //#region Ready Function Start Point
    $(document).ready(function () {
        BindDropdown("#ddlBusinessName", "Business", "", true);
        BindBusinessVideoList();
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
    function BindBusinessVideoList() {
        var ValiditySuccess = function (result) {
            if (result != "" || result.length >= 0) {
                $('#businessVideolist').DataTable({
                    data: result,
                    "bFilter": true,
                    "bLengthChange": true,
                    "bDestroy": true,
                    "lengthMenu": [[5, 10, 25, -1], [5, 10, 25, "All"]],
                    columns: [
                        { data: 'Business' },
                        { data: 'VideoCaption' },
                        { data: 'VideoUrl' },
                        { data: 'Status' },
                        {
                            "data": "VideoId",
                            "searchable": false,
                            "sortable": false,
                            "render": function (data, type, full, meta) {
                                return '<i class="fas fa-edit" id="editBusinessVideo" data-value ="' + data + '"></i>|<i class="fas fa-trash-alt" id="deleteBusinessVideo" data-value ="' + data + '" ></i>';
                            }
                        }
                    ]
                });
            }
        }

        var url = '/PudhariAdmin/Business/GetBusinessVideoList/';
        CommonUtility.RequestAjax('POST', url, "", ValiditySuccess, null, null, null);
    }
    //#endregion

    //#region Add New Category
    $('body').on('click', "#btnSubmit", function () {
        var businessName = CommonUtility.ScriptInjection($("#ddlBusinessName").val()).replace(/</g, "").replace(/>/g, "");
        var videoCaption = CommonUtility.ScriptInjection($("#txtVideoCaption").val()).replace(/</g, "").replace(/>/g, "");
        var videoUrl = CommonUtility.ScriptInjection($("#txtVideoUrl").val()).replace(/</g, "").replace(/>/g, "");
        var desc = $("#txtDesc").summernote('code');
        var status = CommonUtility.ScriptInjection($("#ddlStatus").val()).replace(/</g, "").replace(/>/g, "");
        var businessVideoId = CommonUtility.ScriptInjection($("#hdnBusinessVideoId").val()).replace(/</g, "").replace(/>/g, "");

        var businessNameCheck = CommonValidation.MandetoryControlValueCheck("DROPDOWN", "ddlBusinessName");
        var videoUrlCheck = CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtVideoUrl");

        if (businessNameCheck && videoUrlCheck) {
            if (businessVideoId != "")
                UpdateBusinessVideo(businessName, videoCaption, businessName, videoUrl, desc, status, businessVideoId)
            else
                AddBusinessVideo(businessName, videoCaption, businessName, videoUrl, desc, status,);
        }
    });

    function AddBusinessVideo(businessName, videoCaption, businessName, videoUrl, desc, status,) {
        var ValiditySuccess = function (result) {
            if (result != "" || result.length > 0) {
                Clear();
                BindBusinessVideoList();
                if (result === 1)
                    CommonUtility.SucessMessagePopUp("Business video saved successfully.");
                if (result === -1)
                    CommonUtility.SucessMessagePopUp("Business video exists, could you try another name.");
            }
        }
        var data = {
            Business: businessName,
            VideoUrl: videoUrl,
            VideoCaption: videoCaption,
            Description: desc,
            Status: status,
        };
        var url = '/PudhariAdmin/Business/AddBusinessVideo/';
        CommonUtility.RequestAjax('POST', url, data, ValiditySuccess, null, null, null);
    }

    function UpdateBusinessVideo(businessName, videoCaption, businessName, videoUrl, desc, status, businessVideoId) {
        var Success = function (result) {
            if (result != "" || result.length > 0) {
                Clear();
                CommonUtility.SucessMessagePopUp("Business video updated successfully.");
                BindBusinessVideoList();
            }
        }
        var data = {
            VideoId: businessVideoId,
            Business: businessName,
            VideoUrl: videoUrl,
            VideoCaption: videoCaption,
            Description: desc,
            Status: status,
        };
        var url = '/PudhariAdmin/Business/UpdateBusinessVideo/';
        CommonUtility.RequestAjax('POST', url, data, Success, null, null, null);
    }
    //#endregion

    //#region Validation
    $('#ddlBusinessName').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("DROPDOWN", "ddlBusinessName");
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
        $("#ddlBusinessName").val("0");
        $("#ddlStatus").val("True");
        $("#txtVideoCaption").val("");
        $("#txtVideoUrl").val("");
        $("#txtDesc").summernote("reset");
        $("#hdnBusinessVideoId").val("");


        $("#errddlBusinessName").html("").hide();
        $("#errtxtVideoUrl").html("").hide();
    }
    //#endregion

    //#region delete Category
    $('body').on('click', "#deleteBusinessVideo", function () {
        var id = $(this).attr('data-value');
        CommonUtility.DeleteWarningMessagePopIp("Are you sure you want to delete business video", id);
    });
    $('body').on('click', "#finaldelete", function () {
        var id = $(this).attr('data-myval')
        DeleteBusinessVideo(id);
    });
    function DeleteBusinessVideo(businessVideoId) {
        var businessVideoId = CommonUtility.ScriptInjection(businessVideoId).replace(/</g, "").replace(/>/g, "");
        var Success = function (result) {
            if (result != "" || result.length > 0) {
                $("#modal-delete-danger").modal('hide');
                CommonUtility.SucessMessagePopUp("Business video deleted successfully.");
                BindBusinessVideoList();
                Clear();
            }
        }
        var data = {
            BusinessVideoId: businessVideoId
        };
        var url = '/PudhariAdmin/Business/DeleteBusinessVideo/';
        CommonUtility.RequestAjax('POST', url, data, Success, null, null, null);
    }
    //#endregion

    //#region Edit Category
    $('body').on('click', "#editBusinessVideo", function () {
        var businessVideoId = $(this).attr('data-value');
        var BindSuccess = function (result) {
            if (result != "" || result.length >= 0) {
                $("#ddlBusinessName").val(result.Business);
                $("#ddlStatus").val(result.Status);
                $("#txtVideoCaption").val(result.VideoCaption)
                $("#txtVideoUrl").val(result.VideoUrl);
                $("#txtDesc").summernote("code", result.Description);
                $("#hdnBusinessVideoId").val(result.VideoId);
            }
        }
        var data = {
            BusinessVideoId: businessVideoId
        };
        var url = '/PudhariAdmin/Business/GetBusinessVideoById/';
        CommonUtility.RequestAjax('GET', url, data, BindSuccess, null, null, null);
    });
    //#endregion

    //#region Function return
    return {
        BindBusinessVideoList: BindBusinessVideoList,
        AddBusinessVideo: AddBusinessVideo,
        Clear: Clear,
        DeleteBusinessVideo: DeleteBusinessVideo
    }
    //#endregion

})();



