var PoliticalHistory = (function () {

    //#region Ready Function Start Point
    $(document).ready(function () {
        BindDropdown("#ddlParty", "PoliticalParty", "", true);
        BindDropdown("#ddlDesignation", "Designation", "", true);
        BindPoliticalHistoryList();
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
    function BindPoliticalHistoryList() {
        var ValiditySuccess = function (result) {
            if (result != "" || result.length >= 0) {
                $('#politicalHistorylist').DataTable({
                    data: result,
                    "bFilter": true,
                    "bLengthChange": true,
                    "bDestroy": true,
                    "lengthMenu": [[5, 10, 25, -1], [5, 10, 25, "All"]],
                    columns: [
                        { data: 'Party' },
                        {
                            data: 'StartDate'
                        },
                        {
                            data: 'EndDate'
                            
                        },
                        { data: 'Designation' },

                        {
                            "data": "ID",
                            "searchable": false,
                            "sortable": false,
                            "render": function (data, type, full, meta) {
                                return '<i class="fas fa-edit" id="editPoliticalHistory" data-value ="' + data + '"></i>|<i class="fas fa-trash-alt" id="deletePoliticalHistory" data-value ="' + data + '" ></i>';
                            }
                        }
                    ]
                });
            }
        }

        var url = '/PudhariAdmin/Personal/GetPoliticalHistoryList/';
        CommonUtility.RequestAjax('POST', url, "", ValiditySuccess, null, null, null);
    }
    //#endregion

    //#region Add New Category
    $('body').on('click', "#btnSubmit", function () {
        var party = CommonUtility.ScriptInjection($("#ddlParty").val()).replace(/</g, "").replace(/>/g, "");
        var startDate = CommonUtility.ScriptInjection($("#txtStartDate").val()).replace(/</g, "").replace(/>/g, "");
        var endDate = CommonUtility.ScriptInjection($("#txtEndDate").val()).replace(/</g, "").replace(/>/g, "");
        var designation = CommonUtility.ScriptInjection($("#ddlDesignation").val()).replace(/</g, "").replace(/>/g, "");
        var responsibility = CommonUtility.ScriptInjection($("#txtResponsibility").val()).replace(/</g, "").replace(/>/g, "");
        var desc = CommonUtility.ScriptInjection($("#txtDesc").val()).replace(/</g, "").replace(/>/g, "");
        var historyID = CommonUtility.ScriptInjection($("#hdnHistoryID").val()).replace(/</g, "").replace(/>/g, "");

        var partyStatus = CommonValidation.MandetoryControlValueCheck("DROPDOWN", "ddlParty");
        var startDateStatus = CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtStartDate");
        var endDateStatus = CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtEndDate");
        var designationStatus = CommonValidation.MandetoryControlValueCheck("DROPDOWN", "ddlDesignation");
      


        if (partyStatus && startDateStatus && endDateStatus && designationStatus) {
            if (historyID != "")
                UpdatePersonalInfo(party, startDate, endDate, designation, responsibility, desc, historyID)
            else
                AddPersonalInfo(party, startDate, endDate, designation, responsibility, desc);
        }
    });

    function AddPersonalInfo(party, startDate, endDate, designation, responsibility, desc) {
        var ValiditySuccess = function (result) {
            if (result != "" || result.length > 0) {
                Clear();
                BindPoliticalHistoryList();
                if (result === 1)
                    CommonUtility.SucessMessagePopUp("Political history saved successfully.");
                if (result === -1)
                    CommonUtility.SucessMessagePopUp("Political history exists, could you try another name.");
            }
        }
        var data = {
            Party: party,
            StartDate: startDate,
            EndDate: endDate,
            Responsibility: responsibility,
            Designation: designation,
            Description: desc,
        };
        var url = '/PudhariAdmin/Personal/AddPoliticalHistory/';
        CommonUtility.RequestAjax('POST', url, data, ValiditySuccess, null, null, null);
    }

    function UpdatePersonalInfo(party, startDate, endDate, designation, responsibility, desc, historyID) {
        var Success = function (result) {
            if (result != "" || result.length > 0) {
                Clear();
                CommonUtility.SucessMessagePopUp("Political history updated successfully.");
                BindPoliticalHistoryList();
            }
        }
        var data = {
            ID: historyID,
            Party: party,
            StartDate: startDate,
            EndDate: endDate,
            Responsibility: responsibility,
            Designation: designation,
            Description: desc,
        };
        var url = '/PudhariAdmin/Personal/UpdatePoliticalHistory/';
        CommonUtility.RequestAjax('POST', url, data, Success, null, null, null);
    }
    //#endregion

    //#region Validation
    $('#ddlParty').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("DROPDOWN", "ddlParty");
    });
    $('#txtStartDate').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtStartDate");
    });
    $('#txtEndDate').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtEndDate");
    });
    $('#ddlDesignation').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("DROPDOWN", "ddlDesignation");
    });

    //#endregion

    //#region clear PoliticalParty controls
    $('body').on('click', "#btnClear", function () {
        Clear();
    });

    function Clear() {
        $("#ddlParty").val("0");
        $("#txtStartDate").val("");
        $("#txtEndDate").val("");
        $("#ddlDesignation").val("0");
        $("#txtResponsibility").val("");
        $("#txtDesc").val("");
        
        $("#hdnHistoryID").val("");


        $("#errddlParty").html("").hide();
        $("#errtxtMiddleName").html("").hide();
        $("#errtxtStartDate").html("").hide();
        $("#errtxtEndDate").html("").hide();
        $("#errddlDesignation").html("").hide();
    }
    //#endregion

    //#region delete Category
    $('body').on('click', "#deletePoliticalHistory", function () {
        var id = $(this).attr('data-value');
        CommonUtility.DeleteWarningMessagePopIp("Are you sure you want to delete political history", id);
    });
    $('body').on('click', "#finaldelete", function () {
        var id = $(this).attr('data-myval')
        DeletePoliticalHistory(id);
    });
    function DeletePoliticalHistory(HistoryID) {
        var historyID = CommonUtility.ScriptInjection(HistoryID).replace(/</g, "").replace(/>/g, "");
        var Success = function (result) {
            if (result != "" || result.length > 0) {
                $("#modal-delete-danger").modal('hide');
                CommonUtility.SucessMessagePopUp("Political history deleted successfully.");
                BindPoliticalHistoryList();
                Clear();
            }
        }
        var data = {
            HistoryID: historyID
        };
        var url = '/PudhariAdmin/Personal/DeletePoliticalHistory/';
        CommonUtility.RequestAjax('POST', url, data, Success, null, null, null);
    }
    //#endregion

    //#region Edit Category
    $('body').on('click', "#editPoliticalHistory", function () {
        var historyID = $(this).attr('data-value');
        var BindSuccess = function (result) {
            if (result != "" || result.length >= 0) {
                $("#ddlParty").val(result.Party);
                if (result.StartDate != "" || result.StartDate != null) {
                    $("#txtStartDate").val(result.StartDate);
                }
                if (result.EndDate != "" || result.EndDate != null) {
                    $("#txtEndDate").val(result.EndDate);
                }
                $("#ddlDesignation").val(result.Designation);
                $("#txtResponsibility").val(result.Responsibility);
                $("#txtDesc").val(result.Description);
                $("#hdnHistoryID").val(result.ID);
            }
        }
        var data = {
            HistoryID: historyID
        };
        var url = '/PudhariAdmin/Personal/GetPoliticalHistoryByID/';
        CommonUtility.RequestAjax('GET', url, data, BindSuccess, null, null, null);
    });
    //#endregion

    //#region Function return
    return {
        BindPoliticalHistoryList: BindPoliticalHistoryList,
        AddPoliticalHistory: AddPoliticalHistory,
        Clear: Clear,
        DeletePoliticalHistory: DeletePoliticalHistory
    }
    //#endregion

})();



