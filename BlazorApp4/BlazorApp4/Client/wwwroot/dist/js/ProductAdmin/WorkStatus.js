var WorkStatus = (function () {
    //#region Ready Function Start Point
    $(document).ready(function () {
        BindWorkStatusList();
    });
    //#endregion

    //#region Bind Work List
    function BindWorkStatusList() {
        var Success = function (result) {
            if (result != "" || result.length >= 0) {
                $('#workStatuslist').DataTable({
                    data: result,
                    "bFilter": true,
                    "bLengthChange": true,
                    "bDestroy": true,
                    "lengthMenu": [[5, 10, 25, -1], [5, 10, 25, "All"]],
                    columns: [
                        { data: 'WorkStatusName' },
                        { data: 'Status' },
                        {
                            "data": "WorkStatusId",
                            "searchable": false,
                            "sortable": false,
                            "render": function (data, type, full, meta) {
                                return '<i class="fas fa-edit" id="editWorkStatus" data-value ="' + data + '"></i>|<i class="fas fa-trash-alt" id="deleteWorkStatus" data-value ="' + data + '" ></i>';
                            }
                        }
                    ]
                });
            }
        }

        var url = '/ProductAdmin/Master/GetWorkStatusList/';
        CommonUtility.RequestAjax('GET', url, "", Success, null, null, null);
    }
    //#endregion

    //#region Add New Work
    $('body').on('click', "#btnSubmit", function () {
        var workStatusName = CommonUtility.ScriptInjection($("#txtWorkStatusName").val()).replace(/</g, "").replace(/>/g, "");
        var desc = CommonUtility.ScriptInjection($("#txtDesc").val()).replace(/</g, "").replace(/>/g, "");
        var status = CommonUtility.ScriptInjection($("#ddlStatus").val()).replace(/</g, "").replace(/>/g, "");
        var workStatusId = CommonUtility.ScriptInjection($("#hdnWorkStatusId").val()).replace(/</g, "").replace(/>/g, "");

        var workStatusNameStatus = CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtWorkStatusName");



        if (workStatusNameStatus) {
            if (workStatusId != "")
                UpdateWorkStatus(workStatusName, desc, status, workStatusId)
            else
                AddWorkStatus(workStatusName, desc, status);
        }
    });

    function AddWorkStatus(work, desc, status) {
        var Success = function (result) {
            if (result != "" || result.length > 0) {
                Clear();
                BindWorkStatusList();
                if (result === 1)
                    CommonUtility.SucessMessagePopUp("Work status name saved successfully.");
                if (result === -1)
                    CommonUtility.SucessMessagePopUp("Work status name exists, could you try another name.");
            }
        }
        var data = {
            WorkStatusName: work,
            Desc: desc,
            Status: status
        };
        var url = '/ProductAdmin/Master/WorkStatus/';
        CommonUtility.RequestAjax('POST', url, data, Success, null, null, null);
    }

    function UpdateWorkStatus(work, desc, status, workStatusId) {
        var Success = function (result) {
            if (result != "" || result.length > 0) {
                Clear();
                CommonUtility.SucessMessagePopUp("Work status name updated successfully.");
                BindWorkStatusList();
            }
        }
        var data = {
            WorkStatusId: workStatusId,
            WorkStatusName: work,
            Desc: desc,
            Status: status
        };
        var url = '/ProductAdmin/Master/UpdateWorkStatus/';
        CommonUtility.RequestAjax('POST', url, data, Success, null, null, null);
    }
    //#endregion

    //#region Validation
    $('#txtWorkStatusName').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtWorkStatusName");
    });



    //#endregion

    //#region clear PoliticalParty controls
    $('body').on('click', "#btnClear", function () {
        Clear();
    });

    function Clear() {
        $("#txtWorkStatusName").val("");
        $("#txtDesc").val("");
        $("#hdnWorkStatusId").val("");
        $("#errtxtWorkStatusName").html("").hide();
        $("#ddlStatus").val("True");

    }
    //#endregion

    //#region delete Work
    $('body').on('click', "#deleteWorkStatus", function () {
        var id = $(this).attr('data-value');
        CommonUtility.DeleteWarningMessagePopIp("Are you sure you want to delete work Work status name", id);
    });
    $('body').on('click', "#finaldelete", function () {
        var id = $(this).attr('data-myval')
        DeleteWorkStatus(id);
    });
    function DeleteWorkStatus(WorkStatusID) {
        var workStatusID = CommonUtility.ScriptInjection(WorkStatusID).replace(/</g, "").replace(/>/g, "");
        var Success = function (result) {
            if (result != "" || result.length > 0) {
                $("#modal-delete-danger").modal('hide');
                CommonUtility.SucessMessagePopUp("Work status name deleted successfully.");
                BindWorkStatusList();
                Clear();
            }
        }
        var data = {
            workStatusId: workStatusID
        };
        var url = '/ProductAdmin/Master/DeleteWorkStatus/';
        CommonUtility.RequestAjax('POST', url, data, Success, null, null, null);
    }
    //#endregion

    //#region Edit Work
    $('body').on('click', "#editWorkStatus", function () {
        var workStatusID = $(this).attr('data-value');
        var BindSuccess = function (result) {
            if (result != "" || result.length >= 0) {
                $("#txtWorkStatusName").val(result.WorkStatusName);
                $("#txtDesc").val(result.Desc);
                $("#ddlStatus").val(result.Status);
                $("#hdnWorkStatusId").val(result.WorkStatusId);
            }
        }
        var data = {
            workStatusId: workStatusID
        };
        var url = '/ProductAdmin/Master/GetWorkStatusById/';
        CommonUtility.RequestAjax('GET', url, data, BindSuccess, null, null, null);
    });
    //#endregion

    //#region Function return
    return {
        BindWorkStatusList: BindWorkStatusList,
        AddWorkStatus: AddWorkStatus,
        Clear: Clear,
        DeleteWorkStatus: DeleteWorkStatus
    }
    //#endregion

})();



