var NewsPaper = (function () {
    //#region Ready Function Start Point
    $(document).ready(function () {
        BindNewsPaperList();
    });
    //#endregion

    //#region Bind Category List
    function BindNewsPaperList() {
        var ValiditySuccess = function (result) {
            if (result != "" || result.length >= 0) {
                $('#newsPaperList').DataTable({
                    data: result,
                    "bFilter": true,
                    "bLengthChange": true,
                    "bDestroy": true,
                    "lengthMenu": [[5, 10, 25, -1], [5, 10, 25, "All"]],
                    columns: [
                        { data: 'NewsName' },
                        { data: 'NewsDate' },
                        { data: 'Image' },
                        { data: 'Status' },
                        {
                            "data": "Id",
                            "searchable": false,
                            "sortable": false,
                            "render": function (data, type, full, meta) {
                                return '<i class="fas fa-edit" id="editNewsPaper" data-value ="' + data + '"></i>|<i class="fas fa-trash-alt" id="deleteNewsPaper" data-value ="' + data + '" ></i>';
                            }
                        }
                    ]
                });
            }
        }

        var url = '/PudhariAdmin/SocialMedia/GetNewsPaperList/';
        CommonUtility.RequestAjax('POST', url, "", ValiditySuccess, null, null, null);
    }
    //#endregion

    //#region Add New Category
    $('body').on('click', "#btnSubmit", function () {
        var newsName = CommonUtility.ScriptInjection($("#txtNewsName").val()).replace(/</g, "").replace(/>/g, "");
        var newsDate = CommonUtility.ScriptInjection($("#txtNewsDate").val()).replace(/</g, "").replace(/>/g, "");
        var image = CommonUtility.ScriptInjection($("#txtImage").val()).replace(/</g, "").replace(/>/g, "");
        var desc = $("#txtDesc").summernote('code');
        var status = CommonUtility.ScriptInjection($("#ddlStatus").val()).replace(/</g, "").replace(/>/g, "");
        var id = CommonUtility.ScriptInjection($("#hdnNewsPaperId").val()).replace(/</g, "").replace(/>/g, "");

        var newsNameStatus = CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtNewsName");
        var newsImageStatus = CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtImage");

        if (newsNameStatus && newsImageStatus) {
            if (id != "")
                UpdateNewsPaper(newsName, newsDate, image, desc, status, id)
            else
                AddNewsPaper(newsName, newsDate, image, desc, status);
        }
    });

    function AddNewsPaper(newsName, newsDate, image, desc, status) {
        var ValiditySuccess = function (result) {
            if (result != "" || result.length > 0) {
                Clear();
                BindNewsPaperList();
                if (result === 1)
                    CommonUtility.SucessMessagePopUp("NewsPaper details saved successfully.");
                if (result === -1)
                    CommonUtility.SucessMessagePopUp("NewsPaper details exists, could you try another name.");
            }
        }
        var data = {
            NewsName: newsName,
            NewsDate: newsDate,
            Image: image,
            Description: desc,
            Status: status
        };
        var url = '/PudhariAdmin/SocialMedia/NewsPaper/';
        CommonUtility.RequestAjax('POST', url, data, ValiditySuccess, null, null, null);
    }

    function UpdateNewsPaper(newsName, newsDate, image, desc, status, id) {
        var ValiditySuccess = function (result) {
            if (result != "" || result.length > 0) {
                Clear();
                CommonUtility.SucessMessagePopUp("NewsPaper details updated successfully.");
                BindNewsPaperList();
            }
        }
        var data = {
            Id: id,
            NewsName: newsName,
            NewsDate: newsDate,
            Image: image,
            Description: desc,
            Status: status
        };
        var url = '/PudhariAdmin/SocialMedia/UpdateNewsPaper/';
        CommonUtility.RequestAjax('POST', url, data, ValiditySuccess, null, null, null);
    }
    //#endregion

    //#region Validation
    $('#txtNewsName').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtNewsName");
    });

    //#endregion

    //#region clear PoliticalParty controls
    $('body').on('click', "#btnClear", function () {
        Clear();
    });

    function Clear() {
        $("#txtNewsName").val("");
        $("#txtNewsDate").val("");
        $("#txtImage").val("");
        $("#hdnNewsPaperId").val("");
        $("#txtDesc").summernote("reset");
        $("#errtxtNewsName").html("").hide();
    }
    //#endregion

    //#region delete Category
    $('body').on('click', "#deleteNewsPaper", function () {
        var id = $(this).attr('data-value');
        CommonUtility.DeleteWarningMessagePopIp("Are you sure you want to delete NewsPaper details", id);
    });
    $('body').on('click', "#finaldelete", function () {
        var id = $(this).attr('data-myval')
        DeleteNewsPaper(id);
    });
    function DeleteNewsPaper(id) {
        var id = CommonUtility.ScriptInjection(id).replace(/</g, "").replace(/>/g, "");
        var Success = function (result) {
            if (result != "" || result.length > 0) {
                $("#modal-delete-danger").modal('hide');
                CommonUtility.SucessMessagePopUp("NewsPaper details Deleted successfully.");
                BindNewsPaperList();
                Clear();
            }
        }
        var data = {
            id: id
        };
        var url = '/PudhariAdmin/SocialMedia/DeleteNewsPaper/';
        CommonUtility.RequestAjax('POST', url, data, Success, null, null, null);
    }
    //#endregion

    //#region Edit Category
    $('body').on('click', "#editNewsPaper", function () {
        var newsId = $(this).attr('data-value');
        var BindSuccess = function (result) {
            if (result != "" || result.length >= 0) {
                $("#txtNewsName").val(result.NewsName);
                $("#txtNewsDate").val(result.NewsDate);
                $("#txtDesc").summernote("code", result.Description);
                $("#hdnNewsPaperId").val(result.Id);
            }
        }
        var data = {
            id: newsId
        };
        var url = '/PudhariAdmin/SocialMedia/GetNewsPaperById/';
        CommonUtility.RequestAjax('GET', url, data, BindSuccess, null, null, null);
    });
    //#endregion

    //#region Function return
    return {
        BindNewsPaperList: BindNewsPaperList,
        AddNewsPaper: AddNewsPaper,
        Clear: Clear,
        DeleteNewsPaper: DeleteNewsPaper
    }
    //#endregion

})();
