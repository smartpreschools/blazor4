var News = (function () {
    //#region Ready Function Start Point
    $(document).ready(function () {
        BindDropdown("#ddlNewsCategory", "NewsCategory", "NewsCategory", true);
        BindNewsList();
    });
    //#endregion
    var optionSelect = "<option value='0' selected>Select value.. </option";
    //#region Bind DropDown  List
    function BindDropdown(contrlID, DrpName, inputValue, isAsync) {
        var BindDropDownData = function (result) {
            if (result != "" || result.length > 0) {
                $(contrlID + " option").remove();
                $.map(result, function (opt) {
                    var option = $('<option>' + opt.CategoryName + '</option>');
                    option.attr('value', opt.CategoryId);
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
        var url = '/PudhariAdmin/News/GetActiveCategoryList/';
        if (isAsync)
            CommonUtility.RequestAjax('GET', url, data, BindDropDownData, null, null, null);
        else
            CommonUtility.RequestAjaxAsync('GET', url, data, BindDropDownData, null, null, null);

    }
    //#endregion
    //#region Bind News List
    function BindNewsList() {
        var BindNewsSuccess = function (result) {
            if (result != "" || result.length >= 0) {
                $('#newslist').DataTable({
                    data: result,
                    "bFilter": true,
                    "bLengthChange": true,
                    "bDestroy": true,
                    "lengthMenu": [[5, 10, 25, -1], [5, 10, 25, "All"]],
                    columns: [
                        { data: 'NewsCategory' },
                        { data: 'NewsName' },
                        {
                            data: "Status",
                            render: function (data, type, row) {
                                if (data === "True") { return "Active" }
                                else return "InActive"
                            }
                        },
                        {
                            "data": "NewsId",
                            "searchable": false,
                            "sortable": false,
                            "render": function (data, type, full, meta) {
                                return '<i class="fas fa-edit" id="editnews" data-value ="' + data + '"></i>|<i class="fas fa-trash-alt" id="deleteNews" data-value ="' + data + '" ></i>';
                            }
                        }
                    ]
                });
            }
        }

        var url = '/PudhariAdmin/News/GetNewsList/';
        CommonUtility.RequestAjax('POST', url, "", BindNewsSuccess, null, null, null);
    }
    //#endregion

    //#region Add New News
    $('body').on('click', "#btnSubmit", function () {
        var newsName = CommonUtility.ScriptInjection($("#txtNewsName").val()).replace(/</g, "").replace(/>/g, "");
        var newsDesc = $("#txtNewsDesc").summernote('code'); //CommonUtility.ScriptInjection($("#txtNewsDesc").val()).replace(/</g, "").replace(/>/g, "");
        var newsStatus = CommonUtility.ScriptInjection($("#ddlNewsStatus").val()).replace(/</g, "").replace(/>/g, "");
        var newsCategory = CommonUtility.ScriptInjection($("#ddlNewsCategory").val()).replace(/</g, "").replace(/>/g, "");
        var newsId = CommonUtility.ScriptInjection($("#hdnNewsId").val()).replace(/</g, "").replace(/>/g, "");

        var newsNameStatus = CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtNewsName");
        var newsCategoryStatus = CommonValidation.MandetoryControlValueCheck("DROPDOWN", "ddlNewsCategory");


        if (newsNameStatus && newsCategoryStatus) {
            if (newsId != "")
                UpdateNews(newsCategory, newsName, newsDesc, newsStatus, newsId);
            else
                AddNews(newsCategory, newsName, newsDesc, newsStatus);
        }
    });

    function AddNews(newsCategory, newsName, newsDesc, newsStatus) {

        var NewsSuccess = function (result) {
            if (result != "" || result.length > 0) {
                if (result === 1)
                    CommonUtility.SucessMessagePopUp("News saved successfully.");
                if (result === -1)
                    CommonUtility.SucessMessagePopUp("News already exists, could you try another name.");
                BindNewsList();
                Clear();
            }
        }
        var data = {
            NewsCategory: newsCategory,
            NewsName: newsName,
            NewsDesc: newsDesc,
            Status: newsStatus
        };
        var url = '/PudhariAdmin/News/News/';
        CommonUtility.RequestAjax('POST', url, data, NewsSuccess, null, null, null);
    }
    function UpdateNews(newsCategory, newsName, newsDesc, newsStatus, newsId) {

        var NewsSuccess = function (result) {
            if (result != "" || result.length > 0) {
                Clear();
                CommonUtility.SucessMessagePopUp("News updated successfully.");
                BindNewsList();
            }
        }
        var data = {
            NewsId: newsId,
            NewsCategory: newsCategory,
            NewsName: newsName,
            NewsDesc: newsDesc,
            Status: newsStatus
        };
        var url = '/PudhariAdmin/News/UpdateNews/';
        CommonUtility.RequestAjax('POST', url, data, NewsSuccess, null, null, null);
    }
    //#endregion

    //#region Validation
    $('#txtNewsName').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtNewsName");
    });
    $('#ddlNewsCategory').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("DROPDOWN", "ddlNewsCategory");
    });
    //#endregion

    //#region clear news controls
    $('body').on('click', "#btnClear", function () {
        Clear();
    });

    function Clear() {
        $("#txtNewsName").val("");
        $("#hdnNewsId").val("");
        $("#ddlNewsCategory").val(0);
        $("#txtNewsDesc").summernote("reset");
        $("#ddlNewsStatus").val("True");
        $("#errtxtNewsName").html("").hide();
    }
    //#endregion

    //#region delete News
    $('body').on('click', "#deleteNews", function () {
        var id = $(this).attr('data-value');
        CommonUtility.DeleteWarningMessagePopIp("Are you sure you want to delete news", id);
    });
    $('body').on('click', "#finaldelete", function () {
        var id = $(this).attr('data-myval')
        DeleteNews(id);
    });
    function DeleteNews(newsId) {
        var newsId = CommonUtility.ScriptInjection(newsId).replace(/</g, "").replace(/>/g, "");
        var NewsSuccess = function (result) {
            if (result != "" || result.length > 0) {
                $("#modal-delete-danger").modal('hide');
                CommonUtility.SucessMessagePopUp("News deleted successfully.");
                BindNewsList();
                Clear();
            }
        }
        var data = {
            NewsId: newsId
        };
        var url = '/PudhariAdmin/News/DeleteNews/';
        CommonUtility.RequestAjax('POST', url, data, NewsSuccess, null, null, null);
    }
    //#endregion

    //#region Edit News
    $('body').on('click', "#editnews", function () {
        var newsId = $(this).attr('data-value');
        var BindNewsSuccess = function (result) {
            if (result != "" || result.length >= 0) {
                $("#ddlNewsCategory").val(result.NewsCategory);
                $("#txtNewsName").val(result.NewsName);
                $("#txtNewsDesc").summernote('code', result.NewsDesc);
                $("#ddlNewsStatus").val(result.Status);
                $("#hdnNewsId").val(result.NewsId);
            }
        }
        var data = {
            NewsId: newsId
        };
        var url = '/PudhariAdmin/News/GetNewsById/';
        CommonUtility.RequestAjax('GET', url, data, BindNewsSuccess, null, null, null);
    });
    //#endregion
    //#region Function return
    return {
        BindNewsList: BindNewsList,
        AddNews: AddNews,
        Clear: Clear,
        DeleteData: DeleteData,
        DeleteNews: DeleteNews
    }
    //#endregion

})();



