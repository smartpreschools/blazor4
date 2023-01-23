var Validity = (function () {

    //#region Ready Function Start Point
    $(document).ready(function () {
        BindValidityList();
    });
    //#endregion

    //#region Bind Category List
    function BindValidityList() {
        var ValiditySuccess = function (result) {
            if (result != "" || result.length >= 0) {
                $('#validitylist').DataTable({
                    data: result,
                    "bFilter": true,
                    "bLengthChange": true,
                    "bDestroy": true,
                    "lengthMenu": [[5, 10, 25, -1], [5, 10, 25, "All"]],
                    columns: [
                        { data: 'ValidityName' },
                        { data: 'ValidityDesc' },
                        {
                            data: "Status",
                            render: function (data, type, row) {
                                if (data === "True") { return "Active" }
                                else return "InActive"
                            }
                        },
                        {
                            "data": "ValidityID",
                            "searchable": false,
                            "sortable": false,
                            "render": function (data, type, full, meta) {
                                return '<i class="fas fa-edit" id="editValidity" data-value ="' + data + '"></i>|<i class="fas fa-trash-alt" id="deleteValidity" data-value ="' + data + '" ></i>';
                            }
                        }
                    ]
                });
            }
        }

        var url = '/ProductAdmin/Master/GetValidityList/';
        CommonUtility.RequestAjax('POST', url, "", ValiditySuccess, null, null, null);
    }
    //#endregion

    //#region Add New Category
    $('body').on('click', "#btnSubmit", function () {
        var validityName = CommonUtility.ScriptInjection($("#txtValidityName").val()).replace(/</g, "").replace(/>/g, "");
        var validityDesc = CommonUtility.ScriptInjection($("#txtValidityDesc").val()).replace(/</g, "").replace(/>/g, "");
        var validityStatus = CommonUtility.ScriptInjection($("#ddlValidityStatus").val()).replace(/</g, "").replace(/>/g, "");
        var validityID = CommonUtility.ScriptInjection($("#hdnValidityID").val()).replace(/</g, "").replace(/>/g, "");

        if (validityName != "") {
            if (validityID != "")
                UpdateValidity(validityName, validityDesc, validityStatus, validityID);
            else
                AddValidity(validityName, validityDesc, validityStatus);
        }
        else {
            CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtValidityName");
        }
    });

    function AddValidity(validityName, validityDesc, validityStatus) {
        var ValiditySuccess = function (result) {
            if (result != "" || result.length > 0) {
                Clear();
                BindValidityList();
                if (result === 1)
                    CommonUtility.SucessMessagePopUp("Plan Validity saved successfully.");
                if (result === -1)
                    CommonUtility.SucessMessagePopUp("Plan Validity exists, could you try another name.");
            }
        }
        var data = {
            ValidityName: validityName,
            ValidityDesc: validityDesc,
            Status: validityStatus
        };
        var url = '/ProductAdmin/Master/AddValidity/';
        CommonUtility.RequestAjax('POST', url, data, ValiditySuccess, null, null, null);
    }

    function UpdateValidity(validityName, validityDesc, validityStatus, validityID) {
        var ValiditySuccess = function (result) {
            if (result != "" || result.length > 0) {
                Clear();
                CommonUtility.SucessMessagePopUp("Plan Validity updated successfully.");
                BindValidityList();
            }
        }
        var data = {
            ValidityID: validityID,
            ValidityName: validityName,
            ValidityDesc: validityDesc,
            Status: validityStatus
        };
        var url = '/ProductAdmin/Master/UpdateValidity/';
        CommonUtility.RequestAjax('POST', url, data, ValiditySuccess, null, null, null);
    }
    //#endregion

    //#region Validation
    $('#txtValidityName').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtValidityName");
    });
    //#endregion

    //#region clear PoliticalParty controls
    $('body').on('click', "#btnClear", function () {
        Clear();
    });

    function Clear() {
        $("#txtValidityName").val("");
        $("#txtValidityDesc").val("");
        $("#hdnValidityID").val("");

        $("#errtxtValidityName").html("").hide();
    }
    //#endregion

    //#region delete Category
    $('body').on('click', "#deleteValidity", function () {
        var id = $(this).attr('data-value');
        CommonUtility.DeleteWarningMessagePopIp("Are you sure you want to delete plan validity", id);
    });
    $('body').on('click', "#finaldelete", function () {
        var id = $(this).attr('data-myval')
        DeleteValidity(id);
    });
    function DeleteValidity(ValidityID) {
        var validityID = CommonUtility.ScriptInjection(ValidityID).replace(/</g, "").replace(/>/g, "");
        var ValiditySuccess = function (result) {
            if (result != "" || result.length > 0) {
                $("#modal-delete-danger").modal('hide');
                CommonUtility.SucessMessagePopUp("Plan validity Deleted successfully.");
                BindValidityList();
                Clear();
            }
        }
        var data = {
            ValidityID: validityID
        };
        var url = '/ProductAdmin/Master/DeleteValidity/';
        CommonUtility.RequestAjax('POST', url, data, ValiditySuccess, null, null, null);
    }
    //#endregion

    //#region Edit Category
    $('body').on('click', "#editValidity", function () {
        var validityID = $(this).attr('data-value');
        var BindValiditySuccess = function (result) {
            if (result != "" || result.length >= 0) {
                $("#txtValidityName").val(result.ValidityName);
                $("#txtValidityDesc").val(result.ValidityDesc);
                $("#ddlValidityStatus").val(result.Status);
                $("#hdnValidityID").val(result.ValidityID);
            }
        }
        var data = {
            ValidityID: validityID
        };
        var url = '/ProductAdmin/Master/GetValidityByID/';
        CommonUtility.RequestAjax('GET', url, data, BindValiditySuccess, null, null, null);
    });
    //#endregion
    //#region Function return
    return {
        BindValidityList: BindValidityList,
        AddValidity: AddValidity,
        Clear: Clear,
        DeleteData: DeleteData,
        DeleteValidity: DeleteValidity
    }
    //#endregion

})();



