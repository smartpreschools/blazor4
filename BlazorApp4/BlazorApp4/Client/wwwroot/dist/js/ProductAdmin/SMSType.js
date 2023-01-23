var SMSType = (function () {

    //#region Ready Function Start Point
    $(document).ready(function () {
        BindSMSTypeList();
    });
    //#endregion

    //#region Bind Category List
    function BindSMSTypeList() {
        var SMSTypeSuccess = function (result) {
            if (result != "" || result.length >= 0) {
                $('#smsTypelist').DataTable({
                    data: result,
                    "bFilter": true,
                    "bLengthChange": true,
                    "bDestroy": true,
                    "lengthMenu": [[5, 10, 25, -1], [5, 10, 25, "All"]],
                    columns: [
                        { data: 'SMSTypeName' },
                        { data: 'SMSTypeDesc' },
                        {
                            data: "Status",
                            render: function (data, type, row) {
                                if (data === "True") { return "Active" }
                                else return "InActive"
                            }
                        },
                        {
                            "data": "SMSTypeID",
                            "searchable": false,
                            "sortable": false,
                            "render": function (data, type, full, meta) {
                                return '<i class="fas fa-edit" id="editSMSType" data-value ="' + data + '"></i>|<i class="fas fa-trash-alt" id="deleteSMSType" data-value ="' + data + '" ></i>';
                            }
                        }
                    ]
                });
            }
        }

        var url = '/ProductAdmin/Master/GetSMSTypeList/';
        CommonUtility.RequestAjax('POST', url, "", SMSTypeSuccess, null, null, null);
    }
    //#endregion

    //#region Add New Category
    $('body').on('click', "#btnSubmit", function () {
        var smsTypeName = CommonUtility.ScriptInjection($("#txtSMSTypeName").val()).replace(/</g, "").replace(/>/g, "");
        var smsTypeDesc = CommonUtility.ScriptInjection($("#txtSMSTypeDesc").val()).replace(/</g, "").replace(/>/g, "");
        var smsTypeStatus = CommonUtility.ScriptInjection($("#ddlSMSTypeStatus").val()).replace(/</g, "").replace(/>/g, "");
        var smsTypeID = CommonUtility.ScriptInjection($("#hdnSMSTypeID").val()).replace(/</g, "").replace(/>/g, "");

        if (smsTypeName != "") {
            if (smsTypeID != "")
                UpdateSMSType(smsTypeName, smsTypeDesc, smsTypeStatus, smsTypeID);
            else
                AddSMSType(smsTypeName, smsTypeDesc, smsTypeStatus);
        }
        else {
            CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtSMSTypeName");
        }
    });

    function AddSMSType(smsTypeName, smsTypeDesc, smsTypeStatus) {
        var SMSTypeSuccess = function (result) {
            if (result != "" || result.length > 0) {
                Clear();
                BindSMSTypeList();
                if (result === 1)
                    CommonUtility.SucessMessagePopUp("SMS Type saved successfully.");
                if (result === -1)
                    CommonUtility.SucessMessagePopUp("SMS Type exists, could you try another name.");
            }
        }
        var data = {
            SMSTypeName: smsTypeName,
            SMSTypeDesc: smsTypeDesc,
            Status: smsTypeStatus
        };
        var url = '/ProductAdmin/Master/AddSMSType/';
        CommonUtility.RequestAjax('POST', url, data, SMSTypeSuccess, null, null, null);
    }

    function UpdateSMSType(smsTypeName, smsTypeDesc, smsTypeStatus, smsTypeID) {
        var SMSTypeSuccess = function (result) {
            if (result != "" || result.length > 0) {
                Clear();
                CommonUtility.SucessMessagePopUp("SMS Type updated successfully.");
                BindSMSTypeList();
            }
        }
        var data = {
            SMSTypeID: smsTypeID,
            SMSTypeName: smsTypeName,
            SMSTypeDesc: smsTypeDesc,
            Status: smsTypeStatus
        };
        var url = '/ProductAdmin/Master/UpdateSMSType/';
        CommonUtility.RequestAjax('POST', url, data, SMSTypeSuccess, null, null, null);
    }
    //#endregion

    //#region Validation
    $('#txtSMSTypeName').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtSMSTypeName");
    });
    //#endregion

    //#region clear PoliticalParty controls
    $('body').on('click', "#btnClear", function () {
        Clear();
    });

    function Clear() {
        $("#txtSMSTypeName").val("");
        $("#txtSMSTypeDesc").val("");
        $("#hdnSMSTypeID").val("");

        $("#errtxtSMSTypeName").html("").hide();
    }
    //#endregion

    //#region delete Category
    $('body').on('click', "#deleteSMSType", function () {
        var id = $(this).attr('data-value');
        CommonUtility.DeleteWarningMessagePopIp("Are you sure you want to delete sms type", id);
    });
    $('body').on('click', "#finaldelete", function () {
        var id = $(this).attr('data-myval')
        DeleteSMSType(id);
    });
    function DeleteSMSType(SMSTypeID) {
        var smsTypeID = CommonUtility.ScriptInjection(SMSTypeID).replace(/</g, "").replace(/>/g, "");
        var SMSTypeSuccess = function (result) {
            if (result != "" || result.length > 0) {
                $("#modal-delete-danger").modal('hide');
                CommonUtility.SucessMessagePopUp("SMS Type Deleted successfully.");
                BindSMSTypeList();
                Clear();
            }
        }
        var data = {
            SMSTypeID: smsTypeID
        };
        var url = '/ProductAdmin/Master/DeleteSMSType/';
        CommonUtility.RequestAjax('POST', url, data, SMSTypeSuccess, null, null, null);
    }
    //#endregion

    //#region Edit Category
    $('body').on('click', "#editSMSType", function () {
        var smsTypeID = $(this).attr('data-value');
        var SMSTypeSuccess = function (result) {
            if (result != "" || result.length >= 0) {
                $("#txtSMSTypeName").val(result.SMSTypeName);
                $("#txtSMSTypeDesc").val(result.SMSTypeDesc);
                $("#ddlSMSTypeStatus").val(result.Status);
                $("#hdnSMSTypeID").val(result.SMSTypeID);
            }
        }
        var data = {
            SMSTypeID: smsTypeID
        };
        var url = '/ProductAdmin/Master/GetSMSTypeByID/';
        CommonUtility.RequestAjax('GET', url, data, SMSTypeSuccess, null, null, null);
    });
    //#endregion
    //#region Function return
    return {
        BindSMSTypeList: BindSMSTypeList,
        AddSMSType: AddSMSType,
        Clear: Clear,
        DeleteData: DeleteData,
        DeleteSMSType: DeleteSMSType
    }
    //#endregion

})();



