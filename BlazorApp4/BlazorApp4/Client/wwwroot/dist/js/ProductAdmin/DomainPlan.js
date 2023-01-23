var DomainPlan = (function () {

    //#region Ready Function Start Point
    $(document).ready(function () {
        BindDropdown("#ddlCategory", "Category", "", true);
        BindDropdown("#ddlValidity", "PlanValidity", "", true);
        BindDropdown("#ddlFreeEmailCount", "FreeEmail", "", true);
        BindDomainPlanList();
    });
    //#endregion
    var optionSelect = "<option value='0' selected>Select value.. </option";
    //#region Bind Country List
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
        var url = '/ProductAdmin/Master/GetDropDownData/';
        if (isAsync)
            CommonUtility.RequestAjax('GET', url, data, BindDropDownData, null, null, null);
        else
            CommonUtility.RequestAjaxAsync('GET', url, data, BindDropDownData, null, null, null);

    }
    //#endregion
    //#region Bind State List
    function BindDomainPlanList() {
        var Success = function (result) {
            if (result != "" || result.length >= 0) {
                $('#domainPlanlist').DataTable({
                    data: result,
                    "bFilter": true,
                    "bLengthChange": true,
                    "bDestroy": true,
                    "lengthMenu": [[5, 10, 25, -1], [5, 10, 25, "All"]],
                    columns: [
                        { data: 'Category' },
                        { data: 'DomainName' },
                        { data: 'ActualCost' },
                        { data: 'OfferCost' },
                        { data: 'Validity' },
                        {
                            data: "Status",
                            render: function (data, type, row) {
                                if (data === "True") { return "Active" }
                                else return "InActive"
                            }
                        },
                        {
                            "data": "PlanID",
                            "searchable": false,
                            "sortable": false,
                            "render": function (data, type, full, meta) {
                                return '<i class="fas fa-edit" id="editDomainPlan" data-value ="' + data + '"></i>|<i class="fas fa-trash-alt" id="deleteDomainPlan" data-value ="' + data + '" ></i>';
                            }
                        }
                    ]
                });
            }
        }

        var url = '/ProductAdmin/Plans/GetDomainPlanList/';
        CommonUtility.RequestAjax('POST', url, "", Success, null, null, null);
    }
    //#endregion

    //#region Add New State
    $('body').on('click', "#btnSubmit", function () {
        var category = CommonUtility.ScriptInjection($("#ddlCategory").val()).replace(/</g, "").replace(/>/g, "");
        var validity = CommonUtility.ScriptInjection($("#ddlValidity").val()).replace(/</g, "").replace(/>/g, "");
        var freeEmailCount = CommonUtility.ScriptInjection($("#ddlFreeEmailCount").val()).replace(/</g, "").replace(/>/g, "");
        var domainName = CommonUtility.ScriptInjection($("#txtDomainName").val()).replace(/</g, "").replace(/>/g, "");
        var offerCost = CommonUtility.ScriptInjection($("#txtOfferCost").val()).replace(/</g, "").replace(/>/g, "");
        var actualCost = CommonUtility.ScriptInjection($("#txtActualCost").val()).replace(/</g, "").replace(/>/g, "");
        var planStatus = CommonUtility.ScriptInjection($("#ddlStatus").val()).replace(/</g, "").replace(/>/g, "");
        var desc = CommonUtility.ScriptInjection($("#txtPlanDesc").val()).replace(/</g, "").replace(/>/g, "");
        var planID = CommonUtility.ScriptInjection($("#hdnPlanID").val()).replace(/</g, "").replace(/>/g, "");

        var categoryStatus = CommonValidation.MandetoryControlValueCheck("DROPDOWN", "ddlCategory");
        var validityStatus = CommonValidation.MandetoryControlValueCheck("DROPDOWN", "ddlValidity");
        var freeEmailStatus = CommonValidation.MandetoryControlValueCheck("DROPDOWN", "ddlFreeEmailCount");
        var domainNameStatus = CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtDomainName");
        var offerCostStatus = CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtOfferCost");
        var actualCostStatus = CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtActualCost");


        if (categoryStatus && validityStatus && domainNameStatus && offerCostStatus && actualCostStatus && freeEmailStatus) {
            if (planID != "")
                UpdatePlan(planID, category, validity, domainName, offerCost, actualCost, planStatus, desc, freeEmailCount)
            else
                AddPlan(category, validity, domainName, offerCost, actualCost, planStatus, desc, freeEmailCount);
        }
    });

    function AddPlan(category, validity, domainName, offerCost, actualCost, planStatus, desc, freeEmailCount) {

        var Success = function (result) {
            if (result != "" || result.length > 0) {
                Clear();
                BindDomainPlanList();
                if (result === 1)
                    CommonUtility.SucessMessagePopUp("Plan saved successfully.");
                if (result === -1)
                    CommonUtility.SucessMessagePopUp("Plan already exists, could you try another name.");
            }
        }
        var data = {
            Category: category,
            Validity: validity,
            FreeEmail: freeEmailCount,
            DomainName: domainName,
            OfferCost: offerCost,
            ActualCost: actualCost,
            Status: planStatus,
            PlanDesc: desc
        };
        var url = '/ProductAdmin/Plans/AddDomainPlan/';
        CommonUtility.RequestAjax('POST', url, data, Success, null, null, null);
    }

    function UpdatePlan(planID, category, validity, domainName, offerCost, actualCost, planStatus, desc, freeEmailCount) {

        var Success = function (result) {
            if (result != "" || result.length > 0) {
                CommonUtility.SucessMessagePopUp("Website Plan updated successfully.");
                Clear();
                BindWebsitePlanList();
            }
        }
        var data = {
            PlanID: planID,
            Category: category,
            Validity: validity,
            FreeEmail: freeEmailCount,
            DomainName: domainName,
            OfferCost: offerCost,
            ActualCost: actualCost,
            Status: planStatus,
            PlanDesc: desc
        };
        var url = '/ProductAdmin/Plans/UpdateDomainPlan/';
        CommonUtility.RequestAjax('POST', url, data, Success, null, null, null);
    }
    //#endregion

    //#region Validation
    $('#ddlCategory').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("DROPDOWN", "ddlCategory")
    });
    $('#ddlValidity').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("DROPDOWN", "ddlValidity");
    });
    $('#ddlFreeEmailCount').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("DROPDOWN", "ddlFreeEmailCount");
    });
    $('#txtDomainName').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtDomainName");
    });
    $('#txtOfferCost').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtOfferCost")
    });
    $('#txtActualCost').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtActualCost");
    });
    //#region Validation


    //#endregion

    //#region clear State controls
    $('body').on('click', "#btnClear", function () {
        Clear();
    });

    function Clear() {
        $("#txtDomainName").val("");
        $("#txtActualCost").val("");
        $("#txtOfferCost").val("");
        $("#ddlCategory").val("0");
        $("#ddlValidity").val("0");
        $("#ddlFreeEmailCount").val("0");
        $("#hdnPlanID").val("");
        $("#txtPlanDesc").val("");

        $("#errtxtDomainName").html("").hide();
        $("#errddlCategory").html("").hide();
        $("#errddlValidity").html("").hide();
        $("#errddlFreeEmailCount").html("").hide();
        $("#errtxtOfferCost").html("").hide();
        $("#errtxtActualCost").html("").hide();
    }
    //#endregion

    //#region delete Category
    $('body').on('click', "#deleteDomainPlan", function () {
        var id = $(this).attr('data-value');
        CommonUtility.DeleteWarningMessagePopIp("Are you sure you want to delete Plan", id);
    });
    $('body').on('click', "#finaldelete", function () {
        var id = $(this).attr('data-myval')
        DeletePlan(id);
    });
    function DeletePlan(PlanID) {
        var planID = CommonUtility.ScriptInjection(PlanID).replace(/</g, "").replace(/>/g, "");
        var Success = function (result) {
            if (result != "" || result.length > 0) {
                $("#modal-delete-danger").modal('hide');
                CommonUtility.SucessMessagePopUp("Plan Deleted successfully.");
                BindDomainPlanList();
                Clear();
            }
        }
        var data = {
            PlanID: planID
        };
        var url = '/ProductAdmin/Plans/DeleteDomainPlan/';
        CommonUtility.RequestAjax('POST', url, data, Success, null, null, null);
    }
    //#endregion

    //#region Edit Category
    $('body').on('click', "#editDomainPlan", function () {
        var planID = $(this).attr('data-value');
        var Sucess = function (result) {
            if (result != "" || result.length >= 0) {
                $("#ddlCategory").val(result.Category);
                $("#ddlValidity").val(result.Validity);
                $("#ddlFreeEmailCount").val(result.FreeEmail);
                $("#txtDomainName").val(result.DomainName);
                $("#txtOfferCost").val(result.OfferCost);
                $("#txtActualCost").val(result.ActualCost);
                $("#txtPlanDesc").val(result.PlanDesc);
                $("#ddlPlanStatus").val(result.Status);
                $("#hdnPlanID").val(result.PlanID);
            }
        }
        var data = {
            PlanID: planID
        };
        var url = '/ProductAdmin/Plans/GetDomainPlanByID/';
        CommonUtility.RequestAjax('GET', url, data, Sucess, null, null, null);
    });
    //#endregion

    //#region Function return
    return {
        BindDomainPlanList: BindDomainPlanList,
        AddPlan: AddPlan,
        Clear: Clear,
        DeleteData: DeleteData,
        DeletePlan: DeletePlan
    }
    //#endregion

})();



