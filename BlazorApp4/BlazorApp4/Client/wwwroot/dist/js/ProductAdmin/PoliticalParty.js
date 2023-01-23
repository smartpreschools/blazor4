var PoliticalParty = (function () {

    //#region Ready Function Start Point
    $(document).ready(function () {
        BindPartyList();
    });
    //#endregion

    //#region Bind Category List
    function BindPartyList() {
        var BindPartySuccess = function (result) {
            if (result != "" || result.length >= 0) {
                $('#partylist').DataTable({
                    data: result,
                    "bFilter": true,
                    "bLengthChange": true,
                    "bDestroy": true,
                    "lengthMenu": [[5, 10, 25, -1], [5, 10, 25, "All"]],
                    columns: [
                        { data: 'PartyName' },
                        { data: 'PartyDesc' },
                        {
                            data: "Status",
                            render: function (data, type, row) {
                                if (data === "True") { return "Active" }
                                else return "InActive"
                            }
                        },
                        {
                            "data": "PartyID",
                            "searchable": false,
                            "sortable": false,
                            "render": function (data, type, full, meta) {
                                return '<i class="fas fa-edit" id="editParty" data-value ="' + data + '"></i>|<i class="fas fa-trash-alt" id="deleteParty" data-value ="' + data + '" ></i>';
                            }
                        }
                    ]
                });
            }
        }

        var url = '/ProductAdmin/Master/GetPartyList/';
        CommonUtility.RequestAjax('POST', url, "", BindPartySuccess, null, null, null);
    }
    //#endregion

    //#region Add New Category
    $('body').on('click', "#btnSubmit", function () {
        var partyName = CommonUtility.ScriptInjection($("#txtPartyName").val()).replace(/</g, "").replace(/>/g, "");
        var partyDesc = CommonUtility.ScriptInjection($("#txtPartyDesc").val()).replace(/</g, "").replace(/>/g, "");
        var partyStatus = CommonUtility.ScriptInjection($("#ddlPartyStatus").val()).replace(/</g, "").replace(/>/g, "");
        var partyID = CommonUtility.ScriptInjection($("#hdnPartyID").val()).replace(/</g, "").replace(/>/g, "");

        if (partyName != "") {
            if (partyID != "")
                UpdateParty(partyName, partyDesc, partyStatus, partyID);
            else
                AddParty(partyName, partyDesc, partyStatus);
        }
        else {
            CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtPartyName");
        }
    });

    function AddParty(partyName, partyDesc, partyStatus) {
        var PartySuccess = function (result) {
            if (result != "" || result.length > 0) {
                Clear();
                BindPartyList();
                if (result === 1)
                    CommonUtility.SucessMessagePopUp("Party saved successfully.");
                if (result === -1)
                    CommonUtility.SucessMessagePopUp("Party already exists, could you try another name.");
            }
        }
        var data = {
            PartyName: partyName,
            PartyDesc: partyDesc,
            Status: partyStatus
        };
        var url = '/ProductAdmin/Master/Party/';
        CommonUtility.RequestAjax('POST', url, data, PartySuccess, null, null, null);
    }

    function UpdateParty(partyName, partyDesc, partyStatus, partyID) {
        var PartySuccess = function (result) {
            if (result != "" || result.length > 0) {
                Clear();
                CommonUtility.SucessMessagePopUp("Party updated successfully.");
                BindPartyList();
            }
        }
        var data = {
            PartyID: partyID,
            PartyName: partyName,
            PartyDesc: partyDesc,
            Status: partyStatus
        };
        var url = '/ProductAdmin/Master/UpdateParty/';
        CommonUtility.RequestAjax('POST', url, data, PartySuccess, null, null, null);
    }
    //#endregion

    //#region Validation
    $('#txtPartyName').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtPartyName");
    });
    //#endregion

    //#region clear PoliticalParty controls
    $('body').on('click', "#btnClear", function () {
        Clear();
    });

    function Clear() {
        $("#txtPartyName").val("");
        $("#txtPartyDesc").val("");
        $("#hdnPartyID").val("");

        $("#errtxtPartyName").html("").hide();
    }
    //#endregion

    //#region delete Category
    $('body').on('click', "#deleteParty", function () {
        var id = $(this).attr('data-value');
        CommonUtility.DeleteWarningMessagePopIp("Are you sure you want to delete party", id);
    });
    $('body').on('click', "#finaldelete", function () {
        var id = $(this).attr('data-myval')
        DeleteParty(id);
    });
    function DeleteParty(PartyID) {
        var partyID = CommonUtility.ScriptInjection(PartyID).replace(/</g, "").replace(/>/g, "");
        var PartySuccess = function (result) {
            if (result != "" || result.length > 0) {
                $("#modal-delete-danger").modal('hide');
                CommonUtility.SucessMessagePopUp("Party Deleted successfully.");
                BindPartyList();
                Clear();
            }
        }
        var data = {
            PartyID: partyID
        };
        var url = '/ProductAdmin/Master/DeletePArty/';
        CommonUtility.RequestAjax('POST', url, data, PartySuccess, null, null, null);
    }
    //#endregion

    //#region Edit Category
    $('body').on('click', "#editParty", function () {
        var partyID = $(this).attr('data-value');
        var BindPartySuccess = function (result) {
            if (result != "" || result.length >= 0) {
                $("#txtPartyName").val(result.PartyName);
                $("#txtPartyDesc").val(result.PartyDesc);
                $("#ddlPartyStatus").val(result.Status);
                $("#hdnPartyID").val(result.PartyID);
            }
        }
        var data = {
            PartyID: partyID
        };
        var url = '/ProductAdmin/Master/GetPartyByID/';
        CommonUtility.RequestAjax('GET', url, data, BindPartySuccess, null, null, null);
    });
    //#endregion
    //#region Function return
    return {
        BindPartyList: BindPartyList,
        AddParty: AddParty,
        Clear: Clear,
        DeleteData: DeleteData,
        DeleteParty: DeleteParty
    }
    //#endregion

})();



