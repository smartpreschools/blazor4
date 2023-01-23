var VideoDeatail = (function () {
    //#region Ready Function Start Point
    $(document).ready(function () {
        BindDropdown("#ddlVideoFunction", "LAActiveVideoHeader", "LAActiveVideoHeader", true);
        BindVideoList();
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
        var data = {
            dropName: DrpName,
            inputText: inputValue,
        };
        var url = '/Common/MasterData/GetDropDownData/';
        if (isAsync)
            CommonUtility.RequestAjax('GET', url, data, BindDropDownData, null, null, null);
        else
            CommonUtility.RequestAjaxAsync('GET', url, data, BindDropDownData, null, null, null);

    }
    //#region Bind Category List
    function BindVideoList() {
        var Success = function (result) {
            if (result != "" || result.length >= 0) {
                $('#videoList').DataTable({
                    data: result,
                    "bFilter": true,
                    "bLengthChange": true,
                    "bDestroy": true,
                    "lengthMenu": [[5, 10, 25, -1], [5, 10, 25, "All"]],
                    columns: [
                        { data: 'HeaderName' },
                        { data: 'VideoName' },
                        { data: 'VideoOrder' },
                        { data: 'VideoURL' },
                        {
                            data: "Status",
                            render: function (data, type, row) {
                                if (data === "True") { return "Active" }
                                else return "InActive"
                            }
                        },

                        {
                            "data": "VideoID",
                            "searchable": false,
                            "sortable": false,
                            "render": function (data, type, full, meta) {
                                return '<i class="fas fa-edit" id="editVideo" data-value ="' + data + '"></i>|<i class="fas fa-trash-alt" id="deleteVideo" data-value ="' + data + '" ></i>';
                            }
                        }
                    ]
                });
            }
        }

        var url = '/PudhariAdmin/PageAdmin/GetVideoList/';
        CommonUtility.RequestAjax('POST', url, "", Success, null, null, null);
    }
    //#endregion

    //#region Add New Category
    $('body').on('click', "#btnSubmit", function () {
        var headerName = CommonUtility.ScriptInjection($("#ddlVideoFunction").val()).replace(/</g, "").replace(/>/g, "");
        var videoName = CommonUtility.ScriptInjection($("#txtVideoName").val()).replace(/</g, "").replace(/>/g, "");
        var videoOrder = CommonUtility.ScriptInjection($("#txtVideoOrder").val()).replace(/</g, "").replace(/>/g, "");
        var videoURL = CommonUtility.ScriptInjection($("#txtVideoUrl").val()).replace(/</g, "").replace(/>/g, "");
        var desc = CommonUtility.ScriptInjection($("#txtDesc").val()).replace(/</g, "").replace(/>/g, "");
        var status = CommonUtility.ScriptInjection($("#ddlStatus").val()).replace(/</g, "").replace(/>/g, "");
        var videoID = CommonUtility.ScriptInjection($("#hdnVideoID").val()).replace(/</g, "").replace(/>/g, "");

        var headerNameStatus = CommonValidation.MandetoryControlValueCheck("TEXTBOX", "ddlVideoFunction");
        var videoNameStatus = CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtVideoName");
        var videoOrderStatus = CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtVideoOrder");
        var videoURLStatus = CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtVideoUrl");

        if (headerNameStatus && videoNameStatus && videoOrderStatus && videoURLStatus) {
            if (videoID != "")
                UpdateVideo(headerName, videoName, videoOrder, videoURL, desc, status, videoID)
            else
                AddVideo(headerName, videoName, videoOrder, videoURL, desc, status);
        }
    });

    function AddVideo(headerName, videoName, videoOrder, videoURL, desc, status) {
        var Success = function (result) {
            if (result != "" || result.length > 0) {
                Clear();
                BindVideoList();
                if (result === 1)
                    CommonUtility.SucessMessagePopUp("Video saved successfully.");
                if (result === -1)
                    CommonUtility.SucessMessagePopUp("Video exists, could you try another name.");
            }
        }
        var data = {
            HeaderName: headerName,
            VideoName: videoName,
            VideoOrder: videoOrder,
            VideoURL : videoURL,
            Desc: desc,
            Status: status
        };
        var url = '/PudhariAdmin/PageAdmin/AddVideo/';
        CommonUtility.RequestAjax('POST', url, data, Success, null, null, null);
    }

    function UpdateVideo(headerName, videoName, videoOrder, videoURL, desc, status, videoID) {
        var Success = function (result) {
            if (result != "" || result.length > 0) {
                Clear();
                CommonUtility.SucessMessagePopUp("Video header updated successfully.");
                BindVideoList();
            }
        }
        var data = {
            VideoID: videoID,
            HeaderName: headerName,
            VideoName: videoName,
            VideoOrder: videoOrder,
            VideoURL: videoURL,
            Desc: desc,
            Status: status
        };
        var url = '/PudhariAdmin/PageAdmin/UpdateVideo/';
        CommonUtility.RequestAjax('POST', url, data, Success, null, null, null);
    }
    //#endregion

    //#region Validation
    $('#ddlVideoFunction').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("DROPDOWN", "ddlVideoFunction");
    });
    $('#txtVideoName').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtVideoName");
    });

    $('#txtVideoOrder').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtVideoOrder");
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
        $("#ddlVideoFunction").val("0");
        $("#txtVideoName").val("");
        $("#txtVideoOrder").val("");
        $("#txtVideoUrl").val("");
        $("#txtDesc").val("");
        $("#hdnVideoID").val("");
        $("#ddlStatus").val("True");
        

        $("#errddlVideoFunction").html("").hide();
        $("#errtxtVideoName").html("").hide();
        $("#errtxtVideoOrder").html("").hide();
        $("#errtxtVideoUrl").html("").hide();
    }
    //#endregion

    //#region delete Category
    $('body').on('click', "#deleteVideo", function () {
        var id = $(this).attr('data-value');
        CommonUtility.DeleteWarningMessagePopIp("Are you sure you want to delete video", id);
    });
    $('body').on('click', "#finaldelete", function () {
        var id = $(this).attr('data-myval')
        DeleteVideo(id);
    });
    function DeleteVideo(VideoID) {
        var videoID = CommonUtility.ScriptInjection(VideoID).replace(/</g, "").replace(/>/g, "");
        var Success = function (result) {
            if (result != "" || result.length > 0) {
                $("#modal-delete-danger").modal('hide');
                CommonUtility.SucessMessagePopUp("Video deleted successfully.");
                BindVideoList();
                Clear();
            }
        }
        var data = {
            VideoID: videoID
        };
        var url = '/PudhariAdmin/PageAdmin/DeleteVideo/';
        CommonUtility.RequestAjax('POST', url, data, Success, null, null, null);
    }
    //#endregion

    //#region Edit Category
    $('body').on('click', "#editVideo", function () {
        var videoID = $(this).attr('data-value');
        var BindSuccess = function (result) {
            if (result != "" || result.length >= 0) {
                $("#ddlVideoFunction").val(result.HeaderName);
                $("#txtVideoName").val(result.VideoName);
                $("#txtVideoOrder").val(result.VideoOrder);
                $("#txtVideoUrl").val(result.VideoURL);
                $("#txtDesc").val(result.Desc);
                $("#ddlStatus").val(result.Status);
                $("#hdnVideoID").val(result.VideoID);
            }
        }
        var data = {
            VideoID: videoID
        };
        var url = '/PudhariAdmin/PageAdmin/GetVideoByID/';
        CommonUtility.RequestAjax('GET', url, data, BindSuccess, null, null, null);
    });
    //#endregion

    //#region Function return
    return {
        BindVideoList: BindVideoList,
        AddVideo: AddVideo,
        Clear: Clear,
        DeleteVideo: DeleteVideo
    }
    //#endregion

})();



