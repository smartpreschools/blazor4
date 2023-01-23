var Designation = (function () {

    //#region Ready Function Start Point
    $(document).ready(function () {
        BindCategoryDropdown();
        BindDesignationList();
    });
    //#endregion
    var optionSelect = "<option value='0' selected>Select value.. </option";
    //#region Bind Category List
    function BindCategoryDropdown() {
        var BindCategoryDropDown = function (result) {
            if (result != "" || result.length > 0) {
                $.map(result, function (opt) {
                    var option = $('<option>' + opt.DataName + '</option>');
                    option.attr('value', opt.DataId);
                    $("#ddlCategory").append(option);
                });
                $("#ddlCategory").prepend(optionSelect);
            }
        }
        var data = {
            dropName: "Category",
            inputText: "",
        };
        var url = '/ProductAdmin/Master/GetDropDownData/';
        CommonUtility.RequestAjax('GET', url, data, BindCategoryDropDown, null, null, null);
    }
    //#endregion

    //#region Bind Designation List
    function BindDesignationList() {
        var BindDesignationSuccess = function (result) {
            if (result != "" || result.length >= 0) {
                $('#designationlist').DataTable({
                    data: result,
                    "bFilter": true,
                    "bLengthChange": true,
                    "bDestroy": true,
                    "lengthMenu": [[5, 10, 25, -1], [5, 10, 25, "All"]],
                    columns: [
                        { data: 'Category' },
                        { data: 'DesignationName' },
                        { data: 'DesignationDesc' },
                        {
                            data: "Status",
                            render: function (data, type, row) {
                                if (data === "True") { return "Active" }
                                else return "InActive"
                            }
                        },
                        {
                            "data": "DesignationID",
                            "searchable": false,
                            "sortable": false,
                            "render": function (data, type, full, meta) {
                                return '<i class="fas fa-edit" id="editDesignation" data-value ="' + data + '"></i>|<i class="fas fa-trash-alt" id="deleteDesignation" data-value ="' + data + '" ></i>';
                            }
                        }
                    ]
                });
            }
        }

        var url = '/ProductAdmin/Master/GetDesignationList/';
        CommonUtility.RequestAjax('POST', url, "", BindDesignationSuccess, null, null, null);
    }
    //#endregion
    //#region Add New Designation
    $('body').on('click', "#btnSubmit", function () {
        var designationName = CommonUtility.ScriptInjection($("#txtDesignation").val()).replace(/</g, "").replace(/>/g, "");
        var designationDesc = CommonUtility.ScriptInjection($("#txtDesc").val()).replace(/</g, "").replace(/>/g, "");
        var designationStatus = $("#ddlDesignationStatus").val();
        var category = $("#ddlCategory").val();

        var designationstatus = CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtDesignation");
        var Catstatus = CommonValidation.MandetoryControlValueCheck("DROPDOWN", "ddlCategory");
        var designationID = CommonUtility.ScriptInjection($("#hdnDesignationID").val()).replace(/</g, "").replace(/>/g, "");
        if (Catstatus && designationstatus) {
            if (designationID != "")
                UpdateDesignation(category, designationID, designationName, designationDesc, designationStatus)
            else
                AddDesignation(category, designationName, designationDesc, designationStatus);
        }
    });

    function AddDesignation(category, designationName, designationDesc, designationStatus) {

        var DesignationSuccess = function (result) {
            if (result != "" || result.length > 0) {
                Clear();
                BindDesignationList();
                if (result === 1)
                    CommonUtility.SucessMessagePopUp("Designation saved successfully.");
                if (result === -1)
                    CommonUtility.SucessMessagePopUp("Designation already exists, could you try another name.");
            }
        }
        var data = {
            Category: category,
            DesignationName: designationName,
            DesignationDesc: designationDesc,
            Status: designationStatus
        };
        var url = '/ProductAdmin/Master/Designation/';
        CommonUtility.RequestAjax('POST', url, data, DesignationSuccess, null, null, null);
    }
    function UpdateDesignation(category, designationID, designationName, designationDesc, designationStatus) {

        var DesignationSuccess = function (result) {
            if (result != "" || result.length > 0) {
                Clear();
                BindDesignationList();
                CommonUtility.SucessMessagePopUp("Designation updated successfully.");
            }
        }
        var data = {
            DesignationID: designationID,
            Category: category,
            DesignationName: designationName,
            DesignationDesc: designationDesc,
            Status: designationStatus
        };
        var url = '/ProductAdmin/Master/UpdateDesignation/';
        CommonUtility.RequestAjax('POST', url, data, DesignationSuccess, null, null, null);
    }
    //#endregion

    //#region Validation
    $('#txtDesignation').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtDesignation");
    });
    //#region Validation
    $('#ddlCategory').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("DROPDOWN", "ddlCategory");
    });
    //#endregion
    //#endregion

    //#region clear category controls
    $('body').on('click', "#btnClear", function () {
        Clear();
    });

    function Clear() {
        $("#txtDesignation").val("");
        $("#txtDesc").val("");
        $("#ddlCategory").val("0");
        $("#hdnDesignationID").val("");
        $("#errtxtDesignation").html("").hide();
        $("#errddlCategory").html("").hide();
        
        
    }
    //#endregion

    //#region delete Category
    $('body').on('click', "#deleteDesignation", function () {
        var id = $(this).attr('data-value');
        CommonUtility.DeleteWarningMessagePopIp("Are you sure you want to delete Designation", id);
    });
    $('body').on('click', "#finaldelete", function () {
        var id = $(this).attr('data-myval')
        DeleteDesignation(id);
    });
    function DeleteDesignation(DesignationID) {
        var designationID = CommonUtility.ScriptInjection(DesignationID).replace(/</g, "").replace(/>/g, "");
        var DesignationSuccess = function (result) {
            if (result != "" || result.length > 0) {
                $("#modal-delete-danger").modal('hide');
                CommonUtility.SucessMessagePopUp("Designation Deleted successfully.");
                BindDesignationList();
                Clear();
            }
        }
        var data = {
            DesignationID: designationID
        };
        var url = '/ProductAdmin/Master/DeleteDesignation/';
        CommonUtility.RequestAjax('POST', url, data, DesignationSuccess, null, null, null);
    }
    //#endregion

    //#region Edit Category
    $('body').on('click', "#editDesignation", function () {
        var designationID = $(this).attr('data-value');
        var BindDesignationSuccess = function (result) {
            if (result != "" || result.length >= 0) {
                $("#ddlCategory").val(result.Category);
                $("#txtDesignation").val(result.DesignationName);
                $("#txtDesc").val(result.DesignationDesc);
                $("#ddlDesignationStatus").val(result.Status);
                $("#hdnDesignationID").val(result.DesignationID);
            }
        }
        var data = {
            DesignationID: designationID
        };
        var url = '/ProductAdmin/Master/GetDesignationByID/';
        CommonUtility.RequestAjax('GET', url, data, BindDesignationSuccess, null, null, null);
    });
    //#endregion
    //#region Function return
    return {
        BindDesignationList: BindDesignationList,
        AddDesignation: AddDesignation,
        Clear: Clear,
        DeleteData: DeleteData,
        DeleteDesignation: DeleteDesignation
    }
    //#endregion

})();
