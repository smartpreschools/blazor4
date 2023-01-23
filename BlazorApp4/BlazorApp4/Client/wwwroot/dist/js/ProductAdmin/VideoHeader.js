var VideoHeader = (function () {

    //#region Ready Function Start Point
    $(document).ready(function () {
        BindDropdown("#ddlCategory", "Category", "", true);

        BindVideoHeaderList();
    });
    //#endregion
    var optionSelect = "<option value='0' selected>Select value.. </option";
    //#region Bind Country List
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
        var url = '/ProductAdmin/Master/GetDropDownData/';
        if (isAsync)
            CommonUtility.RequestAjax('GET', url, data, BindDropDownData, null, null, null);
        else
            CommonUtility.RequestAjaxAsync('GET', url, data, BindDropDownData, null, null, null);

    }
    //#endregion
    //#region Bind State List
    function BindVideoHeaderList() {
        var Success = function (result) {
            if (result != "" || result.length >= 0) {
                $('#VideoHeaderlist').DataTable({
                    data: result,
                    "bFilter": true,
                    "bLengthChange": true,
                    "bDestroy": true,
                    "lengthMenu": [[5, 10, 25, -1], [5, 10, 25, "All"]],
                    columns: [
                        { data: 'Category' },
                        { data: 'VideoHeaderName' },

                        {
                            data: "Status",
                            render: function (data, type, row) {
                                if (data === "True") { return "Active" }
                                else return "InActive"
                            }
                        },
                        {
                            "data": "VideoHeaderID",
                            "searchable": false,
                            "sortable": false,
                            "render": function (data, type, full, meta) {
                                return '<i class="fas fa-edit" id="editVideoHeader" data-value ="' + data + '"></i>|<i class="fas fa-trash-alt" id="deleteVideoHeader" data-value ="' + data + '" ></i>';
                            }
                        }
                    ]
                });
            }
        }

        var url = '/ProductAdmin/WebAdmin/GetVideoHeaderList/';
        CommonUtility.RequestAjax('POST', url, "", Success, null, null, null);
    }
    //#endregion

    //#region Add New State
    $('body').on('click', "#btnSubmit", function () {
        var category = CommonUtility.ScriptInjection($("#ddlCategory").val()).replace(/</g, "").replace(/>/g, "");
        var videoHeaderName = CommonUtility.ScriptInjection($("#txtVideoHeaderName").val()).replace(/</g, "").replace(/>/g, "");
        var videoHeaderStatus = CommonUtility.ScriptInjection($("#ddlVideoHeaderStatus").val()).replace(/</g, "").replace(/>/g, "");
        var desc = CommonUtility.ScriptInjection($("#txtVideoHeaderDesc").val()).replace(/</g, "").replace(/>/g, "");
        var videoHeaderID = CommonUtility.ScriptInjection($("#hdnVideoHeaderID").val()).replace(/</g, "").replace(/>/g, "");

        var categoryStatus = CommonValidation.MandetoryControlValueCheck("DROPDOWN", "ddlCategory");

        var videoHeaderNameStatus = CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtVideoHeaderName");

        if (categoryStatus && videoHeaderNameStatus) {
            if (videoHeaderID != "")
                UpdateVideo(videoHeaderID, category, videoHeaderName, videoHeaderStatus, desc)
            else
                AddVideo(category, videoHeaderName, videoHeaderStatus, desc);
        }
    });

    function AddVideo(category, videoHeaderName, videoHeaderStatus, desc) {

        var Success = function (result) {
            if (result != "" || result.length > 0) {
                Clear();
                BindVideoHeaderList();
                if (result === 1)
                    CommonUtility.SucessMessagePopUp("Video saved successfully.");
                if (result === -1)
                    CommonUtility.SucessMessagePopUp("Video already exists, could you try another name.");
            }
        }
        var data = {
            Category: category,
            VideoHeaderName: videoHeaderName,
            Status: videoHeaderStatus,
            VideoHeaderDesc: desc
        };
        var url = '/ProductAdmin/WebAdmin/AddVideoHeader/';
        CommonUtility.RequestAjax('POST', url, data, Success, null, null, null);
    }

    function UpdateVideo(videoHeaderID, category, videoHeaderName, videoHeaderStatus, desc) {

        var Success = function (result) {
            if (result != "" || result.length > 0) {
                CommonUtility.SucessMessagePopUp("Website Video updated successfully.");
                Clear();
                BindVideoHeaderList();
            }
        }
        var data = {
            VideoHeaderID: videoHeaderID,
            Category: category,

            VideoHeaderName: videoHeaderName,

            Status: videoHeaderStatus,
            VideoHeaderDesc: desc
        };
        var url = '/ProductAdmin/WebAdmin/UpdateVideoHeader/';
        CommonUtility.RequestAjax('POST', url, data, Success, null, null, null);
    }
    //#endregion

    //#region Validation
    $('#ddlCategory').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("DROPDOWN", "ddlCategory")
    });

    $('#txtVideoHeaderName').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtVideoHeaderName");
    });

    //#region Validation


    //#endregion

    //#region clear State controls
    $('body').on('click', "#btnClear", function () {
        Clear();
    });

    function Clear() {
        $("#txtVideoHeaderName").val("");

        $("#ddlCategory").val("0");

        $("#hdnVideoHeaderID").val("");
        $("#txtVideoHeaderDesc").val("");

        $("#errtxtVideoHeaderName").html("").hide();
        $("#errddlCategory").html("").hide();

    }
    //#endregion

    //#region delete Category
    $('body').on('click', "#deleteVideoHeader", function () {
        var id = $(this).attr('data-value');
        CommonUtility.DeleteWarningMessagePopIp("Are you sure you want to delete Video", id);
    });
    $('body').on('click', "#finaldelete", function () {
        var id = $(this).attr('data-myval')
        DeleteVideo(id);
    });
    function DeleteVideo(VideoHeaderID) {
        var videoHeaderID = CommonUtility.ScriptInjection(VideoHeaderID).replace(/</g, "").replace(/>/g, "");
        var Success = function (result) {
            if (result != "" || result.length > 0) {
                $("#modal-delete-danger").modal('hide');
                CommonUtility.SucessMessagePopUp("Video Deleted successfully.");
                BindVideoHeaderList();
                Clear();
            }
        }
        var data = {
            VideoHeaderID: videoHeaderID
        };
        var url = '/ProductAdmin/WebAdmin/DeleteVideoHeader/';
        CommonUtility.RequestAjax('POST', url, data, Success, null, null, null);
    }
    //#endregion

    //#region Edit Category
    $('body').on('click', "#editVideoHeader", function () {
        var videoHeaderID = $(this).attr('data-value');
        var Sucess = function (result) {
            if (result != "" || result.length >= 0) {
                $("#ddlCategory").val(result.Category);
                $("#txtVideoHeaderName").val(result.VideoHeaderName);
                $("#txtVideoHeaderDesc").val(result.VideoHeaderDesc);
                $("#ddlVideoHeaderStatus").val(result.Status);
                $("#hdnVideoHeaderID").val(result.VideoHeaderID);
            }
        }
        var data = {
            VideoHeaderID: videoHeaderID
        };
        var url = '/ProductAdmin/WebAdmin/GetVideoHeaderByID/';
        CommonUtility.RequestAjax('GET', url, data, Sucess, null, null, null);
    });
    //#endregion

    //#region Function return
    return {
        BindVideoHeaderList: BindVideoHeaderList,
        AddVideoHeader: AddVideoHeader,
        Clear: Clear,
        DeleteData: DeleteData,
        DeleteVideoHeader: DeleteVideoHeader
    }
    //#endregion

})();