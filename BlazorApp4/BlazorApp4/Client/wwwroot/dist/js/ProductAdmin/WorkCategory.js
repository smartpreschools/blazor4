var WorkCategory = (function () {
    //#region Ready Function Start Point
    $(document).ready(function () {
        BindWorkCategoryList();
    });
    //#endregion

    //#region Bind Work List
    function BindWorkCategoryList() {
        var Success = function (result) {
            if (result != "" || result.length >= 0) {
                $('#workCategorylist').DataTable({
                    data: result,
                    "bFilter": true,
                    "bLengthChange": true,
                    "bDestroy": true,
                    "lengthMenu": [[5, 10, 25, -1], [5, 10, 25, "All"]],
                    columns: [
                        { data: 'WorkCategoryName' },
                        { data: 'Status' },
                        {
                            "data": "WorkCategoryId",
                            "searchable": false,
                            "sortable": false,
                            "render": function (data, type, full, meta) {
                                return '<i class="fas fa-edit" id="editWorkCategory" data-value ="' + data + '"></i>|<i class="fas fa-trash-alt" id="deleteWorkCategory" data-value ="' + data + '" ></i>';
                            }
                        }
                    ]
                });
            }
        }

        var url = '/ProductAdmin/Master/GetWorkCategoryList/';
        CommonUtility.RequestAjax('GET', url, "", Success, null, null, null);
    }
    //#endregion

    //#region Add New Work
    $('body').on('click', "#btnSubmit", function () {
        var workCategoryName = CommonUtility.ScriptInjection($("#txtWorkCategoryName").val()).replace(/</g, "").replace(/>/g, "");
        var desc = CommonUtility.ScriptInjection($("#txtDesc").val()).replace(/</g, "").replace(/>/g, "");
        var status = CommonUtility.ScriptInjection($("#ddlStatus").val()).replace(/</g, "").replace(/>/g, "");
        var workCategoryId = CommonUtility.ScriptInjection($("#hdnWorkCategoryId").val()).replace(/</g, "").replace(/>/g, "");

        var workCategoryNameStatus = CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtWorkCategoryName");



        if (workCategoryNameStatus) {
            if (workCategoryId != "")
                UpdateWorkCategory(workCategoryName, desc, status, workCategoryId)
            else
                AddWorkCategory(workCategoryName, desc, status);
        }
    });

    function AddWorkCategory(work, desc, status) {
        var Success = function (result) {
            if (result != "" || result.length > 0) {
                Clear();
                BindWorkCategoryList();
                if (result === 1)
                    CommonUtility.SucessMessagePopUp("Work Category name saved successfully.");
                if (result === -1)
                    CommonUtility.SucessMessagePopUp("Work Category name exists, could you try another name.");
            }
        }
        var data = {
            WorkCategoryName: work,
            Desc: desc,
            Status: status
        };
        var url = '/ProductAdmin/Master/WorkCategory/';
        CommonUtility.RequestAjax('POST', url, data, Success, null, null, null);
    }

    function UpdateWorkCategory(work, desc, status, workCategoryId) {
        var Success = function (result) {
            if (result != "" || result.length > 0) {
                Clear();
                CommonUtility.SucessMessagePopUp("Work Category name updated successfully.");
                BindWorkCategoryList();
            }
        }
        var data = {
            WorkCategoryId: workCategoryId,
            WorkCategoryName: work,
            Desc: desc,
            Status: status
        };
        var url = '/ProductAdmin/Master/UpdateWorkCategory/';
        CommonUtility.RequestAjax('POST', url, data, Success, null, null, null);
    }
    //#endregion

    //#region Validation
    $('#txtWorkCategoryName').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtWorkCategoryName");
    });
    //#endregion

    //#region clear PoliticalParty controls
    $('body').on('click', "#btnClear", function () {
        Clear();
    });

    function Clear() {
        $("#txtWorkCategoryName").val("");
        $("#txtDesc").val("");
        $("#hdnWorkCategoryId").val("");
        $("#errtxtWorkCategoryName").html("").hide();
        $("#ddlStatus").val("True");

    }
    //#endregion

    //#region delete Work
    $('body').on('click', "#deleteWorkCategory", function () {
        var id = $(this).attr('data-value');
        CommonUtility.DeleteWarningMessagePopIp("Are you sure you want to delete work category name", id);
    });
    $('body').on('click', "#finaldelete", function () {
        var id = $(this).attr('data-myval')
        DeleteWorkCategory(id);
    });
    function DeleteWorkCategory(WorkCategoryID) {
        var workCategoryID = CommonUtility.ScriptInjection(WorkCategoryID).replace(/</g, "").replace(/>/g, "");
        var Success = function (result) {
            if (result != "" || result.length > 0) {
                $("#modal-delete-danger").modal('hide');
                CommonUtility.SucessMessagePopUp("Work category name deleted successfully.");
                BindWorkCategoryList();
                Clear();
            }
        }
        var data = {
            workCategoryId: workCategoryID
        };
        var url = '/ProductAdmin/Master/DeleteWorkCategory/';
        CommonUtility.RequestAjax('POST', url, data, Success, null, null, null);
    }
    //#endregion

    //#region Edit Work
    $('body').on('click', "#editWorkCategory", function () {
        var workCategoryID = $(this).attr('data-value');
        var BindSuccess = function (result) {
            if (result != "" || result.length >= 0) {
                $("#txtWorkCategoryName").val(result.WorkCategoryName);
                $("#txtDesc").val(result.Desc);
                $("#ddlStatus").val(result.Status);
                $("#hdnWorkCategoryId").val(result.WorkCategoryId);
            }
        }
        var data = {
            workCategoryId: workCategoryID
        };
        var url = '/ProductAdmin/Master/GetWorkCategoryById/';
        CommonUtility.RequestAjax('GET', url, data, BindSuccess, null, null, null);
    });
    //#endregion

    //#region Function return
    return {
        BindWorkCategoryList: BindWorkCategoryList,
        AddWorkCategory: AddWorkCategory,
        Clear: Clear,
        DeleteWorkCategory: DeleteWorkCategory
    }
    //#endregion

})();



