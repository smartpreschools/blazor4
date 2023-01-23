var WorkHistory = (function () {

    //#region Ready Function Start Point
    $(document).ready(function () {
        BindDropdown("#ddlWorkCategory", "WorkCategory", "", true);
        BindDropdown("#ddlWorkStatus", "WorkStatus", "", true);
        BindWorkHistoryList();
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
    function BindWorkHistoryList() {
        var ValiditySuccess = function (result) {
            if (result != "" || result.length >= 0) {
                $('#workHistorylist').DataTable({
                    data: result,
                    "bFilter": true,
                    "bLengthChange": true,
                    "bDestroy": true,
                    "lengthMenu": [[5, 10, 25, -1], [5, 10, 25, "All"]],
                    columns: [
                        { data: 'WorkCategory' },
                        { data: 'WorkStatus' },
                        { data: 'WorkName' },
                        { data: 'WorkLocation' },
                        { data: 'StartDate' },
                        { data: 'EndDate' },
                        {
                            "data": "WorkId",
                            "searchable": false,
                            "sortable": false,
                            "render": function (data, type, full, meta) {
                                return '<i class="fas fa-edit" id="editWorkHistory" data-value ="' + data + '"></i>|<i class="fas fa-trash-alt" id="deleteWorkHistory" data-value ="' + data + '" ></i>';
                            }
                        }
                    ]
                });
            }
        }

        var url = '/PudhariAdmin/Work/GetWorkHistoryList/';
        CommonUtility.RequestAjax('POST', url, "", ValiditySuccess, null, null, null);
    }
    //#endregion

    //#region Add New Category
    $('body').on('click', "#btnSubmit", function () {
        var workCategory = CommonUtility.ScriptInjection($("#ddlWorkCategory").val()).replace(/</g, "").replace(/>/g, "");
        var workStatus = CommonUtility.ScriptInjection($("#ddlWorkStatus").val()).replace(/</g, "").replace(/>/g, "");
        var workName = CommonUtility.ScriptInjection($("#txtWorkName").val()).replace(/</g, "").replace(/>/g, "");
        var workLocation = CommonUtility.ScriptInjection($("#txtWorkLocation").val()).replace(/</g, "").replace(/>/g, "");
        var desc = $("#txtDesc").summernote('code');
        var startDate = CommonUtility.ScriptInjection($("#txtStartDate").val()).replace(/</g, "").replace(/>/g, "");
        var endDate = CommonUtility.ScriptInjection($("#txtEndDate").val()).replace(/</g, "").replace(/>/g, "");
        var status = CommonUtility.ScriptInjection($("#ddlStatus").val()).replace(/</g, "").replace(/>/g, "");
        var workId = CommonUtility.ScriptInjection($("#hdnWorkHistoryId").val()).replace(/</g, "").replace(/>/g, "");

        var workCategoryCheck = CommonValidation.MandetoryControlValueCheck("DROPDOWN", "ddlWorkCategory");
        var workStatusCheck = CommonValidation.MandetoryControlValueCheck("DROPDOWN", "ddlWorkStatus");
        var workNameCheck = CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtWorkName");
        var descCheck = CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtWorkName");

       
        if (workCategoryCheck && workStatusCheck && workNameCheck && descCheck ) {
            if (workId != "")
                UpdateWorkHistory(workCategory, workStatus, workName, workLocation, desc, startDate, endDate,status, workId)
            else
                AddWorkHistory(workCategory, workStatus, workName, workLocation, desc, startDate, endDate,status);
        }
    });

    function AddWorkHistory(workCategory, workStatus, workName, workLocation, desc, startDate, endDate, status) {
        var ValiditySuccess = function (result) {
            if (result != "" || result.length > 0) {
                Clear();
                BindWorkHistoryList();
                if (result === 1)
                    CommonUtility.SucessMessagePopUp("Work history saved successfully.");
                if (result === -1)
                    CommonUtility.SucessMessagePopUp("Work history exists, could you try another name.");
            }
        }
        var data = {
            WorkCategory: workCategory,
            WorkStatus: workStatus,
            WorkName: workName,
            WorkLocation: workLocation,
            Description: desc,
            StartDate: startDate,
            EndDate: endDate,
            Status:status,
        };
        var url = '/PudhariAdmin/Work/AddWorkHistory/';
        CommonUtility.RequestAjax('POST', url, data, ValiditySuccess, null, null, null);
    }

    function UpdateWorkHistory(workCategory, workStatus, workName, workLocation, desc, startDate, endDate,status, workId) {
        var Success = function (result) {
            if (result != "" || result.length > 0) {
                Clear();
                CommonUtility.SucessMessagePopUp("work history updated successfully.");
                BindWorkHistoryList();
            }
        }
        var data = {
            WorkId: workId,
            WorkCategory: workCategory,
            WorkStatus: workStatus,
            WorkName: workName,
            WorkLocation: workLocation,
            Description: desc,
            StartDate: startDate,
            EndDate: endDate,
            Status:status,
        };
        var url = '/PudhariAdmin/Work/UpdateWorkHistory/';
        CommonUtility.RequestAjax('POST', url, data, Success, null, null, null);
    }
    //#endregion

    //#region Validation
    $('#ddlWorkCategory').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("DROPDOWN", "ddlWorkCategory");
    });
    $('#ddlWorkStatus').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("DROPDOWN", "ddlWorkStatus");
    });
    $('#txtWorkLocation').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtWorkLocation");
    });
    $('#txtWorkName').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtWorkName");
    });
    $('#txtDesc').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtDesc");
    });

    //#endregion

    //#region clear PoliticalParty controls
    $('body').on('click', "#btnClear", function () {
        Clear();
    });

    function Clear() {
        $("#ddlWorkCategory").val("0");
        $("#ddlWorkStatus").val("0");
        $("#ddlStatus").val("True");
        $("#txtStartDate").val("");
        $("#txtEndDate").val("");
        $("#txtWorkName").val("");
        $("#txtWorkLocation").val("");
        $("#txtDesc").summernote("reset");
        $("#hdnWorkHistoryId").val("");


        $("#errddlWorkCategory").html("").hide();
        $("#errtxtWorkName").html("").hide();
        $("#errtxtStartDate").html("").hide();
        $("#errtxtEndDate").html("").hide();
       
    }
    //#endregion

    //#region delete Category
    $('body').on('click', "#deleteWorkHistory", function () {
        var id = $(this).attr('data-value');
        CommonUtility.DeleteWarningMessagePopIp("Are you sure you want to delete Work history", id);
    });
    $('body').on('click', "#finaldelete", function () {
        var id = $(this).attr('data-myval')
        DeleteWorkHistory(id);
    });
    function DeleteWorkHistory(workId) {
        var workId = CommonUtility.ScriptInjection(workId).replace(/</g, "").replace(/>/g, "");
        var Success = function (result) {
            if (result != "" || result.length > 0) {
                $("#modal-delete-danger").modal('hide');
                CommonUtility.SucessMessagePopUp("Work history deleted successfully.");
                BindWorkHistoryList();
                Clear();
            }
        }
        var data = {
            WorkId: workId
        };
        var url = '/PudhariAdmin/Work/DeleteWorkHistory/';
        CommonUtility.RequestAjax('POST', url, data, Success, null, null, null);
    }
    //#endregion

    //#region Edit Category
    $('body').on('click', "#editWorkHistory", function () {
        var workId = $(this).attr('data-value');
        var BindSuccess = function (result) {
            if (result != "" || result.length >= 0) {
                $("#ddlWorkCategory").val(result.WorkCategory);
                $("#ddlWorkStatus").val(result.WorkStatus);
                $("#ddlStatus").val(result.Status);
                $("#txtWorkName").val(result.WorkName)
                $("#txtStartDate").val(result.StartDate);
                $("#txtEndDate").val(result.EndDate);
                $("#txtWorkLocation").val(result.WorkLocation);
                $("#txtDesc").summernote("code", result.Description);
                $("#hdnWorkHistoryId").val(result.WorkId);
            }
        }
        var data = {
            WorkId: workId
        };
        var url = '/PudhariAdmin/Work/GetWorkHistoryById/';
        CommonUtility.RequestAjax('GET', url, data, BindSuccess, null, null, null);
    });
    //#endregion

    //#region Function return
    return {
        BindWorkHistoryList: BindWorkHistoryList,
        AddWorkHistory: AddWorkHistory,
        Clear: Clear,
        DeleteWorkHistory: DeleteWorkHistory
    }
    //#endregion

})();



