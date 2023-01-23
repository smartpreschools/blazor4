var CompetitionDetail = (function () {
    //#region Ready Function Start Point
    $(document).ready(function () {
        BindDropdown("#ddlCompetitionCategory", "CompetitionCategory", "CompetitionCategory", true);
        BindCompetitionList();
    });
    //#endregion
    var optionSelect = "<option value='0' selected>Select value.. </option";
    //#region Bind DropDown  List
    function BindDropdown(contrlID, DrpName, inputValue, isAsync) {
        var BindDropDownData = function (result) {
            if (result != "" || result.length > 0) {
                $(contrlID + " option").remove();
                $.map(result, function (opt) {
                    var option = $('<option>' + opt.CategoryName + '</option>');
                    option.attr('value', opt.CategoryId);
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
        var url = '/PudhariAdmin/Competition/GetActiveCategoryList/';
        if (isAsync)
            CommonUtility.RequestAjax('GET', url, data, BindDropDownData, null, null, null);
        else
            CommonUtility.RequestAjaxAsync('GET', url, data, BindDropDownData, null, null, null);

    }
    //#endregion
    //#region Bind Competition List
    function BindCompetitionList() {
        var BindCompetitionSuccess = function (result) {
            if (result != "" || result.length >= 0) {
                $('#competitionlist').DataTable({
                    data: result,
                    "bFilter": true,
                    "bLengthChange": true,
                    "bDestroy": true,
                    "lengthMenu": [[5, 10, 25, -1], [5, 10, 25, "All"]],
                    columns: [
                        { data: 'Category' },
                        { data: 'Name' },
                        { data: 'Location' },
                        { data: 'ContactName' },
                        { data: 'Mobile' },
                        {
                            data: "Status",
                            render: function (data, type, row) {
                                if (data === "True") { return "Active" }
                                else return "InActive"
                            }
                        },
                        {
                            "data": "Id",
                            "searchable": false,
                            "sortable": false,
                            "render": function (data, type, full, meta) {
                                return '<i class="fas fa-edit" id="editCompetition" data-value ="' + data + '"></i>|<i class="fas fa-trash-alt" id="deleteCompetition" data-value ="' + data + '" ></i>';
                            }
                        }
                    ]
                });
            }
        }

        var url = '/PudhariAdmin/Competition/GetCompetitionDetailList/';
        CommonUtility.RequestAjax('POST', url, "", BindCompetitionSuccess, null, null, null);
    }
    //#endregion

    //#region Add New Competition
    $('body').on('click', "#btnSubmit", function () {
        var category = CommonUtility.ScriptInjection($("#ddlCompetitionCategory").val()).replace(/</g, "").replace(/>/g, "");
        var name = CommonUtility.ScriptInjection($("#txtCompetitionName").val()).replace(/</g, "").replace(/>/g, "");
        var startDate = CommonUtility.ScriptInjection($("#txtStartDate").val()).replace(/</g, "").replace(/>/g, "");
        var endDate = CommonUtility.ScriptInjection($("#txtEndDate").val()).replace(/</g, "").replace(/>/g, "");
        var contactName = CommonUtility.ScriptInjection($("#txtContactName").val()).replace(/</g, "").replace(/>/g, "");
        var contactMobile = CommonUtility.ScriptInjection($("#txtContactMobile").val()).replace(/</g, "").replace(/>/g, "");
        var location = CommonUtility.ScriptInjection($("#txtlocation").val()).replace(/</g, "").replace(/>/g, "");
        var entryFee = CommonUtility.ScriptInjection($("#txtEntryFee").val()).replace(/</g, "").replace(/>/g, "");
        var awardAmount = CommonUtility.ScriptInjection($("#txtAwardAmount").val()).replace(/</g, "").replace(/>/g, "");
        var resultDate = CommonUtility.ScriptInjection($("#txtResultDate").val()).replace(/</g, "").replace(/>/g, "");
        var desc = $("#txtDesc").summernote('code');
        var criteria = $("#txtCriteria").summernote('code');
        var status = CommonUtility.ScriptInjection($("#ddlStatus").val()).replace(/</g, "").replace(/>/g, "");
        var competitionId = CommonUtility.ScriptInjection($("#hdnCompetitionDetailId").val()).replace(/</g, "").replace(/>/g, "");

        var categoryStatus = CommonValidation.MandetoryControlValueCheck("DROPDOWN", "ddlCompetitionCategory");
        var nameStatus = CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtCompetitionName");
        var criteriaStatus = CommonValidation.MandetoryControlValueCheck("TEXTAREA", "txtCriteria");
        var descStatus = CommonValidation.MandetoryControlValueCheck("TEXTAREA", "txtDesc");
        var contactNameStatus = CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtContactName");
        var contactMobileStatus = CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtContactMobile");


        if (categoryStatus && nameStatus && criteriaStatus && descStatus && contactNameStatus && contactMobileStatus ) {
            if (competitionId != "")
                UpdateCompetition(category, name, startDate, endDate, contactName, contactMobile, location, entryFee, awardAmount, resultDate, desc, criteria, status, competitionId);
            else
                AddCompetition(category, name, startDate, endDate, contactName, contactMobile, location, entryFee, awardAmount, resultDate, desc, criteria, status);
        }
    });

    function AddCompetition(category, name, startDate, endDate, contactName, contactMobile, location, entryFee, awardAmount, resultDate, desc, criteria, status) {
        var CompetitionSuccess = function (result) {
            if (result != "" || result.length > 0) {
                if (result === 1)
                    CommonUtility.SucessMessagePopUp("Competition saved successfully.");
                if (result === -1)
                    CommonUtility.SucessMessagePopUp("Competition already exists, could you try another name.");
                BindCompetitionList();
                Clear();
            }
        }
        var data = {
            Category: category,
            Name: name,
            StartDate: startDate,
            EndDate: endDate,
            ContactName: contactName,
            Mobile: contactMobile,
            Location: location,
            EntryFee: entryFee,
            AwardAmount: awardAmount,
            ResultDate: resultDate,
            Desc: desc,
            Criteria: criteria,
            Status: status
        };
        var url = '/PudhariAdmin/Competition/CompetitionDetail/';
        CommonUtility.RequestAjax('POST', url, data, CompetitionSuccess, null, null, null);
    }
    function UpdateCompetition(category, name, startDate, endDate, contactName, contactMobile, location, entryFee, awardAmount, resultDate, desc, criteria, status, competitionId) {

        var CompetitionSuccess = function (result) {
            if (result != "" || result.length > 0) {
                Clear();
                CommonUtility.SucessMessagePopUp("Competition updated successfully.");
                BindCompetitionList();
            }
        }
        var data = {
            Id: competitionId,
            Category: category,
            Name: name,
            StartDate: startDate,
            EndDate: endDate,
            ContactName: contactName,
            Mobile: contactMobile,
            Location: location,
            EntryFee: entryFee,
            AwardAmount: awardAmount,
            ResultDate: resultDate,
            Desc: desc,
            Criteria: criteria,
            Status: status
        };
        var url = '/PudhariAdmin/Competition/UpdateCompetitionDetail/';
        CommonUtility.RequestAjax('POST', url, data, CompetitionSuccess, null, null, null);
    }
    //#endregion

    //#region Validation
    $('#txtCompetitionName').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtCompetitionName");
    });
    $('#ddlCompetitionCategory').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("DROPDOWN", "ddlCompetitionCategory");
    });
    $('#txtcriteria').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtcriteria");
    });
    $('#txtdesc').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtdesc");
    });
    $('#txtContactName').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtContactName");
    });
    $('#txtContactMobile').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtContactMobile");
    });
    //#endregion

    //#region clear competition controls
    $('body').on('click', "#btnClear", function () {
        Clear();
    });

    function Clear() {
        $("#txtCompetitionName").val("");
        $("#hdnCompetitionId").val("");
        $("#ddlCompetitionCategory").val(0);
        $("#txtDesc").summernote("reset");
        $("#txtCriteria").summernote("reset");
        $("#ddlStatus").val("True");
        $("#txtStartDate").val("");
        $("#txtEndDate").val("");
        $("#txtContactName").val("");
        $("#txtContactMobile").val("");
        $("#txtlocation").val("");
        $("#txtEntryFee").val("");
        $("#txtAwardAmount").val("");
        $("#txtResultDate").val("");

        $("#errddlCompetitionCategory").html("").hide();
        $("#errtxtCompetitionName").html("").hide();
        $("#errtxtcriteria").html("").hide();
        $("#errtxtdesc").html("").hide();
        $("#errtxtContactName").html("").hide();
        $("#errtxtContactMobile").html("").hide();
    }
    //#endregion

    //#region delete Competition
    $('body').on('click', "#deleteCompetition", function () {
        var id = $(this).attr('data-value');
        CommonUtility.DeleteWarningMessagePopIp("Are you sure you want to delete competition", id);
    });
    $('body').on('click', "#finaldelete", function () {
        var id = $(this).attr('data-myval')
        DeleteCompetition(id);
    });
    function DeleteCompetition(competitionId) {
        var competitionId = CommonUtility.ScriptInjection(competitionId).replace(/</g, "").replace(/>/g, "");
        var CompetitionSuccess = function (result) {
            if (result != "" || result.length > 0) {
                $("#modal-delete-danger").modal('hide');
                CommonUtility.SucessMessagePopUp("Competition deleted successfully.");
                BindCompetitionList();
                Clear();
            }
        }
        var data = {
            id: competitionId
        };
        var url = '/PudhariAdmin/Competition/DeleteCompetitionDetail/';
        CommonUtility.RequestAjax('POST', url, data, CompetitionSuccess, null, null, null);
    }
    //#endregion

    //#region Edit Competition
    $('body').on('click', "#editCompetition", function () {
        var competitionId = $(this).attr('data-value');
        var BindCompetitionSuccess = function (result) {
            if (result != "" || result.length >= 0) {
                $("#ddlCompetitionCategory").val(result.Category);
                $("#txtCompetitionName").val(result.Name);
                $("#txtDesc").summernote('code', result.Desc);
                $("#txtCriteria").summernote('code', result.Criteria);
                $("#ddlStatus").val(result.Status);
                $("#txtStartDate").val(result.StartDate);
                $("#txtEndDate").val(result.EndDate);
                $("#txtContactName").val(result.ContactName);
                $("#txtContactMobile").val(result.Mobile);
                $("#txtlocation").val(result.Location);
                $("#txtEntryFee").val(result.EntryFee);
                $("#txtAwardAmount").val(result.AwardAmount);
                $("#txtResultDate").val(result.ResultDate);
                $("#hdnCompetitionDetailId").val(result.Id);
            }
        }
        var data = {
            id: competitionId
        };
        var url = '/PudhariAdmin/Competition/GetCompetitionDetailById/';
        CommonUtility.RequestAjax('GET', url, data, BindCompetitionSuccess, null, null, null);
    });
    //#endregion
    //#region Function return
    return {
        BindCompetitionList: BindCompetitionList,
        AddCompetition: AddCompetition,
        Clear: Clear,
        DeleteData: DeleteData,
        DeleteCompetition: DeleteCompetition
    }
    //#endregion

})();



