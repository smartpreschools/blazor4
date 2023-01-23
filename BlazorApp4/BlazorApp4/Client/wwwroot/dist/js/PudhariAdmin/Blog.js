var Blog = (function () {
    //#region Ready Function Start Point
    $(document).ready(function () {
        BindDropdown("#ddlBlogCategory", "BlogCategory", "BlogCategory", true);
        BindBlogList();
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
        var url = '/PudhariAdmin/Blog/GetActiveCategoryList/';
        if (isAsync)
            CommonUtility.RequestAjax('GET', url, data, BindDropDownData, null, null, null);
        else
            CommonUtility.RequestAjaxAsync('GET', url, data, BindDropDownData, null, null, null);

    }
    //#endregion
    //#region Bind Blog List
    function BindBlogList() {
        var BindBlogSuccess = function (result) {
            if (result != "" || result.length >= 0) {
                $('#bloglist').DataTable({
                    data: result,
                    "bFilter": true,
                    "bLengthChange": true,
                    "bDestroy": true,
                    "lengthMenu": [[5, 10, 25, -1], [5, 10, 25, "All"]],
                    columns: [
                        { data: 'BlogCategory' },
                        { data: 'BlogName' },
                        {
                            data: "Status",
                            render: function (data, type, row) {
                                if (data === "True") { return "Active" }
                                else return "InActive"
                            }
                        },
                        {
                            "data": "BlogId",
                            "searchable": false,
                            "sortable": false,
                            "render": function (data, type, full, meta) {
                                return '<i class="fas fa-edit" id="editblog" data-value ="' + data + '"></i>|<i class="fas fa-trash-alt" id="deleteBlog" data-value ="' + data + '" ></i>';
                            }
                        }
                    ]
                });
            }
        }

        var url = '/PudhariAdmin/Blog/GetBlogList/';
        CommonUtility.RequestAjax('POST', url, "", BindBlogSuccess, null, null, null);
    }
    //#endregion

    //#region Add New Blog
    $('body').on('click', "#btnSubmit", function () {
        var blogName = CommonUtility.ScriptInjection($("#txtBlogName").val()).replace(/</g, "").replace(/>/g, "");
        var blogDesc = $("#txtBlogDesc").summernote('code'); //CommonUtility.ScriptInjection($("#txtBlogDesc").val()).replace(/</g, "").replace(/>/g, "");
        var blogStatus = CommonUtility.ScriptInjection($("#ddlBlogStatus").val()).replace(/</g, "").replace(/>/g, "");
        var blogCategory = CommonUtility.ScriptInjection($("#ddlBlogCategory").val()).replace(/</g, "").replace(/>/g, "");
        var blogId = CommonUtility.ScriptInjection($("#hdnBlogId").val()).replace(/</g, "").replace(/>/g, "");

        var blogNameStatus = CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtBlogName");
        var blogCategoryStatus = CommonValidation.MandetoryControlValueCheck("DROPDOWN", "ddlBlogCategory");


        if (blogNameStatus && blogCategoryStatus) {
            if (blogId != "")
                UpdateBlog(blogCategory,blogName, blogDesc, blogStatus, blogId);
            else
                AddBlog(blogCategory,blogName, blogDesc, blogStatus);
        }
    });

    function AddBlog(blogCategory,blogName, blogDesc, blogStatus) {

        var BlogSuccess = function (result) {
            if (result != "" || result.length > 0) {
                if (result === 1)
                    CommonUtility.SucessMessagePopUp("Blog saved successfully.");
                if (result === -1)
                    CommonUtility.SucessMessagePopUp("Blog already exists, could you try another name.");
                BindBlogList();
                Clear();
            }
        }
        var data = {
            BlogCategory: blogCategory,
            BlogName: blogName,
            BlogDesc: blogDesc,
            Status: blogStatus
        };
        var url = '/PudhariAdmin/Blog/Blog/';
        CommonUtility.RequestAjax('POST', url, data, BlogSuccess, null, null, null);
    }
    function UpdateBlog(blogCategory,blogName, blogDesc, blogStatus, blogId) {

        var BlogSuccess = function (result) {
            if (result != "" || result.length > 0) {
                Clear();
                CommonUtility.SucessMessagePopUp("Blog updated successfully.");
                BindBlogList();
            }
        }
        var data = {
            BlogId: blogId,
            BlogCategory: blogCategory,
            BlogName: blogName,
            BlogDesc: blogDesc,
            Status: blogStatus
        };
        var url = '/PudhariAdmin/Blog/UpdateBlog/';
        CommonUtility.RequestAjax('POST', url, data, BlogSuccess, null, null, null);
    }
    //#endregion

    //#region Validation
    $('#txtBlogName').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtBlogName");
    });
    $('#ddlBlogCategory').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("DROPDOWN", "ddlBlogCategory");
    });
    //#endregion

    //#region clear blog controls
    $('body').on('click', "#btnClear", function () {
        Clear();
    });

    function Clear() {
        $("#txtBlogName").val("");
        $("#hdnBlogId").val("");
        $("#ddlBlogCategory").val(0);
        $("#txtBlogDesc").summernote("reset");
        $("#ddlBlogStatus").val("True");
        $("#errtxtBlogName").html("").hide();
    }
    //#endregion

    //#region delete Blog
    $('body').on('click', "#deleteBlog", function () {
        var id = $(this).attr('data-value');
        CommonUtility.DeleteWarningMessagePopIp("Are you sure you want to delete blog", id);
    });
    $('body').on('click', "#finaldelete", function () {
        var id = $(this).attr('data-myval')
        DeleteBlog(id);
    });
    function DeleteBlog(blogId) {
        var blogId = CommonUtility.ScriptInjection(blogId).replace(/</g, "").replace(/>/g, "");
        var BlogSuccess = function (result) {
            if (result != "" || result.length > 0) {
                $("#modal-delete-danger").modal('hide');
                CommonUtility.SucessMessagePopUp("Blog deleted successfully.");
                BindBlogList();
                Clear();
            }
        }
        var data = {
            BlogId: blogId
        };
        var url = '/PudhariAdmin/Blog/DeleteBlog/';
        CommonUtility.RequestAjax('POST', url, data, BlogSuccess, null, null, null);
    }
    //#endregion

    //#region Edit Blog
    $('body').on('click', "#editblog", function () {
        var blogId = $(this).attr('data-value');
        var BindBlogSuccess = function (result) {
            if (result != "" || result.length >= 0) {
                $("#ddlBlogCategory").val(result.BlogCategory);
                $("#txtBlogName").val(result.BlogName);
                $("#txtBlogDesc").summernote('code', result.BlogDesc);
                $("#ddlBlogStatus").val(result.Status);
                $("#hdnBlogId").val(result.BlogId);
            }
        }
        var data = {
            BlogId: blogId
        };
        var url = '/PudhariAdmin/Blog/GetBlogById/';
        CommonUtility.RequestAjax('GET', url, data, BindBlogSuccess, null, null, null);
    });
    //#endregion
    //#region Function return
    return {
        BindBlogList: BindBlogList,
        AddBlog: AddBlog,
        Clear: Clear,
        DeleteData: DeleteData,
        DeleteBlog: DeleteBlog
    }
    //#endregion

})();



