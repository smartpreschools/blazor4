var FreeEmail = (function () {

    //#region Ready Function Start Point
    $(document).ready(function () {
        BindFreeEmailCountList();
    });
    //#endregion

    //#region Bind Category List
    function BindFreeEmailCountList() {
        var Success = function (result) {
            if (result != "" || result.length >= 0) {
                $('#smsTypelist').DataTable({
                    data: result,
                    "bFilter": true,
                    "bLengthChange": true,
                    "bDestroy": true,
                    "lengthMenu": [[5, 10, 25, -1], [5, 10, 25, "All"]],
                    columns: [
                        { data: 'FreeEmail' },
                        { data: 'FreeEmailDesc' },
                        {
                            data: "Status",
                            render: function (data, type, row) {
                                if (data === "True") { return "Active" }
                                else return "InActive"
                            }
                        },
                        {
                            "data": "FreeEmailID",
                            "searchable": false,
                            "sortable": false,
                            "render": function (data, type, full, meta) {
                                return '<i class="fas fa-edit" id="editFreeEmail" data-value ="' + data + '"></i>|<i class="fas fa-trash-alt" id="deleteFreeEmail" data-value ="' + data + '" ></i>';
                            }
                        }
                    ]
                });
            }
        }

        var url = '/ProductAdmin/Master/GetFreeEmailList/';
        CommonUtility.RequestAjax('POST', url, "", Success, null, null, null);
    }
    //#endregion

    //#region Add New Category
    $('body').on('click', "#btnSubmit", function () {
        var freeEmailCount = CommonUtility.ScriptInjection($("#txtFreeEmailCount").val()).replace(/</g, "").replace(/>/g, "");
        var desc = CommonUtility.ScriptInjection($("#txtDesc").val()).replace(/</g, "").replace(/>/g, "");
        var status = CommonUtility.ScriptInjection($("#ddlStatus").val()).replace(/</g, "").replace(/>/g, "");
        var freeEmailID = CommonUtility.ScriptInjection($("#hdnFreeEmailID").val()).replace(/</g, "").replace(/>/g, "");

        if (freeEmailCount != "") {
            if (freeEmailID != "")
                UpdateFreeEmailCount(freeEmailCount, desc, status, freeEmailID);
            else
                AddFreeEmailCount(freeEmailCount, desc, status);
        }
        else {
            CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtFreeEmailCount");
        }
    });

    function AddFreeEmailCount(freeEmailCount, desc, status) {
        var Success = function (result) {
            if (result != "" || result.length > 0) {
                Clear();
                BindFreeEmailCountList();
                if (result === 1)
                    CommonUtility.SucessMessagePopUp("Free email count saved successfully.");
                if (result === -1)
                    CommonUtility.SucessMessagePopUp("Free email count exists, could you try another name.");
            }
        }
        var data = {
            FreeEmail: freeEmailCount,
            FreeEmailDesc: desc,
            Status: status
        };
        var url = '/ProductAdmin/Master/AddFreeEmail/';
        CommonUtility.RequestAjax('POST', url, data, Success, null, null, null);
    }

    function UpdateFreeEmailCount(freeEmailCount, desc, status, freeEmailID) {
        var SMSTypeSuccess = function (result) {
            if (result != "" || result.length > 0) {
                Clear();
                CommonUtility.SucessMessagePopUp("Free email count updated successfully.");
                BindFreeEmailCountList();
            }
        }
        var data = {
            FreeEmailID: freeEmailID,
            FreeEmail: freeEmailCount,
            FreeEmailDesc: desc,
            Status: status
        };
        var url = '/ProductAdmin/Master/UpdateFreeEmail/';
        CommonUtility.RequestAjax('POST', url, data, SMSTypeSuccess, null, null, null);
    }
    //#endregion

    //#region Validation
    $('#txtFreeEmailCount').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtFreeEmailCount");
    });
    //#endregion

    //#region clear PoliticalParty controls
    $('body').on('click', "#btnClear", function () {
        Clear();
    });

    function Clear() {
        $("#txtFreeEmailCount").val("");
        $("#txtDesc").val("");
        $("#hdnFreeEmailID").val("");

        $("#errtxtFreeEmailCount").html("").hide();
    }
    //#endregion

    //#region delete Category
    $('body').on('click', "#deleteFreeEmail", function () {
        var id = $(this).attr('data-value');
        CommonUtility.DeleteWarningMessagePopIp("Are you sure you want to delete free email count ", id);
    });
    $('body').on('click', "#finaldelete", function () {
        var id = $(this).attr('data-myval')
        DeleteFreeEmailCount(id);
    });
    function DeleteFreeEmailCount(FreeEmailID) {
        var freeEmailID = CommonUtility.ScriptInjection(FreeEmailID).replace(/</g, "").replace(/>/g, "");
        var Success = function (result) {
            if (result != "" || result.length > 0) {
                $("#modal-delete-danger").modal('hide');
                CommonUtility.SucessMessagePopUp("Free email count deleted successfully.");
                BindFreeEmailCountList();
                Clear();
            }
        }
        var data = {
            FreeEmailID: freeEmailID
        };
        var url = '/ProductAdmin/Master/DeleteFreeEmail/';
        CommonUtility.RequestAjax('POST', url, data, Success, null, null, null);
    }
    //#endregion

    //#region Edit Category
    $('body').on('click', "#editFreeEmail", function () {
        var freeEmailID = $(this).attr('data-value');
        var Success = function (result) {
            if (result != "" || result.length >= 0) {
                $("#txtFreeEmailCount").val(result.FreeEmail);
                $("#txtDesc").val(result.FreeEmailDesc);
                $("#ddlStatus").val(result.Status);
                $("#hdnFreeEmailID").val(result.FreeEmailID);
            }
        }
        var data = {
            FreeEmailID: freeEmailID
        };
        var url = '/ProductAdmin/Master/GetFreeEmailByID/';
        CommonUtility.RequestAjax('GET', url, data, Success, null, null, null);
    });
    //#endregion
    //#region Function return
    return {
        BindFreeEmailCountList: BindFreeEmailCountList,
        AddSMSType: AddSMSType,
        Clear: Clear,
        DeleteData: DeleteData,
        DeleteSMSType: DeleteSMSType
    }
    //#endregion

})();



