var Customer = (function () {
    var data = "";
    var optionSelect = "<option value='0' selected>Select value.. </option";
    $(document).ready(function () {
        BindCustomerList();
    });
    //#region Bind Customer List
    function BindCustomerList() {
        var CustomerSuccess = function (result) {
            if (result != "" || result.length >= 0) {
                $('#customerlist').DataTable({
                    data: result,
                    "bFilter": true,
                    "bLengthChange": true,
                    "bDestroy": true,
                    "lengthMenu": [[5, 10, 25, -1], [5, 10, 25, "All"]],
                    columns: [
                        { data: 'FirstName' },
                        { data: 'Website' },
                        { data: 'Mobile' },
                        { data: 'Email' },
                        { data: 'Address' },
                        { data: 'CustomerID' },
                        { data: 'BusinessLead' },
                        {
                            data: "Status",
                            render: function (data, type, row) {
                                if (data === "True") { return "Active" }
                                else return "InActive"
                            }
                        },

                        {
                            "data": "ID",
                            "searchable": false,
                            "sortable": false,
                            "render": function (data, type, full, meta) {
                                return '<i class="fas fa-edit" id="editBusinessLead" data-value ="' + data + '"></i>|<i class="fas fa-trash-alt" id="deleteBusinessLead" data-value ="' + data + '" ></i>';
                            }
                        }
                    ]
                });
            }
        }

        var url = '/Register/GetCustomerList/';
        CommonUtility.RequestAjax('POST', url, "", CustomerSuccess, null, null, null);
    }
    //#endregion

    //#region Add/Update Business Lead
    $('body').on('click', "#btnSubmit", function () {
        var categoryID = CommonUtility.ScriptInjection($("#ddlCategory").val()).replace(/</g, "").replace(/>/g, "");
        var name = CommonUtility.ScriptInjection($("#txtName").val()).replace(/</g, "").replace(/>/g, "");
        var mobile = CommonUtility.ScriptInjection($("#txtMobileNumber").val()).replace(/</g, "").replace(/>/g, "");
        var email = CommonUtility.ScriptInjection($("#txtEmail").val()).replace(/</g, "").replace(/>/g, "");
        var address = CommonUtility.ScriptInjection($("#txtAddress").val()).replace(/</g, "").replace(/>/g, "");
        var websiteName = CommonUtility.ScriptInjection($("#txtWebsiteName").val()).replace(/</g, "").replace(/>/g, "");
        var userName = CommonUtility.ScriptInjection($("#txtUserName").val()).replace(/</g, "").replace(/>/g, "");
        var password = CommonUtility.ScriptInjection($("#txtPassword").val()).replace(/</g, "").replace(/>/g, "");
        var desc = CommonUtility.ScriptInjection($("#txtDesc").val()).replace(/</g, "").replace(/>/g, "");


        //validation check
        var categorytatus = CommonValidation.MandetoryControlValueCheck("DROPDOWN", "ddlCategory");
        var namestatus = CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtName");
        var mobileStatus = CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtMobileNumber");
        var userNameStatus = CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtUserName");
        var passwordStatus = CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtPassword");

        data = {
            CategoryID: categoryID,
            Name: name,
            MobileNumber: mobile,
            Email: email,
            Address: address,
            WebsiteName: websiteName,
            Description: desc,
            UserName: userName,
            Password: password,
        };

        if (categorytatus && namestatus && mobileStatus && userNameStatus && passwordStatus) {
            AddCustomer(data);
        }
    });

    function AddCustomer(data) {

        var AddCustomerSuccess = function (result) {
            if (result != "" || result.length > 0) {
                if (result === 2)
                    CommonUtility.SucessMessagePopUp("Thanks for registration Our Support team will be contact you shortly.");
                Clear();
            }
        }

        var url = '/Register/AddCustomer/';
        CommonUtility.RequestAjax('POST', url, data, AddCustomerSuccess, null, null, null);
    }

    //#endregion

    //#region Validation
    $('#txtName').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtName");
    });
    $('#txtMobileNumber').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtMobileNumber");
    });
    $('#txtUserName').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtUserName");
    });
    $('#txtPassword').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtPassword");
    });

    $('#ddlCategory').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("DROPDOWN", "ddlCategory");
    });


    //#endregion

    //#region clear Role controls
    $('body').on('click', "#btnClear", function () {
        Clear();
    });

    function Clear() {
        $("#txtName").val("");
        $("#txtMobileNumber").val("");
        $("#txtEmail").val("");
        $("#txtAddress").val("");
        $("#ddlCategory").val("0");
        $("#txtUserName").val("");
        $("#txtPassword").val("");
        $("#txtDesc").val("");

        $("#errtxtUserName").html("").hide();
        $("#errtxtPassword").html("").hide();
        $("#errtxtName").html("").hide();
        $("#errtxtMobileNumber").html("").hide();
        $("#errtxtEmail").html("").hide();
        $("#errddlCategory").html("").hide();


    }
    //#endregion


    //#region delete Customer
    $('body').on('click', "#deleteBusinessLead", function () {
        var id = $(this).attr('data-value');
        CommonUtility.DeleteWarningMessagePopIp("Are you sure you want to delete Customer", id);
    });
    $('body').on('click', "#finaldelete", function () {
        var id = $(this).attr('data-myval')
        DeleteCustomer(id);
    });
    function DeleteCustomer(ID) {
        var id = CommonUtility.ScriptInjection(ID).replace(/</g, "").replace(/>/g, "");
        var DeleteSuccess = function (result) {
            if (result != "" || result.length > 0) {
                $("#modal-delete-danger").modal('hide');
                CommonUtility.SucessMessagePopUp("Customer Deleted successfully.");
                BindCustomerList();
            }
        }
        var data = {
            CustomerID: id
        };
        var url = '/Register/DeleteCustomer/';
        CommonUtility.RequestAjax('POST', url, data, DeleteSuccess, null, null, null);
    }
    //#endregion

    //#region Edit Category
    $('body').on('click', "#editBusinessLead", function () {

    });
    //#endregion

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
        var url = '/ProductAdmin/Master/GetDropDownData/';
        if (isAsync)
            CommonUtility.RequestAjax('GET', url, data, BindDropDownData, null, null, null);
        else
            CommonUtility.RequestAjaxAsync('GET', url, data, BindDropDownData, null, null, null);

    }
    //#region Function return
    return {
        BindCustomerList: BindCustomerList,
        AddCustomer: AddCustomer,
        Clear: Clear,
        DeleteData: DeleteData,
        DeleteRole: DeleteRole,
        BindDropdown: BindDropdown
    }
    //#endregion

})();



