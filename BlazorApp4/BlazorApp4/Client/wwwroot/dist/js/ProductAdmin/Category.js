var Category = (function () {
    //#region Ready Function Start Point
    $(document).ready(function () {
        BindCategoryList();
    });
    //#endregion

    //#region Bind Category List
    function BindCategoryList() {
        var BindCategorySuccess = function (result) {
            if (result != "" || result.length >= 0) {
                $('#categorylist').DataTable({
                    data: result,
                    "bFilter": true,
                    "bLengthChange": true,
                    "bDestroy": true,
                    "lengthMenu": [[5, 10, 25, -1], [5, 10, 25, "All"]],
                    columns: [
                        { data: 'CategoryName' },
                        { data: 'CategoryDesc' },
                        {
                            data: "Status",
                            render: function (data, type, row) {
                                if (data === "True") { return "Active" }
                                else return "InActive"
                            }
                        },
                        {
                            "data": "CategoryID",
                            "searchable": false,
                            "sortable": false,
                            "render": function (data, type, full, meta) {
                                return '<i class="fas fa-edit" id="editcategory" data-value ="' + data + '"></i>|<i class="fas fa-trash-alt" id="deleteCategory" data-value ="' + data + '" ></i>';
                            }
                        }
                    ]
                });
            }
        }

        var url = '/ProductAdmin/Master/GetCategoryList/';
        CommonUtility.RequestAjax('POST', url, "", BindCategorySuccess, null, null, null);
    }
    //#endregion

    //#region Add New Category
    $('body').on('click', "#btnSubmit", function () {
        var categoryName = CommonUtility.ScriptInjection($("#txtCategoryName").val()).replace(/</g, "").replace(/>/g, "");
        var categoryDesc = CommonUtility.ScriptInjection($("#txtCategoryDesc").val()).replace(/</g, "").replace(/>/g, "");
        var categoryStatus = CommonUtility.ScriptInjection($("#ddlCategoryStatus").val()).replace(/</g, "").replace(/>/g, "");
        var categoryID = CommonUtility.ScriptInjection($("#hdnCategoryID").val()).replace(/</g, "").replace(/>/g, "");
        if (categoryName != "") {
            if (categoryID != "")
                UpdateCategory(categoryName, categoryDesc, categoryStatus, categoryID);
            else
                AddCategory(categoryName, categoryDesc, categoryStatus);
        }
        else {
            CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtCategoryName");
        }
    });

    function AddCategory(categoryName, categoryDesc, categoryStatus) {

        var CategorySuccess = function (result) {
            if (result != "" || result.length > 0) {
                if (result===1)
                    CommonUtility.SucessMessagePopUp("Category saved successfully.");
                if (result === -1)
                    CommonUtility.SucessMessagePopUp("Category already exists, could you try another name.");
                BindCategoryList();
                Clear();
            }
        }
        var data = {
            CategoryName: categoryName,
            CategoryDesc: categoryDesc,
            Status: categoryStatus
        };
        var url = '/ProductAdmin/Master/Category/';
        CommonUtility.RequestAjax('POST', url, data, CategorySuccess, null, null, null);
    }
    function UpdateCategory(categoryName, categoryDesc, categoryStatus,categoryID) {

        var CategorySuccess = function (result) {
            if (result != "" || result.length > 0) {
                Clear();
                CommonUtility.SucessMessagePopUp("Category updated successfully.");
                BindCategoryList();
            }
        }
        var data = {
            CategoryID: categoryID,
            CategoryName: categoryName,
            CategoryDesc: categoryDesc,
            Status: categoryStatus
        };
        var url = '/ProductAdmin/Master/UpdateCategory/';
        CommonUtility.RequestAjax('POST', url, data, CategorySuccess, null, null, null);
    }
    //#endregion

    //#region Validation
    $('#txtCategoryName').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtCategoryName");
    });
    //#endregion

    //#region clear category controls
    $('body').on('click', "#btnClear", function () {
        Clear();
    });

    function Clear() {
        $("#txtCategoryName").val("");
        $("#txtCategoryDesc").val("");
        $("#hdnCategoryID").val("");

        $("#errtxtCategoryName").html("").hide();
    }
    //#endregion

    //#region delete Category
    $('body').on('click', "#deleteCategory", function () {
        var id = $(this).attr('data-value');
        CommonUtility.DeleteWarningMessagePopIp("Are you sure you want to delete category", id);
    });
    $('body').on('click', "#finaldelete", function () {
        var id = $(this).attr('data-myval')
        DeleteCategory(id);
    });
    function DeleteCategory(CategoryID) {
        var categoryID = CommonUtility.ScriptInjection(CategoryID).replace(/</g, "").replace(/>/g, "");
        var CategorySuccess = function (result) {
            if (result != "" || result.length > 0) {
                $("#modal-delete-danger").modal('hide');
                CommonUtility.SucessMessagePopUp("Category Deleted successfully.");
                BindCategoryList();
                Clear();
            }
        }
        var data = {
            CategoryID: categoryID
        };
        var url = '/ProductAdmin/Master/DeleteCategory/';
        CommonUtility.RequestAjax('POST', url, data, CategorySuccess, null, null, null);
    }
    //#endregion

    //#region Edit Category
    $('body').on('click', "#editcategory", function () {
        var catID = $(this).attr('data-value');
        var BindCategorySuccess = function (result) {
            if (result != "" || result.length >= 0) {
                $("#txtCategoryName").val(result.CategoryName);
                $("#txtCategoryDesc").val(result.CategoryDesc);
                $("#ddlCategoryStatus").val(result.Status);
                $("#hdnCategoryID").val(result.CategoryID);
            }
        }
        var data = {
            CategoryID: catID
        };
        var url = '/ProductAdmin/Master/GetCategoryByID/';
        CommonUtility.RequestAjax('GET', url, data, BindCategorySuccess, null, null, null);
    });
    //#endregion
    //#region Function return
    return {
        BindCategoryList: BindCategoryList,
        AddCategory: AddCategory,
        Clear: Clear,
        DeleteData: DeleteData,
        DeleteCategory: DeleteCategory
    }
    //#endregion

})();



