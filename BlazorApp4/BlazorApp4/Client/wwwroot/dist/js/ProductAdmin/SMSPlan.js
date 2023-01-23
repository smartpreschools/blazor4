var SMSPlan = (function () {

    //#region Ready Function Start Point
    $(document).ready(function () {
        BindDropdown("#ddlCategory", "Category", "", true);
        BindDropdown("#ddlValidity", "PlanValidity", "", true);
        BindDropdown("#ddlSMSType", "SMSType", "", true);
        BindSMSPlanList();
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
    function BindSMSPlanList() {
        var Success = function (result) {
            if (result != "" || result.length >= 0) {
                $('#websitePlanlist').DataTable({
                    data: result,
                    "bFilter": true,
                    "bLengthChange": true,
                    "bDestroy": true,
                    "lengthMenu": [[5, 10, 25, -1], [5, 10, 25, "All"]],
                    columns: [
                        { data: 'Category' },
                        { data: 'SMSType' },
                        { data: 'PlanName' },
                        { data: 'ActualCost' },
                        { data: 'OfferCost' },
                        { data: 'SMSQuantity' },
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
                                return '<i class="fas fa-edit" id="editWebsitePlan" data-value ="' + data + '"></i>|<i class="fas fa-trash-alt" id="deleteWebsitePlan" data-value ="' + data + '" ></i>';
                            }
                        }
                    ]
                });
            }
        }

        var url = '/ProductAdmin/Plans/GetSMSPlanList/';
        CommonUtility.RequestAjax('POST', url, "", Success, null, null, null);
    }
    //#endregion

    //#region Add New State
    $('body').on('click', "#btnSubmit", function () {
        var category = CommonUtility.ScriptInjection($("#ddlCategory").val()).replace(/</g, "").replace(/>/g, "");
        var validity = CommonUtility.ScriptInjection($("#ddlValidity").val()).replace(/</g, "").replace(/>/g, "");
        var smstype = CommonUtility.ScriptInjection($("#ddlSMSType").val()).replace(/</g, "").replace(/>/g, "");
        var planName = CommonUtility.ScriptInjection($("#txtPlanName").val()).replace(/</g, "").replace(/>/g, "");
        var offerCost = CommonUtility.ScriptInjection($("#txtOfferCost").val()).replace(/</g, "").replace(/>/g, "");
        var actualCost = CommonUtility.ScriptInjection($("#txtActualCost").val()).replace(/</g, "").replace(/>/g, "");
        var smsQuantity = CommonUtility.ScriptInjection($("#txtSMSQuantity").val()).replace(/</g, "").replace(/>/g, "");
        var planStatus = CommonUtility.ScriptInjection($("#ddlStatus").val()).replace(/</g, "").replace(/>/g, "");
        var desc = CommonUtility.ScriptInjection($("#txtPlanDesc").val()).replace(/</g, "").replace(/>/g, "");
        var planID = CommonUtility.ScriptInjection($("#hdnPlanID").val()).replace(/</g, "").replace(/>/g, "");

        var categoryStatus = CommonValidation.MandetoryControlValueCheck("DROPDOWN", "ddlCategory");
        var smsTypeStatus = CommonValidation.MandetoryControlValueCheck("DROPDOWN", "ddlSMSType");
        var validityStatus = CommonValidation.MandetoryControlValueCheck("DROPDOWN", "ddlValidity");
        var planNameStatus = CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtPlanName");
        var offerCostStatus = CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtOfferCost");
        var actualCostStatus = CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtActualCost");
        var smsQuantityStatus = CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtSMSQuantity");


        if (categoryStatus && smsTypeStatus && validityStatus && planNameStatus && offerCostStatus && actualCostStatus && smsQuantityStatus) {
            if (planID != "")
                UpdatePlan(planID, category, validity, planName, offerCost, actualCost, planStatus, desc, smstype, smsQuantity)
            else
                AddPlan(category, validity, planName, offerCost, actualCost, planStatus, desc, smstype, smsQuantity);
        }
    });

    function AddPlan(category, validity, planName, offerCost, actualCost, planStatus, desc, smstype, smsQuantity) {

        var Success = function (result) {
            if (result != "" || result.length > 0) {
                Clear();
                BindSMSPlanList();
                if (result === 1)
                    CommonUtility.SucessMessagePopUp("Plan saved successfully.");
                if (result === -1)
                    CommonUtility.SucessMessagePopUp("Plan already exists, could you try another name.");
            }
        }
        var data = {
            Category: category,
            Validity: validity,
            PlanName: planName,
            OfferCost: offerCost,
            ActualCost: actualCost,
            Status: planStatus,
            PlanDesc: desc,
            SMSType: smstype, 
            SMSQuantity : smsQuantity
        };
        var url = '/ProductAdmin/Plans/AddSMSPlan/';
        CommonUtility.RequestAjax('POST', url, data, Success, null, null, null);
    }

    function UpdatePlan(planID, category, validity, planName, offerCost, actualCost, planStatus, desc,smstype, smsQuantity) {

        var Success = function (result) {
            if (result != "" || result.length > 0) {
                CommonUtility.SucessMessagePopUp("Website Plan updated successfully.");
                Clear();
                BindSMSPlanList();
            }
        }
        var data = {
            PlanID: planID,
            Category: category,
            Validity: validity,
            PlanName: planName,
            OfferCost: offerCost,
            ActualCost: actualCost,
            Status: planStatus,
            PlanDesc: desc,
            SMSType: smstype,
            SMSQuantity: smsQuantity
        };
        var url = '/ProductAdmin/Plans/UpdateSMSPlan/';
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
    $('#ddlSMSType').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("DROPDOWN", "ddlSMSType");
    });
    $('#txtPlanName').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtPlanName");
    });
    $('#txtOfferCost').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtOfferCost")
    });
    $('#txtActualCost').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtActualCost");
    });
    $('#txtSMSQuantity').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtSMSQuantity");
    });
    //#region Validation


    //#endregion

    //#region clear State controls
    $('body').on('click', "#btnClear", function () {
        Clear();
    });

    function Clear() {
        $("#txtPlanName").val("");
        $("#txtActualCost").val("");
        $("#txtOfferCost").val("");
        $("#txtSMSQuantity").val("");
        $("#ddlCategory").val("0");
        $("#ddlValidity").val("0");
        $("#ddlSMSType").val("0");
        $("#hdnPlanID").val("");
        $("#txtPlanDesc").val("");

        $("#errtxtPlanName").html("").hide();
        $("#errddlCategory").html("").hide();
        $("#errddlValidity").html("").hide();
        $("#errddlSMSType").html("").hide();
        $("#errtxtOfferCost").html("").hide();
        $("#errtxtActualCost").html("").hide();
        $("#errtxtSMSQuantity").html("").hide();
    }
    //#endregion

    //#region delete Category
    $('body').on('click', "#deleteWebsitePlan", function () {
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
                BindSMSPlanList();
                Clear();
            }
        }
        var data = {
            PlanID: planID
        };
        var url = '/ProductAdmin/Plans/DeleteSMSPlan/';
        CommonUtility.RequestAjax('POST', url, data, Success, null, null, null);
    }
    //#endregion

    //#region Edit Category
    $('body').on('click', "#editWebsitePlan", function () {
        var planID = $(this).attr('data-value');
        var Sucess = function (result) {
            if (result != "" || result.length >= 0) {
                $("#ddlCategory").val(result.Category);
                $("#ddlValidity").val(result.Validity);
                $("#ddlSMSType").val(result.SMSType);
                $("#txtPlanName").val(result.PlanName);
                $("#txtOfferCost").val(result.OfferCost);
                $("#txtActualCost").val(result.ActualCost);
                $("#txtSMSQuantity").val(result.SMSQuantity);
                $("#txtPlanDesc").val(result.PlanDesc);
                $("#ddlPlanStatus").val(result.Status);
                $("#hdnPlanID").val(result.PlanID);
            }
        }
        var data = {
            PlanID: planID
        };
        var url = '/ProductAdmin/Plans/GetSMSPlanByID/';
        CommonUtility.RequestAjax('GET', url, data, Sucess, null, null, null);
    });
    //#endregion

    //#region Function return
    return {
        BindSMSPlanList: BindSMSPlanList,
        AddPlan: AddPlan,
        Clear: Clear,
        DeleteData: DeleteData,
        DeletePlan: DeletePlan
    }
    //#endregion

})();



