var State = (function () {

    //#region Ready Function Start Point
    $(document).ready(function () {
        BindCountryDropdown();
        BindStateList();
    });
    //#endregion
    var optionSelect = "<option value='0' selected>Select value.. </option";
    //#region Bind Country List
    function BindCountryDropdown() {
        var BindCountryDropDown = function (result) {
            if (result != "" || result.length > 0) {
                $.map(result, function (opt) {
                    var option = $('<option>' + opt.DataName + '</option>');
                    option.attr('value', opt.DataId);
                    $("#ddlCountry").append(option);
                });
                $("#ddlCountry").prepend(optionSelect);
            }
        }
        var data = {
            dropName: "Country",
            inputText: "",
        };
        var url = '/ProductAdmin/Master/GetDropDownData/';
        CommonUtility.RequestAjax('GET', url, data, BindCountryDropDown, null, null, null);
    }
    //#endregion
    //#region Bind State List
    function BindStateList() {
        var BindStateSuccess = function (result) {
            if (result != "" || result.length >= 0) {
                $('#statelist').DataTable({
                    data: result,
                    "bFilter": true,
                    "bLengthChange": true,
                    "bDestroy": true,
                    "lengthMenu": [[5, 10, 25, -1], [5, 10, 25, "All"]],
                    columns: [
                        { data: 'Country' },
                        { data: 'StateName' },
                        { data: 'StateDesc' },
                        {
                            data: "Status",
                            render: function (data, type, row) {
                                if (data === "True") { return "Active" }
                                else return "InActive"
                            }
                        },
                        {
                            "data": "StateID",
                            "searchable": false,
                            "sortable": false,
                            "render": function (data, type, full, meta) {
                                return '<i class="fas fa-edit" id="editState" data-value ="' + data + '"></i>|<i class="fas fa-trash-alt" id="deleteState" data-value ="' + data + '" ></i>';
                            }
                        }
                    ]
                });
            }
        }

        var url = '/ProductAdmin/Master/GetStateList/';
        CommonUtility.RequestAjax('POST', url, "", BindStateSuccess, null, null, null);
    }
    //#endregion

    //#region Add New State
    $('body').on('click', "#btnSubmit", function () {
        var stateName = CommonUtility.ScriptInjection($("#txtStateName").val()).replace(/</g, "").replace(/>/g, "");
        var stateDesc = CommonUtility.ScriptInjection($("#txtStateDesc").val()).replace(/</g, "").replace(/>/g, "");
        var stateStatus = $("#ddlStateStatus").val();
        var country = $("#ddlCountry").val();
        var stateID = CommonUtility.ScriptInjection($("#hdnStateID").val()).replace(/</g, "").replace(/>/g, "");

        var statetatus = CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtStateName");
        var countryStatus = CommonValidation.MandetoryControlValueCheck("DROPDOWN", "ddlCountry");

        if (statetatus && countryStatus) {
            if (stateID != "")
                UpdateState(country, stateID, stateName, stateDesc, stateStatus)
            else
                AddState(country, stateName, stateDesc, stateStatus);
        }
    });

    function AddState(country,stateName, stateDesc, stateStatus) {

        var StateSuccess = function (result) {
            if (result != "" || result.length > 0) {
                Clear();
                BindStateList
                if (result === 1)
                    CommonUtility.SucessMessagePopUp("state saved successfully.");
                if (result === -1)
                    CommonUtility.SucessMessagePopUp("State already exists, could you try another name.");
            }
        }
        var data = {
            Country: country,
            StateName: stateName,
            StateDesc: stateDesc,
            Status: stateStatus
        };
        var url = '/ProductAdmin/Master/State/';
        CommonUtility.RequestAjax('POST', url, data, StateSuccess, null, null, null);
    }

    function UpdateState(country, stateID, stateName, stateDesc, stateStatus) {

        var StateSuccess = function (result) {
            if (result != "" || result.length > 0) {
                CommonUtility.SucessMessagePopUp("Designation updated successfully.");
                Clear();
                BindStateList();
            }
        }
        var data = {
            StateID: stateID,
            Country: country,
            StateName: stateName,
            StateDesc: stateDesc,
            Status: stateStatus
        };
        var url = '/ProductAdmin/Master/UpdateState/';
        CommonUtility.RequestAjax('POST', url, data, StateSuccess, null, null, null);
    }
    //#endregion

    //#region Validation
    $('#txtStateName').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtStateName");
    });
    $('#ddlCountry').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("DROPDOWN", "ddlCountry");
    });
    //#region Validation
    
    //#endregion

    //#region clear State controls
    $('body').on('click', "#btnClear", function () {
        Clear();
    });

    function Clear() {
        $("#txtStateName").val("");
        $("#txtStateDesc").val("");
        $("#ddlCountry").val("0");
        $("#hdnStateID").val("");
        $("#errtxtStateName").html("").hide();
        $("#errddlCountry").html("").hide();
    }
    //#endregion

    //#region delete Category
    $('body').on('click', "#deleteState", function () {
        var id = $(this).attr('data-value');
        CommonUtility.DeleteWarningMessagePopIp("Are you sure you want to delete State", id);
    });
    $('body').on('click', "#finaldelete", function () {
        var id = $(this).attr('data-myval')
        DeleteState(id);
    });
    function DeleteState(StateID) {
        var stateID = CommonUtility.ScriptInjection(StateID).replace(/</g, "").replace(/>/g, "");
        var StateSuccess = function (result) {
            if (result != "" || result.length > 0) {
                $("#modal-delete-danger").modal('hide');
                CommonUtility.SucessMessagePopUp("State Deleted successfully.");
                BindStateList();
                Clear();
            }
        }
        var data = {
            StateID: stateID
        };
        var url = '/ProductAdmin/Master/DeleteState/';
        CommonUtility.RequestAjax('POST', url, data, StateSuccess, null, null, null);
    }
    //#endregion

    //#region Edit Category
    $('body').on('click', "#editState", function () {
        var stateID = $(this).attr('data-value');
        var BindStateSuccess = function (result) {
            if (result != "" || result.length >= 0) {
                $("#ddlCountry").val(result.Country);
                $("#txtStateName").val(result.StateName);
                $("#txtStateDesc").val(result.StateDesc);
                $("#ddlDesignationStatus").val(result.Status);
                $("#hdnStateID").val(result.StateID);
            }
        }
        var data = {
            StateID: stateID
        };
        var url = '/ProductAdmin/Master/GetStateByID/';
        CommonUtility.RequestAjax('GET', url, data, BindStateSuccess, null, null, null);
    });
    //#endregion

    //#region Function return
    return {
        BindStateList: BindStateList,
        AddState: AddState,
        Clear: Clear,
        DeleteData: DeleteData,
        DeleteState: DeleteState
    }
    //#endregion

})();



