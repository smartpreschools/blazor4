var VideoGallery = (function () {

    //#region Ready Function Start Point
    $(document).ready(function () {
        BindDropdown("#ddlCategory", "Category", "", true);
        // BindDropdown("#ddlValidity", "PlanValidity", "", true);
        BindVideoGalleryList();
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
    function BindVideoGalleryList() {
        var Success = function (result) {
            if (result != "" || result.length >= 0) {
                $('#videogallerylist').DataTable({
                    data: result,
                    "bFilter": true,
                    "bLengthChange": true,
                    "bDestroy": true,
                    "lengthMenu": [[5, 10, 25, -1], [5, 10, 25, "All"]],
                    columns: [
                        { data: 'Category' },
                        { data: 'VideoName' },
                        { data: 'VideoOrder' },
                        { data: 'VideoUrl' },
                        
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
                                return '<i class="fas fa-edit" id="editVideoGallery" data-value ="' + data + '"></i>|<i class="fas fa-trash-alt" id="deleteVideoGallery" data-value ="' + data + '" ></i>';
                            }
                        }
                    ]
                });
            }
        }

        var url = '/ProductAdmin/WebAdmin/GetVideoGalleryList/';
        CommonUtility.RequestAjax('POST', url, "", Success, null, null, null);
    }
    //#endregion

    //#region Add New State
    $('body').on('click', "#btnSubmit", function () {
        var category = CommonUtility.ScriptInjection($("#ddlCategory").val()).replace(/</g, "").replace(/>/g, "");
        var videofunction = CommonUtility.ScriptInjection($("#ddlVideoFunction").val()).replace(/</g, "").replace(/>/g, "");
        var videoName = CommonUtility.ScriptInjection($("#txtVideoName").val()).replace(/</g, "").replace(/>/g, "");
        var videoOrder = CommonUtility.ScriptInjection($("#txtVideoOrder").val()).replace(/</g, "").replace(/>/g, "");
        var videoUrl = CommonUtility.ScriptInjection($("#txtVideoUrl").val()).replace(/</g, "").replace(/>/g, "");      
        var videoStatus = CommonUtility.ScriptInjection($("#ddlStatus").val()).replace(/</g, "").replace(/>/g, "");
        var desc = CommonUtility.ScriptInjection($("#txtVideoDesc").val()).replace(/</g, "").replace(/>/g, "");
        var videoID = CommonUtility.ScriptInjection($("#hdnVideoID").val()).replace(/</g, "").replace(/>/g, "");

        var categoryStatus = CommonValidation.MandetoryControlValueCheck("DROPDOWN", "ddlCategory");
        var vidiofunctionStatus = CommonValidation.MandetoryControlValueCheck("DROPDOWN", "ddlVideoFunction");
        var videoNameStatus = CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtVideoName");
        var videoOrderStatus = CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtVideoOrder");
        var videoUrlStatus = CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtVideoUrl");
        
        if (categoryStatus && vidiofunctionStatus && videoNameStatus && videoOrderStatus && videoUrlStatus ) {
            if (videoID != "")
                UpdateVideo(videoID, category, videofunction, videoName, videoOrder, videoUrl,videoStatus, desc)
            else
                AddVideo(category, videofunction, videoName, videoOrder, videoUrl, videoStatus, desc);
        }
    });

    function AddVideo(category, videofunction, videoName, videoOrder, videoUrl, videoStatus, desc) {

        var Success = function (result) {
            if (result != "" || result.length > 0) {
                Clear();
                BindVideoGalleryList();
                if (result === 1)
                    CommonUtility.SucessMessagePopUp("Video Gallery saved successfully.");
                if (result === -1)
                    CommonUtility.SucessMessagePopUp("Video already exists, could you try another name.");
            }
        }
        var data = {
            Category: category,
            Videofunction: videofunction,
            VideoName: videoName,
            VideoOrder: videoOrder,
            VideoUrl: videoUrl,
           Status: videoStatus,
            VideoDesc: desc
        };
        var url = '/ProductAdmin/WebAdmin/AddVideoGallery/';
        CommonUtility.RequestAjax('POST', url, data, Success, null, null, null);
    }

    function UpdateVideo(videoID, category, videoName, videoOrder, videoUrl, videoStatus, desc) {

        var Success = function (result) {
            if (result != "" || result.length > 0) {
                CommonUtility.SucessMessagePopUp("Gallery updated successfully.");
                Clear();
                BindVideoGalleryList();
            }
        }
        var data = {
            VideoID: videoID,
            Category: category,
            VideoName: videoName,
            VideoOrder: videoOrder,
            VideoUrl: videoUrl,
            Status: videoStatus,
            VideoDesc: desc
        };
        var url = '/ProductAdmin/WebAdmin/UpdateVideoGallery/';
        CommonUtility.RequestAjax('POST', url, data, Success, null, null, null);
    }
    //#endregion

    //#region Validation
    $('#ddlCategory').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("DROPDOWN", "ddlCategory")
    });
    $('#ddlVideoFunction').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("DROPDOWN", "ddlVideoFunction")
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
    
    //#region Validation


    //#endregion

    //#region clear State controls
    $('body').on('click', "#btnClear", function () {
        Clear();
    });

    function Clear() {

        $("#ddlCategory").val("0");
        $("#ddlVideoFunction").val("0");
        $("#txtVideoName").val("");
        $("#txtVideoOrder").val("");
        $("#txtVideoUrl").val("");
       
        $("#hdnVideoID").val("");
        $("#txtVideoDesc").val("");

        $("#errtxtVideoName").html("").hide();
        $("#errddlCategory").html("").hide();
        $("#errddlVideoFunction").html.hide();
        $("#errtxtVideoOrder").html("").hide();
        $("#errtxtVideoUrl").html("").hide();
 
    }
    //#endregion

    //#region delete Category
    $('body').on('click', "#deleteVideoGallery", function () {
        var id = $(this).attr('data-value');
        CommonUtility.DeleteWarningMessagePopIp("Are you sure you want to delete Video", id);
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
                CommonUtility.SucessMessagePopUp("Info Deleted successfully.");
                BindVideoGalleryList();
                Clear();
            }
        }
        var data = {
            VideoID: videoID
        };
        var url = '/ProductAdmin/WwbAdmin/DeleteVideoGallery/';
        CommonUtility.RequestAjax('POST', url, data, Success, null, null, null);
    }
    //#endregion

    //#region Edit Category
    $('body').on('click', "#editVideoGallery", function () {
        var videoID = $(this).attr('data-value');
        var Sucess = function (result) {
            if (result != "" || result.length >= 0) {
                $("#ddlCategory").val(result.Category); 
                $("#ddlVideoFunction").val(result.Videofunction); 
                $("#txtVideoName").val(result.JobTitle);
                $("#txtVideoOrder").val(result.JobLocation);
                $("#txtVideoUrl").val(result.JobQualification);               
                $("#txtVideoDesc").val(result.JobDesc);
                $("#ddlStatus").val(result.Status);
                $("#hdnVideoID").val(result.JobID);
            }
        }
        var data = {
            VideoID: videoID
        };
        var url = '/ProductAdmin/WebAdmin/GetVideoGalleryByID/';
        CommonUtility.RequestAjax('GET', url, data, Sucess, null, null, null);
    });
    //#endregion

    //#region Function return
    return {
        BindVideoGalleryList: BindVideoGalleryList,
        AddVideo: AddVideo,
        Clear: Clear,
        DeleteData: DeleteData,
        DeleteVideo: DeleteVideo
    }
    //#endregion

})();