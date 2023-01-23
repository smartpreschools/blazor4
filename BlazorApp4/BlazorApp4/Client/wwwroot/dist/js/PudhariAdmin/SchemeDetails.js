var SchemeDeatail = (function () {
    //#region Ready Function Start Point
    $(document).ready(function () {
        BindDropdown("#ddlSchemeCategory", "SchemeCategory", "", true);
        BindSchemeList();
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
                    option.attr('value', opt.CategoryID);
                    $(contrlID).append(option);
                });
                $(contrlID + " option").remove("0");
                $(contrlID).prepend(optionSelect);
            }
        }
        var data = {
            
        };
        var url = '/PudhariAdmin/Scheme/GetActiveCategoryList/';
        if (isAsync)
            CommonUtility.RequestAjax('GET', url, data, BindDropDownData, null, null, null);
        else
            CommonUtility.RequestAjaxAsync('GET', url, data, BindDropDownData, null, null, null);

    }
    //#region Bind Category List
    function BindSchemeList() {
        var Success = function (result) {
            if (result != "" || result.length >= 0) {
                $('#schemelist').DataTable({
                    data: result,
                    "bFilter": true,
                    "bLengthChange": true,
                    "bDestroy": true,
                    "lengthMenu": [[5, 10, 25, -1], [5, 10, 25, "All"]],
                    columns: [
                        { data: 'CategoryName' },
                        { data: 'SchemeName' },
                        {
                            data: "Status",
                            render: function (data, type, row) {
                                if (data === "True") { return "Active" }
                                else return "InActive"
                            }
                        },

                        {
                            "data": "SchemeId",
                            "searchable": false,
                            "sortable": false,
                            "render": function (data, type, full, meta) {
                                return '<i class="fas fa-edit" id="editScheme" data-value ="' + data + '"></i>|<i class="fas fa-trash-alt" id="deleteScheme" data-value ="' + data + '" ></i>';
                            }
                        }
                    ]
                });
            }
        }

        var url = '/PudhariAdmin/Scheme/GetSchemeDetailsList/';
        CommonUtility.RequestAjax('GET', url, "", Success, null, null, null);
    }
    //#endregion

    //#region Add New Category
    $('body').on('click', "#btnSubmit", function () {
        var schemeCategory = CommonUtility.ScriptInjection($("#ddlSchemeCategory").val()).replace(/</g, "").replace(/>/g, "");
        var schemeName = CommonUtility.ScriptInjection($("#txtSchemeName").val()).replace(/</g, "").replace(/>/g, "");
        var schemeCriteria = $("#txtSchemeCriteria").summernote('code'); 
        var schemeDetails = $("#txtSchemeDetails").summernote('code'); 
        var status = CommonUtility.ScriptInjection($("#ddlStatus").val()).replace(/</g, "").replace(/>/g, "");
        var schemeId = CommonUtility.ScriptInjection($("#hdnSchemeId").val()).replace(/</g, "").replace(/>/g, "");

        var schemeCategoryStatus = CommonValidation.MandetoryControlValueCheck("DROPDOWN", "ddlSchemeCategory");
        var schemeNameStatus = CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtSchemeName");
        var schemeCriteriaStatus = CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtSchemeCriteria");
        var schemeDetailsStatus = CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtSchemeDetails");

        if (schemeCategoryStatus && schemeNameStatus && schemeCriteriaStatus && schemeDetailsStatus) {
            if (schemeId != "")
                UpdateScheme(schemeCategory, schemeName, schemeCriteria, schemeDetails, status, schemeId)
            else
                AddScheme(schemeCategory, schemeName, schemeCriteria, schemeDetails,  status);
        }
    });

    function AddScheme(schemeCategory, schemeName, schemeCriteria, schemeDetails, status) {
        var Success = function (result) {
            if (result != "" || result.length > 0) {
                Clear();
                BindSchemeList();
                if (result === 1)
                    CommonUtility.SucessMessagePopUp("Scheme saved successfully.");
                if (result === -1)
                    CommonUtility.SucessMessagePopUp("Scheme exists, could you try another name.");
            }
        }
        var data = {
            CategoryName: schemeCategory,
            SchemeName: schemeName,
            SchemeCriteria: schemeCriteria,
            SchemeDetails: schemeDetails,
            Status: status
        };
        var url = '/PudhariAdmin/Scheme/SchemeDetails/';
        CommonUtility.RequestAjax('POST', url, data, Success, null, null, null);
    }

    function UpdateScheme(schemeCategory, schemeName, schemeCriteria, schemeDetails, status, schemeId) {
        var Success = function (result) {
            if (result != "" || result.length > 0) {
                Clear();
                CommonUtility.SucessMessagePopUp("Photo updated successfully.");
                BindSchemeList();
            }
        }
        var data = {
            SchemeId: schemeId,
            CategoryName: schemeCategory,
            SchemeName: schemeName,
            SchemeCriteria: schemeCriteria,
            SchemeDetails: schemeDetails,
            Status: status
        };
        var url = '/PudhariAdmin/Scheme/UpdateSchemeDetails/';
        CommonUtility.RequestAjax('POST', url, data, Success, null, null, null);
    }
    //#endregion

    //#region Validation
    $('#schemeCategoryStatus').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("DROPDOWN", "schemeCategoryStatus");
    });
    $('#txtSchemeName').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtSchemeName");
    });

    $('#txtSchemeCriteria').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtSchemeCriteria");
    });

    $('#txtSchemeDetails').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtSchemeDetails");
    });


    //#endregion

    //#region clear PoliticalParty controls
    $('body').on('click', "#btnClear", function () {
        Clear();
    });

    function Clear() {
        $("#ddlSchemeCategory").val("0");
        $("#txtSchemeName").val("");
        $("#txtSchemeCriteria").summernote("reset");
        $("#txtSchemeDetails").summernote("reset");
        $("#ddlStatus").val("True");


        $("#errddlSchemeCategory").html("").hide();
        $("#errtxtSchemeName").html("").hide();
        $("#errtxtSchemeCriteria").html("").hide();
        $("#errtxtSchemeDetails").html("").hide();
    }
    //#endregion

    //#region delete Category
    $('body').on('click', "#deleteScheme", function () {
        var id = $(this).attr('data-value');
        CommonUtility.DeleteWarningMessagePopIp("Are you sure you want to delete scheme", id);
    });
    $('body').on('click', "#finaldelete", function () {
        var id = $(this).attr('data-myval')
        DeleteScheme(id);
    });
    function DeleteScheme(schemeId) {
        var SchemeId = CommonUtility.ScriptInjection(schemeId).replace(/</g, "").replace(/>/g, "");
        var Success = function (result) {
            if (result != "" || result.length > 0) {
                $("#modal-delete-danger").modal('hide');
                CommonUtility.SucessMessagePopUp("Scheme deleted successfully.");
                BindSchemeList();
                Clear();
            }
        }
        var data = {
            SchemeId: schemeId
        };
        var url = '/PudhariAdmin/Scheme/DeleteSchemeDetails/';
        CommonUtility.RequestAjax('POST', url, data, Success, null, null, null);
    }
    //#endregion

    //#region Edit Category
    $('body').on('click', "#editScheme", function () {
        var schemeId = $(this).attr('data-value');
        var BindSuccess = function (result) {
            if (result != "" || result.length >= 0) {
                $("#hdnSchemeId").val(result.SchemeId);
                $("#ddlSchemeCategory").val(result.CategoryName);
                $("#txtSchemeName").val(result.SchemeName);
                $("#txtSchemeCriteria").summernote('code', result.SchemeCriteria);
                $("#txtSchemeDetails").summernote('code', result.SchemeDetails);
                $("#ddlStatus").val(result.Status);
            }
        }
        var data = {
            SchemeId: schemeId
        };
        var url = '/PudhariAdmin/Scheme/GetSchemeDetailsById/';
        CommonUtility.RequestAjax('GET', url, data, BindSuccess, null, null, null);
    });
    //#endregion

    //#region Function return
    return {
        BindSchemeList: BindSchemeList,
        AddScheme: AddScheme,
        Clear: Clear,
        DeleteScheme: DeleteScheme
    }
    //#endregion

})();



